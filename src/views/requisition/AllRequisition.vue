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
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">All</span> Requisitions
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all cheque requisitions in one centralized
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filter Section -->
    <div class="mx-auto py-6">
      <div class="bg-card shadow-md rounded-md p-6 mb-6">
        <h3
          class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
        >
          Filter Options
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <!-- Account NO/Name Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Account No./Name</label
            >
            <a-input-search
              v-model:value="formState.search"
              placeholder="Search by account number or name"
              @search="allRequisitionsStore.setSearch"
              class="w-full"
              :allowClear="true"
              :loading="searchLoading"
            >
              <template #prefix>
                <SearchOutlined class="text-secondary" />
              </template>
            </a-input-search>
          </div>

          <!-- Challan NO Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Challan No.</label
            >
            <a-input-search
              v-model:value="formState.challanNo"
              placeholder="Enter challan number"
              class="w-full"
              :allowClear="true"
              @search="allRequisitionsStore.setChallanNo"
            />
          </div>

          <!-- Bank Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Bank</label
            >
            <template v-if="allRequisitionsStore.banks.length === 1">
              <a-input
                :value="allRequisitionsStore.banks[0].bankName"
                disabled
                class="w-full"
                style="background-color: #fff; color: #000; cursor: default"
              />
            </template>
            <template v-else>
              <a-select
                v-model:value="formState.bankId"
                placeholder="Select Bank"
                class="w-full"
                @change="allRequisitionsStore.setBank"
                allowClear
              >
                <a-select-option value="">All Banks</a-select-option>
                <a-select-option
                  v-for="bank in allRequisitionsStore.banks"
                  :key="bank.id"
                  :value="bank.id"
                >
                  {{ bank.bankName }}
                </a-select-option>
              </a-select>
            </template>
          </div>

          <!-- Branch Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Branch</label
            >
            <template v-if="allRequisitionsStore.branches.length === 1">
              <a-input
                :value="allRequisitionsStore.branches[0].branchName"
                disabled
                class="w-full"
                style="background-color: #fff; color: #000; cursor: default"
              />
            </template>
            <!-- If more than 1, show dropdown -->
            <template v-else>
              <a-select
                v-model:value="formState.branchId"
                placeholder="All branches"
                class="rounded-md w-full"
                @change="allRequisitionsStore.setBranch"
              >
                <a-select-option value="">All branches</a-select-option>
                <a-select-option
                  v-for="branch in allRequisitionsStore.branches"
                  :key="branch.id"
                  :value="branch.id"
                >
                  {{ branch.branchName }}
                </a-select-option>
              </a-select>
            </template>
          </div>

          <!-- Request Date Range -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Request Date</label
            >
            <a-date-picker
              v-model:value="formState.requestDate"
              @change="allRequisitionsStore.setRequestDate"
              class="w-full"
              placeholder="Select Request Date"
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Status</label
            >
            <a-select
              v-model:value="formState.status"
              placeholder="Select status"
              class="w-full"
              @change="allRequisitionsStore.setStatus"
              allowClear
            >
              <a-select-option value="">All Statuses</a-select-option>
              <a-select-option value="3">Ordered</a-select-option>
              <a-select-option value="4">Download</a-select-option>
              <a-select-option value="5">Dispatch</a-select-option>
              <a-select-option value="6">Delivered</a-select-option>
            </a-select>
          </div>

          <!-- Severity Filter -->
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Severity</label
            >
            <a-select
              v-model:value="formState.severity"
              placeholder="Select severity"
              class="w-full"
              @change="allRequisitionsStore.setSeverity"
              allowClear
            >
              <a-select-option value="">All Severities</a-select-option>
              <a-select-option value="1">Urgent</a-select-option>
              <a-select-option value="2">Normal</a-select-option>
            </a-select>
          </div>

          <!-- Clear All Filters Button -->
          <div class="flex items-end">
            <a-button
              @click="clearAllFilters"
              class="w-full"
              :loading="loading"
            >
              <template #icon>
                <ClearOutlined />
              </template>
              Clear Filters
            </a-button>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <a-alert
        v-if="error"
        :message="error"
        type="error"
        show-icon
        closable
        @close="error = ''"
        class="mb-4"
      />

      <!-- Requisitions Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <a-table
          :dataSource="allRequisitionsStore.allRequisitions"
          :columns="requisitionColumns"
          :loading="loading"
          :pagination="pagination"
          @change="allRequisitionsPagination"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 2000 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record, index }">
            <!-- SL Column -->
            <template v-if="column.key === 'sl'">
              <span class="font-medium">{{ index + 1 }}</span>
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

            <!-- Challan Number Column -->
            <template v-if="column.key === 'challanNumber'">
              <a-tag
                :color="record.challanNumber ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.challanNumber ?? "Not Available" }}
              </a-tag>
            </template>
            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag
                :color="getStatusColor(record.statusName || 'Pending')"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.statusName || "Pending" }}
              </a-tag>
            </template>
            <!-- Date Formatted  Column -->
            <template v-if="column.key === 'requestDate'">
              {{ formatDate(record.requestDate) }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAllRequisitionStore } from "@/stores/AllRequisitionStore";
