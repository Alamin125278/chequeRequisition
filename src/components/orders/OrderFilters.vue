<template>
  <div class="bg-card shadow-md rounded-md p-4 mb-6">
    <h3
      class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
    >
      Filter Orders Requisitions
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Bank Filter -->
      <div>
        <label class="block text-sm font-medium mb-1 text-secondary"
          >Bank</label
        >
        <a-select
          v-model:value="filters.bank"
          placeholder="Select Bank"
          class="w-full"
          @change="handleFilterChange('bank')"
          allowClear
        >
          <a-select-option
            v-for="option in banks"
            :key="option.id"
            :value="option.id"
          >
            {{ option.bankName }}
          </a-select-option>
        </a-select>
      </div>

      <!-- Agent Type Filter -->
      <div>
        <label class="block text-sm font-medium mb-1 text-secondary"
          >Select Type</label
        >
        <a-select
          v-model:value="filters.agentType"
          placeholder="Select Type"
          class="w-full"
          @change="handleFilterChange('agentType')"
          allowClear
        >
          <a-select-option :value="undefined">All Type</a-select-option>
          <a-select-option :value="true">Agent Type</a-select-option>
          <a-select-option :value="false">Non-Agent Type</a-select-option>
        </a-select>
      </div>

      <!-- Severity Filter -->
      <div>
        <label class="block text-sm font-medium mb-1 text-secondary"
          >Severity</label
        >
        <a-select
          v-model:value="filters.severity"
          placeholder="Select Severity"
          class="w-full"
          @change="handleFilterChange('severity')"
          allowClear
        >
          <a-select-option :value="1">Urgent</a-select-option>
          <a-select-option :value="2">Normal</a-select-option>
        </a-select>
      </div>

      <!-- Request Date Filter -->
      <div>
        <label class="block text-sm font-medium mb-1 text-secondary"
          >Request Date</label
        >
        <a-date-picker
          v-model:value="filters.requestDate"
          class="w-full"
          @change="handleFilterChange('requestDate')"
          placeholder="Select Date"
        />
      </div>

      <!-- Account Number Filter -->
      <div>
        <label class="block text-sm font-medium mb-1 text-secondary"
          >Account Number</label
        >
        <a-input-search
          v-model:value="filters.accountNumber"
          placeholder="Search orders..."
          class="w-full"
          @search="handleFilterChange('accountNumber')"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined class="text-secondary" />
          </template>
        </a-input-search>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bank, Filters } from "@/types/order";
import { SearchOutlined } from "@ant-design/icons-vue";

interface Props {
  filters: Filters;
  banks: Bank[];
}

interface Emits {
  (e: "filter-change", filterType: keyof Filters): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleFilterChange = (filterType: keyof Filters) => {
  emit("filter-change", filterType);
};
</script>
