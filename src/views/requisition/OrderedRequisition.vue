<template>
  <div class="bg-background min-h-screen">
    <!-- Header Section -->

    <OrderHeader
      :has-applied-filters="hasAppliedFilters"
      :export-loading="exportButtonLoading"
      @export-preview="showExportPreview"
    />

    <!-- Main Content -->
    <div class="mx-auto py-6">
      <!-- Filter Section -->
      <OrderFilters
        :filters="filters"
        :banks="banks"
        @filter-change="handleFilterChange"
      />

      <!-- Table Section -->
      <OrderTable
        :data="orderRequisitionStore.orderRequisition"
        :loading="loading"
        :total="orderRequisitionStore.total"
        :columns="mainTableColumns"
        :pagination="pagination"
        @page-change="handlePagination"
      />
    </div>

    <!-- Export Preview Modal -->
    <ExportPreviewModal
      v-model:visible="exportModalVisible"
      :orders="orderRequisitionStore.orderRequisitionForExport"
      :loading="loading"
      :export-states="exportStates"
      :check-type-variations="checkTypeVariations"
      :completed-exports="completedExports"
      :total-required-exports="totalRequiredExports"
      :progress-percentage="progressPercentage"
      :all-exports-completed="allExportsCompleted"
      :challan-export-loading="challanExportLoading"
      @export-psi="handleExportPSI"
      @export-check-type="handleExportCheckType"
      @export-challan="handleExportChallan"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { computed, onMounted, ref, watchEffect } from "vue";

// Stores
import { useOrderRequisitionStore } from "@/stores/orderRequisitionStore";

// Composables
import { useBanks } from "@/composable/useBanks";
import { useOrderExport } from "@/composable/useOrderExport";

// Components
import ExportPreviewModal from "@/components/orders/ExportPreviewModal.vue";
import OrderFilters from "@/components/orders/OrderFilters.vue";
import OrderHeader from "@/components/orders/OrderHeader.vue";
import OrderTable from "@/components/orders/OrderTable.vue";
// Config
import { mainTableColumns } from "@/config/tableColumns";

// Types
import type { Filters } from "@/types/order";

// Store and Composables
const orderRequisitionStore = useOrderRequisitionStore();
const { banks, fetchBanks } = useBanks();
const {
  exportStates,
  checkTypeVariations,
  completedExports,
  totalRequiredExports,
  progressPercentage,
  allExportsCompleted,
  updateCheckTypeVariations,
  exportByCheckTypeAndPages,
  exportPSI,
  exportChallan,
  challanExportLoading,
  resetExportStates,
} = useOrderExport();

// Reactive State
const loading = ref(true);
const exportModalVisible = ref(false);

const filters = ref<Filters>({
  bank: undefined,
  accountNumber: undefined,
  severity: undefined,
  requestDate: undefined,
  agentType: undefined,
});

// Computed Properties
const pagination = computed(() => ({
  current:
    Math.floor(orderRequisitionStore.skip / orderRequisitionStore.limit) + 1,
  pageSize: orderRequisitionStore.limit,
  total: orderRequisitionStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Order Requisitions`,
}));

const hasAppliedFilters = computed(
  () => !!filters.value.bank && filters.value.agentType !== undefined
);

// Watch Effects
watchEffect(() => {
  if (orderRequisitionStore.orderRequisitionForExport.length > 0) {
    updateCheckTypeVariations(orderRequisitionStore.orderRequisitionForExport);
  }
});

// Lifecycle
onMounted(() => {
  initializeData();
});

// Methods
const initializeData = async () => {
  try {
    await Promise.all([
      orderRequisitionStore.fetchOrderRequisitions(),
      fetchBanks(),
    ]);
  } catch (error) {
    console.error("Error initializing data:", error);
    message.error("Failed to load data");
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (filterType: keyof Filters) => {
  const filterActions: Record<keyof Filters, () => void> = {
    bank: () => {
      filters.value.bank != null &&
        orderRequisitionStore.setBank(filters.value.bank);
    },
    accountNumber: () => {
      filters.value.accountNumber != null &&
        orderRequisitionStore.setSearch(filters.value.accountNumber);
    },
    severity: () => {
      filters.value.severity != null &&
        orderRequisitionStore.setSeverity(filters.value.severity);
    },
    requestDate: () => {
      filters.value.requestDate != null &&
        orderRequisitionStore.setRequestDate(filters.value.requestDate);
    },
    agentType: () => {
      filters.value.agentType != null &&
        orderRequisitionStore.setAgentType(filters.value.agentType);
    },
  };

  filterActions[filterType]?.();
};

const handlePagination = (p: any) => {
  orderRequisitionStore.setPagination(p.current, p.pageSize);
};
const exportButtonLoading = ref(false);
const showExportPreview = async () => {
  if (!hasAppliedFilters.value) {
    message.warning("Please apply filters first");
    return;
  }

  exportButtonLoading.value = true;
  try {
    await orderRequisitionStore.fetchOrderRequisitionsForExport();
    // await new Promise((resolve) => setTimeout(resolve, 100));

    const exportData = orderRequisitionStore.orderRequisitionForExport;

    if (!exportData || exportData.length === 0) {
      message.warning("No orders match the selected filters for export");
      return;
    }
    updateCheckTypeVariations(exportData);
    exportModalVisible.value = true;
  } catch (error) {
    console.error("Error showing export preview:", error);
    message.error("Failed to load export data");
  } finally {
    exportButtonLoading.value = false;
  }
};

const handleExportPSI = async () => {
  await exportPSI(orderRequisitionStore.orderRequisitionForExport);
};

const handleExportCheckType = async (type: string, pages: number) => {
  await exportByCheckTypeAndPages(
    type,
    pages,
    orderRequisitionStore.orderRequisitionForExport
  );
};

const handleExportChallan = async () => {
  if (!allExportsCompleted.value) {
    message.warning("Please complete all exports before exporting challan");
    return;
  }

  const success = await exportChallan(
    orderRequisitionStore.orderRequisitionForExport
  );

  if (success) {
    message.success("Challan exported successfully!");
    handleSubmit();
  }
};

const handleSubmit = () => {
  if (!allExportsCompleted.value) {
    message.warning("Please complete all exports before submitting");
    return;
  }

  resetExportStates();
  orderRequisitionStore.fetchOrderRequisitions();
  orderRequisitionStore.fetchOrderRequisitionsForExport();
  orderRequisitionStore.resetFilters();

  message.success(
    `Updated status of ${orderRequisitionStore.orderRequisitionForExport.length} orders to "Downloaded"`
  );
  exportModalVisible.value = false;
};

const handleCancel = () => {
  exportModalVisible.value = false;
};
</script>
