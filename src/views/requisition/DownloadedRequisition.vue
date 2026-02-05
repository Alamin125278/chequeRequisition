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
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-2">
                <DownloadOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-purple-500">Downloaded</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all downloaded cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600"
                @click="refreshData"
              >
                <template #icon><ReloadOutlined /></template>
                Refresh
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="mx-auto py-6">
      <!-- Search and Filter Section -->
      <div class="bg-card shadow-md rounded-md p-4 mb-6">
        <h3
          class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
        >
          Filter Downloaded Items
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by account number or name"
            class="w-full"
            @search="downloadedRequisitionStore.setSearch"
            allow-clear
          >
            <template #prefix>
              <SearchOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full"
            @change="downloadedRequisitionStore.setBank"
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

          <a-select
            v-model:value="branchFilter"
            placeholder="Select Branch"
            class="w-full"
            show-search
            option-filter-prop="label"
            @change="downloadedRequisitionStore.setBranch"
            :disabled="!downloadedRequisitionStore.bank"
            allowClear
          >
            <a-select-option value="" label="All Branches">
              All Branches
            </a-select-option>
            <a-select-option
              v-for="branch in downloadedRequisitionStore.branches"
              :key="branch.id"
              :value="branch.id"
              :label="branch.branchName"
            >
              {{ branch.branchName }}
            </a-select-option>
          </a-select>

          <a-select
            placeholder="Filter by severity"
            class="w-full"
            @change="downloadedRequisitionStore.setSeverity"
            allowClear
          >
            <a-select-option value="1">Urgent</a-select-option>
            <a-select-option value="2">Normal</a-select-option>
          </a-select>

          <a-date-picker
            v-model:value="dateRange"
            @change="downloadedRequisitionStore.setRequestDate"
            class="w-full"
            placeholder="Select Request Date"
          />

          <a-input-search
            v-model:value="challanNoFilter"
            placeholder="Filter by Challan No"
            class="w-full"
            @search="downloadedRequisitionStore.setChallanNo"
            allowClear
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input-search>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex flex-wrap gap-3 items-center">
          <a-tooltip title="Dispatch all selected items">
            <a-button
              v-if="hasSelectedItems"
              type="primary"
              @click="handleBulkDispatch"
              class="bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600"
              :disabled="!selectedItemsSameBank"
            >
              <template #icon><SendOutlined /></template>
              Dispatch Selected ({{ selectedRowKeys.length }})
            </a-button>
          </a-tooltip>

          <span
            v-if="selectedRowKeys.length > 0"
            class="text-sm text-secondary ml-2"
          >
            {{ selectedRowKeys.length }} item(s) selected
          </span>
        </div>

        <div
          v-if="!selectedItemsSameBank && hasSelectedItems"
          class="text-error text-sm"
        >
          {{ mixedBankErrorMessage }}
        </div>
      </div>

      <!-- Downloaded Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <a-table
          :dataSource="downloadedRequisitionStore.downloadedRequisition"
          :columns="downloadedItemColumns"
          :loading="loading"
          :pagination="pagination"
          :rowSelection="rowSelection"
          @change="downloadPagination"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1200 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record }">
            <!-- Severity Column -->
            <template v-if="column.key === 'serverity'">
              <a-tag
                :color="
                  record.serverity === 1
                    ? 'error'
                    : record.serverity === 2
                      ? 'warning'
                      : 'default'
                "
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{
                  record.serverity === 1
                    ? "Urgent"
                    : record.serverity === 2
                      ? "Normal"
                      : "Unknown"
                }}
              </a-tag>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'statusName'">
              <a-tag
                color="purple"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.statusName }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex flex-wrap justify-center gap-1">
                <!-- Dispatch Button -->
                <a-tooltip title="Dispatch this requisition">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-dispatch"
                    @click="dispatchItem(record)"
                  >
                    <CarOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>

        <!-- Empty State -->
      </div>
    </div>

    <!-- Confirmation Modal -->
    <a-modal
      v-model:visible="confirmModalVisible"
      :title="confirmModalTitle"
      :width="500"
      :footer="null"
      class="confirm-modal"
    >
      <div class="p-4">
        <p class="mb-6 text-secondary">{{ confirmModalMessage }}</p>

        <div
          class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
        >
          <a-button @click="confirmModalVisible = false"> Cancel </a-button>
          <a-button
            type="primary"
            @click="handleConfirmAction"
            class="bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600"
          >
            {{ confirmModalOkText }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  CarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";
import { UpdateChequeStatusService } from "../../services/requisition/DownloadRequisition.service";
import {
  useDownloadedRequisitionStore,
  type DownloadRequisition,
} from "../../stores/downloadedRequisitionStore";

interface Bank {
  id: number;
  bankName: string;
}

// State variables
const loading = ref(true);
const searchText = ref("");
const severityFilter = ref("");
const bankFilter = ref("");
const branchFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const selectedRows = ref<DownloadRequisition[]>([]);
const selectedRowKeys = ref<number[]>([]);
const confirmModalVisible = ref(false);
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalOkText = ref("");
const confirmModalAction = ref("");
const confirmModalButtonClass = ref("");
const itemToAction = ref<number[]>([]);
const challanNoFilter = ref("");

const downloadedRequisitionStore = useDownloadedRequisitionStore();

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

onMounted(() => {
  downloadedRequisitionStore.resetFilters();
  downloadedRequisitionStore.fetchDownloadRequisitions();
  // Get the banks from the database
  featchBanks();
});

const pagination = computed(() => ({
  current:
    Math.floor(
      downloadedRequisitionStore.skip / downloadedRequisitionStore.limit,
    ) + 1,
  pageSize: downloadedRequisitionStore.limit,
  total: downloadedRequisitionStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "100", "500", "1000"],
  showTotal: (total: number) => `Total ${total} Downloaded Requisitions`,
}));

