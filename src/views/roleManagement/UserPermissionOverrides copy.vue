<script setup lang="ts">
import {
  ArrowRightOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  TeamOutlined,
  UndoOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";

interface User {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  roleName: string;
}

interface UserPermission {
  menuId: number;
  menuName: string;
  menuPath: string;
  icon: string;
  defaultCanAccess: boolean;
  canAccess: boolean;
  isOverridden: boolean;
}

const DEMO_USERS: User[] = [
  {
    id: 1,
    userName: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    roleId: 1,
    roleName: "Admin",
  },
  {
    id: 2,
    userName: "Michael Chen",
    email: "michael.chen@company.com",
    roleId: 2,
    roleName: "Manager",
  },
  {
    id: 3,
    userName: "Emma Williams",
    email: "emma.williams@company.com",
    roleId: 3,
    roleName: "Developer",
  },
  {
    id: 4,
    userName: "James Taylor",
    email: "james.taylor@company.com",
    roleId: 3,
    roleName: "Developer",
  },
  {
    id: 5,
    userName: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    roleId: 4,
    roleName: "Analyst",
  },
];

const DEMO_PERMISSIONS: UserPermission[] = [
  {
    menuId: 1,
    menuName: "Dashboard",
    menuPath: "/admin/dashboard",
    icon: "DashboardOutlined",
    defaultCanAccess: true,
    canAccess: true,
    isOverridden: false,
  },
  {
    menuId: 2,
    menuName: "User Management",
    menuPath: "/admin/users",
    icon: "TeamOutlined",
    defaultCanAccess: false,
    canAccess: false,
    isOverridden: false,
  },
  {
    menuId: 3,
    menuName: "Settings",
    menuPath: "/admin/settings",
    icon: "SettingOutlined",
    defaultCanAccess: false,
    canAccess: true,
    isOverridden: true,
  },
  {
    menuId: 4,
    menuName: "Reports",
    menuPath: "/analytics/reports",
    icon: "FileTextOutlined",
    defaultCanAccess: true,
    canAccess: true,
    isOverridden: false,
  },
  {
    menuId: 5,
    menuName: "Access Control",
    menuPath: "/admin/permissions",
    icon: "SafetyCertificateOutlined",
    defaultCanAccess: false,
    canAccess: false,
    isOverridden: false,
  },
  {
    menuId: 6,
    menuName: "Audit Logs",
    menuPath: "/admin/audit",
    icon: "FileTextOutlined",
    defaultCanAccess: false,
    canAccess: true,
    isOverridden: true,
  },
  {
    menuId: 7,
    menuName: "Team Overview",
    menuPath: "/team/overview",
    icon: "TeamOutlined",
    defaultCanAccess: true,
    canAccess: true,
    isOverridden: false,
  },
  {
    menuId: 8,
    menuName: "Billing",
    menuPath: "/admin/billing",
    icon: "SettingOutlined",
    defaultCanAccess: false,
    canAccess: false,
    isOverridden: false,
  },
];

const selectedUserId = ref<number | null>(null);
const userPermissions = ref<UserPermission[]>([]);
const saving = ref(false);
const users = ref<User[]>([]);

const selectedUser = computed(() =>
  users.value.find((u) => u.id === selectedUserId.value)
);

const hasChanges = computed(() =>
  userPermissions.value.some((p) => p.isOverridden)
);

const overridesCount = computed(
  () => userPermissions.value.filter((p) => p.isOverridden).length
);

const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    MenuOutlined,
    LockOutlined,
  };
  return icons[name] || MenuOutlined;
};

const getRoleColor = (roleId: number) => {
  const colors: Record<number, string> = {
    1: "#3b82f6",
    2: "#8b5cf6",
    3: "#ec4899",
    4: "#10b981",
  };
  return colors[roleId] || "#64748b";
};

const filterUser = (input: string, option: any) => {
  const user = users.value.find((u) => u.id === option.value);
  return (
    user?.userName.toLowerCase().includes(input.toLowerCase()) ||
    user?.email.toLowerCase().includes(input.toLowerCase())
  );
};

const loadUserPermissions = async (userId: number) => {
  try {
    userPermissions.value = DEMO_PERMISSIONS.map((p) => ({
      ...p,
      isOverridden: p.canAccess !== p.defaultCanAccess,
    }));
  } catch (error) {
    message.error("Failed to load permissions");
  }
};

const markAsOverridden = (record: UserPermission) => {
  record.isOverridden = record.canAccess !== record.defaultCanAccess;
};

const buildSavePayload = () => {
  return userPermissions.value
    .filter((p) => p.isOverridden)
    .map((p) => ({
      menuId: p.menuId,
      userId: selectedUserId.value,
      isActive: p.canAccess,
      isDeleted: !p.canAccess && p.isOverridden,
      overwriteEnabled: p.canAccess !== p.defaultCanAccess,
      action: p.canAccess ? "GRANT_EXTRA" : "REMOVE_EXISTING",
    }));
};

