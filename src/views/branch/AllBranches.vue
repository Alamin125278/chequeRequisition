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
                <BranchesOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                Branch Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all bank branches in one centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add New Branch
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Simplified Stats Section -->
    <div class="max-w-7xl py-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Branches Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent bg-opacity-10 rounded-md p-3">
                <BranchesOutlined class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Total Branches
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ branches.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Branches Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 bg-success bg-opacity-10 rounded-md p-3"
              >
                <CheckCircleOutlined class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Active Branches
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ activeCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Inactive Branches Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-error-light rounded-md p-3">
                <CloseCircleOutlined class="h-6 w-6 text-error" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Inactive Branches
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ branches.length - activeCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Branch Table Section -->
    <div class="max-w-7xl pb-8">
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-primary">All Branch List</h2>
              <p class="mt-1 text-sm text-secondary">
                A complete list of all bank branches in the system
              </p>
            </div>
            <div
              class="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3"
            >
              <a-select
                v-model:value="statusFilter"
                placeholder="Filter by status"
                class="w-full sm:w-40"
                allowClear
                @change="onFilterChange"
              >
                <a-select-option value="active">Active</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search branches..."
                class="w-full sm:w-64"
                @search="onSearch"
                allow-clear
              >
                <template #prefix>
                  <SearchOutlined class="text-secondary" />
                </template>
              </a-input-search>
            </div>
          </div>
        </div>

        <a-table
          :dataSource="filteredBranches"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total:number) => `Total ${total} branches`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }"
          :loading="loading"
          :rowClassName="() => 'hover:bg-background'"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- Branch Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'bankName'">
              <div class="flex items-center">
                <BankOutlined class="mr-2 text-secondary" />
                {{ record.bankName }}
              </div>
            </template>

            <template v-if="column.key === 'branchName'">
              <div class="flex items-center">
                <span class="ml-2 font-medium">{{ record.branchName }}</span>
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
                <a-tooltip title="Edit Branch">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete Branch">
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

    <!-- Branch Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'add' ? 'Add New Branch' : 'Edit Branch'"
      :width="720"
      :footer="null"
      class="branch-modal"
    >
      <div class="p-4">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <div class="mb-6 pb-4 border-b border-gray-200">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Basic Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a-form-item label="Bank Name" name="bankName">
                <a-select
                  v-model:value="formState.bankName"
                  placeholder="Select bank"
                  class="rounded-md w-full"
                >
                  <a-select-option value="">Select bank</a-select-option>
                  <a-select-option value="Public Bank"
                    >Public Bank</a-select-option
                  >
                  <a-select-option value="Commercial Bank"
                    >Commercial Bank</a-select-option
                  >
                  <a-select-option value="City Bank">City Bank</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="Branch Name" name="branchName">
                <a-input
                  v-model:value="formState.branchName"
                  placeholder="Enter branch name"
                  class="rounded-md"
                />
              </a-form-item>

              <a-form-item label="Branch Code" name="branchCode">
                <a-input
                  v-model:value="formState.branchCode"
                  placeholder="Enter branch code"
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
            </div>
          </div>

          <div class="mb-4">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Contact Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a-form-item label="Branch Email" name="branchEmail">
                <a-input
                  v-model:value="formState.branchEmail"
                  placeholder="Enter email address"
                  class="rounded-md"
                >
                  <template #prefix>
                    <MailOutlined class="text-secondary" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="Branch Phone" name="branchPhone">
                <a-input
                  v-model:value="formState.branchPhone"
                  placeholder="Enter phone number"
                  class="rounded-md"
                >
                  <template #prefix>
                    <PhoneOutlined class="text-secondary" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item
                label="Branch Address"
                name="branchAddress"
                class="md:col-span-2"
              >
                <a-textarea
                  v-model:value="formState.branchAddress"
                  placeholder="Enter complete address"
                  :rows="3"
                  class="rounded-md"
                />
              </a-form-item>
            </div>
          </div>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="modalVisible = false"> Cancel </a-button>
            <a-button
              type="primary"
              @click="handleModalSubmit"
              :loading="submitting"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              {{ modalMode === "add" ? "Create Branch" : "Save Changes" }}
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
  BankOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
