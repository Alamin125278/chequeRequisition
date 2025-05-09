<template>
  <div class="user-list-container p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
          <p class="text-gray-500 mt-1">View and manage all Users</p>
        </div>
        <div class="mt-4 md:mt-0">
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        class="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Users</p>
            <p class="text-2xl font-bold">{{ users.length }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <UsergroupAddOutlined style="font-size: 24px; color: #22c55e" />
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Active Users</p>
            <p class="text-2xl font-bold">{{ activeUsers }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <CheckCircleOutlined style="font-size: 24px; color: #22c55e" />
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Inactive Users</p>
            <p class="text-2xl font-bold">{{ inactiveUsers }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <CloseCircleOutlined style="font-size: 24px; color: #eab308" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        class="p-5 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4"
      >
        <h2 class="text-lg font-semibold text-gray-800">All Users List</h2>
        <div class="flex gap-4">
          <a-select
            v-model:value="roleFilter"
            placeholder="Filter by Role"
            style="width: 180px"
            @change="handleRoleFilterChange"
            allow-clear
          >
            <a-select-option value="All">All Users</a-select-option>
            <a-select-option value="BankAdmin">Bank Admin</a-select-option>
            <a-select-option value="BranchUser">Branch User</a-select-option>
            <a-select-option value="BranchOfficer"
              >Branch Officer</a-select-option
            >
            <a-select-option value="VendorAdmin">Vendor Admin</a-select-option>
          </a-select>
          <a-input-search
            v-model:value="searchText"
            placeholder="Search users..."
            style="width: 250px"
            @search="onSearch"
            allow-clear
          />
        </div>
      </div>

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
      >
        <!-- User Name Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <a-avatar
                :src="record.ImagePath || ''"
                :style="{
                  backgroundColor: !record.ImagePath
                    ? '#22c55e'
                    : 'transparent',
                }"
              >
                {{
                  !record.ImagePath ? record.Name.charAt(0).toUpperCase() : ""
                }}
              </a-avatar>
              <span class="ml-2">{{ record.Name }}</span>
            </div>
          </template>

          <!-- Role Column -->
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.Role)">{{ record.Role }}</a-tag>
          </template>

          <!-- Status Column -->
          <template v-if="column.key === 'status'">
            <a-tag :color="record.IsActive ? 'success' : 'error'">
              {{ record.IsActive ? "Active" : "Inactive" }}
            </a-tag>
          </template>

          <!-- Action Column -->
          <template v-if="column.key === 'action'">
            <div class="flex space-x-2">
              <a-tooltip title="Change Password">
                <a-button
                  type="link"
                  size="small"
                  style="color: #4096ff"
                  @click="showPasswordModal(record)"
                >
                  <template #icon>
                    <LockOutlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Edit User">
                <a-button
                  type="link"
                  size="small"
                  style="color: #22c55e"
                  @click="showModal('edit', record)"
                >
                  <template #icon>
                    <EditOutlined />
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
                  <a-button type="link" size="small" danger>
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Create/Edit User Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="null"
      :footer="null"
      :width="800"
      :bodyStyle="{ padding: '0' }"
      style="top: 20px"
      :maskClosable="false"
      class="user-modal"
    >
      <!-- Custom Header -->
      <div class="modal-custom-header">
        <div class="flex items-center">
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
                <a-switch v-model:checked="formState.isActive" />
                <span class="ml-2">{{
                  formState.isActive ? "Active" : "Inactive"
                }}</span>
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
                />
              </a-form-item>
              <a-form-item label="Email" name="email" class="form-item">
                <a-input
                  v-model:value="formState.email"
                  placeholder="Enter email"
                  type="email"
                />
              </a-form-item>
            </div>

            <div class="form-row">
              <a-form-item label="Username" name="userName" class="form-item">
                <a-input
                  v-model:value="formState.userName"
                  placeholder="Enter username"
                />
              </a-form-item>
              <a-form-item
                label="Profile Image"
                name="imagePath"
                class="form-item"
              >
                <div class="flex items-center">
                  <a-upload
                    v-model:fileList="fileList"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    @change="handleImageChange"
                  >
                    <div v-if="imageUrl" class="relative">
                      <img
                        :src="imageUrl"
                        alt="avatar"
                        class="w-full h-full object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <UploadOutlined class="text-white text-xl" />
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center"
                    >
                      <PlusOutlined />
                      <div class="mt-2">Upload</div>
                    </div>
                  </a-upload>
                  <span class="ml-4 text-xs text-gray-500"
                    >Max 255 characters</span
                  >
                </div>
              </a-form-item>
            </div>

            <!-- Password fields (only for create mode) -->
            <div class="form-row" v-if="modalMode === 'add'">
              <a-form-item label="Password" name="password" class="form-item">
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="Enter password"
                />
              </a-form-item>
              <a-form-item
                label="Confirm Password"
                name="confirmPassword"
                class="form-item"
              >
                <a-input-password
                  v-model:value="formState.confirmPassword"
                  placeholder="Confirm password"
                />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>

      <!-- Custom Footer -->
      <div class="modal-footer">
        <a-button @click="modalVisible = false"> Cancel </a-button>
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
      title="Change Password"
      @ok="handlePasswordChange"
      :confirmLoading="passwordSubmitting"
    >
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
          />
        </a-form-item>
        <a-form-item label="Confirm New Password" name="confirmPassword">
          <a-input-password
            v-model:value="passwordForm.confirmPassword"
            placeholder="Confirm new password"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
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
} from "@ant-design/icons-vue";

