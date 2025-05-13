<template>
  <div
    class="user-management-container"
    :class="{ 'modal-open': modalVisible }"
  >
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-title-container">
          <h1 class="header-title">User Management</h1>
          <p class="header-subtitle">View and manage all system users</p>
        </div>
        <div class="header-actions">
          <a-button
            type="primary"
            class="add-user-btn"
            @click="showModal('add')"
          >
            <template #icon><PlusOutlined /></template>
            Add New User
          </a-button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Total Users</p>
            <p class="stats-value">{{ users.length }}</p>
          </div>
          <div class="stats-icon">
            <UsergroupAddOutlined />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Active Users</p>
            <p class="stats-value">{{ activeUsers }}</p>
          </div>
          <div class="stats-icon stats-icon-navy">
            <CheckCircleOutlined />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Inactive Users</p>
            <p class="stats-value">{{ inactiveUsers }}</p>
          </div>
          <div class="stats-icon stats-icon-red">
            <CloseCircleOutlined />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <div class="table-header">
        <h2 class="table-title">All Users List</h2>
        <div class="table-actions">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search users..."
            class="search-input"
            @search="onSearch"
            allow-clear
          />
          <a-select
            v-model:value="roleFilter"
            placeholder="Filter by Role"
            class="role-filter"
            allowClear
            @change="handleRoleFilterChange"
          >
            <a-select-option value="All">All Users</a-select-option>
            <a-select-option value="BankAdmin">Bank Admin</a-select-option>
            <a-select-option value="BranchUser">Branch User</a-select-option>
            <a-select-option value="BranchOfficer"
              >Branch Officer</a-select-option
            >
            <a-select-option value="VendorAdmin">Vendor Admin</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="table-responsive">
        <a-table
          :dataSource="filteredUsers"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total) => `Total ${total} users`,
          }"
          :loading="loading"
          :rowClassName="rowClassName"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- User Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="user-name-cell">
                <a-avatar
                  :src="record.ImagePath || ''"
                  :style="{
                    backgroundColor: !record.ImagePath
                      ? 'var(--secondary-color)'
                      : 'transparent',
                  }"
                  class="user-avatar"
                >
                  {{
                    !record.ImagePath ? record.Name.charAt(0).toUpperCase() : ""
                  }}
                </a-avatar>
                <span>{{ record.Name }}</span>
              </div>
            </template>

            <!-- Role Column -->
            <template v-if="column.key === 'role'">
              <a-tag :color="getRoleColor(record.Role)">{{
                record.Role
              }}</a-tag>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag :color="record.IsActive ? 'success' : 'error'">
                {{ record.IsActive ? "Active" : "Inactive" }}
              </a-tag>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <a-tooltip title="Change Password">
                  <a-button
                    type="primary"
                    size="small"
                    class="password-btn"
                    @click="showPasswordModal(record)"
                  >
                    <template #icon>
                      <LockOutlined class="btn-icon" />
                    </template>
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Edit User">
                  <a-button
                    type="primary"
                    size="small"
                    class="edit-btn"
                    @click="showModal('edit', record)"
                  >
                    <template #icon>
                      <EditOutlined class="btn-icon" />
                    </template>
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete User">
                  <a-popconfirm
                    title="Are you sure you want to delete this user?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteUser(record.id)"
                  >
                    <a-button type="primary" size="small" class="delete-btn">
                      <template #icon>
                        <DeleteOutlined class="btn-icon" />
                      </template>
                    </a-button>
                  </a-popconfirm>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Enhanced Professional User Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="null"
      :footer="null"
      :width="800"
      :bodyStyle="{ padding: '0' }"
      style="top: 20px"
      :maskClosable="false"
      :zIndex="100"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }"
      class="user-modal"
    >
      <!-- Custom Header -->
      <div class="modal-custom-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <template v-if="modalMode === 'add'">
              <PlusOutlined />
            </template>
            <template v-else>
              <EditOutlined />
            </template>
          </div>
          <div>
            <h3 class="modal-title">
              {{ modalMode === "add" ? "Add New User" : "Edit User" }}
            </h3>
            <p class="modal-subtitle">
              {{
                modalMode === "add"
                  ? "Create a new user with the form below"
                  : "Update user information"
              }}
            </p>
          </div>
        </div>
        <a-button
          type="text"
          @click="modalVisible = false"
          class="modal-close-btn"
        >
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>

      <!-- Form Content -->
      <div class="modal-content">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <div class="form-section">
            <h4 class="form-section-title">Basic Information</h4>

            <!-- Role Selection -->
            <div class="form-row">
              <a-form-item label="Role" name="role" class="form-item">
                <a-select
                  v-model:value="formState.role"
                  placeholder="Select role"
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
              <a-form-item label="Status" name="isActive" class="form-item">
                <a-select
                  v-model:value="formState.isActive"
                  placeholder="Select status"
                >
                  <a-select-option :value="true">Active</a-select-option>
                  <a-select-option :value="false">Inactive</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Bank and Branch Selection (conditional based on role) -->
            <div class="form-row" v-if="showBankField">
              <a-form-item label="Bank" name="bankAdmin" class="form-item">
                <a-select
                  v-model:value="formState.bankAdmin"
                  placeholder="Select bank"
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
                class="form-item"
                v-if="showBranchField"
              >
                <a-select
                  v-model:value="formState.branchId"
                  placeholder="Select branch"
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
            <div class="form-row">
              <a-form-item label="Full Name" name="name" class="form-item">
                <a-input
                  v-model:value="formState.name"
                  placeholder="Enter full name"
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="Email" name="email" class="form-item">
                <a-input
                  v-model:value="formState.email"
                  placeholder="Enter email"
                  type="email"
                >
                  <template #prefix>
                    <MailOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <div class="form-row">
              <a-form-item label="Username" name="userName" class="form-item">
                <a-input
                  v-model:value="formState.userName"
                  placeholder="Enter username"
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                label="Profile Image"
                name="imagePath"
                class="form-item"
              >
                <div class="profile-image-upload">
                  <a-upload
                    v-model:fileList="fileList"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    @change="handleImageChange"
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
            <div class="form-row" v-if="modalMode === 'add'">
              <a-form-item label="Password" name="password" class="form-item">
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="Enter password"
                >
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item
                label="Confirm Password"
                name="confirmPassword"
                class="form-item"
              >
                <a-input-password
                  v-model:value="formState.confirmPassword"
                  placeholder="Confirm password"
                >
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>
            </div>
          </div>

          <!-- Menu Permissions Section -->
          <div class="form-section">
            <h4 class="form-section-title">Menu Permissions</h4>
            <div class="permissions-container">
              <a-checkbox-group v-model:value="formState.permissions">
                <div class="permissions-grid">
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
        </a-form>
      </div>

      <!-- Custom Footer -->
      <div class="modal-footer">
        <a-button @click="modalVisible = false" class="cancel-btn">
          Cancel
        </a-button>
        <a-button type="primary" @click="handleModalSubmit" class="submit-btn">
          <template v-if="submitting">
            <LoadingOutlined />
            {{ modalMode === "add" ? "Creating..." : "Updating..." }}
          </template>
          <template v-else>
            {{ modalMode === "add" ? "Create User" : "Save Changes" }}
          </template>
        </a-button>
      </div>
    </a-modal>

    <!-- Change Password Modal -->
    <a-modal
      v-model:visible="passwordModalVisible"
      :title="null"
      :footer="null"
      :width="500"
      :bodyStyle="{ padding: '0' }"
      :maskClosable="false"
      class="password-modal"
    >
      <!-- Custom Header -->
      <div class="modal-custom-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <LockOutlined />
          </div>
          <div>
            <h3 class="modal-title">Change Password</h3>
            <p class="modal-subtitle">
              Update password for {{ currentPasswordUser?.Name }}
            </p>
          </div>
        </div>
        <a-button
          type="text"
          @click="passwordModalVisible = false"
          class="modal-close-btn"
        >
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>

      <!-- Password Form Content -->
      <div class="modal-content">
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
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item label="Confirm New Password" name="confirmPassword">
            <a-input-password
              v-model:value="passwordForm.confirmPassword"
              placeholder="Confirm new password"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
        </a-form>
      </div>

      <!-- Custom Footer -->
      <div class="modal-footer">
        <a-button @click="passwordModalVisible = false" class="cancel-btn">
          Cancel
        </a-button>
        <a-button
          type="primary"
          @click="handlePasswordChange"
          class="submit-btn"
        >
          <template v-if="passwordSubmitting">
            <LoadingOutlined />
            Updating...
          </template>
          <template v-else> Update Password </template>
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LockOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  UploadOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  BranchesOutlined,
} from "@ant-design/icons-vue";

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

