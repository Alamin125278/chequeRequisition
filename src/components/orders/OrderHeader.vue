<template>
  <div class="bg-card border-b border-gray-200">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-2">
              <FileTextOutlined class="h-6 w-6 text-white" />
            </div>
            <h1 class="ml-3 text-2xl font-semibold text-primary">
              <span class="text-blue-500">Ordered</span> Requisition Management
            </h1>
          </div>
          <p class="mt-2 text-sm text-secondary max-w-2xl">
            Manage and export your ordered cheque requisitions in one
            centralized dashboard.
          </p>
        </div>
        <div class="mt-4 md:mt-0 md:ml-4">
          <a-tooltip :title="exportButtonTooltip">
            <a-button
              type="primary"
              class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
              @click="$emit('export-preview')"
              :disabled="!hasAppliedFilters"
              :loading="exportLoading"
            >
              <template #icon><ExportOutlined /></template>
              {{ exportLoading ? "Loading..." : "Export Preview" }}
            </a-button>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportOutlined, FileTextOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";

interface Props {
  hasAppliedFilters: boolean;
  exportLoading?: boolean;
}

defineProps<Props>();
defineEmits<{
  "export-preview": [];
}>();

const exportButtonTooltip = computed(() => {
  return "Click to preview and export orders";
});
</script>
