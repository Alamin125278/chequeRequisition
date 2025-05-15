<template>
  <div class="min-h-screen">
    <!-- <div class="bg-white rounded-lg shadow-xl p-3 border border-slate-200"> -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-4 md:mb-0">
          <span class="text-amber-600">Confirm Delivery</span> Requisition Management
        </h1>
        
        <div class="flex gap-3">
          <a-button type="primary" class="bg-amber-600 hover:bg-amber-700 border-0" @click="refreshData">
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

          <!-- Bank Filter (Read-only) -->
          <a-input
            v-model:value="bankFilter"
            placeholder="Bank"
            class="w-full md:w-48"
            disabled
          />

          <!-- Branch Filter - Dynamic based on selected bank -->
          <a-select
            v-model:value="branchFilter"
            placeholder="Select Branch"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
          >
            <a-select-option value="">All Branches</a-select-option>
            <template v-for="branch in availableBranches" :key="branch.value">
              <a-select-option :value="branch.value">{{ branch.text }}</a-select-option>
            </template>
          </a-select>

          <a-select
            v-model:value="severityFilter"
            placeholder="Filter by severity"
            class="w-full md:w-48"
            @change="handleSeverityFilterChange"
          >
            <a-select-option value="">All Severities</a-select-option>
            <a-select-option value="High">High</a-select-option>
            <a-select-option value="Medium">Medium</a-select-option>
            <a-select-option value="Low">Low</a-select-option>
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

      <!-- Bulk Actions -->
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex flex-wrap gap-3 items-center">
          <a-button
            v-if="hasSelectedItems"
            type="primary"
            @click="handleBulkConfirmDelivery"
            class="action-button confirm-button"
          >
            <template #icon><CheckCircleOutlined /></template>
            Confirm Delivery Receive ({{ selectedRowKeys.length }})
          </a-button>
          
          <span v-if="selectedRowKeys.length > 0" class="text-sm text-slate-500 ml-2">
            {{ selectedRowKeys.length }} item(s) selected
          </span>
        </div>
      </div>

      <!-- Dispatched Items Stats -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-card class="stats-card dispatched-card">
          <template #title>
            <div class="flex items-center">
              <SendOutlined class="text-amber-500 mr-2" />
              <span>Pending Delivery Items</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-amber-600">{{ dispatchedItems.length }}</p>
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
      </div>

      <!-- Dispatched Requisition Items Table -->
      <a-table
        :dataSource="filteredDispatchedItems"
        :columns="dispatchedItemColumns"
        :loading="loading"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total:number) => `Total ${total} items`,
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
        class="mb-6 custom-table"
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
              color="amber"
              class="px-3 py-1 rounded-full"
            >
              Dispatched
            </a-tag>
          </template>

          <!-- Actions Column -->
          <template v-if="column.key === 'actions'">
            <div class="flex justify-center">
              <a-button 
                type="primary" 
                class="action-button confirm-button"
                @click="confirmDeliveryItem(record)"
              >
                <template #icon><CheckCircleOutlined /></template>
                Confirm Delivery
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      
      <!-- Empty State -->
      <div v-if="!loading && dispatchedItems.length === 0" class="text-center py-12 bg-slate-50 rounded-lg">
        <InboxOutlined style="font-size: 48px" class="text-slate-300" />
        <p class="mt-3 text-slate-500 text-lg">No pending delivery items found</p>
        <p class="text-slate-400">No items are pending delivery confirmation for this bank</p>
      </div>
    <!-- </div> -->

    <!-- Confirmation Modal -->
    <a-modal
      v-model:visible="confirmModalVisible"
      :title="confirmModalTitle"
      @ok="handleConfirmAction"
      :okText="confirmModalOkText"
      :okButtonProps="{
        type: 'primary',
        class: confirmModalButtonClass,
      }"
    >
      <p>{{ confirmModalMessage }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { Table } from "ant-design-vue";
import {
  SendOutlined,
  ReloadOutlined,
  BranchesOutlined,
  InboxOutlined,
  CheckCircleOutlined
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
  status?: string;
  requestDate: string;
  challanNo: string;
  dispatchDate?: string;
}

interface BranchOption {
  text: string;
  value: string;
}

export default defineComponent({
  name: "ConfirmDeliveryList",
  components: {
    SendOutlined,
    ReloadOutlined,
    BranchesOutlined,
    InboxOutlined,
    CheckCircleOutlined
  },
  props: {
    bankName: {
      type: String,
      required: true,
      default: "National Bank" // Default bank for demo purposes
    }
  },
  setup(props) {
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
    const confirmModalButtonClass = ref("");
    const itemToAction = ref<ChequeItem | null>(null);

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
      return bankBranchesMap[bankFilter.value as keyof typeof bankBranchesMap] || [];
    });

    // Filter to only dispatched items for the selected bank
    const dispatchedItems = computed(() => {
      return allItems.value.filter(item => 
        item.status === 'Dispatched' && 
        item.bankName === bankFilter.value
      );
    });
    
    // Count of unique branches
    const uniqueBranchesCount = computed(() => {
      const branches = new Set(dispatchedItems.value.map(item => item.branchName));
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
          new Date(a.dispatchDate || '').getTime() - new Date(b.dispatchDate || '').getTime(),
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
        sorter: (a: ChequeItem, b: ChequeItem) => a.challanNo.localeCompare(b.challanNo),
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 220,
        align: "center",
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
          const dispDate = new Date(item.dispatchDate || '').getTime();
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
      const statuses = ["Pending", "Approved", "Ordered", "Download", "Dispatched", "Delivery Receive"];
      const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];
      const severities = ["High", "Medium", "Low"];

      return Array.from({ length: 50 }, (_, i) => {
        // For confirm delivery page, make more items have Dispatched status
        const randomStatus = Math.random() < 0.7 ? "Dispatched" : statuses[Math.floor(Math.random() * statuses.length)];
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
          dispatchDate.setDate(dispatchDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days after request
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
      confirmModalButtonClass.value = "confirm-button";
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
      confirmModalButtonClass.value = "confirm-button";
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
        allItems.value = allItems.value.map(item => {
          if (selectedRowKeys.value.includes(item.id)) {
            return { ...item, status: "Delivery Receive" };
          }
          return item;
        });

        message.success(`Successfully confirmed delivery receipt for ${selectedRowKeys.value.length} item(s)`);
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

    return {
      loading,
      searchText,
      severityFilter,
      bankFilter,
      branchFilter,
      dateRange,
      dispatchedItemColumns,
      allItems,
      dispatchedItems,
      filteredDispatchedItems,
      selectedRowKeys,
      hasSelectedItems,
      uniqueBranchesCount,
      availableBranches,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalOkText,
      confirmModalButtonClass,
      getSeverityColor,
      formatDate,
      refreshData,
      handleSearch,
      handleSeverityFilterChange,
      handleBranchFilterChange,
      handleDateRangeChange,
      onSelectChange,
      confirmDeliveryItem,
      handleBulkConfirmDelivery,
      handleConfirmAction,
      challanNoFilter,
      handleChallanNoFilterChange,
      Table,
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

.custom-table :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: #fef3c7;
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

.dispatched-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #fcd34d;
}

.branch-card {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-color: #d8b4fe;
}

/* Modern action buttons */
.action-button {
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 110px;
  height: 36px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-button {
  background-color: #d97706;
  border-color: #d97706;
}

.confirm-button:hover {
  background-color: #b45309;
  border-color: #b45309;
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
  
  .action-button {
    min-width: 90px;
    padding: 0 8px;
  }
}
</style>