import {
  checkIsLoggedInService,
  loginService,
} from "@/services/auth/auth.service";
import { removeAuthorizationTokenService } from "@/services/auth/token.service";
import { defineStore } from "pinia";
import { ref } from "vue";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string; // Only used for local match
  avatar: string;
  role: string;
}

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref<boolean>(false);
  const user = ref<User[] | null>(null);
  const errorMessage = ref("");

  const initializeFromStorage = () => {
    isLoggedIn.value = checkIsLoggedInService();
  };

  initializeFromStorage();

  const login = async (identifier: string, password: string) => {
    await loginService({ userNameOrEmail: identifier, password })
      .then(() => {
        isLoggedIn.value = true;
      })
      .catch((error: any) => {
        isLoggedIn.value = false;
        errorMessage.value = error?.message || "Login failed";
      });
  };

  const logout = () => {
    try {
      removeAuthorizationTokenService();
    } catch (error) {
      console.error("Error during logout:", error);
      errorMessage.value = "Logout failed";
    }
  };

  // const permissions = computed(() => {
  //   return true;
  // });

  // const canAccess = (permission: string): boolean => {
  //   return true;
  // };

  return {
    isLoggedIn,
    login,
    logout,
    // permissions,
    // canAccess,
    errorMessage,
  };
});
