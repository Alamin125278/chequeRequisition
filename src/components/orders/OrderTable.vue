<template>
  <div class="bg-card shadow-md rounded-md overflow-hidden">
    <div
      class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
    >
      <h3 class="text-lg font-medium text-primary">Order Requisitions</h3>
      <span class="text-sm text-secondary">{{ total }} orders found</span>
    </div>

    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="$emit('page-change', $event)"
      class="custom-table"
      :scroll="{ x: 1500 }"
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

        <!-- Agent Type Tag -->
        <template v-if="column.key === 'isAgent'">
          <a-tag
            :color="getAgentTypeColor(record.isAgent)"
            class="px-2 py-0.5 rounded-md text-xs font-medium"
          >
            {{ getAgentTypeText(record.isAgent) }}
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

    <!-- Empty State -->
    <div
      v-if="!loading && total === 0"
      class="text-center py-12 bg-background rounded-md"
    >
      <InboxOutlined
        style="font-size: 48px"
        class="text-secondary opacity-30"
      />
      <p class="mt-3 text-primary text-lg font-medium">No orders found</p>
      <p class="text-secondary">
        Try adjusting your filters to see more results
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderRequisition, Pagination } from "@/types/order";
import { InboxOutlined } from "@ant-design/icons-vue";
import type { TableColumnType } from "ant-design-vue";

interface Props {
  data: OrderRequisition[];
  loading: boolean;
  total: number;
  columns: TableColumnType[];
  pagination: Pagination;
}

interface Emits {
  (e: "page-change", pagination: any): void;
}

defineProps<Props>();
defineEmits<Emits>();

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

const getAgentTypeColor = (isAgent: boolean) => {
  return isAgent ? "error" : "success";
};

const getAgentTypeText = (isAgent: boolean) => {
  return isAgent ? "Agent" : "Non-Agent";
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
