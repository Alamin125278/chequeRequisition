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
                <UserOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Account</span> Settings
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Manage your personal information and account preferences
            </p>
          </div>
          <!-- Tab Navigation -->
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button-group>
              <a-button
                :type="activeTab === 'profile' ? 'primary' : 'default'"
                @click="activeTab = 'profile'"
                class="border-gray-300"
                :class="
                  activeTab === 'profile'
                    ? 'bg-accent hover:bg-accent-dark border-accent text-white'
                    : 'text-primary'
                "
              >
                <template #icon><UserOutlined /></template>
                Profile
              </a-button>
              <a-button
                :type="activeTab === 'security' ? 'primary' : 'default'"
                @click="activeTab = 'security'"
                class="border-gray-300"
                :class="
                  activeTab === 'security'
                    ? 'bg-accent hover:bg-accent-dark border-accent text-white'
                    : 'text-primary'
                "
              >
                <template #icon><LockOutlined /></template>
                Change Password
              </a-button>
            </a-button-group>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Profile Tab Content -->
      <div v-if="activeTab === 'profile'">
        <!-- Profile Card -->
        <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
          <div class="px-6 py-4 bg-background border-b border-gray-200">
            <h2 class="text-lg font-medium text-primary flex items-center">
              <UserOutlined class="mr-2 text-accent" /> Personal Information
            </h2>
          </div>

          <div class="p-6">
            <!-- Avatar Section -->
            <div class="flex flex-col items-center mb-8">
              <div class="relative group mb-4">
                <a-avatar
                  :src="previewImage || user.imagePath || defaultAvatar"
                  :size="100"
                  class="border-4 border-white shadow-md"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  @click="handleAvatarClick"
                >
                  <CameraOutlined class="text-white text-xl" />
                </div>
                <input
                  type="file"
                  ref="fileInputRef"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>
              <h2 class="text-xl font-bold text-primary">{{ user.name }}</h2>
              <p class="text-secondary">{{ user.role }}</p>
            </div>

            <a-form
              :model="formState"
              :rules="rules"
              layout="vertical"
              @finish="onFinish"
              ref="formRef"
            >
              <!-- Personal Information Section -->
              <div class="mb-8">
                <h3
                  class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
                >
                  <UserOutlined class="mr-2 text-accent" /> Basic Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <a-form-item name="name" label="Full Name">
                    <a-input
                      v-model:value="formState.name"
                      placeholder="Enter your full name"
                      size="large"
                      :maxLength="50"
                      class="rounded-md"
                    >
                      <template #prefix>
                        <UserOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Username -->
                  <a-form-item name="username" label="Username">
                    <a-input
                      v-model:value="formState.username"
                      placeholder="Enter your username"
                      size="large"
                      :maxLength="30"
                      class="rounded-md"
                    >
                      <template #prefix>
                        <AtOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Email -->
                  <a-form-item name="email" label="Email Address">
                    <a-input
                      v-model:value="formState.email"
                      placeholder="Enter your email address"
                      size="large"
                      :maxLength="100"
                      class="rounded-md"
                    >
                      <template #prefix>
                        <MailOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Role (Read-only) -->
                  <a-form-item label="Role">
                    <a-input
                      v-model:value="user.role"
                      readonly
                      size="large"
                      class="bg-background rounded-md"
                    >
                      <template #prefix>
                        <SafetyOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
              </div>

              <!-- Organization Information Section (Conditional) -->
              <div
                v-if="user.bankAdmin !== null || user.branchId !== null"
                class="mb-8"
              >
                <h3
                  class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
                >
                  <BankOutlined class="mr-2 text-accent" /> Organization
                  Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Bank Admin (Conditional) -->
                  <a-form-item
                    v-if="user.bankAdmin !== null"
                    label="Bank Admin"
                  >
                    <a-input
                      v-model:value="user.bankAdmin"
                      readonly
                      disabled
                      size="large"
                      class="bg-background rounded-md"
                    >
                      <template #prefix>
                        <BankOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Branch ID (Conditional) -->
                  <a-form-item v-if="user.branchId !== null" label="Branch ID">
                    <a-input
                      v-model:value="user.branchId"
                      readonly
                      disabled
                      size="large"
                      class="bg-background rounded-md"
                    >
                      <template #prefix>
                        <ApartmentOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
              </div>

              <!-- Password Confirmation Section -->
              <div class="mb-8">
                <h3
                  class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
                >
                  <LockOutlined class="mr-2 text-accent" /> Security
                  Verification
                </h3>

                <div
                  class="bg-warning-light p-4 rounded-md border border-warning-lighter mb-6"
                >
                  <div class="flex">
                    <InfoCircleOutlined
                      class="text-warning mt-1 mr-3 flex-shrink-0"
                    />
                    <p class="text-warning-dark text-sm">
                      For security reasons, please enter your current password
                      to save changes to your profile information.
                    </p>
                  </div>
                </div>

                <a-form-item name="currentPassword" label="Current Password">
                  <a-input-password
                    v-model:value="formState.currentPassword"
                    placeholder="Enter your current password"
                    size="large"
                    class="rounded-md"
                  >
                    <template #prefix>
                      <LockOutlined class="text-secondary" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>

              <!-- Form Actions -->
              <div
                class="flex justify-end space-x-4 pt-4 border-t border-gray-200"
              >
                <a-button
                  size="large"
                  class="px-6 rounded-md"
                  @click="resetForm"
                >
                  Cancel
                </a-button>
                <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  class="px-6 rounded-md bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark"
                  :loading="loading"
                >
                  Save Changes
                </a-button>
              </div>
            </a-form>
          </div>
        </div>
      </div>

      <!-- Password Change Tab Content -->
      <div v-if="activeTab === 'security'">
        <!-- Password Change Card -->
        <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
          <div class="px-6 py-4 bg-background border-b border-gray-200">
            <h2 class="text-lg font-medium text-primary flex items-center">
              <KeyOutlined class="mr-2 text-accent" /> Change Password
            </h2>
          </div>

          <div class="p-6">
            <a-form
              :model="passwordForm"
              :rules="passwordRules"
              layout="vertical"
              @finish="onPasswordChange"
              ref="passwordFormRef"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Current Password -->
                <a-form-item name="oldPassword" label="Current Password">
                  <a-input-password
                    v-model:value="passwordForm.oldPassword"
                    placeholder="Enter your current password"
                    size="large"
                    class="rounded-md"
                  >
                    <template #prefix>
                      <LockOutlined class="text-secondary" />
                    </template>
                  </a-input-password>
                </a-form-item>

                <div class="hidden md:block">
                  <!-- Empty space for grid alignment -->
                </div>

                <!-- New Password -->
                <a-form-item name="newPassword" label="New Password">
                  <a-input-password
                    v-model:value="passwordForm.newPassword"
                    placeholder="Enter your new password"
                    size="large"
                    class="rounded-md"
                  >
                    <template #prefix>
                      <LockOutlined class="text-secondary" />
                    </template>
                  </a-input-password>
                </a-form-item>

                <!-- Confirm New Password -->
                <a-form-item
                  name="confirmPassword"
                  label="Confirm New Password"
                >
                  <a-input-password
                    v-model:value="passwordForm.confirmPassword"
                    placeholder="Confirm your new password"
                    size="large"
                    class="rounded-md"
                  >
                    <template #prefix>
                      <CheckOutlined class="text-secondary" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>

              <!-- Password Strength Indicator -->
              <div class="mb-6">
                <p class="text-sm text-secondary mb-2">Password Strength</p>
                <div class="w-full bg-background rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrength + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-secondary mt-2">
                  <template v-if="passwordStrength < 30"
                    >Weak: Add more characters and mix letters, numbers, and
                    symbols</template
                  >
                  <template v-else-if="passwordStrength < 70"
                    >Medium: Good, but could be stronger</template
                  >
                  <template v-else>Strong: Excellent password!</template>
                </p>
              </div>

              <!-- Password Requirements -->
              <div
                class="bg-background p-4 rounded-md border border-gray-200 mb-6"
              >
                <h4 class="font-medium text-primary mb-2">
                  Password Requirements:
                </h4>
                <ul class="text-sm text-secondary space-y-1">
                  <li class="flex items-center">
                    <CheckCircleOutlined
                      :class="
                        passwordForm.newPassword.length >= 8
                          ? 'text-success'
                          : 'text-secondary'
                      "
                      class="mr-2"
                    />
                    At least 8 characters
                  </li>
                  <li class="flex items-center">
                    <CheckCircleOutlined
                      :class="
                        /[A-Z]/.test(passwordForm.newPassword)
                          ? 'text-success'
                          : 'text-secondary'
                      "
                      class="mr-2"
                    />
                    At least one uppercase letter
                  </li>
                  <li class="flex items-center">
                    <CheckCircleOutlined
                      :class="
                        /[a-z]/.test(passwordForm.newPassword)
                          ? 'text-success'
                          : 'text-secondary'
                      "
                      class="mr-2"
                    />
                    At least one lowercase letter
                  </li>
                  <li class="flex items-center">
                    <CheckCircleOutlined
                      :class="
                        /[0-9]/.test(passwordForm.newPassword)
                          ? 'text-success'
                          : 'text-secondary'
                      "
                      class="mr-2"
                    />
                    At least one number
                  </li>
                  <li class="flex items-center">
                    <CheckCircleOutlined
                      :class="
                        /[^A-Za-z0-9]/.test(passwordForm.newPassword)
                          ? 'text-success'
                          : 'text-secondary'
                      "
                      class="mr-2"
                    />
                    At least one special character
                  </li>
                </ul>
              </div>

              <!-- Form Actions -->
              <div
                class="flex justify-end space-x-4 pt-4 border-t border-gray-200"
              >
                <a-button
                  size="large"
                  class="px-6 rounded-md"
                  @click="resetPasswordForm"
                >
                  Cancel
                </a-button>
                <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  class="px-6 rounded-md bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark"
                  :loading="passwordLoading"
                >
                  Update Password
                </a-button>
              </div>
            </a-form>
          </div>
        </div>
      </div>

      <!-- Help Card -->
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6 mb-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Need Help?</h3>
            <p class="text-sm text-secondary">
              If you're having trouble with your account settings, please
              contact our support team at
              <a
                href="mailto:support@example.com"
                class="text-accent hover:text-accent-dark font-medium"
                >support@example.com</a
              >
              or visit our
              <a href="#" class="text-accent hover:text-accent-dark font-medium"
                >Help Center</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <a-modal
      v-model:visible="previewVisible"
      title="Profile Picture Preview"
      :footer="null"
      @cancel="handleCancel"
      class="preview-modal"
    >
      <div class="text-center">
        <img
          alt="Profile Preview"
          style="max-width: 100%; max-height: 300px; margin: 0 auto"
          :src="previewImage"
          class="rounded-md"
        />
        <div class="mt-6 flex justify-end space-x-2">
          <a-button @click="handleCancel" size="large" class="rounded-md"
            >Cancel</a-button
          >
          <a-button
            type="primary"
            @click="handleUpload"
            :loading="uploadLoading"
            size="large"
            class="rounded-md bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark"
          >
            Use This Photo
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Success Notification -->
    <a-modal
      v-model:visible="successVisible"
      :footer="null"
      :closable="false"
      :maskClosable="true"
      width="450px"
      class="success-modal"
    >
      <div class="text-center py-8 px-4">
        <div
          class="mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-success-light border-4 border-success-lighter"
        >
          <CheckOutlined class="text-success text-4xl" />
        </div>
        <h3 class="text-2xl font-bold text-primary mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-secondary mb-8 max-w-sm mx-auto">
          {{ successDescription }}
        </p>
        <a-button
          type="primary"
          @click="successVisible = false"
          size="large"
          class="w-full rounded-md py-3 h-auto bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark text-base font-medium shadow-md"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  ApartmentOutlined,
  BankOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

