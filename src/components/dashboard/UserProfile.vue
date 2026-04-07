<template>
  <a-modal
    v-model:visible="props.visible"
    :title="null"
    :footer="null"
    :width="isMobile ? '100%' : '800px'"
    :style="isMobile ? { top: '0px', paddingBottom: '0px' } : { top: '20px' }"
    :bodyStyle="
      isMobile
        ? { padding: '0px', height: '100vh', overflow: 'hidden' }
        : { padding: '0px' }
    "
    :maskClosable="!isMobile"
    :closable="false"
    @cancel="handleClose"
    class="user-profile-modal"
    :class="{ 'mobile-modal': isMobile }"
  >
    <div
      class="flex flex-col h-full"
      :class="isMobile ? 'min-h-screen' : 'min-h-[600px]'"
    >
      <!-- Custom Header -->
      <div
        class="flex items-center justify-between p-4 md:p-6 bg-white border-b border-gray-200 sticky top-0 z-10"
      >
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <UserOutlined class="text-blue-600 text-lg" />
          </div>
          <div>
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">
              Account Settings
            </h2>
            <p class="text-sm text-gray-500 hidden md:block">
              Manage your profile and security settings
            </p>
          </div>
        </div>
        <button
          @click="handleClose"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseOutlined class="text-gray-500 text-lg" />
        </button>
      </div>

      <!-- Mobile Tab Navigation -->
      <div
        v-if="isMobile"
        class="bg-white border-b border-gray-200 sticky top-[73px] z-10"
      >
        <div class="flex">
          <button
            @click="activeTab = 'profile'"
            class="flex-1 py-3 px-4 text-center font-medium transition-colors"
            :class="
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <UserOutlined class="mr-2" />
            Profile
          </button>
          <button
            @click="activeTab = 'security'"
            class="flex-1 py-3 px-4 text-center font-medium transition-colors"
            :class="
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <LockOutlined class="mr-2" />
            Security
          </button>
        </div>
      </div>

      <!-- Desktop Tab Navigation -->
      <div
        v-if="!isMobile"
        class="bg-gray-50 px-6 py-4 border-b border-gray-200"
      >
        <div class="flex space-x-1">
          <button
            @click="activeTab = 'profile'"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="
              activeTab === 'profile'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            "
          >
            <UserOutlined class="mr-2" />
            Profile Information
          </button>
          <button
            @click="activeTab = 'security'"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="
              activeTab === 'security'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            "
          >
            <LockOutlined class="mr-2" />
            Password & Security
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto bg-gray-50">
        <!-- Profile Tab Content -->
        <div v-if="activeTab === 'profile'" class="p-4 md:p-6 space-y-6">
          <!-- User Info Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Header Section -->
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-6 text-center"
            >
              <div class="text-center">
                <h3 class="text-xl font-bold text-white">
                  {{ currentUser?.name }}
                </h3>
                <p class="text-blue-100">{{ currentUser?.roleName }}</p>
              </div>
            </div>

            <!-- Form Section -->
            <div class="p-6">
              <a-form
                :model="formState"
                :rules="rules"
                layout="vertical"
                @finish="onFinish"
                ref="formRef"
                class="space-y-6"
              >
                <!-- Profile Image Upload -->
                <div class="text-center mb-6">
                  <a-form-item
                    label="Profile Image"
                    name="imagePath"
                    class="profile-image-form-item"
                  >
                    <div class="profile-image-upload">
                      <a-upload
                        v-model:fileList="fileList"
                        list-type="picture-card"
                        :show-upload-list="false"
                        :before-upload="beforeUpload"
                        @change="handleImageChange"
                        class="profile-upload rounded-lg overflow-hidden"
                      >
                        <div v-if="imageUrl" class="image-preview">
                          <img
                            :src="imageUrl"
                            alt="avatar"
                            class="preview-img"
                          />
                          <div class="image-overlay">
                            <UploadOutlined class="text-white text-lg" />
                          </div>
                        </div>
                        <div v-else class="upload-placeholder">
                          <PlusOutlined class="text-2xl text-gray-400 mb-2" />
                          <div class="upload-text text-gray-600">
                            Upload Photo
                          </div>
                        </div>
                      </a-upload>
                      <span class="upload-hint text-xs text-gray-500 mt-2 block"
                        >Max 2MB (JPG/PNG)</span
                      >
                    </div>
                  </a-form-item>
                </div>

                <!-- Basic Information -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <div class="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Basic Information
                  </h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item name="name" label="Full Name" class="mb-4">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Enter your full name"
                        class="rounded-md w-full"
                      >
                        <template #prefix>
                          <UserOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>

                    <a-form-item name="username" label="Username" class="mb-4">
                      <a-input
                        v-model:value="formState.username"
                        placeholder="Enter your username"
                        class="rounded-md w-full"
                      >
                        <template #prefix>
                          <AtOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>

                    <a-form-item
                      name="email"
                      label="Email Address"
                      class="mb-4"
                    >
                      <a-input
                        v-model:value="formState.email"
                        placeholder="Enter your email address"
                        class="rounded-md w-full"
                      >
                        <template #prefix>
                          <MailOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>

                    <a-form-item label="Role" class="mb-4">
                      <a-input
                        :value="currentUser?.roleName"
                        readonly
                        class="bg-gray-50 rounded-md w-full"
                      >
                        <template #prefix>
                          <SafetyOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>
                  </div>
                </div>

                <!-- Organization Information -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <div class="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Organization Details
                  </h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item
                      v-if="currentUser?.vendorId !== null"
                      label="Vendor Name"
                      class="mb-4"
                    >
                      <a-input
                        :value="currentUser?.vendorName"
                        readonly
                        disabled
                        class="bg-gray-50 rounded-md w-full"
                      >
                        <template #prefix>
                          <BankOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>
                    <a-form-item
                      v-if="currentUser?.bankId !== null"
                      label="Bank Name"
                      class="mb-4"
                    >
                      <a-input
                        :value="currentUser?.bankName"
                        readonly
                        disabled
                        class="bg-gray-50 rounded-md w-full"
                      >
                        <template #prefix>
                          <BankOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>

                    <a-form-item
                      v-if="currentUser?.branchId !== null"
                      label="Branch ID"
                      class="mb-4"
                    >
                      <a-input
                        :value="currentUser?.branchName"
                        readonly
                        disabled
                        class="bg-gray-50 rounded-md w-full"
                      >
                        <template #prefix>
                          <ApartmentOutlined class="text-gray-400" />
                        </template>
                      </a-input>
                    </a-form-item>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200"
                >
                  <a-button
                    @click="resetForm"
                    size="large"
                    class="flex-1 sm:flex-none rounded-lg h-12 font-medium"
                  >
                    Reset Changes
                  </a-button>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    :loading="loading"
                    class="flex-1 sm:flex-none rounded-lg h-12 font-medium bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                  >
                    <SaveOutlined class="mr-2" />
                    Save Changes
                  </a-button>
                </div>
              </a-form>
            </div>
          </div>
        </div>

        <!-- Security Tab Content -->
        <div v-if="activeTab === 'security'" class="p-4 md:p-6">
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div class="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-6">
              <div class="flex items-center">
                <div class="p-3 bg-white/20 rounded-lg mr-4">
                  <LockOutlined class="text-white text-2xl" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">
                    Password & Security
                  </h3>
                  <p class="text-red-100">
                    Keep your account secure with a strong password
                  </p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <a-form
                :model="passwordForm"
                :rules="passwordRules"
                layout="vertical"
                @finish="onPasswordChange"
                ref="passwordFormRef"
                class="space-y-6"
              >
                <div class="space-y-4">
                  <a-form-item
                    name="oldPassword"
                    label="Current Password"
                    class="mb-4"
                  >
                    <a-input-password
                      v-model:value="passwordForm.oldPassword"
                      placeholder="Enter your current password"
                      class="rounded-md w-full"
                    >
                      <template #prefix>
                        <LockOutlined class="text-gray-400" />
                      </template>
                    </a-input-password>
                  </a-form-item>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item
                      name="newPassword"
                      label="New Password"
                      class="mb-4"
                    >
                      <a-input-password
                        v-model:value="passwordForm.newPassword"
                        placeholder="Enter your new password"
                        class="rounded-md w-full"
                      >
                        <template #prefix>
                          <KeyOutlined class="text-gray-400" />
                        </template>
                      </a-input-password>
                    </a-form-item>

                    <a-form-item
                      name="confirmPassword"
                      label="Confirm New Password"
                      class="mb-4"
                    >
                      <a-input-password
                        v-model:value="passwordForm.confirmPassword"
                        placeholder="Confirm your new password"
                        class="rounded-md w-full"
                      >
                        <template #prefix>
                          <CheckOutlined class="text-gray-400" />
                        </template>
                      </a-input-password>
                    </a-form-item>
                  </div>
                </div>

                <!-- Password Strength Indicator -->
                <div
                  v-if="passwordForm.newPassword"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700"
                      >Password Strength</span
                    >
                    <span class="text-sm text-gray-500"
                      >{{ Math.round(passwordStrength) }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="passwordStrengthClass"
                      :style="{ width: passwordStrength + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600">
                    <template v-if="passwordStrength < 30">
                      <ExclamationCircleOutlined class="text-red-500 mr-1" />
                      Weak: Add more characters and mix letters, numbers, and
                      symbols
                    </template>
                    <template v-else-if="passwordStrength < 70">
                      <WarningOutlined class="text-yellow-500 mr-1" />
                      Medium: Good, but could be stronger
                    </template>
                    <template v-else>
                      <CheckCircleOutlined class="text-green-500 mr-1" />
                      Strong: Excellent password!
                    </template>
                  </p>
                </div>

                <!-- Password Requirements -->
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 class="font-medium text-blue-900 mb-3 flex items-center">
                    <InfoCircleOutlined class="mr-2" />
                    Password Requirements
                  </h5>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="flex items-center text-sm">
                      <CheckCircleOutlined
                        :class="
                          passwordForm.newPassword.length >= 1
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                        class="mr-2 flex-shrink-0"
                      />
                      <span
                        :class="
                          passwordForm.newPassword.length >= 6
                            ? 'text-green-700'
                            : 'text-gray-600'
                        "
                      >
                        At least 6 characters
                      </span>
                    </div>
                    <div class="flex items-center text-sm">
                      <CheckCircleOutlined
                        :class="
                          /[A-Z]/.test(passwordForm.newPassword)
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                        class="mr-2 flex-shrink-0"
                      />
                      <span
                        :class="
                          /[A-Z]/.test(passwordForm.newPassword)
                            ? 'text-green-700'
                            : 'text-gray-600'
                        "
                      >
                        One uppercase letter
                      </span>
                    </div>
                    <div class="flex items-center text-sm">
                      <CheckCircleOutlined
                        :class="
                          /[a-z]/.test(passwordForm.newPassword)
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                        class="mr-2 flex-shrink-0"
                      />
                      <span
                        :class="
                          /[a-z]/.test(passwordForm.newPassword)
                            ? 'text-green-700'
                            : 'text-gray-600'
                        "
                      >
                        One lowercase letter
                      </span>
                    </div>
                    <div class="flex items-center text-sm">
                      <CheckCircleOutlined
                        :class="
                          /[0-9]/.test(passwordForm.newPassword)
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                        class="mr-2 flex-shrink-0"
                      />
                      <span
                        :class="
                          /[0-9]/.test(passwordForm.newPassword)
                            ? 'text-green-700'
                            : 'text-gray-600'
                        "
                      >
                        One number
                      </span>
                    </div>
                    <div
                      class="flex items-center text-sm col-span-1 sm:col-span-2"
                    >
                      <CheckCircleOutlined
                        :class="
                          /[^A-Za-z0-9]/.test(passwordForm.newPassword)
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                        class="mr-2 flex-shrink-0"
                      />
                      <span
                        :class="
                          /[^A-Za-z0-9]/.test(passwordForm.newPassword)
                            ? 'text-green-700'
                            : 'text-gray-600'
                        "
                      >
                        One special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200"
                >
                  <a-button
                    @click="resetPasswordForm"
                    size="large"
                    class="flex-1 sm:flex-none rounded-lg h-12 font-medium"
                  >
                    Reset Form
                  </a-button>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    :loading="passwordLoading"
                    class="flex-1 sm:flex-none rounded-lg h-12 font-medium bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
                  >
                    <LockOutlined class="mr-2" />
                    Update Password
                  </a-button>
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <a-modal
      v-model:visible="successVisible"
      :footer="null"
      :closable="false"
      :maskClosable="true"
      :width="isMobile ? '90%' : '400px'"
      class="success-modal"
    >
      <div class="text-center py-8 px-4">
        <div
          class="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-green-100"
        >
          <CheckCircleOutlined class="text-green-600 text-3xl" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-gray-600 mb-6">{{ successDescription }}</p>
        <a-button
          type="primary"
          @click="successVisible = false"
          size="large"
          class="w-full rounded-lg h-12 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 font-medium"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import baseConfig from "@/config/base-config";
import { uploadImageService } from "@/services/image/image.service";
import {
  changePasswordService,
  saveUserService,
} from "@/services/user/user.service";
import { useUserStore } from "@/stores/userStore";
import {
  ApartmentOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  SafetyOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import type {
  FormInstance,
  UploadChangeParam,
  UploadFile,
} from "ant-design-vue";
import { message } from "ant-design-vue";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";

// Props
interface Props {
  visible: boolean;
}

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

// Responsive state
const isMobile = ref(false);

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(async () => {
  await userStore.fetchCurrentUser();
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Default avatar image
const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

// Active tab state
const activeTab = ref("profile");
// Form state
const formState = reactive({
  name: currentUser?.name,
  email: currentUser?.email,
  username: currentUser?.userName,
  currentPassword: "",
  imagePath: currentUser?.imagePath,
});

// Password form state
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Upload states
const fileList = ref<UploadFile[]>([]);
if (currentUser?.imagePath) {
  currentUser.imagePath = baseConfig.BaseURL + currentUser.imagePath;
  fileList.value = currentUser.imagePath
    ? [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: currentUser.imagePath,
        },
      ]
    : [];
}
const imageUrl = ref<string | null>(currentUser?.imagePath ?? null);

// Form validation rules
const rules = {
  name: [
    { required: true, message: "Please enter your name", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "Name must be between 2 and 50 characters",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "Please enter your email", trigger: "blur" },
    {
      type: "email",
      message: "Please enter a valid email address",
      trigger: "blur",
    },
  ],
  username: [
    { required: true, message: "Please enter your username", trigger: "blur" },
    {
      min: 3,
      max: 30,
      message: "Username must be between 3 and 30 characters",
      trigger: "blur",
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username can only contain letters, numbers, and underscores",
      trigger: "blur",
    },
  ],
};

// Password validation rules
const passwordRules = {
  oldPassword: [
    {
      required: true,
      message: "Please enter your current password",
      trigger: "blur",
    },
    {
      min: 1,
      message: "Password must be at least 1 characters",
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "Please enter your new password",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
    {
      validator: (_: any, value: string) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        if (!(hasUpperCase && hasLowerCase && hasNumber)) {
          return Promise.reject(
            "Password must include uppercase, lowercase, number, and special character"
          );
        }
        return Promise.resolve();
      },
      trigger: "change",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Please confirm your new password",
      trigger: "blur",
    },
    {
      validator: (_: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject("The two passwords do not match");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
};

// Password strength calculation
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword;
  if (!password) return 0;

  let strength = 0;
  strength += Math.min(30, password.length * 3);
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  return Math.min(100, strength);
});

// Password strength class
const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 30) return "bg-red-500";
  if (passwordStrength.value < 70) return "bg-yellow-500";
  return "bg-green-500";
});

// Form and loading states
const formRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const loading = ref(false);
const passwordLoading = ref(false);

// Success notification state
const successVisible = ref(false);
const successMessage = ref("");
const successDescription = ref("");
const isImageChanged = ref(false);

// Handle modal close
const handleClose = () => {
  emit("update:visible", false);
};

// Handle image upload before upload
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

// Handle image change
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

// Form submission handler
const onFinish = (values: any) => {
  formRef.value
    ?.validate()
    .then(async () => {
      loading.value = true;
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
        imagePath = formState.imagePath ?? "";
      }

      const payload = {
        id: currentUser?.id, // required for update
        name: formState.name,
        email: formState.email,
        userName: formState.username,
        passwordHash: "",
        role: currentUser?.role,
        bankId: currentUser?.bankId,
        branchId: currentUser?.branchId,
        vendorId: currentUser?.vendorId,
        imagePath: imagePath,
        isActive: "Active",
      };

      // Simulate API call
      try {
        await saveUserService(payload, true);
        message.success(
          "Your profile information has been updated successfully."
        );
        await userStore.fetchUsers();
        loading.value = false;
        isImageChanged.value = false;
        handleClose();
      } catch (error: any) {
        console.log("API error:", error);
        message.error("Something went wrong. Please try again.");
      }
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};

// Password change handler
const onPasswordChange = (values: any) => {
  passwordFormRef.value
    ?.validate()
    .then(async () => {
      passwordLoading.value = true;

      const payload = {
        id: currentUser?.id,
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };

      try {
        let response = await changePasswordService(payload);
        if (response.status === 200) {
          message.success(
            response.data?.message || "Password changed successfully"
          );
          handleClose();
        } else {
          message.error(response.data?.message || "Failed to change password");
        }
      } catch (error: any) {
        console.log("API error:", error);
        message.error("Something went wrong. Please try again.");
      }
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
  passwordLoading.value = true;

  //   setTimeout(() => {
  //     passwordForm.oldPassword = "";
  //     passwordForm.newPassword = "";
  //     passwordForm.confirmPassword = "";
  //     passwordLoading.value = false;

  //     successMessage.value = "Password Changed";
  //     successDescription.value =
  //       "Your password has been changed successfully. Please use your new password the next time you log in.";
  //     successVisible.value = true;
  //   }, 2000);
};

// Reset form to original values
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    formState.name = currentUser?.name;
    formState.email = currentUser?.email;
    formState.username = currentUser?.userName;
    imageUrl.value = currentUser?.imagePath ?? null;
    formState.imagePath = currentUser?.imagePath;
  }
};

// Reset password form
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields();
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  }
};

