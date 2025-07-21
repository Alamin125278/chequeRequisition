<template>
  <div class="dashboard-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <p class="text-gray-500">
        Welcome back, {{ userStore.currentUser?.name }}
      </p>
    </div>

    <!-- Stats Row -->
    <div
      class="stats-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6"
    >
      <StatCard
        title="Total Requisitions"
        :value="cardData.totalRequisition"
        :icon="SnippetsOutlined"
        icon-bg-color="bg-lime-500"
        subtitle="This month"
      />
      <StatCard
        title="Ordered"
        :value="cardData.orderedRequisition"
        :icon="DiffOutlined"
        icon-bg-color="bg-blue-500"
        subtitle="Awaiting Processing"
      />
      <StatCard
        title="Processing"
        :value="cardData.processingRequisition"
        :icon="SettingOutlined"
        icon-bg-color="bg-orange-500"
        subtitle="Awaiting Processing"
      />
      <StatCard
        title="Dispatched"
        :value="cardData.dispatchedRequisition"
        :icon="DeliveredProcedureOutlined"
        icon-bg-color="bg-purple-500"
        subtitle="This month"
      />
      <StatCard
        title="Delivered"
        :value="cardData.deliveredRequisition"
        :icon="CheckCircleOutlined"
        icon-bg-color="bg-green-500"
        subtitle="This month"
      />
    </div>

    <!-- Bank Selection -->
    <div
      v-show="isVendorLoggedIn"
      class="mb-6 bg-white p-5 rounded-md border border-gray-200 shadow-lg"
    >
      <div class="flex items-center mb-4">
        <BankOutlined class="text-accent mr-2 text-lg" />
        <h3 class="text-md font-medium text-primary">Select Bank</h3>
      </div>
      <!-- Flex container for dropdown & message -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <!-- Left: Bank Select -->
        <a-select
          v-model:value="selectedBank"
          placeholder="Select Bank"
          class="w-full md:w-1/3 rounded-md"
          size="large"
          @change="handleBankChange"
          allowClear
        >
          <a-select-option value="">All Banks</a-select-option>
          <a-select-option
            v-for="option in banks"
            :key="option.id"
            :value="option.id"
          >
            {{ option.bankName }}
          </a-select-option>
        </a-select>

        <!-- Right: Message when a bank is selected -->
        <transition name="fade">
          <div
            v-if="selectedBank"
            class="flex items-center gap-3 bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-300 px-5 py-3 rounded-lg shadow-md w-full md:w-auto"
          >
            <!-- Icon Circle -->
            <div class="bg-lime-600 text-white rounded-full p-2 shadow-inner">
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 110-17 8.5 8.5 0 010 17z"
                />
              </svg>
            </div>

            <!-- Message Text -->
            <div class="text-lime-900 text-sm">
              <p class="font-semibold">
                State Card for
                <span class="text-lime-700 text-l">{{ selectedBankName }}</span>
                is now visible below.
              </p>
              <p class="text-xs text-lime-600 mt-1">
                Please review the summary carefully.
              </p>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!--Selected Bank Stats Row -->
    <div
      v-show="selectedBank"
      class="stats-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6"
    >
      <StatCard
        :title="`Total Requisitions`"
        :value="SelectedBankCardData.totalRequisition"
        :icon="SnippetsOutlined"
        icon-bg-color="bg-lime-500"
        subtitle="This month"
      />
      <StatCard
        title="Ordered"
        :value="SelectedBankCardData.orderedRequisition"
        :icon="DiffOutlined"
        icon-bg-color="bg-blue-500"
        subtitle="Awaiting Processing"
      />
      <StatCard
        title="Processing"
        :value="SelectedBankCardData.processingRequisition"
        :icon="SettingOutlined"
        icon-bg-color="bg-orange-500"
        subtitle="Processing in Progress"
      />
      <StatCard
        title="Dispatched"
        :value="SelectedBankCardData.dispatchedRequisition"
        :icon="DeliveredProcedureOutlined"
        icon-bg-color="bg-purple-500"
        subtitle="This month"
      />
      <StatCard
        title="Delivered"
        :value="SelectedBankCardData.deliveredRequisition"
        :icon="CheckCircleOutlined"
        icon-bg-color="bg-green-500"
        subtitle="This month"
      />
    </div>

    <!-- Charts Row -->
    <div v-show="isVendorLoggedIn" class="charts-row grid grid-cols-1 mb-6">
      <BankWiseRequisition />
    </div>
    <RequisitionStatus />
    <!-- <RecentActivity /> -->

    <!-- Recent Requisitions -->
    <!-- <div class="recent-requisitions bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Recent Requisitions</h2>
        <a-button type="primary">Create New</a-button>
      </div>
      <a-table
        :dataSource="requisitions"
        :columns="columns"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <div class="flex space-x-2">
              <a-button type="link" size="small">View</a-button>
              <a-button
                type="link"
                size="small"
                v-if="record.status === 'Pending'"
                >Edit</a-button
              >
            </div>
          </template>
        </template>
      </a-table>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import BankWiseRequisition from "@/components/dashboard/BankWiseRequisition.vue";
