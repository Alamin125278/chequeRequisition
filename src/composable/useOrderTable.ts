import { useOrderRequisitionStore } from "@/stores/orderRequisitionStore";
import type { Filters, Pagination } from "@/types/order";
import { computed, ref, watchEffect } from "vue";

export const useOrderTable = () => {
  const orderRequisitionStore = useOrderRequisitionStore();

  const loading = ref(true);
  const localFilters = ref<Filters>({
    bank: undefined,
    accountNumber: undefined,
    severity: undefined,
    requestDate: undefined,
    agentType: undefined,
  });

  // Pagination
  const pagination = computed<Pagination>(() => ({
    current:
      Math.floor(orderRequisitionStore.skip / orderRequisitionStore.limit) + 1,
    pageSize: orderRequisitionStore.limit,
    total: orderRequisitionStore.total,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total: number) => `Total ${total} Order Requisitions`,
  }));

  // Filter validation
  const hasAppliedFilters = computed(() => {
    return (
      !!localFilters.value.bank && localFilters.value.agentType !== undefined
    );
  });

  // Filter change handler
  const handleFilterChange = (filterType: keyof Filters) => {
    const filterActions: Record<keyof Filters, () => void> = {
      bank: () =>
        localFilters.value.bank != null &&
        orderRequisitionStore.setBank(localFilters.value.bank),
      accountNumber: () => {
        localFilters.value.accountNumber != null &&
          orderRequisitionStore.setSearch(localFilters.value.accountNumber);
      },
      severity: () => {
        localFilters.value.severity != null &&
          orderRequisitionStore.setSeverity(localFilters.value.severity);
      },
      requestDate: () => {
        localFilters.value.requestDate != null &&
          orderRequisitionStore.setRequestDate(localFilters.value.requestDate);
      },
      agentType: () => {
        localFilters.value.agentType != null &&
          orderRequisitionStore.setAgentType(localFilters.value.agentType);
      },
      courier: () => {
        localFilters.value.courier != null &&
          orderRequisitionStore.setCourier(localFilters.value.courier);
      },
    };

    filterActions[filterType]?.();
  };

  // Pagination handler
  const handlePagination = (p: any) => {
    orderRequisitionStore.setPagination(p.current, p.pageSize);
  };

  // Reset filters
  const resetFilters = () => {
    localFilters.value = {
      bank: undefined,
      accountNumber: undefined,
      severity: undefined,
      requestDate: undefined,
      agentType: undefined,
    };
    orderRequisitionStore.resetFilters();
  };

  // Initialize data
  const initializeData = async () => {
    loading.value = true;
    try {
      await orderRequisitionStore.fetchOrderRequisitions();
    } catch (error) {
      console.error("Error initializing order table data:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Watch for store changes
  watchEffect(() => {
    // Sync local filters with store state if needed
    // This ensures the UI reflects the current filter state
  });

  return {
    // State
    loading,
    filters: localFilters,

    // Computed
    pagination,
    hasAppliedFilters,
    orders: computed(() => orderRequisitionStore.orderRequisition),
    totalOrders: computed(() => orderRequisitionStore.total),

    // Methods
    handleFilterChange,
    handlePagination,
    resetFilters,
    initializeData,

    // Store access (if needed externally)
    store: orderRequisitionStore,
  };
};
