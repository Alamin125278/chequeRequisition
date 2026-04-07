<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header Section -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg"
            >
              <FileTextOutlined class="text-white text-xl" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Daily Production Report
              </h1>
              <p class="text-sm text-slate-500 mt-1">
                Manage and export production data
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Today</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ currentDate }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <!-- <div class="px-4 sm:px-6 lg:px-8 py-8"> -->
    <!-- Filter Section -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 my-8 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200"
      >
        <div class="flex items-center gap-2">
          <FilterOutlined class="text-emerald-600 text-lg" />
          <h2 class="text-lg font-semibold text-slate-900">Report Filters</h2>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Date Picker -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              <CalendarOutlined class="mr-2 text-emerald-600" />
              Select Date
            </label>
            <a-date-picker
              v-model:value="formState.date"
              class="w-full filter-input"
              format="YYYY-MM-DD"
              placeholder="Choose date"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 items-end">
            <a-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleFetchData"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 rounded-lg font-medium"
            >
              <ReloadOutlined class="mr-2" />
              <span class="hidden sm:inline">Check Data</span>
            </a-button>
            <a-button
              type="default"
              size="large"
              :loading="isDownloading"
              @click="handleDownloadExcel"
              class="flex-1 rounded-lg font-medium border-slate-300 hover:border-emerald-600 hover:text-emerald-600"
            >
              <DownloadOutlined class="mr-2" />
              <span class="hidden sm:inline">Export</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <TableOutlined class="text-emerald-600 text-lg" />
            <h2 class="text-lg font-semibold text-slate-900">
              Production Data
            </h2>
          </div>
          <span class="text-sm text-slate-600"
            >{{ tableData.length }} records</span
          >
        </div>
      </div>

      <div class="overflow-x-auto">
        <a-table
          v-if="tableData.length > 0"
          :columns="columns"
          :data-source="tableData"
          :loading="isLoading"
          :pagination="false"
          :bordered="false"
          size="middle"
          class="production-table"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'slNo'">
              <span class="font-semibold text-slate-900">{{ index + 1 }}</span>
            </template>
            <template v-else-if="column.key === 'bankName'">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span class="font-semibold text-slate-900">{{
                  record.bankName
                }}</span>
              </div>
            </template>
            <template
              v-else-if="
                [
                  'cd',
                  'sb',
                  'po',
                  'a4',
                  'mtdrFdr',
                  'totalLeaves',
                  'totalBooks',
                  'totalBranch',
                ].includes(column.key)
              "
            >
              <span class="text-right block font-medium text-slate-700">{{
                formatNumber(record[column.key])
              }}</span>
            </template>
          </template>

          <!-- Grand Total Row -->
          <template #footer>
            <tr
              class="bg-gradient-to-r from-emerald-50 to-emerald-50 border-t-2 border-emerald-200"
            >
              <td
                style="width: 70px"
                class="px-4 py-4 text-center font-bold text-slate-900"
              ></td>
              <td
                style="width: 140px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 100px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 100px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 100px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 100px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 100px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              ></td>
              <td
                style="width: 120px"
                class="px-4 py-4 text-right font-bold text-slate-900"
              >
                Grand Total
              </td>
              <td
                style="width: 130px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              >
                {{ formatNumber(grandTotals.totalLeaves) }}
              </td>
              <td
                style="width: 130px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              >
                {{ formatNumber(grandTotals.totalBooks) }}
              </td>
              <td
                style="width: 130px"
                class="px-4 py-4 text-right font-bold text-emerald-700"
              >
                {{ formatNumber(grandTotals.totalBranch) }}
              </td>
            </tr>
          </template>
        </a-table>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-16 px-4"
        >
          <div class="p-4 bg-slate-100 rounded-full mb-4">
            <FileTextOutlined class="text-4xl text-slate-400" />
          </div>
          <p class="text-slate-600 font-medium mb-2">No data available</p>
          <p class="text-slate-500 text-sm text-center max-w-sm">
            Select a date and click "Refresh" to load production data
          </p>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { getDailyProductionReportService } from "@/services/summary-report/summaryReportService";
