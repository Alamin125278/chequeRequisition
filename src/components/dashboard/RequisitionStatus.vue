<template>
  <div class="requisition-status bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Requisition Status</h2>
      <a-select v-model:value="timeRange" style="width: 120px">
        <a-select-option value="week">This Week</a-select-option>
        <a-select-option value="month">This Month</a-select-option>
        <a-select-option value="quarter">This Quarter</a-select-option>
      </a-select>
    </div>
    <div class="status-chart">
      <div class="flex justify-between mb-6">
        <div v-for="(status, index) in statuses" :key="index" class="text-center">
          <div class="status-value text-2xl font-bold">{{ status.count }}</div>
          <div class="status-label text-sm text-gray-500">{{ status.label }}</div>
        </div>
      </div>
      <div class="progress-bars">
        <div v-for="(status, index) in statuses" :key="index" class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium">{{ status.label }}</span>
            <span class="text-sm text-gray-500">{{ status.percentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="h-2.5 rounded-full" :style="`width: ${status.percentage}%`" :class="status.color"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const timeRange = ref('month');

const statuses = [
  {
    label: 'Pending',
    count: 12,
    percentage: 40,
    color: 'bg-yellow-500'
  },
  {
    label: 'Approved',
    count: 18,
    percentage: 60,
    color: 'bg-green-500'
  },
  {
    label: 'Rejected',
    count: 3,
    percentage: 10,
    color: 'bg-red-500'
  },
  {
    label: 'Completed',
    count: 15,
    percentage: 50,
    color: 'bg-blue-500'
  }
];
</script>
