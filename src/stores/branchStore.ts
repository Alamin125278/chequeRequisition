import { getBranchesService } from "@/services/branch/branch.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Branch {
  id: number;
  bankName: string;
  branchName: string;
  branchCode: string;
  RoutingNo: string;
  branchEmail: string;
  branchPhone: string;
  branchAddress: string;
  status: boolean;
}

export const useBranchStore = defineStore("branch", () => {
  const branches = ref<Branch[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);
  const bank = ref<number | null>(null);
  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);

  const fetchBranches = async () => {
    loading.value = true;
    try {
      const result = await getBranchesService({
        search: search.value,
        status: status.value,
        bankId: bank.value ?? undefined,
        skip: skip.value,
        limit: limit.value,
      });
      branches.value = result.data;
      total.value = result.total;
    } catch (e) {
      console.error("Error fetching branchs", e);
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (text: string) => {
    search.value = text;
    skip.value = 0;
    fetchBranches();
  };

  const setStatus = (value: string) => {
    status.value = value;
    skip.value = 0;
    fetchBranches();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    alert(currentPage);
    skip.value = (currentPage - 1) * pageSize;
    fetchBranches();
  };
  const setBanks = (bankId: number) => {
    if (bankId != null && bankId != undefined && bankId != 0) {
      bank.value = bankId;
    } else {
      bank.value = null;
    }
    skip.value = 0;
    fetchBranches();
  };

  return {
    branches,
    total,
    loading,
    search,
    status,
    bank,
    skip,
    limit,
    fetchBranches,
    setSearch,
    setStatus,
    setPagination,
    setBanks,
  };
});