// Default avatar image
const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

// Active tab state
const activeTab = ref("profile");

// Mock user data
const user = reactive({
  id: 1,
  name: "Alexander Thompson",
  email: "alex.thompson@example.com",
  username: "alexthompson",
  imagePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  role: "Senior Administrator",
  bankAdmin: "National Bank", // Set to null to test conditional rendering
  branchId: "BR-12345", // Set to null to test conditional rendering
});

// Form state
const formState = reactive({
  name: user.name,
  email: user.email,
  username: user.username,
  currentPassword: "",
});

// Password form state
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

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
  currentPassword: [
    {
      required: true,
      message: "Please enter your current password",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Password must be at least 6 characters",
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
      min: 6,
      message: "Password must be at least 6 characters",
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
      min: 8,
      message: "Password must be at least 8 characters",
      trigger: "blur",
    },
    {
      validator: (_: any, value: string) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);

        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
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

  // Length contribution (up to 30%)
  strength += Math.min(30, password.length * 3);

  // Character variety contribution
  if (/[A-Z]/.test(password)) strength += 15; // Uppercase
  if (/[a-z]/.test(password)) strength += 15; // Lowercase
  if (/[0-9]/.test(password)) strength += 15; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters

  return Math.min(100, strength);
});

// Password strength class
const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 30) return "bg-error";
  if (passwordStrength.value < 70) return "bg-warning";
  return "bg-success";
});