import RequisitionStatus from "@/components/dashboard/RequisitionStatus.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import {
  BankOutlined,
  CheckCircleOutlined,
  DeliveredProcedureOutlined,
  DiffOutlined,
  SettingOutlined,
  SnippetsOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, ref } from "vue";
import { getBankForBranchService } from "../services/bank/bank.service";
import { getStats, type Card } from "../services/dashboard/dashboard.service";
import { useUserStore } from "../stores/userStore";

const selectedBank = ref<number | null>(null);
interface Bank {
  id: number;
  bankName: string;
}

const selectedBankName = ref("");
const loading = ref(true);

const banks = ref<Bank[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  loading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  } finally {
    loading.value = false;
  }
};

const handleBankChange = () => {
  const bankId = selectedBank.value;
  const bank = banks.value.find((b) => b.id === bankId);
  if (bank != null) {
    selectedBankName.value = bank.bankName;
  }
  fetchCardData(bankId);
};

const cardData = ref<Card>({
  totalRequisition: 0,
  orderedRequisition: 0,
  processingRequisition: 0,
  dispatchedRequisition: 0,
  deliveredRequisition: 0,
});
const SelectedBankCardData = ref<Card>({
  totalRequisition: 0,
  orderedRequisition: 0,
  processingRequisition: 0,
  dispatchedRequisition: 0,
  deliveredRequisition: 0,
});

const fetchCardData = async (bankId: number | null = null) => {
  try {
    if (bankId !== null) {
      let res = await getStats(bankId);
      if (Array.isArray(res) && res.length > 0) {
        Object.assign(SelectedBankCardData.value, res[0]);
      }
    } else {
      let res = await getStats();
      if (Array.isArray(res) && res.length > 0) {
        Object.assign(cardData.value, res[0]);
      }
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }
};

onMounted(async () => {
  await fetchCardData();
  await featchBanks();
});

const userStore = useUserStore();

const isVendorLoggedIn = computed(() => {
  return userStore.currentUser?.role === 2;
});

// Table columns
const columns = [
  {
    title: "Requisition ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Requested By",
    dataIndex: "requestedBy",
    key: "requestedBy",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Action",
    key: "action",
  },
];

// Sample data
const requisitions = [
  {
    key: "1",
    id: "REQ-2023-05",
    description: "Office supplies purchase",
    amount: "$1,200.00",
    requestedBy: "John Doe",
    date: "2023-05-15",
    status: "Pending",
  },
  {
    key: "2",
    id: "REQ-2023-04",
    description: "Marketing campaign expenses",
    amount: "$3,500.00",
    requestedBy: "Jane Smith",
    date: "2023-05-12",
    status: "Approved",
  },
  {
    key: "3",
    id: "REQ-2023-03",
    description: "Travel expenses for conference",
    amount: "$2,800.00",
    requestedBy: "Mike Johnson",
    date: "2023-05-10",
    status: "Rejected",
  },
  {
    key: "4",
    id: "REQ-2023-02",
    description: "Software subscription renewal",
    amount: "$899.00",
    requestedBy: "Sarah Williams",
    date: "2023-05-08",
    status: "Approved",
  },
  {
    key: "5",
    id: "REQ-2023-01",
    description: "Team building event",
    amount: "$1,500.00",
    requestedBy: "David Brown",
    date: "2023-05-05",
    status: "Completed",
  },
];

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "gold";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Completed":
      return "blue";
    default:
      return "default";
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
