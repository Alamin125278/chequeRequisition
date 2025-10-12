import { getBankForBranchService } from "@/services/bank/bank.service";
import type { Bank } from "@/types/order";
import { ref } from "vue";

export const useBanks = () => {
  const banks = ref<Bank[]>([]);
  const loading = ref(false);

  const fetchBanks = async () => {
    loading.value = true;
    try {
      const result = await getBankForBranchService();
      banks.value = result;
    } catch (error) {
      console.error("Error fetching banks", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    banks,
    loading,
    fetchBanks,
  };
};
