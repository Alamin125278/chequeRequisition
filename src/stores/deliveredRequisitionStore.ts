import { getBankForBranchService } from "@/services/bank/bank.service";
import { getBranchForUserService } from "@/services/branch/branch.service";
import { getDispatchRequisitionsService } from "@/services/requisition/DispatchRequsiition.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export interface DeliveredRequisition {
  id: number;
  bankName: string;
  challanNo: string;
  accountNo: string;
  accountName: string;
  branchName: string;
  receivingBranchName: string;
  startNo: number;
  endNo: number;
  chequePrefix: string;
  bookQty: number;
  serverity: number;
  statusName: string;
  requestDate: string;
  challanNumber: string;
}
interface Branch {
  id: number;
  branchName: string;
}
interface Bank {
  id: number;
  bankName: string;
}
export const useDeliveredRequisitionStore = defineStore(
  "deliveredRequisition",
  () => {
    const deliveredRequisition = ref<DeliveredRequisition[]>([]);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);

    const search = ref<string>("");
    const skip = ref<number>(0);
    const status = ref<number>(6);
    const limit = ref<number>(10);
    const bank = ref<number | null>(null);
    const branch = ref<number | null>(null);
    const severity = ref<number | null>(null);
    const reDate = ref<string>("");
    const branches = ref<Branch[]>([]);
    const banks = ref<Bank[]>([]);

    const fetchDeliveredRequisitions = async () => {
      loading.value = true;
      try {
        const result = await getDispatchRequisitionsService({
          search: search.value,
          skip: skip.value,
          limit: limit.value,
          bankId: bank.value ?? undefined,
          branchId: branch.value ?? undefined,
          severity: severity.value ?? undefined,
          requestDate: reDate.value ?? undefined,
          status: status.value ?? undefined,
        });
        deliveredRequisition.value = result.data;
        total.value = result.total;
      } catch (e) {
        console.error("Error fetching orderRequisitions", e);
      } finally {
        loading.value = false;
      }
    };

    const featchBranches = async (bankId: number) => {
      loading.value = true;
      try {
        if (bankId != null && bankId != undefined && bankId != 0) {
          const result = await getBranchForUserService(bankId);
          branches.value = [...result].sort((a, b) =>
            a.branchName.localeCompare(b.branchName),
          );
        }
      } catch (e) {
        console.error("Error fetching branches", e);
      } finally {
        loading.value = false;
      }
    };

    const setSearch = (text: string) => {
      search.value = text;
      skip.value = 0;
      fetchDeliveredRequisitions();
    };

    const setPagination = (currentPage: number, pageSize: number) => {
      limit.value = pageSize;
      skip.value = (currentPage - 1) * pageSize;
      fetchDeliveredRequisitions();
    };
    const setBank = (bankId: number) => {
      if (bankId != null && bankId != undefined && bankId != 0) {
        bank.value = bankId;
      } else {
        bank.value = null;
      }
      branch.value = null;
      skip.value = 0;
      fetchDeliveredRequisitions();
      if (bankId != null) {
        featchBranches(bankId);
      }
    };
    const setBranch = (branchId: number) => {
      if (branchId != null && branchId != undefined && branchId != 0) {
        branch.value = branchId;
      } else {
        branch.value = null;
      }
      skip.value = 0;
      fetchDeliveredRequisitions();
    };

    const setSeverity = (severityId: number) => {
      if (severityId != null && severityId != undefined && severityId != 0) {
        severity.value = severityId;
      } else {
        severity.value = null;
      }
      skip.value = 0;
      fetchDeliveredRequisitions();
    };
    const setRequestDate = (requestDate: string) => {
      const dateObj = new Date(requestDate);
      const formattedDate = dateObj.toISOString().split("T")[0]; // yyyy-MM-dd format
      reDate.value = formattedDate;
      skip.value = 0;
      fetchDeliveredRequisitions();
    };
    const setChallanNo = (challanNo: string) => {
      search.value = challanNo;
      skip.value = 0;
      fetchDeliveredRequisitions();
    };

    const resetFilters = () => {
      search.value = "";
      bank.value = null;
      severity.value = null;
      skip.value = 0;
      limit.value = 10;
      branch.value = null;
      reDate.value = "";
    };
    //Get the banks from the database
    loading.value = true;
    const featchBanks = async () => {
      try {
        const result = await getBankForBranchService();
        banks.value = result;
        if (result.length === 1) {
          var bankId = result[0].id;
          bank.value = bankId;
          featchBranches(bankId);
        }

        fetchDeliveredRequisitions();
        // }
      } catch (e) {
        console.error("Error fetching banks", e);
      } finally {
        loading.value = false;
      }
    };

    return {
      branches,
      banks,
      featchBanks,
      bank,
      deliveredRequisition,
      total,
      loading,
      search,
      skip,
      limit,
      fetchDeliveredRequisitions,
      setSearch,
      setPagination,
      setBank,
      setSeverity,
      setRequestDate,
      setChallanNo,
      setBranch,
      resetFilters,
    };
  },
);
