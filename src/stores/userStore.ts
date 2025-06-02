import {
  checkIsLoggedInService,
  loginService,
} from "@/services/auth/auth.service";
import { removeAuthorizationTokenService } from "@/services/auth/token.service";
import { getUsersService } from "@/services/user/user.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  imagePath: string;
  role: number;
  roleName: string;
  bankId: number;
  branchId: number;
  vendorId: number;
  bankName: string;
  branchName: string;
  vendorName: string;
  isActive: boolean;
}

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const users = ref<User[]>([]);
  const total = ref<number>(0);
  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const role = ref<number | null>(null);
  const errorMessage = ref("");

  // Get all users
  const fetchUsers = async () => {
    loading.value = true;
    try {
      const result = await getUsersService({
        search: search.value,
        status: status.value,
        skip: skip.value,
        limit: limit.value,
        role: role.value ?? 0,
      });
      users.value = result.data;
      total.value = result.total;
    } catch (e) {
      console.error("Error fetching users", e);
    } finally {
      loading.value = false;
    }
  };

  // Set search
  const setSearch = (text: string) => {
    console.log(text);
    search.value = text;
    skip.value = 0;
    fetchUsers();
  };

  // Set status
  const setStatus = (value: string) => {
    status.value = value;
    skip.value = 0;
    fetchUsers();
  };
  // Set role
  const setRole = (value: number) => {
    role.value = value;
    skip.value = 0;
    fetchUsers();
  };

  // Set pagination
  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchUsers();
  };

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
    loading,
    errorMessage,
    isLoggedIn,
    login,
    logout,
    users,
    total,
    search,
    status,
    skip,
    limit,
    role,
    fetchUsers,
    setSearch,
    setStatus,
    setRole,
    setPagination,
  };
});
