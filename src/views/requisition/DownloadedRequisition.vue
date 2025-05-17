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
    <div class="max-w-7xl mx-auto py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <!-- Downloaded Items Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <DownloadOutlined class="h-6 w-6 text-purple-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Downloaded Items
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ downloadedItems.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Banks Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <BankOutlined class="h-6 w-6 text-blue-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Banks
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ uniqueBanksCount }}
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
              <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                <BranchesOutlined class="h-6 w-6 text-green-500" />
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
          Filter Downloaded Items
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

          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full"
            @change="handleBankFilterChange"
            allowClear
          >
            <a-select-option value="">All Banks</a-select-option>
            <a-select-option value="National Bank"
              >National Bank</a-select-option
            >
            <a-select-option value="City Bank">City Bank</a-select-option>
            <a-select-option value="Metro Bank">Metro Bank</a-select-option>
            <a-select-option value="Global Bank">Global Bank</a-select-option>
          </a-select>

          <a-select
            v-model:value="branchFilter"
            placeholder="Select Branch"
            class="w-full"
            @change="handleBranchFilterChange"
            :disabled="!bankFilter"
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
          :dataSource="filteredDownloadedItems"
          :columns="downloadedItemColumns"
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
                color="purple"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                Download
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
        <div
          v-if="!loading && downloadedItems.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">
            No downloaded requisitions found
          </p>
          <p class="text-secondary">
            No requisitions are available for download yet
          </p>
        </div>
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
  BankOutlined,
  BranchesOutlined,
  CarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
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
}

interface BranchOption {
  text: string;
  value: string;
}

// State variables
const loading = ref(true);
const searchText = ref("");
const severityFilter = ref("");
const bankFilter = ref("");
const branchFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const allItems = ref<ChequeItem[]>([]);
const selectedRowKeys = ref<number[]>([]);
const confirmModalVisible = ref(false);
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalOkText = ref("");
const confirmModalAction = ref("");
const confirmModalButtonClass = ref("");
const itemToAction = ref<ChequeItem | null>(null);
const challanNoFilter = ref("");

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
  if (!bankFilter.value) return [];
  return (
    bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || []
  );
});

// Filter to only downloaded items
const downloadedItems = computed(() => {
  return allItems.value.filter((item) => item.status === "Download");
});

// Count of unique banks
const uniqueBanksCount = computed(() => {
  const banks = new Set(downloadedItems.value.map((item) => item.bankName));
  return banks.size;
});

// Count of unique branches
const uniqueBranchesCount = computed(() => {
  const branches = new Set(
    downloadedItems.value.map((item) => item.branchName)
  );
  return branches.size;
});

// Computed property to check if any items are selected
const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

// Check if all selected items belong to the same bank
const selectedItemsSameBank = computed(() => {
  if (selectedRowKeys.value.length <= 1) return true;

  const selectedItems = allItems.value.filter(
    (item) =>
      selectedRowKeys.value.includes(item.id) && item.status === "Download"
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
    title: "Bank",
    dataIndex: "bankName",
    key: "bankName",
    width: 150,
    filters: [
      { text: "National Bank", value: "National Bank" },
      { text: "City Bank", value: "City Bank" },
      { text: "Metro Bank", value: "Metro Bank" },
      { text: "Global Bank", value: "Global Bank" },
    ],
    onFilter: (value: string, record: ChequeItem) => record.bankName === value,
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
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    width: 150,
    render: (text: string) => formatDate(text),
    sorter: (a: ChequeItem, b: ChequeItem) =>
      new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
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
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Computed property for filtered downloaded items
const filteredDownloadedItems = computed(() => {
  let result = [...downloadedItems.value];

  // Apply search filter
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.accountNo.toLowerCase().includes(searchLower) ||
        item.accountName.toLowerCase().includes(searchLower) ||
        item.bankName.toLowerCase().includes(searchLower) ||
        item.branchName.toLowerCase().includes(searchLower)
    );
  }

  // Apply severity filter
  if (severityFilter.value) {
    result = result.filter((item) => item.severity === severityFilter.value);
  }

  // Apply bank filter
  if (bankFilter.value) {
    result = result.filter((item) => item.bankName === bankFilter.value);
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
      const reqDate = new Date(item.requestDate).getTime();
      return reqDate >= startDate && reqDate <= endDate;
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
    // For dispatch page, make more items have Download status
    const randomStatus =
      Math.random() < 0.7
        ? "Download"
        : statuses[Math.floor(Math.random() * statuses.length)];
    const bank = banks[i % 4];
    const branchOptions = bankBranchesMap[bank as keyof typeof bankBranchesMap];
    const branch = branchOptions[i % branchOptions.length].value;

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
      requestDate: new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
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

// Handle bank filter change
const handleBankFilterChange = (value: string) => {
  bankFilter.value = value;
  branchFilter.value = ""; // Reset branch filter when bank changes
};

// Handle branch filter change
const handleBranchFilterChange = (value: string) => {
  branchFilter.value = value;
};

// Handle date range change
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
  dateRange.value = dates;
};

// Handle challan no filter change
const handleChallanNoFilterChange = (e: Event) => {
  challanNoFilter.value = (e.target as HTMLInputElement).value;
};

// Handle row selection change
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};

// Dispatch a single item
const dispatchItem = (record: ChequeItem) => {
  confirmModalTitle.value = `Dispatch Item`;
  confirmModalMessage.value = `Are you sure you want to dispatch this item to the next stage?`;
  confirmModalOkText.value = "Dispatch";
  confirmModalAction.value = "dispatch";
  itemToAction.value = record;
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
const handleConfirmAction = () => {
  if (confirmModalAction.value === "dispatch" && itemToAction.value) {
    const itemIndex = allItems.value.findIndex(
      (item) => item.id === itemToAction.value?.id
    );

    if (itemIndex !== -1) {
      // Update the item status to the next stage (Dispatched)
      allItems.value[itemIndex].status = "Dispatched";
      message.success(`Item dispatched successfully`);
    }
  } else if (confirmModalAction.value === "bulkDispatch") {
    // Update all selected items
    allItems.value = allItems.value.map((item) => {
      if (selectedRowKeys.value.includes(item.id)) {
        return { ...item, status: "Dispatched" };
      }
      return item;
    });

    message.success(
      `Successfully dispatched ${selectedRowKeys.value.length} item(s)`
    );
    selectedRowKeys.value = []; // Clear selection after bulk update
  }

  confirmModalVisible.value = false;
  itemToAction.value = null;
};

// Reset selection when filtered items change
watch(
  [severityFilter, bankFilter, branchFilter, searchText, challanNoFilter],
  () => {
    selectedRowKeys.value = [];
  }
);

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