import {
  ClearOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

// State variables
const loading = ref(false);
const searchLoading = ref(false);
const error = ref("");

const allRequisitionsStore = useAllRequisitionStore();

onMounted(() => {
  allRequisitionsStore.resetFilters();
  allRequisitionsStore.featchBanks();
});

const formState = reactive({
  search: "",
  challanNo: "",
  severity: null,
  requestDate: "",
  bankId: null,
  branchId: null,
  status: null,
});
const pagination = computed(() => ({
  current:
    Math.floor(allRequisitionsStore.skip / allRequisitionsStore.limit) + 1,
  pageSize: allRequisitionsStore.limit,
  total: allRequisitionsStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "25", "50", "100"],
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `${range[0]}-${range[1]} of ${total} items`,
}));

const allRequisitionsPagination = (p: any) =>
  allRequisitionsStore.setPagination(p.current, p.pageSize);

// Table columns configuration
const requisitionColumns = [
  {
    title: "SL",
    key: "sl",
    width: 60,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    width: 150,
  },
  {
    title: "Home Branch",
    dataIndex: "branchName",
    key: "branchName",
    width: 150,
  },
  {
    title: "Challan No",
    dataIndex: "challanNumber",
    key: "challanNumber",
    width: 150,
  },
  {
    title: "Account Number",
    dataIndex: "accountNo",
    key: "accountNo",
    width: 150,
  },
  {
    title: "Delivery Branch",
    dataIndex: "receivingBranchName",
    key: "receivingBranchName",
    width: 150,
  },
  {
    title: "Account Holder",
    dataIndex: "accountName",
    key: "accountName",
    width: 150,
  },
  {
    title: "Routing No",
    dataIndex: "routingNo",
    key: "routingNo",
    width: 120,
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
    title: "Cheque Type",
    dataIndex: "chequeType",
    key: "chequeType",
    width: 120,
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
    width: 100,
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
    width: 100,
  },
  {
    title: "Severity",
    dataIndex: "serverity",
    key: "serverity",
    align: "center",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    align: "center",
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    align: "center",
    width: 150,
  },
];
// Format date for display
const formatDate = (dateString: string) => {
  const parts = dateString.split("/");
  const date = new Date(+parts[2], +parts[0] - 1, +parts[1]); // year, monthIndex, day
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const clearAllFilters = () => {
  formState.challanNo = "";
  formState.severity = null;
  formState.requestDate = "";
  formState.bankId = null;
  formState.branchId = null;
  formState.status = null;
  formState.search = "";
  allRequisitionsStore.resetFilters();
  allRequisitionsStore.fetchAllRequisitions();
  message.success("All filters cleared");
};

// Utility functions
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    Pending: "orange",
    Approved: "blue",
    Ordered: "success",
    Downloaded: "geekblue",
    Dispatched: "purple",
    Delivered: "lime",
  };
  return colorMap[status] || "default";
};
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
.attachment-modal :deep(.ant-modal-content) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.attachment-modal :deep(.ant-modal-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
}

.attachment-modal :deep(.ant-modal-title) {
  font-weight: 600;
  font-size: 18px;
  color: #374151;
}

/* Custom form styles */
.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector,
.ant-picker {
  border-color: #d1d5db !important;
  border-radius: 6px !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover,
.ant-picker:hover {
  border-color: #6b7280 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-picker-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

/* Custom button styles */
.ant-btn-primary {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  border-radius: 6px !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 197, 94, 0.1) !important;
  border-color: #22c55e !important;
  color: #16a34a !important;
}

.ant-tag-error {
  background-color: rgba(239, 68, 68, 0.1) !important;
  border-color: #ef4444 !important;
  color: #dc2626 !important;
}

.ant-tag-warning {
  background-color: rgba(245, 158, 11, 0.1) !important;
  border-color: #f59e0b !important;
  color: #d97706 !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }

  .custom-table :deep(.ant-table-thead > tr > th),
  .custom-table :deep(.ant-table-tbody > tr > td) {
    padding: 8px 6px;
  }
}
</style>
