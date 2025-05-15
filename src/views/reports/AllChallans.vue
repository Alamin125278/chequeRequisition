<template>
  <div class="min-h-screen">
    <!-- <div class="bg-white rounded-lg shadow-xl p-3 border border-slate-200"> -->
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-4 md:mb-0">
          <span class="text-teal-600">All</span> Challans Management
        </h1>
        
        <div class="flex gap-3">
          <a-button type="primary" class="bg-teal-600 hover:bg-teal-700 border-0" @click="refreshData">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button type="default" class="border-teal-500 text-teal-600 hover:bg-teal-50" @click="exportAllChallans">
            <template #icon><DownloadOutlined /></template>
            Export All
          </a-button>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div class="flex flex-wrap gap-4">
          <!-- Bank Filter -->
          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full md:w-48"
            @change="handleBankFilterChange"
            allowClear
          >
            <a-select-option value="">All Banks</a-select-option>
            <a-select-option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</a-select-option>
          </a-select>

          <!-- Branch Filter - Dynamic based on selected bank -->
          <a-select
            v-model:value="branchFilter"
            placeholder="Receiving Branch"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
            :disabled="!bankFilter"
            allowClear
          >
            <a-select-option value="">All Branches</a-select-option>
            <template v-for="branch in availableBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{ branch.text }}</a-select-option>
            </template>
          </a-select>

          <!-- Challan Number Filter -->
          <a-input
            v-model:value="challanNoFilter"
            placeholder="Challan Number"
            class="w-full md:w-48"
            @change="handleChallanNoFilterChange"
            allowClear
          />

          <!-- Challan Date Range Filter -->
          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full md:w-auto"
            :placeholder="['Start Date', 'End Date']"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a-card class="stats-card challans-card">
          <template #title>
            <div class="flex items-center">
              <FileTextOutlined class="text-teal-500 mr-2" />
              <span>Total Challans</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-teal-600">{{ filteredChallans.length }}</p>
        </a-card>
        
        <a-card class="stats-card banks-card">
          <template #title>
            <div class="flex items-center">
              <BankOutlined class="text-blue-500 mr-2" />
              <span>Banks</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-blue-600">{{ uniqueBanksCount }}</p>
        </a-card>
        
        <a-card class="stats-card items-card">
          <template #title>
            <div class="flex items-center">
              <AppstoreOutlined class="text-purple-500 mr-2" />
              <span>Total Items</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-purple-600">{{ totalItemsCount }}</p>
        </a-card>
      </div>

      <!-- Challans Table -->
      <a-table
        :dataSource="filteredChallans"
        :columns="challanColumns"
        :loading="loading"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total:number) => `Total ${total} challans`,
        }"
        rowKey="id"
        class="mb-6 custom-table"
        :scroll="{ x: 1000 }"
      >
        <template #bodyCell="{ column, record }">
          <!-- SL No Column -->
          <template v-if="column.key === 'slNo'">
            <span class="font-medium">{{ record.slNo }}</span>
          </template>
          
          <!-- Challan Number Column -->
          <template v-if="column.key === 'challanNo'">
            <a-tag class="px-3 py-1 bg-teal-50 text-teal-700 border-teal-200 rounded-full">
              {{ record.challanNo }}
            </a-tag>
          </template>
          
          <!-- Actions Column -->
          <template v-if="column.key === 'actions'">
            <div class="flex gap-2">
              <a-button 
                type="primary" 
                size="small" 
                class="bg-teal-600 hover:bg-teal-700 border-0"
                @click="viewChallanItems(record)"
              >
                <template #icon><EyeOutlined /></template>
                View
              </a-button>
              <a-button 
                type="default" 
                size="small" 
                class="border-teal-500 text-teal-600 hover:bg-teal-50"
                @click="exportChallan(record)"
              >
                <template #icon><DownloadOutlined /></template>
                Export
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredChallans.length === 0" class="text-center py-12 bg-slate-50 rounded-lg">
        <InboxOutlined style="font-size: 48px" class="text-slate-300" />
        <p class="mt-3 text-slate-500 text-lg">No challans found</p>
        <p class="text-slate-400">Try adjusting your filters to see more results</p>
      </div>
    <!-- </div> -->

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
          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="text-sm text-slate-500">Bank</p>
            <p class="font-medium text-slate-800">{{ selectedChallan.bankName }}</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="text-sm text-slate-500">Receiving Branch</p>
            <p class="font-medium text-slate-800">{{ selectedChallan.receivingBranch }}</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="text-sm text-slate-500">Challan Date</p>
            <p class="font-medium text-slate-800">{{ formatDate(selectedChallan.challanDate) }}</p>
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
            showTotal: (total:number) => `Total ${total} items`,
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
                class="px-2 py-0.5 rounded-full"
              >
                {{ record.severity }}
              </a-tag>
            </template>
            
            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag
                color="teal"
                class="px-3 py-1 rounded-full"
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  FileTextOutlined,
  ReloadOutlined,
  BankOutlined,
  AppstoreOutlined,
  InboxOutlined,
  EyeOutlined,
  DownloadOutlined
} from "@ant-design/icons-vue";

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