// Form and loading states
const formRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const loading = ref(false);
const passwordLoading = ref(false);

// Avatar upload states
const fileInputRef = ref<HTMLInputElement | null>(null);
const previewVisible = ref(false);
const previewImage = ref<string>("");
const uploadLoading = ref(false);

// Success notification state
const successVisible = ref(false);
const successMessage = ref("");
const successDescription = ref("");

// Handle avatar click to trigger file input
const handleAvatarClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// Handle file change for avatar upload
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    // Check file type
    if (!file.type.includes("image/")) {
      message.error("You can only upload image files!");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        previewImage.value = e.target.result as string;
        previewVisible.value = true;
      }
    };
    reader.readAsDataURL(file);
  }
};

// Handle cancel for image preview
const handleCancel = () => {
  previewVisible.value = false;
};

// Handle upload for profile picture
const handleUpload = () => {
  uploadLoading.value = true;

  // Simulate API call to upload image
  setTimeout(() => {
    uploadLoading.value = false;
    previewVisible.value = false;
    user.imagePath = previewImage.value;

    // Show success message
    successMessage.value = "Profile Picture Updated";
    successDescription.value =
      "Your profile picture has been updated successfully.";
    successVisible.value = true;
  }, 1500);
};

// Form submission handler
const onFinish = (values: any) => {
  loading.value = true;

  // Simulate API call to update user profile
  setTimeout(() => {
    // Update user data
    user.name = values.name;
    user.email = values.email;
    user.username = values.username;

    // Reset password field
    formState.currentPassword = "";

    loading.value = false;

    // Show success message
    successMessage.value = "Profile Updated";
    successDescription.value =
      "Your profile information has been updated successfully.";
    successVisible.value = true;
  }, 2000);
};