const statusFilter = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentBranchId = ref<string | null>(null);
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
  branchName: "",
  branchCode: "",
  routingNumber: "",
  branchEmail: "",
  branchPhone: "",
  branchAddress: "",
  status: "active",
});

// Form validation rules
const rules = {
  bankName: [{ required: true, message: "Please select a bank" }],
  branchName: [{ required: true, message: "Please enter branch name" }],
  branchCode: [{ required: true, message: "Please enter branch code" }],
  branchEmail: [
    { required: true, message: "Please enter branch email" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  routingNumber: [{ required: true, message: "Please enter routing number" }],
  branchPhone: [{ required: true, message: "Please enter branch phone" }],
  branchAddress: [{ required: true, message: "Please enter branch address" }],
};

// Table columns
const columns = [
  {
    title: "SL No",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    sorter: (a: any, b: any) => a.bankName.localeCompare(b.bankName),
  },
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
    sorter: (a: any, b: any) => a.branchName.localeCompare(b.branchName),
  },
  {
    title: "Branch Code",
    dataIndex: "branchCode",
    key: "branchCode",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNumber",
    key: "routingNumber",
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
    title: "Branch Email",
    dataIndex: "branchEmail",
    key: "branchEmail",
  },
  {
    title: "Branch Phone",
    dataIndex: "branchPhone",
    key: "branchPhone",
  },
  {
    title: "Branch Address",
    dataIndex: "branchAddress",
    key: "branchAddress",
    ellipsis: true,
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
const branches = ref([
  {
    id: "1",
    bankName: "Public Bank",
    branchName: "Mohakhali Branch",
    branchCode: "MOH",
    branchEmail: "mohakhalibranch@gmail.com",
    routingNumber: "125278",
    branchPhone: "1234567890",
    branchAddress: "Mohakhali, Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "2",
    bankName: "Public Bank",
    branchName: "Tejgaon Branch",
    branchCode: "TEJ",
    branchEmail: "tejgaonbranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Tejgaon, Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "3",
    bankName: "Public Bank",
    branchName: "Dhaka Branch",
    branchCode: "DHA",
    branchEmail: "dhakabranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Dhaka, Bangladesh",
    status: "active",
  },
  {
    id: "4",
    bankName: "Public Bank",
    branchName: "Gulshan Branch",
    branchCode: "GUL",
    branchEmail: "gulshanbranch@gmail.com",
    routingNumber: "987654321",
    branchPhone: "0987654321",
    branchAddress: "Gulshan, Dhaka, Bangladesh",
    status: "inactive",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
    status: "active",
  },
]);

// Computed properties
const activeCount = computed(() => {
  return branches.value.filter((branch) => branch.status === "active").length;
});

// Filtered data based on search and filters
const filteredBranches = computed(() => {
  let result = [...branches.value];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.branchName.toLowerCase().includes(search) ||
        item.branchCode.toLowerCase().includes(search) ||
        item.branchEmail.toLowerCase().includes(search) ||
        item.branchPhone.toLowerCase().includes(search) ||
        item.branchAddress.toLowerCase().includes(search) ||
        item.bankName.toLowerCase().includes(search) ||
        item.routingNumber.toLowerCase().includes(search)
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value);
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
    // Reset form for adding new branch
    Object.assign(formState, {
      bankName: "",
      branchName: "",
      branchCode: "",
      routingNumber: "",
      branchEmail: "",
      branchPhone: "",
      branchAddress: "",
      status: "active",
    });
    currentBranchId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with branch data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      branchName: record.branchName,
      branchCode: record.branchCode,
      routingNumber: record.routingNumber,
      branchEmail: record.branchEmail,
      branchPhone: record.branchPhone,
      branchAddress: record.branchAddress,
      status: record.status || "active",
    });
    currentBranchId.value = record.id;
  }

  modalVisible.value = true;
};

