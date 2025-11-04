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
                <span class="text-accent">Consumption</span> Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive Consumption Reports for item of books by
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
    <div class="py-6">
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
              This report shows a consumption report for item of books including
              book leaves and denomination breakdowns for the selected date
              range and bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConsumptionReportService } from "@/services/summary-report/summaryReportService";
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
  requestDate: string;
  sb10Books: number;
  sb10Leaves: number;
  sb20Books: number;
  sb20Leaves: number;
  sb25Books: number;
  sb25Leaves: number;
  sba10Books: number;
  sba10Leaves: number;
  msd10Books: number;
  msd10Leaves: number;
  cd10Books: number;
  cd10Leaves: number;
  cd25Books: number;
  cd25Leaves: number;
  cd50Books: number;
  cd50Leaves: number;
  cd100Books: number;
  cd100Leaves: number;
  cc50Books: number;
  cc50Leaves: number;
  cc100Books: number;
  cc100Leaves: number;
  cda25Books: number;
  cda25Leaves: number;
  awcd25Books: number;
  awcd25Leaves: number;
  sna25Books: number;
  sna25Leaves: number;
  msnd25Books: number;
  msnd25Leaves: number;
  po50Books: number;
  po50Leaves: number;
  po100Books: number;
  po100Leaves: number;
  poa50Books: number;
  poa50Leaves: number;
  poi50Books: number;
  poi50Leaves: number;
  fdr50Books: number;
  fdr50Leaves: number;
  fdr100Books: number;
  fdr100Leaves: number;
  mtdr25Books: number;
  mtdr25Leaves: number;
  mtdr50Books: number;
  mtdr50Leaves: number;
  totalBooks: number;
  totalLeaves: number;

  [key: string]: string | number;
}

interface Totals {
  sb10Books: number;
  sb10Leaves: number;
  sb20Books: number;
  sb20Leaves: number;
  sb25Books: number;
  sb25Leaves: number;
  sba10Books: number;
  sba10Leaves: number;
  msd10Books: number;
  msd10Leaves: number;
  cd10Books: number;
  cd10Leaves: number;
  cd25Books: number;
  cd25Leaves: number;
  cd50Books: number;
  cd50Leaves: number;
  cd100Books: number;
  cd100Leaves: number;
  cc50Books: number;
  cc50Leaves: number;
  cc100Books: number;
  cc100Leaves: number;
  cda25Books: number;
  cda25Leaves: number;
  awcd25Books: number;
  awcd25Leaves: number;
  sna25Books: number;
  sna25Leaves: number;
  msnd25Books: number;
  msnd25Leaves: number;
  po50Books: number;
  po50Leaves: number;
  po100Books: number;
  po100Leaves: number;
  poa50Books: number;
  poa50Leaves: number;
  poi50Books: number;
  poi50Leaves: number;
  fdr50Books: number;
  fdr50Leaves: number;
  fdr100Books: number;
  fdr100Leaves: number;
  mtdr25Books: number;
  mtdr25Leaves: number;
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
  startDate: dayjs().startOf("month"), // বর্তমান মাসের প্রথম দিন
  endDate: dayjs(),
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
    sb10Books: data.reduce((sum, item) => sum + item.sb10Books, 0),
    sb10Leaves: data.reduce((sum, item) => sum + item.sb10Leaves, 0),
    sb20Books: data.reduce((sum, item) => sum + item.sb20Books, 0),
    sb20Leaves: data.reduce((sum, item) => sum + item.sb20Leaves, 0),
    sb25Books: data.reduce((sum, item) => sum + item.sb25Books, 0),
    sb25Leaves: data.reduce((sum, item) => sum + item.sb25Leaves, 0),
    sba10Books: data.reduce((sum, item) => sum + item.sba10Books, 0),
    sba10Leaves: data.reduce((sum, item) => sum + item.sba10Leaves, 0),
    msd10Books: data.reduce((sum, item) => sum + item.msd10Books, 0),
    msd10Leaves: data.reduce((sum, item) => sum + item.msd10Leaves, 0),
    cd10Books: data.reduce((sum, item) => sum + item.cd10Books, 0),
    cd10Leaves: data.reduce((sum, item) => sum + item.cd10Leaves, 0),
    cd25Books: data.reduce((sum, item) => sum + item.cd25Books, 0),
    cd25Leaves: data.reduce((sum, item) => sum + item.cd25Leaves, 0),
    cd50Books: data.reduce((sum, item) => sum + item.cd50Books, 0),
    cd50Leaves: data.reduce((sum, item) => sum + item.cd50Leaves, 0),
    cd100Books: data.reduce((sum, item) => sum + item.cd100Books, 0),
    cd100Leaves: data.reduce((sum, item) => sum + item.cd100Leaves, 0),
    cc50Books: data.reduce((sum, item) => sum + item.cc50Books, 0),
    cc50Leaves: data.reduce((sum, item) => sum + item.cc50Leaves, 0),
    cc100Books: data.reduce((sum, item) => sum + item.cc100Books, 0),
    cc100Leaves: data.reduce((sum, item) => sum + item.cc100Leaves, 0),
    cda25Books: data.reduce((sum, item) => sum + item.cda25Books, 0),
    cda25Leaves: data.reduce((sum, item) => sum + item.cda25Leaves, 0),
    awcd25Books: data.reduce((sum, item) => sum + item.awcd25Books, 0),
    awcd25Leaves: data.reduce((sum, item) => sum + item.awcd25Leaves, 0),
    sna25Books: data.reduce((sum, item) => sum + item.sna25Books, 0),
    sna25Leaves: data.reduce((sum, item) => sum + item.sna25Leaves, 0),
    msnd25Books: data.reduce((sum, item) => sum + item.msnd25Books, 0),
    msnd25Leaves: data.reduce((sum, item) => sum + item.msnd25Leaves, 0),
    po50Books: data.reduce((sum, item) => sum + item.po50Books, 0),
    po50Leaves: data.reduce((sum, item) => sum + item.po50Leaves, 0),
    po100Books: data.reduce((sum, item) => sum + item.po100Books, 0),
    po100Leaves: data.reduce((sum, item) => sum + item.po100Leaves, 0),
    poa50Books: data.reduce((sum, item) => sum + item.poa50Books, 0),
    poa50Leaves: data.reduce((sum, item) => sum + item.poa50Leaves, 0),
    poi50Books: data.reduce((sum, item) => sum + item.poi50Books, 0),
    poi50Leaves: data.reduce((sum, item) => sum + item.poi50Leaves, 0),
    fdr50Books: data.reduce((sum, item) => sum + item.fdr50Books, 0),
    fdr50Leaves: data.reduce((sum, item) => sum + item.fdr50Leaves, 0),
    fdr100Books: data.reduce((sum, item) => sum + item.fdr100Books, 0),
    fdr100Leaves: data.reduce((sum, item) => sum + item.fdr100Leaves, 0),
    mtdr25Books: data.reduce((sum, item) => sum + item.mtdr25Books, 0),
    mtdr25Leaves: data.reduce((sum, item) => sum + item.mtdr25Leaves, 0),
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
    const stDate = formState.startDate.format("YYYY-MM-DD");
    const enDate = formState.endDate.format("YYYY-MM-DD");

