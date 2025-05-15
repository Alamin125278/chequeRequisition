<template>
  <div class="p-1 bg-gray-50 min-h-screen">
    <!-- <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100"> -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          <span class="text-emerald-600">Cheque</span> Requisition Management
        </h1>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
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
            v-model:value="statusFilter"
            placeholder="Filter by status"
            class="w-full md:w-48"
            @change="handleStatusFilterChange"
          >
            <a-select-option value="">All Statuses</a-select-option>
            <a-select-option value="Pending">Pending</a-select-option>
            <a-select-option value="Approved">Approved</a-select-option>
            <a-select-option value="Ordered">Ordered</a-select-option>
            <a-select-option value="Download">Download</a-select-option>
            <a-select-option value="Dispatch">Dispatch</a-select-option>
            <a-select-option value="Delivery Receive">Delivery Receive</a-select-option>
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
          v-if="hasSelectedItems && !hasMixedStatuses"
          type="primary"
          @click="handleBulkAction"
          :class="getBulkActionButtonClass()"
        >
          <template #icon>
            <component :is="getBulkActionIcon()" />
          </template>
          {{ getBulkActionText() }}
        </a-button>
        
        <a-alert
          v-if="hasSelectedItems && hasMixedStatuses"
          message="Cannot perform bulk actions on mixed statuses"
          type="warning"
          show-icon
          class="mb-2"
        />
        
        <span v-if="selectedRowKeys.length > 0" class="text-sm text-gray-500 ml-2">
          {{ selectedRowKeys.length }} item(s) selected
        </span>
      </div>

      <!-- Requisition Items Table (Main Table) -->
      <a-table
        :dataSource="filteredChequeItems"
        :columns="chequeItemColumns"
        :loading="loading"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Total ${total} items`,
        }"
        :rowSelection="rowSelection"
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
              :color="getStatusColor(record.status || 'Pending')"
              class="px-3 py-1 rounded-full"
            >
              {{ record.status || 'Pending' }}
            </a-tag>
          </template>

          <!-- Actions Column -->
          <template v-if="column.key === 'actions'">
            <div class="flex flex-wrap justify-center gap-2">
              <!-- Dynamic Action Button based on status -->
              <a-button 
                v-if="!record.status || record.status === 'Pending'"
                type="primary" 
                class="action-button approve-button"
                @click="updateItemStatus(record, 'Approved')"
              >
                <template #icon><CheckOutlined /></template>
                Approve
              </a-button>
              
              <a-button 
                v-else-if="record.status === 'Approved'"
                type="primary" 
                class="action-button order-button"
                @click="updateItemStatus(record, 'Ordered')"
              >
                <template #icon><ShoppingCartOutlined /></template>
                Order
              </a-button>
              
              <a-button 
                v-else-if="record.status === 'Ordered'"
                type="primary" 
                class="action-button download-button"
                @click="updateItemStatus(record, 'Download')"
              >
                <template #icon><DownloadOutlined /></template>
                Download
              </a-button>
              
              <a-button 
                v-else-if="record.status === 'Download'"
                type="primary" 
                class="action-button dispatch-button"
                @click="updateItemStatus(record, 'Dispatch')"
              >
                <template #icon><CarOutlined /></template>
                Dispatch
              </a-button>
              
              <a-button 
                v-else-if="record.status === 'Dispatch'"
                type="primary" 
                class="action-button delivery-button"
                @click="updateItemStatus(record, 'Delivery Receive')"
              >
                <template #icon><InboxOutlined /></template>
                Receive
              </a-button>
              
              <a-button 
                v-else
                type="default" 
                disabled
                class="action-button completed-button"
              >
                <template #icon><CheckCircleOutlined /></template>
                Completed
              </a-button>
              
              <!-- Edit and Delete buttons -->
              <div class="flex gap-1 ml-1">
                <a-button
                  type="default"
                  size="middle"
                  class="edit-button"
                  :disabled="isEditDeleteDisabled(record)"
                  @click="editItem(record)"
                >
                  <template #icon><EditOutlined /></template>
                </a-button>
                
                <a-button
                  type="default"
                  danger
                  size="middle"
                  class="delete-button"
                  :disabled="isEditDeleteDisabled(record)"
                  @click="deleteItem(record)"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </div>
            </div>
          </template>
        </template>
      </a-table>
    <!-- </div> -->

    <!-- Edit Item Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="Edit Item"
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
  CheckCircleOutlined,
  CarOutlined,
  DownloadOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined
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
}

export default defineComponent({
  name: "RequisitionList",
  components: {
    CheckOutlined,
    CheckCircleOutlined,
    CarOutlined,
    DownloadOutlined,
    InboxOutlined,
    EditOutlined,
    DeleteOutlined,
    ShoppingCartOutlined
  },
  setup() {
    const loading = ref(true);
    const searchText = ref("");
    const statusFilter = ref("");
    const severityFilter = ref("");
    const branchFilter = ref("");
    const dateRange = ref<[Dayjs, Dayjs] | null>(null);
    const chequeItems = ref<ChequeItem[]>([]);
    const selectedRowKeys = ref<number[]>([]);
    const confirmModalVisible = ref(false);
    const confirmModalTitle = ref("");
    const confirmModalMessage = ref("");
    const confirmModalOkText = ref("");
    const confirmModalAction = ref("");
    const confirmModalButtonClass = ref("");
    const itemToAction = ref<ChequeItem | null>(null);
    const bulkActionStatus = ref("");
    const editModalVisible = ref(false);
    const editingItem = ref<ChequeItem | null>(null);
    const editLoading = ref(false);

    // Computed property to check if any items are selected
    const hasSelectedItems = computed(() => selectedRowKeys.value.length > 0);

    // Computed property to check if selected items have mixed statuses
    const hasMixedStatuses = computed(() => {
      if (selectedRowKeys.value.length <= 1) return false;
      
      const selectedItems = chequeItems.value.filter(item => 
        selectedRowKeys.value.includes(item.id)
      );
      
      if (selectedItems.length === 0) return false;
      
      const firstStatus = selectedItems[0].status || 'Pending';
      return selectedItems.some(item => (item.status || 'Pending') !== firstStatus);
    });

    // Get the common status of selected items
    const selectedItemsStatus = computed(() => {
      if (selectedRowKeys.value.length === 0) return '';
      
      const selectedItems = chequeItems.value.filter(item => 
        selectedRowKeys.value.includes(item.id)
      );
      
      if (selectedItems.length === 0) return '';
      
      return selectedItems[0].status || 'Pending';
    });

    // Check if Edit/Delete should be disabled based on status
    const isEditDeleteDisabled = (record: ChequeItem) => {
      const status = record.status || 'Pending';
      // Disable if status is Download or later
      return ['Download', 'Dispatch', 'Delivery Receive'].includes(status);
    };

    // Get the next status based on current status
    const getNextStatus = (currentStatus: string) => {
      const statusFlow: Record<string, string> = {
        'Pending': 'Approved',
        'Approved': 'Ordered',
        'Ordered': 'Download',
        'Download': 'Dispatch',
        'Dispatch': 'Delivery Receive'
      };
      
      return statusFlow[currentStatus] || '';
    };

    // Custom row selection configuration
    const rowSelection = computed(() => ({
      selectedRowKeys: selectedRowKeys.value,
      onChange: onSelectChange,
      getCheckboxProps: (record: ChequeItem) => {
        // If there are selected items with a different status, disable this checkbox
        if (selectedRowKeys.value.length > 0 && !hasMixedStatuses.value) {
          const currentSelectedStatus = selectedItemsStatus.value;
          const recordStatus = record.status || 'Pending';
          
          return {
            disabled: recordStatus !== currentSelectedStatus
          };
        }
        
        return {};
      }
    }));

    // Cheque item columns for the main table
    const chequeItemColumns = [
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        filters: [
          { text: "Pending", value: "Pending" },
          { text: "Approved", value: "Approved" },
          { text: "Ordered", value: "Ordered" },
          { text: "Download", value: "Download" },
          { text: "Dispatch", value: "Dispatch" },
          { text: "Delivery Receive", value: "Delivery Receive" },
        ],
        onFilter: (value: string, record: ChequeItem) => 
          (record.status || "Pending") === value,
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 220,
        align: "center",
      },
    ];

    // Computed property for filtered cheque items
    const filteredChequeItems = computed(() => {
      let result = [...chequeItems.value];

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

      // Apply status filter
      if (statusFilter.value) {
        result = result.filter((item) => (item.status || "Pending") === statusFilter.value);
      }
      
      // Apply severity filter
      if (severityFilter.value) {
        result = result.filter((item) => item.severity === severityFilter.value);
      }
      
      // Apply branch filter
      if (branchFilter.value) {
        result = result.filter((item) => item.branchName.includes(branchFilter.value));
      }

      return result;
    });

    // Fetch cheque items data
    const fetchChequeItems = async () => {
      loading.value = true;
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          chequeItems.value = generateMockChequeItems();
          loading.value = false;
        }, 1000);
      } catch (error) {
        message.error("Failed to fetch requisition items");
        loading.value = false;
      }
    };

    // Generate mock data for demonstration
    const generateMockChequeItems = (): ChequeItem[] => {
      const statuses = ["Pending", "Approved", "Ordered", "Download", "Dispatch", "Delivery Receive"];
      const branches = ["Main Branch", "North Branch", "South Branch", "East Branch", "West Branch"];
      const severities = ["High", "Medium", "Low"];

      return Array.from({ length: 50 }, (_, i) => ({
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
        status: i % 10 === 0 ? undefined : statuses[i % 6],
      }));
    };

    // Get color for status tag
    const getStatusColor = (status: string) => {
      const colorMap: Record<string, string> = {
        Pending: "orange",
        Approved: "green",
        Ordered: "geekblue",
        Download: "blue",
        Dispatch: "purple",
        "Delivery Receive": "cyan",
      };

      return colorMap[status] || "default";
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

    // Handle status filter change
    const handleStatusFilterChange = (value: string) => {
      statusFilter.value = value;
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
      // If we're adding a new selection
      if (keys.length > selectedRowKeys.value.length) {
        const newKey = keys.find(key => !selectedRowKeys.value.includes(key));
        
        if (newKey !== undefined) {
          const newItem = chequeItems.value.find(item => item.id === newKey);
          const newStatus = newItem?.status || 'Pending';
          
          // If we already have selections and they have a different status
          if (selectedRowKeys.value.length > 0) {
            const existingStatus = selectedItemsStatus.value;
            
            if (existingStatus !== newStatus) {
              // Don't allow selection of items with different status
              message.warning('You can only select items with the same status');
              return;
            }
          }
        }
      }
      
      selectedRowKeys.value = keys;
    };

    // Get bulk action text based on selected items status
    const getBulkActionText = () => {
      const status = selectedItemsStatus.value;
      
      switch(status) {
        case 'Pending': return 'Approve All';
        case 'Approved': return 'Order All';
        case 'Ordered': return 'Download All';
        case 'Download': return 'Dispatch All';
        case 'Dispatch': return 'Receive All';
        default: return 'Update All';
      }
    };
    
    // Get bulk action icon based on selected items status
    const getBulkActionIcon = () => {
      const status = selectedItemsStatus.value;
      
      switch(status) {
        case 'Pending': return CheckOutlined;
        case 'Approved': return ShoppingCartOutlined;
        case 'Ordered': return DownloadOutlined;
        case 'Download': return CarOutlined;
        case 'Dispatch': return InboxOutlined;
        default: return CheckCircleOutlined;
      }
    };
    
    // Get bulk action button class based on selected items status
    const getBulkActionButtonClass = () => {
      const status = selectedItemsStatus.value;
      
      switch(status) {
        case 'Pending': return 'action-button approve-button';
        case 'Approved': return 'action-button order-button';
        case 'Ordered': return 'action-button download-button';
        case 'Download': return 'action-button dispatch-button';
        case 'Dispatch': return 'action-button delivery-button';
        default: return 'action-button';
      }
    };

    // Handle bulk action
    const handleBulkAction = () => {
      if (selectedRowKeys.value.length === 0) {
        message.warning("Please select at least one item");
        return;
      }
      
      if (hasMixedStatuses.value) {
        message.warning("Cannot perform bulk actions on mixed statuses");
        return;
      }
      
      const currentStatus = selectedItemsStatus.value;
      const nextStatus = getNextStatus(currentStatus);
      
      if (!nextStatus) {
        message.warning("No further action available for these items");
        return;
      }
      
      confirmModalTitle.value = `${getBulkActionText()}`;
      confirmModalMessage.value = `Are you sure you want to update ${selectedRowKeys.value.length} item(s) to ${nextStatus}?`;
      confirmModalOkText.value = getBulkActionText();
      confirmModalAction.value = "bulkUpdate";
      confirmModalButtonClass.value = getBulkActionButtonClass();
      bulkActionStatus.value = nextStatus;
      confirmModalVisible.value = true;
    };

    // Update individual item status
    const updateItemStatus = (record: ChequeItem, newStatus: string) => {
      confirmModalTitle.value = `Update Item Status`;
      confirmModalMessage.value = `Are you sure you want to update this item to ${newStatus}?`;
      confirmModalOkText.value = "Update";
      confirmModalAction.value = "updateStatus";
      
      // Set button class based on the action
      switch(record.status || 'Pending') {
        case 'Pending': 
          confirmModalButtonClass.value = 'approve-button';
          break;
        case 'Approved': 
          confirmModalButtonClass.value = 'order-button';
          break;
        case 'Ordered': 
          confirmModalButtonClass.value = 'download-button';
          break;
        case 'Download': 
          confirmModalButtonClass.value = 'dispatch-button';
          break;
        case 'Dispatch': 
          confirmModalButtonClass.value = 'delivery-button';
          break;
        default:
          confirmModalButtonClass.value = '';
      }
      
      itemToAction.value = { ...record, status: newStatus };
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
        const index = chequeItems.value.findIndex(item => item.id === editingItem.value?.id);
        
        if (index !== -1) {
          chequeItems.value[index] = { ...editingItem.value };
          message.success("Item updated successfully");
        }
        
        editLoading.value = false;
        editModalVisible.value = false;
        editingItem.value = null;
      }, 500);
    };

    // Handle confirm action
    const handleConfirmAction = () => {
      if (confirmModalAction.value === "updateStatus" && itemToAction.value) {
        const itemIndex = chequeItems.value.findIndex(
          (item) => item.id === itemToAction.value?.id
        );

        if (itemIndex !== -1) {
          // Update the item status
          chequeItems.value[itemIndex].status = itemToAction.value.status;
          message.success(`Item status updated to ${itemToAction.value.status}`);
        }
      } else if (confirmModalAction.value === "bulkUpdate") {
        // Update all selected items
        chequeItems.value = chequeItems.value.map(item => {
          if (selectedRowKeys.value.includes(item.id)) {
            return { ...item, status: bulkActionStatus.value };
          }
          return item;
        });

        message.success(`Successfully updated ${selectedRowKeys.value.length} item(s) to ${bulkActionStatus.value}`);
        selectedRowKeys.value = []; // Clear selection after bulk update
      } else if (confirmModalAction.value === "delete" && itemToAction.value) {
        // Delete the item
        chequeItems.value = chequeItems.value.filter(item => item.id !== itemToAction.value?.id);
        message.success("Item deleted successfully");
      }

      confirmModalVisible.value = false;
      itemToAction.value = null;
    };

    // Reset selection when filtered items change
    watch([statusFilter, severityFilter, branchFilter, searchText], () => {
      selectedRowKeys.value = [];
    });

    // Fetch data on component mount
    onMounted(() => {
      fetchChequeItems();
    });

    return {
      loading,
      searchText,
      statusFilter,
      severityFilter,
      branchFilter,
      dateRange,
      chequeItemColumns,
      chequeItems,
      filteredChequeItems,
      selectedRowKeys,
      rowSelection,
      hasSelectedItems,
      hasMixedStatuses,
      selectedItemsStatus,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalOkText,
      confirmModalButtonClass,
      editModalVisible,
      editingItem,
      editLoading,
      handleSearch,
      handleStatusFilterChange,
      handleSeverityFilterChange,
      handleBranchFilterChange,
      handleDateRangeChange,
      onSelectChange,
      getBulkActionText,
      getBulkActionIcon,
      getBulkActionButtonClass,
      handleBulkAction,
      updateItemStatus,
      editItem,
      deleteItem,
      handleEditSave,
      handleConfirmAction,
      getStatusColor,
      getSeverityColor,
      isEditDeleteDisabled,
    };
  },
});
</script>

<style scoped>
/* Enhanced custom styles */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0fdf4;
}

.custom-table :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: #ecfdf5;
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

.order-button {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.order-button:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.download-button {
  background-color: #6366f1;
  border-color: #6366f1;
}

.download-button:hover {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.dispatch-button {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.dispatch-button:hover {
  background-color: #d97706;
  border-color: #d97706;
}

.delivery-button {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.delivery-button:hover {
  background-color: #7c3aed;
  border-color: #7c3aed;
}

.completed-button {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  color: #6b7280;
}

.edit-button, .delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  transition: all 0.2s ease;
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