// Show delete confirmation
const showDeleteConfirm = (record: any) => {
  Modal.confirm({
    title: "Are you sure you want to delete this branch?",
    content: `You are about to delete "${record.branchName}". This action cannot be undone.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      // Simulate delete API call
      setTimeout(() => {
        const index = branches.value.findIndex(
          (branch) => branch.id === record.id
        );
        if (index !== -1) {
          branches.value.splice(index, 1);
          showToast("Branch deleted successfully", "success");
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
          // Add new branch
          const newBranch = {
            id: (branches.value.length + 1).toString(),
            ...formState,
          };
          branches.value.push(newBranch);
          showToast("Branch added successfully", "success");
        } else {
          // Update existing branch
          const index = branches.value.findIndex(
            (branch) => branch.id === currentBranchId.value
          );
          if (index !== -1) {
            branches.value[index] = {
              ...branches.value[index],
              ...formState,
            };
            showToast("Branch updated successfully", "success");
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
:root {
  /* Color Palette */
  --primary-ui: #2e2e2e;
  --accent-cta: #6b8e23;
  --success: #228b22;
  --error: #c0392b;
  --error-light: #fadbd8;
  --background: #f5f5f5;
  --card-bg: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6e6e6e;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

/* Custom colors */
.bg-primary {
  background-color: var(--primary-ui) !important;
}

.bg-accent {
  background-color: var(--accent-cta) !important;
}

.bg-success {
  background-color: var(--success) !important;
}

.bg-error {
  background-color: var(--error) !important;
}

.bg-error-light {
  background-color: var(--error-light) !important;
}

.bg-background {
  background-color: var(--background) !important;
}

.bg-card {
  background-color: var(--card-bg) !important;
}

.text-primary {
  color: var(--text-primary) !important;
}

.text-secondary {
  color: var(--text-secondary) !important;
}

.text-accent {
  color: var(--accent-cta) !important;
}

.text-success {
  color: var(--success) !important;
}

.text-error {
  color: var(--error) !important;
}

.border-accent {
  border-color: var(--accent-cta) !important;
}

.bg-accent-dark {
  background-color: #5a7a1f !important;
}

.border-accent-dark {
  border-color: #5a7a1f !important;
}

/* Custom table styles */
.custom-table .ant-table-thead > tr > th {
  background-color: var(--background);
  font-weight: 600;
  color: var(--text-primary);
  padding: 16px;
}

.custom-table .ant-table-tbody > tr > td {
  padding: 16px;
  color: var(--text-primary);
}

.custom-table .ant-table-tbody > tr:hover > td {
  background-color: var(--background);
}

/* Custom modal styles */
.branch-modal .ant-modal-content {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.branch-modal .ant-modal-header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.branch-modal .ant-modal-title {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
}

/* Custom form styles */
.ant-form-item-label > label {
  font-weight: 500;
  color: var(--text-primary);
}

.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover {
  border-color: var(--accent-cta) !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 139, 34, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
}

.ant-tag-error {
  background-color: var(--error-light) !important;
  border-color: var(--error) !important;
  color: var(--error) !important;
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

/* Ant Design button overrides */
.ant-btn-primary {
  background-color: var(--accent-cta) !important;
  border-color: var(--accent-cta) !important;
  border-radius: var(--radius-md) !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #5a7a1f !important;
  border-color: #5a7a1f !important;
}

/* Exception for danger buttons */
.ant-btn-dangerous.ant-btn-primary {
  background-color: var(--error) !important;
  border-color: var(--error) !important;
}

.ant-btn-dangerous.ant-btn-primary:hover,
.ant-btn-dangerous.ant-btn-primary:focus {
  background-color: #a93226 !important;
  border-color: #a93226 !important;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: var(--shadow-sm) !important;
}

.shadow-md {
  box-shadow: var(--shadow-md) !important;
}

.shadow-lg {
  box-shadow: var(--shadow-lg) !important;
}

/* Rounded utilities */
.rounded-sm {
  border-radius: var(--radius-sm) !important;
}

.rounded-md {
  border-radius: var(--radius-md) !important;
}

.rounded-lg {
  border-radius: var(--radius-lg) !important;
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
