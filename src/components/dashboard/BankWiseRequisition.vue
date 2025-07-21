<template>
  <!-- Main Dashboard Grid -->
  <div class="space-y-10">
    <!-- Beautiful Chart Section -->
    <div>
      <div
        class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-700"
      >
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            Bank-wise Requisition Analysis
          </h2>
          <p class="text-gray-600 text-lg">
            Performance overview across all banking partners
          </p>
        </div>

        <div class="chart-container relative">
          <Bar :data="elegantChartData" :options="elegantChartOptions" />
        </div>

        <!-- Chart Legend -->
        <div
          class="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-100"
        >
          <div
            v-for="bank in banks"
            :key="bank.bankName"
            class="flex items-center space-x-3 group cursor-pointer"
          >
            <div
              class="w-4 h-4 rounded-full transition-transform group-hover:scale-125"
              :class="getLegendColorClass(bank.bankName)"
            ></div>
            <span
              class="text-gray-700 font-medium group-hover:text-gray-900 transition-colors"
            >
              {{ bank.bankName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Elegant Insights Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Summary Card -->
      <div
        class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-700"
      >
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Summary</h3>

        <!-- Total Requisitions -->
        <div
          class="text-center mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
        >
          <div class="text-4xl font-bold text-blue-600 mb-2">
            {{ totalRequisitions }}
          </div>
          <div class="text-blue-700 font-semibold text-lg">
            Total Requisitions
          </div>
          <div class="text-blue-500 text-sm mt-2">Across all banks</div>
        </div>

        <!-- Top Performer -->
        <div
          class="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <div
                class="text-emerald-600 text-sm font-semibold uppercase tracking-wide mb-1"
              >
                Top Performer
              </div>
              <div class="text-gray-900 font-bold text-xl">
                {{ topBank.bankName }}
              </div>
              <div class="text-emerald-600 text-sm mt-1">
                Leading with {{ getMarketShare(topBank.totalRequisitions) }}%
                share
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-emerald-600">
                {{ topBank.totalRequisitions }}
              </div>
              <div
                class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mt-2"
              >
                <TrophyOutlined class="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        <!-- Average Performance -->
        <div
          class="mb-8 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100"
        >
          <div class="text-center">
            <div
              class="text-purple-600 text-sm font-semibold uppercase tracking-wide mb-2"
            >
              Average Performance
            </div>
            <div class="text-3xl font-bold text-purple-600">
              {{ averageRequisitions }}
            </div>
            <div class="text-purple-500 text-sm mt-1">
              Requisitions per bank
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Ranking -->
      <div
        class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-700"
      >
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          Performance Ranking
        </h3>

        <div class="space-y-4">
          <div
            v-for="(bank, index) in sortedBanks"
            :key="bank.bankName"
            class="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white"
                :class="getRankingBgClass(bank.bankName)"
              >
                {{ index + 1 }}
              </div>
              <div>
                <div
                  class="text-gray-900 font-semibold text-lg group-hover:text-gray-700 transition-colors"
                >
                  {{ bank.bankName }}
                </div>
                <div class="text-gray-500 text-sm">
                  {{ getMarketShare(bank.totalRequisitions) }}% market share
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-gray-900 font-bold text-xl">
                {{ bank.totalRequisitions }}
              </div>
              <div class="flex items-center justify-end mt-1">
                <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    class="h-2 rounded-full transition-all duration-1000"
                    :class="getProgressBarClass(bank.bankName)"
                    :style="{
                      width: `${(bank.totalRequisitions / maxTotal) * 100}%`,
                    }"
                  ></div>
                </div>
                <span class="text-gray-500 text-xs"
                  >{{
                    Math.round((bank.totalRequisitions / maxTotal) * 100)
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getBankRequisitions,
  type BankRequisition,
} from "@/services/dashboard/dashboard.service";
import { TrophyOutlined } from "@ant-design/icons-vue";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { computed, onMounted, ref } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const banks = ref<BankRequisition[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchBanks() {
  try {
    isLoading.value = true;
    banks.value = await getBankRequisitions();
    console.log(banks.value);
  } catch (err) {
    error.value = "Failed to load requisitions.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
// Computed properties
const totalRequisitions = computed(() =>
  banks.value.reduce(
    (sum: number, bank: BankRequisition) => sum + bank.totalRequisitions,
    0
  )
);
const topBank = computed(() =>
  banks.value.reduce(
    (max, bank) =>
      bank.totalRequisitions > max.totalRequisitions ? bank : max,
    {
      bankName: "",
      totalRequisitions: 0,
    }
  )
);

const averageRequisitions = computed(() =>
  Math.round(totalRequisitions.value / banks.value.length)
);
const sortedBanks = computed(() =>
  [...banks.value]
    .sort((a, b) => b.totalRequisitions - a.totalRequisitions)
    .slice(0, 5)
);
const maxTotal = computed(() =>
  Math.max(...banks.value.map((b) => b.totalRequisitions))
);

function calculateMaxAndStep(data: number[]) {
  const max = Math.max(...data, 0);
  const paddedMax = Math.ceil(max * 1.1);

  let step = 10;
  if (paddedMax > 100) {
    step = 50;
  } else if (paddedMax > 50) {
    step = 20;
  }

  // Step size যেন max এর exact divisor হয় না তার জন্য চাইলে round করে nearest step নিন
  const roundedMax = Math.ceil(paddedMax / step) * step;

  return { max: roundedMax, step };
}

// Elegant Chart Configuration
const elegantChartData = computed(() => ({
  labels: banks.value.map((b) => b.bankName),
  datasets: [
    {
      label: "Requisitions",
      data: banks.value.map((b) => b.totalRequisitions),
      backgroundColor: [
        "rgba(99, 102, 241, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
      borderColor: [
        "rgb(99, 102, 241)",
        "rgb(16, 185, 129)",
        "rgb(245, 158, 11)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 3,
      borderRadius: 16,
      borderSkipped: false,
      hoverBackgroundColor: [
        "rgba(99, 102, 241, 0.95)",
        "rgba(16, 185, 129, 0.95)",
        "rgba(245, 158, 11, 0.95)",
        "rgba(239, 68, 68, 0.95)",
      ],
      hoverBorderWidth: 4,
    },
  ],
}));

const elegantChartOptions = computed(() => {
  const totals = banks.value.map((b) => b.totalRequisitions || 0);
  const { step, max } = calculateMaxAndStep(totals);

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(156, 163, 175, 0.3)",
        borderWidth: 1,
        cornerRadius: 16,
        displayColors: false,
        titleFont: { size: 16, weight: 600 },
        bodyFont: { size: 14, weight: 500 },
        padding: 16,
        callbacks: {
          title: (context: any) => `${context[0].label}`,
          label: (context: any) => `${context.parsed.y} Requisitions`,
          afterLabel: (context: any) =>
            `${((context.parsed.y / totalRequisitions.value) * 100).toFixed(
              1
            )}% of total`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          font: { size: 14, weight: 600 },
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        max,
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
          drawBorder: false,
        },
        ticks: {
          stepSize: step,
          color: "#6b7280",
          font: { size: 13, weight: 500 },
          padding: 10,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 16,
      },
    },
  };
});

// 🎨 Ranking Background Color Classes
const rankingBgClasses = [
  "bg-gradient-to-r from-yellow-400 to-orange-500",
  "bg-gradient-to-r from-gray-400 to-gray-600",
  "bg-gradient-to-r from-amber-600 to-amber-700",
  "bg-gradient-to-r from-slate-500 to-slate-600",
  "bg-gradient-to-r from-indigo-500 to-indigo-700",
  "bg-gradient-to-r from-lime-400 to-lime-600",
  "bg-gradient-to-r from-pink-400 to-pink-600",
  "bg-gradient-to-r from-cyan-500 to-cyan-700",
];

// 📊 Progress Bar Color Classes
const progressBarClasses = [
  "bg-gradient-to-r from-indigo-400 to-indigo-600",
  "bg-gradient-to-r from-emerald-400 to-emerald-600",
  "bg-gradient-to-r from-amber-400 to-amber-600",
  "bg-gradient-to-r from-red-400 to-red-600",
  "bg-gradient-to-r from-teal-400 to-teal-600",
  "bg-gradient-to-r from-pink-400 to-pink-600",
  "bg-gradient-to-r from-lime-400 to-lime-600",
  "bg-gradient-to-r from-purple-500 to-purple-700",
];

const legendClasses = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-purple-500",
];

// Helper functions
const getLegendColorClass = (bankName: string) => {
  const index = banks.value.findIndex((b) => b.bankName === bankName);
  return legendClasses[index % rankingBgClasses.length];
};

const getRankingBgClass = (bankName: string) => {
  const index = sortedBanks.value.findIndex((b) => b.bankName === bankName);
  return rankingBgClasses[index % rankingBgClasses.length];
};

const getProgressBarClass = (bankName: string) => {
  const index = sortedBanks.value.findIndex((b) => b.bankName === bankName);
  return progressBarClasses[index % progressBarClasses.length];
};

const getMarketShare = (total: number) =>
  ((total / totalRequisitions.value) * 100).toFixed(1);

onMounted(async () => {
  await fetchBanks();
});
</script>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
}

/* Smooth transitions for all elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced hover effects */
.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

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
</style>
