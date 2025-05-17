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
                <ClockCircleOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Pending</span> Requisition Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all pending cheque requisitions in one centralized
              dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
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
        <!-- Pending Items Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <ClockCircleOutlined class="h-6 w-6 text-amber-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Pending Items
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ pendingItems.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- High Severity Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-error-light rounded-md p-3">
                <WarningOutlined class="h-6 w-6 text-error" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    High Severity
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ highSeverityCount }}
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
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <BranchesOutlined class="h-6 w-6 text-blue-500" />
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <a-tooltip title="Approve all selected items">
          <a-button
            v-if="hasSelectedItems"
            type="primary"
            @click="handleBulkApprove"
            class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
          >
            <template #icon><CheckOutlined /></template>
            Approve Selected ({{ selectedRowKeys.length }})
          </a-button>
        </a-tooltip>

        <span
          v-if="selectedRowKeys.length > 0"
          class="text-sm text-secondary ml-2"
        >
          {{ selectedRowKeys.length }} item(s) selected
        </span>
      </div>

      <!-- Pending Requisition Items Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
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
                color="warning"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                Pending
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex flex-wrap justify-center gap-1">
                <!-- Approve Button -->
                <a-tooltip title="Approve this requisition">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
                    @click="approveItem(record)"
                  >
                    <CheckOutlined />
                  </a-button>
                </a-tooltip>

                <!-- Edit and Delete buttons -->
                <div class="flex gap-1 ml-1">
                  <a-tooltip title="Edit requisition details">
                    <a-button
                      type="primary"
                      shape="circle"
                      class="flex items-center justify-center bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                      @click="editItem(record)"
                    >
                      <EditOutlined />
                    </a-button>
                  </a-tooltip>

                  <a-tooltip title="Delete this requisition">
                    <a-button
                      type="primary"
                      shape="circle"
                      danger
                      class="flex items-center justify-center"
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

        <!-- Empty State -->
        <div
          v-if="!loading && pendingItems.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">
            No pending requisitions found
          </p>
          <p class="text-secondary">All requisitions have been processed</p>
        </div>
      </div>
    </div>

    <!-- Edit Item Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="Edit Pending Requisition"
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
  BranchesOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
  WarningOutlined,
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
  requestDate: string;
}

// State variables
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
  return allItems.value.filter(
    (item) => !item.status || item.status === "Pending"
  );
});

// Count of high severity items
const highSeverityCount = computed(() => {
  return pendingItems.value.filter((item) => item.severity === "High").length;
});

// Count of unique branches
const uniqueBranchesCount = computed(() => {
  const branches = new Set(pendingItems.value.map((item) => item.branchName));
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
    width: 160,
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
    result = result.filter((item) =>
      item.branchName.includes(branchFilter.value)
    );
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

  return Array.from({ length: 50 }, (_, i) => {
    // For pending page, make more items have Pending status
    const randomStatus =
      Math.random() < 0.7
        ? "Pending"
        : statuses[Math.floor(Math.random() * statuses.length)];

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

// Approve a single item
const approveItem = (record: ChequeItem) => {
  confirmModalTitle.value = `Approve Item`;
  confirmModalMessage.value = `Are you sure you want to approve this item?`;
  confirmModalOkText.value = "Approve";
  confirmModalAction.value = "approve";
  confirmModalButtonClass.value =
    "bg-success border-success hover:bg-success-dark hover:border-success-dark";
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
  confirmModalButtonClass.value =
    "bg-success border-success hover:bg-success-dark hover:border-success-dark";
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
    const index = allItems.value.findIndex(
      (item) => item.id === editingItem.value?.id
    );

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
    allItems.value = allItems.value.map((item) => {
      if (selectedRowKeys.value.includes(item.id)) {
        return { ...item, status: "Approved" };
      }
      return item;
    });

    message.success(
      `Successfully approved ${selectedRowKeys.value.length} item(s)`
    );
    selectedRowKeys.value = []; // Clear selection after bulk update
  } else if (confirmModalAction.value === "delete" && itemToAction.value) {
    // Delete the item
    allItems.value = allItems.value.filter(
      (item) => item.id !== itemToAction.value?.id
    );
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

.ant-tag-warning {
  background-color: #fff7ed !important;
  border-color: #fdba74 !important;
  color: #c2410c !important;
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
