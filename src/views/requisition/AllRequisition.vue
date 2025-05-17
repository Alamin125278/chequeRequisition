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
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Cheque</span> Requisition Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all cheque requisitions in one centralized
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="max-w-7xl mx-auto py-6">
      <div class="bg-card shadow-md rounded-md p-4 mb-6">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
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
            v-model:value="statusFilter"
            placeholder="Filter by status"
            class="w-full"
            @change="handleStatusFilterChange"
            allowClear
          >
            <a-select-option value="">All Statuses</a-select-option>
            <a-select-option value="Pending">Pending</a-select-option>
            <a-select-option value="Approved">Approved</a-select-option>
            <a-select-option value="Ordered">Ordered</a-select-option>
            <a-select-option value="Download">Download</a-select-option>
            <a-select-option value="Dispatch">Dispatch</a-select-option>
            <a-select-option value="Delivery Receive"
              >Delivery Receive</a-select-option
            >
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

          <a-select
            v-model:value="branchFilter"
            placeholder="Filter by Branch"
            class="w-full"
            @change="handleBranchFilterChange"
            allowClear
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
            class="w-full"
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

        <span
          v-if="selectedRowKeys.length > 0"
          class="text-sm text-secondary ml-2"
        >
          {{ selectedRowKeys.length }} item(s) selected
        </span>
      </div>

      <!-- Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
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
                :color="getStatusColor(record.status || 'Pending')"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.status || "Pending" }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex flex-wrap justify-center gap-2">
                <!-- Dynamic Action Buttons as Icons with Tooltips -->
                <a-tooltip
                  title="Approve"
                  v-if="!record.status || record.status === 'Pending'"
                >
                  <a-button
                    type="primary"
                    shape="circle"
                    class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
                    @click="updateItemStatus(record, 'Approved')"
                  >
                    <CheckOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip
                  title="Order"
                  v-else-if="record.status === 'Approved'"
                >
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-blue"
                    @click="updateItemStatus(record, 'Ordered')"
                  >
                    <ShoppingCartOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip
                  title="Download"
                  v-else-if="record.status === 'Ordered'"
                >
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-download"
                    @click="updateItemStatus(record, 'Download')"
                  >
                    <DownloadOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip
                  title="Dispatch"
                  v-else-if="record.status === 'Download'"
                >
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-dispatch"
                    @click="updateItemStatus(record, 'Dispatch')"
                  >
                    <CarOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip
                  title="Receive"
                  v-else-if="record.status === 'Dispatch'"
                >
                  <a-button
                    type="primary"
                    shape="circle"
                    class="bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600"
                    @click="updateItemStatus(record, 'Delivery Receive')"
                  >
                    <InboxOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Completed" v-else>
                  <a-button
                    type="default"
                    shape="circle"
                    disabled
                    class="flex items-center justify-center"
                  >
                    <CheckCircleOutlined />
                  </a-button>
                </a-tooltip>

                <!-- Edit and Delete buttons -->
                <div class="flex gap-1 ml-1">
                  <a-tooltip title="Edit">
                    <a-button
                      type="primary"
                      shape="circle"
                      class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                      :disabled="isEditDeleteDisabled(record)"
                      @click="editItem(record)"
                    >
                      <EditOutlined />
                    </a-button>
                  </a-tooltip>

                  <a-tooltip title="Delete">
                    <a-button
                      type="primary"
                      shape="circle"
                      danger
                      :disabled="isEditDeleteDisabled(record)"
                      @click="deleteItem(record)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Edit Item Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="Edit Cheque Requisition"
      :width="720"
      :footer="null"
      class="requisition-modal"
    >
      <div class="p-4">
        <a-form v-if="editingItem" :model="editingItem" layout="vertical">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Account Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a-form-item label="Account Number" name="accountNo">
                <a-input
                  v-model:value="editingItem.accountNo"
                  placeholder="Enter account number"
                  class="rounded-md"
                />
              </a-form-item>

              <a-form-item label="Account Name" name="accountName">
                <a-input
                  v-model:value="editingItem.accountName"
                  placeholder="Enter account name"
                  class="rounded-md"
                />
              </a-form-item>
            </div>
          </div>

          <div class="mb-6 pb-4 border-b border-gray-100">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Cheque Details
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a-form-item label="Start Number" name="startNo">
                <a-input-number
                  v-model:value="editingItem.startNo"
                  placeholder="Enter start number"
                  class="w-full rounded-md"
                />
              </a-form-item>

              <a-form-item label="End Number" name="endNo">
                <a-input-number
                  v-model:value="editingItem.endNo"
                  placeholder="Enter end number"
                  class="w-full rounded-md"
                />
              </a-form-item>

              <a-form-item label="Book Quantity" name="bookQuantity">
                <a-input-number
                  v-model:value="editingItem.bookQuantity"
                  placeholder="Enter book quantity"
                  class="w-full rounded-md"
                />
              </a-form-item>
            </div>
          </div>

          <div class="mb-6">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Additional Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a-form-item label="Severity" name="severity">
                <a-select
                  v-model:value="editingItem.severity"
                  placeholder="Select severity"
                  class="rounded-md w-full"
                >
                  <a-select-option value="High">High</a-select-option>
                  <a-select-option value="Medium">Medium</a-select-option>
                  <a-select-option value="Low">Low</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="Branch" name="branchName">
                <a-select
                  v-model:value="editingItem.branchName"
                  placeholder="Select branch"
                  class="rounded-md w-full"
                >
                  <a-select-option value="Main Branch"
                    >Main Branch</a-select-option
                  >
                  <a-select-option value="North Branch"
                    >North Branch</a-select-option
                  >
                  <a-select-option value="South Branch"
                    >South Branch</a-select-option
                  >
                  <a-select-option value="East Branch"
                    >East Branch</a-select-option
                  >
                  <a-select-option value="West Branch"
                    >West Branch</a-select-option
                  >
                </a-select>
              </a-form-item>
            </div>
          </div>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="editModalVisible = false"> Cancel </a-button>
            <a-button
              type="primary"
              @click="handleEditSave"
              :loading="editLoading"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              Save Changes
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>

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
            :class="
              confirmModalAction === 'delete'
                ? 'bg-error border-error hover:bg-error-dark hover:border-error-dark'
                : confirmModalButtonClass
            "
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
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  InboxOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
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

