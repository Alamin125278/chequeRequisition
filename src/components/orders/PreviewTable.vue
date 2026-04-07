<template>
  <div class="bg-background p-4 rounded-md mb-6">
    <h3
      class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
    >
      Preview
    </h3>
    <a-table
      :columns="previewColumns"
      :data-source="data"
      :loading="loading"
      class="custom-table"
      :scroll="{ x: 1500 }"
      :pagination="false"
      :rowClassName="() => 'hover:bg-background'"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- Serial Number -->
        <template v-if="column.key === 'id'">
          {{ index + 1 }}
        </template>

        <!-- Severity Tag -->
        <template v-if="column.key === 'serverity'">
          <a-tag
            :color="getSeverityColor(record.serverity)"
            class="px-2 py-0.5 rounded-md text-xs font-medium"
          >
            {{ getSeverityText(record.serverity) }}
          </a-tag>
        </template>

        <!-- Status Tag -->
        <template v-if="column.key === 'statusName'">
          <a-tag
            color="success"
            class="px-2 py-0.5 rounded-md text-xs font-medium"
          >
            {{ record.statusName }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { previewColumns } from "@/config/tableColumns";
import type { OrderRequisition } from "@/types/order";

interface Props {
  data: OrderRequisition[];
  loading: boolean;
}

defineProps<Props>();

// Helper functions
const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1:
      return "error";
    case 2:
      return "warning";
    default:
      return "default";
  }
};

const getSeverityText = (severity: number) => {
  switch (severity) {
    case 1:
      return "Urgent";
    case 2:
      return "Normal";
    default:
      return "Unknown";
  }
};
</script>

<style scoped>
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: var(--background);
  font-weight: 600;
  color: var(--text-primary);
  padding: 16px;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  color: var(--text-primary);
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: var(--background);
}
</style>
