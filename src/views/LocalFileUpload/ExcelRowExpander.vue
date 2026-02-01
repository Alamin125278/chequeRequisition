<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-white border-b border-slate-200 shadow-sm">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 shadow-md"
              >
                <ExpandOutlined class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <h1
                  class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                  Excel Row <span class="text-emerald-600">Expander</span>
                </h1>
                <p class="mt-1 text-sm text-slate-600">
                  Quickly expand your spreadsheet data with automatic row
                  duplication
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 md:mt-0 md:ml-4">
            <a-tooltip title="Today's Date">
              <div
                class="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <CalendarOutlined class="mr-2 text-emerald-500 text-lg" />
                <span class="font-semibold text-slate-700">{{
                  currentDate
                }}</span>
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="py-8">
      <!-- Main Card -->
      <div
        class="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-slate-200"
      >
        <div
          class="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"
        >
          <h2 class="text-lg font-semibold text-slate-900 flex items-center">
            <FileExcelOutlined class="mr-3 text-emerald-500 text-xl" />
            {{
              expandedData.length > 0
                ? "Review Your Expanded Data"
                : "Upload Your Excel File"
            }}
          </h2>
          <p class="text-sm text-slate-600 mt-1 ml-9">
            {{
              expandedData.length > 0
                ? `Successfully expanded to ${expandedData.length} rows`
                : "Upload an Excel file to begin the expansion process"
            }}
          </p>
        </div>

        <div class="p-8">
          <!-- Upload Section -->
          <div v-if="expandedData.length === 0" class="space-y-6">
            <!-- Upload Dragger -->
            <a-upload-dragger
              :multiple="false"
              :file-list="fileList"
              accept=".xlsx,.xls,.csv"
              @change="handleFileChange"
              class="rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-colors"
            >
              <div class="py-16 text-center">
                <div
                  class="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50"
                >
                  <FileExcelOutlined class="text-4xl text-emerald-500" />
                </div>
                <p class="text-xl font-semibold text-slate-900 mb-2">
                  Click or drag your file here
                </p>
                <p class="text-sm text-slate-600">
                  Support for .xlsx, .xls, .csv files • Maximum size 10MB
                </p>
              </div>
            </a-upload-dragger>

            <!-- Error Message -->
            <div v-if="errorMessage">
              <a-alert
                :message="errorMessage"
                type="error"
                show-icon
                closable
                class="rounded-lg"
                @close="errorMessage = ''"
              />
            </div>

            <!-- Help Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div
                class="bg-emerald-50 p-6 rounded-xl border border-emerald-200"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <InfoCircleOutlined class="text-emerald-600 text-xl mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-slate-900 mb-2">
                      How It Works
                    </h4>
                    <p class="text-sm text-slate-700">
                      Upload an Excel file with "Leaves Quantity" and "Cheque
                      Serial" columns. The tool will expand each row by the
                      number specified in the Leaves Quantity column,
                      incrementing the Cheque Serial Number sequentially.
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <CheckCircleOutlined class="text-blue-600 text-xl mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-slate-900 mb-2">
                      Required Columns
                    </h4>
                    <ul class="text-sm text-slate-700 space-y-1">
                      <li class="flex items-center">
                        <span
                          class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"
                        ></span
                        >Leaves Quantity
                      </li>
                      <li class="flex items-center">
                        <span
                          class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"
                        ></span
                        >Cheque Serial
                      </li>
                      <li class="flex items-center">
                        <span
                          class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"
                        ></span
                        >Other columns (preserved)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Section -->
          <div v-else class="space-y-6">
            <!-- Success Banner -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100"
                >
                  <CheckCircleOutlined class="text-emerald-600 text-2xl" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-emerald-900">
                    Expansion Completed Successfully
                  </h3>
                  <p class="text-sm text-emerald-700 mt-1">
                    Your Excel file has been processed and is ready for download
                  </p>
                </div>
              </div>
            </div>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                class="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-600 mb-1">
                      Original Rows
                    </p>
                    <p class="text-3xl font-bold text-slate-900">
                      {{ originalRowCount }}
                    </p>
                  </div>
                  <div class="text-4xl text-slate-200">📋</div>
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-emerald-700 mb-1">
                      Total Leaves
                    </p>
                    <p class="text-3xl font-bold text-emerald-600">
                      {{ totalLeaves }}
                    </p>
                  </div>
                  <div class="text-4xl">🍃</div>
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-blue-700 mb-1">
                      Expanded Rows
                    </p>
                    <p class="text-3xl font-bold text-blue-600">
                      {{ expandedData.length }}
                    </p>
                  </div>
                  <div class="text-4xl">✨</div>
                </div>
              </div>
            </div>

            <!-- Data Table -->
            <div
              class="rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <div
                class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center"
              >
                <h3 class="font-semibold text-slate-900">
                  Expanded Data Preview
                </h3>
                <span class="text-sm text-slate-600"
                  >{{ expandedData.length }} total rows</span
                >
              </div>
              <a-table
                :columns="columns"
                :data-source="paginatedData"
                :pagination="pagination"
                :loading="false"
                size="small"
                :scroll="{ x: 1000 }"
                @change="handleTableChange"
                class="custom-table"
                rowKey="__key__"
              >
                <template #bodyCell="{ column, record, index }">
                  <span
                    v-if="column.key === '__index__'"
                    class="text-slate-500"
                  >
                    {{
                      (pagination.current - 1) * pagination.pageSize + index + 1
                    }}
                  </span>
                  <span
                    v-else-if="column.key === 'startingNumber'"
                    class="font-semibold text-emerald-600"
                  >
                    {{ record.startingNumber }}
                  </span>
                  <span v-else>{{ record[column.dataIndex] }}</span>
                </template>
              </a-table>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 flex-col sm:flex-row pt-4">
              <a-button
                type="primary"
                size="large"
                @click="downloadExcel"
                class="flex items-center justify-center font-semibold bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 rounded-lg"
              >
                <DownloadOutlined class="mr-2" />
                Download Expanded Excel
              </a-button>
              <a-button
                size="large"
                @click="resetData"
                class="flex items-center justify-center font-semibold rounded-lg border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-600"
              >
                <ReloadOutlined class="mr-2" />
                Upload Another File
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Footer -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <InfoCircleOutlined class="text-emerald-500 text-xl mt-0.5" />
          </div>
          <div class="ml-4">
            <h3 class="font-semibold text-slate-900 mb-1">
              Tips for Best Results
            </h3>
            <ul class="text-sm text-slate-600 space-y-1">
              <li>
                • Ensure your "Leaves Quantity" column contains numeric values
              </li>
              <li>
                • The "Cheque Serial" column will be automatically incremented
              </li>
              <li>
                • All other columns will be preserved in the expanded rows
              </li>
              <li>
                • The output file will be named with a timestamp for easy
                tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ExpandOutlined,
  FileExcelOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import type { TableColumnsType, UploadChangeParam } from "ant-design-vue";