    // reportData.value = generateMockReportData(stDate, enDate);

    // reportData.value.sort((a, b) => {
    //   const aDate = new Date(a.requestDate).getTime();
    //   const bDate = new Date(b.requestDate).getTime();
    //   return aDate - bDate;
    // });
    const params = {
      bankId: formState.bankId,
      startDate: stDate,
      endDate: enDate,
    };
    const response = await getConsumptionReportService(params);
    if (response.success == true) {
      reportData.value = response.data.consumptionReports;
      reportData.value.sort((a, b) => {
        const aDate = new Date(a.requestDate).getTime();
        const bDate = new Date(b.requestDate).getTime();
        return aDate - bDate;
      });
      if (response.data.consumptionReports.length === 0) {
        message.warning("No data found for the selected date range");
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
      const sameMonth = start.isSame(end, "month");

      if (sameMonth) {
        // একই মাসের মধ্যে হলে, তারিখসহ দেখাবে
        dateRange = `${start.format("MMMM D")}–${end.format("D, YYYY")}`;
        dateRangeLabel = `${start.format("MMMM_D")}_to_${end.format("D_YYYY")}`;
      } else {
        // ভিন্ন মাস হলে, শুধু মাস-সাল রেঞ্জ দেখাবে
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

    // Page setup
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

    // // Header Section
    // sheet.mergeCells("A1:T1");
    // sheet.getCell("A1").value = bankName;
    // sheet.getCell("A1").font = { bold: true, size: 16 };
    // sheet.getCell("A1").alignment = {
    //   horizontal: "center",
    //   vertical: "middle",
    // };

    // sheet.mergeCells("A2:T2");
    // sheet.getCell("A2").value = "Work Order Ref: BGCB-GSD-TIO-2024/100";
    // sheet.getCell("A2").font = { bold: true, size: 12 };
    // sheet.getCell("A2").alignment = {
    //   horizontal: "center",
    //   vertical: "middle",
    // };

    // sheet.mergeCells("A3:T3");
    // sheet.getCell("A3").value = `Date: ${dateRange}`;
    // sheet.getCell("A3").font = { bold: true, size: 12 };
    // sheet.getCell("A3").alignment = {
    //   horizontal: "center",
    //   vertical: "middle",
    // };

    // // Main Title
    // sheet.mergeCells("A4:T4");
    // sheet.getCell("A4").value = "Item Of Books";
    // sheet.getCell("A4").font = {
    //   bold: true,
    //   size: 14,
    //   color: { argb: "FFFFFF" },
    // };
    // sheet.getCell("A4").fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "70AD47" },
    // };
    // sheet.getCell("A4").alignment = {
    //   horizontal: "center",
    //   vertical: "middle",
    // };
    // sheet.getCell("A4").border = borderStyle;

    // Bank-specific header configuration
    const bankHeaderConfig = {
      "Bengal Commercial Bank PLC.": {
        mainHeaders: [
          "SL",
          "Date",
          "SBA-10",
          "MSD-10",
          "CDA-25",
          "AWCD-25",
          "SNA-25",
          "MSND-25",
          "POA-50",
          "POI-50",
          "FDR-50",
          "MTDR-50",
          "Total Books",
          "Total Leaves",
        ],
        dataKeys: [
          "sba10",
          "msd10",
          "cda25",
          "awcd25",
          "sna25",
          "msnd25",
          "poa50",
          "poi50",
          "fdr50",
          "mtdr50",
        ],
      },
      "Pubali Bank PLC.": {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "SB-25",
          "CD-25",
          "CD-50",
          "CD-100",
          "CC-50",
          "CC-100",
          "PO-100",
          "FDR-100",
          "MTDR-25",
          "Total Books",
          "Total Leaves",
        ],
        dataKeys: [
          "sb10",
          "sb25",
          "cd25",
          "cd50",
          "cd100",
          "cc50",
          "cc100",
          "po100",
          "fdr100",
          "mtdr25",
        ],
      },
      "Midland Bank PLC": {
        mainHeaders: [
          "SL",
          "Date",
          "SB-20",
          "CD-10",
          "CD-25",
          "CD-50",
          "Total Books",
          "Total Leaves",
        ],
        dataKeys: ["sb20", "cd10", "cd25", "cd50"],
      },
      "Modhumoti Bank PLC.": {
        mainHeaders: ["SL", "Date", "PO-100", "Total Books", "Total Leaves"],
        dataKeys: ["po100"],
      },
      "Shahjalal Islami Bank PLC": {
        mainHeaders: ["SL", "Date", "PO-100", "Total Books", "Total Leaves"],
        dataKeys: ["po100"],
      },
      // Default configuration for other banks
      default: {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "SB-25",
          "CD-25",
          "Total Books",
          "Total Leaves",
        ],
        dataKeys: ["sb10", "sb25", "cd25"],
      },
    };
    const config =
      bankHeaderConfig[bankName as keyof typeof bankHeaderConfig] ||
      bankHeaderConfig.default;
    const mainHeaders = config.mainHeaders;
    const dataKeys = config.dataKeys;

    // Create header structure
    let currentCol = 1;

    // SL No column (A5 - merged vertically)
    sheet.mergeCells(`A5:A6`);
    sheet.getCell("A5").value = "SL";
    sheet.getCell("A5").font = { bold: true };
    sheet.getCell("A5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A5").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    sheet.getCell("A5").border = borderStyle;

    // Date column (B5 - merged vertically)
    sheet.mergeCells(`B5:B6`);
    sheet.getCell("B5").value = "Date";
    sheet.getCell("B5").font = { bold: true };
    sheet.getCell("B5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("B5").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    sheet.getCell("B5").border = borderStyle;

    currentCol = 3; // Start from column C

    // Dynamic book type columns
    dataKeys.forEach((key, index) => {
      const colLetter = String.fromCharCode(64 + currentCol); // A=65, B=66, etc.

      // Merge main header for this book type
      sheet.mergeCells(
        `${colLetter}5:${String.fromCharCode(64 + currentCol + 1)}5`
      );
      const mainHeaderCell = sheet.getCell(`${colLetter}5`);
      mainHeaderCell.value = mainHeaders[index + 2]; // +2 because SL and Date are first two
      mainHeaderCell.font = { bold: true };
      mainHeaderCell.alignment = { horizontal: "center", vertical: "middle" };
      mainHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      mainHeaderCell.border = borderStyle;

      // Books sub-header
      const booksCell = sheet.getCell(`${colLetter}6`);
      booksCell.value = "Books";
      booksCell.font = { bold: true };
      booksCell.alignment = { horizontal: "center", vertical: "middle" };
      booksCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E8F5" },
      };
      booksCell.border = borderStyle;

      // Leaves sub-header
      const leavesCell = sheet.getCell(
        `${String.fromCharCode(64 + currentCol + 1)}6`
      );
      leavesCell.value = "Leaves";
      leavesCell.font = { bold: true };
      leavesCell.alignment = { horizontal: "center", vertical: "middle" };
      leavesCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E8F5" },
      };
      leavesCell.border = borderStyle;

      currentCol += 2;
    });

