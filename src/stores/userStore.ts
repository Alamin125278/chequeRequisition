import {
  checkIsLoggedInService,
  loginService,
} from "@/services/auth/auth.service";
import { removeAuthorizationTokenService } from "@/services/auth/token.service";
import {
  getLoggedInUserService,
  getUsersService,
} from "@/services/user/user.service";
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
  const currentUser = ref<User | null>(null);
  const total = ref<number>(0);
  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const role = ref<number | null>(null);
  const errorMessage = ref("");
  // Current User Set
  const setCurrentUser = (user: User) => {
    currentUser.value = user;
    isLoggedIn.value = true;
  };
  // reset current user
  const clearCurrentUser = () => {
    currentUser.value = null;
    isLoggedIn.value = false;
  };
  // Featch user Info
  const fetchCurrentUser = async () => {
    try {
      const response = await getLoggedInUserService();
      if (response.status === 200) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching current user info:", error);
      clearCurrentUser();
    }
  };
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
    try {
      await loginService({ userNameOrEmail: identifier, password });
      isLoggedIn.value = true;

      // লগইন সফল হলে user info ফেচ করুন
      await fetchCurrentUser();
    } catch (error: any) {
      isLoggedIn.value = false;
      errorMessage.value = error?.message || "Login failed";
    }
  };

  const logout = () => {
    try {
      removeAuthorizationTokenService();
      clearCurrentUser();
    } catch (error) {
      console.error("Error during logout:", error);
      errorMessage.value = "Logout failed";
    }
  };
  const isInitialized = ref(false);

  if (!isInitialized.value) {
    fetchCurrentUser();
    isInitialized.value = true;
  }

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
    currentUser,
    setCurrentUser,
    clearCurrentUser,
    fetchCurrentUser,
    fetchUsers,
    setSearch,
    setStatus,
    setRole,
    setPagination,
  };
});
