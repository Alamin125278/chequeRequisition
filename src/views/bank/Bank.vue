<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-600 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-gray-900">
                Bank Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-gray-500 max-w-2xl">
              Manage and monitor all your banking institutions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add New Bank
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Stats Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Banks Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <BankOutlined class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Banks
                  </dt>
                  <dd>
                    <div class="text-lg font-semibold text-gray-900">
                      {{ banks.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <div class="flex justify-between items-center">
                <div class="text-green-600 font-medium flex items-center">
                  <ArrowUpOutlined class="mr-1" />
                  <span>12% increase</span>
                </div>
                <span class="text-gray-500">from last month</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Banks Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircleOutlined class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Active Banks
                  </dt>
                  <dd>
                    <div class="text-lg font-semibold text-gray-900">
                      {{
                        banks.filter((bank) => bank.status === "active").length
                      }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="mt-4">
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block text-green-600"
                    >
                      {{
                        Math.round(
                          (banks.filter((bank) => bank.status === "active")
                            .length /
                            banks.length) *
                            100
                        )
                      }}% Active Rate
                    </span>
                  </div>
                </div>
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-green-100"
                >
                  <div
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
                    :style="`width: ${Math.round(
                      (banks.filter((bank) => bank.status === 'active').length /
                        banks.length) *
                        100
                    )}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm flex justify-between">
              <span class="text-gray-500"
                >Active:
                {{
                  banks.filter((bank) => bank.status === "active").length
                }}</span
              >
              <span class="text-gray-500"
                >Inactive:
                {{
                  banks.filter((bank) => bank.status === "inactive").length
                }}</span
              >
            </div>
          </div>
        </div>

        <!-- Last Updated Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <ClockCircleOutlined class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Last Updated
                  </dt>
                  <dd>
                    <div class="text-lg font-semibold text-gray-900">Today</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="mt-4 flex flex-col space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <CalendarOutlined class="mr-2" />
                <span>{{
                  new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <ClockCircleOutlined class="mr-2" />
                <span>{{
                  new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <span class="text-gray-500">System time synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Table Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-gray-900">All Bank List</h2>
              <p class="mt-1 text-sm text-gray-500">
                A complete list of all the banks in your system
              </p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <a-select
                v-model:value="filterStatus"
                placeholder="Filter by status"
                class="w-40"
                @change="onFilterChange"
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="active">Active</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search banks..."
                class="w-full md:w-64"
                @search="onSearch"
                allow-clear
              >
                <template #prefix>
                  <SearchOutlined class="text-gray-400" />
                </template>
              </a-input-search>
            </div>
          </div>
        </div>

        <a-table
          :dataSource="filteredBanks"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total) => `Total ${total} banks`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }"
          :loading="loading"
          :rowClassName="() => 'hover:bg-gray-50'"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- Bank Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'bankName'">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-medium text-lg"
                >
                  {{ record.bankName.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ record.bankName }}
                  </div>
                  <div class="text-xs text-gray-500">
                    Code: {{ record.bankCode }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag
                :color="record.status === 'active' ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.status === "active" ? "Active" : "Inactive" }}
              </a-tag>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="flex justify-center space-x-2">
                <a-tooltip title="Edit Bank">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete Bank">
                  <a-button
                    type="primary"
                    shape="circle"
                    danger
                    class="flex items-center justify-center"
                    @click="showDeleteConfirm(record)"
                  >
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Bank Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'add' ? 'Add New Bank' : 'Edit Bank'"
      :width="720"
      :footer="null"
      class="bank-modal"
    >
      <div class="p-4">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a-form-item label="Bank Name" name="bankName">
              <a-input
                v-model:value="formState.bankName"
                placeholder="Enter bank name"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Bank Code" name="bankCode">
              <a-input
                v-model:value="formState.bankCode"
                placeholder="Enter bank code"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Routing Number" name="routingNumber">
              <a-input
                v-model:value="formState.routingNumber"
                placeholder="Enter routing number"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Bank Email" name="bankEmail">
              <a-input
                v-model:value="formState.bankEmail"
                placeholder="Enter email address"
                class="rounded-md"
              >
                <template #prefix>
                  <MailOutlined class="text-gray-400" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="Bank Phone" name="bankPhone">
              <a-input
                v-model:value="formState.bankPhone"
                placeholder="Enter phone number"
                class="rounded-md"
              >
                <template #prefix>
                  <PhoneOutlined class="text-gray-400" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="Status" name="status">
              <a-select
                v-model:value="formState.status"
                placeholder="Select status"
                class="rounded-md w-full"
              >
                <a-select-option value="active">Active</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="Bank Address"
              name="bankAddress"
              class="md:col-span-2"
            >
              <a-textarea
                v-model:value="formState.bankAddress"
                placeholder="Enter complete address"
                :rows="3"
                class="rounded-md"
              />
            </a-form-item>
          </div>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="modalVisible = false"> Cancel </a-button>
            <a-button
              type="primary"
              @click="handleModalSubmit"
              :loading="submitting"
              class="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            >
              {{ modalMode === "add" ? "Create Bank" : "Save Changes" }}
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <a-alert
        v-for="(toast, index) in toasts"
        :key="index"
        :message="toast.message"
        :type="toast.type"
        showIcon
        closable
        class="mb-3 shadow-sm rounded-md"
        @close="removeToast(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

// Search and filter states
const searchText = ref("");
const filterStatus = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentBankId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();

// Toast notifications
interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
}

const toasts = ref<Toast[]>([]);

// Form state for modal
const formState = reactive({
  bankName: "",
  bankCode: "",
  routingNumber: "",
  bankEmail: "",
  bankPhone: "",
  bankAddress: "",
  status: "active",
});

// Form validation rules
const rules = {
  bankName: [{ required: true, message: "Please input bank name!" }],
  bankCode: [{ required: true, message: "Please input bank code!" }],
  routingNumber: [{ required: true, message: "Please input routing number!" }],
  bankEmail: [
    { required: true, message: "Please input bank email!" },
    { type: "email", message: "Please enter a valid email address!" },
  ],
  bankPhone: [{ required: true, message: "Please input bank phone!" }],
  bankAddress: [{ required: true, message: "Please input bank address!" }],
  status: [{ required: true, message: "Please select status!" }],
};

// Table columns
const columns = [
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    sorter: (a: any, b: any) => a.bankName.localeCompare(b.bankName),
  },
  {
    title: "Routing Number",
    dataIndex: "routingNumber",
    key: "routingNumber",
  },
  {
    title: "Bank Email",
    dataIndex: "bankEmail",
    key: "bankEmail",
  },
  {
    title: "Bank Phone",
    dataIndex: "bankPhone",
    key: "bankPhone",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
    ],
    onFilter: (value: string, record: any) => record.status === value,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 120,
    align: "center",
  },
];

// Sample data
const banks = ref([
  {
    id: "1",
    bankName: "Public Bank",
    bankCode: "PB",
    routingNumber: "123456789",
    bankEmail: "publicbank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "2",
    bankName: "Commercial Bank",
    bankCode: "CB",
    routingNumber: "123456789",
    bankEmail: "commercialbank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "3",
    bankName: "City Bank",
    bankCode: "CB",
    routingNumber: "123456789",
    bankEmail: "citybank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
    status: "inactive",
  },
  {
    id: "4",
    bankName: "National Bank",
    bankCode: "NB",
    routingNumber: "987654321",
    bankEmail: "nationalbank@gmail.com",
    bankPhone: "9876543210",
    bankAddress: "Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "5",
    bankName: "International Bank",
    bankCode: "IB",
    routingNumber: "456789123",
    bankEmail: "internationalbank@gmail.com",
    bankPhone: "4567891230",
    bankAddress: "Dhaka, Bangladesh",
    status: "active",
  },
]);

// Filtered data based on search and filters
const filteredBanks = computed(() => {
  let result = [...banks.value];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.bankName.toLowerCase().includes(search) ||
        item.bankCode.toLowerCase().includes(search) ||
        item.bankEmail.toLowerCase().includes(search) ||
        item.bankPhone.toLowerCase().includes(search) ||
        item.bankAddress.toLowerCase().includes(search)
    );
  }

  // Apply status filter
  if (filterStatus.value) {
    result = result.filter((item) => item.status === filterStatus.value);
  }

  return result;
});