import { computed, reactive, ref } from "vue";
import * as XLSX from "xlsx";

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  pageSizeOptions: string[];
}

// State
const fileList = ref<any[]>([]);
const expandedData = ref<any[]>([]);
const originalRowCount = ref(0);
const totalLeaves = ref(0);
const errorMessage = ref("");
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
const originalData = ref<any[]>([]);
const columnNames = ref<string[]>([]);

const pagination = reactive<PaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50", "100"],
});

// Computed
const paginatedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return expandedData.value.slice(start, end);
});

const columns = computed<TableColumnsType>(() => {
  if (expandedData.value.length === 0) return [];

  return columnNames.value.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    width: 150,
  }));
});

// Methods
const findColumnIndex = (headers: string[], columnName: string): number => {
  const normalized = columnName.toLowerCase().trim();
  return headers.findIndex((header) => {
    const headerNorm = header.toLowerCase().trim();
    return (
      headerNorm === normalized ||
      headerNorm.includes(normalized) ||
      normalized.includes(headerNorm.split(" ")[0])
    );
  });
};

const handleFileChange = (info: UploadChangeParam) => {
  const file = info.file.originFileObj;
  if (!file) {
    errorMessage.value = "No file selected";
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData =
          XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        if (jsonData.length === 0) {
          errorMessage.value = "Excel file is empty";
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const leavesIndex = findColumnIndex(headers, "Leaves Quantity");
        const startingNumberIndex = findColumnIndex(headers, "Cheque Serial");

        if (leavesIndex === -1 || startingNumberIndex === -1) {
          errorMessage.value =
            'Excel file must contain "Leaves Quantity" and "Cheque Serial" columns';
          return;
        }

        originalData.value = jsonData;
        columnNames.value = headers;
        originalRowCount.value = jsonData.length;
        errorMessage.value = "";

        // Expand rows
        expandRows(headers, leavesIndex, startingNumberIndex);
      } catch (err) {
        errorMessage.value =
          "Error reading Excel file: " + (err as Error).message;
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    errorMessage.value = "Error processing file: " + (err as Error).message;
  }
};

type RowData = Record<string, any>;

const DEFAULT_ROW: RowData = {
  "Bank Name": "Unknown",
  "Branch Name": "Unknown",
  "Account Name": "Unknown",
  "Customer Address": "Unknown",
  "Cheque Prefix": "0000",
  "MICR No": "0000000000000",
  "Cheque Serial": "0000000",
  "Leaves Quantity": 1,
  "Book Quantity": 1,
  "Routing No": "000000000",
  "Transaction Code": 10,
  "Account No": "0000000000000",
};

const expandRows = (
  headers: string[],
  leavesIndex: number,
  startingNumberIndex: number
) => {
  const expanded: RowData[] = [];
  let totalLeavesCount = 0;

  /* -------------------------------
     STEP 1: Expand rows by leaves
  --------------------------------*/
  originalData.value.forEach((row: RowData) => {
    const leaves = Number(row[headers[leavesIndex]]) || 0;
    const startSerial = Number(row["Cheque Serial"]) || 0;

    totalLeavesCount += leaves;

    for (let i = 0; i < leaves; i++) {
      expanded.push({
        ...row,
        "Cheque Serial": String(startSerial + i).padStart(7, "0"),
        "Leaves Quantity": 1,
      });
    }
  });

  /* -------------------------------
     STEP 2: Arrange data into 4 columns
  --------------------------------*/
  let paperUps = 5;
  if (expanded[0]["Bank Name"] === "Pubali Bank PLC.") {
    paperUps = 4;
  }
  const rowsPerColumn = Math.ceil(expanded.length / paperUps);
  const finalData: RowData[] = [];

  for (let rowIndex = 0; rowIndex < rowsPerColumn; rowIndex++) {
    for (let col = 0; col < paperUps; col++) {
      const index = rowIndex + col * rowsPerColumn;
      finalData.push(
        expanded[index] ?? {
          ...DEFAULT_ROW,
          "Bank Name": `${expanded[0]["Bank Name"]}`,
          "Transaction Code": expanded[0]["Transaction Code"],
        }
      );
    }
  }

  /* -------------------------------
     STEP 3: Update reactive values
  --------------------------------*/
  expandedData.value = finalData;
  totalLeaves.value = totalLeavesCount;

  pagination.total = expanded.length;
  pagination.current = 1;
};

const downloadExcel = () => {
  try {
    const dataToExport = expandedData.value.map((row) => {
      const { __key__, ...rest } = row;
      return rest;
    });
    const bankName = dataToExport[0]["Bank Name"];
    const todayDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expanded Data");
    XLSX.writeFile(wb, `${todayDate}_${bankName}_single_data.xlsx`);
  } catch (err) {
    errorMessage.value = "Error downloading file: " + (err as Error).message;
  }
};

const resetData = () => {
  fileList.value = [];
  expandedData.value = [];
  originalData.value = [];
  originalRowCount.value = 0;
  totalLeaves.value = 0;
  errorMessage.value = "";
  pagination.current = 1;
  pagination.total = 0;
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};
</script>

<style scoped>
:deep(.ant-dragger) {
  border-width: 2px;
  border-style: dashed;
  border-color: #cbd5e1; /* slate-300 */
  border-radius: 0.75rem; /* rounded-xl */
  background-color: #ffffff;
  transition: all 200ms ease;
}

:deep(.ant-dragger:hover) {
  border-color: #34d399; /* emerald-400 */
  background-color: #ecfdf5; /* emerald-50 */
}

:deep(.ant-dragger.ant-upload-drag-over) {
  border-color: #10b981; /* emerald-500 */
  background-color: #ecfdf5; /* emerald-50 */
}

:deep(.ant-table) {
  font-size: 0.875rem; /* text-sm */
}

:deep(.ant-btn-primary) {
  background-color: #059669; /* emerald-600 */
  border-color: #059669;
}

:deep(.ant-btn-primary:hover) {
  background-color: #047857; /* emerald-700 */
  border-color: #047857;
}

:deep(.ant-btn) {
  border-radius: 0.5rem; /* rounded-lg */
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f1f5f9; /* slate-100 */
  color: #0f172a; /* slate-900 */
  font-weight: 600;
}

:deep(.ant-table-row:hover > td) {
  background-color: #f8fafc; /* slate-50 */
}

:deep(.ant-alert) {
  border-radius: 0.5rem; /* rounded-lg */
}
</style>
