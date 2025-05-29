// stores/bankStore.ts
import { getBankService } from "@/services/bank/bank.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Bank {
  id: number;
  vendorName: string;
  bankName: string;
  bankCode: string;
  routingNumber: string;
  bankEmail: string;
  bankPhone: string;
  bankAddress: string;
  status: boolean;
}

export const useBankStore = defineStore("bank", () => {
  const banks = ref<Bank[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);

  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);

  const fetchBanks = async () => {
    loading.value = true;
    try {
      const result = await getBankService({
        search: search.value,
        status: status.value,
        skip: skip.value,
        limit: limit.value,
      });
      banks.value = result.data;
      total.value = result.total;
    } catch (e) {
      console.error("Error fetching banks", e);
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (text: string) => {
    console.log(text);
    search.value = text;
    skip.value = 0;
    fetchBanks();
  };

  const setStatus = (value: string) => {
    status.value = value;
    skip.value = 0;
    fetchBanks();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchBanks();
  };

  return {
    banks,
    total,
    loading,
    search,
    status,
    skip,
    limit,
    fetchBanks,
    setSearch,
    setStatus,
    setPagination,
  };
});
