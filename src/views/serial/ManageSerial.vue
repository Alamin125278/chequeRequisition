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
              <div class="flex-shrink-0 bg-emerald-600 rounded-md p-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-gray-900">
                Manage the serial numbers of the cheque book
              </h1>
            </div>
            <p class="mt-2 text-sm text-gray-500 max-w-2xl">
              Manage and monitor all your cheque books and numbers in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add Serial
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cheque Table Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-gray-900">
                All Serial Numbers of Cheque Books
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                A comprehensive list of all cheque books with serial numbers in
                your system.
              </p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <a-select
                v-model:value="filterChequeType"
                placeholder="Filter by type"
                class="w-40"
                @change="onFilterChange"
              >
                <a-select-option value="">All Types</a-select-option>
                <a-select-option
                  v-for="type in uniqueChequeTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </a-select-option>
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search bank..."
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
          :dataSource="filteredCheques"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total) => `Total ${total} cheque books`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }"
          :loading="loading"
          :rowClassName="() => 'hover:bg-gray-50'"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- SL Column -->
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'sl'">
              <span>{{ index + 1 }}</span>
            </template>

            <!-- Bank Name Column -->
            <template v-if="column.key === 'bankName'">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-medium text-lg"
                >
                  {{ record.bankName.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ record.bankName }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Cheque Type Column -->
            <template v-if="column.key === 'chequeType'">
              <a-tag
                class="px-2 py-1 rounded-md"
                :color="getChequeTypeColor(record.chequeType)"
              >
                {{ record.chequeType }}
              </a-tag>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="flex justify-center space-x-2">
                <a-tooltip title="Edit Serial No">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete Serial No">
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

    <!-- Cheque Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="
        modalMode === 'add'
          ? 'Add New Cheque Book (Serial No)'
          : 'Edit Cheque Book (Serial No)'
      "
      :width="720"
      :footer="null"
      class="cheque-modal"
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
              <a-select
                v-model:value="formState.bankName"
                placeholder="Select bank name"
                class="rounded-md w-full"
              >
                <a-select-option
                  v-for="bank in bankOptions"
                  :key="bank"
                  :value="bank"
                >
                  {{ bank }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Cheque Type" name="chequeType">
              <a-select
                v-model:value="formState.chequeType"
                placeholder="Select cheque type"
                class="rounded-md w-full"
              >
                <a-select-option value="SB">SB</a-select-option>
                <a-select-option value="CD">CD</a-select-option>
                <a-select-option value="PO">PO</a-select-option>
                <a-select-option value="DD">DD</a-select-option>
                <a-select-option value="FDD">FDD</a-select-option>
                <a-select-option value="FDR">FDR</a-select-option>
                <a-select-option value="SDR">SDR</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="TR Code" name="trCode">
              <a-input
                v-model:value="formState.trCode"
                placeholder="Enter TR code"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Series" name="series">
              <a-input
                v-model:value="formState.series"
                placeholder="Enter series"
                class="rounded-md"
              />
            </a-form-item>

            <a-form-item label="Starting No" name="startingNo">
              <a-input-number
                v-model:value="formState.startingNo"
                placeholder="Enter starting number"
                class="rounded-md w-full"
                :min="1"
              />
            </a-form-item>

            <a-form-item label="Ending No" name="endingNo">
              <a-input-number
                v-model:value="formState.endingNo"
                placeholder="Enter ending number"
                class="rounded-md w-full"
                :min="formState.startingNo || 1"
              />
            </a-form-item>

            <a-form-item label="Ending Serial Limit" name="endingSerialLimit">
              <a-input-number
                v-model:value="formState.endingSerialLimit"
                placeholder="Enter ending serial limit"
                class="rounded-md w-full"
                :min="formState.endingNo || 1"
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
              class="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
            >
              {{ modalMode === "add" ? "Create" : "Save Changes" }}
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
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

// Search and filter states
const searchText = ref("");
const filterChequeType = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentChequeId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();

// Bank options for dropdown
const bankOptions = [
  "Public Bank",
  "Commercial Bank",
  "City Bank",
  "National Bank",
  "International Bank",
];

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
  chequeType: "",
  trCode: "",
  startingNo: null as number | null,
  endingNo: null as number | null,
  endingSerialLimit: null as number | null,
  series: "",
});

// Form validation rules
const rules = {
  bankName: [{ required: true, message: "Please select bank name!" }],
  chequeType: [{ required: true, message: "Please select cheque type!" }],
  trCode: [{ required: true, message: "Please input TR code!" }],
  startingNo: [{ required: true, message: "Please input starting number!" }],
  endingNo: [{ required: true, message: "Please input ending number!" }],
  endingSerialLimit: [
    { required: true, message: "Please input ending serial limit!" },
  ],
  series: [{ required: true, message: "Please input series!" }],
};

