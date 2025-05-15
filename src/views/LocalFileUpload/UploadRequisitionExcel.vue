<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1">
    <!-- Main Content Card -->
      <!-- Header with Logo and Title -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="bg-indigo-600 text-white p-2 rounded-lg mr-3">
            <bank-outlined class="text-xl" />
          </div>
          <h1 class="text-2xl font-bold text-slate-800">
            Upload Cheque File
          </h1>
        </div>
        <div class="text-sm text-slate-500 flex items-center">
          <calendar-outlined class="mr-1" />
          {{ new Date().toLocaleDateString() }}
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <!-- Card Header -->
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center">
            <file-text-outlined class="mr-2 text-indigo-600" />
            {{ showImportedData ? "Review Imported Data" : "Upload Cheque File" }}
          </h2>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- Pre-Upload View -->
          <div v-if="!showImportedData">
            <!-- Bank Selection -->
            <div class="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div class="flex items-center mb-4">
                <bank-outlined class="text-indigo-600 mr-2 text-lg" />
                <h3 class="text-lg font-medium text-slate-700">Select Bank</h3>
              </div>
              
              <a-select
                v-model:value="selectedBank"
                placeholder="Select Bank"
                class="w-full md:w-1/3 rounded-lg"
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
                class="p-2 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-xl transition-all duration-300"
                :disabled="!selectedBank"
              >
                <div class="py-8">
                  <p class="ant-upload-drag-icon">
                    <inbox-outlined class="text-indigo-500 text-4xl" />
                  </p>
                  <p class="ant-upload-text font-medium text-slate-800 text-lg mt-4">
                    Click or drag file to upload
                  </p>
                  <p class="ant-upload-hint text-slate-500 mt-2">
                    Support for a single upload. Only CSV, XLS, or XLSX files.
                  </p>
                  <p v-if="!selectedBank" class="text-amber-500 mt-3">
                    Please select a bank first
                  </p>
                </div>
              </a-upload-dragger>

              <!-- Help Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <div class="flex items-start">
                    <info-circle-outlined class="text-indigo-600 mt-1 mr-3 text-lg" />
                    <div>
                      <h4 class="font-medium text-indigo-800 mb-2">
                        Instructions
                      </h4>
                      <p class="text-indigo-700 text-sm">
                        Upload a CSV or Excel file containing cheque data.
                        The file should include all required columns listed on
                        the right.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 class="font-medium text-slate-700 mb-3 flex items-center">
                    <check-circle-outlined class="text-indigo-600 mr-2" />
                    Required Columns
                  </h4>
                  <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600">
                    <div v-for="column in requiredColumns" :key="column" class="flex items-center">
                      <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                      {{ column }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Selected View -->
            <div v-else class="space-y-6">
              <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div class="flex items-center">
                  <div class="bg-indigo-100 p-3 rounded-lg mr-4">
                    <file-text-outlined class="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">{{ file.name }}</h4>
                    <p class="text-sm text-slate-500">
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
                  class="rounded-lg px-6 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400"
                >
                  Cancel
                </a-button>
                <a-button
                  type="primary"
                  @click="processFile"
                  :loading="isProcessing"
                  size="large"
                  class="rounded-lg px-6 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 flex items-center"
                >
                  <eye-outlined v-if="!isProcessing" class="mr-2" />
                  {{ isProcessing ? "Processing..." : "Preview Data" }}
                </a-button>
              </div>
            </div>
          </div>

          <!-- Post-Upload View (Data Table) -->
          <div v-else class="space-y-6">
            <!-- Summary Card -->
            <div class="bg-indigo-50 p-5 rounded-xl border border-indigo-100 mb-6">
              <div class="flex items-center">
                <div class="bg-indigo-100 p-3 rounded-lg mr-4">
                  <check-circle-outlined class="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h4 class="font-medium text-indigo-800">
                    File Processed Successfully
                  </h4>
                  <p class="text-sm text-indigo-700">
                    {{ importedData.length }} items have been imported and are
                    ready for review.
                  </p>
                </div>
              </div>
            </div>

            <!-- Bank Information -->
            <div class="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div class="flex items-center mb-4">
                <bank-outlined class="text-indigo-600 mr-2 text-lg" />
                <h3 class="text-lg font-medium text-slate-700">Selected Bank</h3>
              </div>
              <div class="bg-white p-3 rounded-lg inline-block border border-slate-200">
                <p class="font-medium text-slate-800">{{ selectedBank }}</p>
              </div>
            </div>

            <!-- Data Table with improved design -->
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <div class="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 class="font-medium text-slate-700">Imported Items</h3>
                <div class="text-sm text-slate-500">
                  Total:
                  <span class="font-medium text-slate-700">{{ importedData.length }}</span>
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
                class="rounded-lg px-6 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 flex items-center"
                :disabled="isSubmitting"
              >
                <close-outlined class="mr-2" />
                Discard
              </a-button>
              <a-button
                type="primary"
                @click="handleSubmit"
                :loading="isSubmitting"
                size="large"
                class="rounded-lg px-6 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 flex items-center"
              >
                <check-outlined v-if="!isSubmitting" class="mr-2" />
                {{ isSubmitting ? "Submitting..." : "Submit" }}
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Card -->
      <div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div class="flex items-start">
          <div class="bg-slate-100 p-2 rounded-lg mr-4">
            <info-circle-outlined class="text-slate-600" />
          </div>
          <div>
            <h3 class="font-medium text-slate-800 mb-1">Need Help?</h3>
            <p class="text-sm text-slate-600">
              If you're having trouble with the import process, please contact
              support at
              <a href="mailto:support@example.com" class="text-indigo-600 hover:text-indigo-700">support@example.com</a>
            </p>
          </div>
        </div>
      </div>

    <!-- Success Modal -->
    <a-modal
      v-model:visible="showSuccessModal"
      :footer="null"
      :closable="false"
      width="400px"
      class="custom-modal"
    >
      <div class="text-center py-6 px-2">
        <div class="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
          <check-outlined class="text-indigo-600 text-3xl" />
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-slate-600 mb-8">{{ successDescription }}</p>
        <a-button
          type="primary"
          @click="handleSuccessModalClose"
          size="large"
          class="w-full rounded-lg py-2 h-auto bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-base"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
import {
  UploadOutlined,
  InboxOutlined,
  BankOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
  EyeOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

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

// Bank data
const banks = [
  { value: '', label: 'Select Bank' },
  { value: 'National Bank', label: 'National Bank' },
  { value: 'City Bank', label: 'City Bank' },
  { value: 'Metro Bank', label: 'Metro Bank' },
  { value: 'Global Bank', label: 'Global Bank' }
];

// Required columns for the file
const requiredColumns = [
  'Branch Name',
  'Routing No.',
  'Account No.',
  'Account Name',
  'Prefix',
  'Series',
  'TR Code',
  'No. of Leaves',
  'Starting No.',
  'Ending No.',
  'No. of Book',
  'Receiving Branch'
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
    width: 120 
  },
  { 
    title: "Series", 
    dataIndex: "series", 
    key: "series", 
    width: 120 
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
    width: 120 
  },
  { 
    title: "Ending No.", 
    dataIndex: "endNo", 
    key: "endNo", 
    width: 120 
  },
  { 
    title: "No. of Book", 
    dataIndex: "bookQty", 
    key: "bookQty", 
    width: 120 
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 150,
  }
];

// State variables
const selectedBank = ref('');
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
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File upload handlers
const beforeUpload = (file: File) => {
  const isCSVOrExcel =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
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

  if (info.file.status !== 'uploading') {
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
        branchName: row["Branch Name"] || '',
        routingNo: row["Routing No."] || '',
        accountNo: row["Account No."] || '',
        accountName: row["Account Name"] || '',
        prefix: row["Prefix"] || '',
        series: row["Series"] || '',
        branchCode: row["Branch Code"] || '',
        transactionCode: row["TR Code"] || '',
        leafCount: row["No. of Leaves"] || '',
        startNo: row["Starting No."] || '',
        endNo: row["Ending No."] || '',
        bookQty: row["No. of Book"] || '',
        receivingBranch: row["Receiving Branch"] || '',
        distributionPointName: row["Distribution Point Name"] || '',
        courierCode: row["Courier Code"] || ''
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
  selectedBank.value = '';
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 0.5rem !important;
  transition: all 0.3s;
}

:deep(.ant-upload-drag) {
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

:deep(.ant-upload-drag:hover) {
  border-color: #6366f1;
  background-color: #eef2ff;
}

:deep(.ant-btn-primary) {
  background-color: #6366f1;
  border-color: #6366f1;
}

:deep(.ant-btn-primary:hover) {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-picker:hover) {
  border-color: #6366f1 !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #eef2ff;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
  color: #334155;
}

:deep(.ant-pagination) {
  margin: 16px 0;
}

:deep(.ant-modal-content) {
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(.ant-modal-body) {
  padding: 0;
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

.custom-table :deep(.ant-table-container) {
  border-radius: 0.5rem;
  overflow: hidden;
}

.custom-table :deep(.ant-table-pagination) {
  margin: 16px;
}
</style>