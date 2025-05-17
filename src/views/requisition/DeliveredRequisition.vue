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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <!-- Delivered Items Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                <CheckCircleOutlined class="h-6 w-6 text-emerald-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Delivered Items
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ deliveredItems.length }}
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

        <!-- Receiving Branches Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <HomeOutlined class="h-6 w-6 text-amber-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Receiving Branches
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ uniqueReceivingBranchesCount }}
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
          Filter Delivered Items
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
            v-model:value="receivingBranchFilter"
            placeholder="Receiving Branch"
            class="w-full"
            @change="handleReceivingBranchFilterChange"
            allowClear
          >
            <a-select-option value="">All Receiving Branches</a-select-option>
            <template v-for="branch in allBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{
                branch.text
              }}</a-select-option>
            </template>
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

      <!-- Delivered Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Delivered Items</h3>
          <span class="text-sm text-secondary"
            >{{ filteredDeliveredItems.length }} items found</span
          >
        </div>
        <a-table
          :dataSource="filteredDeliveredItems"
          :columns="deliveredItemColumns"
          :loading="loading"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} items`,
          }"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1300 }"
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
                color="success"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                Delivered
              </a-tag>
            </template>

            <!-- Received By Column -->
            <template v-if="column.key === 'receivedBy'">
              <div class="flex items-center">
                <a-avatar
                  :size="24"
                  class="mr-2 bg-emerald-100 text-emerald-700"
                >
                  {{ getInitials(record.receivedBy) }}
                </a-avatar>
                {{ record.receivedBy }}
              </div>
            </template>
          </template>
        </a-table>

        <!-- Empty State -->
        <div
          v-if="!loading && deliveredItems.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">
            No delivered requisitions found
          </p>
          <p class="text-secondary">No requisitions have been delivered yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BankOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";

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
  receivedBy: string;
  status?: string;
  requestDate: string;
  challanNo: string;
  dispatchDate?: string;
  receivedDate?: string;
}

interface BranchOption {
  text: string;
  value: string;
}

// State variables
const loading = ref(true);
const searchText = ref("");
const bankFilter = ref("");
const branchFilter = ref("");
const receivingBranchFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const allItems = ref<ChequeItem[]>([]);
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

// All branches for receiving branch filter
const allBranches = computed(() => {
  const branches: BranchOption[] = [];
  Object.values(bankBranchesMap).forEach((bankBranches) => {
    branches.push(...bankBranches);
  });
  return branches;
});

// Available branches based on selected bank
const availableBranches = computed(() => {
  if (!bankFilter.value) return [];
  return (
    bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || []
  );
});

// Filter to only delivered items
const deliveredItems = computed(() => {
  return allItems.value.filter((item) => item.status === "Delivered");
});

// Count of unique banks
const uniqueBanksCount = computed(() => {
  const banks = new Set(deliveredItems.value.map((item) => item.bankName));
  return banks.size;
});

// Count of unique branches
const uniqueBranchesCount = computed(() => {
  const branches = new Set(deliveredItems.value.map((item) => item.branchName));
  return branches.size;
});

// Count of unique receiving branches
const uniqueReceivingBranchesCount = computed(() => {
  const branches = new Set(
    deliveredItems.value.map((item) => item.receivingBranch)
  );
  return branches.size;
});

// Delivered item columns for the table
const deliveredItemColumns = [
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
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 170,
    sorter: (a: ChequeItem, b: ChequeItem) =>
      a.receivingBranch.localeCompare(b.receivingBranch),
  },
  {
    title: "Received By",
    dataIndex: "receivedBy",
    key: "receivedBy",
    width: 170,
    sorter: (a: ChequeItem, b: ChequeItem) =>
      a.receivedBy.localeCompare(b.receivedBy),
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
    title: "Received Date",
    dataIndex: "receivedDate",
    key: "receivedDate",
    width: 150,
    render: (text: string) => formatDate(text),
    sorter: (a: ChequeItem, b: ChequeItem) =>
      new Date(a.receivedDate || "").getTime() -
      new Date(b.receivedDate || "").getTime(),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
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

// Get initials for avatar
const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Computed property for filtered delivered items
const filteredDeliveredItems = computed(() => {
  let result = [...deliveredItems.value];

  // Apply search filter
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.accountNo.toLowerCase().includes(searchLower) ||
        item.accountName.toLowerCase().includes(searchLower) ||
        item.bankName.toLowerCase().includes(searchLower) ||
        item.branchName.toLowerCase().includes(searchLower) ||
        item.receivedBy.toLowerCase().includes(searchLower)
    );
  }

  // Apply bank filter
  if (bankFilter.value) {
    result = result.filter((item) => item.bankName === bankFilter.value);
  }

  // Apply branch filter
  if (branchFilter.value) {
    result = result.filter((item) => item.branchName === branchFilter.value);
  }

  // Apply receiving branch filter
  if (receivingBranchFilter.value) {
    result = result.filter(
      (item) => item.receivingBranch === receivingBranchFilter.value
    );
  }

  // Apply date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = dateRange.value[0].valueOf();
    const endDate = dateRange.value[1].valueOf();

    result = result.filter((item) => {
      const recDate = new Date(item.receivedDate || "").getTime();
      return recDate >= startDate && recDate <= endDate;
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
    "Delivered",
  ];
  const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];
  const severities = ["High", "Medium", "Low"];
  const receivers = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sarah Davis",
    "Robert Wilson",
    "Jennifer Taylor",
    "David Miller",
    "Lisa Anderson",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    // For delivered page, make more items have Delivered status
    const randomStatus =
      Math.random() < 0.7
        ? "Delivered"
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

    // Generate a dispatch date that's after the request date
    const dispatchDate = new Date(requestDate);
    dispatchDate.setDate(
      dispatchDate.getDate() + Math.floor(Math.random() * 7) + 1
    ); // 1-7 days after request

    // Generate a received date that's after the dispatch date (if status is Delivered)
    let receivedDate = null;
    if (randomStatus === "Delivered") {
      receivedDate = new Date(dispatchDate);
      receivedDate.setDate(
        receivedDate.getDate() + Math.floor(Math.random() * 7) + 1
      ); // 1-7 days after dispatch
    }

    // For delivered items, randomly select a receiving branch and person
    const receivingBranchOptions =
      bankBranchesMap[bank as keyof typeof bankBranchesMap];
    const receivingBranch =
      receivingBranchOptions[
        Math.floor(Math.random() * receivingBranchOptions.length)
      ].value;
    const receivedBy = receivers[Math.floor(Math.random() * receivers.length)];

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
      receivingBranch: receivingBranch,
      receivedBy: randomStatus === "Delivered" ? receivedBy : "",
      status: randomStatus,
      requestDate: requestDate.toISOString(),
      dispatchDate: dispatchDate.toISOString(),
      receivedDate: receivedDate ? receivedDate.toISOString() : undefined,
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

// Handle bank filter change
const handleBankFilterChange = (value: string) => {
  bankFilter.value = value;
  branchFilter.value = ""; // Reset branch filter when bank changes
};

// Handle branch filter change
const handleBranchFilterChange = (value: string) => {
  branchFilter.value = value;
};

// Handle receiving branch filter change
const handleReceivingBranchFilterChange = (value: string) => {
  receivingBranchFilter.value = value;
};

// Handle date range change
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
  dateRange.value = dates;
};

// Handle challan no filter change
const handleChallanNoFilterChange = (e: Event) => {
  challanNoFilter.value = (e.target as HTMLInputElement).value;
};

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
