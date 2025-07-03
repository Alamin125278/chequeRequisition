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
              <div class="flex-shrink-0 bg-amber-500 rounded-md p-2">
                <CheckCircleOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-amber-500">Confirm Delivery</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Confirm delivery receipt for dispatched cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600"
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
    <div class="max-w-7xl mx-auto py-6">
      <!-- Search and Filter Section -->
      <div class="bg-card shadow-md rounded-md p-4 mb-6">
        <h3
          class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
        >
          Filter Pending Delivery Items
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by account number or name"
            @search="dispatchStore.setSearch"
            class="w-full"
            :allowClear="true"
          >
            <template #prefix>
              <SearchOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <template v-if="dispatchStore.branches.length === 1">
            <a-input
              :value="dispatchStore.branches[0].branchName"
              disabled
              class="w-full"
              style="background-color: #fff; color: #000; cursor: default"
            />
          </template>
          <!-- If more than 1, show dropdown -->
          <template v-else>
            <a-select
              placeholder="All branches"
              class="rounded-md w-full"
              @change="dispatchStore.setBranch"
            >
              <a-select-option value="">All branches</a-select-option>
              <a-select-option
                v-for="branch in dispatchStore.branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.branchName }}
              </a-select-option>
            </a-select>
          </template>

          <a-select
            v-model:value="severityFilter"
            placeholder="Filter by severity"
            class="w-full"
            @change="dispatchStore.setSeverity"
            allowClear
          >
            <a-select-option value="">All Severities</a-select-option>
            <a-select-option value="1">Urgent</a-select-option>
            <a-select-option value="2">Normal</a-select-option>
          </a-select>

          <a-date-picker
            v-model:value="dateRange"
            @change="dispatchStore.setRequestDate"
            class="w-full"
            placeholder="Select Request Date"
          />

          <a-input-search
            v-model:value="challanNoFilter"
            placeholder="Filter by Challan No"
            class="w-full"
            @search="dispatchStore.setChallanNo"
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
          <a-tooltip title="Confirm delivery for selected items">
            <a-button
              v-if="hasSelectedItems"
              type="primary"
              @click="handleBulkConfirmDelivery"
              class="bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600"
            >
              <template #icon><CheckCircleOutlined /></template>
              Confirm Delivery Receipt ({{ selectedRowKeys.length }})
            </a-button>
          </a-tooltip>

          <span
            v-if="selectedRowKeys.length > 0"
            class="text-sm text-secondary ml-2"
          >
            {{ selectedRowKeys.length }} item(s) selected
          </span>
        </div>
      </div>

      <!-- Pending Delivery Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">
            Pending Delivery Items
          </h3>
          <span class="text-sm text-secondary"
            >{{ dispatchStore.dispatchRequisition.length }} items found</span
          >
        </div>
        <a-table
          :dataSource="dispatchStore.dispatchRequisition"
          :columns="dispatchedItemColumns"
          :loading="loading"
          :pagination="pagination"
          :rowSelection="{
            onChange: onSelectChange,
          }"
          @change="(p) => dispatchStore.setPagination(p.current, p.pageSize)"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1200 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
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
                color="green"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.statusName }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex justify-center">
                <a-tooltip title="Confirm delivery">
                  <a-button
                    type="primary"
                    class="btn-confirm"
                    @click="confirmDeliveryItem(record)"
                    ><CheckCircleOutlined />
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
            class="bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600"
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
  CheckCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import { UpdateChequeStatusService } from "../../services/requisition/DownloadRequisition.service";
import type { DispatchRequisition } from "../../stores/dispatchRequisitionStore";
import { useDispatchRequisitionStore } from "../../stores/dispatchRequisitionStore";

// State variables
const loading = ref(false);
const searchText = ref("");
const severityFilter = ref("");
let bankId = ref(0);
let branchId = ref(0);
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const selectedRows = ref<DispatchRequisition[]>([]);
const selectedRowKeys = ref<number[]>([]);
const challanNoFilter = ref("");
const confirmModalVisible = ref(false);
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalOkText = ref("");
const itemToAction = ref<number[] | null>(null);

const dispatchStore = useDispatchRequisitionStore();

onMounted(() => {
  dispatchStore.resetFilters();
  dispatchStore.fetchDispatchRequisitions();
  dispatchStore.featchBanks();
});

const pagination = computed(() => ({
  current: Math.floor(dispatchStore.skip / dispatchStore.limit) + 1,
  pageSize: dispatchStore.limit,
  total: dispatchStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Confirm Delivery Requisitions`,
}));

// Computed property to check if any items are selected
const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[], rows: DispatchRequisition[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

// Dispatched item columns for the table
const dispatchedItemColumns = [
  {
    title: "Sl.",
    key: "id",
    width: 70,
  },
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
    width: 150,
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
  if (!dateString) return "";
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
    dispatchStore.resetFilters();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

// Handle row selection change
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};

// Confirm delivery for a single item
const confirmDeliveryItem = (record: DispatchRequisition) => {
  confirmModalTitle.value = `Confirm Delivery`;
  confirmModalMessage.value = `Are you sure you want to confirm delivery receipt for this item?`;
  confirmModalOkText.value = "Confirm";
  itemToAction.value = [record.id];
  confirmModalVisible.value = true;
};

// Handle bulk confirm delivery
const handleBulkConfirmDelivery = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning("Please select at least one item");
    return;
  }

  confirmModalTitle.value = `Confirm Delivery Receipt`;
  confirmModalMessage.value = `Are you sure you want to confirm delivery receipt for ${selectedRowKeys.value.length} selected item(s)?`;
  confirmModalOkText.value = "Confirm All";
  confirmModalVisible.value = true;
};

// Handle confirm action
const handleConfirmAction = async () => {
  if (itemToAction.value) {
    // Single item confirmation
    const itemIndex = itemToAction.value;
    alert(itemIndex[0]);

    if (itemIndex[0] !== -1) {
      // Update the item status to Delivery Receive
      const response = await UpdateChequeStatusService(itemIndex, 6);
      if (response.data.isUpdated) {
        message.success(`Delivery receipt confirmed successfully`);
      } else {
        message.error("Failed to confirm delivery receipt");
      }
    }
    itemToAction.value = null;
  } else {
    // Bulk confirmation
    var itemIds = selectedRowKeys.value;
    const response = await UpdateChequeStatusService(itemIds, 6);
    if (response.data.isUpdated) {
      message.success(
        `Successfully confirmed delivery receipt for ${selectedRowKeys.value.length} item(s)`
      );
      selectedRowKeys.value = []; // Clear selection after bulk update
    } else {
      message.error("Failed to confirm delivery receipt");
    }
  }
  dispatchStore.fetchDispatchRequisitions();
  confirmModalVisible.value = false;
};

// Reset selection when filtered items change
watch([severityFilter, branchId, searchText, challanNoFilter], () => {
  selectedRowKeys.value = [];
});
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
  background-color: rgba(245, 158, 11, 0.05);
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
  border-color: #f59e0b !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #f59e0b !important;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
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

.ant-tag-amber {
  background-color: rgba(245, 158, 11, 0.1) !important;
  border-color: #f59e0b !important;
  color: #b45309 !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  border-radius: var(--radius-md) !important;
}
/* Exception for Confirm Delivery button */
.ant-btn-primary.btn-confirm {
  background-color: var(--color-lime-500) !important;
  border-color: var(--color-lime-500) !important;
}

.ant-btn-primary.btn-confirm:hover,
.ant-btn-primary.btn-confirm:focus {
  background-color: var(--color-lime-700) !important;
  border-color: var(--color-lime-700) !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
