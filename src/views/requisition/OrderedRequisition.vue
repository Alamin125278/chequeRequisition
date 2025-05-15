<template>
  <div class="p-1 max-w-full bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-2 text-gray-800">Order Management</h1>
      <p class="text-gray-500 mb-6">Manage and export your cheque orders</p>
      
      <!-- Filter Section -->
      <div class="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h2 class="text-lg font-medium mb-4 text-gray-700">Filters</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">Bank</label>
            <a-select
              v-model:value="filters.bank"
              placeholder="Select Bank"
              class="w-full"
              @change="handleFilterChange"
              :bordered="false"
              :options="bankOptions"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">Bank Branch</label>
            <a-select
              v-model:value="filters.branch"
              placeholder="Select Branch"
              class="w-full"
              @change="handleFilterChange"
              :bordered="false"
              :options="branchOptions"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">Severity</label>
            <a-select
              v-model:value="filters.severity"
              placeholder="Select Severity"
              class="w-full"
              @change="handleFilterChange"
              :bordered="false"
              :options="severityOptions"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">Request Date</label>
            <a-range-picker
              v-model:value="filters.dateRange"
              class="w-full"
              @change="handleFilterChange"
              :bordered="false"
            />
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <a-button
            type="primary"
            :disabled="!hasAppliedFilters"
            @click="showExportPreview"
            class="bg-primary hover:bg-primary-dark flex items-center"
            size="large"
          >
            <template #icon><ExportOutlined /></template>
            Export Preview
          </a-button>
        </div>
      </div>
      
      <!-- Orders Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-700">Orders</h2>
          <span class="text-gray-500 text-sm">{{ filteredOrders.length }} orders found</span>
        </div>
        <a-table
          :columns="columns"
          :data-source="filteredOrders"
          :pagination="{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }"
          :loading="loading"
          row-key="id"
          class="w-full custom-table"
          :scroll="{ x: 1500 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </a-tag>
            </template>
            <template v-if="column.key === 'severity'">
              <a-tag :color="getSeverityColor(record.severity)">
                {{ record.severity }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
      
      <!-- Export Preview Modal -->
      <a-modal
        v-model:visible="exportModalVisible"
        title="Export Preview"
        width="80%"
        :footer="null"
        class="export-modal"
      >
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Filtered Orders</h3>
          <p class="text-gray-500">{{ filteredOrders.length }} orders found</p>
        </div>
        
        <!-- Check Type Buttons -->
        <div class="mb-6">
          <h4 class="text-base font-medium mb-3">Export by Cheque Type</h4>
          <div class="flex flex-wrap gap-3">
            <a-button
              v-for="checkTypeVariation in checkTypeVariations"
              :key="`${checkTypeVariation.type}-${checkTypeVariation.pages}`"
              @click="exportByCheckTypeAndPages(checkTypeVariation.type, checkTypeVariation.pages)"
              class="flex items-center"
              size="middle"
            >
              <span>{{ checkTypeVariation.type }} ({{ checkTypeVariation.pages }})</span>
              <a-badge :count="checkTypeVariation.count" class="ml-2" />
            </a-button>
          </div>
        </div>
        
        <!-- Preview Table -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <a-table
            :columns="previewColumns"
            :data-source="filteredOrders"
            :pagination="{ pageSize: 5 }"
            row-key="id"
            class="w-full custom-table"
            size="small"
          />
        </div>
        
        <!-- Export Actions -->
        <div class="flex flex-wrap gap-3 justify-between mt-6">
          <div>
            <a-button type="primary" @click="exportPSI" class="mr-2 bg-primary hover:bg-primary-dark">
              <template #icon><FileExcelOutlined /></template>
              Export PSI
            </a-button>
            <a-button type="primary" @click="showChallanPreview" class="bg-primary hover:bg-primary-dark">
              <template #icon><FileDoneOutlined /></template>
              Export Challan
            </a-button>
          </div>
          <a-button type="primary" @click="submitExport" class="bg-green-600 hover:bg-green-700">
            <template #icon><CheckOutlined /></template>
            Submit
          </a-button>
        </div>
      </a-modal>
      
      <!-- Challan Preview Modal -->
      <a-modal
        v-model:visible="challanPreviewVisible"
        title="Challan Preview"
        width="80%"
        :footer="null"
        class="challan-modal"
      >
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">Challan Preview by Receiving Branch</h3>
          <p class="text-gray-500">{{ Object.keys(challanData).length }} receiving branches found</p>
        </div>
        
        <div v-for="(orders, branch) in challanData" :key="branch" class="mb-8">
          <div class="bg-gray-50 p-4 rounded-lg mb-3">
            <h4 class="text-base font-medium mb-2">{{ branch }}</h4>
            <p class="text-gray-500">{{ orders.length }} orders</p>
          </div>
          
          <a-table
            :columns="challanColumns"
            :data-source="orders"
            :pagination="false"
            row-key="id"
            class="w-full custom-table mb-4"
            size="small"
          />
        </div>
        
        <div class="flex justify-end mt-6">
          <a-button @click="challanPreviewVisible = false" class="mr-2">
            Cancel
          </a-button>
          <a-button type="primary" @click="confirmExportChallan" class="bg-primary hover:bg-primary-dark">
            <template #icon><DownloadOutlined /></template>
            Confirm Export
          </a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { 
  ExportOutlined, 
  FileExcelOutlined, 
  FileDoneOutlined, 
  CheckOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';

// Mock data for demonstration
const bankOptions = [
  { value: 'bank1', label: 'Bank of America' },
  { value: 'bank2', label: 'Chase Bank' },
  { value: 'bank3', label: 'Wells Fargo' },
  { value: 'bank4', label: 'Citibank' },
];

const branchOptions = [
  { value: 'branch1', label: 'Downtown Branch' },
  { value: 'branch2', label: 'Uptown Branch' },
  { value: 'branch3', label: 'West Side Branch' },
  { value: 'branch4', label: 'East Side Branch' },
];

const severityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// Table columns
const columns = [
  {
    title: 'SL.',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    sorter: (a, b) => a.id - b.id,
    fixed: 'left',
  },
  {
    title: 'Bank Name',
    dataIndex: 'bank',
    key: 'bank',
    sorter: (a, b) => a.bank.localeCompare(b.bank),
    fixed: 'left',
  },
  {
    title: 'Branch Name',
    dataIndex: 'branch',
    key: 'branch',
    sorter: (a, b) => a.branch.localeCompare(b.branch),
  },
  {
    title: 'Account No',
    dataIndex: 'accountNo',
    key: 'accountNo',
  },
  {
    title: 'Account Holder',
    dataIndex: 'accountHolder',
    key: 'accountHolder',
    sorter: (a, b) => a.accountHolder.localeCompare(b.accountHolder),
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
  },
  {
    title: 'Cheque Type',
    dataIndex: 'checkType',
    key: 'checkType',
  },
  {
    title: 'Leaves',
    dataIndex: 'leaves',
    key: 'leaves',
    sorter: (a, b) => a.leaves - b.leaves,
  },
  {
    title: 'Book Qty',
    dataIndex: 'bookQty',
    key: 'bookQty',
    sorter: (a, b) => a.bookQty - b.bookQty,
  },
  {
    title: 'Receiving Branch',
    dataIndex: 'receivingBranch',
    key: 'receivingBranch',
  },
  {
    title: 'Routing Number',
    dataIndex: 'routingNumber',
    key: 'routingNumber',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    fixed: 'right',
  },
  {
    title: 'Request Date',
    dataIndex: 'requestDate',
    key: 'requestDate',
    sorter: (a, b) => new Date(a.requestDate) - new Date(b.requestDate),
  },
];

// Preview columns (simplified for modal)
const previewColumns = [
  {
    title: 'SL.',
    dataIndex: 'id',
    key: 'id',
    width: 70,
  },
  {
    title: 'Bank Name',
    dataIndex: 'bank',
    key: 'bank',
  },
  {
    title: 'Branch Name',
    dataIndex: 'branch',
    key: 'branch',
  },
  {
    title: 'Account No',
    dataIndex: 'accountNo',
    key: 'accountNo',
  },
  {
    title: 'Account Holder',
    dataIndex: 'accountHolder',
    key: 'accountHolder',
  },
  {
    title: 'Cheque Type',
    dataIndex: 'checkType',
    key: 'checkType',
  },
  {
    title: 'Pages',
    dataIndex: 'pages',
    key: 'pages',
  },
  {
    title: 'Receiving Branch',
    dataIndex: 'receivingBranch',
    key: 'receivingBranch',
  },
];

// Challan columns
const challanColumns = [
  {
    title: 'SL.',
    dataIndex: 'id',
    key: 'id',
    width: 70,
  },
  {
    title: 'Bank Name',
    dataIndex: 'bank',
    key: 'bank',
  },
  {
    title: 'Branch Name',
    dataIndex: 'branch',
    key: 'branch',
  },
  {
    title: 'Account No',
    dataIndex: 'accountNo',
    key: 'accountNo',
  },
  {
    title: 'Account Holder',
    dataIndex: 'accountHolder',
    key: 'accountHolder',
  },
  {
    title: 'Cheque Type',
    dataIndex: 'checkType',
    key: 'checkType',
  },
  {
    title: 'Pages',
    dataIndex: 'pages',
    key: 'pages',
  },
  {
    title: 'Book Qty',
    dataIndex: 'bookQty',
    key: 'bookQty',
  },
];

// State
const orders = ref([]);
const loading = ref(true);
const exportModalVisible = ref(false);
const challanPreviewVisible = ref(false);
const challanData = ref({});
const filters = ref({
  bank: undefined,
  branch: undefined,
  severity: undefined,
  dateRange: [],
});

// Computed properties
const hasAppliedFilters = computed(() => {
  return filters.value.bank || 
         filters.value.branch || 
         filters.value.severity || 
         (filters.value.dateRange && filters.value.dateRange.length === 2);
});

const filteredOrders = computed(() => {
  let result = [...orders.value];
  
  if (filters.value.bank) {
    result = result.filter(order => order.bank === getBankLabel(filters.value.bank));
  }
  
  if (filters.value.branch) {
    result = result.filter(order => order.branch === getBranchLabel(filters.value.branch));
  }
  
  if (filters.value.severity) {
    result = result.filter(order => order.severity === filters.value.severity);
  }
  
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const startDate = filters.value.dateRange[0].valueOf();
    const endDate = filters.value.dateRange[1].valueOf();
    
    result = result.filter(order => {
      const orderDate = new Date(order.requestDate).valueOf();
      return orderDate >= startDate && orderDate <= endDate;
    });
  }
  
  return result;
});

// Generate check type variations with page counts
const checkTypeVariations = computed(() => {
  const variations = [];
  
  // Group orders by check type and page count
  filteredOrders.value.forEach(order => {
    const key = `${order.checkType}-${order.pages}`;
    const existingVariation = variations.find(v => 
      v.type === order.checkType && v.pages === order.pages
    );
    
    if (existingVariation) {
      existingVariation.count++;
    } else {
      variations.push({
        type: order.checkType,
        pages: order.pages,
        count: 1
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
const getBankLabel = (value) => {
  const bank = bankOptions.find(b => b.value === value);
  return bank ? bank.label : value;
};

const getBranchLabel = (value) => {
  const branch = branchOptions.find(b => b.value === value);
  return branch ? branch.label : value;
};

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Processing': 'blue',
    'Completed': 'green',
    'Downloaded': 'purple',
    'Failed': 'red',
  };
  return colors[status] || 'default';
};

const getSeverityColor = (severity) => {
  const colors = {
    'high': 'red',
    'medium': 'orange',
    'low': 'green',
  };
  return colors[severity] || 'default';
};

// Event handlers
const handleFilterChange = () => {
  // This function is called whenever any filter changes
  console.log('Filters changed:', filters.value);
};

const showExportPreview = () => {
  if (filteredOrders.value.length === 0) {
    message.warning('No orders match the selected filters');
    return;
  }
  
  exportModalVisible.value = true;
};

const exportByCheckTypeAndPages = (checkType, pages) => {
  const matchingOrders = filteredOrders.value.filter(
    order => order.checkType === checkType && order.pages === pages
  );
  
  console.log(`Exporting ${matchingOrders.length} orders of type ${checkType} with ${pages} pages`);
  
  // In a real application, this would trigger an API call to generate and download an Excel file
  message.success(`Exported ${matchingOrders.length} orders of type ${checkType} (${pages} pages)`);
};

const exportPSI = () => {
  // In a real application, this would trigger an API call to generate and download an Excel file
  message.success(`Exported all ${filteredOrders.value.length} orders as PSI file`);
};

const showChallanPreview = () => {
  // Group by receiving branch
  const branches = {};
  filteredOrders.value.forEach(order => {
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
  message.success(`Generated and exported challans for ${branchCount} receiving branches`);
  
  challanPreviewVisible.value = false;
};

const submitExport = () => {
  // Update status of all exported orders to "Downloaded"
  const updatedOrders = orders.value.map(order => {
    if (filteredOrders.value.some(fo => fo.id === order.id)) {
      return { ...order, status: 'Downloaded' };
    }
    return order;
  });
  
  orders.value = updatedOrders;
  message.success(`Updated status of ${filteredOrders.value.length} orders to "Downloaded"`);
  exportModalVisible.value = false;
};

// Lifecycle hooks
onMounted(() => {
  // Simulate API call to fetch orders
  setTimeout(() => {
    orders.value = [
      {
        id: 1001,
        bank: 'Bank of America',
        branch: 'Downtown Branch',
        accountNo: '1234567890',
        accountHolder: 'John Smith',
        checkType: 'SB',
        severity: 'low',
        leaves: 50,
        pages: 10,
        bookQty: 1,
        receivingBranch: 'Central Processing',
        routingNumber: 'RT001234',
        requestDate: '2023-05-15',
        status: 'Pending',
      },
      {
        id: 1002,
        bank: 'Chase Bank',
        branch: 'Uptown Branch',
        accountNo: '2345678901',
        accountHolder: 'Sarah Johnson',
        checkType: 'CD',
        severity: 'high',
        leaves: 25,
        pages: 20,
        bookQty: 2,
        receivingBranch: 'North District',
        routingNumber: 'RT002345',
        requestDate: '2023-05-16',
        status: 'Processing',
      },
      {
        id: 1003,
        bank: 'Wells Fargo',
        branch: 'West Side Branch',
        accountNo: '3456789012',
        accountHolder: 'Michael Brown',
        checkType: 'SB',
        severity: 'medium',
        leaves: 100,
        pages: 20,
        bookQty: 1,
        receivingBranch: 'Central Processing',
        routingNumber: 'RT003456',
        requestDate: '2023-05-14',
        status: 'Completed',
      },
      {
        id: 1004,
        bank: 'Citibank',
        branch: 'East Side Branch',
        accountNo: '4567890123',
        accountHolder: 'Emily Davis',
        checkType: 'CC',
        severity: 'high',
        leaves: 75,
        pages: 30,
        bookQty: 1,
        receivingBranch: 'South District',
        routingNumber: 'RT004567',
        requestDate: '2023-05-17',
        status: 'Pending',
      },
      {
        id: 1005,
        bank: 'Bank of America',
        branch: 'Uptown Branch',
        accountNo: '5678901234',
        accountHolder: 'Robert Wilson',
        checkType: 'SB',
        severity: 'low',
        leaves: 50,
        pages: 30,
        bookQty: 2,
        receivingBranch: 'North District',
        routingNumber: 'RT005678',
        requestDate: '2023-05-18',
        status: 'Processing',
      },
      {
        id: 1006,
        bank: 'Chase Bank',
        branch: 'Downtown Branch',
        accountNo: '6789012345',
        accountHolder: 'Jennifer Taylor',
        checkType: 'CD',
        severity: 'medium',
        leaves: 25,
        pages: 10,
        bookQty: 4,
        receivingBranch: 'Central Processing',
        routingNumber: 'RT006789',
        requestDate: '2023-05-13',
        status: 'Failed',
      },
      {
        id: 1007,
        bank: 'Wells Fargo',
        branch: 'East Side Branch',
        accountNo: '7890123456',
        accountHolder: 'David Martinez',
        checkType: 'SB',
        severity: 'high',
        leaves: 100,
        pages: 10,
        bookQty: 1,
        receivingBranch: 'South District',
        routingNumber: 'RT007890',
        requestDate: '2023-05-19',
        status: 'Pending',
      },
      {
        id: 1008,
        bank: 'Citibank',
        branch: 'West Side Branch',
        accountNo: '8901234567',
        accountHolder: 'Lisa Anderson',
        checkType: 'CC',
        severity: 'low',
        leaves: 75,
        pages: 20,
        bookQty: 1,
        receivingBranch: 'West District',
        routingNumber: 'RT008901',
        requestDate: '2023-05-12',
        status: 'Completed',
      },
      {
        id: 1009,
        bank: 'Bank of America',
        branch: 'East Side Branch',
        accountNo: '9012345678',
        accountHolder: 'Thomas White',
        checkType: 'SB',
        severity: 'medium',
        leaves: 50,
        pages: 20,
        bookQty: 2,
        receivingBranch: 'South District',
        routingNumber: 'RT009012',
        requestDate: '2023-05-20',
        status: 'Processing',
      },
      {
        id: 1010,
        bank: 'Chase Bank',
        branch: 'West Side Branch',
        accountNo: '0123456789',
        accountHolder: 'Jessica Harris',
        checkType: 'CD',
        severity: 'high',
        leaves: 25,
        pages: 30,
        bookQty: 4,
        receivingBranch: 'West District',
        routingNumber: 'RT000123',
        requestDate: '2023-05-11',
        status: 'Pending',
      },
      {
        id: 1011,
        bank: 'Wells Fargo',
        branch: 'Downtown Branch',
        accountNo: '1122334455',
        accountHolder: 'Daniel Clark',
        checkType: 'CC',
        severity: 'low',
        leaves: 100,
        pages: 10,
        bookQty: 1,
        receivingBranch: 'Central Processing',
        routingNumber: 'RT001122',
        requestDate: '2023-05-21',
        status: 'Completed',
      },
      {
        id: 1012,
        bank: 'Citibank',
        branch: 'Uptown Branch',
        accountNo: '2233445566',
        accountHolder: 'Michelle Lewis',
        checkType: 'SB',
        severity: 'medium',
        leaves: 75,
        pages: 30,
        bookQty: 1,
        receivingBranch: 'North District',
        routingNumber: 'RT002233',
        requestDate: '2023-05-10',
        status: 'Failed',
      },
    ];
    loading.value = false;
  }, 1000);
});
</script>

<style>
/* Modern styling enhancements */
/* .custom-table .ant-table {
  @apply rounded-lg overflow-hidden;
}

.custom-table .ant-table-thead > tr > th {
  @apply bg-gray-50 text-gray-700 font-medium;
}

.ant-select-selector {
  @apply rounded-md shadow-sm border border-gray-200 bg-gray-50;
}

.ant-picker {
  @apply rounded-md shadow-sm border border-gray-200 bg-gray-50;
}

.ant-btn-primary {
  @apply rounded-md shadow-sm;
}

.ant-modal-content {
  @apply rounded-xl overflow-hidden;
}

.ant-modal-header {
  @apply border-b border-gray-100 pb-4;
}

.ant-modal-title {
  @apply text-xl font-medium;
} */

/* Define primary colors for Tailwind */
:root {
  --color-primary: #1890ff;
  --color-primary-dark: #096dd9;
}

.bg-primary {
  background-color: var(--color-primary);
}

.hover\:bg-primary-dark:hover {
  background-color: var(--color-primary-dark);
}

/* Responsive adjustments */


</style>