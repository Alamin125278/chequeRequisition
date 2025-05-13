<template>
  <div class="min-h-screen">
    <div class="bg-white rounded-lg shadow-xl p-3 border border-slate-200">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-4 md:mb-0">
          <span class="text-orange-500">Pending</span> Requisition Management
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

          <a-select
            v-model:value="branchFilter"
            placeholder="Filter by Branch Name"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
          >
            <a-select-option value="">All Branches</a-select-option>
            <a-select-option value="Main">Main Branch</a-select-option>
            <a-select-option value="North">North Branch</a-select-option>
            <a-select-option value="South">South Branch</a-select-option>
            <a-select-option value="East">East Branch</a-select-option>
            <a-select-option value="West">West Branch</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full md:w-auto"
            :placeholder="['Start Date', 'End Date']"
          />
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="mb-4 flex flex-wrap gap-3 items-center">
        <a-button
          v-if="hasSelectedItems"
          type="primary"
          @click="handleBulkApprove"
          class="action-button approve-button"
        >
          <template #icon><CheckOutlined /></template>
          Approve Selected ({{ selectedRowKeys.length }})
        </a-button>
        
        <span v-if="selectedRowKeys.length > 0" class="text-sm text-slate-500 ml-2">
          {{ selectedRowKeys.length }} item(s) selected
        </span>
      </div>

      <!-- Pending Items Stats -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a-card class="stats-card pending-card">
          <template #title>
            <div class="flex items-center">
              <ClockCircleOutlined class="text-orange-500 mr-2" />
              <span>Pending Items</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-orange-600">{{ pendingItems.length }}</p>
        </a-card>
        
        <a-card class="stats-card severity-card">
          <template #title>
            <div class="flex items-center">
              <WarningOutlined class="text-red-500 mr-2" />
              <span>High Severity</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-red-600">{{ highSeverityCount }}</p>
        </a-card>
        
        <a-card class="stats-card branch-card">
          <template #title>
            <div class="flex items-center">
              <BranchesOutlined class="text-blue-500 mr-2" />
              <span>Branches</span>
            </div>
          </template>
          <p class="text-2xl font-bold text-blue-600">{{ uniqueBranchesCount }}</p>
        </a-card>
      </div>

      <!-- Pending Requisition Items Table -->
      <a-table
        :dataSource="filteredPendingItems"
        :columns="pendingItemColumns"
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
              color="orange"
              class="px-3 py-1 rounded-full"
            >
              Pending
            </a-tag>
          </template>

          <!-- Actions Column -->
          <template v-if="column.key === 'actions'">
            <div class="flex flex-wrap justify-center gap-2">
              <!-- Approve Button -->
              <a-button 
                type="primary" 
                class="action-button approve-button"
                @click="approveItem(record)"
              >
                <template #icon><CheckOutlined /></template>
                Approve
              </a-button>
              
              <!-- Edit and Delete buttons -->
              <div class="flex gap-1 ml-1">
                <a-button
                  type="default"
                  size="middle"
                  class="edit-button"
                  @click="editItem(record)"
                >
                  <template #icon><EditOutlined /></template>
                </a-button>
                
                <a-button
                  type="default"
                  danger
                  size="middle"
                  class="delete-button"
                  @click="deleteItem(record)"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </div>
            </div>
          </template>
        </template>
      </a-table>
      
      <!-- Empty State -->
      <div v-if="!loading && pendingItems.length === 0" class="text-center py-12 bg-slate-50 rounded-lg">
        <InboxOutlined style="font-size: 48px" class="text-slate-300" />
        <p class="mt-3 text-slate-500 text-lg">No pending requisitions found</p>
        <p class="text-slate-400">All requisitions have been processed</p>
      </div>
    </div>

    <!-- Edit Item Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="Edit Pending Item"
      @ok="handleEditSave"
      :confirmLoading="editLoading"
    >
      <div v-if="editingItem" class="space-y-4">
        <a-form :model="editingItem" layout="vertical">
          <a-form-item label="Account Number">
            <a-input v-model:value="editingItem.accountNo" />
          </a-form-item>
          
          <a-form-item label="Account Name">
            <a-input v-model:value="editingItem.accountName" />
          </a-form-item>
          
          <a-form-item label="Start Number">
            <a-input-number v-model:value="editingItem.startNo" style="width: 100%" />
          </a-form-item>
          
          <a-form-item label="End Number">
            <a-input-number v-model:value="editingItem.endNo" style="width: 100%" />
          </a-form-item>
          
          <a-form-item label="Book Quantity">
            <a-input-number v-model:value="editingItem.bookQuantity" style="width: 100%" />
          </a-form-item>
          
          <a-form-item label="Severity">
            <a-select v-model:value="editingItem.severity">
              <a-select-option value="High">High</a-select-option>
              <a-select-option value="Medium">Medium</a-select-option>
              <a-select-option value="Low">Low</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Branch">
            <a-select v-model:value="editingItem.branchName">
              <a-select-option value="Main Branch">Main Branch</a-select-option>
              <a-select-option value="North Branch">North Branch</a-select-option>
              <a-select-option value="South Branch">South Branch</a-select-option>
              <a-select-option value="East Branch">East Branch</a-select-option>
              <a-select-option value="West Branch">West Branch</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- Confirmation Modal -->
    <a-modal
      v-model:visible="confirmModalVisible"
      :title="confirmModalTitle"
      @ok="handleConfirmAction"
      :okText="confirmModalOkText"
      :okButtonProps="{
        type: 'primary',
        danger: confirmModalAction === 'delete',
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
import {
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  BranchesOutlined,
  InboxOutlined
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
}

