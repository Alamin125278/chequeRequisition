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
                <UploadOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Upload</span> Cheque Requisition
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Upload and process bulk cheque requisitions using CSV or Excel
              files.
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

    <!-- Main Content Area -->
    <div class="mx-auto py-6">
      <!-- Main Card -->
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FileTextOutlined class="mr-2 text-accent" />
            {{
              showImportedData ? "Review Imported Data" : "Upload Cheque File"
            }}
          </h2>
        </div>

        <div class="p-6">
          <!-- Pre-Upload View -->
          <div v-if="!showImportedData">
            <!-- Bank Selection -->
            <div
              class="mb-6 bg-background p-5 rounded-md border border-gray-200"
            >
              <div class="flex flex-col md:flex-row gap-4">
                <!-- Bank Section -->
                <div class="w-full md:w-1/2">
                  <!-- Header -->
                  <div class="flex items-center mb-2">
                    <BankOutlined class="text-accent mr-2 text-lg" />
                    <h3 class="text-md font-medium text-primary">
                      Select Bank
                    </h3>
                  </div>
                  <!-- Select -->
                  <a-select
                    v-model:value="selectedBank"
                    placeholder="Select Bank"
                    class="w-full rounded-md"
                    size="large"
                    @change="handleBankChange"
                    allowClear
                  >
                    <a-select-option value="">All Banks</a-select-option>
                    <a-select-option
                      v-for="option in banks"
                      :key="option.id"
                      :value="option.id"
                    >
                      {{ option.bankName }}
                    </a-select-option>
                  </a-select>
                </div>
                <!-- Type Section -->
                <div class="w-full md:w-1/2">
                  <!-- Header -->
                  <div class="flex items-center mb-2">
                    <BankOutlined class="text-accent mr-2 text-lg" />
                    <h3 class="text-md font-medium text-primary">
                      Select Type
                    </h3>
                  </div>
                  <!-- Select -->
                  <a-select
                    v-model:value="selectedType"
                    placeholder="Select Type"
                    class="w-full rounded-md"
                    size="large"
                  >
                    <a-select-option :value="true">Agent Type</a-select-option>
                    <a-select-option :value="false"
                      >Non-Agent Type</a-select-option
                    >
                  </a-select>
                </div>
                <!-- Severity Section -->
                <div class="w-full md:w-1/2">
                  <!-- Header -->
                  <div class="flex items-center mb-2">
                    <BankOutlined class="text-accent mr-2 text-lg" />
                    <h3 class="text-md font-medium text-primary">
                      Select Severity
                    </h3>
                  </div>
                  <!-- Select -->
                  <a-select
                    v-model:value="selectedSeverity"
                    placeholder="Select Severity"
                    class="w-full rounded-md"
                    size="large"
                  >
                    <a-select-option :value="2">Normal</a-select-option>
                    <a-select-option :value="1">Urgent</a-select-option>
                  </a-select>
                </div>
              </div>
            </div>

            <!-- File Upload Section -->
            <div v-if="!file" class="space-y-6">
              <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :multiple="false"
                :before-upload="beforeUpload"
                @change="handleChange"
                accept=".csv,.xls,.xlsx"
                class="p-2 border-2 border-dashed border-gray-200 hover:border-accent bg-white rounded-md transition-all duration-300"
                :disabled="!selectedBank"
              >
                <div class="py-8">
                  <p class="ant-upload-drag-icon">
                    <InboxOutlined class="text-accent text-4xl" />
                  </p>
                  <p
                    class="ant-upload-text font-medium text-primary text-lg mt-4"
                  >
                    Click or drag file to upload
                  </p>
                  <p class="ant-upload-hint text-secondary mt-2">
                    Support for a single upload. Only CSV, XLS, or XLSX files.
                  </p>
                  <p v-if="!selectedBank" class="text-warning mt-3">
                    Please select a bank first
                  </p>
                </div>
              </a-upload-dragger>

              <!-- Help Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div
                  class="bg-accent-light p-5 rounded-md border border-accent-lighter"
                >
                  <div class="flex items-start">
                    <InfoCircleOutlined class="text-accent mt-1 mr-3 text-lg" />
                    <div>
                      <h4 class="font-medium text-primary mb-2">
                        Instructions
                      </h4>
                      <p class="text-secondary text-sm">
                        Upload a CSV or Excel file containing cheque data. The
                        file should include all required columns listed on the
                        right.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-background p-5 rounded-md border border-gray-200"
                >
                  <h4 class="font-medium text-primary mb-3 flex items-center">
                    <CheckCircleOutlined class="text-accent mr-2" />
                    Required Columns
                  </h4>
                  <div
                    class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-secondary"
                  >
                    <div
                      v-for="column in requiredColumns"
                      :key="column"
                      class="flex items-center"
                    >
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-accent mr-2"
                      ></div>
                      {{ column }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Selected View -->
            <div v-else class="space-y-6">
              <div class="bg-background p-5 rounded-md border border-gray-200">
                <div class="flex items-center">
                  <div class="bg-accent-light p-3 rounded-md mr-4">
                    <FileTextOutlined class="text-accent text-xl" />
                  </div>
                  <div>
                    <h4 class="font-medium text-primary">{{ file.name }}</h4>
                    <p class="text-sm text-secondary">
                      {{ formatFileSize(file.size) }} •
                      {{ file.type || "Unknown type" }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <a-button
                  @click="resetFile"
                  size="large"
                  class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent"
                >
                  Cancel
                </a-button>
                <a-button
                  type="primary"
                  @click="processFile"
                  :loading="isProcessing"
                  size="large"
                  class="rounded-md px-6 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center"
                >
                  <EyeOutlined v-if="!isProcessing" class="mr-2" />
                  {{ isProcessing ? "Processing..." : "Preview Data" }}
                </a-button>
              </div>
            </div>
          </div>

          <!-- Post-Upload View (Data Table) -->
          <div v-else class="space-y-6">
            <!-- Summary Card -->
            <div
              class="bg-success-light p-5 rounded-md border border-success-lighter mb-6"
            >
              <div class="flex items-center">
                <div
                  class="bg-white p-3 rounded-md mr-4 border border-success-lighter"
                >
                  <CheckCircleOutlined class="text-success text-xl" />
                </div>
                <div>
                  <h4 class="font-medium text-primary">
                    File Processed Successfully
                  </h4>
                  <p class="text-sm text-secondary">
                    {{ importedData.length }} items have been imported and are
                    ready for review.
                  </p>
                </div>
              </div>
            </div>

            <!-- Bank Information -->
            <div
              class="mb-6 bg-background p-5 rounded-md border border-gray-200"
            >
              <div class="flex items-center mb-4">
                <BankOutlined class="text-accent mr-2 text-lg" />
                <h3 class="text-md font-medium text-primary">Selected Bank</h3>
              </div>
              <div
                class="bg-card p-3 rounded-md inline-block border border-gray-200"
              >
                <p class="font-medium text-primary">
                  {{ selectedBankName }}
                </p>
              </div>
            </div>

            <!-- Data Table with improved design -->
            <div class="border border-gray-200 rounded-md overflow-hidden">
              <div
                class="bg-background px-6 py-3 border-b border-gray-200 flex justify-between items-center"
              >
                <h3 class="font-medium text-primary">Imported Items</h3>
                <div class="text-sm text-secondary">
                  Total:
                  <span class="font-medium text-primary">{{
                    importedData.length
                  }}</span>
                  items
                </div>
              </div>
              <a-table
                :columns="columns"
                :data-source="importedData"
                :scroll="{ x: 1000, y: 400 }"
                :pagination="pagination"
                @change="handlePagination"
                bordered
                size="middle"
                class="custom-table"
                rowKey="key"
              >
                <template #bodyCell="{ column, index }">
                  <template v-if="column.key === 'slno'">
                    {{ index + 1 }}
                  </template>
                </template>
              </a-table>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-6">
              <a-button
                @click="handleDiscard"
                size="large"
                class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent flex items-center"
                :disabled="isSubmitting"
              >
                <CloseOutlined class="mr-2" />
                Discard
              </a-button>
              <a-button
                type="primary"
                @click="handleSubmit"
                :loading="isSubmitting"
                size="large"
                class="rounded-md px-6 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center"
              >
                <CheckOutlined v-if="!isSubmitting" class="mr-2" />
                {{ isSubmitting ? "Submitting..." : "Submit" }}
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Card -->
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6 mb-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Need Help?</h3>
            <p class="text-sm text-secondary">
              If you're having trouble with the import process, please contact
              support at
              <a
                href="mailto:support@example.com"
                class="text-accent hover:text-accent-dark font-medium"
                >support@example.com</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <a-modal
      v-model:visible="showSuccessModal"
      :footer="null"
      :closable="false"
      width="450px"
      class="custom-modal"
    >
      <div class="text-center py-8 px-4">
        <div
          class="mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-success-light border-4 border-success-lighter"
        >
          <CheckOutlined class="text-success text-4xl" />
        </div>
        <h3 class="text-2xl font-bold text-primary mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-secondary mb-8 max-w-sm mx-auto">
          {{ successDescription }}
        </p>
        <a-button
          type="primary"
          @click="handleSuccessModalClose"
          size="large"
          class="w-full rounded-md py-3 h-auto bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark text-base font-medium shadow-md"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  fetchManageSerialService,
  updateManageSerialService,
} from "@/services/manageSerial/manageSerial.service";
import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons-vue";
import { message, Upload } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import { getBankForBranchService } from "../../services/bank/bank.service";
import { saveBranchService } from "../../services/branch/branch.service";
import {
  checkFileExistService,
  getBranchId,
  localFileImportLogService,
  saveBulkLocalFileUploadService,
  type LocalFileUploadCommand,
} from "../../services/localFileUpload/localFileUpload.service";
interface Bank {
  id: number;
  bankName: string;
}

// Define interfaces
interface ImportedItem {
  key: string;
  bankName: string;
  bankId: number;
  branchName: string;
  routingNo: string;
  accountNo: string;
  accountName: string;
  chequePrefix: string;
  chequeType: string;
  micrNo: string;
  series: string;
  transactionCode: string;
  leafCount: string;
  startNo: string;
  endNo: string;
  bookQty: string;
  receivingBranch: string;
  distributionPointName: string;
  courierCode?: string;
  agentNum?: string;
  serverity?: string;
  requestDate?: string;
  homeBranchCode?: string;
  deliveryBranchCode?: string;
  isAgent: string;
  accFlag: string;
}

// Current date for display
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Required columns for the file
const requiredColumns = [
  "Branch Name",
  "Routing No.",
  "Account No.",
  "Account Name",
  "Prefix",
  "Series",
  "TR Code",
  "No. of Leaves",
  "Starting No.",
  "Ending No.",
  "No. of Book",
  "Receiving Branch",
];

// Table columns
const columns = [
  {
    title: "sl no",
    key: "slno",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    width: 150,
  },
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
    width: 150,
  },
  {
    title: "Routing No.",
    dataIndex: "routingNo",
    key: "routingNo",
    width: 150,
  },
  {
    title: "Account No.",
    dataIndex: "accountNo",
    key: "accountNo",
    width: 150,
  },
  {
    title: "Account Name",
    dataIndex: "accountName",
    key: "accountName",
    width: 150,
  },
  {
    title: "Prefix",
    dataIndex: "chequePrefix",
    key: "chequePrefix",
    width: 120,
  },
  {
    title: "Series",
    dataIndex: "series",
    key: "series",
    width: 120,
  },
  {
    title: "TR Code",
    dataIndex: "transactionCode",
    key: "transactionCode",
    width: 120,
  },
  {
    title: "No. of Leaves",
    dataIndex: "leafCount",
    key: "leafCount",
    width: 120,
  },
  {
    title: "Starting No.",
    dataIndex: "startNo",
    key: "startNo",
    width: 120,
  },
  {
    title: "Ending No.",
    dataIndex: "endNo",
    key: "endNo",
    width: 120,
  },
  {
    title: "MICR NO",
    dataIndex: "micrNo",
    key: "micrNo",
    width: 120,
  },
  {
    title: "Account Type",
    dataIndex: "chequeType",
    key: "chequeType",
    width: 100,
  },
  {
    title: "No. of Book",
    dataIndex: "bookQty",
    key: "bookQty",
    width: 120,
  },
  {
    title: "Courier Code",
    dataIndex: "courierCode",
    key: "courierCode",
    width: 120,
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 150,
  },
  {
    title: "Severity",
    dataIndex: "serverity",
    key: "severity",
    width: 100,
  },
  {
    title: "Distribution Point Name",
    dataIndex: "distributionPointName",
    key: "distributionPointName",
    width: 150,
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    width: 150,
  },
  // {
  //   title: "Delivery Branch Code",
  //   dataIndex: "deliveryBranchCode",
  //   key: "deliveryBranchCode",
  //   width: 150,
  // },
  {
    title: "Is Agent",
    dataIndex: "isAgent",
    key: "isAgent",
    width: 150,
  },
];