    // Total Books column
    const totalBooksCol = String.fromCharCode(64 + currentCol);
    sheet.mergeCells(`${totalBooksCol}5:${totalBooksCol}6`);
    sheet.getCell(`${totalBooksCol}5`).value = "Total Books";
    sheet.getCell(`${totalBooksCol}5`).font = { bold: true };
    sheet.getCell(`${totalBooksCol}5`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell(`${totalBooksCol}5`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    sheet.getCell(`${totalBooksCol}5`).border = borderStyle;

    // Total Leaves column
    const totalLeavesCol = String.fromCharCode(64 + currentCol + 1);
    sheet.mergeCells(`${totalLeavesCol}5:${totalLeavesCol}6`);
    sheet.getCell(`${totalLeavesCol}5`).value = "Total Leaves";
    sheet.getCell(`${totalLeavesCol}5`).font = { bold: true };
    sheet.getCell(`${totalLeavesCol}5`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell(`${totalLeavesCol}5`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    sheet.getCell(`${totalLeavesCol}5`).border = borderStyle;
    let totalPositivePayCol = totalLeavesCol;

    if (selectedBank?.bankName === "Midland Bank PLC") {
      totalPositivePayCol = String.fromCharCode(64 + currentCol + 2);
      sheet.mergeCells(`${totalPositivePayCol}5:${totalPositivePayCol}6`);
      sheet.getCell(`${totalPositivePayCol}5`).value = "Total Positive Pay";
      sheet.getCell(`${totalPositivePayCol}5`).font = { bold: true };
      sheet.getCell(`${totalPositivePayCol}5`).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheet.getCell(`${totalPositivePayCol}5`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      sheet.getCell(`${totalPositivePayCol}5`).border = borderStyle;
    }
    // Data rows
    let rowIndex = 7;
    reportData.value.forEach((item, index) => {
      const rowData: any[] = [
        index + 1,
        dayjs(item.requestDate).format("DD-MMM-YY"),
      ];

      // Add book type data (Books and Leaves for each type)
      dataKeys.forEach((key) => {
        rowData.push(item[`${key}Books` as keyof ReportItem] || 0);
        rowData.push(item[`${key}Leaves` as keyof ReportItem] || 0);
      });

      // Add totals
      rowData.push(item.totalBooks);
      rowData.push(item.totalLeaves);
      if (selectedBank?.bankName === "Midland Bank PLC") {
        rowData.push(item.totalBooks * 10);
      }

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.numFmt = "0";
      });
      rowIndex++;
    });

    // Grand total row - FIXED: Use array instead of addCell
    const grandTotalData: any[] = ["", "Grand Total"];

    // Add grand totals for each book type
    dataKeys.forEach((key) => {
      grandTotalData.push(
        totals.value[`${key}Books` as keyof typeof totals.value] || 0
      );
      grandTotalData.push(
        totals.value[`${key}Leaves` as keyof typeof totals.value] || 0
      );
    });

    // Add grand totals
    grandTotalData.push(totals.value.totalBooks);
    grandTotalData.push(totals.value.totalLeaves);
    if (selectedBank?.bankName === "Midland Bank PLC") {
      grandTotalData.push(totals.value.totalBooks * 10);
    }

    const grandTotalRow = sheet.addRow(grandTotalData);

    grandTotalRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70AD47" },
      };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.numFmt = "0";
    });

