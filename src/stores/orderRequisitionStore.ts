import {
  getOrderRequisitionsForExportService,
  getOrderRequisitionsService,
} from "@/services/requisition/orderRequisition.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export interface OrderRequisition {
  id: number;
  bankName: string;
  branchName: string;
  accountNo: string;
  accountName: string;
  chequeType: string;
  series: string;
  startNo: string;
  endNo: string;
  serverity: number;
  micrNo: string;
  transactionCode: number;
  leaves: number;
  chequePrefix: string;
  vendorId: number;
  bookQty: number;
  receivingBranchName: string;
  routingNo: string;
  reDate: string;
  statusName: string;
  cusAddress: string;
  agentNum?: string;
  isAgent: boolean;
}
export const useOrderRequisitionStore = defineStore("orderRequisition", () => {
  const orderRequisition = ref<OrderRequisition[]>([]);
  const orderRequisitionForExport = ref<OrderRequisition[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);

  const search = ref<string>("");
  const reDate = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const status = ref<number>(3);
  const bank = ref<number | null>(null);
  const severity = ref<number | null>(null);
  const agentType = ref<boolean | null>(null);

  const fetchOrderRequisitions = async () => {
    loading.value = true;
    try {
      const result = await getOrderRequisitionsService({
        search: search.value,
        skip: skip.value,
        limit: limit.value,
        BankId: bank.value ?? undefined,
        severity: severity.value ?? undefined,
        requestDate: reDate.value ?? undefined,
        status: status.value ?? undefined,
        isAgent: agentType.value ?? undefined,
      });
      orderRequisition.value = result.data;
      total.value = result.total;
    } catch (e) {
      console.error("Error fetching orderRequisitions", e);
    } finally {
      loading.value = false;
    }
  };
  const fetchOrderRequisitionsForExport = async () => {
    loading.value = true;
    try {
      const res = await getOrderRequisitionsForExportService({
        search: search.value,
        BankId: bank.value ?? undefined,
        severity: severity.value ?? undefined,
        requestDate: reDate.value ?? undefined,
        isAgent: agentType.value ?? undefined,
      });
      orderRequisitionForExport.value = res;
    } catch (e) {
      console.error("Error fetching orderRequisitions", e);
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (text: string) => {
    search.value = text;
    skip.value = 0;
    fetchOrderRequisitions();
  };
  const setAgentType = (Type: boolean) => {
    agentType.value = Type;
    skip.value = 0;
    fetchOrderRequisitions();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchOrderRequisitions();
  };
  const setBank = (bankId: number) => {
    bank.value = bankId;
    fetchOrderRequisitions();
  };

  const setSeverity = (severityId: number) => {
    severity.value = severityId;
    fetchOrderRequisitions();
  };
  const setRequestDate = (requestDate: string) => {
    const dateObj = new Date(requestDate);
    const formattedDate = dateObj.toISOString().split("T")[0]; // yyyy-MM-dd format
    reDate.value = formattedDate;
    fetchOrderRequisitions();
  };

  const resetFilters = () => {
    search.value = "";
    bank.value = null;
    severity.value = null;
    skip.value = 0;
    limit.value = 10;
  };

  return {
    orderRequisition,
    orderRequisitionForExport,
    total,
    loading,
    search,
    skip,
    limit,
    fetchOrderRequisitionsForExport,
    fetchOrderRequisitions,
    setSearch,
    setPagination,
    setBank,
    setSeverity,
    setRequestDate,
    resetFilters,
    setAgentType,
  };
});