// Search function
const onSearch = () => {
  simulateLoading();
};

// Filter change function
const onFilterChange = () => {
  simulateLoading();
};

// Simulate loading for better UX
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// Show modal for adding or editing
const showModal = (mode: "add" | "edit", record?: any) => {
  modalMode.value = mode;

  if (mode === "add") {
    // Reset form for adding new bank
    Object.assign(formState, {
      bankName: "",
      bankCode: "",
      routingNumber: "",
      bankEmail: "",
      bankPhone: "",
      bankAddress: "",
      status: "active",
    });
    currentBankId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with bank data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      bankCode: record.bankCode,
      routingNumber: record.routingNumber,
      bankEmail: record.bankEmail,
      bankPhone: record.bankPhone,
      bankAddress: record.bankAddress,
      status: record.status || "active",
    });
    currentBankId.value = record.id;
  }

  modalVisible.value = true;
};

// Show delete confirmation
const showDeleteConfirm = (record: any) => {
  Modal.confirm({
    title: "Are you sure you want to delete this bank?",
    content: `You are about to delete "${record.bankName}". This action cannot be undone.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      // Simulate delete API call
      setTimeout(() => {
        const index = banks.value.findIndex((bank) => bank.id === record.id);
        if (index !== -1) {
          banks.value.splice(index, 1);
          showToast("Bank deleted successfully", "success");
        }
      }, 1000);
    },
  });
};

// Handle modal submit
const handleModalSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      submitting.value = true;

      // Simulate API call
      setTimeout(() => {
        if (modalMode.value === "add") {
          // Add new bank
          const newBank = {
            id: (banks.value.length + 1).toString(),
            ...formState,
          };
          banks.value.push(newBank);
          showToast("Bank added successfully", "success");
        } else {
          // Update existing bank
          const index = banks.value.findIndex(
            (bank) => bank.id === currentBankId.value
          );
          if (index !== -1) {
            banks.value[index] = {
              ...banks.value[index],
              ...formState,
            };
            showToast("Bank updated successfully", "success");
          }
        }

        submitting.value = false;
        modalVisible.value = false;
      }, 1000);
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};

// Toast notifications
const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration: number = 3000
) => {
  const toast: Toast = {
    message,
    type,
    duration,
  };

  toasts.value.push(toast);

  // Auto remove toast after duration
  setTimeout(() => {
    removeToast(toasts.value.indexOf(toast));
  }, duration);
};

const removeToast = (index: number) => {
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Lifecycle hooks
onMounted(() => {
  // Simulate initial loading
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style>
/* Custom table styles */
.custom-table .ant-table-thead > tr > th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #111827;
  padding: 16px;
}

.custom-table .ant-table-tbody > tr > td {
  padding: 16px;
}

.custom-table .ant-table-tbody > tr:hover > td {
  background-color: #f3f4f6;
}

/* Custom modal styles */
.bank-modal .ant-modal-content {
  border-radius: 8px;
  overflow: hidden;
}

.bank-modal .ant-modal-header {
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 24px;
}

.bank-modal .ant-modal-title {
  font-weight: 600;
  font-size: 18px;
  color: #111827;
}

/* Custom form styles */
.ant-form-item-label > label {
  font-weight: 500;
  color: #374151;
}

.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector {
  border-color: #e5e7eb !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover {
  border-color: #2563eb !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: #ecfdf5 !important;
  border-color: #d1fae5 !important;
  color: #047857 !important;
}

.ant-tag-error {
  background-color: #fef2f2 !important;
  border-color: #fee2e2 !important;
  color: #b91c1c !important;
}

/* Toast container */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 350px;
}

/* Center icons in buttons */
.ant-btn-circle {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }

  .ant-btn-circle {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.875rem !important;
  }
}
</style>