const downloadPagination = (p: any) =>
  downloadedRequisitionStore.setPagination(p.current, p.pageSize);

// Computed property to check if any items are selected
const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[], rows: DownloadRequisition[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

// Check if all selected items belong to the same bank
const selectedItemsSameBank = computed(() => {
  if (selectedRowKeys.value.length <= 1) return true;

  const selectedItems = selectedRows.value.filter((item) =>
    selectedRowKeys.value.includes(item.id),
  );

  if (selectedItems.length === 0) return true;

  const firstBankName = selectedItems[0].bankName;
  return selectedItems.every((item) => item.bankName === firstBankName);
});

// Get the error message for mixed bank selection
const mixedBankErrorMessage = computed(() => {
  if (selectedItemsSameBank.value) return "";
  return "Cannot dispatch items from different banks together";
});

// Downloaded item columns for the table
const downloadedItemColumns = [
  {
    title: "Bank",
    dataIndex: "bankName",
    key: "bankName",
    width: 150,
  },
  {
    title: "Challan No",
    dataIndex: "challanNumber",
    key: "challanNumber",
    width: 150,
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
    width: 150,
  },
  {
    title: "Account Name",
    dataIndex: "accountName",
    key: "accountName",
    width: 180,
  },
  {
    title: "Home Branch",
    dataIndex: "branchName",
    key: "branchName",
    width: 150,
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranchName",
    key: "receivingBranchName",
    width: 150,
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
    width: 120,
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
    width: 120,
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
    width: 120,
  },
  {
    title: "Severity",
    dataIndex: "serverity",
    key: "serverity",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "statusName",
    key: "statusName",
    width: 120,
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    width: 150,
    render: (text: string) => formatDate(text),
  },

  {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 100,
    align: "center",
  },
];

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Refresh data
const refreshData = () => {
  loading.value = true;
  selectedRowKeys.value = [];
  setTimeout(() => {
    downloadedRequisitionStore.resetFilters();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

// Dispatch a single item
const dispatchItem = (record: DownloadRequisition) => {
  confirmModalTitle.value = `Dispatch Item`;
  confirmModalMessage.value = `Are you sure you want to dispatch this item to the next stage?`;
  confirmModalOkText.value = "Dispatch";
  confirmModalAction.value = "dispatch";
  itemToAction.value = [record.id];
  confirmModalVisible.value = true;
};

// Handle bulk Dispatch
const handleBulkDispatch = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning("Please select at least one item");
    return;
  }

  if (!selectedItemsSameBank.value) {
    message.error("Cannot dispatch items from different banks together");
    return;
  }

  confirmModalTitle.value = `Dispatch Selected Items`;
  confirmModalMessage.value = `Are you sure you want to dispatch ${selectedRowKeys.value.length} selected item(s) to the next stage?`;
  confirmModalOkText.value = "Dispatch All";
  confirmModalAction.value = "bulkDispatch";
  confirmModalVisible.value = true;
};

// Handle confirm action
const handleConfirmAction = async () => {
  if (confirmModalAction.value === "dispatch" && itemToAction.value) {
    const itemIndex = itemToAction.value;
    if (itemIndex[0] !== -1) {
      const response = await UpdateChequeStatusService(itemIndex, 5);
      if (response.data.isUpdated) {
        message.success(`Item dispatched successfully`);
      } else {
        message.error("Failed to dispatch item");
      }
    }
  } else if (confirmModalAction.value === "bulkDispatch") {
    var itemIds = selectedRowKeys.value;
    const response = await UpdateChequeStatusService(itemIds, 5);
    if (response.data.isUpdated) {
      message.success(
        `Successfully dispatched ${selectedRowKeys.value.length} item(s)`,
      );
      selectedRowKeys.value = []; // Clear selection after bulk update
    } else {
      message.error("Failed to dispatch items");
    }
  }
  downloadedRequisitionStore.fetchDownloadRequisitions();
  confirmModalVisible.value = false;
};

// Reset selection when filtered items change
watch(
  [severityFilter, bankFilter, branchFilter, searchText, challanNoFilter],
  () => {
    selectedRowKeys.value = [];
  },
);
</script>

<style scoped>
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

.custom-table :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: rgba(147, 51, 234, 0.05);
}

/* Custom modal styles */
.confirm-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.confirm-modal :deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.confirm-modal :deep(.ant-modal-title) {
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
.ant-select-selector,
.ant-input-number,
.ant-picker {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover,
.ant-input-number:hover,
.ant-picker:hover {
  border-color: #a855f7 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #a855f7 !important;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 197, 94, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
}

.ant-tag-error {
  background-color: var(--error-light) !important;
  border-color: var(--error) !important;
  color: var(--error) !important;
}

.ant-tag-warning {
  background-color: #fff7ed !important;
  border-color: #fdba74 !important;
  color: #c2410c !important;
}

.ant-tag-purple {
  background-color: rgba(147, 51, 234, 0.1) !important;
  border-color: #9333ea !important;
  color: #9333ea !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  border-radius: var(--radius-md) !important;
}

/* Center icons in buttons */
.ant-btn-circle {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
/* Exception for Dispatch button */
.ant-btn-primary.btn-dispatch {
  background-color: var(--color-amber-500) !important;
  border-color: var(--color-amber-500) !important;
}

.ant-btn-primary.btn-dispatch:hover,
.ant-btn-primary.btn-dispatch:focus {
  background-color: var(--color-amber-700) !important;
  border-color: var(--color-amber-700) !important;
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
