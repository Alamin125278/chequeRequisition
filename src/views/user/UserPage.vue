<template>
  <div class="bg-background min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <UsergroupAddOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                User Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all system users in one centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add New User
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Simplified Stats Section -->
    <div class="max-w-7xl py-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Users Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent bg-opacity-10 rounded-md p-3">
                <UsergroupAddOutlined class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Total Users
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ users.length }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Users Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 bg-success bg-opacity-10 rounded-md p-3"
              >
                <CheckCircleOutlined class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Active Users
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ activeUsers }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Inactive Users Card -->
        <div class="bg-card overflow-hidden shadow-md rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-error-light rounded-md p-3">
                <CloseCircleOutlined class="h-6 w-6 text-error" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-secondary truncate">
                    Inactive Users
                  </dt>
                  <dd>
                    <div class="text-2xl font-semibold text-primary">
                      {{ inactiveUsers }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Table Section -->
    <div class="max-w-7xl pb-8">
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-primary">All Users List</h2>
              <p class="mt-1 text-sm text-secondary">
                A complete list of all system users
              </p>
            </div>
            <div
              class="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3"
            >
              <a-select
                v-model:value="roleFilter"
                placeholder="Filter by Role"
                class="w-full sm:w-40"
                allowClear
                @change="handleRoleFilterChange"
              >
                <a-select-option value="All">All Users</a-select-option>
                <a-select-option value="BankAdmin">Bank Admin</a-select-option>
                <a-select-option value="BranchUser"
                  >Branch User</a-select-option
                >
                <a-select-option value="BranchOfficer"
                  >Branch Officer</a-select-option
                >
                <a-select-option value="VendorAdmin"
                  >Vendor Admin</a-select-option
                >
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search users..."
                class="w-full sm:w-64"
                @search="onSearch"
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
          :dataSource="filteredUsers"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total:any) => `Total ${total} users`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }"
          :loading="loading"
          :rowClassName="() => 'hover:bg-background'"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- User Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="flex items-center">
                <a-avatar
                  :src="record.ImagePath || ''"
                  :style="{
                    backgroundColor: !record.ImagePath
                      ? 'var(--accent-cta)'
                      : 'transparent',
                  }"
                  class="mr-3"
                >
                  {{
                    !record.ImagePath ? record.Name.charAt(0).toUpperCase() : ""
                  }}
                </a-avatar>
                <span class="font-medium">{{ record.Name }}</span>
              </div>
            </template>

            <!-- Role Column -->
            <template v-if="column.key === 'role'">
              <a-tag
                :color="getRoleColor(record.Role)"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.Role }}
              </a-tag>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag
                :color="record.IsActive ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.IsActive ? "Active" : "Inactive" }}
              </a-tag>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="flex justify-center space-x-2">
                <a-tooltip title="Change Password">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                    @click="showPasswordModal(record)"
                  >
                    <LockOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Edit User">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete User">
                  <a-popconfirm
                    title="Are you sure you want to delete this user?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteUser(record.id)"
                  >
                    <a-button
                      type="primary"
                      shape="circle"
                      danger
                      class="flex items-center justify-center"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </a-popconfirm>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- User Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'add' ? 'Add New User' : 'Edit User'"
      :width="720"
      :footer="null"
      class="user-modal"
    >
      <div class="p-4">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Basic Information
            </h3>

            <!-- Role Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <a-form-item label="Role" name="role">
                <a-select
                  v-model:value="formState.role"
                  placeholder="Select role"
                  class="rounded-md w-full"
                  @change="handleRoleChange"
                >
                  <a-select-option value="BankAdmin"
                    >Bank Admin</a-select-option
                  >
                  <a-select-option value="BranchUser"
                    >Branch User</a-select-option
                  >
                  <a-select-option value="BranchOfficer"
                    >Branch Officer</a-select-option
                  >
                  <a-select-option value="VendorAdmin"
                    >Vendor Admin</a-select-option
                  >
                </a-select>
              </a-form-item>

              <a-form-item label="Status" name="isActive">
                <a-select
                  v-model:value="formState.isActive"
                  placeholder="Select status"
                  class="rounded-md w-full"
                >
                  <a-select-option :value="true">Active</a-select-option>
                  <a-select-option :value="false">Inactive</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Bank and Branch Selection (conditional based on role) -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4"
              v-if="showBankField"
            >
              <a-form-item label="Bank" name="bankAdmin">
                <a-select
                  v-model:value="formState.bankAdmin"
                  placeholder="Select bank"
                  class="rounded-md w-full"
                  :disabled="formState.role === 'VendorAdmin'"
                >
                  <a-select-option
                    v-for="bank in banks"
                    :key="bank.id"
                    :value="bank.id"
                  >
                    {{ bank.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Branch"
                name="branchId"
                v-if="showBranchField"
              >
                <a-select
                  v-model:value="formState.branchId"
                  placeholder="Select branch"
                  class="rounded-md w-full"
                >
                  <a-select-option
                    v-for="branch in branches"
                    :key="branch.id"
                    :value="branch.id"
                  >
                    {{ branch.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- User Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <a-form-item label="Full Name" name="name">
                <a-input
                  v-model:value="formState.name"
                  placeholder="Enter full name"
                  class="rounded-md"
                >
                  <template #prefix>
                    <UserOutlined class="text-secondary" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="Email" name="email">
                <a-input
                  v-model:value="formState.email"
                  placeholder="Enter email"
                  type="email"
                  class="rounded-md"
                >
                  <template #prefix>
                    <MailOutlined class="text-secondary" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <a-form-item label="Username" name="userName">
                <a-input
                  v-model:value="formState.userName"
                  placeholder="Enter username"
                  class="rounded-md"
                >
                  <template #prefix>
                    <UserOutlined class="text-secondary" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="Profile Image" name="imagePath">
                <div class="profile-image-upload">
                  <a-upload
                    v-model:fileList="fileList"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    @change="handleImageChange"
                    class="rounded-md overflow-hidden"
                  >
                    <div v-if="imageUrl" class="image-preview">
                      <img :src="imageUrl" alt="avatar" class="preview-img" />
                      <div class="image-overlay">
                        <UploadOutlined />
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <PlusOutlined />
                      <div class="upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <span class="upload-hint">Max 2MB (JPG/PNG)</span>
                </div>
              </a-form-item>
            </div>

            <!-- Password fields (only for create mode) -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
              v-if="modalMode === 'add'"
            >
              <a-form-item label="Password" name="password">
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="Enter password"
                  class="rounded-md"
                >
                  <template #prefix>
                    <LockOutlined class="text-secondary" />
                  </template>
                </a-input-password>
              </a-form-item>

              <a-form-item label="Confirm Password" name="confirmPassword">
                <a-input-password
                  v-model:value="formState.confirmPassword"
                  placeholder="Confirm password"
                  class="rounded-md"
                >
                  <template #prefix>
                    <LockOutlined class="text-secondary" />
                  </template>
                </a-input-password>
              </a-form-item>
            </div>
          </div>

          <!-- Menu Permissions Section -->
          <div class="mb-4">
            <h3
              class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
            >
              Menu Permissions
            </h3>
            <div class="bg-background p-4 rounded-md">
              <a-checkbox-group v-model:value="formState.permissions">
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  <div
                    v-for="(permission, index) in availablePermissions"
                    :key="index"
                    class="permission-item"
                  >
                    <a-checkbox :value="permission.value">
                      {{ permission.label }}
                    </a-checkbox>
                  </div>
                </div>
              </a-checkbox-group>
            </div>
          </div>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="modalVisible = false"> Cancel </a-button>
            <a-button
              type="primary"
              @click="handleModalSubmit"
              :loading="submitting"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              {{ modalMode === "add" ? "Create User" : "Save Changes" }}
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>

    <!-- Change Password Modal -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="Change Password"
      :width="500"
      :footer="null"
      class="password-modal"
    >
      <div class="p-4">
        <p class="mb-4 text-secondary">
          Update password for
          <span class="font-medium text-primary">{{
            currentPasswordUser?.Name
          }}</span>
        </p>

        <a-form
          :model="passwordForm"
          layout="vertical"
          :rules="passwordRules"
          ref="passwordFormRef"
        >
          <a-form-item label="New Password" name="newPassword">
            <a-input-password
              v-model:value="passwordForm.newPassword"
              placeholder="Enter new password"
              class="rounded-md"
            >
              <template #prefix>
                <LockOutlined class="text-secondary" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item label="Confirm New Password" name="confirmPassword">
            <a-input-password
              v-model:value="passwordForm.confirmPassword"
              placeholder="Confirm new password"
              class="rounded-md"
            >
              <template #prefix>
                <LockOutlined class="text-secondary" />
              </template>
            </a-input-password>
          </a-form-item>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="passwordModalVisible = false"> Cancel </a-button>
            <a-button
              type="primary"
              @click="handlePasswordChange"
              :loading="passwordSubmitting"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              Update Password
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue";
import { computed, reactive, ref, watch } from "vue";

// Search and filter states
const searchText = ref("");
const roleFilter = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentUserId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();
const imageUrl = ref("");
const fileList = ref([]);

// Password modal states
const passwordModalVisible = ref(false);
const passwordSubmitting = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
});
const currentPasswordUser = ref(null);

// Form state for modal
const formState = reactive({
  name: "",
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
  role: "",
  bankAdmin: null,
  branchId: null,
  imagePath: "",
  isActive: true,
  permissions: [], // Added for menu permissions
});

// Available permissions for menu access
const availablePermissions = [
  { label: "Dashboard", value: "dashboard" },
  { label: "User Management", value: "user_management" },
  { label: "Branch Management", value: "branch_management" },
  { label: "Customer Management", value: "customer_management" },
  { label: "Transaction History", value: "transaction_history" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
  { label: "Audit Logs", value: "audit_logs" },
  { label: "System Configuration", value: "system_config" },
  { label: "Vendor Management", value: "vendor_management" },
  { label: "API Access", value: "api_access" },
  { label: "Notifications", value: "notifications" },
];

// Computed properties for conditional field display
const showBankField = computed(() => {
  return formState.role !== "VendorAdmin";
});

const showBranchField = computed(() => {
  return formState.role !== "BankAdmin" && formState.role !== "VendorAdmin";
});

// Watch for role changes to reset dependent fields
watch(
  () => formState.role,
  (newRole) => {
    if (newRole === "BankAdmin") {
      formState.branchId = null;
    }
    if (newRole === "VendorAdmin") {
      formState.bankAdmin = null;
      formState.branchId = null;
    }
  }
);

// Form validation rules
const rules = {
  name: [{ required: true, message: "Please enter full name" }],
  email: [
    { required: true, message: "Please enter email" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  userName: [{ required: true, message: "Please enter username" }],
  password: [
    {
      required: true,
      message: "Please enter password",
      validator: (rule: any, value: any) => {
        if (modalMode.value === "add" && !value) {
          return Promise.reject("Please enter password");
        }
        return Promise.resolve();
      },
    },
  ],
  confirmPassword: [
    {
      validator: (rule: any, value: any) => {
        if (modalMode.value === "add") {
          if (!value) {
            return Promise.reject("Please confirm your password");
          }
          if (value !== formState.password) {
            return Promise.reject("Passwords do not match");
          }
        }
        return Promise.resolve();
      },
    },
  ],
  role: [{ required: true, message: "Please select a role" }],
  bankAdmin: [
    {
      validator: (rule: any, value: any) => {
        if (
          (formState.role === "BankAdmin" ||
            formState.role === "BranchUser" ||
            formState.role === "BranchOfficer") &&
          !value
        ) {
          return Promise.reject("Please select a bank");
        }
        return Promise.resolve();
      },
    },
  ],
  branchId: [
    {
      validator: (rule: any, value: any) => {
        if (
          (formState.role === "BranchUser" ||
            formState.role === "BranchOfficer") &&
          !value
        ) {
          return Promise.reject("Please select a branch");
        }
        return Promise.resolve();
      },
    },
  ],
};

// Password validation rules
const passwordRules = {
  newPassword: [
    { required: true, message: "Please enter new password" },
    { min: 6, message: "Password must be at least 6 characters" },
  ],
  confirmPassword: [
    { required: true, message: "Please confirm your password" },
    {
      validator: (rule: any, value: any) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject("Passwords do not match");
        }
        return Promise.resolve();
      },
    },
  ],
};

// Table columns
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "name",
  },
  {
    title: "Username",
    dataIndex: "UserName",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "Email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "Role",
    key: "role",
  },
  {
    title: "Bank",
    dataIndex: "BankName",
    key: "bank",
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "branch",
  },
  {
    title: "Status",
    dataIndex: "IsActive",
    key: "status",
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 150,
    align: "center",
  },
];

// Sample data for users
const users = ref([
  {
    id: 1,
    Name: "John Doe",
    Email: "john.doe@example.com",
    UserName: "johndoe",
    ImagePath: "",
    Role: "BankAdmin",
    BankId: 1,
    BankName: "Public Bank",
    BranchId: null,
    BranchName: null,
    IsActive: true,
    Permissions: [
      "dashboard",
      "user_management",
      "branch_management",
      "reports",
    ],
  },
  {
    id: 2,
    Name: "Jane Smith",
    Email: "jane.smith@example.com",
    UserName: "janesmith",
    ImagePath: "",
    Role: "BranchUser",
    BankId: 1,
    BankName: "Public Bank",
    BranchId: 1,
    BranchName: "Main Branch",
    IsActive: true,
    Permissions: ["dashboard", "customer_management"],
  },
  {
    id: 3,
    Name: "Robert Johnson",
    Email: "robert@example.com",
    UserName: "robertj",
    ImagePath: "",
    Role: "BranchOfficer",
    BankId: 2,
    BankName: "Commercial Bank",
    BranchId: 3,
    BranchName: "Downtown Branch",
    IsActive: false,
    Permissions: ["dashboard", "transaction_history"],
  },
  {
    id: 4,
    Name: "Sarah Williams",
    Email: "sarah@example.com",
    UserName: "sarahw",
    ImagePath: "",
    Role: "VendorAdmin",
    BankId: null,
    BankName: null,
    BranchId: null,
    BranchName: null,
    IsActive: true,
    Permissions: ["dashboard", "vendor_management", "api_access"],
  },
]);

// Sample data for banks and branches
const banks = [
  { id: 1, name: "Public Bank" },
  { id: 2, name: "Commercial Bank" },
  { id: 3, name: "City Bank" },
];

const branches = [
  { id: 1, name: "Main Branch", bankId: 1 },
  { id: 2, name: "North Branch", bankId: 1 },
  { id: 3, name: "Downtown Branch", bankId: 2 },
  { id: 4, name: "East Branch", bankId: 2 },
  { id: 5, name: "Central Branch", bankId: 3 },
];

// Computed properties
const activeUsers = computed(() => {
  return users.value.filter((user) => user.IsActive).length;
});

const inactiveUsers = computed(() => {
  return users.value.filter((user) => !user.IsActive).length;
});

// Filtered data based on search and filters
const filteredUsers = computed(() => {
  let result = [...users.value];

  // Apply role filter
  if (roleFilter.value) {
    if (roleFilter.value === "All") {
      result = result;
    } else {
      result = result.filter((item) => item.Role === roleFilter.value);
    }
  }

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.Name.toLowerCase().includes(search) ||
        item.UserName.toLowerCase().includes(search) ||
        item.Email.toLowerCase().includes(search) ||
        (item.BankName && item.BankName.toLowerCase().includes(search)) ||
        (item.BranchName && item.BranchName.toLowerCase().includes(search))
    );
  }

  return result;
});