const resetToDefault = () => {
  Modal.confirm({
    title: "Confirm Reset to Defaults",
    content:
      "All manual overrides will be removed. This user will inherit exactly what their assigned role defines. Previously active menus will be marked as inactive and deleted.",
    centered: true,
    okText: "Reset Now",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      userPermissions.value.forEach((p) => {
        p.canAccess = p.defaultCanAccess;
        p.isOverridden = false;
      });

      const deletedCount = userPermissions.value.filter(
        (p) => !p.canAccess
      ).length;

      message.success(
        `Permission inheritance restored. ${deletedCount} items marked as deleted.`
      );
    },
  });
};

const saveOverrides = async () => {
  saving.value = true;
  try {
    const payload = buildSavePayload();

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const grantCount = payload.filter((p) => p.action === "GRANT_EXTRA").length;
    const revokeCount = payload.filter(
      (p) => p.action === "REMOVE_EXISTING"
    ).length;

    if (grantCount > 0)
      message.success(`Granted access to ${grantCount} menu(s)`);
    if (revokeCount > 0)
      message.success(`Revoked access to ${revokeCount} menu(s)`);

    if (selectedUserId.value) await loadUserPermissions(selectedUserId.value);
  } catch (error) {
    message.error("Failed to save overrides");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  users.value = DEMO_USERS;
});
</script>

