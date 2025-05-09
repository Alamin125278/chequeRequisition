<template>
  <div class="stat-card bg-white rounded-lg shadow-md p-6 flex items-center">
    <div class="icon-wrapper mr-4 rounded-full p-3" :class="iconBgColor">
      <component :is="icon" class="text-white text-xl" />
    </div>
    <div class="stat-content">
      <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
      <div class="flex items-end">
        <p class="text-2xl font-semibold">{{ value }}</p>
        <span 
          v-if="change !== undefined" 
          class="ml-2 text-sm font-medium" 
          :class="change >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
      </div>
      <p v-if="subtitle" class="text-gray-500 text-xs mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  iconBgColor: {
    type: String,
    default: 'bg-blue-500'
  },
  change: {
    type: Number,
    default: undefined
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