import {
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  TableOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { computed, onMounted, reactive, ref } from "vue";

interface ProductionRecord {
  slNo: number;
  bankName: string;
  cd: number;
  sb: number;
  po: number;
  a4: number;
  mtdrFdr: number;
  totalLeaves: number;
  totalBooks: number;
  totalBranch: number;
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

const formState = reactive({
  date: dayjs(),
  bank: "",
  status: "",
});

const tableData = ref<ProductionRecord[]>([]);
const isLoading = ref(false);
const isDownloading = ref(false);

const columns = [
  {
    title: "Sl No.",
    dataIndex: "slNo",
    key: "slNo",
    width: 70,
    align: "center" as const,
  },
  { title: "Bank Name", dataIndex: "bankName", key: "bankName", width: 140 },
  {
    title: "CD",
    dataIndex: "cd",
    key: "cd",
    width: 100,
    align: "right" as const,
  },
  {
    title: "SB",
    dataIndex: "sb",
    key: "sb",
    width: 100,
    align: "right" as const,
  },
  {
    title: "PO",
    dataIndex: "po",
    key: "po",
    width: 100,
    align: "right" as const,
  },
  {
    title: "A4",
    dataIndex: "a4",
    key: "a4",
    width: 100,
    align: "right" as const,
  },
  {
    title: "MTDR/FDR",
    dataIndex: "mtdrFdr",
    key: "mtdrFdr",
    width: 120,
    align: "right" as const,
  },
  {
    title: "Total Leaves",
    dataIndex: "totalLeaves",
    key: "totalLeaves",
    width: 130,
    align: "right" as const,
  },
  {
    title: "Total Books",
    dataIndex: "totalBooks",
    key: "totalBooks",
    width: 130,
    align: "right" as const,
  },
  {
    title: "Total Branch",
    dataIndex: "totalBranch",
    key: "totalBranch",
    width: 130,
    align: "right" as const,
  },
];

const grandTotals = computed(() => {
  return {
    cd: tableData.value.reduce((sum, row) => sum + row.cd, 0),
    sb: tableData.value.reduce((sum, row) => sum + row.sb, 0),
    po: tableData.value.reduce((sum, row) => sum + row.po, 0),
    a4: tableData.value.reduce((sum, row) => sum + row.a4, 0),
    mtdrFdr: tableData.value.reduce((sum, row) => sum + row.mtdrFdr, 0),
    totalLeaves: tableData.value.reduce((sum, row) => sum + row.totalLeaves, 0),
    totalBooks: tableData.value.reduce((sum, row) => sum + row.totalBooks, 0),
    totalBranch: tableData.value.reduce((sum, row) => sum + row.totalBranch, 0),
  };
});

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

const handleFetchData = async () => {
  if (!formState.date) {
    message.warning("Please select a date first");
    return;
  }

  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const params = {
      date: formState.date.format("YYYY-MM-DD"),
    };
    const response = await getDailyProductionReportService(params);
    if (response.success == true) {
      tableData.value = response.data.dailyProductionReports;
    }
  } catch (error) {
    message.error("Failed to load data");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleDownloadExcel = async () => {
  if (!formState.date) {
    message.warning("Please select a date first");
    return;
  }

  if (tableData.value.length === 0) {
    message.warning("No data to export. Please refresh the data first.");
    return;
  }

  isDownloading.value = true;
  try {
    // Create workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Daily Production Report");
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

    // Heading: Title Name
    sheet.mergeCells("A3:I3");
    const titleCell = sheet.getCell("B3");
    titleCell.value = "Daily Production Report";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center" };

    // Heading: Date Range
    sheet.mergeCells("A4:I4");
    const dateCell = sheet.getCell("B4");
    dateCell.value = `Date: ${formState.date.format("D MMMM YYYY")}`;
    dateCell.font = { bold: true, size: 12 };
    dateCell.alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow([]);

    // Table Header
    const tableHeaders = [
      "Sl No",
      "Bank Name",
      "CD",
      "SB",
      "PO",
      "A4",
      "MTDR/FDR",
      "Total Leaves",
      "Total Books",
      "Total Branch",
      "Remark",
    ];

    const headerRow = sheet.addRow(tableHeaders);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFABE7B2" }, // bright red for testing
      };
    });

    // Data rows
    tableData.value.forEach((item, index) => {
      const row = sheet.addRow([
        index + 1,
        item.bankName,
        item.cd,
        item.sb,
        item.po,
        item.a4,
        item.mtdrFdr,
        item.totalLeaves,
        item.totalBooks,
        item.totalBranch,
        "",
      ]);

      row.eachCell((cell) => {
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
      "",
      "",
      "Grand Total",
      grandTotals.value.totalLeaves,
      grandTotals.value.totalBooks,
      grandTotals.value.totalBranch,
      "",
    ]);
    // Make all bold
    totalsRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    [8, 9, 10].forEach((colIndex) => {
      const cell = totalsRow.getCell(colIndex);
      cell.font = {
        bold: true,
        color: { argb: "FFFF0000" }, // Red text
      };
    });

    // Add spacing row after total
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    // Generate filename
    const filename = `Daily_Production_Report_${formState.date.format(
      "D MMMM YYYY"
    )}.xlsx`;

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
    message.success("Excel file downloaded successfully");
  } catch (error) {
    message.error("Failed to generate Excel file");
    console.error(error);
  } finally {
    isDownloading.value = false;
  }
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
onMounted(() => {
  formState.date = dayjs();
  handleFetchData();
});
</script>

<style scoped>
.filter-input :deep(.ant-picker) {
  width: 100%;
  border-radius: 8px;
  border-color: #e2e8f0;
  transition: all 0.3s;
}

.filter-input :deep(.ant-picker:hover) {
  border-color: #10b981;
}

.filter-input :deep(.ant-picker-focused) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
  border-color: #e2e8f0 !important;
  transition: all 0.3s;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: #10b981 !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

:deep(.ant-btn-primary) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.ant-btn-primary:hover) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.ant-table) {
  font-size: 0.875rem;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
  border-color: #e2e8f0;
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr > td) {
  border-color: #e2e8f0;
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0fdf4;
}

:deep(.production-table .ant-table-cell) {
  padding: 12px 16px;
}

:deep(.ant-empty-description) {
  color: #94a3b8;
}

@media (max-width: 768px) {
  :deep(.ant-table) {
    font-size: 0.75rem;
  }

  :deep(.ant-table-thead > tr > th),
  :deep(.ant-table-tbody > tr > td) {
    padding: 8px 12px;
  }
}
</style>
