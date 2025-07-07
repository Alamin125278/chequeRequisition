import { fetchChallanItemsService } from "@/services/challan/challan.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ChallanItem {
  accountNo: string;
  accountName: string;
  startNo: string;
  bookQty: number;
  leaves: number;
  endNo: string;
  chequeType: string;
  serverity: number;
  branchName: string;
}

export const useChallanItemStore = defineStore("challanItem", () => {
  const challanItems = ref<ChallanItem[]>([]);
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const loading = ref<boolean>(false);
  const challanId = ref<number>(0);
  const total = ref<number>(0);
  const fetchChallanItems = async () => {
    loading.value = true;
    try {
      const res = await fetchChallanItemsService({
        skip: skip.value,
        limit: limit.value,
        id: challanId.value,
      });
      console.log(res);

      challanItems.value = res.challanItems;
      total.value = res.totalCount;
    } catch (error) {
      console.error("Failed to fetch challan items:", error);
    } finally {
      loading.value = false;
    }
  };

  const setItemPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchChallanItems();
  };

  const setChallanId = (id: number) => {
    challanId.value = id;
    fetchChallanItems();
  };

  return {
    fetchChallanItems,
    setItemPagination,
    challanItems,
    skip,
    limit,
    setChallanId,
    loading,
    total,
  };
});
