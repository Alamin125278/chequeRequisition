<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <!-- Main Content Card -->
    <div class="max-w-7xl mx-auto">
      <!-- Header with Logo and Title -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="bg-emerald-600 text-white p-2 rounded-lg mr-3">
            <bank-outlined class="text-xl" />
          </div>
          <h1 class="text-2xl font-bold text-slate-800">
            Cheque Requisition System
          </h1>
        </div>
        <div class="text-sm text-slate-500 flex items-center">
          <calendar-outlined class="mr-1" />
          {{ new Date().toLocaleDateString() }}
        </div>
      </div>

      <!-- Main Card -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100"
      >
        <!-- Card Header -->
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center">
            <file-text-outlined class="mr-2 text-emerald-600" />
            {{
              showImportedData
                ? "Review Imported Requisition Items"
                : "Import Cheque Requisition Items"
            }}
          </h2>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- Pre-Upload View -->
          <div v-if="!showImportedData">
            <!-- System-generated fields with improved styling -->
            <div
              class="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200"
            >
              <h3
                class="text-sm font-medium text-slate-700 mb-4 flex items-center"
              >
                <info-circle-outlined class="mr-2 text-emerald-600" />
                Requisition Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <file-text-outlined class="mr-1 text-emerald-600" />
                    Requisition Number
                  </label>
                  <a-input
                    v-model:value="requisitionId"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <bank-outlined class="mr-1 text-emerald-600" />
                    Bank Name
                  </label>
                  <a-input
                    v-model:value="bankName"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <bank-outlined class="mr-1 text-emerald-600" />
                    Branch Name
                  </label>
                  <a-input
                    v-model:value="branchName"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <calendar-outlined class="mr-1 text-emerald-600" />
                    Request Date
                  </label>
                  <a-input
                    v-model:value="requestDate"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
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
                class="p-2 border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-white rounded-xl transition-all duration-300"
              >
                <div class="py-8">
                  <p class="ant-upload-drag-icon">
                    <inbox-outlined class="text-emerald-500 text-4xl" />
                  </p>
                  <p
                    class="ant-upload-text font-medium text-slate-800 text-lg mt-4"
                  >
                    Click or drag file to upload
                  </p>
                  <p class="ant-upload-hint text-slate-500 mt-2">
                    Support for a single upload. Only CSV, XLS, or XLSX files.
                  </p>
                </div>
              </a-upload-dragger>

              <!-- Help Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div
                  class="bg-emerald-50 p-5 rounded-xl border border-emerald-100"
                >
                  <div class="flex items-start">
                    <info-circle-outlined
                      class="text-emerald-600 mt-1 mr-3 text-lg"
                    />
                    <div>
                      <h4 class="font-medium text-emerald-800 mb-2">
                        Instructions
                      </h4>
                      <p class="text-emerald-700 text-sm">
                        Upload a CSV or Excel file containing requisition items.
                        The file should include all required columns listed on
                        the right.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 class="font-medium text-slate-700 mb-3 flex items-center">
                    <check-circle-outlined class="text-emerald-600 mr-2" />
                    Required Columns
                  </h4>
                  <div
                    class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Branch Name
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Routing No.
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Account No.
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Account Name
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Prefix
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      Series
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      TR Code
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"
                      ></div>
                      No. of Leaves
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Selected View -->
            <div v-else class="space-y-6">
              <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div class="flex items-center">
                  <div class="bg-emerald-100 p-3 rounded-lg mr-4">
                    <file-text-outlined class="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">{{ file.name }}</h4>
                    <p class="text-sm text-slate-500">
                      {{ (file.size / 1024).toFixed(2) }} KB •
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
                  class="rounded-lg px-6 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 flex items-center"
                >
                  <inbox-outlined v-if="!isProcessing" class="mr-2" />
                  {{ isProcessing ? "Processing..." : "Process File" }}
                </a-button>
              </div>
            </div>
          </div>

          <!-- Post-Upload View (Data Table) -->
          <div v-else class="space-y-6">
            <!-- Summary Card -->
            <div
              class="bg-emerald-50 p-5 rounded-xl border border-emerald-100 mb-6"
            >
              <div class="flex items-center">
                <div class="bg-emerald-100 p-3 rounded-lg mr-4">
                  <check-circle-outlined class="text-emerald-600 text-xl" />
                </div>
                <div>
                  <h4 class="font-medium text-emerald-800">
                    File Processed Successfully
                  </h4>
                  <p class="text-sm text-emerald-700">
                    {{ importedData.length }} items have been imported and are
                    ready for review.
                  </p>
                </div>
              </div>
            </div>

            <!-- System-generated fields (read-only) -->
            <div
              class="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200"
            >
              <h3
                class="text-sm font-medium text-slate-700 mb-4 flex items-center"
              >
                <info-circle-outlined class="mr-2 text-emerald-600" />
                Requisition Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <file-text-outlined class="mr-1 text-emerald-600" />
                    Requisition Number
                  </label>
                  <a-input
                    v-model:value="requisitionId"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <bank-outlined class="mr-1 text-emerald-600" />
                    Bank Name
                  </label>
                  <a-input
                    v-model:value="bankName"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <bank-outlined class="mr-1 text-emerald-600" />
                    Branch Name
                  </label>
                  <a-input
                    v-model:value="branchName"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="flex items-center text-sm font-medium text-slate-600"
                  >
                    <calendar-outlined class="mr-1 text-emerald-600" />
                    Request Date
                  </label>
                  <a-input
                    v-model:value="requestDate"
                    readonly
                    class="bg-white border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <!-- Data Table with improved design -->
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <div
                class="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center"
              >
                <h3 class="font-medium text-slate-700">Imported Items</h3>
                <div class="text-sm text-slate-500">
                  Total:
                  <span class="font-medium text-slate-700">{{
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
                  showTotal: (total:number) => `Total ${total} items`,
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
                class="rounded-lg px-6 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 flex items-center"
              >
                <check-outlined v-if="!isSubmitting" class="mr-2" />
                {{ isSubmitting ? "Submitting..." : "Submit Requisition" }}
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Card -->
      <div
        class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 p-5"
      >
        <div class="flex items-start">
          <div class="bg-slate-100 p-2 rounded-lg mr-4">
            <info-circle-outlined class="text-slate-600" />
          </div>
          <div>
            <h3 class="font-medium text-slate-800 mb-1">Need Help?</h3>
            <p class="text-sm text-slate-600">
              If you're having trouble with the import process, please contact
              support at
              <a
                href="mailto:support@example.com"
                class="text-emerald-600 hover:text-emerald-700"
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
      width="400px"
      class="custom-modal"
    >
      <div class="text-center py-6 px-2">
        <div
          class="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100"
        >
          <check-outlined class="text-emerald-600 text-3xl" />
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-slate-600 mb-8">{{ successDescription }}</p>
        <a-button
          type="primary"
          @click="handleSuccessModalClose"
          size="large"
          class="w-full rounded-lg py-2 h-auto bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-base"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
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
} from "@ant-design/icons-vue";
import { message, Upload } from "ant-design-vue";
import type { UploadChangeParam } from "ant-design-vue";

// Define interfaces
interface ImportedItem {
  requisitionNo: string;
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
  requestDate: string;
  distributionPointName: string;
  courierCode: string;
}

// Table columns
const columns = [
  {
    title: "Requisition No.",
    dataIndex: "requisitionNo",
    key: "requisitionNo",
    width: 150,
    fixed: "left",
  },
  { title: "Bank Name", dataIndex: "bankName", key: "bankName", width: 150 },
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
  { title: "Prefix", dataIndex: "prefix", key: "prefix", width: 150 },
  { title: "Series", dataIndex: "series", key: "series", width: 150 },
  {
    title: "TR Code",
    dataIndex: "transactionCode",
    key: "transactionCode",
    width: 150,
  },
  {
    title: "No. of Leaves",
    dataIndex: "leafCount",
    key: "leafCount",
    width: 150,
  },
  { title: "Starting No.", dataIndex: "startNo", key: "startNo", width: 150 },
  { title: "Ending No.", dataIndex: "endNo", key: "endNo", width: 150 },
  { title: "No. of Book", dataIndex: "bookQty", key: "bookQty", width: 150 },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 150,
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    width: 150,
  },
  {
    title: "Distribution Point Name",
    dataIndex: "distributionPointName",
    key: "distributionPointName",
    width: 150,
  },
  {
    title: "Courier Code",
    dataIndex: "courierCode",
    key: "courierCode",
    width: 150,
  },
];

