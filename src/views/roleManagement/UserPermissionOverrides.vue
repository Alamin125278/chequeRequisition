<script setup lang="ts">
import { saveMenuPermissionService } from "@/services/userMenuPermission/userMenuPermission.service";
import {
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
import { computed, onMounted, ref, toRaw } from "vue";
import { getUserMenusPermissionsService } from "../../services/role/role.service";
import { getUsersForMenusPermissionOverrideService } from "../../services/user/user.service";

interface User {
  id: number;
  userName: string;
  name: string;
  email: string;
  roleId: number;
  roleName: string;
}

interface UserPermission {
  menuId: number;
  menuName: string;
  menuPath: string;
  icon: string;
  canAccess: boolean;
}
const selectedUserId = ref<number | null>(null);
const userPermissions = ref<UserPermission[]>([]);
const originalPermissions = ref<UserPermission[]>([]);
const saving = ref(false);
const users = ref<User[]>([]);

const loadUsers = async () => {
  try {
    const result = await getUsersForMenusPermissionOverrideService();
    users.value = result.users;
  } catch (e) {
    console.error("Error fetching users", e);
  }
};
const selectedUser = computed(() =>
  users.value.find((u) => u.id === selectedUserId.value),
);

const hasChanges = computed(() =>
  userPermissions.value.some(
    (p, index) => p.canAccess !== originalPermissions.value[index]?.canAccess,
  ),
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
    5: "#64748b",
    6: "#3b82f6",
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
    const result = await getUserMenusPermissionsService(userId);
    userPermissions.value = result.userMenusPermissions;
    originalPermissions.value = JSON.parse(
      JSON.stringify(userPermissions.value),
    );
  } catch (error) {
    message.error("Failed to load permissions");
  }
};

const buildSavePayload = () => {
  return userPermissions.value
    .filter(
      (p, index) => p.canAccess !== originalPermissions.value[index]?.canAccess,
    )
    .map((p) => ({
      menuId: p.menuId,
      userId: selectedUserId.value,
      canAccess: p.canAccess,
    }));
};

const resetToDefault = () => {
  Modal.confirm({
    title: "Confirm Reset",
    content: "All permission changes will be discarded.",
    centered: true,
    okText: "Reset",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      userPermissions.value = JSON.parse(
        JSON.stringify(originalPermissions.value),
      );
      message.success("Permissions reset.");
    },
  });
};

const saveOverrides = async () => {
  if (saving.value) return;

  saving.value = true;

  try {
    const payload = buildSavePayload();

    if (!payload.length) {
      message.info("No changes to save");
      saving.value = false;
      return;
    }

    // Bulk API call
    await saveMenuPermissionService(selectedUserId.value ?? 0, payload);

    const grantedCount = payload.filter((p) => p.canAccess).length;
    const revokedCount = payload.length - grantedCount;

    if (grantedCount > 0) {
      message.success(`Granted access to ${grantedCount} menu(s)`);
    }
    if (revokedCount > 0) {
      message.success(`Revoked access from ${revokedCount} menu(s)`);
    }

    originalPermissions.value = structuredClone(toRaw(userPermissions.value));
  } catch (error) {
    console.error(error);
    message.error("Failed to save permissions");
  } finally {
    saving.value = false;
  }
};

// const saveOverrides = async () => {
//   if (saving.value) return; // prevent double click

//   saving.value = true;

//   try {
//     const payload = buildSavePayload();

//     if (!payload.length) {
//       message.info("No changes to save");
//       saving.value = false;
//       return;
//     }

//     const requests = payload.map(({ menuId, canAccess }) =>
//       canAccess
//         ? saveMenuPermissionService(selectedUserId.value ?? 0, menuId)
//         : saveMenuPermissionService(selectedUserId.value ?? 0, menuId),
//     );

//     await Promise.all(requests);

//     const grantedCount = payload.filter((p) => p.canAccess).length;
//     const revokedCount = payload.length - grantedCount;

//     if (grantedCount > 0) {
//       message.success(`Granted access to ${grantedCount} menu(s)`);
//     }

//     if (revokedCount > 0) {
//       message.success(`Revoked access from ${revokedCount} menu(s)`);
//     }

//     originalPermissions.value = structuredClone(toRaw(userPermissions.value));
//   } catch (error) {
//     console.error(error);
//     message.error("Failed to save permissions");
//   } finally {
//     saving.value = false;
//   }
// };

onMounted(async () => {
  await loadUsers();
});
</script>

<template>
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
          Grant or revoke menu access on a per-user basis.
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
                      {{ user.name }}
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
                    {{ user.name }}
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
                {{ selectedUser.name.toUpperCase().charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 style="color: #f1f5f9" class="font-bold text-base">
                  {{ selectedUser.name }}
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
                Accessible menus
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
            <div
              style="border-color: #334155"
              class="overflow-y-auto max-h-[500px]"
            >
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

                <!-- Toggle Switch -->
                <div class="flex items-center gap-3 flex-shrink-0">
                  <a-switch
                    v-model:checked="permission.canAccess"
                    :checked-children="'ON'"
                    :un-checked-children="'OFF'"
                  />
                  <span
                    v-if="permission.canAccess"
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
                Reset
              </a-button>
              <a-button
                type="primary"
                :loading="saving"
                :disabled="saving || !hasChanges"
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
              Choose a user from the sidebar to manage their menu permissions.
            </p>
          </div>
        </transition>
      </div>
    </div>
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
