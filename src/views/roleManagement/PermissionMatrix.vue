<template>
  <div class="bg-background min-h-screen">
    <!-- Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-accent rounded-md p-2">
              <TableOutlined class="h-6 w-6 text-white" />
            </div>
            <h1 class="ml-3 text-2xl font-semibold text-primary">
              Permission Matrix
            </h1>
          </div>
          <p class="mt-2 text-sm text-secondary max-w-2xl">
            View the final effective permissions for all users across all menus.
          </p>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="mx-auto py-6">
      <div class="bg-card shadow-md rounded-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a-select
            v-model:value="selectedUserId"
            placeholder="Filter by user"
            class="w-full"
            allow-clear
            show-search
            :filter-option="filterUser"
          >
            <a-select-option value="">All Users</a-select-option>
            <a-select-option
              v-for="user in users"
              :key="user.id"
              :value="user.id"
            >
              {{ user.userName }} ({{ user.roleName }})
            </a-select-option>
          </a-select>

          <a-select
            v-model:value="selectedRoleId"
            placeholder="Filter by role"
            class="w-full"
            allow-clear
          >
            <a-select-option value="">All Roles</a-select-option>
            <a-select-option
              v-for="role in roles"
              :key="role.id"
              :value="role.id"
            >
              {{ role.roleName }}
            </a-select-option>
          </a-select>

          <a-select
            v-model:value="overrideFilter"
            placeholder="Filter by override status"
            class="w-full"
            allow-clear
          >
            <a-select-option value="">All Users</a-select-option>
            <a-select-option value="with">Users with Overrides</a-select-option>
            <a-select-option value="without"
              >Users without Overrides</a-select-option
            >
          </a-select>
        </div>
      </div>

      <!-- Permission Matrix Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-medium text-primary">
                Effective Permissions
              </h2>
              <p class="mt-1 text-sm text-secondary">
                Final access rights combining role defaults with user overrides
              </p>
            </div>
            <a-button type="default" @click="exportMatrix">
              <template #icon><ExportOutlined /></template>
              Export Matrix
            </a-button>
          </div>
        </div>

        <a-table
          :dataSource="filteredMatrix"
          :columns="matrixColumns"
          :pagination="pagination"
          :rowClassName="getRowClassName"
          class="custom-table permission-matrix-table"
          :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'userName'">
              <div class="flex items-center">
                <a-avatar
                  :style="{ backgroundColor: getAvatarColor(record.userName) }"
                  size="small"
                  class="mr-2"
                >
                  {{ record.userName.substring(0, 2).toUpperCase() }}
                </a-avatar>
                <div>
                  <div class="font-medium text-primary text-sm">
                    {{ record.userName }}
                  </div>
                  <div class="text-xs text-secondary">{{ record.email }}</div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'roleName'">
              <a-tag :color="getRoleColor(record.roleName)" size="small">
                {{ record.roleName }}
              </a-tag>
            </template>
            <template v-if="column.key === 'hasOverrides'">
              <a-tag v-if="record.hasOverrides" color="orange" size="small">
                <WarningOutlined class="mr-1" />
                Yes
              </a-tag>
              <span v-else class="text-secondary text-xs">No</span>
            </template>
            <template
              v-if="
                column.dataIndex && column.dataIndex.endsWith('Permissions')
              "
            >
              <div class="flex flex-wrap gap-1">
                <a-tooltip
                  v-if="record[column.dataIndex].view"
                  title="Can View"
                >
                  <a-tag color="blue" size="small">V</a-tag>
                </a-tooltip>
                <a-tooltip
                  v-if="record[column.dataIndex].create"
                  title="Can Create"
                >
                  <a-tag color="green" size="small">C</a-tag>
                </a-tooltip>
                <a-tooltip
                  v-if="record[column.dataIndex].edit"
                  title="Can Edit"
                >
                  <a-tag color="orange" size="small">E</a-tag>
                </a-tooltip>
                <a-tooltip
                  v-if="record[column.dataIndex].delete"
                  title="Can Delete"
                >
                  <a-tag color="red" size="small">D</a-tag>
                </a-tooltip>
                <span
                  v-if="!hasAnyPermission(record[column.dataIndex])"
                  class="text-secondary text-xs"
                  >-</span
                >
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Legend -->
      <div class="bg-card shadow-md rounded-md p-6 mt-6">
        <h3 class="text-sm font-medium text-primary mb-3">Legend</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center">
            <a-tag color="blue" size="small" class="mr-2">V</a-tag>
            <span class="text-sm text-secondary">View Permission</span>
          </div>
          <div class="flex items-center">
            <a-tag color="green" size="small" class="mr-2">C</a-tag>
            <span class="text-sm text-secondary">Create Permission</span>
          </div>
          <div class="flex items-center">
            <a-tag color="orange" size="small" class="mr-2">E</a-tag>
            <span class="text-sm text-secondary">Edit Permission</span>
          </div>
          <div class="flex items-center">
            <a-tag color="red" size="small" class="mr-2">D</a-tag>
            <span class="text-sm text-secondary">Delete Permission</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ExportOutlined,
  TableOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";

interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface PermissionMatrix {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  roleName: string;
  hasOverrides: boolean;
  dashboardPermissions: Permission;
  usersPermissions: Permission;
  rolesPermissions: Permission;
  menusPermissions: Permission;
  reportsPermissions: Permission;
  settingsPermissions: Permission;
}

interface User {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  roleName: string;
  hasOverrides: boolean;
}

interface Role {
  id: number;
  roleName: string;
}

const selectedUserId = ref<number | string>("");
const selectedRoleId = ref<number | string>("");
const overrideFilter = ref<string>("");

