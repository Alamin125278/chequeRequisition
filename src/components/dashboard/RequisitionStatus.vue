<template>
  <!-- <div class="min-h-screen bg-gray-50 p-6"> -->
  <!-- <div class="max-w-7xl mx-auto"> -->
  <!-- Fixed Grid Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Main Dashboard Section - Fixed 8 columns -->
    <div class="col-span-8">
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full overflow-y-auto"
      >
        <!-- Header Section -->
        <div
          class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100"
        >
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Order Status Pipeline
            </h2>
            <p class="text-gray-600">
              Track orders through the complete fulfillment process
            </p>
          </div>
          <a-select
            v-model:value="timeRange"
            class="min-w-[140px]"
            size="large"
            @change="fetchOrderTracking(timeRange)"
          >
            <a-select-option value="today">Today</a-select-option>
            <a-select-option value="week">This Week</a-select-option>
            <a-select-option value="month">This Month</a-select-option>
            <a-select-option value="quarter">This Quarter</a-select-option>
          </a-select>
        </div>

        <!-- Order Flow Visualization - Fixed Height -->
        <div
          class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6 h-48"
        >
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            Order Flow Progress
          </h3>

          <!-- Flow Steps -->
          <div class="flex items-center justify-between relative h-24">
            <!-- Progress Line -->
            <div
              class="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"
            >
              <div
                class="h-1 bg-gradient-to-r from-blue-400 to-green-500 rounded-full transition-all duration-1000"
                :style="{ width: `${overallProgress}%` }"
              ></div>
            </div>

            <!-- Flow Steps -->
            <div
              v-for="(status, index) in statuses"
              :key="index"
              class="flex flex-col items-center relative z-10"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-300"
                :class="getFlowStepClass(status.count, index)"
              >
                <component :is="getStatusIcon(index)" class="text-lg" />
              </div>
              <span class="text-sm font-medium text-gray-700 mt-2 text-center">
                {{ status.label }}
              </span>
              <span class="text-xs text-gray-500">
                {{ status.count }} items
              </span>
            </div>
          </div>
        </div>

        <!-- Detailed Status Breakdown - Fixed Grid -->
        <div class="grid grid-cols-1">
          <div
            v-for="(status, index) in statuses"
            :key="index"
            class="p-4 mb-4 h-36 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-100"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center space-x-3">
                <div
                  :class="getStatusDotClass(index)"
                  class="w-4 h-4 rounded-full flex-shrink-0"
                ></div>
                <div>
                  <span class="text-lg font-bold text-gray-900">
                    {{ status.label }}
                  </span>
                  <div class="text-sm text-gray-600 mt-1">
                    {{ getDetailedDescription(status.label, status.count) }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-gray-900">
                  {{ status.count }}
                </div>
                <div
                  class="text-sm font-medium"
                  :class="getCompletionTextClass(status, statuses)"
                >
                  {{ getCompletionStatus(status, statuses) }}
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                class="h-3 rounded-full transition-all duration-1000 ease-out"
                :class="getProgressClass(index, status.count)"
                :style="{ width: `${getProgressWidth(status, statuses)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Panel - Fixed 4 columns -->
    <div class="col-span-8 lg:col-span-4 space-y-6">
      <!-- Pipeline Summary - Fixed Height -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Pipeline Analytics</h3>

        <!-- Total Orders -->
        <div
          class="text-center mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
        >
          <div class="text-3xl font-bold text-blue-600 mb-1">
            {{ totalOrders }}
          </div>
          <div class="text-blue-700 font-semibold">Total Orders</div>
          <div class="text-blue-500 text-sm mt-1">
            {{ getTimeRangeLabel() }}
          </div>
        </div>

        <!-- Completion Rate -->
        <div
          class="mb-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <div
                class="text-emerald-600 text-sm font-semibold uppercase tracking-wide mb-1"
              >
                Delivery Rate
              </div>
              <div class="text-gray-900 font-bold text-xl">
                {{ deliveryRate }}%
              </div>
              <div class="text-emerald-600 text-sm">
                {{ deliveredCount }} delivered
              </div>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircleOutlined class="text-white text-lg" />
            </div>
          </div>
        </div>

        <!-- In Transit Alert -->
        <div
          class="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <div
                class="text-amber-600 text-sm font-semibold uppercase tracking-wide mb-1"
              >
                In Transit
              </div>
              <div class="text-gray-900 font-bold text-xl">
                {{ inTransitCount }}
              </div>
              <div class="text-amber-600 text-sm">Orders processing</div>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center"
            >
              <StockOutlined class="text-white text-lg" />
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics - Fixed Height -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 overflow-y-auto"
      >
        <h3 class="text-xl font-bold text-gray-900 mb-6">
          Performance Metrics
        </h3>

        <!-- Efficiency Score -->
        <div
          class="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 mb-6"
        >
          <div class="text-2xl font-bold text-purple-600 mb-1">
            {{ efficiencyScore }}%
          </div>
          <div class="text-purple-700 font-semibold">Pipeline Efficiency</div>
          <div class="text-purple-500 text-sm">Based on completion rates</div>
        </div>

        <!-- Status Breakdown -->
        <div class="space-y-3">
          <div
            v-for="(status, index) in statuses"
            :key="status.label"
            class="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="getStatusBgClass(index)"
              >
                <component
                  :is="getStatusIcon(index)"
                  class="text-white text-xs"
                />
              </div>
              <div>
                <div class="text-gray-900 font-semibold text-sm">
                  {{ status.label }}
                </div>
                <div class="text-gray-500 text-xs">
                  {{ getCompletionStatus(status, statuses) }}
                </div>
              </div>
            </div>
            <div class="text-gray-900 font-bold">
              {{ status.count }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div>
  </div> -->
</template>

<script setup lang="ts">
import {
  getOrderTracking,
  type OrderTracking,
} from "@/services/dashboard/dashboard.service";
import {
  CheckCircleOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  SyncOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, ref } from "vue";

const timeRange = ref("today");

const statuses = ref<OrderTracking[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchOrderTracking = async (timeRange: string) => {
  try {
    isLoading.value = true;
    const result = await getOrderTracking(timeRange);
    statuses.value = result.map((item: any) => {
      if (item.label === "Downloaded") {
        return { ...item, label: "Processing" };
      }
      return item;
    });
  } catch (e) {
    error.value = "Failed to load order tracking.";
    console.error("Error fetching order tracking", e);
  } finally {
    isLoading.value = false;
  }
};

// Computed properties
const totalOrders = computed(() =>
  statuses.value.reduce((sum, status) => sum + status.count, 0)
);

const deliveredCount = computed(
  () => statuses.value.find((s) => s.label === "Delivered")?.count || 0
);

const inTransitCount = computed(() => {
  const processing =
    statuses.value.find((s) => s.label === "Processing")?.count || 0;
  const dispatched =
    statuses.value.find((s) => s.label === "Dispatched")?.count || 0;
  return processing + dispatched;
});

const deliveryRate = computed(() =>
  totalOrders.value > 0
    ? Math.round((deliveredCount.value / totalOrders.value) * 100)
    : 0
);

// const efficiencyScore = computed(() => {
//   const completedSteps = statuses.filter(
//     (s) => s.count === 0 && s.label !== "Ordered"
//   ).length;
//   return Math.round((completedSteps / 3) * 100);
// });

const efficiencyScore = computed(() => {
  const completedSteps = statuses.value.filter(
    (s) => s.count === 0 || s.label === "Delivered"
  ).length;
  return Math.round((completedSteps / statuses.value.length) * 100);
});

const overallProgress = computed(() => {
  const totalSteps = statuses.value.length;
  const allStepsCleared = statuses.value.every(
    (s) => s.label === "Delivered" || s.count === 0
  );
  if (allStepsCleared && deliveredCount.value >= 0) {
    return 100;
  }
  const completedSteps =
    statuses.value.filter((s) => s.count === 0 && s.label !== "Ordered")
      .length + (deliveredCount.value > 0 ? 1 : 0);
  return Math.round((completedSteps / totalSteps) * 100);
});

// Helper functions
const getTimeRangeLabel = () => {
  const labels = {
    week: "This Week",
    month: "This Month",
    quarter: "This Quarter",
  };
  return labels[timeRange.value as keyof typeof labels];
};

const getCompletionStatus = (
  status: { label: string; count: number },
  statuses: { label: string; count: number }[]
) => {
  if (status.label === "Delivered" && status.count >= 0) {
    return "Completed";
  } else {
    return status.count === 0 ? "Completed" : "In Progress";
  }
};

const getCompletionTextClass = (
  status: { label: string; count: number },
  statuses: { label: string; count: number }[]
) => {
  const isPreStepsCompleted = statuses.every((s) => {
    if (["Ordered", "Processing", "Dispatched"].includes(s.label)) {
      return s.count === 0;
    }
    return true;
  });
  if (status.label === "Delivered" && status.count >= 0) {
    return "text-green-600";
  }
  return status.count === 0 ? "text-green-600" : "text-yellow-600";
};

const getProgressWidth = (
  status: { label: string; count: number },
  statuses: { label: string; count: number }[]
) => {
  if (status.label === "Delivered") {
    let percentage =
      totalOrders.value && totalOrders.value > 0
        ? Math.min(Math.round((status.count / totalOrders.value) * 100), 100)
        : 100;

    return percentage;
  } else {
    return status.count === 0
      ? 100
      : Math.min(100 - (status.count / totalOrders.value) * 100);
  }
};

const getProgressClass = (index: number, count: number) => {
  if (count === 0 && statuses.value[index].label !== "Ordered") {
    return "bg-gradient-to-r from-green-400 to-emerald-500";
  }
  const classes = [
    "bg-gradient-to-r from-blue-400 to-indigo-500",
    "bg-gradient-to-r from-orange-400 to-red-500",
    "bg-gradient-to-r from-purple-400 to-violet-500",
    "bg-gradient-to-r from-green-400 to-emerald-500",
  ];
  return classes[index % classes.length];
};

const getStatusDotClass = (index: number) => {
  const status = statuses.value[index];
  if (status.count === 0 && status.label !== "Ordered") {
    return "bg-green-500";
  }
  const classes = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-green-500",
  ];
  return classes[index % classes.length];
};

const getStatusBgClass = (index: number) => {
  const status = statuses.value[index];
  if (status.count === 0 && status.label !== "Ordered") {
    return "bg-gradient-to-r from-green-400 to-emerald-500";
  }
  const classes = [
    "bg-gradient-to-r from-blue-400 to-indigo-500",
    "bg-gradient-to-r from-orange-400 to-red-500",
    "bg-gradient-to-r from-purple-400 to-violet-500",
    "bg-gradient-to-r from-green-400 to-emerald-500",
  ];
  return classes[index % classes.length];
};

const getStatusIcon = (index: number) => {
  const icons = [
    ShoppingCartOutlined,
    SyncOutlined,
    StockOutlined,
    CheckCircleOutlined,
  ];
  return icons[index % icons.length];
};

const getFlowStepClass = (count: number, index: number) => {
  const status = statuses.value[index];
  if (status.count === 0 && status.label !== "Ordered") {
    return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
  }
  if (status.count > 0) {
    const classes = [
      "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
      "bg-gradient-to-r from-orange-400 to-red-500 text-white",
      "bg-gradient-to-r from-purple-400 to-violet-500 text-white",
      "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    ];
    return classes[index % classes.length];
  }
  return "bg-gray-200 text-gray-400";
};

const getDetailedDescription = (label: string, count: number) => {
  const descriptions = {
    Ordered: `Orders received and awaiting processing`,
    Processing:
      count === 0
        ? "Processing phase completed - ready for dispatch"
        : `Orders currently being prepared and packaged`,
    Dispatched:
      count === 0
        ? "Dispatch phase completed - all orders shipped"
        : `Orders shipped and in transit to customers`,
    Delivered: `Orders successfully delivered to customers`,
  };
  return descriptions[label as keyof typeof descriptions] || "";
};

onMounted(async () => {
  await fetchOrderTracking(timeRange.value);
});
</script>

<style scoped>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ant Design Select customization */
:deep(.ant-select-selector) {
  border-radius: 8px !important;
  border: 1px solid #d1d5db !important;
  box-shadow: none !important;
}

:deep(.ant-select-selector:hover) {
  border-color: #9ca3af !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
}
</style>
