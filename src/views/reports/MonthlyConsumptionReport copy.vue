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
                <span class="text-accent">Monthly Consumption</span> Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive Monthly Consumption Reports for item of
              books by date range and bank.
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
    <div class="mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FilterOutlined class="mr-2 text-accent" /> Report Filters
          </h2>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handleDownload">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  :disabled-date="disabledStartDate"
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
                  :disabled-date="disabledEndDate"
                />
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
                  :loading="banksLoading"
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
              <a-button @click="resetForm" size="large" class="rounded-md px-6">
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
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Report Information</h3>
            <p class="text-sm text-secondary">
              This report shows a monthly consumption report for item of books
              including book leaves and denomination breakdowns for the selected
              date range and bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getmonthlyConsumptionReportService } from "@/services/summary-report/summaryReportService";
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

interface Bank {
  id: number;
  bankName: string;
}

const banks = ref<Bank[]>([]);
const banksLoading = ref(false);

const featchBanks = async () => {
  banksLoading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
    message.error("Failed to load banks");
  } finally {
    banksLoading.value = false;
  }
};

interface ReportItem {
  homeBranch?: string;
  deliveryBranch: string;
  challanNo: string;
  challanDate: string;
  courierName: string;
  requestDate: string;
  isAgent: boolean;
  sba10Books: number;
  sba10Leaves: number;
  msa10Books: number;
  msa10Leaves: number;
  cd25Books: number;
  cd25Leaves: number;
  awcd25Books: number;
  awcd25Leaves: number;
  sna25Books: number;
  sna25Leaves: number;
  msna25Books: number;
  msna25Leaves: number;
  poa50Books: number;
  poa50Leaves: number;
  poi50Books: number;
  poi50Leaves: number;
  fdr50Books: number;
  fdr50Leaves: number;
  mtdr50Books: number;
  mtdr50Leaves: number;
  totalBooks: number;
  totalLeaves: number;
}

interface Totals {
  sba10Books: number;
  sba10Leaves: number;
  msa10Books: number;
  msa10Leaves: number;
  cd25Books: number;
  cd25Leaves: number;
  awcd25Books: number;
  awcd25Leaves: number;
  sna25Books: number;
  sna25Leaves: number;
  msna25Books: number;
  msna25Leaves: number;
  poa50Books: number;
  poa50Leaves: number;
  poi50Books: number;
  poi50Leaves: number;
  fdr50Books: number;
  fdr50Leaves: number;
  mtdr50Books: number;
  mtdr50Leaves: number;
  totalBooks: number;
  totalLeaves: number;
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const formState = reactive({
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
  bankId: null as number | null,
});

const disabledStartDate = (current: any) => {
  if (!formState.endDate) return false;
  return current && current > dayjs(formState.endDate);
};

const disabledEndDate = (current: any) => {
  if (!formState.startDate) return false;
  return current && current < dayjs(formState.startDate);
};

const isLoading = ref(false);
const reportData = ref<ReportItem[]>([]);

const totals = computed((): Totals => {
  const data = reportData.value;
  return {
    sba10Books: data.reduce((sum, item) => sum + item.sba10Books, 0),
    sba10Leaves: data.reduce((sum, item) => sum + item.sba10Leaves, 0),
    msa10Books: data.reduce((sum, item) => sum + item.msa10Books, 0),
    msa10Leaves: data.reduce((sum, item) => sum + item.msa10Leaves, 0),
    cd25Books: data.reduce((sum, item) => sum + item.cd25Books, 0),
    cd25Leaves: data.reduce((sum, item) => sum + item.cd25Leaves, 0),
    awcd25Books: data.reduce((sum, item) => sum + item.awcd25Books, 0),
    awcd25Leaves: data.reduce((sum, item) => sum + item.awcd25Leaves, 0),
    sna25Books: data.reduce((sum, item) => sum + item.sna25Books, 0),
    sna25Leaves: data.reduce((sum, item) => sum + item.sna25Leaves, 0),
    msna25Books: data.reduce((sum, item) => sum + item.msna25Books, 0),
    msna25Leaves: data.reduce((sum, item) => sum + item.msna25Leaves, 0),
    poa50Books: data.reduce((sum, item) => sum + item.poa50Books, 0),
    poa50Leaves: data.reduce((sum, item) => sum + item.poa50Leaves, 0),
    poi50Books: data.reduce((sum, item) => sum + item.poi50Books, 0),
    poi50Leaves: data.reduce((sum, item) => sum + item.poi50Leaves, 0),
    fdr50Books: data.reduce((sum, item) => sum + item.fdr50Books, 0),
    fdr50Leaves: data.reduce((sum, item) => sum + item.fdr50Leaves, 0),
    mtdr50Books: data.reduce((sum, item) => sum + item.mtdr50Books, 0),
    mtdr50Leaves: data.reduce((sum, item) => sum + item.mtdr50Leaves, 0),
    totalBooks: data.reduce((sum, item) => sum + item.totalBooks, 0),
    totalLeaves: data.reduce((sum, item) => sum + item.totalLeaves, 0),
  };
});

const handleDownload = async () => {
  if (!formState.startDate || !formState.endDate || !formState.bankId) {
    message.error("Please fill all required fields");
    return;
  }

  if (dayjs(formState.startDate).isAfter(dayjs(formState.endDate))) {
    message.error("Start date cannot be after end date");
    return;
  }

  isLoading.value = true;

  try {
    const dateObj = new Date(formState.startDate);
    const dateOb = new Date(formState.endDate);
    const stDate = dateObj.toISOString().split("T")[0];
    const enDate = dateOb.toISOString().split("T")[0];
    const params = {
      bankId: formState.bankId,
      startDate: stDate,
      endDate: enDate,
    };

    const response = await getmonthlyConsumptionReportService(params);
    if (response.success === true) {
      reportData.value = response.data.summaryReports;
      reportData.value.sort((a, b) => {
        const aDate = new Date(a.requestDate).getTime();
        const bDate = new Date(b.requestDate).getTime();
        return aDate - bDate;
      });
      await downloadExcel();
      message.success("Report downloaded successfully");
    } else {
      message.error("Failed to generate report");
    }
  } catch (error) {
    message.error("Failed to generate report");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  featchBanks();
});

const downloadExcel = async () => {
  try {
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
        dateRange = start.format("MMMM YYYY");
        dateRangeLabel = start.format("MMMM_YYYY");
      } else {
        dateRange = `${start.format("MMMM YYYY")} to ${end.format(
          "MMMM YYYY"
        )}`;
        dateRangeLabel = `${start.format("MMMM_YYYY")}_to_${end.format(
          "MMMM_YYYY"
        )}`;
      }
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Item Of Books");
    sheet.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    } as const;

