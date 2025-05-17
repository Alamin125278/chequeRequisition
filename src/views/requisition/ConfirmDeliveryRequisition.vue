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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <!-- Pending Delivery Items Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <SendOutlined class="h-6 w-6 text-amber-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Pending Delivery Items
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ dispatchedItems.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Bank Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <BankOutlined class="h-6 w-6 text-blue-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Bank
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ bankFilter }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Branches Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BranchesOutlined class="h-6 w-6 text-purple-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Branches
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ uniqueBranchesCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            @search="handleSearch"
            class="w-full"
            :allowClear="true"
          >
            <template #prefix>
              <SearchOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <a-input
            v-model:value="bankFilter"
            placeholder="Bank"
            class="w-full"
            disabled
          />

          <a-select
            v-model:value="branchFilter"
            placeholder="Select Branch"
            class="w-full"
            @change="handleBranchFilterChange"
            allowClear
          >
            <a-select-option value="">All Branches</a-select-option>
            <template v-for="branch in availableBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{
                branch.text
              }}</a-select-option>
            </template>
          </a-select>

          <a-select
            v-model:value="severityFilter"
            placeholder="Filter by severity"
            class="w-full"
            @change="handleSeverityFilterChange"
            allowClear
          >
            <a-select-option value="">All Severities</a-select-option>
            <a-select-option value="High">High</a-select-option>
            <a-select-option value="Medium">Medium</a-select-option>
            <a-select-option value="Low">Low</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full"
            :placeholder="['Start Date', 'End Date']"
          />

          <a-input
            v-model:value="challanNoFilter"
            placeholder="Filter by Challan No"
            class="w-full"
            @change="handleChallanNoFilterChange"
            :allowClear="true"
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input>
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
            >{{ filteredDispatchedItems.length }} items found</span
          >
        </div>
        <a-table
          :dataSource="filteredDispatchedItems"
          :columns="dispatchedItemColumns"
          :loading="loading"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} items`,
          }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1200 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record }">
            <!-- Severity Column -->
            <template v-if="column.key === 'severity'">
              <a-tag
                :color="getSeverityColor(record.severity)"
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{ record.severity }}
              </a-tag>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag
                color="amber"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                Dispatched
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
        <div
          v-if="!loading && dispatchedItems.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">
            No pending delivery items found
          </p>
          <p class="text-secondary">
            No items are pending delivery confirmation for this bank
          </p>
        </div>
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
  BankOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { message, Table } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref, watch } from "vue";

interface ChequeItem {
  id: number;
  requisitionNo?: string;
  accountNo: string;
  routingNo: string;
  startNo: number;
  endNo: number;
  prefix: string;
  series: string;
  severity: string;
  bankName: string;
  branchName: string;
  accountName: string;
  customerAddress: string;
  bookQuantity: number;
  transactionCode: number;
  leafCount: number;
  courierCode: string;
  distributionPointName: string;
  receivingBranch: string;
  status?: string;
  requestDate: string;
  challanNo: string;
  dispatchDate?: string;
}

interface BranchOption {
  text: string;
  value: string;
}

// Props
const props = defineProps({
  bankName: {
    type: String,
    required: true,
    default: "National Bank", // Default bank for demo purposes
  },
});

// State variables
const loading = ref(true);
const searchText = ref("");
const severityFilter = ref("");
const bankFilter = ref(props.bankName);
const branchFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const allItems = ref<ChequeItem[]>([]);
const selectedRowKeys = ref<number[]>([]);
const challanNoFilter = ref("");
const confirmModalVisible = ref(false);
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalOkText = ref("");
const itemToAction = ref<ChequeItem | null>(null);

// Bank to branches mapping
const bankBranchesMap = {
  "National Bank": [
    { text: "National Main Branch", value: "National Main Branch" },
    { text: "National North Branch", value: "National North Branch" },
    { text: "National South Branch", value: "National South Branch" },
  ],
  "City Bank": [
    { text: "City Central Branch", value: "City Central Branch" },
    { text: "City East Branch", value: "City East Branch" },
    { text: "City West Branch", value: "City West Branch" },
  ],
  "Metro Bank": [
    { text: "Metro Downtown Branch", value: "Metro Downtown Branch" },
    { text: "Metro Uptown Branch", value: "Metro Uptown Branch" },
  ],
  "Global Bank": [
    { text: "Global HQ Branch", value: "Global HQ Branch" },
    { text: "Global Regional Branch", value: "Global Regional Branch" },
    {
      text: "Global International Branch",
      value: "Global International Branch",
    },
  ],
};

// Available branches based on selected bank
const availableBranches = computed(() => {
  return (
    bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || []
  );
});

// Filter to only dispatched items for the selected bank
const dispatchedItems = computed(() => {
  return allItems.value.filter(
    (item) => item.status === "Dispatched" && item.bankName === bankFilter.value
  );
});

// Count of unique branches
const uniqueBranchesCount = computed(() => {
  const branches = new Set(
    dispatchedItems.value.map((item) => item.branchName)
  );
  return branches.size;
});

// Computed property to check if any items are selected
const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

// Dispatched item columns for the table
const dispatchedItemColumns = [
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
    sorter: (a: ChequeItem, b: ChequeItem) =>
      a.accountNo.localeCompare(b.accountNo),
    width: 150,
  },
  {
    title: "Account Name",
    dataIndex: "accountName",
    key: "accountName",
    sorter: (a: ChequeItem, b: ChequeItem) =>
      a.accountName.localeCompare(b.accountName),
    width: 180,
  },
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branchName",
    width: 150,
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
    width: 120,
    sorter: (a: ChequeItem, b: ChequeItem) => a.startNo - b.startNo,
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
    width: 120,
  },
  {
    title: "Book Qty",
    dataIndex: "bookQuantity",
    key: "bookQuantity",
    width: 120,
    sorter: (a: ChequeItem, b: ChequeItem) => a.bookQuantity - b.bookQuantity,
  },
  {
    title: "Severity",
    dataIndex: "severity",
    key: "severity",
    width: 120,
    filters: [
      { text: "High", value: "High" },
      { text: "Medium", value: "Medium" },
      { text: "Low", value: "Low" },
    ],
    onFilter: (value: string, record: ChequeItem) => record.severity === value,
  },
  {
    title: "Dispatch Date",
    dataIndex: "dispatchDate",
    key: "dispatchDate",
    width: 150,
    render: (text: string) => formatDate(text),
    sorter: (a: ChequeItem, b: ChequeItem) =>
      new Date(a.dispatchDate || "").getTime() -
      new Date(b.dispatchDate || "").getTime(),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
  },
  {
    title: "Challan No",
    dataIndex: "challanNo",
    key: "challanNo",
    width: 150,
    sorter: (a: ChequeItem, b: ChequeItem) =>
      a.challanNo.localeCompare(b.challanNo),
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

// Computed property for filtered dispatched items
const filteredDispatchedItems = computed(() => {
  let result = [...dispatchedItems.value];

  // Apply search filter
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.accountNo.toLowerCase().includes(searchLower) ||
        item.accountName.toLowerCase().includes(searchLower) ||
        item.branchName.toLowerCase().includes(searchLower)
    );
  }

  // Apply severity filter
  if (severityFilter.value) {
    result = result.filter((item) => item.severity === severityFilter.value);
  }

  // Apply branch filter
  if (branchFilter.value) {
    result = result.filter((item) => item.branchName === branchFilter.value);
  }

  // Apply date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = dateRange.value[0].valueOf();
    const endDate = dateRange.value[1].valueOf();

    result = result.filter((item) => {
      const dispDate = new Date(item.dispatchDate || "").getTime();
      return dispDate >= startDate && dispDate <= endDate;
    });
  }

  // Apply challan no filter
  if (challanNoFilter.value) {
    result = result.filter((item) =>
      item.challanNo.toLowerCase().includes(challanNoFilter.value.toLowerCase())
    );
  }

  return result;
});

// Fetch cheque items data
const fetchItems = async () => {
  loading.value = true;
  try {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      allItems.value = generateMockItems();
      loading.value = false;
    }, 1000);
  } catch (error) {
    message.error("Failed to fetch requisition items");
    loading.value = false;
  }
};

// Refresh data
const refreshData = () => {
  loading.value = true;
  selectedRowKeys.value = [];
  setTimeout(() => {
    allItems.value = generateMockItems();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

// Generate mock data for demonstration
const generateMockItems = (): ChequeItem[] => {
  const statuses = [
    "Pending",
    "Approved",
    "Ordered",
    "Download",
    "Dispatched",
    "Delivery Receive",
  ];
  const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];
  const severities = ["High", "Medium", "Low"];

  return Array.from({ length: 50 }, (_, i) => {
    // For confirm delivery page, make more items have Dispatched status
    const randomStatus =
      Math.random() < 0.7
        ? "Dispatched"
        : statuses[Math.floor(Math.random() * statuses.length)];
    const bank = banks[i % 4];
    const branchOptions = bankBranchesMap[bank as keyof typeof bankBranchesMap];
    const branch = branchOptions[i % branchOptions.length].value;

    // Generate a request date
    const requestDate = new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );

    // Generate a dispatch date that's after the request date (if status is Dispatched)
    let dispatchDate = null;
    if (randomStatus === "Dispatched") {
      dispatchDate = new Date(requestDate);
      dispatchDate.setDate(
        dispatchDate.getDate() + Math.floor(Math.random() * 14) + 1
      ); // 1-14 days after request
    }

    return {
      id: i + 1,
      accountNo: `AC-${100000 + i}`,
      routingNo: `RT-${200000 + i}`,
      startNo: 1000 + i * 100,
      endNo: 1099 + i * 100,
      prefix: `PFX-${i % 5}`,
      series: `S-${i % 3}`,
      severity: severities[i % 3],
      bankName: bank,
      branchName: branch,
      accountName: `Account Holder ${i + 1}`,
      customerAddress: `123 Main St, City ${i + 1}, Country`,
      bookQuantity: Math.floor(Math.random() * 5) + 1,
      transactionCode: 1000 + i,
      leafCount: (Math.floor(Math.random() * 5) + 1) * 10,
      courierCode: `CR-${1000 + i}`,
      distributionPointName: `Distribution Point ${(i % 5) + 1}`,
      receivingBranch: branch,
      status: randomStatus,
      requestDate: requestDate.toISOString(),
      dispatchDate: dispatchDate ? dispatchDate.toISOString() : undefined,
      challanNo: `CHN-${10000 + i}`,
    };
  });
};

// Get color for severity tag
const getSeverityColor = (severity: string) => {
  const colorMap: Record<string, string> = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  return colorMap[severity] || "default";
};

// Handle search
const handleSearch = (value: string) => {
  searchText.value = value;
};

// Handle severity filter change
const handleSeverityFilterChange = (value: string) => {
  severityFilter.value = value;
};

// Handle branch filter change
const handleBranchFilterChange = (value: string) => {
  branchFilter.value = value;
};

// Handle date range change
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
  dateRange.value = dates;
};

// Handle row selection change
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};

// Handle challan no filter change
const handleChallanNoFilterChange = (e: Event) => {
  challanNoFilter.value = (e.target as HTMLInputElement).value;
};

// Confirm delivery for a single item
const confirmDeliveryItem = (record: ChequeItem) => {
  confirmModalTitle.value = `Confirm Delivery`;
  confirmModalMessage.value = `Are you sure you want to confirm delivery receipt for this item?`;
  confirmModalOkText.value = "Confirm";
  itemToAction.value = record;
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
const handleConfirmAction = () => {
  if (itemToAction.value) {
    // Single item confirmation
    const itemIndex = allItems.value.findIndex(
      (item) => item.id === itemToAction.value?.id
    );

    if (itemIndex !== -1) {
      // Update the item status to Delivery Receive
      allItems.value[itemIndex].status = "Delivery Receive";
      message.success(`Delivery receipt confirmed successfully`);
    }
    itemToAction.value = null;
  } else {
    // Bulk confirmation
    allItems.value = allItems.value.map((item) => {
      if (selectedRowKeys.value.includes(item.id)) {
        return { ...item, status: "Delivery Receive" };
      }
      return item;
    });

    message.success(
      `Successfully confirmed delivery receipt for ${selectedRowKeys.value.length} item(s)`
    );
    selectedRowKeys.value = []; // Clear selection after bulk update
  }

  confirmModalVisible.value = false;
};

// Reset selection when filtered items change
watch([severityFilter, branchFilter, searchText, challanNoFilter], () => {
  selectedRowKeys.value = [];
});

// Fetch data on component mount
onMounted(() => {
  fetchItems();
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
