<template>
  <a-modal
    v-model:visible="visible"
    title="Export Preview"
    :width="1080"
    :footer="null"
    style="top: 20px"
    class="requisition-modal"
    :confirm-loading="modalLoading"
  >
    <div class="p-4">
      <!-- Loading State -->
      <div v-if="modalLoading" class="text-center py-8">
        <a-spin size="large" />
        <p class="mt-4 text-secondary">Loading export data...</p>
      </div>

      <!-- Content when not loading -->
      <div v-else>
        <!-- Progress Section -->
        <ProgressSection
          :completed-exports="completedExports"
          :total-required-exports="totalRequiredExports"
          :progress-percentage="progressPercentage"
          :all-exports-completed="allExportsCompleted"
        />

        <!-- Export Actions -->
        <ExportActions
          :export-states="exportStates"
          :all-exports-completed="allExportsCompleted"
          :challan-export-loading="challanExportLoading"
          @export-psi="handleExportPSI"
          @export-challan="handleExportChallan"
        />

        <!-- Check Type Export Buttons -->
        <CheckTypeExport
          :check-type-variations="checkTypeVariations"
          @export-check-type="handleExportCheckType"
        />

        <!-- Preview Table -->
        <PreviewTable :data="orders" :loading="loading" />

        <!-- Empty State -->
        <div
          v-if="!loading && orders.length === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">
            No orders found for export
          </p>
          <p class="text-secondary">
            Try adjusting your filters to see more results
          </p>
        </div>

        <!-- Submit Button (only show when there are orders) -->
        <div
          v-if="orders.length > 0"
          class="flex flex-wrap gap-3 justify-end border-t border-gray-100 pt-4 mt-6"
        >
          <a-button @click="handleCancel" :disabled="challanExportLoading">
            Cancel
          </a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="challanExportLoading"
            :disabled="!allExportsCompleted || challanExportLoading"
            class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
          >
            <template #icon>
              <CheckOutlined v-if="!challanExportLoading" />
            </template>
            {{ challanExportLoading ? "Processing..." : "Submit & Close" }}
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import CheckTypeExport from "@/components/orders/CheckTypeExport.vue";
import ExportActions from "@/components/orders/ExportActions.vue";
import PreviewTable from "@/components/orders/PreviewTable.vue";
import ProgressSection from "@/components/orders/ProgressSection.vue";
import type {
  CheckTypeVariation,
  ExportStates,
  OrderRequisition,
} from "@/types/order";
import { CheckOutlined, InboxOutlined } from "@ant-design/icons-vue";
import { computed, watch } from "vue";

interface Props {
  visible: boolean;
  orders: OrderRequisition[];
  loading: boolean;
  exportStates: ExportStates;
  checkTypeVariations: CheckTypeVariation[];
  completedExports: number;
  totalRequiredExports: number;
  progressPercentage: number;
  allExportsCompleted: boolean;
  challanExportLoading?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "export-psi"): void;
  (e: "export-check-type", type: string, pages: number): void;
  (e: "export-challan"): void;
  (e: "submit"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modalLoading = computed(() => props.loading || props.orders.length === 0);

const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

// যখন মোডাল খুলবে, তখন ডেটা রিফ্রেশ করতে সাহায্য করবে
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.orders.length === 0) {
      // মোডাল খুললে এবং ডেটা না থাকলে প্যারেন্টকে জানান
      console.log("Modal opened with empty data, might need refresh");
    }
  }
);

const handleExportPSI = () => {
  emit("export-psi");
};

const handleExportCheckType = (type: string, pages: number) => {
  emit("export-check-type", type, pages);
};

const handleExportChallan = () => {
  emit("export-challan");
};

const handleSubmit = () => {
  emit("submit");
};

const handleCancel = () => {
  emit("cancel");
};
</script>
