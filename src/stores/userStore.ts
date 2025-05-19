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
  const user = ref<User | null>(null);
  const isLoggedIn = ref(false);
  const errorMessage = ref("");

  const allUsers: User[] = [
    {
      id: 1,
      name: "Vendor Admin",
      username: "vendoradmin",
      email: "vendor@example.com",
      password: "vendor123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vendor",
      role: "Vendor Admin",
    },
    {
      id: 2,
      name: "Bank Admin",
      username: "bankadmin",
      email: "bank@example.com",
      password: "bank123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bank",
      role: "Bank Admin",
    },
    {
      id: 3,
      name: "Branch Officer",
      username: "branchofficer",
      email: "officer@example.com",
      password: "officer123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Officer",
      role: "Branch Officer",
    },
    {
      id: 4,
      name: "Branch User",
      username: "branchuser",
      email: "user@example.com",
      password: "user123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      role: "Branch User",
    },
  ];

  const initializeFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedUser && storedLoginState === "true") {
      user.value = JSON.parse(storedUser);
      isLoggedIn.value = true;
    }
  };

  initializeFromStorage();

  const login = (identifier: string, password: string) => {
    const foundUser = allUsers.find(
      (u) =>
        (u.email === identifier || u.username === identifier) &&
        u.password === password
    );

    if (foundUser) {
      user.value = { ...foundUser };
      delete user.value.password; // Don't store password
      isLoggedIn.value = true;
      errorMessage.value = "";
      localStorage.setItem("user", JSON.stringify(user.value));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      errorMessage.value = "Invalid email/username or password";
    }
  };

  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  const permissions = computed(() => {
    if (!user.value) return [];
    return rolePermissionsMap[user.value.role] || [];
  });

  const canAccess = (permission: string): boolean => {
    return permissions.value.includes(permission);
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    permissions,
    canAccess,
    errorMessage,
  };
});
