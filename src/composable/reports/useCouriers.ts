import { getCouriersForDropDownService } from "@/services/courier/courier.service";
import type { Courier } from "@/types/order";
import { ref } from "vue";

export const useCouriers = () => {
  const couriers = ref<Courier[]>([]);
  const loading = ref(false);

  const featchCouriers = async () => {
    try {
      const result = await getCouriersForDropDownService();
      couriers.value = result;
    } catch (e) {
      console.error("Error fetching couriers", e);
    }
  };

  return {
    couriers,
    loading,
    featchCouriers,
  };
};