export default defineComponent({
  name: "AllChallansPage",
  components: {
    FileTextOutlined,
    ReloadOutlined,
    BankOutlined,
    AppstoreOutlined,
    InboxOutlined,
    EyeOutlined,
    DownloadOutlined
  },
  setup() {
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
        { text: "National South Branch", value: "National South Branch" }
      ],
      "City Bank": [
        { text: "City Central Branch", value: "City Central Branch" },
        { text: "City East Branch", value: "City East Branch" },
        { text: "City West Branch", value: "City West Branch" }
      ],
      "Metro Bank": [
        { text: "Metro Downtown Branch", value: "Metro Downtown Branch" },
        { text: "Metro Uptown Branch", value: "Metro Uptown Branch" }
      ],
      "Global Bank": [
        { text: "Global HQ Branch", value: "Global HQ Branch" },
        { text: "Global Regional Branch", value: "Global Regional Branch" },
        { text: "Global International Branch", value: "Global International Branch" }
      ]
    };

    // Available branches based on selected bank
    const availableBranches = computed(() => {
      if (!bankFilter.value) return [];
      return bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || [];
    });

    // Count of unique banks
    const uniqueBanksCount = computed(() => {
      const uniqueBanks = new Set(challans.value.map(challan => challan.bankName));
      return uniqueBanks.size;
    });
    
    // Total items count across all challans
    const totalItemsCount = computed(() => {
      return challans.value.reduce((total, challan) => total + challan.itemsCount, 0);
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
        sorter: (a: Challan, b: Challan) => a.receivingBranch.localeCompare(b.receivingBranch),
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
      if (!dateString) return '';
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
        result = result.filter((challan) => challan.receivingBranch === branchFilter.value);
      }

      // Apply challan number filter
      if (challanNoFilter.value) {
        result = result.filter((challan) => 
          challan.challanNo.toLowerCase().includes(challanNoFilter.value.toLowerCase())
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
      const couriers = ["FastExpress", "SpeedCourier", "SecureDelivery", "QuickShip", "PriorityPost"];
      
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
        High: "red",
        Medium: "orange",
        Low: "green",
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
      message.success(`Exporting all ${filteredChallans.value.length} challans as Excel file...`);
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

    return {
      loading,
      itemsLoading,
      bankFilter,
      branchFilter,
      challanNoFilter,
      dateRange,
      challanColumns,
      challanItemColumns,
      challans,
      filteredChallans,
      uniqueBanksCount,
      totalItemsCount,
      banks,
      availableBranches,
      isModalVisible,
      selectedChallan,
      challanItems,
      getSeverityColor,
      formatDate,
      refreshData,
      viewChallanItems,
      exportChallan,
      exportAllChallans,
      handleBankFilterChange,
      handleBranchFilterChange,
      handleChallanNoFilterChange,
      handleDateRangeChange,
    };
  },
});
</script>

<style scoped>
/* Enhanced custom styles with professional color scheme */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: #f1f5f9;
  font-weight: 600;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8fafc;
}

.custom-table :deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Stats cards */
.stats-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.challans-card {
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  border-color: #5eead4;
}

.banks-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
}

.items-card {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-color: #d8b4fe;
}

/* Modal styles */
.challan-items-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

.challan-items-modal :deep(.ant-modal-header) {
  background-color: #f0fdfa;
  border-bottom: 1px solid #ccfbf1;
  padding: 16px 24px;
}

.challan-items-modal :deep(.ant-modal-title) {
  color: #0f766e;
  font-weight: 600;
}

/* Button hover effects */
a-button {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table-cell {
    padding: 8px 4px !important;
  }
  
  .stats-card {
    margin-bottom: 12px;
  }
}
</style>