// State variables
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

  const selectedItems = chequeItems.value.filter((item) =>
    selectedRowKeys.value.includes(item.id)
  );

  if (selectedItems.length === 0) return false;

  const firstStatus = selectedItems[0].status || "Pending";
  return selectedItems.some(
    (item) => (item.status || "Pending") !== firstStatus
  );
});

// Get the common status of selected items
const selectedItemsStatus = computed(() => {
  if (selectedRowKeys.value.length === 0) return "";

  const selectedItems = chequeItems.value.filter((item) =>
    selectedRowKeys.value.includes(item.id)
  );

  if (selectedItems.length === 0) return "";

  return selectedItems[0].status || "Pending";
});

// Check if Edit/Delete should be disabled based on status
const isEditDeleteDisabled = (record: ChequeItem) => {
  const status = record.status || "Pending";
  // Disable if status is Download or later
  return ["Download", "Dispatch", "Delivery Receive"].includes(status);
};

// Get the next status based on current status
const getNextStatus = (currentStatus: string) => {
  const statusFlow: Record<string, string> = {
    Pending: "Approved",
    Approved: "Ordered",
    Ordered: "Download",
    Download: "Dispatch",
    Dispatch: "Delivery Receive",
  };

  return statusFlow[currentStatus] || "";
};

// Custom row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
  getCheckboxProps: (record: ChequeItem) => {
    // If there are selected items with a different status, disable this checkbox
    if (selectedRowKeys.value.length > 0 && !hasMixedStatuses.value) {
      const currentSelectedStatus = selectedItemsStatus.value;
      const recordStatus = record.status || "Pending";

      return {
        disabled: recordStatus !== currentSelectedStatus,
      };
    }

    return {};
  },
}));