// Watch for modal visibility changes to reset active tab
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      activeTab.value = "profile";
      imageUrl.value = currentUser?.imagePath ?? null;
    }
  }
);
</script>

<style scoped>
/* Mobile modal styles */
.mobile-modal :deep(.ant-modal) {
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

.mobile-modal :deep(.ant-modal-content) {
  border-radius: 0 !important;
  height: 100vh !important;
}

/* Desktop modal styles */
:deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.ant-modal-body) {
  padding: 0;
}

/* Profile Image Upload Styles */
.profile-image-form-item :deep(.ant-form-item-label) {
  text-align: center;
}

.profile-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload :deep(.ant-upload) {
  width: 120px !important;
  height: 120px !important;
  border-radius: 50% !important;
  /* border: 3px dashed #d9d9d9 !important; */
  transition: all 0.3s ease !important;
}

.profile-upload :deep(.ant-upload:hover) {
  border-color: #1890ff !important;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.upload-text {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.upload-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

/* Form styling */
:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
  border-color: #d1d5db;
  font-size: 14px;
}

:deep(.ant-input-lg),
:deep(.ant-input-password-lg),
:deep(.ant-input-affix-wrapper-lg) {
  height: 48px;
  font-size: 16px;
}

:deep(.ant-input:focus),
:deep(.ant-input-password-focused),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
}

:deep(.ant-btn) {
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
}

:deep(.ant-btn-lg) {
  height: 48px;
  font-size: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

:deep(.ant-form-item-explain-error) {
  font-size: 12px;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Success modal animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-modal :deep(.ant-modal-content) {
  animation: slideInUp 0.3s ease-out;
  border-radius: 12px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
