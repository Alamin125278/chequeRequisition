<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1 text-secondary">
      {{ label }}
    </label>
    <a-select
      v-model:value="modelValue"
      :placeholder="placeholder"
      class="w-full"
      :allow-clear="allowClear"
      :options="options"
      @change="handleChange"
      v-bind="$attrs"
    >
      <template v-if="!options">
        <slot />
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import type { SelectProps } from "ant-design-vue";
import { computed } from "vue";

interface Props {
  modelValue?: any;
  label?: string;
  placeholder?: string;
  allowClear?: boolean;
  options?: SelectProps["options"];
}

interface Emits {
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  allowClear: true,
  placeholder: "Select option",
});

const emit = defineEmits<Emits>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleChange = (value: any) => {
  emit("change", value);
};
</script>

<style scoped>
:deep(.ant-select-selector) {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

:deep(.ant-select-selector:hover) {
  border-color: #3b82f6 !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}
</style>