const users = ref<User[]>([
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    roleId: 1,
    roleName: "Super Admin",
    hasOverrides: false,
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    roleId: 2,
    roleName: "Admin",
    hasOverrides: true,
  },
  {
    id: 3,
    userName: "Bob Johnson",
    email: "bob@example.com",
    roleId: 3,
    roleName: "Manager",
    hasOverrides: false,
  },
  {
    id: 4,
    userName: "Alice Brown",
    email: "alice@example.com",
    roleId: 4,
    roleName: "User",
    hasOverrides: true,
  },
  {
    id: 5,
    userName: "Charlie Wilson",
    email: "charlie@example.com",
    roleId: 4,
    roleName: "User",
    hasOverrides: false,
  },
]);

const roles = ref<Role[]>([
  { id: 1, roleName: "Super Admin" },
  { id: 2, roleName: "Admin" },
  { id: 3, roleName: "Manager" },
  { id: 4, roleName: "User" },
]);

// Sample permission matrix data
const permissionMatrix = ref<PermissionMatrix[]>([
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    roleId: 1,
    roleName: "Super Admin",
    hasOverrides: false,
    dashboardPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    usersPermissions: { view: true, create: true, edit: true, delete: true },
    rolesPermissions: { view: true, create: true, edit: true, delete: true },
    menusPermissions: { view: true, create: true, edit: true, delete: true },
    reportsPermissions: { view: true, create: true, edit: true, delete: false },
    settingsPermissions: {
      view: true,
      create: false,
      edit: true,
      delete: false,
    },
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    roleId: 2,
    roleName: "Admin",
    hasOverrides: true,
    dashboardPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    usersPermissions: { view: true, create: true, edit: true, delete: true },
    rolesPermissions: { view: true, create: true, edit: true, delete: false },
    menusPermissions: { view: true, create: false, edit: true, delete: false },
    reportsPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    settingsPermissions: {
      view: true,
      create: false,
      edit: true,
      delete: false,
    },
  },
  {
    id: 3,
    userName: "Bob Johnson",
    email: "bob@example.com",
    roleId: 3,
    roleName: "Manager",
    hasOverrides: false,
    dashboardPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    usersPermissions: { view: true, create: false, edit: true, delete: false },
    rolesPermissions: { view: true, create: false, edit: false, delete: false },
    menusPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    reportsPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    settingsPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  },
  {
    id: 4,
    userName: "Alice Brown",
    email: "alice@example.com",
    roleId: 4,
    roleName: "User",
    hasOverrides: true,
    dashboardPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    usersPermissions: { view: true, create: false, edit: false, delete: false },
    rolesPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    menusPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    reportsPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    settingsPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  },
  {
    id: 5,
    userName: "Charlie Wilson",
    email: "charlie@example.com",
    roleId: 4,
    roleName: "User",
    hasOverrides: false,
    dashboardPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    usersPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    rolesPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    menusPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    reportsPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    settingsPermissions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  },
]);

const matrixColumns = [
  { title: "SL", key: "id", width: 60, fixed: "left" },
  { title: "User Name", key: "userName", width: 200, fixed: "left" },
  { title: "Role", key: "roleName", width: 120, fixed: "left" },
  { title: "Override", key: "hasOverrides", width: 90 },
  {
    title: "Dashboard",
    dataIndex: "dashboardPermissions",
    key: "dashboard",
    width: 120,
  },
  { title: "Users", dataIndex: "usersPermissions", key: "users", width: 120 },
  { title: "Roles", dataIndex: "rolesPermissions", key: "roles", width: 120 },
  { title: "Menus", dataIndex: "menusPermissions", key: "menus", width: 120 },
  {
    title: "Reports",
    dataIndex: "reportsPermissions",
    key: "reports",
    width: 120,
  },
  {
    title: "Settings",
    dataIndex: "settingsPermissions",
    key: "settings",
    width: 120,
  },
];

const filteredMatrix = computed(() => {
  let filtered = permissionMatrix.value;

  if (selectedUserId.value) {
    filtered = filtered.filter((m) => m.id === selectedUserId.value);
  }

  if (selectedRoleId.value) {
    filtered = filtered.filter((m) => m.roleId === selectedRoleId.value);
  }

  if (overrideFilter.value === "with") {
    filtered = filtered.filter((m) => m.hasOverrides);
  } else if (overrideFilter.value === "without") {
    filtered = filtered.filter((m) => !m.hasOverrides);
  }

  return filtered;
});

const pagination = computed(() => ({
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} users`,
}));

const getAvatarColor = (name: string) => {
  const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#6b8e23"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const getRoleColor = (roleName: string) => {
  const colors: Record<string, string> = {
    "Super Admin": "red",
    Admin: "orange",
    Manager: "blue",
    User: "green",
  };
  return colors[roleName] || "default";
};

const getRowClassName = (record: PermissionMatrix) => {
  return record.hasOverrides ? "override-row" : "";
};

const hasAnyPermission = (permission: Permission) => {
  return (
    permission.view || permission.create || permission.edit || permission.delete
  );
};

const filterUser = (input: string, option: any) => {
  const user = users.value.find((u) => u.id === option.value);
  return user
    ? user.userName.toLowerCase().includes(input.toLowerCase())
    : false;
};

const exportMatrix = () => {
  message.success("Permission matrix exported successfully");
};
</script>

<style scoped>
/* @import "../styles/role-management.css"; */

.permission-matrix-table .override-row {
  background-color: #fffbf0 !important;
}

.permission-matrix-table .override-row:hover td {
  background-color: #fff7e6 !important;
}
</style>
