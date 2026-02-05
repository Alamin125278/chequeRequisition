import { getBranchForUserService } from "@/services/branch/branch.service";
import { getDownlaodedRequisitionsService } from "@/services/requisition/DownloadRequisition.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export interface PendingRequisition {
  id: number;
  bankName: string;
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
export const usePendingRequisitionStore = defineStore(
  "pendingRequisition",
  () => {
    const pendingRequisition = ref<PendingRequisition[]>([]);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);

    const search = ref<string>("");
    const skip = ref<number>(0);
    const status = ref<number>(3);
    const limit = ref<number>(10);
    const bank = ref<number | null>(null);
    const branch = ref<number | null>(null);
    const severity = ref<number | null>(null);
    const reDate = ref<string>("");
    const branches = ref<Branch[]>([]);

    const fetchDownloadRequisitions = async () => {
      loading.value = true;
      try {
        const result = await getDownlaodedRequisitionsService({
          search: search.value,
          skip: skip.value,
          limit: limit.value,
          bankId: bank.value ?? undefined,
          branchId: branch.value ?? undefined,
          severity: severity.value ?? undefined,
          requestDate: reDate.value ?? undefined,
          status: status.value ?? undefined,
        });
        pendingRequisition.value = result.data;
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
      fetchDownloadRequisitions();
    };

    const setPagination = (currentPage: number, pageSize: number) => {
      limit.value = pageSize;
      skip.value = (currentPage - 1) * pageSize;
      fetchDownloadRequisitions();
    };
    const setBank = (bankId: number) => {
      if (bankId != null && bankId != undefined && bankId != 0) {
        bank.value = bankId;
      } else {
        bank.value = null;
      }
      branch.value = null;
      skip.value = 0;
      fetchDownloadRequisitions();
      featchBranches(bankId);
    };
    const setBranch = (branchId: number) => {
      if (branchId != null && branchId != undefined && branchId != 0) {
        branch.value = branchId;
      } else {
        branch.value = null;
      }
      branch.value = branchId;
      skip.value = 0;
      fetchDownloadRequisitions();
    };

    const setSeverity = (severityId: number) => {
      if (severityId != null && severityId != undefined && severityId != 0) {
        severity.value = severityId;
      } else {
        severity.value = null;
      }
      skip.value = 0;
      fetchDownloadRequisitions();
    };
    const setRequestDate = (requestDate: string) => {
      const dateObj = new Date(requestDate);
      const formattedDate = dateObj.toISOString().split("T")[0]; // yyyy-MM-dd format
      reDate.value = formattedDate;
      skip.value = 0;
      fetchDownloadRequisitions();
    };
    const setChallanNo = (challanNo: string) => {
      search.value = challanNo;
      skip.value = 0;
      fetchDownloadRequisitions();
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

    return {
      branches,
      bank,
      pendingRequisition,
      total,
      loading,
      search,
      skip,
      limit,
      fetchDownloadRequisitions,
      featchBranches,
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
