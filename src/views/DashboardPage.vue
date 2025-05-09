<template>
  <div class="dashboard-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <p class="text-gray-500">Welcome back, {{ userStore.user.name }}</p>
    </div>

    <!-- Stats Row -->
    <div
      class="stats-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
    >
      <StatCard
        title="Total Requisitions"
        value="48"
        :icon="FormOutlined"
        icon-bg-color="bg-blue-500"
        :change="12"
        subtitle="This month"
      />
      <StatCard
        title="Pending Approval"
        value="12"
        :icon="ClockCircleOutlined"
        icon-bg-color="bg-yellow-500"
        :change="5"
        subtitle="Awaiting action"
      />
      <StatCard
        title="Approved"
        value="32"
        :icon="CheckCircleOutlined"
        icon-bg-color="bg-green-500"
        :change="8"
        subtitle="This month"
      />
      <StatCard
        title="Rejected"
        value="4"
        :icon="CloseCircleOutlined"
        icon-bg-color="bg-red-500"
        :change="-2"
        subtitle="This month"
      />
    </div>

    <!-- Charts Row -->
    <div class="charts-row grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RequisitionStatus />
      <RecentActivity />
    </div>

    <!-- Recent Requisitions -->
    <div class="recent-requisitions bg-white rounded-lg shadow-md p-6">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  FormOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import RequisitionStatus from "@/components/dashboard/RequisitionStatus.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

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