// Password change handler
const onPasswordChange = (values: any) => {
  passwordLoading.value = true;

  // Simulate API call to change password
  setTimeout(() => {
    // Reset password form
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    passwordLoading.value = false;

    // Show success message
    successMessage.value = "Password Changed";
    successDescription.value =
      "Your password has been changed successfully. Please use your new password the next time you log in.";
    successVisible.value = true;
  }, 2000);
};

// Reset form to original values
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    formState.name = user.name;
    formState.email = user.email;
    formState.username = user.username;
    formState.currentPassword = "";
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

// Initialize component
onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-input-affix-wrapper),
:deep(.ant-input-password),
:deep(.ant-textarea) {
  border-radius: var(--radius-md) !important;
  transition: all 0.3s;
  border-color: #e2e8f0;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border-radius: 0 !important;
}

:deep(.ant-btn) {
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

:deep(.ant-btn-primary) {
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-btn-primary:hover) {
  background-color: var(--accent-dark);
  border-color: var(--accent-dark);
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-input-password-focused),
:deep(.ant-textarea-focused) {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input-password:hover),
:deep(.ant-textarea:hover) {
  border-color: var(--accent-cta) !important;
}

:deep(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--text-primary);
}

:deep(.ant-modal-content) {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: var(--text-secondary);
}

:deep(.ant-modal-body) {
  padding: 24px;
}

/* Custom animation for success modal */
@keyframes fadeInUp {
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
  animation: fadeInUp 0.3s ease-out;
}

.preview-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}
</style>