<template>
  <!-- Updated to dark theme with slate and blue color scheme matching selected-user-id.tsx -->
  <div class="bg-background min-h-screen">
    <div class="bg-card border-b border-gray-200">
      <!-- Header -->
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center gap-3 mb-4">
          <div
            style="
              background: linear-gradient(135deg, #5a7a1f 0%, #9bbf3b 100%);
            "
            class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          >
            <LockOutlined class="text-lg" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest">
              Permission Management
            </p>
            <h1 class="text-4xl font-bold text-primary">Access Control</h1>
          </div>
        </div>
        <p class="text-base max-w-2xl mt-2 text-secondary">
          Grant or revoke menu access on a per-user basis. All changes are
          recorded as deviations from the user's role-based defaults.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <!-- Left Sidebar -->
      <div class="lg:col-span-1">
        <!-- User Selection Card -->
        <div
          style="background: #067c6a; border: 1px solid #067c6a"
          class="rounded-2xl p-6 mb-6"
        >
          <label
            style="color: #f1f5f9"
            class="text-xs font-bold uppercase tracking-wider block mb-4"
            >Select User</label
          >
          <a-select
            v-model:value="selectedUserId"
            placeholder="Search users..."
            class="w-full rounded-md"
            size="large"
            :filter-option="filterUser"
            @change="loadUserPermissions"
            allowClear
          >
            <a-select-option
              v-for="user in users"
              :key="user.id"
              :value="user.id"
            >
              <template #label>
                <div class="flex items-center justify-between w-full gap-1">
                  <div class="flex-1 min-w-0">
                    <div
                      class="font-semibold text-sm truncate"
                      style="color: #0f172a"
                    >
                      {{ user.userName }}
                    </div>
                    <div class="text-xs truncate" style="color: #64748b">
                      {{ user.email }}
                    </div>
                  </div>
                  <div
                    style="
                      background-color: rgba(59, 130, 246, 0.1);
                      color: #3b82f6;
                    "
                    class="px-2 py-2 rounded text-[9px] font-bold uppercase whitespace-nowrap"
                  >
                    {{ user.roleName }}
                  </div>
                </div>
              </template>

              <div class="flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm">
                    {{ user.userName }}
                  </div>
                  <div class="text-xs" style="color: #64748b">
                    {{ user.email }}
                  </div>
                </div>
                <div
                  style="
                    background-color: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                  "
                  class="px-2 py-0 rounded text-[9px] font-bold uppercase whitespace-nowrap"
                >
                  {{ user.roleName }}
                </div>
              </div>
            </a-select-option>
          </a-select>
        </div>

        <!-- User Info Card -->
        <transition name="fade">
          <div
            v-if="selectedUser"
            style="background: #5a7a1f; border: 1px solid #5a7a1f"
            class="rounded-2xl p-6 mb-6"
          >
            <div class="flex items-start gap-4">
              <div
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                "
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              >
                {{ selectedUser.userName.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 style="color: #f1f5f9" class="font-bold text-base">
                  {{ selectedUser.userName }}
                </h3>
                <p style="color: #f1f5f9" class="text-xs mt-1">
                  {{ selectedUser.email }}
                </p>
                <div class="mt-3 flex items-center gap-2">
                  <div
                    style="
                      background-color: rgba(139, 92, 246, 0.5);
                      color: #f1f5f9;
                    "
                    class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase"
                  >
                    {{ selectedUser.roleName }} Role
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Stats Card -->
        <transition name="fade">
          <div
            v-if="selectedUserId"
            style="
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
              border: 1px solid #1e3a8a;
            "
            class="rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div class="relative z-10">
              <div
                style="color: rgba(255, 255, 255, 0.7)"
                class="text-xs font-bold uppercase tracking-wider mb-3"
              >
                Menu Access
              </div>
              <div class="text-4xl font-black">
                {{ userPermissions.filter((p) => p.canAccess).length
                }}<span style="font-size: 1.5rem; opacity: 0.6"
                  >/{{ userPermissions.length }}</span
                >
              </div>
              <p style="color: rgba(255, 255, 255, 0.6)" class="text-xs mt-2">
                Accessible after overrides
              </p>
            </div>
            <div
              style="color: rgba(255, 255, 255, 0.05)"
              class="absolute -right-8 -bottom-8"
            >
              <MenuOutlined class="text-8xl" />
            </div>
          </div>
        </transition>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2">
        <transition name="fade">
          <div
            v-if="selectedUserId"
            style="background: #1e293b; border: 1px solid #334155"
            class="rounded-2xl overflow-hidden"
          >
            <!-- Table Header -->
            <div
              style="background: #0f172a; border-bottom: 1px solid #334155"
              class="px-6 py-5 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <MenuOutlined style="color: #64748b" class="text-lg" />
                <h2
                  style="color: #cbd5e1"
                  class="text-sm font-bold uppercase tracking-wide"
                >
                  Menu Permissions
                </h2>
              </div>
              <transition name="fade">
                <div
                  v-if="hasChanges"
                  style="
                    background: rgba(217, 119, 6, 0.1);
                    border: 1px solid rgba(217, 119, 6, 0.3);
                  "
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full"
                >
                  <div
                    style="background-color: #d97706"
                    class="w-2 h-2 rounded-full animate-pulse"
                  ></div>
                  <span
                    style="color: #f59e0b"
                    class="text-[10px] font-bold uppercase"
                    >Unsaved Changes</span
                  >
                </div>
              </transition>
            </div>

            <!-- Menu Items -->
            <div style="border-color: #334155">
              <div
                v-for="permission in userPermissions"
                :key="permission.menuId"
                style="border-color: #334155; border-bottom: 1px solid #334155"
                class="px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition-all duration-200"
              >
                <!-- Menu Info -->
                <div class="flex items-center gap-4 flex-1">
                  <div
                    style="background: #0f172a; color: #64748b"
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <component
                      :is="getIcon(permission.icon)"
                      class="text-base"
                    />
                  </div>
                  <div>
                    <div style="color: #f1f5f9" class="font-bold text-sm">
                      {{ permission.menuName }}
                    </div>
                    <div
                      style="color: #64748b"
                      class="text-xs font-mono mt-0.5"
                    >
                      {{ permission.menuPath }}
                    </div>
                  </div>
                </div>

                <!-- Role Default -->
                <div class="flex items-center gap-4 flex-shrink-0">
                  <div class="flex items-center gap-2">
                    <span
                      v-if="permission.defaultCanAccess"
                      style="
                        color: #10b981;
                        background-color: rgba(16, 185, 129, 0.1);
                      "
                      class="px-2.5 py-1 rounded text-[10px] font-bold"
                    >
                      ✓ Granted
                    </span>
                    <span
                      v-else
                      style="
                        color: #64748b;
                        background-color: rgba(100, 116, 139, 0.1);
                      "
                      class="px-2.5 py-1 rounded text-[10px] font-bold"
                    >
                      ✗ Denied
                    </span>
                  </div>

                  <!-- Arrow -->
                  <ArrowRightOutlined style="color: #475569" class="text-xs" />

                  <!-- Toggle Switch -->
                  <div class="flex items-center gap-3">
                    <a-switch
                      v-model:checked="permission.canAccess"
                      @change="() => markAsOverridden(permission)"
                      :checked-children="'ON'"
                      :un-checked-children="'OFF'"
                    />
                    <span
                      v-if="permission.isOverridden"
                      style="
                        background-color: rgba(59, 130, 246, 0.1);
                        color: #60a5fa;
                      "
                      class="px-2 py-1 rounded text-[9px] font-bold uppercase"
                    >
                      Override
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              style="background: #0f172a; border-top: 1px solid #334155"
              class="px-6 py-4 flex items-center justify-between"
            >
              <a-button
                v-if="selectedUserId"
                @click="resetToDefault"
                style="
                  background: transparent;
                  border-color: #475569;
                  color: #cbd5e1;
                  height: 40px;
                "
                class="px-5 rounded-lg font-medium hover:border-slate-400 transition-all"
              >
                <template #icon><UndoOutlined /></template>
                Reset to Default
              </a-button>
              <a-button
                type="primary"
                :loading="saving"
                :disabled="!hasChanges"
                @click="saveOverrides"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  border: none;
                  height: 40px;
                  font-weight: 600;
                  color: white;
                "
                class="px-8 rounded-lg"
              >
                <template #icon><SaveOutlined /></template>
                Save Changes
              </a-button>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            style="background: #1e293b; border: 1px solid #334155"
            class="rounded-2xl h-96 flex flex-col items-center justify-center text-center"
          >
            <div
              style="background: #0f172a"
              class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            >
              <UserOutlined style="color: #475569" class="text-4xl" />
            </div>
            <h3 style="color: #f1f5f9" class="text-xl font-bold">
              Select a User
            </h3>
            <p style="color: #64748b" class="text-sm max-w-xs mt-3">
              Choose a user from the sidebar to manage their menu permissions
              and access levels.
            </p>
          </div>
        </transition>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