export default defineComponent({
  name: "PendingRequisitionList",
  components: {
    CheckOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    ClockCircleOutlined,
    WarningOutlined,
    BranchesOutlined,
    InboxOutlined
  },
  setup() {
    const loading = ref(true);
    const searchText = ref("");
    const severityFilter = ref("");
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
    const editModalVisible = ref(false);
    const editingItem = ref<ChequeItem | null>(null);
    const editLoading = ref(false);

    // Filter to only pending items
    const pendingItems = computed(() => {
      return allItems.value.filter(item => !item.status || item.status === 'Pending');
    });
    
    // Count of high severity items
    const highSeverityCount = computed(() => {
      return pendingItems.value.filter(item => item.severity === 'High').length;
    });
    
    // Count of unique branches
    const uniqueBranchesCount = computed(() => {
      const branches = new Set(pendingItems.value.map(item => item.branchName));
      return branches.size;
    });

    // Computed property to check if any items are selected
    const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

    // Pending item columns for the table
    const pendingItemColumns = [
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
        filters: [
          { text: "Main Branch", value: "Main Branch" },
          { text: "North Branch", value: "North Branch" },
          { text: "South Branch", value: "South Branch" },
          { text: "East Branch", value: "East Branch" },
          { text: "West Branch", value: "West Branch" },
        ],
        onFilter: (value: string, record: ChequeItem) => record.branchName === value,
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
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 220,
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

    // Computed property for filtered pending items
    const filteredPendingItems = computed(() => {
      let result = [...pendingItems.value];

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
        result = result.filter((item) => item.branchName.includes(branchFilter.value));
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
      const statuses = ["Pending", "Approved", "Ordered", "Download", "Dispatch", "Delivery Receive"];
      const branches = ["Main Branch", "North Branch", "South Branch", "East Branch", "West Branch"];
      const severities = ["High", "Medium", "Low"];

      return Array.from({ length: 50 }, (_, i) => {
        // For pending page, make more items have Pending status
        const randomStatus = Math.random() < 0.7 ? "Pending" : statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: i + 1,
          accountNo: `AC-${100000 + i}`,
          routingNo: `RT-${200000 + i}`,
          startNo: 1000 + i * 100,
          endNo: 1099 + i * 100,
          prefix: `PFX-${i % 5}`,
          series: `S-${i % 3}`,
          severity: severities[i % 3],
          branchName: branches[i % 5],
          accountName: `Account Holder ${i + 1}`,
          customerAddress: `123 Main St, City ${i + 1}, Country`,
          bookQuantity: Math.floor(Math.random() * 5) + 1,
          transactionCode: 1000 + i,
          leafCount: (Math.floor(Math.random() * 5) + 1) * 10,
          courierCode: `CR-${1000 + i}`,
          distributionPointName: `Distribution Point ${(i % 5) + 1}`,
          receivingBranch: branches[(i + 2) % 5],
          status: i % 10 === 0 ? undefined : randomStatus,
          requestDate: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ).toISOString(),
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

    // Approve a single item
    const approveItem = (record: ChequeItem) => {
      confirmModalTitle.value = `Approve Item`;
      confirmModalMessage.value = `Are you sure you want to approve this item?`;
      confirmModalOkText.value = "Approve";
      confirmModalAction.value = "approve";
      confirmModalButtonClass.value = "approve-button";
      itemToAction.value = record;
      confirmModalVisible.value = true;
    };

    // Handle bulk approve
    const handleBulkApprove = () => {
      if (selectedRowKeys.value.length === 0) {
        message.warning("Please select at least one item");
        return;
      }
      
      confirmModalTitle.value = `Approve Selected Items`;
      confirmModalMessage.value = `Are you sure you want to approve ${selectedRowKeys.value.length} selected item(s)?`;
      confirmModalOkText.value = "Approve All";
      confirmModalAction.value = "bulkApprove";
      confirmModalButtonClass.value = "approve-button";
      confirmModalVisible.value = true;
    };

    // Edit item
    const editItem = (record: ChequeItem) => {
      editingItem.value = { ...record };
      editModalVisible.value = true;
    };

    // Delete item
    const deleteItem = (record: ChequeItem) => {
      confirmModalTitle.value = "Delete Item";
      confirmModalMessage.value = `Are you sure you want to delete this item (${record.accountNo})?`;
      confirmModalOkText.value = "Delete";
      confirmModalAction.value = "delete";
      confirmModalButtonClass.value = "";
      itemToAction.value = record;
      confirmModalVisible.value = true;
    };

    // Handle edit save
    const handleEditSave = () => {
      if (!editingItem.value) return;
      
      editLoading.value = true;
      
      // In a real application, this would be an API call
      setTimeout(() => {
        const index = allItems.value.findIndex(item => item.id === editingItem.value?.id);
        
        if (index !== -1) {
          allItems.value[index] = { ...editingItem.value };
          message.success("Item updated successfully");
        }
        
        editLoading.value = false;
        editModalVisible.value = false;
        editingItem.value = null;
      }, 500);
    };

    // Handle confirm action
    const handleConfirmAction = () => {
      if (confirmModalAction.value === "approve" && itemToAction.value) {
        const itemIndex = allItems.value.findIndex(
          (item) => item.id === itemToAction.value?.id
        );

        if (itemIndex !== -1) {
          // Update the item status
          allItems.value[itemIndex].status = "Approved";
          message.success(`Item approved successfully`);
        }
      } else if (confirmModalAction.value === "bulkApprove") {
        // Update all selected items
        allItems.value = allItems.value.map(item => {
          if (selectedRowKeys.value.includes(item.id)) {
            return { ...item, status: "Approved" };
          }
          return item;
        });

        message.success(`Successfully approved ${selectedRowKeys.value.length} item(s)`);
        selectedRowKeys.value = []; // Clear selection after bulk update
      } else if (confirmModalAction.value === "delete" && itemToAction.value) {
        // Delete the item
        allItems.value = allItems.value.filter(item => item.id !== itemToAction.value?.id);
        message.success("Item deleted successfully");
      }

      confirmModalVisible.value = false;
      itemToAction.value = null;
    };

    // Reset selection when filtered items change
    watch([severityFilter, branchFilter, searchText], () => {
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
      branchFilter,
      dateRange,
      pendingItemColumns,
      allItems,
      pendingItems,
      filteredPendingItems,
      selectedRowKeys,
      hasSelectedItems,
      highSeverityCount,
      uniqueBranchesCount,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalOkText,
      confirmModalButtonClass,
      editModalVisible,
      editingItem,
      editLoading,
      handleSearch,
      handleSeverityFilterChange,
      handleBranchFilterChange,
      handleDateRangeChange,
      onSelectChange,
      approveItem,
      handleBulkApprove,
      editItem,
      deleteItem,
      handleEditSave,
      handleConfirmAction,
      getSeverityColor,
      formatDate,
      refreshData,
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
  background-color: #fff7ed;
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

.pending-card {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #fdba74;
}

.severity-card {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #fca5a5;
}

.branch-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
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

.approve-button {
  background-color: #10b981;
  border-color: #10b981;
}

.approve-button:hover {
  background-color: #059669;
  border-color: #059669;
}

.edit-button, .delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.edit-button:hover:not(:disabled) {
  color: #1890ff;
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.delete-button:hover:not(:disabled) {
  background-color: #fff1f0;
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