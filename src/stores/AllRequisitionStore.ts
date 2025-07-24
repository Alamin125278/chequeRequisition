import { getBankForBranchService } from "@/services/bank/bank.service";
import { getBranchForUserService } from "@/services/branch/branch.service";
import { getAllRequisitionsService } from "@/services/requisition/requisition.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export interface AllRequisition {
  id: number;
  bankName: string;
  branchName: string;
  challanNumber: string;
  accountNo: string;
  accountName: string;
  receivingBranchName: string;
  routingNo: string;
  startNo: number;
  endNo: number;
  chequeType: string;
  leaves: number;
  bookQty: number;
  serverity: number;
  statusName: string;
  requestDate: string;
}
interface Branch {
  id: number;
  branchName: string;
}
interface Bank {
  id: number;
  bankName: string;
}
export const useAllRequisitionStore = defineStore("allRequisitions", () => {
  const allRequisitions = ref<AllRequisition[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);

  const search = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const bank = ref<number | null>(null);
  const branch = ref<number | null>(null);
  const severity = ref<number | null>(null);
  const status = ref<number | null>(null);
  const startDate = ref<string>("");
  const branches = ref<Branch[]>([]);
  const banks = ref<Bank[]>([]);

  const fetchAllRequisitions = async () => {
    loading.value = true;
    try {
      const result = await getAllRequisitionsService({
        search: search.value,
        skip: skip.value,
        limit: limit.value,
        bankId: bank.value ?? undefined,
        branchId: branch.value ?? undefined,
        severity: severity.value ?? undefined,
        requestDate: startDate.value ?? undefined,
        status: status.value ?? undefined,
      });
      allRequisitions.value = result.data;
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
        branches.value = result;
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
    fetchAllRequisitions();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchAllRequisitions();
  };
  const setBank = (bankId: number) => {
    if (bankId != null && bankId != undefined && bankId != 0) {
      bank.value = bankId;
    } else {
      bank.value = null;
    }
    branch.value = null;
    skip.value = 0;
    if (bankId != null) {
      featchBranches(bankId);
    }
    fetchAllRequisitions();
  };
  const setBranch = (branchId: number) => {
    if (branchId != null && branchId != undefined && branchId != 0) {
      branch.value = branchId;
    } else {
      branch.value = null;
    }
    skip.value = 0;
    fetchAllRequisitions();
  };

  const setSeverity = (severityId: number) => {
    if (severityId != null && severityId != undefined && severityId != 0) {
      severity.value = severityId;
    } else {
      severity.value = null;
    }
    skip.value = 0;
    fetchAllRequisitions();
  };
  const setStatus = (statusId: number) => {
    if (statusId != null && statusId != undefined && statusId != 0) {
      status.value = statusId;
    } else {
      status.value = null;
    }
    skip.value = 0;
    fetchAllRequisitions();
  };
  const setRequestDate = (requestDate: string) => {
    if (requestDate != null && requestDate != undefined && requestDate != "") {
      const dateObj = new Date(requestDate);
      const formattedDate = dateObj.toISOString().split("T")[0]; // yyyy-MM-dd format
      startDate.value = formattedDate;
      // (startDate.value = requestDate?.[0]?.format("YYYY-MM-DD")),
      //   (endDate.value = requestDate?.[1]?.format("YYYY-MM-DD")),
    } else {
      startDate.value = "";
    }
    skip.value = 0;
    fetchAllRequisitions();
  };
  const setChallanNo = (challanNo: string) => {
    search.value = challanNo;
    skip.value = 0;
    fetchAllRequisitions();
  };

  const resetFilters = () => {
    search.value = "";
    bank.value = null;
    severity.value = null;
    status.value = null;
    skip.value = 0;
    limit.value = 10;
    branch.value = null;
    startDate.value = "";
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

      fetchAllRequisitions();
    } catch (e) {
      console.error("Error fetching banks", e);
    } finally {
      loading.value = false;
    }
  };

  return {
    branches,
    banks,
    fetchAllRequisitions,
    featchBanks,
    bank,
    allRequisitions,
    total,
    loading,
    search,
    skip,
    limit,
    setSearch,
    setPagination,
    setBank,
    setSeverity,
    setRequestDate,
    setChallanNo,
    setBranch,
    resetFilters,
    setStatus,
  };
});
