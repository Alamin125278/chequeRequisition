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
                <span class="text-accent">Summary</span> Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive summary reports for cheque requisitions by
              date range and bank.
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
              <!-- Start Date -->
              <a-form-item
                label="Start Date"
                name="startDate"
                :rules="[
                  { required: true, message: 'Please select start date' },
                ]"
              >
                <a-date-picker
                  v-model:value="formState.startDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select start date"
                />
              </a-form-item>

              <!-- End Date -->
              <a-form-item
                label="End Date"
                name="endDate"
                :rules="[{ required: true, message: 'Please select end date' }]"
              >
                <a-date-picker
                  v-model:value="formState.endDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select end date"
                />
              </a-form-item>

              <!-- Severity -->
              <a-form-item
                label="Severity"
                name="severity"
                :rules="[{ required: true, message: 'Please select severity' }]"
              >
                <a-select
                  v-model:value="formState.severity"
                  placeholder="Select severity"
                  class="w-full"
                >
                  <a-select-option value="">Select Severity</a-select-option>
                  <a-select-option value="1">Urgent</a-select-option>
                  <a-select-option value="2">Normal</a-select-option>
                </a-select>
              </a-form-item>

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
                <EyeOutlined class="mr-2" /> Preview Report
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

    <!-- Preview Modal -->
    <a-modal
      v-model:visible="previewModalVisible"
      :footer="null"
      style="top: 20px"
      title="Summary Report Preview"
      width="1200px"
      class="preview-modal"
      :maskClosable="false"
    >
      <div class="space-y-6 py-2">
        <!-- Report Header -->
        <div class="bg-background p-5 rounded-md border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-primary flex items-center">
              <FileTextOutlined class="mr-2 text-accent" /> Report Summary
            </h3>
            <div class="text-sm text-secondary">
              {{ dayjs(formState.startDate)?.format("YYYY-MM-DD") }} to
              {{ dayjs(formState.endDate)?.format("YYYY-MM-DD") }}
            </div>
          </div>

          <!-- Summary Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Sl No
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Home Branch
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Delivery Branch
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Challan No
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Challan Date
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    SB(10)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    SB(20)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    SB(50)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    CD(10)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    CD(25)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    CD(50)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    CD(100)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    PO(100)
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in reportData"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ index + 1 }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.homeBranch }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.deliveryBranch }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.challanNo }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.challanDate }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.sb10 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.sb20 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.sb50 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.cd10 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.cd25 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.cd50 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.cd100 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item.po100 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-medium"
                  >
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-100 font-medium">
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm"
                    colspan="4"
                  ></td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm font-bold"
                  >
                    Grand Total
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.sb10 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.sb20 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.sb50 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.cd10 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.cd25 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.cd50 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.cd100 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.po100 }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.grandTotal }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div
          class="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-200"
        >
          <a-button
            @click="previewModalVisible = false"
            size="large"
            class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent"
          >
            Close
          </a-button>
          <a-button
            type="primary"
            @click="downloadExcel"
            :loading="isDownloading"
            size="large"
            class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
          >
            <DownloadOutlined v-if="!isDownloading" class="mr-2" />
            {{ isDownloading ? "Generating..." : "Download Excel" }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import signatureImage from "@/assets/signature.png";
import { getSummaryReportService } from "@/services/summary-report/summaryReportService";
import {
  CalendarOutlined,
  DownloadOutlined,
  EyeOutlined,
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

interface Bank {
  id: number;
  bankName: string;
}

const banks = ref<Bank[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  }
};

interface ReportItem {
  homeBranch: string;
  deliveryBranch: string;
  challanNo: string;
  challanDate: string;
  sb10: number;
  sb20: number;
  sb50: number;
  cd10: number;
  cd25: number;
  cd50: number;
  cd100: number;
  po100: number;
  total: number;
}

interface Totals {
  sb10: number;
  sb20: number;
  sb50: number;
  cd10: number;
  cd25: number;
  cd50: number;
  cd100: number;
  po100: number;
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
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
  bankId: null as number | null,
  severity: null as number | null,
});

// Modal and loading states
const previewModalVisible = ref(false);
const isLoading = ref(false);
const isDownloading = ref(false);

// Report data
const reportData = ref<ReportItem[]>([]);

// Calculate totals
const totals = computed((): Totals => {
  const data = reportData.value;
  return {
    sb10: data.reduce((sum, item) => sum + item.sb10, 0),
    sb20: data.reduce((sum, item) => sum + item.sb20, 0),
    sb50: data.reduce((sum, item) => sum + item.sb50, 0),
    cd10: data.reduce((sum, item) => sum + item.cd10, 0),
    cd25: data.reduce((sum, item) => sum + item.cd25, 0),
    cd50: data.reduce((sum, item) => sum + item.cd50, 0),
    cd100: data.reduce((sum, item) => sum + item.cd100, 0),
    po100: data.reduce((sum, item) => sum + item.po100, 0),
    grandTotal: data.reduce((sum, item) => sum + item.total, 0),
  };
});

