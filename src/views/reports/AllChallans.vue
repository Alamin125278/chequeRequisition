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
              <div class="flex-shrink-0 bg-teal-500 rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-teal-500">All</span> Challans Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all delivery challans in one centralized
              dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4 flex gap-3">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600"
                @click="refreshData"
              >
                <template #icon><ReloadOutlined /></template>
                Refresh
              </a-button>
            </a-tooltip>
            <a-tooltip title="Export all challans">
              <a-button
                type="default"
                class="border-teal-500 text-teal-600 hover:bg-teal-50"
                @click="exportAllChallans"
              >
                <template #icon><DownloadOutlined /></template>
                Export All
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="max-w-7xl mx-auto py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <!-- Total Challans Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-teal-100 rounded-md p-3">
                <FileTextOutlined class="h-6 w-6 text-teal-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Total Challans
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ filteredChallans.length }}
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

        <!-- Total Items Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <AppstoreOutlined class="h-6 w-6 text-purple-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Total Items
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ totalItemsCount }}
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
          Filter Challans
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full"
            @change="handleBankFilterChange"
            allowClear
          >
            <a-select-option value="">All Banks</a-select-option>
            <a-select-option v-for="bank in banks" :key="bank" :value="bank">{{
              bank
            }}</a-select-option>
          </a-select>

          <a-select
            v-model:value="branchFilter"
            placeholder="Receiving Branch"
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

          <a-input
            v-model:value="challanNoFilter"
            placeholder="Challan Number"
            class="w-full"
            @change="handleChallanNoFilterChange"
            :allowClear="true"
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full"
            :placeholder="['Start Date', 'End Date']"
          />
        </div>
      </div>

      <!-- Challans Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Challans</h3>
          <span class="text-sm text-secondary"
            >{{ filteredChallans.length }} challans found</span
          >
        </div>
        <a-table
          :dataSource="filteredChallans"
          :columns="challanColumns"
          :loading="loading"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} challans`,
          }"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1000 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record }">
            <!-- SL No Column -->
            <template v-if="column.key === 'slNo'">
              <span class="font-medium">{{ record.slNo }}</span>
            </template>

            <!-- Challan Number Column -->
            <template v-if="column.key === 'challanNo'">
              <a-tag
                class="px-3 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border-teal-200"
              >
                {{ record.challanNo }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex flex-wrap justify-center gap-2">
                <a-tooltip title="View Challan Items">
                  <a-button
                    type="default"
                    shape="circle"
                    class="bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600"
                    @click="viewChallanItems(record)"
                    ><EyeOutlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip title="Export Challan">
                  <a-button
                    type="default"
                    shape="circle"
                    class="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                    @click="exportChallan(record)"
                  >
                    <ExportOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>

        <!-- Empty State -->
        <div
          v-if="!loading && filteredChallans.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">No challans found</p>
          <p class="text-secondary">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    </div>

    <!-- Challan Items Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      :title="`Challan Details: ${selectedChallan?.challanNo || ''}`"
      width="90%"
      :footer="null"
      class="challan-items-modal"
    >
      <div v-if="selectedChallan" class="mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Bank</p>
            <p class="font-medium text-primary">
              {{ selectedChallan.bankName }}
            </p>
          </div>
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Receiving Branch</p>
            <p class="font-medium text-primary">
              {{ selectedChallan.receivingBranch }}
            </p>
          </div>
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Challan Date</p>
            <p class="font-medium text-primary">
              {{ formatDate(selectedChallan.challanDate) }}
            </p>
          </div>
        </div>

        <a-table
          :dataSource="challanItems"
          :columns="challanItemColumns"
          :loading="itemsLoading"
          :pagination="{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Total ${total} items`,
          }"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1200 }"
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
                color="teal"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.status }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  AppstoreOutlined,
  BankOutlined,
  DownloadOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  InboxOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";

interface ChallanItem {
  id: number;
  accountNo: string;
  accountName: string;
  startNo: number;
  endNo: number;
  bookQuantity: number;
  severity: string;
  status: string;
}

interface Challan {
  id: number;
  slNo: number;
  challanNo: string;
  bankName: string;
  receivingBranch: string;
  challanDate: string;
  courierName: string;
  itemsCount: number;
}

interface BranchOption {
  text: string;
  value: string;
}

// State variables
const loading = ref(true);
const itemsLoading = ref(false);
const bankFilter = ref("");
const branchFilter = ref("");
const challanNoFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const challans = ref<Challan[]>([]);
const isModalVisible = ref(false);
const selectedChallan = ref<Challan | null>(null);
const challanItems = ref<ChallanItem[]>([]);

// List of banks
const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];

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

// Count of unique banks
const uniqueBanksCount = computed(() => {
  const uniqueBanks = new Set(
    challans.value.map((challan) => challan.bankName)
  );
  return uniqueBanks.size;
});

// Total items count across all challans
const totalItemsCount = computed(() => {
  return challans.value.reduce(
    (total, challan) => total + challan.itemsCount,
    0
  );
});