// Function for row class name
const rowClassName = (record, index) => {
  return index % 2 === 0 ? "table-row-light" : "table-row-dark";
};

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
      validator: (rule, value) => {
        if (modalMode.value === "add" && !value) {
          return Promise.reject("Please enter password");
        }
        return Promise.resolve();
      },
    },
  ],
  confirmPassword: [
    {
      validator: (rule, value) => {
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
      validator: (rule, value) => {
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
      validator: (rule, value) => {
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
      validator: (rule, value) => {
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
const getRoleColor = (role) => {
  const roleColors = {
    BankAdmin: "blue",
    BranchUser: "green",
    BranchOfficer: "purple",
    VendorAdmin: "orange",
  };
  return roleColors[role] || "default";
};

// Search function
const onSearch = (value) => {
  searchText.value = value;
  simulateLoading();
};

// Role filter change
const handleRoleFilterChange = () => {
  simulateLoading();
};

// Role change in form
const handleRoleChange = (value) => {
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
const beforeUpload = (file) => {
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

const handleImageChange = (info) => {
  if (info.file.status === "uploading") {
    return;
  }
  if (info.file.status === "done") {
    // This would normally be handled by your backend
    // For demo purposes, we're just using a local URL
    getBase64(info.file.originFileObj, (url) => {
      imageUrl.value = url;
      formState.imagePath = url; // In real app, this would be the path returned from server
    });
  }
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

// Show modal for adding or editing
const showModal = (mode, record) => {
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
const showPasswordModal = (record) => {
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

<style scoped>
/* Base container */
.user-management-container {
  padding: 0;
  background-color: var(--neutral-50);
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  position: relative;
}

/* Header Section */
.header-section {
  background: linear-gradient(
    135deg,
    var(--secondary-color) 0%,
    var(--secondary-light) 100%
  );
  padding: 2rem;
  color: white;
  border-radius: 0 0 1rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.header-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
}

/* Add User Button */
.add-user-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 500;
  height: 40px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.add-user-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
  transform: translateY(-1px);
}

/* Stats Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Stats Card */
.stats-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--secondary-color);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stats-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-label {
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin: 0 0 0.25rem 0;
}

.stats-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--neutral-800);
  margin: 0;
}

/* Stats Icons */
.stats-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: rgba(13, 148, 136, 0.1);
  color: var(--secondary-color);
  font-size: 1.5rem;
}

.stats-icon-navy {
  background-color: rgba(10, 25, 47, 0.1);
  color: var(--primary-color);
}

.stats-icon-red {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Table Section */
.table-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin: 0 1.5rem 1.5rem 1.5rem;
  overflow: hidden;
}

.table-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
}

@media (min-width: 768px) {
  .table-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.table-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .table-actions {
    flex-direction: row;
    width: auto;
  }
}

.search-input {
  width: 100%;
}

@media (min-width: 768px) {
  .search-input {
    width: 250px;
  }
}

.role-filter {
  width: 100%;
}

@media (min-width: 768px) {
  .role-filter {
    width: 180px;
  }
}

.table-responsive {
  overflow-x: auto;
}

/* Custom Table Styling */
:deep(.custom-table .ant-table) {
  background-color: transparent;
}

:deep(.custom-table .ant-table-thead > tr > th) {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  font-weight: 600;
  border-bottom: 2px solid var(--neutral-200);
  padding: 1rem 1rem;
}

:deep(.custom-table .ant-table-tbody > tr > td) {
  padding: 1rem 1rem;
  border-bottom: 1px solid var(--neutral-200);
}

:deep(.table-row-light) {
  background-color: #ffffff;
}

:deep(.table-row-dark) {
  background-color: var(--neutral-50);
}

/* Table hover */
:deep(.custom-table .ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: rgba(10, 25, 47, 0.05) !important;
}

/* Pagination */
:deep(.ant-pagination-item-active) {
  border-color: var(--secondary-color);
}

:deep(.ant-pagination-item-active a) {
  color: var(--secondary-color);
}

/* Search button */
:deep(.ant-input-search-button) {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

:deep(.ant-input-search-button:hover) {
  background-color: var(--secondary-light);
  border-color: var(--secondary-light);
}

/* User Name Cell */
.user-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.password-btn {
  background-color: #4096ff;
  border-color: #4096ff;
}

.password-btn:hover {
  background-color: #1677ff;
  border-color: #1677ff;
}

.edit-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.edit-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

.delete-btn {
  background-color: #ef4444;
  border-color: #ef4444;
}

.delete-btn:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Modal Styling */
.user-modal :deep(.ant-modal-content),
.password-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Enhanced modal mask (backdrop) */
:deep(.ant-modal-mask) {
  background-color: rgba(0, 0, 0, 0.65) !important;
}

/* Modal wrapper */
:deep(.ant-modal-wrap) {
  z-index: 100 !important;
}

.modal-custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--neutral-100);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header-content {
  display: flex;
  align-items: center;
}

/* Modal icon */
.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  margin-right: 1rem;
  font-size: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin: 0.25rem 0 0 0;
}

.modal-close-btn {
  color: var(--neutral-500);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--neutral-200);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-item {
  margin-bottom: 1rem;
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
  border-radius: 0.5rem;
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
  border-radius: 0.5rem;
  border: 1px dashed var(--neutral-300);
  background-color: var(--neutral-50);
  color: var(--neutral-500);
}

.upload-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--neutral-500);
}

/* Permissions Section */
.permissions-container {
  padding: 1rem;
  background-color: var(--neutral-50);
  border-radius: 0.5rem;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .permissions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .permissions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.permission-item {
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
}

.permission-item:hover {
  background-color: var(--neutral-100);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: var(--neutral-100);
  border-top: 1px solid var(--neutral-200);
}

.cancel-btn {
  border-radius: 0.5rem;
}

/* Submit button */
.submit-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  border-radius: 0.5rem;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

:deep(.site-form-item-icon) {
  color: var(--neutral-400);
}

/* Fix for button icon alignment */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .header-section {
    padding: 1.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .stats-container,
  .table-container {
    margin: 0 1rem 1rem 1rem;
  }

  .table-header {
    padding: 1rem;
  }

  .modal-content {
    padding: 1rem;
  }
}

@media (min-width: 1280px) {
  .header-section {
    padding: 2.5rem;
  }

  .stats-container,
  .table-container {
    margin: 0 2rem 2rem 2rem;
  }
}

/* CSS Variables */
:root {
  --primary-color: #0a192f;
  --primary-light: #172a46;
  --secondary-color: #0d9488;
  --secondary-light: #14b8a6;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
}
</style>
