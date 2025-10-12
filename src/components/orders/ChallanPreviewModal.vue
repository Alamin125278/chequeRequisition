<template>
  <a-modal
    v-model:visible="visible"
    title="Challan Preview"
    :width="980"
    :footer="null"
    class="requisition-modal"
    :closable="!exportLoading"
    :maskClosable="!exportLoading"
  >
    <div class="p-4">
      <!-- Header Section -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2 text-primary">
          Challan Preview by Receiving Branch
        </h3>
        <p class="text-secondary">
          {{ Object.keys(challanData).length }} receiving branches found
        </p>
      </div>

      <!-- Branch Sections -->
      <div v-for="(orders, branch) in challanData" :key="branch" class="mb-8">
        <!-- Branch Header -->
        <div class="bg-background p-4 rounded-md mb-3">
          <h4 class="text-base font-medium mb-2 text-primary">
            {{ branch }}
          </h4>
          <p class="text-secondary">{{ orders.length }} orders</p>
        </div>

        <!-- Branch Table -->
        <a-table
          :columns="challanColumns"
          :data-source="orders"
          :pagination="false"
          row-key="id"
          class="custom-table mb-4"
          size="small"
        >
          <template #bodyCell="{ column, record, index }">
            <!-- Serial Number -->
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>

            <!-- Books x Leaves -->
            <template v-if="column.key === 'booksXleaves'">
              {{ record.bookQty }} x {{ record.leaves }}
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
          </template>
        </a-table>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
      >
        <a-button @click="$emit('cancel')" :disabled="exportLoading">
          Cancel
        </a-button>
        <a-button
          type="primary"
          @click="$emit('confirm-export')"
          :loading="exportLoading"
          :disabled="exportLoading"
          class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
        >
          <template #icon>
            <DownloadOutlined v-if="!exportLoading" />
          </template>
          {{ exportLoading ? "Exporting..." : "Confirm Export" }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { challanColumns } from "@/config/tableColumns";
import type { OrderRequisition } from "@/types/order";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";

interface Props {
  visible: boolean;
  challanData: Record<string, OrderRequisition[]>;
  exportLoading?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "cancel"): void;
  (e: "confirm-export"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

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