// Table columns
const columns = [
  {
    title: "SL",
    key: "sl",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    sorter: (a: any, b: any) => a.bankName.localeCompare(b.bankName),
  },
  {
    title: "Cheque Type",
    dataIndex: "chequeType",
    key: "chequeType",
    filters: [
      { text: "SB", value: "SB" },
      { text: "CD", value: "CD" },
      { text: "PO", value: "PO" },
      { text: "DD", value: "DD" },
      { text: "FDD", value: "FDD" },
      { text: "FDR", value: "FDR" },
      { text: "SDR", value: "SDR" },
    ],
    onFilter: (value: string, record: any) => record.chequeType === value,
  },
  {
    title: "TR Code",
    dataIndex: "trCode",
    key: "trCode",
  },
  {
    title: "Starting No",
    dataIndex: "startingNo",
    key: "startingNo",
    sorter: (a: any, b: any) => a.startingNo - b.startingNo,
  },
  {
    title: "Ending No",
    dataIndex: "endingNo",
    key: "endingNo",
    sorter: (a: any, b: any) => a.endingNo - b.endingNo,
  },
  {
    title: "Ending Serial Limit",
    dataIndex: "endingSerialLimit",
    key: "endingSerialLimit",
  },
  {
    title: "Series",
    dataIndex: "series",
    key: "series",
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
const cheques = ref([
  {
    id: "1",
    bankName: "Public Bank",
    chequeType: "SB",
    trCode: "TR001",
    startingNo: 1001,
    endingNo: 1100,
    endingSerialLimit: 1200,
    series: "A",
  },
  {
    id: "2",
    bankName: "Commercial Bank",
    chequeType: "CD",
    trCode: "TR002",
    startingNo: 2001,
    endingNo: 2100,
    endingSerialLimit: 2200,
    series: "B",
  },
  {
    id: "3",
    bankName: "City Bank",
    chequeType: "PO",
    trCode: "TR003",
    startingNo: 3001,
    endingNo: 3100,
    endingSerialLimit: 3200,
    series: "C",
  },
  {
    id: "4",
    bankName: "National Bank",
    chequeType: "DD",
    trCode: "TR004",
    startingNo: 4001,
    endingNo: 4100,
    endingSerialLimit: 4200,
    series: "D",
  },
  {
    id: "5",
    bankName: "International Bank",
    chequeType: "FDD",
    trCode: "TR005",
    startingNo: 5001,
    endingNo: 5100,
    endingSerialLimit: 5200,
    series: "E",
  },
  {
    id: "6",
    bankName: "Public Bank",
    chequeType: "FDR",
    trCode: "TR006",
    startingNo: 6001,
    endingNo: 6100,
    endingSerialLimit: 6200,
    series: "F",
  },
  {
    id: "7",
    bankName: "Commercial Bank",
    chequeType: "SDR",
    trCode: "TR007",
    startingNo: 7001,
    endingNo: 7100,
    endingSerialLimit: 7200,
    series: "G",
  },
]);

// Get unique cheque types for filter
const uniqueChequeTypes = computed(() => {
  const types = new Set(cheques.value.map((cheque) => cheque.chequeType));
  return Array.from(types);
});

// Get color for cheque type tag
const getChequeTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SB: "green",
    CD: "blue",
    PO: "purple",
    DD: "orange",
    FDD: "cyan",
    FDR: "magenta",
    SDR: "gold",
  };

  return colors[type] || "default";
};

// Filtered data based on search and filters
const filteredCheques = computed(() => {
  let result = [...cheques.value];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.bankName.toLowerCase().includes(search) ||
        item.chequeType.toLowerCase().includes(search) ||
        item.trCode.toLowerCase().includes(search) ||
        item.series.toLowerCase().includes(search) ||
        String(item.startingNo).includes(search) ||
        String(item.endingNo).includes(search)
    );
  }

  // Apply cheque type filter
  if (filterChequeType.value) {
    result = result.filter(
      (item) => item.chequeType === filterChequeType.value
    );
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
    // Reset form for adding new cheque book
    Object.assign(formState, {
      bankName: "",
      chequeType: "",
      trCode: "",
      startingNo: null,
      endingNo: null,
      endingSerialLimit: null,
      series: "",
    });
    currentChequeId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with cheque data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      chequeType: record.chequeType,
      trCode: record.trCode,
      startingNo: record.startingNo,
      endingNo: record.endingNo,
      endingSerialLimit: record.endingSerialLimit,
      series: record.series,
    });
    currentChequeId.value = record.id;
  }

  modalVisible.value = true;
};

// Show delete confirmation
const showDeleteConfirm = (record: any) => {
  Modal.confirm({
    title: "Are you sure you want to delete this cheque book?",
    content: `You are about to delete cheque book for "${record.bankName}" with type "${record.chequeType}". This action cannot be undone.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      // Simulate delete API call
      setTimeout(() => {
        const index = cheques.value.findIndex(
          (cheque) => cheque.id === record.id
        );
        if (index !== -1) {
          cheques.value.splice(index, 1);
          showToast("Cheque book deleted successfully", "success");
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

      // Validate that ending number is greater than starting number
      if (
        formState.endingNo &&
        formState.startingNo &&
        formState.endingNo < formState.startingNo
      ) {
        showToast(
          "Ending number must be greater than starting number",
          "error"
        );
        submitting.value = false;
        return;
      }

      // Validate that ending serial limit is greater than ending number
      if (
        formState.endingSerialLimit &&
        formState.endingNo &&
        formState.endingSerialLimit < formState.endingNo
      ) {
        showToast(
          "Ending serial limit must be greater than ending number",
          "error"
        );
        submitting.value = false;
        return;
      }

      // Simulate API call
      setTimeout(() => {
        if (modalMode.value === "add") {
          // Add new cheque book
          const newCheque = {
            id: (cheques.value.length + 1).toString(),
            ...formState,
          };
          cheques.value.push(newCheque);
          showToast("Cheque book added successfully", "success");
        } else {
          // Update existing cheque book
          const index = cheques.value.findIndex(
            (cheque) => cheque.id === currentChequeId.value
          );
          if (index !== -1) {
            cheques.value[index] = {
              ...cheques.value[index],
              ...formState,
            };
            showToast("Cheque book updated successfully", "success");
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
.cheque-modal .ant-modal-content {
  border-radius: 8px;
  overflow: hidden;
}

.cheque-modal .ant-modal-header {
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 24px;
}

.cheque-modal .ant-modal-title {
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
.ant-select-selector,
.ant-input-number {
  border-color: #e5e7eb !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover,
.ant-input-number:hover {
  border-color: #10b981 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
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