const pagination = ref({
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["10", "100", "200", "500"],
  showTotal: (total: number) => `Total ${total} items`,
});

// const handlePagination = (page: number, pageSize: number) => {
//   pagination.value.current = page;
//   pagination.value.pageSize = pageSize;
// };
const handlePagination = (paginationInfo: any) => {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
};
// State variables
const selectedBank = ref<number | null>(null);
const selectedType = ref<boolean>(false);
const selectedSeverity = ref<number>(2);
const selectedBankName = ref("");
const file = ref<File | null>(null);
const fileList = ref<any[]>([]);
const isProcessing = ref(false);
const isSubmitting = ref(false);
const importedData = ref<ImportedItem[]>([]);
const showImportedData = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref("");
const successDescription = ref("");
const loading = ref(true);
const fileName = ref("");

const banks = ref<Bank[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  loading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  } finally {
    loading.value = false;
  }
};

const handleBankChange = () => {
  const bankId = selectedBank.value;
  const bank = banks.value.find((b) => b.id === bankId);
  if (bank != null) {
    selectedBankName.value = bank.bankName;
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// File upload handlers
const beforeUpload = async (file: File) => {
  const isCSVOrExcel =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".xls") ||
    file.name.endsWith(".xlsx");

  if (!isCSVOrExcel) {
    message.error("You can only upload CSV or Excel files!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("File must be smaller than 2MB!");
  }
  fileName.value = file.name;
  const res = await checkFileExistService(selectedBank.value ?? 0, file.name);
  if (res.exists == true) {
    message.error("This file already exists in the database!");
    return Upload.LIST_IGNORE;
  }

  return false; // Prevent auto upload
};

const handleChange = (info: any) => {
  fileList.value = info.fileList.slice(-1);

  if (info.file.status !== "uploading") {
    if (info.fileList.length > 0) {
      file.value = info.fileList[0].originFileObj as File;
    } else {
      file.value = null;
    }
  }
};
onMounted(() => {
  featchBanks();
});

// Reset file selection
const resetFile = () => {
  file.value = null;
  fileList.value = [];
};

let UpdatedEndingNo = "";

// Process the uploaded file
const processFile = async () => {
  if (!file.value) return;
  isProcessing.value = true;

  const reader = new FileReader();
  const fileName = file.value.name;
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  reader.onload = async (e) => {
    let workbook;
    const data = e.target?.result;

    try {
      if (fileExtension === "csv") {
        // CSV parsing
        const csvData = data as string;
        workbook = XLSX.read(csvData, { type: "string" });
      } else {
        // XLS or XLSX parsing
        const arrayBufferData = new Uint8Array(data as ArrayBuffer);
        workbook = XLSX.read(arrayBufferData, { type: "array" });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedData: any[] = [];

      if (selectedBank.value == 2) {
        for (const [index, row] of (jsonData as any[]).entries()) {
          let chequeType = "";

          const series = (row["Series"] || "").trim().toUpperCase();
          const type = (row["Type"] || "").trim().toUpperCase();

          if (series === "SB" || type === "SB") {
            chequeType = "Savings";
          } else if (series === "CA" || type === "CA") {
            chequeType = "Current";
          } else if (series === "PO" || type === "PO") {
            chequeType = "Payment Order";
          } else {
            chequeType = "Unknown";
          }

          let branchId = null;
          let distributionPointNameAddress = "";
          const deliveryBrCode = (
            row["DeliveryBrCode"] ??
            row["Delivery_Branch_Code"] ??
            ""
          ).trim();
          const delBrName = (
            row["DeliveryBranchName"] ??
            row["Delivery_Branch"] ??
            ""
          )
            .trim()
            .toUpperCase();
          try {
            const response = await getBranchId(
              selectedBank.value,
              deliveryBrCode,
              delBrName.trim().toUpperCase(),
            );
            branchId = response.data?.branch.id ?? null;
            distributionPointNameAddress = response.data?.branch.branchAddress;
          } catch (error) {
            console.error("Failed to fetch branch ID:", error);
          }
          if (selectedType.value === true) {
            if (branchId == 0 || branchId == null) {
              const payload = {
                BankId: Number(selectedBank.value),
                branchName: delBrName.trim().toUpperCase(),
                branchCode: deliveryBrCode,
                routingNo: "123",
                branchEmail: "agent@midland.net",
                branchPhone: row["Phone"],
                branchAddress: row["PointAddress"],
                isActive: "Active",
              };
              await saveBranchService(payload, false);
            }
          }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 2,
            branchName: (row["Home_Branch"] ?? row["HomeBranch"] ?? "")
              .trim()
              .toUpperCase(),
            routingNo: row["Routing_No"] ?? row["RoutingNumber"] ?? "",
            accountNo: (row["Account_no"] ?? row["AccountNumber"] ?? "").trim(),
            accountName: (
              row["Account_Name"] ??
              row["AccountHoldersName"] ??
              ""
            ).trim(),
            chequeType: chequeType,
            chequePrefix: (row["Series"] ?? row["Type"] ?? "").trim(),
            series: (row["Series"] ?? row["Type"] ?? "").trim(),
            transactionCode: row["Tr_Code"] ?? row["TransactionCode"] ?? "",
            leafCount: row["Lvs"] ?? row["NoofLeaf"] ?? "",
            micrNo: (row["MICR_Account"] ?? row["MICRAccount"] ?? "").trim(),
            startNo: row["StartNo"] ?? row["StartNO"] ?? "",
            endNo: row["End_No"] ?? row["EndNo"] ?? "",
            bookQty: "1",
            receivingBranch: (
              row["Delivery_Branch"] ??
              row["DeliveryBranchName"] ??
              ""
            )
              .trim()
              .toUpperCase(),
            distributionPointName: (
              row["PointAddress"] ??
              distributionPointNameAddress ??
              ""
            ).trim(),
            courierCode: "M",
            agentNum: row["Agent_No"] ?? row["Phone"] ?? "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["Request_Date"] ??
              row["Date"] ??
              new Date().toISOString().slice(0, 10),
            homeBranchCode: row["Home_Branch_Code"] ?? row["HomeBrCode"] ?? "",
            deliveryBranchCode:
              row["Delivery_Branch_Code"] ?? row["DeliveryBrCode"] ?? "",
            isAgent: selectedType.value === true ? "True" : "False",
            branchId: branchId,
            accFlag: "General",
          });
        }
      } else if (selectedBank.value == 1) {
        for (const [index, row] of (jsonData as any[]).entries()) {
          let micrNo = (row["Account No."] || "").trim();
          micrNo = micrNo.length > 13 ? micrNo.slice(-13) : micrNo;

          let homeBranchCode = (row["Account No."] || "").trim();
          homeBranchCode = homeBranchCode.substring(0, 4);

          const series = row["Series"].trim();
          const perfix = row["Prefix"].trim();
          const printerCode = row["Printer Code"].trim();
          const leaves = row["No. of Leaves"].trim();
          let courierCode = row["Courier Code"].trim();

          let chequeType = "";
          let chequePrefix = "";
          if (perfix == "B") {
            chequeType = "Savings";
            chequePrefix = perfix + printerCode + "-" + leaves + series;
          } else if (perfix == "A") {
            chequeType = "Current";
            chequePrefix = perfix + printerCode + "-" + leaves + series;
          } else if (perfix == "O") {
            chequeType = "Payment Order";
            chequePrefix = perfix + printerCode + "-" + leaves + series;
          } else if (perfix == "C") {
            chequeType = "Cash Credit";
            chequePrefix = perfix + printerCode + "-" + leaves + series;
          } else if (perfix == "F") {
            chequeType = "FDR";
            chequePrefix = "FDR";
          } else if (perfix == "M") {
            chequeType = "MTDR";
            chequePrefix = "MTDR";
          }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 1,
            branchName: (row["Branch Name"] || "").trim(),
            routingNo: row["Routing No."] || "",
            accountNo: (row["Account No."] || "").trim(),
            accountName: (row["Account Name"] || "").trim(),
            chequeType: chequeType,
            chequePrefix: chequePrefix,
            series: series,
            transactionCode: row["TR Code"] || "",
            leafCount: row["No. of Leaves"] || "",
            micrNo: micrNo,
            startNo: row["Starting No."] || "",
            endNo: row["Ending No."] || "",
            bookQty: row["No. of Book"] || "",
            receivingBranch: (row["Receiving Branch"] || "").trim(),
            distributionPointName: (
              row["Distribution Point Name"] ||
              row["Receiving Branch"] ||
              ""
            ).trim(),
            courierCode: courierCode,
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["Request Date"] && row["Request Date"].trim() !== ""
                ? row["Request Date"]
                    .replace(/\//g, "-")
                    .split("-")
                    .reverse()
                    .join("-")
                : new Date().toISOString().slice(0, 10),

            homeBranchCode: homeBranchCode,
            deliveryBranchCode: (row["Receiving Branch"] || "").trim(),
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: "General",
          });
        }
      } else if (selectedBank.value == 3) {
        let startNo = "0";
        let startNoNum = 0;
        try {
          const {
            success,
            data,
            message: msg,
          } = await fetchManageSerialService({
            bankId: selectedBank.value || 3,
            chequeType: "PO",
            lvs: 100,
          });

          if (!success) {
            showImportedData.value = false;
            message.error(msg);
            return;
          }

          const currentEndingNo = parseInt(
            data.manageSerialDto.endingNo || "0",
            10,
          );

          if (isNaN(currentEndingNo)) {
            throw new Error("Invalid serial number from server.");
          }

          const nextStart = currentEndingNo + 1;
          startNoNum = nextStart;
          startNo = nextStart.toString().padStart(7, "0");
        } catch (error) {
          console.error("Error fetching serial info:", error);
          message.error("Failed to fetch or calculate serial numbers.");
        }
        for (const [index, row] of (jsonData as any[]).entries()) {
          let micrNo = (row["Account no"] || "").trim();
          let homeBranchCode = micrNo.substring(0, 4);
          micrNo = micrNo.length > 13 ? micrNo.slice(-13) : micrNo;

          const bookCount = row["Bks"] * row["Lvs"];
          let chequeType = "";
          const nextEnd = startNoNum + bookCount - 1;
          const endNo = nextEnd.toString().padStart(7, "0");

          switch (row["Prefix"]) {
            case "SB":
              chequeType = "Savings";
              break;
            case "CA":
              chequeType = "Current";
              break;
            case "PO":
              chequeType = "Payment Order";
              break;
          }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 3,
            branchName: row["Home Branch"] || "".trim().toUpperCase(),
            routingNo: (row["Routing No."] || "").trim(),
            accountNo: (row["Account no"] || "").trim(),
            accountName: (row["Account Name"] || "").trim(),
            chequeType: chequeType,
            chequePrefix: (row["Prefix"] || "").trim(),
            micrNo: micrNo,
            series: (row["Prefix"] || "").trim(),
            transactionCode: (row["Tr. Code"] || "").trim(),
            leafCount: (row["Lvs"] || "").trim(),
            startNo: startNo.trim(),
            endNo: endNo.trim(),
            bookQty: (row["Bks"] || "").trim(),
            receivingBranch: (row["Delivery Branch"] || "")
              .trim()
              .toUpperCase(),
            distributionPointName: (row["Delivery Branch"] || "").trim(),
            courierCode: "L",
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["Request Date"] || new Date().toISOString().slice(0, 10),
            homeBranchCode: homeBranchCode,
            deliveryBranchCode: row["Delivery Branch"] || "",
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: "General",
          });
          startNoNum = nextEnd + 1;
          startNo = startNoNum.toString().padStart(7, "0");
          UpdatedEndingNo = endNo;
        }
      } else if (selectedBank.value == 4) {
        for (const [index, originalRow] of (jsonData as any[]).entries()) {
          // Normalize keys to lowercase for case-insensitive access
          const row: Record<string, any> = {};
          for (const key of Object.keys(originalRow)) {
            row[key.toLowerCase()] = originalRow[key];
          }

          let chequeType = "";
          if (!row["delivery_branch"]) {
            row["delivery_branch"] = row["home_branch"];
          }

          if (row["account_name"] == "Mudaraba Term Deposit") {
            chequeType = "MTDR";
          } else if (row["account_name"] == "Fixed Deposit Receipt") {
            chequeType = "FDR";
          } else {
            chequeType = row["series"];
          }

          let accNo = "";
          let homeBranchCode = "";
          let trCode = 0;
          let routingNo = "";

          if (chequeType == "MTDR" || chequeType == "FDR") {
            accNo = "0000000000104";
            trCode = 12;
            routingNo = "1234567";
          } else {
            accNo = (row["account_no"] || "").trim();
            trCode = row["tr_code"] || 0;
            routingNo = row["routing_no"] || "";
          }

          homeBranchCode = accNo.substring(0, 4);
          let micrNo = accNo.length > 13 ? accNo.slice(-13) : accNo;

          let startNo = parseInt(row["startno"]) || 0;
          let endNo = parseInt(row["end_no"]) || 0;
          let totalLvs = endNo - startNo + 1;
          let bookQty = totalLvs / row["lvs"];

          // let homeBranchName = row["home_branch"] || "";
          // let branchId = null;

          // if (
          //   chequeType != "MTDR" &&
          //   chequeType != "FDR" &&
          //   chequeType != "POA" &&
          //   chequeType != "POI"
          // ) {
          // try {
          //   const response = await getBranchId(
          //     selectedBank.value,
          //     homeBranchCode.trim().toUpperCase(),
          //     homeBranchName,
          //   );
          //   branchId = response.data?.branch.id ?? null;

          //   if (branchId == 0 || branchId == null) {
          //     const payload = {
          //       BankId: Number(selectedBank.value),
          //       branchName: homeBranchName.trim().toUpperCase(),
          //       branchCode: homeBranchCode,
          //       routingNo: routingNo,
          //       branchEmail: "branch@bgcb.com",
          //       branchPhone: "544",
          //       branchAddress: homeBranchName,
          //       isActive: "Active",
          //     };
          //     await saveBranchService(payload, false);
          //   }
          // } catch (error) {
          //   console.error("Failed to fetch branch ID:", error);
          // }
          // }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 3,
            branchName: row["home_branch"] || "".trim().toUpperCase(),
            routingNo: routingNo.trim(),
            accountNo: accNo.trim(),
            accountName: row["account_name"] || "",
            chequeType: chequeType,
            chequePrefix: chequeType,
            micrNo: micrNo,
            series: chequeType,
            transactionCode: trCode,
            leafCount: row["lvs"] || "",
            startNo: row["startno"] || "",
            endNo: row["end_no"] || "",
            bookQty: bookQty,
            receivingBranch: row["delivery_branch"] || "".trim().toUpperCase(),
            distributionPointName: row["delivery_branch"] || "",
            courierCode: "L",
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            accFlag: "General",
            requestDate:
              row["request date"] && row["request date"].trim() !== ""
                ? row["request date"]
                    .replace(/\//g, "-")
                    .split("-")
                    .reverse()
                    .join("-")
                : new Date().toISOString().slice(0, 10),

            homeBranchCode: homeBranchCode,
            deliveryBranchCode: row["delivery_branch"] || "",
            isAgent: selectedType.value === true ? "True" : "False",
          });
        }
      } else if (selectedBank.value == 5) {
        for (const [index, originalRow] of (jsonData as any[]).entries()) {
          // Normalize keys to lowercase for case-insensitive access
          const row: Record<string, any> = {};
          for (const key of Object.keys(originalRow)) {
            row[key.toLowerCase()] = originalRow[key];
          }
          let accNo = row["account number"] || "";
          let homeBranchCode = accNo.toString().substring(0, 4);
          let homeBranchName = row["branch name"] || "";
          let routingNo = (row["routing number"] || "").toString().trim();
          let chequeType = row["type"];
          let branchId = null;
          if (chequeType != "PO") {
            try {
              const response = await getBranchId(
                selectedBank.value,
                homeBranchCode,
                homeBranchName,
              );
              branchId = response.data?.branch?.id ?? null;

              if (branchId == 0 || branchId == null) {
                const payload = {
                  BankId: Number(selectedBank.value),
                  branchName: homeBranchName.trim().toUpperCase(),
                  branchCode: homeBranchCode,
                  routingNo: routingNo,
                  branchEmail: "branch@sjiblbd.com",
                  branchPhone: "544",
                  branchAddress: homeBranchName,
                  isActive: "Active",
                };
                await saveBranchService(payload, false);
              }
            } catch (error) {
              console.error("Failed to fetch branch ID:", error);
            }
          }

          switch (row["type"]) {
            case "MSD":
              chequeType = "MSD";
              break;
            case "ACD":
              chequeType = "ACD";
              break;
            case "SND":
              chequeType = "SND";
              break;
            case "PO":
              chequeType = "Payment Order";
              break;
          }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 3,
            branchName: (row["branch name"] || "").trim().toUpperCase(),
            routingNo: routingNo,
            accountNo: accNo.toString().trim(),
            accountName: row["account holder name"] || "",
            chequeType: chequeType,
            chequePrefix: row["type"] || "",
            micrNo: (row["micr account"] || "").toString().trim(),
            series: row["type"] || "",
            transactionCode: row["transaction code"] || "",
            leafCount: row["no of leaf"] || "",
            startNo: (row["start no"] || "").toString().trim(),
            endNo: (row["end no"] || "").toString().trim(),
            bookQty: 1,
            receivingBranch: (row["delivery branch"] || "")
              .trim()
              .toUpperCase(),
            distributionPointName: row["delivery branch"] || "",
            courierCode: "AS",
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["request date"] || new Date().toISOString().slice(0, 10),
            homeBranchCode: homeBranchCode,
            deliveryBranchCode: row["delivery branch"] || "",
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: "General",
          });
        }
      } else if (selectedBank.value == 6) {
        for (const [index, originalRow] of (jsonData as any[]).entries()) {
          // Normalize keys to lowercase for case-insensitive access
          const row: Record<string, any> = {};
          for (const key of Object.keys(originalRow)) {
            row[key.toLowerCase()] = originalRow[key];
          }
          let accNo = row["account number"] || "";
          let homeBranchCode = accNo.toString().substring(0, 4);
          let micrNo = accNo.length > 13 ? accNo.slice(-13) : accNo;
          // let homeBranchName = row["branch name"] || "";
          let routingNo = (row["routing number"] || "").toString().trim();
          let chequeType = "";
          let journalDate = (row["journal book date"] || "").toString().trim();
          let formattedJournalDate =
            journalDate.slice(4) +
            "-" +
            journalDate.slice(2, 4) +
            "-" +
            journalDate.slice(0, 2);
          // let branchId = null;
          // try {
          //   const response = await getBranchId(
          //     selectedBank.value,
          //     homeBranchCode,
          //     homeBranchName,
          //   );
          //   branchId = response.data?.branch?.id ?? null;

          //   if (branchId == 0 || branchId == null) {
          //     const payload = {
          //       BankId: Number(selectedBank.value),
          //       branchName: homeBranchName.trim().toUpperCase(),
          //       branchCode: homeBranchCode,
          //       routingNo: routingNo,
          //       branchEmail: "branch@jbl.com",
          //       branchPhone: "544",
          //       branchAddress: homeBranchName,
          //       isActive: "Active",
          //     };
          //     await saveBranchService(payload, false);
          //   }
          // } catch (error) {
          //   console.error("Failed to fetch branch ID:", error);
          // }

          switch (row["account type"]) {
            case "SB":
              chequeType = "Savings";
              break;
            case "CA":
              chequeType = "Current";
              break;
            case "PO":
              chequeType = "Payment Order";
              break;
          }

          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 6,
            branchName: (row["branch name"] || "").trim().toUpperCase(),
            routingNo: routingNo,
            accountNo: accNo.toString().trim(),
            accountName: row["name 2"]
              ? `${row["name 1"]}/${row["name 2"]}`
              : `${row["name 1"]}`,
            chequeType: chequeType,
            chequePrefix: row["prefix"] || "",
            micrNo: micrNo,
            series: row["prefix"] || "",
            transactionCode: row["transaction code"] || "",
            leafCount: row["book size"] || "",
            startNo: (row["start leaf"] || "").toString().trim(),
            endNo: (row["end leaf"] || "").toString().trim(),
            bookQty: row["no of books"] || "",
            receivingBranch: (row["pickup branch name"] || "")
              .trim()
              .toUpperCase(),
            distributionPointName: row["pickup branch name"] || "",
            courierCode: "B",
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate: formattedJournalDate,
            homeBranchCode: homeBranchCode,
            deliveryBranchCode: row["pickup branch name"] || "",
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: "General",
          });
        }
      } else if (selectedBank.value == 7) {
        for (const [index, originalRow] of (jsonData as any[]).entries()) {
          // Normalize keys to lowercase for case-insensitive access
          const row: Record<string, any> = {};
          for (const key of Object.keys(originalRow)) {
            row[key.toLowerCase()] = originalRow[key];
          }
          let accNo = row["account_no"] || "";
          let homeBranchCode = row["home_branch"] || "";
          let deliveryBranchCode = row["delivery_branch"] || "";
          let micrNo = accNo.length > 13 ? accNo.slice(-13) : accNo;
          let homeBranchName = "";
          let deliveryBranchName = "";
          let routingNo = (row["routing_no"] || "").toString().trim();
          try {
            const response = await getBranchId(
              selectedBank.value,
              homeBranchCode,
              null,
            );
            homeBranchName = response.data?.branch?.branchName || "";
            const response2 = await getBranchId(
              selectedBank.value,
              deliveryBranchCode,
              null,
            );
            deliveryBranchName = response2.data?.branch?.branchName || "";
          } catch (error) {
            console.error("Failed to fetch branch Name:", error);
          }
          // switch (row["account type"]) {
          //   case "SBA":
          //     chequeType = "Savings";
          //     break;
          //   case "CA":
          //     chequeType = "Current";
          //     break;
          //   case "PO":
          //     chequeType = "Payment Order";
          //     break;
          // }
          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 7,
            branchName: homeBranchName.trim().toUpperCase(),
            routingNo: routingNo,
            accountNo: accNo.toString().trim(),
            accountName: (row["account_name"] || "").trim().toUpperCase(),
            chequeType: (row["series"] || "").trim().toUpperCase(),
            chequePrefix: (row["series"] || "").trim().toUpperCase(),
            micrNo: micrNo,
            series: (row["series"] || "").trim().toUpperCase(),
            transactionCode: row["tr_code"] || "",
            leafCount: row["lvs"] || "",
            startNo: (row["startno"] || "").toString().trim(),
            endNo: (row["end_no"] || "").toString().trim(),
            bookQty: 1,
            receivingBranch: deliveryBranchName.trim().toUpperCase(),
            distributionPointName: deliveryBranchName,
            courierCode: "L",
            agentNum: "",
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["request date"] || new Date().toISOString().slice(0, 10),
            homeBranchCode: homeBranchCode,
            deliveryBranchCode: deliveryBranchCode,
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: "General",
          });
        }
      } else if (selectedBank.value == 8) {
        for (const [index, originalRow] of (jsonData as any[]).entries()) {
          // Normalize keys to lowercase for case-insensitive access
          const row: Record<string, any> = {};
          for (const key of Object.keys(originalRow)) {
            row[key.toLowerCase()] = originalRow[key];
          }
          let accNo = (row["account no"] || "").trim();
          let homeBranchCode = "home branch code";
          let deliveryBranchCode = "delivery branch code";
          let micrNo = row["micr account"].trim();
          micrNo = micrNo.length > 13 ? micrNo.slice(-13) : micrNo;

          let homeBranchName = (row["mother branch"] || "")
            .trim()
            .toUpperCase();
          let deliveryBranchName = (row["delivery branch"] || "")
            .trim()
            .toUpperCase();
          const agentPhone = deliveryBranchName.startsWith("PBL AGENT BANKING,")
            ? deliveryBranchName.trim().split(",").pop().trim().toString()
            : "";
          if (deliveryBranchName?.startsWith("PBL AGENT BANKING,")) {
            let parts = deliveryBranchName.split(",");

            // remove phone (last element)
            parts.pop();

            // keep only first 3 meaningful segments
            deliveryBranchName = parts
              .slice(0, 3)
              .join(",")
              .trim()
              .toUpperCase();
          }
          let courierCode = "";
          let deliveryBy = (row["delivery by"] || "").trim();
          const branchList = [
            "ADAMJEE EPZ BRANCH",
            "BEANIBAZAR BRANCH",
            "BISWANATH BRANCH",
            "BRAHMANBARIA BRANCH",
            "CHAUDDAGRAM BRANCH",
            "DHAKA DAKSHIN BRANCH",
            "HEYAKO SME BR/SC",
            "IBB AMBERKHANA BRANCH",
            "JHIKORGACHA SME BR/SC",
            "KADAMTOLI BRANCH",
            "KERANIHAT BRANCH",
            "KULAURA BRANCH",
            "MADHABPUR SME BR/SC",
            "RAMGARH BRANCH",
            "SAIDPUR BRANCH",
            "SYEDPUR SME BR/SC",
            "SONARGAON SME BR/SC",
            "SYLHET BRANCH",
            "TAKERHAT SME BR/SC",
            "UPASHAHAR BRANCH",
          ];

          if (branchList.includes(deliveryBranchName.toUpperCase())) {
            courierCode = "IX";
          } else if (
            deliveryBy === "Rider" ||
            deliveryBranchName === "KONAPARA SUB BRANCH"
          ) {
            courierCode = "R";
          } else {
            courierCode = "E";
          }
          let routingNo = (row["routing no"] || "").trim();
          let accountType = (row["a/c type"] || "").trim();
          let series = "";
          let chequePrefix = "";
          let chequeType = "";
          if (accountType == "Savings Account") {
            series = "A";
            chequePrefix = "104 No.";
            chequeType = "Savings";
          } else if (accountType == "Current Account") {
            series = "A";
            chequePrefix = "204 No.";
            chequeType = "Current";
          } else if (accountType == "Payorder") {
            series = "A";
            chequePrefix = "910 No.";
            chequeType = "Payment Order";
          }
          let startNo = (row["start no"] || "").trim();
          let endNo = (row["end no"] || "").trim();
          let bookQty = 1;
          let accFlag = (row["a/c flag"] || "").trim();
          if (accFlag == "Monarch Account") {
            accFlag = "Priority";
          } else if (accFlag == "Islamic Banking") {
            accFlag = "Islamic";
          } else {
            accFlag = "CONV";
          }
          console.log("Delivery Branch Name: ", deliveryBranchName);
          processedData.push({
            key: index.toString(),
            bankName: selectedBankName.value,
            bankId: selectedBank.value || 7,
            branchName: homeBranchName.trim().toUpperCase(),
            routingNo: routingNo,
            accountNo: accNo.toString().trim(),
            accountName: (row["name"] || "").trim().toUpperCase(),
            chequeType: chequeType,
            chequePrefix: chequePrefix,
            micrNo: micrNo,
            series: series,
            transactionCode: row["transaction code"] || "",
            leafCount: row["no of leaves"] || "",
            startNo: startNo,
            endNo: endNo,
            bookQty: bookQty,
            receivingBranch: deliveryBranchName.trim().toUpperCase(),
            distributionPointName: deliveryBranchName,
            courierCode: courierCode,
            agentNum: agentPhone,
            serverity: selectedSeverity.value === 1 ? "Urgent" : "Normal",
            requestDate:
              row["request date"] || new Date().toISOString().slice(0, 10),
            homeBranchCode: homeBranchCode,
            deliveryBranchCode: deliveryBranchCode,
            isAgent: selectedType.value === true ? "True" : "False",
            accFlag: accFlag,
          });
        }
      }

      importedData.value = processedData;
      showImportedData.value = true;
      message.success("File processed successfully!");
    } catch (error) {
      console.error("Failed to process file:", error);
      message.error("Failed to process file. Please check the format.");
    } finally {
      isProcessing.value = false;
    }
  };

  if (fileExtension === "csv") {
    reader.readAsText(file.value); // CSV is plain text
  } else {
    reader.readAsArrayBuffer(file.value); // XLS, XLSX
  }
};