// Challan columns for the table
const challanColumns = [
  {
    title: "SL No",
    dataIndex: "slNo",
    key: "slNo",
    width: 80,
  },
  {
    title: "Challan Number",
    dataIndex: "challanNo",
    key: "challanNo",
    width: 180,
    sorter: (a: Challan, b: Challan) => a.challanNo.localeCompare(b.challanNo),
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
    width: 150,
    sorter: (a: Challan, b: Challan) => a.bankName.localeCompare(b.bankName),
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
    width: 180,
    sorter: (a: Challan, b: Challan) =>
      a.receivingBranch.localeCompare(b.receivingBranch),
  },
  {
    title: "Challan Date",
    dataIndex: "challanDate",
    key: "challanDate",
    width: 150,
    render: (text: string) => formatDate(text),
    sorter: (a: Challan, b: Challan) =>
      new Date(a.challanDate).getTime() - new Date(b.challanDate).getTime(),
  },
  {
    title: "Courier Name",
    dataIndex: "courierName",
    key: "courierName",
    width: 150,
  },
  {
    title: "Items Count",
    dataIndex: "itemsCount",
    key: "itemsCount",
    width: 120,
    sorter: (a: Challan, b: Challan) => a.itemsCount - b.itemsCount,
  },
  {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 180,
  },
];

// Challan item columns for the modal table
const challanItemColumns = [
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
    width: 200,
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
    title: "Book Quantity",
    dataIndex: "bookQuantity",
    key: "bookQuantity",
    width: 150,
  },
  {
    title: "Severity",
    dataIndex: "severity",
    key: "severity",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
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

// Computed property for filtered challans
const filteredChallans = computed(() => {
  let result = [...challans.value];

  // Apply bank filter
  if (bankFilter.value) {
    result = result.filter((challan) => challan.bankName === bankFilter.value);
  }

  // Apply branch filter
  if (branchFilter.value) {
    result = result.filter(
      (challan) => challan.receivingBranch === branchFilter.value
    );
  }

  // Apply challan number filter
  if (challanNoFilter.value) {
    result = result.filter((challan) =>
      challan.challanNo
        .toLowerCase()
        .includes(challanNoFilter.value.toLowerCase())
    );
  }

  // Apply date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = dateRange.value[0].valueOf();
    const endDate = dateRange.value[1].valueOf();

    result = result.filter((challan) => {
      const challanDate = new Date(challan.challanDate).getTime();
      return challanDate >= startDate && challanDate <= endDate;
    });
  }

  return result;
});

// Fetch challans data
const fetchChallans = async () => {
  loading.value = true;
  try {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      challans.value = generateMockChallans();
      loading.value = false;
    }, 1000);
  } catch (error) {
    message.error("Failed to fetch challans");
    loading.value = false;
  }
};

// Refresh data
const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    challans.value = generateMockChallans();
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

// Generate mock data for demonstration
const generateMockChallans = (): Challan[] => {
  const couriers = [
    "FastExpress",
    "SpeedCourier",
    "SecureDelivery",
    "QuickShip",
    "PriorityPost",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const bank = banks[i % 4];
    const branchOptions = bankBranchesMap[bank as keyof typeof bankBranchesMap];
    const branch = branchOptions[i % branchOptions.length].value;

    // Generate a challan date
    const challanDate = new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );

    return {
      id: i + 1,
      slNo: i + 1,
      challanNo: `CHN-${10000 + i}`,
      bankName: bank,
      receivingBranch: branch,
      challanDate: challanDate.toISOString(),
      courierName: couriers[i % couriers.length],
      itemsCount: Math.floor(Math.random() * 10) + 1, // 1-10 items per challan
    };
  });
};

// Generate mock challan items
const generateMockChallanItems = (challan: Challan): ChallanItem[] => {
  const severities = ["High", "Medium", "Low"];
  const statuses = ["Pending", "Dispatched", "Delivered"];

  return Array.from({ length: challan.itemsCount }, (_, i) => {
    return {
      id: i + 1,
      accountNo: `AC-${100000 + i}`,
      accountName: `Account Holder ${i + 1}`,
      startNo: 1000 + i * 100,
      endNo: 1099 + i * 100,
      bookQuantity: Math.floor(Math.random() * 5) + 1,
      severity: severities[i % 3],
      status: statuses[Math.floor(Math.random() * statuses.length)],
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

// View challan items
const viewChallanItems = (challan: Challan) => {
  selectedChallan.value = challan;
  isModalVisible.value = true;
  itemsLoading.value = true;

  // Simulate API call to fetch challan items
  setTimeout(() => {
    challanItems.value = generateMockChallanItems(challan);
    itemsLoading.value = false;
  }, 500);
};

// Export challan
const exportChallan = (challan: Challan) => {
  message.success(`Exporting challan ${challan.challanNo} as Excel file...`);
  // In a real application, this would trigger an API call to generate and download an Excel file
};

// Export all challans
const exportAllChallans = () => {
  message.success(
    `Exporting all ${filteredChallans.value.length} challans as Excel file...`
  );
  // In a real application, this would trigger an API call to generate and download an Excel file
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

// Handle challan number filter change
const handleChallanNoFilterChange = (e: Event) => {
  challanNoFilter.value = (e.target as HTMLInputElement).value;
};

// Handle date range change
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
  dateRange.value = dates;
};

// Fetch data on component mount
onMounted(() => {
  fetchChallans();
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

/* Custom modal styles */
.challan-items-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.challan-items-modal :deep(.ant-modal-header) {
  background-color: #e6fffa;
  border-bottom: 1px solid #b2f5ea;
  padding: 16px 24px;
}

.challan-items-modal :deep(.ant-modal-title) {
  color: #0d9488;
  font-weight: 600;
  font-size: 18px;
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
  border-color: #14b8a6 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #14b8a6 !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
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

.ant-tag-teal {
  background-color: rgba(20, 184, 166, 0.1) !important;
  border-color: #14b8a6 !important;
  color: #0d9488 !important;
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
