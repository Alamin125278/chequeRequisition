<template>
  <div class="mb-6 pb-4 border-b border-gray-100">
    <h3
      class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
    >
      Export by Cheque Type
    </h3>
    <div class="flex flex-wrap gap-3">
      <a-button
        v-for="variation in checkTypeVariations"
        :key="`${variation.accFlag ? variation.accFlag : variation.type}-${variation.pages}`"
        @click="
          $emit(
            'export-check-type',
            variation.type ?? '',
            variation.pages,
            variation.accFlag ?? '',
          )
        "
        :loading="variation.loading"
        :disabled="variation.completed || variation.loading"
        size="middle"
        :class="getButtonClass(variation)"
      >
        <template #icon>
          <LoadingOutlined v-if="variation.loading" />
          <CheckOutlined v-else-if="variation.completed" />
          <FileTextOutlined v-else />
        </template>
        <span>
          {{
            variation.loading
              ? "Exporting..."
              : variation.completed
                ? "Exported"
                : ""
          }}

          {{ variation.accFlag ? variation.accFlag : variation.type }}-{{
            variation.pages
          }}
        </span>
        <a-badge :count="variation.count" class="ml-2" />
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckTypeVariation } from "@/types/order";
import {
  CheckOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";

interface Props {
  checkTypeVariations: CheckTypeVariation[];
}

interface Emits {
  (e: "export-check-type", type: string, pages: number, accFlag?: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

const getButtonClass = (variation: CheckTypeVariation) => {
  return {
    "bg-green-500 border-green-500 text-black hover:bg-green-600 hover:border-green-600":
      variation.completed,
    "bg-blue-500 border-blue-500 text-black hover:bg-blue-600 hover:border-blue-600":
      !variation.completed && !variation.loading,
    "bg-gray-400 border-gray-400 cursor-not-allowed": variation.loading,
  };
};
</script>