// Handle discard action
const handleDiscard = () => {
  showImportedData.value = false;
  importedData.value = [];
  file.value = null;
  fileList.value = [];
};
const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    const items: LocalFileUploadCommand[] = importedData.value.map((item) => ({
      bankId: selectedBank.value ?? 0,
      branchName: item.branchName,
      accountNo: String(item.accountNo),
      routingNo: String(item.routingNo),
      startNo: item.startNo,
      endNo: item.endNo,
      chequeType: item.chequeType,
      chequePrefix: item.chequePrefix,
      micrNo: String(item.micrNo),
      series: item.series,
      accountName: item.accountName,
      cusAddress: item.distributionPointName,
      bookQty: Number(item.bookQty),
      transactionCode: Number(item.transactionCode),
      leaves: Number(item.leafCount),
      courierCode: item.courierCode ?? "SCS",
      receivingBranchName: item.receivingBranch,
      serverity: selectedSeverity.value,
      requestDate: item.requestDate, // "YYYY-MM-DD"
      agentNum: item.agentNum,
      homeBranchCode: item.homeBranchCode,
      deliveryBranchCode: item.deliveryBranchCode,
      isAgent: selectedType.value,
      accFlag: item.accFlag,
    }));
    const result = await saveBulkLocalFileUploadService(items);
    if (result.data.isSuccess) {
      await localFileImportLogService(selectedBank.value ?? 0, fileName.value);
      if (selectedBank.value == 3) {
        try {
          await updateManageSerialService({
            bankId: selectedBank.value || 3,
            chequeType: "PO",
            lvs: 100,
            endingNumber: UpdatedEndingNo,
          });
        } catch (error: any) {
          showImportedData.value = false;
          message.error(`${error.response.data.Message}`);
          return;
        }
      }
      successMessage.value = "File Uploaded Successfully!";
      successDescription.value = `${items.length} items uploaded for ${selectedBankName.value}`;
      showSuccessModal.value = true;
    } else {
      message.error(result.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload failed:", error);
    message.error("Failed to upload data.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle success modal close
const handleSuccessModalClose = () => {
  showSuccessModal.value = false;
  // Reset the form
  showImportedData.value = false;
  importedData.value = [];
  file.value = null;
  fileList.value = [];
  selectedBank.value = null;
  selectedType.value = false;
  selectedSeverity.value = 2;
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
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-btn-primary:hover) {
  background-color: var(--accent-dark);
  border-color: var(--accent-dark);
}

:deep(.ant-upload-drag) {
  border: 2px dashed #e2e8f0;
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

:deep(.ant-upload-drag:hover) {
  border-color: var(--accent-cta);
  background-color: rgba(107, 142, 35, 0.05);
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-textarea-focused) {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-textarea:hover) {
  border-color: var(--accent-cta) !important;
}

:deep(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--text-primary);
}

:deep(.ant-modal-content) {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: var(--text-secondary);
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

/* Custom table styles */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: var(--background);
  font-weight: 600;
  color: var(--text-primary);
  padding: 16px;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  color: var(--text-primary);
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: var(--background);
}

.custom-table :deep(.ant-table-container) {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.custom-table :deep(.ant-table-pagination) {
  margin: 16px;
}

/* Custom animation for success modal */
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

.custom-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}
</style>
