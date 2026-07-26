<template>
  <div class="bg-background min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Agent Summary</span> Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive Agent summary reports for cheque
              requisitions by date range and bank.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Current Date">
              <div
                class="bg-card border border-gray-200 rounded-md px-4 py-2 flex items-center"
              >
                <CalendarOutlined class="mr-2 text-accent" />
                {{ currentDate }}
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="mx-auto py-6">
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FilterOutlined class="mr-2 text-accent" /> Report Filters
          </h2>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handlePreview">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- Bank ID -->
              <a-form-item
                label="Bank"
                name="bankId"
                :rules="[{ required: true, message: 'Please select a bank' }]"
              >
                <a-select
                  v-model:value="formState.bankId"
                  placeholder="Select bank"
                  class="w-full"
                >
                  <a-select-option value="">Select Bank</a-select-option>
                  <a-select-option
                    v-for="bank in banks"
                    :key="bank.id"
                    :value="bank.id"
                  >
                    {{ bank.bankName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- Agent Type -->
              <a-form-item label="AgentType" name="agentType">
                <a-select
                  v-model:value="formState.agentType"
                  placeholder="Select Type"
                  class="w-full"
                >
                  <a-select-option :value="null">Select Type</a-select-option>
                  <a-select-option :value="true">Agent Type</a-select-option>
                  <a-select-option :value="false"
                    >Non-Agent Type</a-select-option
                  >
                </a-select>
              </a-form-item>
              <!-- Request Date -->
              <a-form-item
                label="Request Date"
                name="requestDate"
                :rules="[{ required: true, message: 'Please select a date' }]"
              >
                <a-date-picker
                  v-model:value="formState.requestDate"
                  format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
              <!-- Courier -->
              <a-form-item label="Courier" name="courier">
                <a-select
                  v-model:value="formState.courier"
                  placeholder="Select courier"
                  class="w-full"
                >
                  <a-select-option value="">Select Courier</a-select-option>
                  <a-select-option
                    v-for="courier in couriers"
                    :key="courier.courierCode"
                    :value="courier.courierCode"
                  >
                    {{ courier.courierName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-4 pt-6 border-t border-gray-100"
            >
              <a-button
                @click="resetForm"
                size="large"
                class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent flex items-center"
              >
                <ReloadOutlined class="mr-2" /> Reset
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :loading="isLoading"
                class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
              >
                <DownloadOutlined class="mr-2" /> Download Report
              </a-button>
            </div>
          </a-form>
        </div>
      </div>

      <!-- Help Card -->
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6 mb-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Report Information</h3>
            <p class="text-sm text-secondary">
              This report shows a summary of cheque requisitions including
              branch details, challan information, and denomination breakdowns
              for the selected date range and bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import signatureImage from "@/assets/signature.png";
import { getAgentSummaryReportService } from "@/services/summary-report/summaryReportService";
import {
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { computed, onMounted, reactive, ref } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";
import { getCouriersForDropDownService } from "@/services/courier/courier.service";
interface Bank {
  id: number;
  bankName: string;
}
interface Courier {
  id: number;
  courierName: string;
  courierCode: string;
}

const banks = ref<Bank[]>([]);
const couriers = ref<Courier[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  }
};
const featchCouriers = async () => {
  try {
    const result = await getCouriersForDropDownService();
    couriers.value = result;
  } catch (e) {
    console.error("Error fetching couriers", e);
  }
};

interface ReportItem {
  bankId: number;
  deliveryBranch: string;
  courierName: string;
  requestDate: string;
  challanNo: string;
  distId: string;
  msa10: number;
  msa20: number;
  awca20: number;
  awca50: number;
  awca100: number;
  po50: number;
  total: number;
}

interface Totals {
  msa10: number;
  msa20: number;
  awca20: number;
  awca50: number;
  awca100: number;
  po50: number;
  grandTotal: number;
}

// Current date for display
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Form state
const formState = reactive({
  bankId: null as number | null,
  requestDate: dayjs(),
  agentType: null as boolean | null,
  courier: null as string | null,
});

const isLoading = ref(false);
const isDownloading = ref(false);

// Report data
const reportData = ref<ReportItem[]>([]);

// Calculate totals
const totals = computed((): Totals => {
  const data = reportData.value;
  return {
    msa10: data.reduce((sum, item) => sum + item.msa10, 0),
    msa20: data.reduce((sum, item) => sum + item.msa20, 0),
    awca20: data.reduce((sum, item) => sum + item.awca20, 0),
    awca50: data.reduce((sum, item) => sum + item.awca50, 0),
    awca100: data.reduce((sum, item) => sum + item.awca100, 0),
    po50: data.reduce((sum, item) => sum + item.po50, 0),
    grandTotal: data.reduce((sum, item) => sum + item.total, 0),
  };
});

type ReportColumnKey =
  | "msa10"
  | "msa20"
  | "awca20"
  | "awca50"
  | "awca100"
  | "po50";
const conditionalHeaders: { key: ReportColumnKey; label: string }[] = [
  { key: "msa10", label: "MSA(10)" },
  { key: "msa20", label: "MSA(20)" },
  { key: "awca20", label: "AWCA(20)" },
  { key: "awca50", label: "AWCA(50)" },
  { key: "awca100", label: "AWCA(100)" },
  { key: "po50", label: "PO(50)" },
];

const activeColumns = computed(() => {
  return conditionalHeaders.filter((h) => totals.value[h.key] >= 0);
});

// Handle preview
const handlePreview = async () => {
  if (!formState.requestDate || !formState.bankId) {
    message.error("Please fill all required fields");
    return;
  }

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const requestDate = formState.requestDate.format("YYYY-MM-DD");
    const params = {
      bankId: formState.bankId,
      requestDate: requestDate,
      agentType: formState.agentType,
      courier: formState.courier,
    };
    // Generate mock data
    const response = await getAgentSummaryReportService(params);
    if (response.success == true) {
      // alert(response.success);
      // console.log(response.data);
      reportData.value = response.data.agentSummaryReports;
      reportData.value.sort((a, b) => {
        // First sort by deliveryBranch
        const branchCompare = a.deliveryBranch.localeCompare(b.deliveryBranch);
        if (branchCompare !== 0) {
          return branchCompare;
        }

        // Then sort by distId
        const [aPrefix, aSuffix] = a.distId.split("-").map(Number);
        const [bPrefix, bSuffix] = b.distId.split("-").map(Number);

        if (aPrefix !== bPrefix) {
          return aPrefix - bPrefix;
        }

        return aSuffix - bSuffix;
      });
      if (reportData.value.length === 0) {
        message.warning("No data found for the selected options");
        return;
      } else {
        downloadExcel();
        message.success("Report generated successfully");
      }
    } else {
      message.error("Failed to generate report");
    }
  } catch (error) {
    message.error("Failed to generate report");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  featchBanks();
  featchCouriers();
});
// Download Excel
const downloadExcel = async () => {
  isDownloading.value = true;
  try {
    const signatureImageBase64 = await toBase64(signatureImage);
    // Get selected bank name
    const selectedBank = banks.value.find(
      (bank) => bank.id === formState.bankId,
    );
    const selectedCourier = couriers.value.find(
      (courier) => courier.courierCode === formState.courier,
    );
    const bankName = selectedBank?.bankName || "Unknown Bank";
    let requestDate = formState.requestDate.format("DD-MM-YYYY");

    // Create workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Token Receipt");
    sheet.pageSetup = {
      paperSize: 9, // 9 = A4 size in ExcelJS
      orientation: "portrait", // or "landscape"
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0, // Let it flow vertically
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    // Styles
    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    } as const;

    const headerStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: "center" },
    };

    const cellStyle = {
      border: borderStyle,
      alignment: { horizontal: "center", vertical: "middle" },
    };
    if (formState.courier != null) {
      // Heading: Bank Name
      sheet.mergeCells("A2:L2");
      const bankCell = sheet.getCell("B2");
      bankCell.value = `${bankName} Courier Summary Report`;
      bankCell.font = { bold: true, size: 18 };
      bankCell.alignment = { horizontal: "center" };
    } else {
      // Heading: Bank Name
      sheet.mergeCells("A2:L2");
      const bankCell = sheet.getCell("B2");
      bankCell.value = `${bankName} ${formState.agentType === true ? "Agent" : ""} Token Receipt`;
      bankCell.font = { bold: true, size: 18 };
      bankCell.alignment = { horizontal: "center" };
    }

    // Heading: Work Order Ref
    // sheet.mergeCells("A4:F4");
    // const workOrderRefCell = sheet.getCell("B4");
    // workOrderRefCell.value =
    //   selectedBank?.bankName === "IBBL"
    //     ? "Work Order Ref: IBBPLC/HO/CSD/PSSD/2025/1659"
    //     : "";
    // workOrderRefCell.font = { bold: true, size: 16 };
    // workOrderRefCell.alignment = { horizontal: "center" };
    // Heading: Date Range
    sheet.mergeCells("A4:L4");
    const dateCell = sheet.getCell("F4");
    dateCell.value = `Requestiton Date: ${requestDate}`;
    dateCell.font = { bold: true, size: 16 };
    dateCell.alignment = { horizontal: "center" };

    sheet.addRow([]);
    if (formState.courier != null) {
      // Heading: Report Type
      sheet.mergeCells("A5:L5");
      const reportTypeCell = sheet.getCell("B5");
      reportTypeCell.value = `Through Courier Name: ${selectedCourier?.courierName}`;
      reportTypeCell.font = { bold: true, size: 16 };
      reportTypeCell.alignment = { horizontal: "center" };
    }
    sheet.addRow([]);
    // const hasBranchInfo =
    //   bankId === 2 || bankId === 4 || bankId === 6 || bankId === 8;

    // Table Header
    const tableHeaders = [
      "Sl No",
      "Courier Name",
      "Delivery Branch",
      "Requestion Date",
      "Dist ID",
      ...conditionalHeaders
        .filter((h) => totals.value[h.key] >= 0)
        .map((h) => h.label),
      "Total",
    ];
    // const activeColumns = conditionalHeaders.filter(
    //   (h) => totals.value[h.key] > 0
    // );

    const headerRow = sheet.addRow(tableHeaders);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 13 };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Data rows
    reportData.value.forEach((item, index) => {
      const distId = item.distId.trim();
      const row = sheet.addRow([
        index + 1,
        item.courierName,
        item.deliveryBranch,
        dayjs(item.requestDate).format("DD-MM-YYYY"),
        `${distId == "" ? "" : "(" + distId + ")"}`,
        ...activeColumns.value.map((h) => item[h.key]),
        item.total,
      ]);
      row.eachCell((cell) => {
        cell.font = { bold: false, size: 12 };
        cell.border = borderStyle;
        cell.alignment = { horizontal: "left", vertical: "middle" };
      });
    });

    // Totals row
    const totalsRow = sheet.addRow([
      "",
      "",
      "",
      "",
      "Grand Total",
      ...activeColumns.value.map((h) => totals.value[h.key]), // ✅ dynamically get totals
      totals.value.grandTotal,
    ]);

    // A:E merge
    sheet.mergeCells(`A${totalsRow.number}:E${totalsRow.number}`);

    // Merged cell-এর value সেট করুন
    totalsRow.getCell(1).value = "Grand Total";

    // Center align
    totalsRow.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // চাইলে bold করুন
    totalsRow.getCell(1).font = {
      bold: true,
      size: 13,
    };

    totalsRow.eachCell((cell) => {
      cell.font = { bold: true, size: 13 };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add spacing row after total
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    // Underline row first (will appear above the text visually)
    const underlineRow = sheet.addRow([]);
    const sigCol = 3; // B column
    underlineRow.getCell(sigCol).border = {
      bottom: { style: "thin" }, // creates the line
    };

    // Now the "Authorized Signature" text
    const sigRow = sheet.addRow([]);
    sigRow.getCell(sigCol).value = "Authorized Signature";
    sigRow.getCell(sigCol).font = { bold: true };
    sigRow.getCell(sigCol).alignment = { horizontal: "left" };

    const signatureImageId = workbook.addImage({
      base64: signatureImageBase64,
      extension: "png",
    });

    sheet.addImage(signatureImageId, {
      tl: { col: 2, row: sigRow.number - 4 }, // Slightly above the text row
      ext: { width: 150, height: 50 },
    });

    // Set column widths
    const columnWidths = [8, 20, 15, 15, 10, 10, 10, 10, 10, 10, 10, 10, 12];
    sheet.columns.forEach((col, index) => {
      col.width = columnWidths[index];
    });
    sheet.eachRow((row) => {
      row.height = 25;
    });
    const formattedBankName = bankName.trim().replace(/\s+/g, "_");
    let courierName = selectedCourier?.courierName;
    const agentType =
      formState.agentType === undefined || formState.agentType === null
        ? "Master"
        : formState.agentType
          ? "Agent"
          : "Normal";
    // Generate filename
    // const filename = `${dateRangeLabel}_Courier_Summary_Report_${bankName.replace(
    //   /\s+/g,
    //   "_",
    // )}_${courierName}_${formState.severity===1?"Urgent_":""}${formState.agentType ? "Agent" : ""}.xlsx`;
    let filename = "";
    if (formState.courier != null) {
      filename =
        [
          requestDate, // Date Range
          "Courier_Summary_Report", // Report Type
          formattedBankName, // Bank Name
          courierName,
        ]
          .filter(Boolean) // Remove empty/null values
          .join("_") + ".xlsx";
    } else {
      filename =
        [
          requestDate, // Date Range
          "Token_Receipt", // Report Type
          formattedBankName, // Bank Name
          agentType, // Agent Type (if applicable)
        ]
          .filter(Boolean) // Remove empty/null values
          .join("_") + ".xlsx";
    }
    // Create blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Check if browser supports File System Access API (Chrome/Edge)
    if ("showSaveFilePicker" in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: "Excel files",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        message.success("Excel file saved successfully");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          fallbackDownload(blob, filename);
        }
      }
    } else {
      fallbackDownload(blob, filename);
    }
  } catch (error) {
    message.error("Failed to download Excel file");
    console.error("Excel download error:", error);
  } finally {
    isDownloading.value = false;
  }
};
// To Base 64 function
const toBase64 = async (filePath: string) => {
  return fetch(filePath)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );
};

