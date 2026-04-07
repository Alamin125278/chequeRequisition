<template>
  <div class="mb-6">
    <div class="flex flex-wrap gap-3 justify-between border-gray-100">
      <div class="flex flex-wrap gap-3">
        <!-- PSI Export Button -->
        <a-button
          type="primary"
          @click="$emit('export-psi')"
          :loading="exportStates.psi.loading"
          :disabled="exportStates.psi.completed || exportStates.psi.loading"
          :class="{
            'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600':
              exportStates.psi.completed,
            'bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600':
              !exportStates.psi.completed,
          }"
        >
          <template #icon>
            <CheckOutlined v-if="exportStates.psi.completed" />
            <FileExcelOutlined v-else-if="!exportStates.psi.loading" />
          </template>
          {{
            exportStates.psi.loading
              ? "Exporting..."
              : exportStates.psi.completed
              ? "PSI Exported"
              : "Export PSI"
          }}
        </a-button>

        <!-- Direct Challan Export Button -->
        <a-button
          type="primary"
          @click="$emit('export-challan')"
          :loading="challanExportLoading"
          :disabled="!allExportsCompleted || challanExportLoading"
          :class="{
            'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600':
              allExportsCompleted && !challanExportLoading,
            'bg-gray-400 border-gray-400 cursor-not-allowed':
              !allExportsCompleted,
          }"
        >
          <template #icon>
            <FileDoneOutlined v-if="!challanExportLoading" />
          </template>
          {{
            challanExportLoading
              ? "Exporting Challan..."
              : allExportsCompleted
              ? "Export Challan"
              : "Complete Exports First"
          }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExportStates } from "@/types/order";
import {
  CheckOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
} from "@ant-design/icons-vue";

interface Props {
  exportStates: ExportStates;
  allExportsCompleted: boolean;
  challanExportLoading?: boolean;
}

interface Emits {
  (e: "export-psi"): void;
  (e: "export-challan"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
