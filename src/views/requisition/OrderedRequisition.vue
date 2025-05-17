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
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-blue-500">Ordered</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Manage and export your ordered cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Export Preview">
              <a-button
                type="primary"
                class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                @click="showExportPreview"
                :disabled="!hasAppliedFilters"
              >
                <template #icon><ExportOutlined /></template>
                Export Preview
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="max-w-7xl mx-auto py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <!-- Total Orders Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FileTextOutlined class="h-6 w-6 text-blue-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Total Orders
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ orders.length }}
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

        <!-- Filtered Orders Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FilterOutlined class="h-6 w-6 text-green-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Filtered Orders
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ filteredOrders.length }}
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
          Filter Orders
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Bank</label
            >
            <a-select
              v-model:value="filters.bank"
              placeholder="Select Bank"
              class="w-full"
              @change="handleFilterChange"
              allowClear
            >
              <a-select-option
                v-for="option in bankOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Bank Branch</label
            >
            <a-select
              v-model:value="filters.branch"
              placeholder="Select Branch"
              class="w-full"
              @change="handleFilterChange"
              allowClear
            >
              <a-select-option
                v-for="option in branchOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Severity</label
            >
            <a-select
              v-model:value="filters.severity"
              placeholder="Select Severity"
              class="w-full"
              @change="handleFilterChange"
              allowClear
            >
              <a-select-option
                v-for="option in severityOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Request Date</label
            >
            <a-range-picker
              v-model:value="filters.dateRange"
              class="w-full"
              @change="handleFilterChange"
              :placeholder="['Start Date', 'End Date']"
            />
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Orders</h3>
          <span class="text-sm text-secondary"
            >{{ filteredOrders.length }} orders found</span
          >
        </div>
        <a-table
          :columns="columns"
          :data-source="filteredOrders"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} items`,
          }"
          :loading="loading"
          row-key="id"
          class="custom-table"
          :scroll="{ x: 1500 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag
                :color="getStatusColor(record.status)"
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{ record.status }}
              </a-tag>
            </template>
            <template v-if="column.key === 'severity'">
              <a-tag
                :color="getSeverityColor(record.severity)"
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{ record.severity }}
              </a-tag>
            </template>
          </template>
        </a-table>

        <!-- Empty State -->
        <div
          v-if="!loading && filteredOrders.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">No orders found</p>
          <p class="text-secondary">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    </div>

    <!-- Export Preview Modal -->
    <a-modal
      v-model:visible="exportModalVisible"
      title="Export Preview"
      :width="720"
      :footer="null"
      class="requisition-modal"
    >
      <div class="p-4">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2 text-primary">Filtered Orders</h3>
          <p class="text-secondary">{{ filteredOrders.length }} orders found</p>
        </div>

        <!-- Check Type Buttons -->
        <div class="mb-6 pb-4 border-b border-gray-100">
          <h3
            class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
          >
            Export by Cheque Type
          </h3>
          <div class="flex flex-wrap gap-3">
            <a-button
              v-for="checkTypeVariation in checkTypeVariations"
              :key="`${checkTypeVariation.type}-${checkTypeVariation.pages}`"
              @click="
                exportByCheckTypeAndPages(
                  checkTypeVariation.type,
                  checkTypeVariation.pages
                )
              "
              class="flex items-center justify-center"
              size="middle"
            >
              <span
                >{{ checkTypeVariation.type }} ({{
                  checkTypeVariation.pages
                }})</span
              >
              <a-badge :count="checkTypeVariation.count" class="ml-2" />
            </a-button>
          </div>
        </div>

        <!-- Preview Table -->
        <div class="bg-background p-4 rounded-md mb-6">
          <h3
            class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
          >
            Preview
          </h3>
          <a-table
            :columns="previewColumns"
            :data-source="filteredOrders"
            :pagination="{ pageSize: 5 }"
            row-key="id"
            class="custom-table"
            size="small"
          />
        </div>

        <!-- Export Actions -->
        <div
          class="flex flex-wrap gap-3 justify-between mt-6 pt-4 border-t border-gray-100"
        >
          <div>
            <a-button
              type="primary"
              @click="exportPSI"
              class="mr-2 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
              <template #icon><FileExcelOutlined /></template>
              Export PSI
            </a-button>
            <a-button
              type="primary"
              @click="showChallanPreview"
              class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
              <template #icon><FileDoneOutlined /></template>
              Export Challan
            </a-button>
          </div>
          <a-button
            type="primary"
            @click="submitExport"
            class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
          >
            <template #icon><CheckOutlined /></template>
            Submit
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Challan Preview Modal -->
    <a-modal
      v-model:visible="challanPreviewVisible"
      title="Challan Preview"
      :width="720"
      :footer="null"
      class="requisition-modal"
    >
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2 text-primary">
            Challan Preview by Receiving Branch
          </h3>
          <p class="text-secondary">
            {{ Object.keys(challanData).length }} receiving branches found
          </p>
        </div>

        <div v-for="(orders, branch) in challanData" :key="branch" class="mb-8">
          <div class="bg-background p-4 rounded-md mb-3">
            <h4 class="text-base font-medium mb-2 text-primary">
              {{ branch }}
            </h4>
            <p class="text-secondary">{{ orders.length }} orders</p>
          </div>

          <a-table
            :columns="challanColumns"
            :data-source="orders"
            :pagination="false"
            row-key="id"
            class="custom-table mb-4"
            size="small"
          />
        </div>

        <div
          class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
        >
          <a-button @click="challanPreviewVisible = false"> Cancel </a-button>
          <a-button
            type="primary"
            @click="confirmExportChallan"
            class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          >
            <template #icon><DownloadOutlined /></template>
            Confirm Export
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  CheckOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilterOutlined,
  InboxOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";

// Mock data for demonstration
const bankOptions = [
  { value: "bank1", label: "Bank of America" },
  { value: "bank2", label: "Chase Bank" },
  { value: "bank3", label: "Wells Fargo" },
  { value: "bank4", label: "Citibank" },
];

const branchOptions = [
  { value: "branch1", label: "Downtown Branch" },
  { value: "branch2", label: "Uptown Branch" },
  { value: "branch3", label: "West Side Branch" },
  { value: "branch4", label: "East Side Branch" },
];

const severityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// Table columns
const columns = [
  {
    title: "SL.",
    dataIndex: "id",
    key: "id",
    width: 70,
    sorter: (a: any, b: any) => a.id - b.id,
    fixed: "left",
  },
  {
    title: "Bank Name",
    dataIndex: "bank",
    key: "bank",
    sorter: (a: any, b: any) => a.bank.localeCompare(b.bank),
    fixed: "left",
  },
  {
    title: "Branch Name",
    dataIndex: "branch",
    key: "branch",
    sorter: (a: any, b: any) => a.branch.localeCompare(b.branch),
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
  },
  {
    title: "Account Holder",
    dataIndex: "accountHolder",
    key: "accountHolder",
    sorter: (a: any, b: any) => a.accountHolder.localeCompare(b.accountHolder),
  },
  {
    title: "Severity",
    dataIndex: "severity",
    key: "severity",
  },
  {
    title: "Cheque Type",
    dataIndex: "checkType",
    key: "checkType",
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
    sorter: (a: any, b: any) => a.leaves - b.leaves,
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
    sorter: (a: any, b: any) => a.bookQty - b.bookQty,
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNumber",
    key: "routingNumber",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    fixed: "right",
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
    sorter: (a: any, b: any) =>
      new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
  },
];

// Preview columns (simplified for modal)
const previewColumns = [
  {
    title: "SL.",
    dataIndex: "id",
    key: "id",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bank",
    key: "bank",
  },
  {
    title: "Branch Name",
    dataIndex: "branch",
    key: "branch",
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
  },
  {
    title: "Account Holder",
    dataIndex: "accountHolder",
    key: "accountHolder",
  },
  {
    title: "Cheque Type",
    dataIndex: "checkType",
    key: "checkType",
  },
  {
    title: "Pages",
    dataIndex: "pages",
    key: "pages",
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranch",
    key: "receivingBranch",
  },
];

// Challan columns
const challanColumns = [
  {
    title: "SL.",
    dataIndex: "id",
    key: "id",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bank",
    key: "bank",
  },
  {
    title: "Branch Name",
    dataIndex: "branch",
    key: "branch",
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
  },
  {
    title: "Account Holder",
    dataIndex: "accountHolder",
    key: "accountHolder",
  },
  {
    title: "Cheque Type",
    dataIndex: "checkType",
    key: "checkType",
  },
  {
    title: "Pages",
    dataIndex: "pages",
    key: "pages",
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
  },
];

// State
const orders = ref<any[]>([]);
const loading = ref(true);
const exportModalVisible = ref(false);
const challanPreviewVisible = ref(false);
const challanData = ref<Record<string, any[]>>({});
const filters = ref({
  bank: undefined as string | undefined,
  branch: undefined as string | undefined,
  severity: undefined as string | undefined,
  dateRange: [] as any[],
});

// Computed properties
const hasAppliedFilters = computed(() => {
  return (
    filters.value.bank ||
    filters.value.branch ||
    filters.value.severity ||
    (filters.value.dateRange && filters.value.dateRange.length === 2)
  );
});

const filteredOrders = computed(() => {
  let result = [...orders.value];

  if (filters.value.bank) {
    result = result.filter(
      (order) => order.bank === getBankLabel(filters.value.bank)
    );
  }

  if (filters.value.branch) {
    result = result.filter(
      (order) => order.branch === getBranchLabel(filters.value.branch)
    );
  }

  if (filters.value.severity) {
    result = result.filter(
      (order) => order.severity === filters.value.severity
    );
  }

  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const startDate = filters.value.dateRange[0].valueOf();
    const endDate = filters.value.dateRange[1].valueOf();

    result = result.filter((order) => {
      const orderDate = new Date(order.requestDate).valueOf();
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  return result;
});

// Count of high severity items
const highSeverityCount = computed(() => {
  return orders.value.filter((item) => item.severity === "high").length;
});

// Generate check type variations with page counts
const checkTypeVariations = computed(() => {
  const variations: { type: string; pages: number; count: number }[] = [];

  // Group orders by check type and page count
  filteredOrders.value.forEach((order) => {
    const existingVariation = variations.find(
      (v) => v.type === order.checkType && v.pages === order.pages
    );

    if (existingVariation) {
      existingVariation.count++;
    } else {
      variations.push({
        type: order.checkType,
        pages: order.pages,
        count: 1,
      });
    }
  });

  // Sort by type and then by pages
  return variations.sort((a, b) => {
    if (a.type === b.type) {
      return a.pages - b.pages;
    }
    return a.type.localeCompare(b.type);
  });
});

// Helper functions
const getBankLabel = (value?: string) => {
  if (!value) return "";
  const bank = bankOptions.find((b) => b.value === value);
  return bank ? bank.label : value;
};

const getBranchLabel = (value?: string) => {
  if (!value) return "";
  const branch = branchOptions.find((b) => b.value === value);
  return branch ? branch.label : value;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "warning",
    Processing: "processing",
    Completed: "success",
    Downloaded: "purple",
    Failed: "error",
  };
  return colors[status] || "default";
};

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    high: "error",
    medium: "warning",
    low: "success",
  };
  return colors[severity] || "default";
};

// Event handlers
const handleFilterChange = () => {
  // This function is called whenever any filter changes
  console.log("Filters changed:", filters.value);
};

const showExportPreview = () => {
  if (filteredOrders.value.length === 0) {
    message.warning("No orders match the selected filters");
    return;
  }

  exportModalVisible.value = true;
};

const exportByCheckTypeAndPages = (checkType: string, pages: number) => {
  const matchingOrders = filteredOrders.value.filter(
    (order) => order.checkType === checkType && order.pages === pages
  );

  console.log(
    `Exporting ${matchingOrders.length} orders of type ${checkType} with ${pages} pages`
  );

  // In a real application, this would trigger an API call to generate and download an Excel file
  message.success(
    `Exported ${matchingOrders.length} orders of type ${checkType} (${pages} pages)`
  );
};

const exportPSI = () => {
  // In a real application, this would trigger an API call to generate and download an Excel file
  message.success(
    `Exported all ${filteredOrders.value.length} orders as PSI file`
  );
};

const showChallanPreview = () => {
  // Group by receiving branch
  const branches: Record<string, any[]> = {};
  filteredOrders.value.forEach((order) => {
    if (!branches[order.receivingBranch]) {
      branches[order.receivingBranch] = [];
    }
    branches[order.receivingBranch].push(order);
  });

  challanData.value = branches;
  challanPreviewVisible.value = true;
};

const confirmExportChallan = () => {
  const branchCount = Object.keys(challanData.value).length;

  // In a real application, this would trigger an API call to generate and download an Excel file
  message.success(
    `Generated and exported challans for ${branchCount} receiving branches`
  );

  challanPreviewVisible.value = false;
};

const submitExport = () => {
  // Update status of all exported orders to "Downloaded"
  const updatedOrders = orders.value.map((order) => {
    if (filteredOrders.value.some((fo) => fo.id === order.id)) {
      return { ...order, status: "Downloaded" };
    }
    return order;
  });

  orders.value = updatedOrders;
  message.success(
    `Updated status of ${filteredOrders.value.length} orders to "Downloaded"`
  );
  exportModalVisible.value = false;
};

// Lifecycle hooks
onMounted(() => {
  // Simulate API call to fetch orders
  setTimeout(() => {
    orders.value = [
      {
        id: 1001,
        bank: "Bank of America",
        branch: "Downtown Branch",
        accountNo: "1234567890",
        accountHolder: "John Smith",
        checkType: "SB",
        severity: "low",
        leaves: 50,
        pages: 10,
        bookQty: 1,
        receivingBranch: "Central Processing",
        routingNumber: "RT001234",
        requestDate: "2023-05-15",
        status: "Pending",
      },
      {
        id: 1002,
        bank: "Chase Bank",
        branch: "Uptown Branch",
        accountNo: "2345678901",
        accountHolder: "Sarah Johnson",
        checkType: "CD",
        severity: "high",
        leaves: 25,
        pages: 20,
        bookQty: 2,
        receivingBranch: "North District",
        routingNumber: "RT002345",
        requestDate: "2023-05-16",
        status: "Processing",
      },
      {
        id: 1003,
        bank: "Wells Fargo",
        branch: "West Side Branch",
        accountNo: "3456789012",
        accountHolder: "Michael Brown",
        checkType: "SB",
        severity: "medium",
        leaves: 100,
        pages: 20,
        bookQty: 1,
        receivingBranch: "Central Processing",
        routingNumber: "RT003456",
        requestDate: "2023-05-14",
        status: "Completed",
      },
      {
        id: 1004,
        bank: "Citibank",
        branch: "East Side Branch",
        accountNo: "4567890123",
        accountHolder: "Emily Davis",
        checkType: "CC",
        severity: "high",
        leaves: 75,
        pages: 30,
        bookQty: 1,
        receivingBranch: "South District",
        routingNumber: "RT004567",
        requestDate: "2023-05-17",
        status: "Pending",
      },
      {
        id: 1005,
        bank: "Bank of America",
        branch: "Uptown Branch",
        accountNo: "5678901234",
        accountHolder: "Robert Wilson",
        checkType: "SB",
        severity: "low",
        leaves: 50,
        pages: 30,
        bookQty: 2,
        receivingBranch: "North District",
        routingNumber: "RT005678",
        requestDate: "2023-05-18",
        status: "Processing",
      },
      {
        id: 1006,
        bank: "Chase Bank",
        branch: "Downtown Branch",
        accountNo: "6789012345",
        accountHolder: "Jennifer Taylor",
        checkType: "CD",
        severity: "medium",
        leaves: 25,
        pages: 10,
        bookQty: 4,
        receivingBranch: "Central Processing",
        routingNumber: "RT006789",
        requestDate: "2023-05-13",
        status: "Failed",
      },
      {
        id: 1007,
        bank: "Wells Fargo",
        branch: "East Side Branch",
        accountNo: "7890123456",
        accountHolder: "David Martinez",
        checkType: "SB",
        severity: "high",
        leaves: 100,
        pages: 10,
        bookQty: 1,
        receivingBranch: "South District",
        routingNumber: "RT007890",
        requestDate: "2023-05-19",
        status: "Pending",
      },
      {
        id: 1008,
        bank: "Citibank",
        branch: "West Side Branch",
        accountNo: "8901234567",
        accountHolder: "Lisa Anderson",
        checkType: "CC",
        severity: "low",
        leaves: 75,
        pages: 20,
        bookQty: 1,
        receivingBranch: "West District",
        routingNumber: "RT008901",
        requestDate: "2023-05-12",
        status: "Completed",
      },
      {
        id: 1009,
        bank: "Bank of America",
        branch: "East Side Branch",
        accountNo: "9012345678",
        accountHolder: "Thomas White",
        checkType: "SB",
        severity: "medium",
        leaves: 50,
        pages: 20,
        bookQty: 2,
        receivingBranch: "South District",
        routingNumber: "RT009012",
        requestDate: "2023-05-20",
        status: "Processing",
      },
      {
        id: 1010,
        bank: "Chase Bank",
        branch: "West Side Branch",
        accountNo: "0123456789",
        accountHolder: "Jessica Harris",
        checkType: "CD",
        severity: "high",
        leaves: 25,
        pages: 30,
        bookQty: 4,
        receivingBranch: "West District",
        routingNumber: "RT000123",
        requestDate: "2023-05-11",
        status: "Pending",
      },
      {
        id: 1011,
        bank: "Wells Fargo",
        branch: "Downtown Branch",
        accountNo: "1122334455",
        accountHolder: "Daniel Clark",
        checkType: "CC",
        severity: "low",
        leaves: 100,
        pages: 10,
        bookQty: 1,
        receivingBranch: "Central Processing",
        routingNumber: "RT001122",
        requestDate: "2023-05-21",
        status: "Completed",
      },
      {
        id: 1012,
        bank: "Citibank",
        branch: "Uptown Branch",
        accountNo: "2233445566",
        accountHolder: "Michelle Lewis",
        checkType: "SB",
        severity: "medium",
        leaves: 75,
        pages: 30,
        bookQty: 1,
        receivingBranch: "North District",
        routingNumber: "RT002233",
        requestDate: "2023-05-10",
        status: "Failed",
      },
    ];
    loading.value = false;
  }, 1000);
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
  background-color: rgba(59, 130, 246, 0.05);
}

/* Custom modal styles */
.requisition-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.requisition-modal :deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.requisition-modal :deep(.ant-modal-title) {
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
  border-color: #3b82f6 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
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

.ant-tag-processing {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
  color: #3b82f6 !important;
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
