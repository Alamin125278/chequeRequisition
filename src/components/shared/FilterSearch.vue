<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1 text-secondary">
      {{ label }}
    </label>
    <a-input-search
      v-model:value="modelValue"
      :placeholder="placeholder"
      class="w-full"
      :allow-clear="allowClear"
      @search="handleSearch"
      @change="handleChange"
      v-bind="$attrs"
    >
      <template #prefix>
        <SearchOutlined class="text-secondary" />
      </template>
    </a-input-search>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  allowClear?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
  (e: "change", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  allowClear: true,
  placeholder: "Search...",
});

const emit = defineEmits<Emits>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value !== undefined) {
      emit("update:modelValue", value);
    }
  },
});

const handleSearch = (value: string) => {
  emit("search", value);
};

const handleChange = (e: any) => {
  emit("change", e.target?.value || "");
};
</script>

<style scoped>
:deep(.ant-input),
:deep(.ant-input-affix-wrapper) {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-affix-wrapper:hover) {
  border-color: #3b82f6 !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-focused),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}
</style>
