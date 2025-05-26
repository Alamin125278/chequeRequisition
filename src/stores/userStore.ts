import {  checkIsLoggedInService, loginService } from "@/services/auth/auth.service";
import { removeAuthorizationTokenService } from "@/services/auth/token.service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string; // Only used for local match
  avatar: string;
  role: string;
}

const rolePermissionsMap: Record<string, string[]> = {
  "Vendor Admin": [
    "view-dashboard",
    "manage-users",
    "upload-requisition",
    "manage-banks",
    "view-requisitions",
    "all-requisitions",
    "ordered-requisitions",
    "downloaded-requisitions",
    "dispatched-requisitions",
    "delivered-requisitions",
    "view-reports",
    "all-challans",
    "view-settings",
    "manage-serial-no",
  ],
  "Bank Admin": [
    "view-dashboard",
    "manage-branches",
    "manage-users",
    "view-requisitions",
    "all-requisitions",
    "pending-requisitions",
    "approved-requisitions",
    "confirmed-delivery-requisitions",
    "delivered-requisitions",
    "view-reports",
    "all-challans",
    "view-settings",
  ],
  "Branch Officer": [
    "view-dashboard",
    "manage-users",
    "view-requisitions",
    "new-requisition",
    "all-requisitions",
    "pending-requisitions",
    "approved-requisitions",
    "confirmed-delivery-requisitions",
    "delivered-requisitions",
    "view-reports",
    "all-challans",
  ],
  "Branch User": [
    "view-dashboard",
    "view-requisitions",
    "new-requisition",
    "all-requisitions",
    "pending-requisitions",
  ],
};

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref<boolean>(false);
  const user = ref<User[] | null>(null);
  const errorMessage = ref("");

  const initializeFromStorage = () => {
    isLoggedIn.value = checkIsLoggedInService()
  };

  initializeFromStorage();

  const login = async(identifier: string, password: string) => {
    await loginService({ userNameOrEmail: identifier, password }).then(()=>{
        isLoggedIn.value = true;
      }).catch((error: any) => {
       isLoggedIn.value = false;
       errorMessage.value = error?.message || "Login failed";
      })  
  };

  const logout = () => {
    try{
      removeAuthorizationTokenService();
    }catch (error) {
      console.error('Error during logout:', error);
      errorMessage.value = 'Logout failed';
    }
  };

  const permissions = computed(() => {
    return true;
  });

  const canAccess = (permission: string): boolean => {
    return true;
  };

  return {
    isLoggedIn,
    login,
    logout,
    permissions,
    canAccess,
    errorMessage,
  };
});
