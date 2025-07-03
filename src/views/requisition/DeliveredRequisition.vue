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
              <div class="flex-shrink-0 bg-emerald-500 rounded-md p-2">
                <CheckCircleOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-emerald-500">Delivered</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all delivered cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600"
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
          Filter Delivered Items
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a-input-search
            placeholder="Search by account number or name"
            @search="deliveredStore.setSearch"
            class="w-full"
            allowClear
          >
            <template #prefix>
              <SearchOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <template v-if="deliveredStore.banks.length === 1">
            <a-input
              :value="deliveredStore.banks[0].bankName"
              disabled
              class="w-full"
              style="background-color: #fff; color: #000; cursor: default"
            />
          </template>
          <template v-else>
            <a-select
              placeholder="Select Bank"
              class="w-full"
              @change="deliveredStore.setBank"
              allowClear
            >
              <a-select-option value="">All Banks</a-select-option>
              <a-select-option
                v-for="bank in deliveredStore.banks"
                :key="bank.id"
                :value="bank.id"
              >
                {{ bank.bankName }}
              </a-select-option>
            </a-select>
          </template>

          <template v-if="deliveredStore.branches.length === 1">
            <a-input
              :value="deliveredStore.branches[0].branchName"
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
              @change="deliveredStore.setBranch"
            >
              <a-select-option value="">All branches</a-select-option>
              <a-select-option
                v-for="branch in deliveredStore.branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.branchName }}
              </a-select-option>
            </a-select>
          </template>

          <a-select
            placeholder="Filter by severity"
            class="w-full"
            @change="deliveredStore.setSeverity"
            allowClear
          >
            <a-select-option value="1">Urgent</a-select-option>
            <a-select-option value="2">Normal</a-select-option>
          </a-select>

          <a-date-picker
            @change="deliveredStore.setRequestDate"
            class="w-full"
            placeholder="Select Request Date"
          />

          <a-input-search
            placeholder="Filter by Challan No"
            class="w-full"
            @search="deliveredStore.setChallanNo"
            allowClear
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input-search>
        </div>
      </div>

      <!-- Delivered Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Delivered Items</h3>
          <span class="text-sm text-secondary"
            >{{ deliveredStore.total }} items found</span
          >
        </div>
        <a-table
          :dataSource="deliveredStore.deliveredRequisition"
          :columns="deliveredItemColumns"
          :loading="loading"
          :pagination="pagination"
          rowKey="id"
          @change="(p) => deliveredStore.setPagination(p.current, p.pageSize)"
          class="custom-table"
          :scroll="{ x: 1300 }"
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

            <!-- Received By Column -->
            <!-- <template v-if="column.key === 'receivedBy'">
              <div class="flex items-center">
                <a-avatar
                  :size="24"
                  class="mr-2 bg-emerald-100 text-emerald-700"
                >
                  {{ getInitials(record.receivedBy) }}
                </a-avatar>
                {{ record.receivedBy }}
              </div>
            </template> -->
          </template>
        </a-table>

        <!-- Empty State -->
      </div>
    </div>
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
import { computed, onMounted, ref } from "vue";
import { useDeliveredRequisitionStore } from "../../stores/deliveredRequisitionStore";
// State variables
const loading = ref(false);
const deliveredStore = useDeliveredRequisitionStore();

const pagination = computed(() => ({
  current: Math.floor(deliveredStore.skip / deliveredStore.limit) + 1,
  pageSize: deliveredStore.limit,
  total: deliveredStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Delivered Requisitions`,
}));
const deliveredItemColumns = [
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
    deliveredStore.resetFilters();
    deliveredStore.featchBanks();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

// Fetch data on component mount
onMounted(() => {
  deliveredStore.resetFilters();
  deliveredStore.fetchDeliveredRequisitions();
  deliveredStore.featchBanks();
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
  border-color: #10b981 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-color: #10b981 !important;
  color: #047857 !important;
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

/* Avatar styles */
.ant-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
