<template>
  <div class="min-h-screen">
    <!-- <div class="bg-white rounded-lg shadow-xl p-3 border border-slate-200"> -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-4 md:mb-0">
          <span class="text-emerald-600">Delivered</span> Requisition Management
        </h1>
        
        <div class="flex gap-3">
          <a-button type="primary" class="bg-emerald-600 hover:bg-emerald-700 border-0" @click="refreshData">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div class="flex flex-wrap gap-4">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by account number or name"
            enter-button
            @search="handleSearch"
            class="w-full md:w-64"
            :allowClear="true"
          />

          <!-- Bank Filter -->
          <a-select
            v-model:value="bankFilter"
            placeholder="Select Bank"
            class="w-full md:w-48"
            @change="handleBankFilterChange"
          >
            <a-select-option value="">All Banks</a-select-option>
            <a-select-option value="National Bank">National Bank</a-select-option>
            <a-select-option value="City Bank">City Bank</a-select-option>
            <a-select-option value="Metro Bank">Metro Bank</a-select-option>
            <a-select-option value="Global Bank">Global Bank</a-select-option>
          </a-select>

          <!-- Branch Filter - Dynamic based on selected bank -->
          <a-select
            v-model:value="branchFilter"
            placeholder="Select Branch"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
            :disabled="!bankFilter"
          >
            <a-select-option value="">All Branches</a-select-option>
            <template v-for="branch in availableBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{ branch.text }}</a-select-option>
            </template>
          </a-select>

          <a-select
            v-model:value="receivingBranchFilter"
            placeholder="Receiving Branch"
            class="w-full md:w-48"
            @change="handleReceivingBranchFilterChange"
          >
            <a-select-option value="">All Receiving Branches</a-select-option>
            <template v-for="branch in allBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{ branch.text }}</a-select-option>
            </template>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full md:w-auto"
            :placeholder="['Start Date', 'End Date']"
          />

          <a-input
            v-model:value="challanNoFilter"
            placeholder="Filter by Challan No"
            class="w-full md:w-48"
            @change="handleChallanNoFilterChange"
            :allowClear="true"
          />
        </div>
      </div>

      <!-- Delivered Items Stats -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <a-card class="stats-card delivered-card">
          <template #title>
            <div class="flex items-center">
              <CheckCircleOutlined class="text-emerald-500 mr-2" />
              <span>Delivered Items</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-emerald-600">{{ deliveredItems.length }}</p>
        </a-card>
        
        <a-card class="stats-card bank-card">
          <template #title>
            <div class="flex items-center">
              <BankOutlined class="text-blue-500 mr-2" />
              <span>Banks</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-blue-600">{{ uniqueBanksCount }}</p>
        </a-card>
        
        <a-card class="stats-card branch-card">
          <template #title>
            <div class="flex items-center">
              <BranchesOutlined class="text-purple-500 mr-2" />
              <span>Branches</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-purple-600">{{ uniqueBranchesCount }}</p>
        </a-card>

        <a-card class="stats-card receiving-branch-card">
          <template #title>
            <div class="flex items-center">
              <HomeOutlined class="text-amber-500 mr-2" />
              <span>Receiving Branches</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-amber-600">{{ uniqueReceivingBranchesCount }}</p>
        </a-card>
      </div>

      <!-- Delivered Requisition Items Table -->
      <a-table
        :dataSource="filteredDeliveredItems"
        :columns="deliveredItemColumns"
        :loading="loading"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total:number) => `Total ${total} items`,
        }"
        rowKey="id"
        class="mb-6 custom-table"
        :scroll="{ x: 1300 }"
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
              color="green"
              class="px-3 py-1 rounded-full bg-emerald-800 text-emerald-100 border-emerald-400"
            >
              Delivery Completed
            </a-tag>
          </template>

          <!-- Received By Column -->
          <template v-if="column.key === 'receivedBy'">
            <div class="flex items-center">
              <a-avatar :size="24" class="mr-2 bg-emerald-100 text-emerald-700">
                {{ getInitials(record.receivedBy) }}
              </a-avatar>
              {{ record.receivedBy }}
            </div>
          </template>
        </template>
      </a-table>
      
      <!-- Empty State -->
      <div v-if="!loading && deliveredItems.length === 0" class="text-center py-12 bg-slate-50 rounded-lg">
        <InboxOutlined style="font-size: 48px" class="text-slate-300" />
        <p class="mt-3 text-slate-500 text-lg">No delivered requisitions found</p>
        <p class="text-slate-400">No requisitions have been delivered yet</p>
      </div>
    </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  BankOutlined,
  BranchesOutlined,
  InboxOutlined,
  HomeOutlined
} from "@ant-design/icons-vue";

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

