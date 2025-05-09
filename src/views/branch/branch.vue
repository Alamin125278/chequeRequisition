<template>
  <div class="branch-list-container p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Branch Management</h1>
          <p class="text-gray-500 mt-1">View and manage all bank branches</p>
        </div>
        <div class="mt-4 md:mt-0">
          <a-button type="primary" class="add-branch-btn">
            <template #icon><PlusOutlined /></template>
            Add New Branch
          </a-button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Branches</p>
            <p class="text-2xl font-bold">{{ requisitions.length }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <BranchesOutlined style="font-size: 24px; color: #3b82f6" />
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Banks</p>
            <p class="text-2xl font-bold">1</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <BankOutlined style="font-size: 24px; color: #a855f7" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-5 border-b border-gray-200 flex justify-between">
        <h2 class="text-lg font-semibold text-gray-800">All Branch List</h2>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search branches..."
          style="max-width: 300px"
          @search="onSearch"
          allow-clear
        />
      </div>

      <a-table
        :dataSource="filteredRequisitions"
        :columns="columns"
        :pagination="{
          pageSize: 10,
          showTotal: (total) => `Total ${total} branches`,
        }"
        :loading="loading"
        :rowClassName="(index) => (index % 2 === 0 ? 'bg-gray-50' : '')"
        class="custom-table"
      >
        <!-- Bank Name Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'bankName'">
            <div class="flex items-center">
              <BankOutlined class="mr-2 text-gray-500" />
              {{ record.bankName }}
            </div>
          </template>

          <!-- Branch Name Column -->
          <template v-if="column.key === 'branchName'">
            <div class="font-medium">{{ record.branchName }}</div>
          </template>

          <!-- Action Column -->
          <template v-if="column.key === 'action'">
            <div class="flex space-x-2">
              <a-tooltip title="View Details">
                <a-button type="link" size="small" style="color: #4096ff">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Edit Branch">
                <a-button type="link" size="small" style="color: #22c55e">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Delete Branch">
                <a-button type="link" size="small" danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  BankOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";

// Search and filter states
const searchText = ref("");
const loading = ref(false);

// Table columns
const columns = [
  {
    title: "SL No",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
  },
  {
    title: "Branch Code",
    dataIndex: "branchCode",
    key: "branchCode",
  },
  {
    title: "Branch Email",
    dataIndex: "branchEmail",
    key: "branchEmail",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNumber",
    key: "routingNumber",
  },
  {
    title: "Branch Phone",
    dataIndex: "branchPhone",
    key: "branchPhone",
  },
  {
    title: "Branch Address",
    dataIndex: "branchAddress",
    key: "branchAddress",
    ellipsis: true,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 150,
  },
];

// Sample data (expanded with more entries)
const requisitions = [
  {
    id: "1",
    bankName: "Public Bank",
    branchName: "Mohakhali Branch",
    branchCode: "MOH",
    branchEmail: "mohakhalibranch@gmail.com",
    routingNumber: "125278",
    branchPhone: "1234567890",
    branchAddress: "Mohakhali, Dhaka, Bangladesh",
  },
  {
    id: "2",
    bankName: "Public Bank",
    branchName: "Tejgaon Branch",
    branchCode: "TEJ",
    branchEmail: "tejgaonbranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Tejgaon, Dhaka, Bangladesh",
  },
  {
    id: "3",
    bankName: "Public Bank",
    branchName: "Dhaka Branch",
    branchCode: "DHA",
    branchEmail: "dhakabranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Dhaka, Bangladesh",
  },
  {
    id: "4",
    bankName: "Public Bank",
    branchName: "Gulshan Branch",
    branchCode: "GUL",
    branchEmail: "gulshanbranch@gmail.com",
    routingNumber: "987654321",
    branchPhone: "0987654321",
    branchAddress: "Gulshan, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
  },
];

// Filtered data based on search and filters
const filteredRequisitions = computed(() => {
  let result = [...requisitions];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.branchName.toLowerCase().includes(search) ||
        item.bankName.toLowerCase().includes(search) ||
        item.branchCode.toLowerCase().includes(search) ||
        item.branchEmail.toLowerCase().includes(search) ||
        item.routingNumber.toLowerCase().includes(search)
    );
  }

  return result;
});

// Search function
const onSearch = (value: string) => {
  searchText.value = value;
  simulateLoading();
};

// Simulate loading for better UX
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.add-branch-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.add-branch-btn:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.ant-pagination-item-active) {
  border-color: #22c55e;
}

:deep(.ant-pagination-item-active a) {
  color: #22c55e;
}

:deep(.ant-table-row:hover > td) {
  background-color: #f0fdf4 !important;
}

:deep(.ant-input-search-button) {
  background-color: #22c55e;
  border-color: #22c55e;
}

:deep(.ant-input-search-button:hover) {
  background-color: #16a34a;
  border-color: #16a34a;
}
</style>