// Search and filter states
const searchText = ref("");
const roleFilter = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref("add");
const currentUserId = ref(null);
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
});

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
  return index % 2 === 0 ? "bg-gray-50" : "";
};

// Form validation rules
const rules = {
  name: [{ required: true, message: "Please input user name!" }],
  email: [
    { required: true, message: "Please input email!" },
    { type: "email", message: "Please enter a valid email!" },
  ],
  userName: [{ required: true, message: "Please input username!" }],
  password: [
    {
      required: true,
      message: "Please input password!",
      validator: (rule, value) => {
        if (modalMode.value === "add" && !value) {
          return Promise.reject("Please input password!");
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
            return Promise.reject("Please confirm your password!");
          }
          if (value !== formState.password) {
            return Promise.reject("Passwords do not match!");
          }
        }
        return Promise.resolve();
      },
    },
  ],
  role: [{ required: true, message: "Please select a role!" }],
  bankAdmin: [
    {
      validator: (rule, value) => {
        if (
          (formState.role === "BankAdmin" ||
            formState.role === "BranchUser" ||
            formState.role === "BranchOfficer") &&
          !value
        ) {
          return Promise.reject("Please select a bank!");
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
          return Promise.reject("Please select a branch!");
        }
        return Promise.resolve();
      },
    },
  ],
  imagePath: [
    {
      validator: (rule, value) => {
        if (value && value.length > 255) {
          return Promise.reject("Image path cannot exceed 255 characters!");
        }
        return Promise.resolve();
      },
    },
  ],
};

// Password validation rules
const passwordRules = {
  newPassword: [
    { required: true, message: "Please input new password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
  ],
  confirmPassword: [
    { required: true, message: "Please confirm your password!" },
    {
      validator: (rule, value) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject("Passwords do not match!");
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
    customFilterDropdown: true,
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
.add-user-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.add-user-btn:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.ant-pagination-item-active) {
  border-color: #22c55e;
}

:deep(.ant-pagination-item-active a) {
  color: #22c55e;
}

:deep(.ant-table-row:hover > td) {
  background-color: #f0fdf4 !important;
}

:deep(.ant-input-search-button) {
  background-color: #22c55e;
  border-color: #22c55e;
}

:deep(.ant-input-search-button:hover) {
  background-color: #16a34a;
  border-color: #16a34a;
}

/* Modal Styling */
.user-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #22c55e;
  color: white;
  margin-right: 16px;
  font-size: 18px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.modal-close-btn {
  color: #6b7280;
}

.modal-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-item {
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.submit-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.submit-btn:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}
</style>
