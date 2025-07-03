// src/composables/useAutoLogout.ts
import { useUserStore } from "@/stores/userStore";
import { onBeforeUnmount, onMounted } from "vue";

export const useAutoLogout = (timeoutMs: number = 3600000) => {
  const authStore = useUserStore();

  let timer: number;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      authStore.logout(); // 🔁 Logout from store
    }, timeoutMs);
  };

  const events = ["mousemove", "keydown", "click", "touchstart"];

  const start = () => {
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer(); // Initial call
  };

  const stop = () => {
    events.forEach((e) => window.removeEventListener(e, resetTimer));
    clearTimeout(timer);
  };

  onMounted(start);
  onBeforeUnmount(stop);
};
