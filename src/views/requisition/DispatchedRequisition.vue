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
              <div class="flex-shrink-0 bg-green-500 rounded-md p-2">
                <SendOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-green-500">Dispatched</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and track all dispatched cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
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
          Filter Dispatched Items
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by account number or name"
            @search="dispatchStore.setSearch"
            class="w-full"
            allowClear
          >
            <template #prefix>
              <SearchOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full"
            @change="dispatchStore.setBank"
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
            @change="dispatchStore.setBranch"
            :disabled="!dispatchStore.bank"
            allowClear
          >
            <a-select-option value="">All Branches</a-select-option>
            <a-select-option
              v-for="branch in dispatchStore.branches"
              :key="branch.id"
              :value="branch.id"
            >
              {{ branch.branchName }}
            </a-select-option>
          </a-select>

          <a-select
            v-model:value="severityFilter"
            placeholder="Filter by severity"
            class="w-full"
            @change="dispatchStore.setSeverity"
            allowClear
          >
            <a-select-option value="">All Severity</a-select-option>
            <a-select-option value="1">Urgent</a-select-option>
            <a-select-option value="2">Normal</a-select-option>
          </a-select>

          <a-date-picker
            v-model:value="dateRange"
            @change="dispatchStore.setRequestDate"
            class="w-full"
            placeholder="Select Request Date"
            allowClear
          />

          <a-input-search
            v-model:value="challanNoFilter"
            placeholder="Filter by Challan No"
            class="w-full"
            @search="dispatchStore.setSearch"
            allowClear
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input-search>
        </div>
      </div>

      <!-- Dispatched Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Dispatched Items</h3>
          <span class="text-sm text-secondary"
            >{{ dispatchStore.total }} items found</span
          >
        </div>
        <a-table
          :dataSource="dispatchStore.dispatchRequisition"
          :columns="dispatchedItemColumns"
          :loading="loading"
          :pagination="pagination"
          @change="dispatchPagination"
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
          </template>
        </a-table>

        <!-- Empty State -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";
import { useDispatchRequisitionStore } from "../../stores/dispatchRequisitionStore";

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
const challanNoFilter = ref("");

const dispatchStore = useDispatchRequisitionStore();

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

const pagination = computed(() => ({
  current: Math.floor(dispatchStore.skip / dispatchStore.limit) + 1,
  pageSize: dispatchStore.limit,
  total: dispatchStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Dispatched Requisitions`,
}));

const dispatchPagination = (p: any) =>
  dispatchStore.setPagination(p.current, p.pageSize);
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
  setTimeout(() => {
    dispatchStore.resetFilters();
    dispatchStore.fetchDispatchRequisitions();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

onMounted(() => {
  dispatchStore.resetFilters();
  dispatchStore.fetchDispatchRequisitions();
  featchBanks();
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
  border-color: #22c55e !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
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

/* Ant Design button overrides */
.ant-btn-primary {
  border-radius: var(--radius-md) !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
