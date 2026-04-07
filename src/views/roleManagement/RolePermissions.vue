<template>
  <div class="bg-background min-h-screen">
    <!-- Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-accent rounded-md p-2">
              <SafetyCertificateOutlined class="h-6 w-6 text-white" />
            </div>
            <h1 class="ml-3 text-2xl font-semibold text-primary">
              Role Permissions
            </h1>
          </div>
          <p class="mt-2 text-sm text-secondary max-w-2xl">
            Configure default menu access permissions for each role.
          </p>
        </div>
      </div>
    </div>

    <!-- Role Selection -->
    <div class="mx-auto py-6">
      <div class="bg-card shadow-md rounded-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-primary">Select Role</h3>
            <p class="text-sm text-secondary mt-1">
              Choose a role to manage its menu permissions
            </p>
          </div>
          <a-select
            v-model:value="selectedRoleId"
            placeholder="Select a role"
            class="w-64"
            @change="loadPermissions"
          >
            <a-select-option
              v-for="role in roles"
              :key="role.id"
              :value="role.id"
            >
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Permissions Table -->
        <div v-if="selectedRoleId" class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-md font-medium text-primary">Menu Permissions</h4>
            <a-button
              type="primary"
              @click="savePermissions"
              :loading="saving"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              <template #icon><SaveOutlined /></template>
              Save Permissions
            </a-button>
          </div>

          <a-table
            :dataSource="menuPermissions"
            :columns="permissionColumns"
            :pagination="false"
            class="custom-table"
            :scroll="{ x: 1000 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'menuName'">
                <div
                  class="flex items-center"
                  :style="{ paddingLeft: `${record.level * 20}px` }"
                >
                  <span class="font-medium">{{ record.menuName }}</span>
                </div>
              </template>
              <template v-if="column.key === 'hasPermission'">
                <a-checkbox v-model:checked="record.hasPermission" />
              </template>
            </template>
          </a-table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <SafetyCertificateOutlined
            class="text-6xl text-secondary opacity-50"
          />
          <p class="mt-4 text-secondary">
            Please select a role to configure permissions
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createRolePermissionService,
  getMenuIdByRoleAndMenuId,
  getRoleForUserService,
  getRolePermissionsService,
  updateRolePermissionService,
} from "@/services/role/role.service";
import { SafetyCertificateOutlined, SaveOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
let loading = ref(false);
const roles = ref<Role[]>([]);

interface Role {
  id: number;
  roleName: string;
}

interface MenuPermission {
  id: number;
  menuId: number;
  menuName: string;
  menuPath: string;
  hasPermission: boolean;
  originalHasPermission: boolean;
}

const selectedRoleId = ref<number | null>(null);
const saving = ref(false);

const featchRoole = async () => {
  loading.value = true;
  try {
    const result = await getRoleForUserService();
    roles.value = result;
  } catch (e) {
    console.error("Error fetching roles", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await featchRoole();
});

const permissionColumns = [
  { title: "Menu Name", key: "menuName", dataIndex: "menuName" },
  { title: "Menu Path", dataIndex: "menuPath", key: "menuPath" },
  {
    title: "Menu permissions",
    dataIndex: "hasPermission",
    key: "hasPermission",
    align: "center",
  },
];
const menuPermissions = ref<MenuPermission[]>([]);

const loadPermissions = async (roleId: number) => {
  try {
    const result = await getRolePermissionsService(roleId);
    menuPermissions.value = result.defaultMenuPermissionByRole;
    menuPermissions.value.forEach((item) => {
      item.originalHasPermission = item.hasPermission;
    });
  } catch (e) {
    console.error("Error fetching permissions", e);
  } finally {
    loading.value = false;
  }
};

const getChangedPermissions = () => {
  return menuPermissions.value.filter(
    (item) => item.hasPermission !== item.originalHasPermission,
  );
};

const savePermissions = async () => {
  const changed = getChangedPermissions();

  if (changed.length === 0) {
    message.info("No changes to save");
    return;
  }

  try {
    saving.value = true;
    const requests = changed.map(async (item) => {
      const exists = await getMenuIdByRoleAndMenuId(
        selectedRoleId.value as number,
        item.menuId,
      );
      // console.log(item);

      if (exists.hasPermission) {
        return updateRolePermissionService(
          item.id,
          selectedRoleId.value as number,
          item.menuId,
          item.hasPermission,
        );
      } else {
        return createRolePermissionService(
          selectedRoleId.value as number,
          item.menuId,
          item.hasPermission,
        );
      }
    });

    // 2) সব API call parallel execute
    await Promise.all(requests);

    // 3) local state update
    changed.forEach((item) => {
      item.originalHasPermission = item.hasPermission;
    });

    message.success("Permissions updated successfully");
  } catch (e) {
    console.error("Error saving permissions", e);
    message.error("Failed to save changes");
  } finally {
    saving.value = false;
  }
};
</script>

<!-- <style scoped>
@import "../styles/role-management.css";
</style> -->