// Handle preview
const handlePreview = async () => {
  if (
    !formState.startDate ||
    !formState.endDate ||
    !formState.bankId ||
    !formState.severity
  ) {
    message.error("Please fill all required fields");
    return;
  }

  if (dayjs(formState.startDate).isAfter(dayjs(formState.endDate))) {
    message.error("Start date cannot be after end date");
    return;
  }

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const dateObj = new Date(formState.startDate);
    const dateOb = new Date(formState.endDate);
    const stDate = dateObj.toISOString().split("T")[0];
    const enDate = dateOb.toISOString().split("T")[0];
    const params = {
      bankId: formState.bankId,
      startDate: stDate,
      endDate: enDate,
      severity: formState.severity,
    };
    // Generate mock data
    const response = await getSummaryReportService(params);
    if (response.success == true) {
      // alert(response.success);
      // console.log(response.data);
      reportData.value = response.data.summaryReports;
      message.success("Report generated successfully");
    } else {
      message.error("Failed to generate report");
    }
    // reportData.value = generateMockData();

    previewModalVisible.value = true;
  } catch (error) {
    message.error("Failed to generate report");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  featchBanks();
});
// Download Excel
const downloadExcel = async () => {
  isDownloading.value = true;
  try {
    const signatureImageBase64 = await toBase64(signatureImage);
    // Get selected bank name
    const selectedBank = banks.value.find(
      (bank) => bank.id === formState.bankId
    );
    const bankName = selectedBank?.bankName || "Unknown Bank";

    const start = dayjs(formState.startDate);
    const end = dayjs(formState.endDate);

    let dateRange = "";
    let dateRangeLabel = "";

    if (start && end) {
      const sameDay = start.isSame(end, "day");

      if (sameDay) {
        dateRange = start.format("D MMMM YYYY"); // 13 July 2025
        dateRangeLabel = start.format("D MMMM YYYY");
      } else {
        dateRange = `${start.format("D MMMM YYYY")} to ${end.format(
          "D MMMM YYYY"
        )}`;
        dateRangeLabel = `${start.format("D MMMM YYYY")}_to_${end.format(
          "D MMMM YYYY"
        )}`;
      }
    }

    // Create workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Summary Report");
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

    // Heading: Bank Name
    sheet.mergeCells("E3:I3");
    const bankCell = sheet.getCell("E3");
    bankCell.value = `${bankName} Summary Report`;
    bankCell.font = { bold: true, size: 16 };
    bankCell.alignment = { horizontal: "center" };

    // Heading: Date Range
    sheet.mergeCells("E4:I4");
    const dateCell = sheet.getCell("E4");
    dateCell.value = dateRange;
    dateCell.font = { bold: true, size: 12 };
    dateCell.alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow([]);

    // Table Header
    const tableHeaders = [
      "Sl No",
      "Home Branch",
      "Delivery Branch",
      "Challan No",
      "Challan Date",
      "SB(10)",
      "SB(20)",
      "SB(50)",
      "CD(10)",
      "CD(25)",
      "CD(50)",
      "CD(100)",
      "PO(100)",
      "Total",
    ];

    const headerRow = sheet.addRow(tableHeaders);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Data rows
    reportData.value.forEach((item, index) => {
      const row = sheet.addRow([
        index + 1,
        item.homeBranch,
        item.deliveryBranch,
        item.challanNo,
        item.challanDate,
        item.sb10,
        item.sb20,
        item.sb50,
        item.cd10,
        item.cd25,
        item.cd50,
        item.cd100,
        item.po100,
        item.total,
      ]);

      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // Totals row
    const totalsRow = sheet.addRow([
      "",
      "",
      "",
      "",
      "Grand Total",
      totals.value.sb10,
      totals.value.sb20,
      totals.value.sb50,
      totals.value.cd10,
      totals.value.cd25,
      totals.value.cd50,
      totals.value.cd100,
      totals.value.po100,
      totals.value.grandTotal,
    ]);

    totalsRow.eachCell((cell) => {
      cell.font = { bold: true };
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
    const sigCol = 2; // B column
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
      tl: { col: 1, row: sigRow.number - 4 }, // Slightly above the text row
      ext: { width: 150, height: 50 },
    });

    // Set column widths
    const columnWidths = [
      8, 20, 20, 15, 15, 10, 10, 10, 10, 10, 10, 10, 10, 12,
    ];
    sheet.columns.forEach((col, index) => {
      col.width = columnWidths[index];
    });

    // Generate filename
    const filename = `Summary_Report_${bankName.replace(
      /\s+/g,
      "_"
    )}_${dateRangeLabel}.xlsx`;

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
        })
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
  formState.startDate = undefined;
  formState.endDate = undefined;
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