export default defineComponent({
  name: "DeliveredRequisitionList",
  components: {
    CheckCircleOutlined,
    ReloadOutlined,
    BankOutlined,
    BranchesOutlined,
    InboxOutlined,
    HomeOutlined
  },
  setup() {
    const loading = ref(true);
    const searchText = ref("");
    const severityFilter = ref("");
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

    // All branches for receiving branch filter
    const allBranches = computed(() => {
      const branches: BranchOption[] = [];
      Object.values(bankBranchesMap).forEach(bankBranches => {
        branches.push(...bankBranches);
      });
      return branches;
    });

    // Available branches based on selected bank
    const availableBranches = computed(() => {
      if (!bankFilter.value) return [];
      return bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || [];
    });

    // Filter to only delivered items
    const deliveredItems = computed(() => {
      return allItems.value.filter(item => item.status === 'Delivered');
    });
    
    // Count of unique banks
    const uniqueBanksCount = computed(() => {
      const banks = new Set(deliveredItems.value.map(item => item.bankName));
      return banks.size;
    });
    
    // Count of unique branches
    const uniqueBranchesCount = computed(() => {
      const branches = new Set(deliveredItems.value.map(item => item.branchName));
      return branches.size;
    });

    // Count of unique receiving branches
    const uniqueReceivingBranchesCount = computed(() => {
      const branches = new Set(deliveredItems.value.map(item => item.receivingBranch));
      return branches.size;
    });

    // Delivered item columns for the table
    const deliveredItemColumns = [
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        sorter: (a: ChequeItem, b: ChequeItem) => a.accountNo.localeCompare(b.accountNo),
        width: 150,
      },
      {
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        sorter: (a: ChequeItem, b: ChequeItem) => a.accountName.localeCompare(b.accountName),
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
        sorter: (a: ChequeItem, b: ChequeItem) => a.receivingBranch.localeCompare(b.receivingBranch),
      },
      {
        title: "Received By",
        dataIndex: "receivedBy",
        key: "receivedBy",
        width: 170,
        sorter: (a: ChequeItem, b: ChequeItem) => a.receivedBy.localeCompare(b.receivedBy),
      },
      {
        title: "Challan No",
        dataIndex: "challanNo",
        key: "challanNo",
        width: 150,
        sorter: (a: ChequeItem, b: ChequeItem) => a.challanNo.localeCompare(b.challanNo),
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
          new Date(a.dispatchDate || '').getTime() - new Date(b.dispatchDate || '').getTime(),
      },
      {
        title: "Received Date",
        dataIndex: "receivedDate",
        key: "receivedDate",
        width: 150,
        render: (text: string) => formatDate(text),
        sorter: (a: ChequeItem, b: ChequeItem) => 
          new Date(a.receivedDate || '').getTime() - new Date(b.receivedDate || '').getTime(),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 170,
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

    // Get initials for avatar
    const getInitials = (name: string) => {
      if (!name) return '';
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
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
        result = result.filter((item) => item.receivingBranch === receivingBranchFilter.value);
      }

      // Apply date range filter
      if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        const startDate = dateRange.value[0].valueOf();
        const endDate = dateRange.value[1].valueOf();

        result = result.filter((item) => {
          const recDate = new Date(item.receivedDate || '').getTime();
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
      const statuses = ["Pending", "Approved", "Ordered", "Download", "Dispatched", "Delivered"];
      const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];
      const severities = ["High", "Medium", "Low"];
      const receivers = [
        "John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis", 
        "Robert Wilson", "Jennifer Taylor", "David Miller", "Lisa Anderson"
      ];

      return Array.from({ length: 50 }, (_, i) => {
        // For delivered page, make more items have Delivered status
        const randomStatus = Math.random() < 0.7 ? "Delivered" : statuses[Math.floor(Math.random() * statuses.length)];
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
        dispatchDate.setDate(dispatchDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after request
        
        // Generate a received date that's after the dispatch date (if status is Delivered)
        let receivedDate = null;
        if (randomStatus === "Delivered") {
          receivedDate = new Date(dispatchDate);
          receivedDate.setDate(receivedDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after dispatch
        }
        
        // For delivered items, randomly select a receiving branch and person
        const receivingBranchOptions = bankBranchesMap[bank as keyof typeof bankBranchesMap];
        const receivingBranch = receivingBranchOptions[Math.floor(Math.random() * receivingBranchOptions.length)].value;
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
        High: "red",
        Medium: "orange",
        Low: "green",
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

    return {
      loading,
      searchText,
      bankFilter,
      branchFilter,
      receivingBranchFilter,
      dateRange,
      deliveredItemColumns,
      allItems,
      deliveredItems,
      filteredDeliveredItems,
      uniqueBanksCount,
      uniqueBranchesCount,
      uniqueReceivingBranchesCount,
      availableBranches,
      allBranches,
      getSeverityColor,
      getInitials,
      formatDate,
      refreshData,
      handleSearch,
      handleBankFilterChange,
      handleBranchFilterChange,
      handleReceivingBranchFilterChange,
      handleDateRangeChange,
      challanNoFilter,
      handleChallanNoFilterChange,
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

.delivered-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #6ee7b7;
}

.bank-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
}

.branch-card {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-color: #d8b4fe;
}

.receiving-branch-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fcd34d;
}

/* Transition effects */
.ant-table-row {
  transition: background-color 0.3s ease;
}

.ant-tag {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table-cell {
    padding: 8px 4px !important;
  }
}
</style>