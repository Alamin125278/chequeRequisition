import { getBankForBranchService } from "@/services/bank/bank.service";
import { getBranchForUserService } from "@/services/branch/branch.service";
import { getAllChallanService } from "@/services/challan/challan.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export interface Challan {
  id: number;
  challanNumber: string;
  bankName: string;
  receivingBranchName: string;
  challanDate: string;
  courierName: string;
  requisitionCount: number;
}
interface Branch {
  id: number;
  branchName: string;
}
interface Bank {
  id: number;
  bankName: string;
}
export const useChallanStore = defineStore("challan", () => {
  const challans = ref<Challan[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);

  const search = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const bank = ref<number | null>(null);
  const branch = ref<number | null>(null);
  const chaDate = ref<string | null>(null);
  const branches = ref<Branch[]>([]);
  const banks = ref<Bank[]>([]);

  const fetchChallans = async () => {
    loading.value = true;
    try {
      const result = await getAllChallanService({
        search: search.value,
        skip: skip.value,
        limit: limit.value,
        bankId: bank.value ?? undefined,
        branchId: branch.value ?? undefined,
        challanDate: chaDate.value ?? undefined,
      });
      challans.value = result.challans;
      total.value = result.totalCount;
    } catch (e) {
      console.error("Error fetching challans", e);
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
        branches.value = result;
      }
    } catch (e) {
      console.error("Error fetching branches", e);
    } finally {
      loading.value = false;
    }
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchChallans();
  };
  const setBank = (bankId: number) => {
    if (bankId != null && bankId != undefined && bankId != 0) {
      bank.value = bankId;
    } else {
      bank.value = null;
    }
    branch.value = null;
    skip.value = 0;
    //   fetchDeliveredRequisitions();
    if (bankId != null) {
      featchBranches(bankId);
    }
    fetchChallans();
  };
  const setBranch = (branchId: number) => {
    if (branchId != null && branchId != undefined && branchId != 0) {
      branch.value = branchId;
    } else {
      branch.value = null;
    }
    branch.value = branchId;
    skip.value = 0;
    fetchChallans();
  };

  const setRequestDate = (requestDate: string | null) => {
    if (!requestDate) {
      // If date is cleared
      chaDate.value = null;
      skip.value = 0;
      fetchChallans();
      return;
    }

    const dateObj = new Date(requestDate);
    if (isNaN(dateObj.getTime())) {
      // Invalid date, treat as null
      chaDate.value = null;
    } else {
      const formattedDate = dateObj.toISOString().split("T")[0]; // yyyy-MM-dd
      chaDate.value = formattedDate;
    }

    skip.value = 0;
    fetchChallans();
  };

  const setChallanNo = (challanNo: string) => {
    search.value = challanNo;
    skip.value = 0;
    fetchChallans();
  };

  const resetFilters = () => {
    search.value = "";
    bank.value = null;
    skip.value = 0;
    limit.value = 10;
    branch.value = null;
    chaDate.value = "";
  };
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

      fetchChallans();
      // }
    } catch (e) {
      console.error("Error fetching banks", e);
    } finally {
      loading.value = false;
    }
  };

  return {
    branches,
    bank,
    banks,
    total,
    loading,
    search,
    skip,
    limit,
    challans,
    featchBanks,
    fetchChallans,
    setPagination,
    setBank,
    setRequestDate,
    setChallanNo,
    setBranch,
    resetFilters,
  };
});