// System-generated values (read-only fields)
const requisitionId = ref(`REQ-${Math.floor(100000 + Math.random() * 900000)}`);
const bankName = ref("National Bank");
const branchName = ref("Main Branch");
const requestDate = ref(new Date().toISOString().split("T")[0]);

// File upload state
const fileInputRef = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const fileList = ref<any[]>([]);
const isProcessing = ref(false);
const isSubmitting = ref(false);

// Imported data state
const importedData = ref<ImportedItem[]>([]);
const showImportedData = ref(false);

// Success modal state
const showSuccessModal = ref(false);
const successMessage = ref("");
const successDescription = ref("");

// Handle file change from input
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0];

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isValidType =
      validTypes.includes(selectedFile.type) ||
      selectedFile.name.endsWith(".csv") ||
      selectedFile.name.endsWith(".xls") ||
      selectedFile.name.endsWith(".xlsx");

    if (!isValidType) {
      message.error("Please upload a CSV or Excel file");
      return;
    }

    // Check file size (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      message.error("File size should be less than 2MB");
      return;
    }

    file.value = selectedFile;
  }
};

// File upload handlers for a-upload-dragger
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

  if (isCSVOrExcel && isLt2M) {
    file.value = file;
  }

  return false; // Prevent auto upload
};

const handleChange = (info: UploadChangeParam) => {
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
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
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
      importedData.value = (jsonData as any[]).map((row) => ({
        requisitionNo: requisitionId.value,
        bankName: bankName.value,
        branchName: row["Branch Name"],
        routingNo: row["Routing No."],
        accountNo: row["Account No."],
        accountName: row["Account Name"],
        prefix: row["Prefix"],
        series: row["Series"],
        branchCode: row["Branch Code"],
        transactionCode: row["TR Code"],
        leafCount: row["No. of Leaves"],
        startNo: row["Starting No."],
        endNo: row["Ending No."],
        bookQty: row["No. of Book"],
        receivingBranch: row["Receiving Branch"],
        requestDate: row["Request Date"],
        distributionPointName: row["Distribution Point Name"],
        courierCode: row["Courier Code"],
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
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

// Handle form submission
const handleSubmit = () => {
  isSubmitting.value = true;

  // Simulate API call to save the data
  setTimeout(() => {
    isSubmitting.value = false;
    successMessage.value = "Requisition Submitted Successfully!";
    successDescription.value = `Your requisition with ID ${requisitionId.value} has been created with ${importedData.value.length} items.`;
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
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
  // Generate a new requisition ID for next import
  requisitionId.value = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector) {
  border-radius: 0.5rem !important;
  transition: all 0.3s;
}

:deep(.ant-upload-drag) {
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

:deep(.ant-upload-drag:hover) {
  border-color: #10b981;
  background-color: #f0fdfa;
}

:deep(.ant-btn-primary) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.ant-btn-primary:hover) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-select:hover .ant-select-selector) {
  border-color: #10b981 !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0fdfa;
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