    sheet.mergeCells("A2:T2");
    const headerCell = sheet.getCell("A2");
    headerCell.value = bankName;
    headerCell.font = { bold: true, size: 14 };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.mergeCells("A3:T3");
    const refCell = sheet.getCell("A3");
    refCell.value = "Work Order Ref: BGCB-GSD-TIO-2024/100";
    refCell.font = { bold: true, size: 11 };
    refCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.mergeCells("A4:T4");
    const dateCell = sheet.getCell("A4");
    dateCell.value = `Date: ${dateRange}`;
    dateCell.font = { bold: true, size: 11 };
    dateCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.addRow([]);

    sheet.mergeCells("A6:T6");
    const tableHeaderCell = sheet.getCell("A6");
    tableHeaderCell.value = "Item Of Books";
    tableHeaderCell.font = {
      bold: true,
      size: 12,
      color: { argb: "FFFFFFFF" },
    };
    tableHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "70AD47" },
    };
    tableHeaderCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.addRow([]);

    const columnHeaders = [
      "SL",
      "Date",
      "SBA-10",
      "MSA-10",
      "CD-25",
      "AWCD-25",
      "SNA-25",
      "MSNA-25",
      "POA-50",
      "POI-50",
      "FDR-50",
      "MTDR-50",
      "Total Books",
      "Total Leaves",
    ];

    const headerRow = sheet.addRow(columnHeaders);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, size: 10 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    reportData.value.forEach((item, index) => {
      const row = sheet.addRow([
        index + 1,
        dayjs(item.requestDate).format("DD-MMM-YY"),
        item.sba10Books,
        item.msa10Books,
        item.cd25Books,
        item.awcd25Books,
        item.sna25Books,
        item.msna25Books,
        item.poa50Books,
        item.poi50Books,
        item.fdr50Books,
        item.mtdr50Books,
        item.totalBooks,
        item.totalLeaves,
      ]);

      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9E8F5" },
        };
        cell.border = borderStyle;
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    const grandTotalRow = sheet.addRow([
      "Grand Total",
      "",
      totals.value.sba10Books,
      totals.value.msa10Books,
      totals.value.cd25Books,
      totals.value.awcd25Books,
      totals.value.sna25Books,
      totals.value.msna25Books,
      totals.value.poa50Books,
      totals.value.poi50Books,
      totals.value.fdr50Books,
      totals.value.mtdr50Books,
      totals.value.totalBooks,
      totals.value.totalLeaves,
    ]);

    grandTotalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70AD47" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    const totalLeavesRow = sheet.addRow([
      "Total Leaves",
      "",
      totals.value.sba10Leaves,
      totals.value.msa10Leaves,
      totals.value.cd25Leaves,
      totals.value.awcd25Leaves,
      totals.value.sna25Leaves,
      totals.value.msna25Leaves,
      totals.value.poa50Leaves,
      totals.value.poi50Leaves,
      totals.value.fdr50Leaves,
      totals.value.mtdr50Leaves,
      "",
      totals.value.totalLeaves,
    ]);

    totalLeavesRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    const columnWidths = [
      8, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    ];
    sheet.columns.forEach((col, index) => {
      col.width = columnWidths[index] || 12;
    });

    const filename = `Monthly_Report_${dateRangeLabel}_${bankName.replace(
      /\s+/g,
      "_"
    )}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    fallbackDownload(blob, filename);
  } catch (error) {
    message.error("Failed to download Excel file");
    console.error("Excel download error:", error);
  }
};

const fallbackDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
};

const resetForm = () => {
  formState.startDate = undefined;
  formState.endDate = undefined;
  formState.bankId = null;
  reportData.value = [];
  message.success("Form has been reset");
};
</script>

<style scoped>
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
