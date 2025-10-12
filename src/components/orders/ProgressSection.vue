<template>
  <div class="mb-6 bg-gray-50 rounded-md p-4">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-medium text-primary">Export Progress</h3>
      <span class="text-sm text-secondary">
        {{ completedExports }} of {{ totalRequiredExports }} completed
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        class="bg-blue-500 h-2 rounded-full transition-all duration-500"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <div class="text-sm text-gray-600">
      {{ progressPercentage }}% Complete
      <span v-if="!allExportsCompleted" class="ml-2 text-orange-600">
        - Complete all exports to enable Challan Preview
      </span>
      <span v-else class="ml-2 text-green-600">
        - Ready for Challan Preview
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  completedExports: number;
  totalRequiredExports: number;
  progressPercentage: number;
  allExportsCompleted: boolean;
}

defineProps<Props>();
</script>