    // Header Section
    const titleCol = totalPositivePayCol;
    sheet.mergeCells(`A1:${titleCol}1`);
    sheet.getCell("A1").value = bankName;
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    sheet.mergeCells(`A2:${titleCol}2`);
    sheet.getCell("A2").value = "Work Order Ref: BGCB-GSD-TIO-2024/100";
    sheet.getCell("A2").font = { bold: true, size: 12 };
    sheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    sheet.mergeCells(`A3:${titleCol}3`);
    sheet.getCell("A3").value = `Date: ${dateRange}`;
    sheet.getCell("A3").font = { bold: true, size: 12 };
    sheet.getCell("A3").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Main Title

    sheet.mergeCells(`A4:${titleCol}4`);
    sheet.getCell("A4").value = "Item Of Books";
    sheet.getCell("A4").font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFF" },
    };
    sheet.getCell("A4").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "70AD47" },
    };
    sheet.getCell("A4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A4").border = borderStyle;

    // Set column widths
    const columns = sheet.columns;
    columns.forEach((col, index) => {
      col.width = 12;
    });

    // Adjust specific column widths
    sheet.getColumn(1).width = 8; // SL No
    sheet.getColumn(2).width = 12; // Date

    const filename = `Consumption_Report_${dateRangeLabel}_${bankName.replace(
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
  formState.startDate = dayjs().startOf("month"); // বর্তমান মাসের প্রথম দিন
  formState.endDate = dayjs();
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
