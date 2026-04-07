<template>
  <div class="bg-background min-h-screen">
    <!-- Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <UserOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                Role Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Create and manage user roles with default permissions.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add New Role
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Table Section -->
    <div class="mx-auto pb-8">
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-primary">All Roles List</h2>
              <p class="mt-1 text-sm text-secondary">
                A complete list of all system roles
              </p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <a-select
                v-model:value="rolesStore.status"
                placeholder="Select status"
                @change="rolesStore.setStatus"
                class="w-40"
                allowClear
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="Active">Active</a-select-option>
                <a-select-option value="Inactive">Inactive</a-select-option>
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search roles..."
                class="w-40"
                @search="rolesStore.setSearch"
                allow-clear
              >
                <template #prefix>
                  <SearchOutlined class="text-secondary" />
                </template>
              </a-input-search>
            </div>
          </div>
        </div>

        <a-table
          :dataSource="rolesStore.roles"
          :columns="columns"
          :loading="rolesStore.loading"
          :pagination="pagination"
          @change="rolePagination"
          :rowClassName="() => 'hover:bg-background'"
          class="custom-table"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'roleName'">
              <div class="flex items-center">
                <a-tag :color="getRoleColor(record.roleName)" class="mr-2">
                  <SafetyCertificateOutlined />
                </a-tag>
                <span class="font-medium">{{ record.roleName }}</span>
              </div>
            </template>
            <template v-if="column.key === 'isActive'">
              <a-tag
                :color="record.isActive ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.isActive ? "Active" : "Inactive" }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex justify-center space-x-2">
                <a-tooltip title="Edit Role">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip title="Delete Role">
                  <a-button
                    type="primary"
                    shape="circle"
                    danger
                    class="flex items-center justify-center"
                    @click="showDeleteConfirm(record)"
                  >
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Role Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'add' ? 'Add New Role' : 'Edit Role'"
      :width="500"
      :footer="null"
    >
      <div class="p-4">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <a-form-item label="Role Name" name="roleName">
            <a-input
              v-model:value="formState.roleName"
              placeholder="Enter role name"
              class="rounded-md"
            />
          </a-form-item>

          <a-form-item label="Status" name="isActive">
            <a-switch
              v-model:checked="formState.isActive"
              checked-children="Active"
              un-checked-children="Inactive"
            />
          </a-form-item>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="modalVisible = false">Cancel</a-button>
            <a-button
              type="primary"
              @click="handleModalSubmit"
              :loading="submitting"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              {{ modalMode === "add" ? "Create Role" : "Save Changes" }}
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { saveRoleService } from "@/services/role/role.service";
import { useRoleStore } from "@/stores/roleStore";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

interface Role {
  id: number;
  roleName: string;
  isActive: boolean;
}

const searchText = ref("");
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRoleId = ref<number | null>(null);
const submitting = ref(false);
const formRef = ref();
const rolesStore = useRoleStore();

const roles = ref<Role[]>([
  {
    id: 1,
    roleName: "Super Admin",
    isActive: true,
  },
  {
    id: 2,
    roleName: "Admin",
    isActive: true,
  },
  {
    id: 3,
    roleName: "Manager",
    isActive: true,
  },
  {
    id: 4,
    roleName: "User",
    isActive: true,
  },
  {
    id: 5,
    roleName: "Guest",
    isActive: false,
  },
]);

const formState = reactive({
  roleName: "",
  isActive: true,
});

const rules = {
  roleName: [{ required: true, message: "Please enter role name" }],
};

const columns = [
  { title: "SL No", key: "id", width: 80 },
  {
    title: "Role Name",
    key: "roleName",
    sorter: (a: Role, b: Role) => a.roleName.localeCompare(b.roleName),
  },
  { title: "Status", key: "isActive" },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    align: "center",
  },
];

onMounted(() => {
  rolesStore.fetchAllRoles();
});

const rolePagination = (p: any) =>
  rolesStore.setPagination(p.current, p.pageSize);
const pagination = computed(() => ({
  current: Math.floor(rolesStore.skip / rolesStore.limit) + 1,
  pageSize: rolesStore.limit,
  total: rolesStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} roles found`,
}));

const getRoleColor = (roleName: string) => {
  const colors: Record<string, string> = {
    "Super Admin": "red",
    Admin: "orange",
    Manager: "blue",
    User: "green",
    Guest: "default",
  };
  return colors[roleName] || "default";
};

const showModal = (mode: "add" | "edit", record?: Role) => {
  modalMode.value = mode;
  if (mode === "add") {
    Object.assign(formState, {
      roleName: "",
      description: "",
      isActive: true,
    });
    currentRoleId.value = null;
  } else if (mode === "edit" && record) {
    Object.assign(formState, {
      roleName: record.roleName,
      isActive: record.isActive,
    });
    currentRoleId.value = record.id;
  }
  modalVisible.value = true;
};

const showDeleteConfirm = (record: Role) => {
  Modal.confirm({
    title: "Are you sure you want to delete this role?",
    content: `You are about to delete "${record.roleName}". This will affect  users.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      roles.value = roles.value.filter((r) => r.id !== record.id);
      message.success("Role deleted successfully");
    },
  });
};

const handleModalSubmit = () => {
  formRef.value.validate().then(async () => {
    submitting.value = true;
    const payload = {
      id: currentRoleId.value,
      roleName: formState.roleName,
      isActive: formState.isActive,
    };
    // Simulate API call
    try {
      await saveRoleService(payload, modalMode.value === "edit");
      message.success(
        modalMode.value === "edit"
          ? "Role updated successfully"
          : "Role created successfully"
      );

      // refresh Roles list
      await rolesStore.fetchAllRoles();
      modalVisible.value = false;
      submitting.value = false;
    } catch (error) {
      console.error("API error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      submitting.value = false;
    }
  });
};
</script>

<!-- <style scoped>
@import "../styles/role-management.css";
</style> -->