// Get color for role tag
const getRoleColor = (role: any) => {
  const roleColors = {
    BankAdmin: "blue",
    BranchUser: "green",
    BranchOfficer: "purple",
    VendorAdmin: "orange",
  };
  return roleColors[role] || "default";
};

// Search function
const onSearch = (value: any) => {
  searchText.value = value;
  simulateLoading();
};

// Role filter change
const handleRoleFilterChange = () => {
  simulateLoading();
};

// Role change in form
const handleRoleChange = (value: any) => {
  formState.role = value;
};

// Simulate loading for better UX
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// Image upload handling
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    console.error("You can only upload JPG/PNG file!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    console.error("Image must be smaller than 2MB!");
    return false;
  }
  return false; // Return false to prevent auto upload
};

const handleImageChange = (info: any) => {
  if (info.file.status === "uploading") {
    return;
  }
  if (info.file.status === "done") {
    // This would normally be handled by your backend
    // For demo purposes, we're just using a local URL
    getBase64(info.file.originFileObj, (url: any) => {
      imageUrl.value = url;
      formState.imagePath = url; // In real app, this would be the path returned from server
    });
  }
};

const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

// Show modal for adding or editing
const showModal = (mode: any, record = null) => {
  modalMode.value = mode;

  if (mode === "add") {
    // Reset form for adding new user
    Object.assign(formState, {
      name: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      role: "",
      bankAdmin: null,
      branchId: null,
      imagePath: "",
      isActive: true,
      permissions: [],
    });
    imageUrl.value = "";
    fileList.value = [];
    currentUserId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with user data for editing
    Object.assign(formState, {
      name: record.Name,
      email: record.Email,
      userName: record.UserName,
      password: "", // Don't populate password for security
      confirmPassword: "",
      role: record.Role,
      bankAdmin: record.BankId,
      branchId: record.BranchId,
      imagePath: record.ImagePath,
      isActive: record.IsActive,
      permissions: record.Permissions || [],
    });
    imageUrl.value = record.ImagePath || "";
    fileList.value = record.ImagePath
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: record.ImagePath,
          },
        ]
      : [];
    currentUserId.value = record.id;
  }

  modalVisible.value = true;
};

