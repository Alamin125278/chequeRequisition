<template>
  <div class="bg-background min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div class="max-w-7xl mx-auto py-6">
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
              <div class="flex items-center mb-4">
                <BankOutlined class="text-accent mr-2 text-lg" />
                <h3 class="text-md font-medium text-primary">Select Bank</h3>
              </div>

              <a-select
                v-model:value="selectedBank"
                placeholder="Select Bank"
                class="w-full md:w-1/3 rounded-md"
                size="large"
                :options="banks"
              />
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
                <p class="font-medium text-primary">{{ selectedBank }}</p>
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
                :pagination="{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total) => `Total ${total} items`,
                }"
                bordered
                size="middle"
                class="custom-table"
              >
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
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import * as XLSX from "xlsx";

// Define interfaces
interface ImportedItem {
  key: string;
  bankName: string;
  branchName: string;
  routingNo: string;
  accountNo: string;
  accountName: string;
  prefix: string;
  series: string;
  branchCode: string;
  transactionCode: string;
  leafCount: string;
  startNo: string;
  endNo: string;
  bookQty: string;
  receivingBranch: string;
  distributionPointName: string;
  courierCode: string;
}

// Current date for display
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Bank data
const banks = [
  { value: "", label: "Select Bank" },
  { value: "National Bank", label: "National Bank" },
  { value: "City Bank", label: "City Bank" },
  { value: "Metro Bank", label: "Metro Bank" },
  { value: "Global Bank", label: "Global Bank" },
];

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
    dataIndex: "prefix",
    key: "prefix",
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
    title: "No. of Book",
    dataIndex: "bookQty",
    key: "bookQty",
    width: 120,
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 150,
  },
];

// State variables
const selectedBank = ref("");
const file = ref<File | null>(null);
const fileList = ref<any[]>([]);
const isProcessing = ref(false);
const isSubmitting = ref(false);
const importedData = ref<ImportedItem[]>([]);
const showImportedData = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref("");
const successDescription = ref("");

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// File upload handlers
const beforeUpload = (file: File) => {
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

// Reset file selection
const resetFile = () => {
  file.value = null;
  fileList.value = [];
};

// Process the uploaded file
const processFile = () => {
  if (!file.value) return;
  isProcessing.value = true;

  const reader = new FileReader();
  const fileName = file.value.name;
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  reader.onload = (e) => {
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

      // Map to your interface
      importedData.value = (jsonData as any[]).map((row, index) => ({
        key: index.toString(),
        bankName: selectedBank.value,
        branchName: row["Branch Name"] || "",
        routingNo: row["Routing No."] || "",
        accountNo: row["Account No."] || "",
        accountName: row["Account Name"] || "",
        prefix: row["Prefix"] || "",
        series: row["Series"] || "",
        branchCode: row["Branch Code"] || "",
        transactionCode: row["TR Code"] || "",
        leafCount: row["No. of Leaves"] || "",
        startNo: row["Starting No."] || "",
        endNo: row["Ending No."] || "",
        bookQty: row["No. of Book"] || "",
        receivingBranch: row["Receiving Branch"] || "",
        distributionPointName: row["Distribution Point Name"] || "",
        courierCode: row["Courier Code"] || "",
      }));

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

// Handle form submission
const handleSubmit = () => {
  isSubmitting.value = true;

  // Simulate API call to save the data
  setTimeout(() => {
    isSubmitting.value = false;
    successMessage.value = "File Uploaded Successfully!";
    successDescription.value = `${importedData.value.length} items have been uploaded for ${selectedBank.value}.`;
    showSuccessModal.value = true;
  }, 2000);
};

// Handle success modal close
const handleSuccessModalClose = () => {
  showSuccessModal.value = false;
  // Reset the form
  showImportedData.value = false;
  importedData.value = [];
  file.value = null;
  fileList.value = [];
  selectedBank.value = "";
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
