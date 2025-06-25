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
                      {{ totalUser }}
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
                      {{ activeUser }}
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
                      {{ totalUser - activeUser }}
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
                v-model:value="userStore.status"
                placeholder="Filter by status"
                class="w-40"
                @change="userStore.setStatus"
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="Active">Active</a-select-option>
                <a-select-option value="InActive">Inactive</a-select-option>
              </a-select>
              <a-select
                v-model:value="userStore.role"
                placeholder="Filter by Role"
                class="w-full sm:w-40"
                allowClear
                @change="userStore.setRole"
              >
                <a-select-option value="">All Role</a-select-option>
                <a-select-option
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                  >{{ role.roleName }}</a-select-option
                >
              </a-select>
              <a-input-search
                v-model:value="searchText"
                placeholder="Search users..."
                class="w-full sm:w-64"
                @search="userStore.setSearch"
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
          :dataSource="userStore.users"
          :columns="columns"
          :pagination="pagination"
          @change="(p: any) => userStore.setPagination(p.current, p.pageSize)"
          :loading="loading"
          :rowClassName="() => 'hover:bg-background'"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- User Name Column -->
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'name'">
              <div class="flex items-center">
                <a-avatar
                  :src="baseConfig.BaseURL + record.imagePath"
                  :style="{
                    backgroundColor:
                      record.imagePath == null
                        ? 'var(--accent-cta)'
                        : 'transparent',
                  }"
                >
                  {{
                    record.imagePath == null
                      ? record.name.charAt(0).toUpperCase()
                      : ""
                  }}
                </a-avatar>
                <span class="font-medium ml-2">{{ record.name }}</span>
              </div>
            </template>

            <!-- Role Column -->
            <template v-if="column.key === 'role'">
              <a-tag
                :color="getRoleColor(record.role)"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.roleName }}
              </a-tag>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'IsActive'">
              <a-tag
                :color="record.isActive == true ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.isActive == true ? "Active" : "Inactive" }}
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
                  <a-select-option value="">Select Role</a-select-option>
                  <a-select-option
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.id"
                    >{{ role.roleName }}</a-select-option
                  >
                </a-select>
              </a-form-item>

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
            </div>

            <!-- Bank and Branch Selection (conditional based on role) -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4"
              v-if="showBankField"
            >
              <a-form-item label="Bank" name="bankId">
                <template v-if="banks.length === 1">
                  <a-input
                    :value="banks[0].bankName"
                    disabled
                    class="w-full"
                    style="background-color: #fff; color: #000; cursor: default"
                  />
                </template>
                <!-- If more than 1, show dropdown -->
                <template v-else>
                  <a-select
                    v-model:value="formState.bankId"
                    placeholder="Select bank"
                    class="rounded-md w-full"
                    @change="handleBankChange"
                    :disabled="formState.role === '1' || formState.role === '2'"
                  >
                    <a-select-option value="">Select bank</a-select-option>
                    <a-select-option
                      v-for="bank in banks"
                      :key="bank.id"
                      :value="bank.id"
                    >
                      {{ bank.bankName }}
                    </a-select-option>
                  </a-select>
                </template>
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
                  <a-select-option value="">Select branch</a-select-option>
                  <a-select-option
                    v-for="branch in branches"
                    :key="branch.id"
                    :value="branch.id"
                  >
                    {{ branch.branchName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- User Details -->
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
              <a-form-item label="Status" name="isActive">
                <a-select
                  v-model:value="formState.isActive"
                  placeholder="Select status"
                  class="rounded-md w-full"
                >
                  <a-select-option value="Active">Active</a-select-option>
                  <a-select-option value="InActive">Inactive</a-select-option>
                </a-select>
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
          <span class="font-medium text-primary">
            {{ currentPasswordUser?.name }}
          </span>
        </p>

        <a-form
          :model="passwordForm"
          layout="vertical"
          :rules="passwordRules"
          ref="passwordFormRef"
        >
          <a-form-item label="Current Password" name="oldPassword">
            <a-input-password
              v-model:value="passwordForm.oldPassword"
              placeholder="Enter current password"
              class="rounded-md"
            >
              <template #prefix>
                <LockOutlined class="text-secondary" />
              </template>
            </a-input-password>
          </a-form-item>

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
              @click="handlePasswordChange(currentPasswordUser)"
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
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";
import { getBranchForUserService } from "../../services/branch/branch.service";
import { getRoleForUserService } from "../../services/role/role.service";

// Search and filter states
const searchText = ref("");
const roleFilter = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentUserId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();
const fileList = ref<UploadFile[]>([]);
const imageUrl = ref<string | null>(null);
const totalUser = ref<number>(0);
const activeUser = ref<number>(0);

interface Role {
  id: number;
  roleName: string;
}
interface Bank {
  id: number;
  bankName: string;
}
interface Branch {
  id: number;
  branchName: string;
}
const roles = ref<Role[]>([]);
const banks = ref<Bank[]>([]);
const branches = ref<Branch[]>([]);

// Password modal states
const passwordModalVisible = ref(false);
const passwordSubmitting = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
interface User {
  id: number;
  name: string;
}
const currentPasswordUser = ref<User | null>(null);
// Get Role info from user
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

// Get All Bank for User
const featchBanks = async () => {
  loading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
    if (result.length === 1) {
      formState.bankId = result[0].id;
    }
  } catch (e) {
    console.error("Error fetching banks", e);
  } finally {
    loading.value = false;
  }
};
//  Get All Branch for User
const featchBranches = async (bankId: number) => {
  loading.value = true;
  try {
    const result = await getBranchForUserService(bankId);
    branches.value = result;
  } catch (e) {
    console.error("Error fetching branches", e);
  } finally {
    loading.value = false;
  }
};

// Form state for modal
const formState = reactive({
  name: "",
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
  role: null,
  branchId: null,
  imagePath: "",
  bankId: null,
  vendorId: null,
  isActive: "",
});
const handleBankChange = async () => {
  const bankId = Number(formState.bankId);
  await featchBranches(bankId);
};

// Computed properties for conditional field display
const showBankField = computed(() => {
  return formState.role !== 1 && formState.role !== 2 && formState.role !== "";
});

const showBranchField = computed(() => {
  return (
    formState.role !== 1 &&
    formState.role !== 2 &&
    formState.role !== 3 &&
    formState.role !== ""
  );
});

// Watch for role changes to reset dependent fields
watch(
  () => formState.role,
  (newRole) => {
    if (newRole === 3) {
      formState.branchId = null;
    }
    if (newRole === 1 || newRole === 2) {
      formState.bankId = null;
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
  bankId: [
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
  oldPassword: [{ required: true, message: "Please enter current password" }],
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
    title: "Sl.No",
    key: "id",
    width: 70,
    align: "center",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Username",
    dataIndex: "userName",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "roleName",
    key: "role",
  },
  {
    title: "Bank",
    dataIndex: "bankName",
    key: "bank",
  },
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branch",
  },
  {
    title: "Status",
    dataIndex: "IsActive",
    key: "IsActive",
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 150,
    align: "center",
  },
];
// User Count
const fetchUserCounts = async () => {
  try {
    const res = await getUserCountService();
    totalUser.value = res.data.totalUser;
    activeUser.value = res.data.activeUser;
  } catch (error) {
    console.error("Error fetching User count:", error);
  }
};

// Get data for users
const userStore = useUserStore();
onMounted(async () => {
  userStore.fetchUsers();
  await featchRoole();
  await fetchUserCounts();
});
const pagination = computed(() => ({
  current: Math.floor(userStore.skip / userStore.limit) + 1,
  pageSize: userStore.limit,
  total: userStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: any) => `Total ${total} users`,
}));
// Get color for role tag
const getRoleColor = (role: number) => {
  const roleColors: Record<number, string> = {
    1: "yellow",
    2: "orange",
    3: "blue",
    4: "green",
    5: "purple",
  };
  return roleColors[role] || "grey";
};

// Role change in form
const handleRoleChange = (value: any) => {
  formState.role = value;
  handleBankChange();
};

// Simulate loading for better UX
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// Image upload handling
import {
  message,
  Modal,
  type UploadChangeParam,
  type UploadFile,
} from "ant-design-vue";
import baseConfig from "../../config/base-config";
import { uploadImageService } from "../../services/image/image.service";
import {
  changePasswordService,
  deleteUserService,
  getUserCountService,
  saveUserService,
} from "../../services/user/user.service";
import { useUserStore } from "../../stores/userStore";
const isImageChanged = ref(false);

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
    return false;
  }
  return true; // allow upload to proceed
};

const handleImageChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    return;
  }

  const file = info.file.originFileObj;

  try {
    if (file) {
      imageUrl.value = URL.createObjectURL(file);
      fileList.value = [info.file]; // single image upload
      isImageChanged.value = true;
    }
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};

// Show modal for adding or editing
const showModal = (mode: any, record?: any) => {
  modalMode.value = mode;
  featchRoole();
  featchBanks();

  if (mode === "add") {
    // Reset form for adding new user
    Object.assign(formState, {
      name: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      role: "",
      bankId: null,
      branchId: "",
      imagePath: "",
      isActive: "Active",
    });
    imageUrl.value = "";
    fileList.value = [];
    currentUserId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with user data for editing\
    featchBranches(record.bankId);
    var activeStatus = "";
    if (record.isActive === true) {
      activeStatus = "Active";
    } else {
      activeStatus = "InActive";
    }
    Object.assign(formState, {
      name: record.name,
      email: record.email,
      userName: record.userName,
      role: record.role,
      bankId: record.bankId,
      branchId: record.branchId,
      imagePath: record.imagePath,
      isActive: activeStatus,
    });
    imageUrl.value = baseConfig.BaseURL + record.imagePath || "";
    fileList.value = record.imagePath
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
const showPasswordModal = (record: User) => {
  passwordForm.oldPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  currentPasswordUser.value = record;
  passwordModalVisible.value = true;
};

// Handle password change
const handlePasswordChange = (currentPasswordUser: any) => {
  passwordFormRef.value
    .validate()
    .then(async () => {
      passwordSubmitting.value = true;

      const payload = {
        id: currentPasswordUser.id,
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };
      try {
        var response = await changePasswordService(payload);
        console.log(response);
        if (response.status === 200) {
          message.success(
            response.data?.message || "Password changed successfully"
          );
        } else {
          message.error(response.data?.message || "Failed to change password");
        }
        passwordSubmitting.value = false;
        passwordModalVisible.value = false;
        await userStore.fetchUsers();
      } catch (error: any) {
        if (error?.response?.data?.message) {
          message.error(error.response.data.message);
        } else {
          message.error("Something went wrong. Please try again.");
        }
      } finally {
        passwordSubmitting.value = false;
      }
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};

// Handle modal submit
const handleModalSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      submitting.value = true;
      let imagePath = "";
      if (fileList.value.length > 0 && isImageChanged.value) {
        const file = fileList.value[0].originFileObj;
        if (file) {
          try {
            const uploadResult = await uploadImageService(file);
            imagePath = uploadResult;
          } catch (uploadError) {
            console.log("Image upload failed", uploadError);
            message.error("Image upload failed. Please try again.");
            // submitting.value = false;
            // modalVisible.value = false;
            return;
          }
        }
      } else {
        imagePath = formState.imagePath;
      }

      const payload = {
        id: currentUserId.value, // required for update
        name: formState.name,
        email: formState.email,
        userName: formState.userName,
        passwordHash: formState.password,
        role: formState.role,
        bankId: formState.bankId,
        branchId: formState.branchId,
        vendorId: formState.vendorId,
        imagePath: imagePath,
        isActive: formState.isActive,
      };

      // Simulate API call
      try {
        await saveUserService(payload, modalMode.value === "edit");
        message.success(
          modalMode.value === "edit"
            ? "User updated successfully"
            : "User created successfully"
        );
        // refresh Users list
        await userStore.fetchUsers();
        await fetchUserCounts();
        submitting.value = false;
        modalVisible.value = false;
        isImageChanged.value = false;
      } catch (error: any) {
        console.log("API error:", error);
        message.error("Something went wrong. Please try again.");
      }
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};

// Delete user
// // Show delete confirmation
const showDeleteConfirm = (record: any) => {
  Modal.confirm({
    title: "Are you sure you want to delete this User?",
    content: `You are about to delete "${record.name}". This action cannot be undone.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      await deleteUserService(record.id);
      // refresh Users list
      await userStore.fetchUsers();
      await fetchUserCounts();
      setTimeout(() => {
        message.success("User deleted successfully!");
      }, 1000);
    },
  });
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