// Show password change modal
const showPasswordModal = (record: any) => {
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  currentPasswordUser.value = record;
  passwordModalVisible.value = true;
};

// Handle password change
const handlePasswordChange = () => {
  passwordFormRef.value
    .validate()
    .then(() => {
      passwordSubmitting.value = true;

      // Simulate API call
      setTimeout(() => {
        console.log(
          "Changing password for user:",
          currentPasswordUser.value.id
        );
        console.log("New password:", passwordForm.newPassword);

        // In a real app, you would make an API call here

        passwordSubmitting.value = false;
        passwordModalVisible.value = false;

        // Show success message
        // This would be replaced with your notification system
        alert("Password changed successfully");
      }, 1000);
    })
    .catch((error) => {
      console.log("Validation failed:", error);
    });
};

// Handle modal submit
const handleModalSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      submitting.value = true;

      // Simulate API call
      setTimeout(() => {
        const userData = {
          Name: formState.name,
          Email: formState.email,
          UserName: formState.userName,
          Role: formState.role,
          BankId: formState.bankAdmin,
          BankName: formState.bankAdmin
            ? banks.find((b) => b.id === formState.bankAdmin)?.name
            : null,
          BranchId: formState.branchId,
          BranchName: formState.branchId
            ? branches.find((b) => b.id === formState.branchId)?.name
            : null,
          ImagePath: formState.imagePath,
          IsActive: formState.isActive,
          Permissions: formState.permissions,
        };

        if (modalMode.value === "add") {
          // Add password for new user
          userData.PasswordHash = formState.password;

          // Logic to add new user
          console.log("Adding new user:", userData);

          // In a real app, you would make an API call here
          // After successful API call, add the new user to the list
          const newUser = {
            id: users.value.length + 1,
            ...userData,
          };
          users.value.push(newUser);
        } else {
          // Logic to update existing user
          console.log("Updating user ID:", currentUserId.value, userData);

          // In a real app, you would make an API call here
          // After successful API call, update the user in the list
          const index = users.value.findIndex(
            (u) => u.id === currentUserId.value
          );
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              ...userData,
            };
          }
        }

        submitting.value = false;
        modalVisible.value = false;
      }, 1000);
    })
    .catch((error) => {
      console.log("Validation failed:", error);
    });
};