// Fallback download function
const fallbackDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Force download attribute and trigger click
  link.setAttribute("download", filename);
  link.style.display = "none";

  // Add to DOM, click, and remove
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);

  message.success("Excel file download initiated");
};

// Reset form
const resetForm = () => {
  formState.requestDate = dayjs();
  formState.bankId = null;
  reportData.value = [];
  message.success("Form has been reset");
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-input-affix-wrapper),
:deep(.ant-textarea) {
  border-radius: var(--radius-md) !important;
  transition: all 0.3s;
  border-color: #e2e8f0;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border-radius: 0 !important;
}

:deep(.ant-btn) {
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

:deep(.ant-btn-primary) {
  background-color: #6b8e23;
  border-color: #6b8e23;
}

:deep(.ant-btn-primary:hover) {
  background-color: #5a7a1f;
  border-color: #5a7a1f;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-textarea-focused) {
  border-color: #6b8e23 !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-textarea:hover) {
  border-color: #6b8e23 !important;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

:deep(.ant-modal-content) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: #374151;
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: #6b7280;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-select-item) {
  padding: 8px 12px;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.05);
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.1);
  font-weight: 500;
}

/* Table styling */
.preview-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}

/* Custom CSS variables for consistent theming */
:root {
  --radius-md: 6px;
  --radius-lg: 8px;
  --accent-cta: #6b8e23;
  --accent-dark: #5a7a1f;
  --text-primary: #374151;
  --text-secondary: #6b7280;
  --card-bg: #ffffff;
  --background: #f9fafb;
}
</style>
