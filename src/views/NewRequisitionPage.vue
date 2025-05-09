<template>
  <div
    class="mb-6 cheque-requisition-container p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen"
  >
    <!-- Header Card -->
    <a-card :bordered="false" class="mb-6 shadow-sm rounded-lg overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800 mb-1">
            Cheque Requisition
          </h1>
          <p class="text-gray-600 text-sm">
            Create a new cheque requisition or import from a file
          </p>
        </div>
        <a-button
          type="primary"
          @click="showImportModal = true"
          class="mt-4 sm:mt-0 self-start sm:self-auto"
          size="large"
        >
          <template #icon><upload-outlined /></template>
          Import File
        </a-button>
      </div>
    </a-card>

    <!-- Main Form Card -->
    <a-card :bordered="false" class="shadow-sm rounded-lg overflow-hidden">
      <template #title>
        <h2 class="text-lg font-bold text-gray-800">New Cheque Requisition</h2>
      </template>

      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="onFinish"
        class="cheque-form"
      >
        <!-- Account Information Section -->
        <div class="mb-6">
          <h3
            class="text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center"
          >
            <bank-outlined class="mr-2 text-blue-600" />
            Account Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a-form-item label="Account Number" name="accountNo">
              <a-input
                v-model:value="formState.accountNo"
                placeholder="Enter account number"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Routing Number" name="routingNo">
              <a-input
                v-model:value="formState.routingNo"
                placeholder="Enter routing number"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Account Name" name="accountName">
              <a-input
                v-model:value="formState.accountName"
                placeholder="Enter account name"
                :maxlength="60"
                show-count
                size="large"
                class="rounded-md"
              />
            </a-form-item>
          </div>
        </div>

        <!-- Cheque Details Section -->
        <div class="mb-6">
          <h3
            class="text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center"
          >
            <file-text-outlined class="mr-2 text-blue-600" />
            Cheque Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a-form-item label="Start Number" name="startNo">
              <a-input-number
                v-model:value="formState.startNo"
                placeholder="Enter start number"
                class="w-full rounded-md"
                :min="0"
                size="large"
              />
            </a-form-item>

            <a-form-item label="End Number" name="endNo">
              <a-input-number
                v-model:value="formState.endNo"
                placeholder="Enter end number"
                class="w-full rounded-md"
                :min="0"
                size="large"
              />
            </a-form-item>

            <a-form-item label="Prefix" name="prefix">
              <a-input
                v-model:value="formState.prefix"
                placeholder="Enter prefix"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Series" name="series">
              <a-input
                v-model:value="formState.series"
                placeholder="Enter series"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Severity" name="severity">
              <a-select
                v-model:value="formState.severity"
                placeholder="Select severity"
                size="large"
                class="w-full rounded-md"
              >
                <a-select-option value="Low">
                  <span class="flex items-center">
                    <span class="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Low
                  </span>
                </a-select-option>
                <a-select-option value="Medium">
                  <span class="flex items-center">
                    <span
                      class="h-2 w-2 rounded-full bg-yellow-500 mr-2"
                    ></span>
                    Medium
                  </span>
                </a-select-option>
                <a-select-option value="High">
                  <span class="flex items-center">
                    <span class="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    High
                  </span>
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Book Quantity" name="bookQty">
              <a-input-number
                v-model:value="formState.bookQty"
                placeholder="Enter book quantity"
                class="w-full rounded-md"
                :min="1"
                size="large"
              />
            </a-form-item>
          </div>
        </div>

        <!-- Branch & Transaction Section -->
        <div class="mb-6">
          <h3
            class="text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center"
          >
            <bank-outlined class="mr-2 text-blue-600" />
            Branch & Transaction Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a-form-item label="Branch Name" name="branchName">
              <a-select
                v-model:value="formState.branchName"
                placeholder="Select branch"
                show-search
                :filter-option="filterOption"
                size="large"
                class="w-full rounded-md"
              >
                <a-select-option
                  v-for="branch in branches"
                  :key="branch.id"
                  :value="branch.name"
                >
                  {{ branch.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Transaction Code" name="transactionCode">
              <a-input-number
                v-model:value="formState.transactionCode"
                placeholder="Enter transaction code"
                class="w-full rounded-md"
                :min="0"
                size="large"
              />
            </a-form-item>

            <a-form-item label="Leaf Count" name="leafCount">
              <a-input-number
                v-model:value="formState.leafCount"
                placeholder="Enter leaf count"
                class="w-full rounded-md"
                :min="1"
                size="large"
              />
            </a-form-item>

            <a-form-item label="Courier Code" name="courierCode">
              <a-input
                v-model:value="formState.courierCode"
                placeholder="Enter courier code"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item
              label="Distribution Point"
              name="distributionPointName"
            >
              <a-input
                v-model:value="formState.distributionPointName"
                placeholder="Enter distribution point"
                size="large"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Receiving Branch" name="receivingBranch">
              <a-select
                v-model:value="formState.receivingBranch"
                placeholder="Select receiving branch"
                show-search
                :filter-option="filterOption"
                size="large"
                class="w-full rounded-md"
              >
                <a-select-option
                  v-for="branch in branches"
                  :key="branch.id"
                  :value="branch.name"
                >
                  {{ branch.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>

        <!-- Customer Address Section -->
        <div class="mb-6">
          <h3
            class="text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center"
          >
            <home-outlined class="mr-2 text-blue-600" />
            Customer Address
          </h3>
          <a-form-item label="Address" name="cusAddress">
            <a-textarea
              v-model:value="formState.cusAddress"
              placeholder="Enter customer address"
              :rows="3"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              class="rounded-md"
            />
          </a-form-item>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <a-button @click="resetForm" size="large" class="rounded-md">
            Reset
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
            size="large"
            class="rounded-md bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            Submit Requisition
          </a-button>
        </div>
      </a-form>
    </a-card>

    <!-- Import Modal -->
    <a-modal
      v-model:visible="showImportModal"
      title="Import Cheque Requisition Data"
      :footer="null"
      width="600px"
      class="rounded-lg overflow-hidden"
    >
      <div class="mb-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <div class="flex">
            <info-circle-outlined class="text-blue-500 mt-1 mr-2" />
            <p class="text-blue-700">
              Upload a CSV or Excel file containing cheque requisition data. The
              file should include all required fields.
            </p>
          </div>
        </div>

        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          @change="handleChange"
          accept=".csv,.xls,.xlsx"
          class="mb-4"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined class="text-blue-500" />
          </p>
          <p class="ant-upload-text font-medium text-gray-800">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint text-gray-500">
            Support for a single upload. Only CSV, XLS, or XLSX files.
          </p>
        </a-upload-dragger>

        <div class="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Required Columns:
          </h4>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              Account Number
            </div>
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              Routing Number
            </div>
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              Start Number
            </div>
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              End Number
            </div>
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              Branch Name
            </div>
            <div class="flex items-center">
              <check-circle-outlined class="text-green-500 mr-1" />
              Account Name
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <a-button
          @click="showImportModal = false"
          size="large"
          class="rounded-md"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          @click="uploadFile"
          :disabled="fileList.length === 0 || uploading"
          :loading="uploading"
          size="large"
          class="rounded-md bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
        >
          {{ uploading ? "Uploading" : "Upload" }}
        </a-button>
      </div>
    </a-modal>

    <!-- Success Message -->
    <a-modal
      v-model:visible="showSuccessModal"
      :footer="null"
      :closable="false"
      width="400px"
      class="rounded-lg overflow-hidden"
    >
      <div class="text-center py-4">
        <div
          class="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100"
        >
          <check-outlined class="text-green-500 text-2xl" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          {{ successMessage }}
        </h3>
        <p class="text-gray-600 mb-6">{{ successDescription }}</p>
        <a-button
          type="primary"
          @click="handleSuccessModalClose"
          size="large"
          class="w-full rounded-md bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import {
  UploadOutlined,
  InboxOutlined,
  BankOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import { message, Upload } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { UploadChangeParam } from "ant-design-vue";

// Define interfaces
interface FormState {
  accountNo: string;
  routingNo: string;
  startNo: number | null;
  endNo: number | null;
  prefix: string;
  series: string;
  severity: string;
  branchName: string;
  accountName: string;
  cusAddress: string;
  bookQty: number | null;
  transactionCode: number | null;
  leafCount: number | null;
  courierCode: string;
  distributionPointName: string;
  receivingBranch: string;
}

interface Branch {
  id: number;
  name: string;
}

// Form state
const formState = reactive<FormState>({
  accountNo: "",
  routingNo: "",
  startNo: null,
  endNo: null,
  prefix: "",
  series: "",
  severity: "Medium",
  branchName: "",
  accountName: "",
  cusAddress: "",
  bookQty: null,
  transactionCode: null,
  leafCount: null,
  courierCode: "",
  distributionPointName: "",
  receivingBranch: "",
});

// Form validation rules
const rules: Record<string, Rule[]> = {
  accountNo: [
    { required: true, message: "Please input account number", trigger: "blur" },
  ],
  routingNo: [
    { required: true, message: "Please input routing number", trigger: "blur" },
  ],
  startNo: [
    { required: true, message: "Please input start number", trigger: "blur" },
  ],
  endNo: [
    { required: true, message: "Please input end number", trigger: "blur" },
  ],
  branchName: [
    { required: true, message: "Please select branch name", trigger: "change" },
  ],
  accountName: [
    { required: true, message: "Please input account name", trigger: "blur" },
  ],
  bookQty: [
    { required: true, message: "Please input book quantity", trigger: "blur" },
  ],
  transactionCode: [
    {
      required: true,
      message: "Please input transaction code",
      trigger: "blur",
    },
  ],
  leafCount: [
    { required: true, message: "Please input leaf count", trigger: "blur" },
  ],
};

// Form ref for validation
const formRef = ref();

// Mock data for branches (would come from API in real app)
const branches = ref<Branch[]>([
  { id: 1, name: "Main Branch" },
  { id: 2, name: "North Branch" },
  { id: 3, name: "South Branch" },
  { id: 4, name: "East Branch" },
  { id: 5, name: "West Branch" },
]);

// State for form submission
const submitting = ref<boolean>(false);

// State for import modal
const showImportModal = ref<boolean>(false);
const fileList = ref<any[]>([]);
const uploading = ref<boolean>(false);

// State for success modal
const showSuccessModal = ref<boolean>(false);
const successMessage = ref<string>("");
const successDescription = ref<string>("");

// Filter function for select components
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// Form submission handler
const onFinish = (values: FormState) => {
  submitting.value = true;

  // Simulate API call
  setTimeout(() => {
    console.log("Form submitted:", values);
    submitting.value = false;

    // Show success modal
    successMessage.value = "Requisition Submitted!";
    successDescription.value =
      "Your cheque requisition has been submitted successfully.";
    showSuccessModal.value = true;
  }, 1500);
};

// Reset form
const resetForm = () => {
  formRef.value.resetFields();
};

// File upload handlers
const beforeUpload = (file: File) => {
  const isCSVOrExcel =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isCSVOrExcel) {
    message.error("You can only upload CSV or Excel files!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("File must be smaller than 2MB!");
  }

  return (isCSVOrExcel && isLt2M) || Upload.LIST_IGNORE;
};

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "removed") {
    fileList.value = [];
  }
};

const uploadFile = () => {
  if (fileList.value.length === 0) {
    return;
  }

  uploading.value = true;

  // Simulate file upload
  setTimeout(() => {
    uploading.value = false;
    fileList.value = [];
    showImportModal.value = false;

    // Show success modal
    successMessage.value = "File Uploaded Successfully!";
    successDescription.value =
      "Your file has been processed and the form has been populated with the data.";
    showSuccessModal.value = true;

    // Simulate populating the form with data from the file
    populateFormWithSampleData();
  }, 2000);
};

// Success modal handler
const handleSuccessModalClose = () => {
  showSuccessModal.value = false;
};

// Helper function to populate form with sample data (simulating file import)
const populateFormWithSampleData = () => {
  formState.accountNo = "1234567890";
  formState.routingNo = "987654321";
  formState.startNo = 1001;
  formState.endNo = 1100;
  formState.prefix = "CHQ";
  formState.series = "A";
  formState.severity = "Medium";
  formState.branchName = "Main Branch";
  formState.accountName = "Global Enterprises Ltd.";
  formState.cusAddress = "123 Business Avenue, Financial District, City";
  formState.bookQty = 5;
  formState.transactionCode = 42;
  formState.leafCount = 100;
  formState.courierCode = "EXP123";
  formState.distributionPointName = "Central Distribution";
  formState.receivingBranch = "North Branch";
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-select) {
  width: 100%;
}

:deep(.ant-card-head-title) {
  padding: 16px 0;
}

:deep(.ant-upload-drag) {
  border: 2px dashed #d9d9d9;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

:deep(.ant-upload-drag:hover) {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

:deep(.ant-btn-primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.ant-btn-primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-select:hover .ant-select-selector) {
  border-color: #3b82f6 !important;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cheque-form {
    padding: 0;
  }
}

/* Animation for success modal */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-center {
  animation: fadeIn 0.3s ease-out;
}
</style>