// Delete user
const deleteUser = (userId) => {
  console.log("Deleting user:", userId);

  // In a real app, you would make an API call here
  // After successful API call, remove the user from the list
  users.value = users.value.filter((user) => user.id !== userId);
};
</script>

<style>
:root {
  /* Color Palette */
  --primary-ui: #2e2e2e;
  --accent-cta: #6b8e23;
  --success: #228b22;
  --error: #c0392b;
  --error-light: #fadbd8;
  --background: #f5f5f5;
  --card-bg: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6e6e6e;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

/* Custom colors */
.bg-primary {
  background-color: var(--primary-ui) !important;
}

.bg-accent {
  background-color: var(--accent-cta) !important;
}

.bg-success {
  background-color: var(--success) !important;
}

.bg-error {
  background-color: var(--error) !important;
}

.bg-error-light {
  background-color: var(--error-light) !important;
}

.bg-background {
  background-color: var(--background) !important;
}

.bg-card {
  background-color: var(--card-bg) !important;
}

.text-primary {
  color: var(--text-primary) !important;
}

.text-secondary {
  color: var(--text-secondary) !important;
}

.text-accent {
  color: var(--accent-cta) !important;
}

.text-success {
  color: var(--success) !important;
}

.text-error {
  color: var(--error) !important;
}

.border-accent {
  border-color: var(--accent-cta) !important;
}

.bg-accent-dark {
  background-color: #5a7a1f !important;
}

.border-accent-dark {
  border-color: #5a7a1f !important;
}

/* Custom table styles */
.custom-table .ant-table-thead > tr > th {
  background-color: var(--background);
  font-weight: 600;
  color: var(--text-primary);
  padding: 16px;
}

.custom-table .ant-table-tbody > tr > td {
  padding: 16px;
  color: var(--text-primary);
}

.custom-table .ant-table-tbody > tr:hover > td {
  background-color: var(--background);
}

/* Custom modal styles */
.user-modal .ant-modal-content,
.password-modal .ant-modal-content {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.user-modal .ant-modal-header,
.password-modal .ant-modal-header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.user-modal .ant-modal-title,
.password-modal .ant-modal-title {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
}

/* Custom form styles */
.ant-form-item-label > label {
  font-weight: 500;
  color: var(--text-primary);
}

.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover {
  border-color: var(--accent-cta) !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 139, 34, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
}

.ant-tag-error {
  background-color: var(--error-light) !important;
  border-color: var(--error) !important;
  color: var(--error) !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  background-color: var(--accent-cta) !important;
  border-color: var(--accent-cta) !important;
  border-radius: var(--radius-md) !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #5a7a1f !important;
  border-color: #5a7a1f !important;
}

/* Exception for danger buttons */
.ant-btn-dangerous.ant-btn-primary {
  background-color: var(--error) !important;
  border-color: var(--error) !important;
}

.ant-btn-dangerous.ant-btn-primary:hover,
.ant-btn-dangerous.ant-btn-primary:focus {
  background-color: #a93226 !important;
  border-color: #a93226 !important;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: var(--shadow-sm) !important;
}

.shadow-md {
  box-shadow: var(--shadow-md) !important;
}

.shadow-lg {
  box-shadow: var(--shadow-lg) !important;
}

/* Rounded utilities */
.rounded-sm {
  border-radius: var(--radius-sm) !important;
}

.rounded-md {
  border-radius: var(--radius-md) !important;
}

.rounded-lg {
  border-radius: var(--radius-lg) !important;
}

/* Center icons in buttons */
.ant-btn-circle {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Profile Image Upload */
.profile-image-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-preview {
  position: relative;
  width: 104px;
  height: 104px;
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 1.25rem;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  border-radius: var(--radius-sm);
  border: 1px dashed #d1d5db;
  background-color: var(--background);
  color: var(--text-secondary);
}

.upload-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Permission item */
.permission-item {
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  border-radius: var(--radius-sm);
}

.permission-item:hover {
  background-color: rgba(107, 142, 35, 0.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }

  .ant-btn-circle {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.875rem !important;
  }
}
</style>