// Cheque item columns for the main table
const chequeItemColumns = [
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
    filters: [
      { text: "Main Branch", value: "Main Branch" },
      { text: "North Branch", value: "North Branch" },
      { text: "South Branch", value: "South Branch" },
      { text: "East Branch", value: "East Branch" },
      { text: "West Branch", value: "West Branch" },
    ],
    onFilter: (value: string, record: ChequeItem) =>
      record.branchName === value,
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
    result = result.filter(
      (item) => (item.status || "Pending") === statusFilter.value
    );
  }

  // Apply severity filter
  if (severityFilter.value) {
    result = result.filter((item) => item.severity === severityFilter.value);
  }

  // Apply branch filter
  if (branchFilter.value) {
    result = result.filter((item) =>
      item.branchName.includes(branchFilter.value)
    );
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
  const statuses = [
    "Pending",
    "Approved",
    "Ordered",
    "Download",
    "Dispatch",
    "Delivery Receive",
  ];
  const branches = [
    "Main Branch",
    "North Branch",
    "South Branch",
    "East Branch",
    "West Branch",
  ];
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
    Approved: "success",
    Ordered: "blue",
    Download: "geekblue",
    Dispatch: "purple",
    "Delivery Receive": "cyan",
  };

  return colorMap[status] || "default";
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
    const newKey = keys.find((key) => !selectedRowKeys.value.includes(key));

    if (newKey !== undefined) {
      const newItem = chequeItems.value.find((item) => item.id === newKey);
      const newStatus = newItem?.status || "Pending";

      // If we already have selections and they have a different status
      if (selectedRowKeys.value.length > 0) {
        const existingStatus = selectedItemsStatus.value;

        if (existingStatus !== newStatus) {
          // Don't allow selection of items with different status
          message.warning("You can only select items with the same status");
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

  switch (status) {
    case "Pending":
      return "Approve All";
    case "Approved":
      return "Order All";
    case "Ordered":
      return "Download All";
    case "Download":
      return "Dispatch All";
    case "Dispatch":
      return "Receive All";
    default:
      return "Update All";
  }
};

// Get bulk action icon based on selected items status
const getBulkActionIcon = () => {
  const status = selectedItemsStatus.value;

  switch (status) {
    case "Pending":
      return CheckOutlined;
    case "Approved":
      return ShoppingCartOutlined;
    case "Ordered":
      return DownloadOutlined;
    case "Download":
      return CarOutlined;
    case "Dispatch":
      return InboxOutlined;
    default:
      return CheckCircleOutlined;
  }
};

// Get bulk action button class based on selected items status
const getBulkActionButtonClass = () => {
  const status = selectedItemsStatus.value;

  switch (status) {
    case "Pending":
      return "bg-success border-success hover:bg-success-dark hover:border-success-dark";
    case "Approved":
      return "bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600";
    case "Ordered":
      return "bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600";
    case "Download":
      return "bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600";
    case "Dispatch":
      return "bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600";
    default:
      return "bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark";
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
  switch (record.status || "Pending") {
    case "Pending":
      confirmModalButtonClass.value =
        "bg-success border-success hover:bg-success-dark hover:border-success-dark";
      break;
    case "Approved":
      confirmModalButtonClass.value =
        "bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600";
      break;
    case "Ordered":
      confirmModalButtonClass.value =
        "bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600";
      break;
    case "Download":
      confirmModalButtonClass.value =
        "bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600";
      break;
    case "Dispatch":
      confirmModalButtonClass.value =
        "bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600";
      break;
    default:
      confirmModalButtonClass.value =
        "bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark";
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
    const index = chequeItems.value.findIndex(
      (item) => item.id === editingItem.value?.id
    );

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
    chequeItems.value = chequeItems.value.map((item) => {
      if (selectedRowKeys.value.includes(item.id)) {
        return { ...item, status: bulkActionStatus.value };
      }
      return item;
    });

    message.success(
      `Successfully updated ${selectedRowKeys.value.length} item(s) to ${bulkActionStatus.value}`
    );
    selectedRowKeys.value = []; // Clear selection after bulk update
  } else if (confirmModalAction.value === "delete" && itemToAction.value) {
    // Delete the item
    chequeItems.value = chequeItems.value.filter(
      (item) => item.id !== itemToAction.value?.id
    );
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
  background-color: rgba(107, 142, 35, 0.05);
}

/* Custom modal styles */
.requisition-modal :deep(.ant-modal-content),
.confirm-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.requisition-modal :deep(.ant-modal-header),
.confirm-modal :deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.requisition-modal :deep(.ant-modal-title),
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
.ant-input-number {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover,
.ant-input-number:hover {
  border-color: var(--accent-cta) !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 139, 34, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
}

.ant-tag-error {
  background-color: var(--error-light) !important;
  border-color: var(--error) !important;
  color: var(--error) !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  background-color: var(--accent-cta) !important;
  border-color: var(--accent-cta) !important;
  border-radius: var(--radius-md) !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #5a7a1f !important;
  border-color: #5a7a1f !important;
}

/* Exception for Approve buttons */
.ant-btn-primary.btn-blue {
  background-color: var(--blue) !important;
  border-color: var(--blue) !important;
}

.ant-btn-primary.btn-blue:hover,
.ant-btn-primary.btn-blue:focus {
  background-color: var(--blue-dark) !important;
  border-color: var(--blue-dark) !important;
}
/* Exception for Download button */
.ant-btn-primary.btn-download {
  background-color: var(--teal) !important;
  border-color: var(--teal) !important;
}

.ant-btn-primary.btn-download:hover,
.ant-btn-primary.btn-download:focus {
  background-color: var(--teal-dark) !important;
  border-color: var(--teal-dark) !important;
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
/* Exception for danger buttons */
.ant-btn-dangerous.ant-btn-primary {
  background-color: var(--error) !important;
  border-color: var(--error) !important;
}

.ant-btn-dangerous.ant-btn-primary:hover,
.ant-btn-dangerous.ant-btn-primary:focus {
  background-color: var(--error-dark) !important;
  border-color: var(--error-dark) !important;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: var(--shadow-sm) !important;
}

.shadow-md {
  box-shadow: var(--shadow-md) !important;
}

.shadow-lg {
  box-shadow: var(--shadow-lg) !important;
}

/* Rounded utilities */
.rounded-sm {
  border-radius: var(--radius-sm) !important;
}

.rounded-md {
  border-radius: var(--radius-md) !important;
}

.rounded-lg {
  border-radius: var(--radius-lg) !important;
}

/* Center icons in buttons */
.ant-btn-circle {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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
