<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Page Header with Tabs -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Account Settings</h1>
          <p class="text-slate-500 mt-1">Manage your personal information and account preferences</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-4 md:mt-0">
          <a-button-group>
            <a-button 
              :type="activeTab === 'profile' ? 'primary' : 'default'" 
              @click="activeTab = 'profile'"
              class="border-slate-300"
              :class="activeTab === 'profile' ? 'bg-violet-600 hover:bg-violet-700 border-violet-600 text-white' : 'text-slate-700'"
            >
              <template #icon><user-outlined /></template>
              Profile
            </a-button>
            <a-button 
              :type="activeTab === 'security' ? 'primary' : 'default'" 
              @click="activeTab = 'security'"
              class="border-slate-300"
              :class="activeTab === 'security' ? 'bg-violet-600 hover:bg-violet-700 border-violet-600 text-white' : 'text-slate-700'"
            >
              <template #icon><lock-outlined /></template>
              Change Password
            </a-button>
          </a-button-group>
        </div>
      </div>

      <!-- Profile Tab Content -->
      <div v-if="activeTab === 'profile'">
        <!-- Profile Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <!-- Profile Header with Cover Image and Avatar -->
          <div class="relative">
            <!-- Cover Image -->
            <div class="h-48 md:h-64 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative overflow-hidden">
              <!-- Decorative Pattern -->
              <div class="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <!-- Cover Photo Change Button -->
              <div class="absolute bottom-4 right-4">
                <a-tooltip title="Change Cover Photo">
                  <a-button 
                    shape="circle" 
                    class="bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
                    @click="handleCoverPhotoClick"
                  >
                    <template #icon><camera-outlined style="color: white" /></template>
                  </a-button>
                </a-tooltip>
                <input 
                  type="file" 
                  ref="coverInputRef" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleCoverChange"
                />
              </div>
            </div>
            
            <!-- Avatar -->
            <div class="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div class="relative group">
                <a-avatar 
                  :src="previewImage || user.imagePath || defaultAvatar" 
                  :size="120" 
                  class="border-4 border-white shadow-lg"
                />
                <div 
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  @click="handleAvatarClick"
                >
                  <camera-outlined class="text-white text-xl" />
                </div>
                <input 
                  type="file" 
                  ref="fileInputRef" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleFileChange"
                />
              </div>
              <h2 class="mt-2 text-xl font-bold text-slate-800">{{ user.name }}</h2>
              <p class="text-slate-500">{{ user.role }}</p>
            </div>
          </div>

          <!-- Form Content -->
          <div class="pt-24 px-6 pb-8">
            <a-form 
              :model="formState" 
              :rules="rules"
              layout="vertical"
              @finish="onFinish"
              ref="formRef"
            >
              <!-- Personal Information Section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center after:content-[''] after:ml-4 after:flex-1 after:border-t after:border-slate-200">
                  <user-outlined class="mr-2 text-violet-600" />
                  Personal Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <a-form-item name="name" label="Full Name">
                    <a-input 
                      v-model:value="formState.name" 
                      placeholder="Enter your full name"
                      size="large"
                      :maxLength="50"
                      class="rounded-lg"
                    >
                      <template #prefix>
                        <user-outlined class="text-slate-400" />
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
                      class="rounded-lg"
                    >
                      <template #prefix>
                        <at-outlined class="text-slate-400" />
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
                      class="rounded-lg"
                    >
                      <template #prefix>
                        <mail-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>
                  
                  <!-- Role (Read-only) -->
                  <a-form-item label="Role">
                    <a-input 
                      v-model:value="user.role" 
                      readonly
                      size="large"
                      class="bg-slate-50 rounded-lg"
                    >
                      <template #prefix>
                        <safety-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
              </div>
              
              <!-- Organization Information Section (Conditional) -->
              <div v-if="user.bankAdmin !== null || user.branchId !== null" class="mb-8">
                <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center after:content-[''] after:ml-4 after:flex-1 after:border-t after:border-slate-200">
                  <bank-outlined class="mr-2 text-violet-600" />
                  Organization Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Bank Admin (Conditional) -->
                  <a-form-item v-if="user.bankAdmin !== null" label="Bank Admin">
                    <a-input 
                      v-model:value="user.bankAdmin" 
                      readonly
                      disabled
                      size="large"
                      class="bg-slate-50 rounded-lg"
                    >
                      <template #prefix>
                        <bank-outlined class="text-slate-400" />
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
                      class="bg-slate-50 rounded-lg"
                    >
                      <template #prefix>
                        <apartment-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
              </div>
              
              <!-- Password Confirmation Section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center after:content-[''] after:ml-4 after:flex-1 after:border-t after:border-slate-200">
                  <lock-outlined class="mr-2 text-violet-600" />
                  Security Verification
                </h3>
                
                <div class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
                  <div class="flex">
                    <info-circle-outlined class="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                    <p class="text-amber-700 text-sm">
                      For security reasons, please enter your current password to save changes to your profile information.
                    </p>
                  </div>
                </div>
                
                <a-form-item name="currentPassword" label="Current Password">
                  <a-input-password 
                    v-model:value="formState.currentPassword" 
                    placeholder="Enter your current password"
                    size="large"
                    class="rounded-lg"
                  >
                    <template #prefix>
                      <lock-outlined class="text-slate-400" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>
              
              <!-- Form Actions -->
              <div class="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <a-button 
                  size="large" 
                  class="px-6 rounded-lg"
                  @click="resetForm"
                >
                  Cancel
                </a-button>
                <a-button 
                  type="primary" 
                  html-type="submit" 
                  size="large" 
                  class="px-6 rounded-lg bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700"
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
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center">
              <key-outlined class="mr-2 text-violet-600" />
              Change Password
            </h3>
            
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
                    class="rounded-lg"
                  >
                    <template #prefix>
                      <lock-outlined class="text-slate-400" />
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
                    class="rounded-lg"
                  >
                    <template #prefix>
                      <lock-outlined class="text-slate-400" />
                    </template>
                  </a-input-password>
                </a-form-item>
                
                <!-- Confirm New Password -->
                <a-form-item name="confirmPassword" label="Confirm New Password">
                  <a-input-password 
                    v-model:value="passwordForm.confirmPassword" 
                    placeholder="Confirm your new password"
                    size="large"
                    class="rounded-lg"
                  >
                    <template #prefix>
                      <check-outlined class="text-slate-400" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>
              
              <!-- Password Strength Indicator -->
              <div class="mb-6">
                <p class="text-sm text-slate-600 mb-2">Password Strength</p>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrength + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-slate-500 mt-2">
                  <template v-if="passwordStrength < 30">Weak: Add more characters and mix letters, numbers, and symbols</template>
                  <template v-else-if="passwordStrength < 70">Medium: Good, but could be stronger</template>
                  <template v-else>Strong: Excellent password!</template>
                </p>
              </div>
              
              <!-- Password Requirements -->
              <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <h4 class="font-medium text-slate-700 mb-2">Password Requirements:</h4>
                <ul class="text-sm text-slate-600 space-y-1">
                  <li class="flex items-center">
                    <check-circle-outlined :class="passwordForm.newPassword.length >= 8 ? 'text-green-500' : 'text-slate-400'" class="mr-2" />
                    At least 8 characters
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined :class="/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-slate-400'" class="mr-2" />
                    At least one uppercase letter
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined :class="/[a-z]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-slate-400'" class="mr-2" />
                    At least one lowercase letter
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined :class="/[0-9]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-slate-400'" class="mr-2" />
                    At least one number
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined :class="/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-slate-400'" class="mr-2" />
                    At least one special character
                  </li>
                </ul>
              </div>
              
              <!-- Form Actions -->
              <div class="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <a-button 
                  size="large" 
                  class="px-6 rounded-lg"
                  @click="resetPasswordForm"
                >
                  Cancel
                </a-button>
                <a-button 
                  type="primary" 
                  html-type="submit" 
                  size="large" 
                  class="px-6 rounded-lg bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700"
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
      <div class="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <div class="flex items-start">
          <div class="bg-violet-100 p-3 rounded-full mr-4 flex-shrink-0">
            <question-circle-outlined class="text-violet-600" />
          </div>
          <div>
            <h3 class="font-medium text-slate-800 mb-1">Need Help?</h3>
            <p class="text-sm text-slate-600">
              If you're having trouble with your account settings, please contact our support team at
              <a href="mailto:support@example.com" class="text-violet-600 hover:text-violet-700 font-medium">support@example.com</a>
              or visit our <a href="#" class="text-violet-600 hover:text-violet-700 font-medium">Help Center</a>.
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
        <img alt="Profile Preview" style="max-width: 100%; max-height: 300px; margin: 0 auto;" :src="previewImage" class="rounded-lg" />
        <div class="mt-6 flex justify-end space-x-2">
          <a-button @click="handleCancel" size="large" class="rounded-lg">Cancel</a-button>
          <a-button 
            type="primary" 
            @click="handleUpload"
            :loading="uploadLoading"
            size="large"
            class="rounded-lg bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700"
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
      width="400px"
      class="success-modal"
    >
      <div class="text-center py-6">
        <div class="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <check-outlined class="text-green-600 text-3xl" />
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">
          {{ successMessage }}
        </h3>
        <p class="text-slate-600 mb-6">{{ successDescription }}</p>
        <a-button
          type="primary"
          @click="successVisible = false"
          size="large"
          class="w-full rounded-lg py-2 h-auto bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-base"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  InfoCircleOutlined,
  BankOutlined,
  SafetyOutlined,
  CameraOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  KeyOutlined,
  QuestionCircleOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue';

// Default avatar image
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

// Active tab state
const activeTab = ref('profile');

// Mock user data
const user = reactive({
  id: 1,
  name: 'Alexander Thompson',
  email: 'alex.thompson@example.com',
  username: 'alexthompson',
  imagePath: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'Senior Administrator',
  bankAdmin: 'National Bank', // Set to null to test conditional rendering
  branchId: 'BR-12345', // Set to null to test conditional rendering
});

// Form state
const formState = reactive({
  name: user.name,
  email: user.email,
  username: user.username,
  currentPassword: '',
});

// Password form state
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Form validation rules
const rules = {
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name must be between 2 and 50 characters', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
  ],
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' },
    { min: 3, max: 30, message: 'Username must be between 3 and 30 characters', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores', trigger: 'blur' },
  ],
  currentPassword: [
    { required: true, message: 'Please enter your current password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
};

// Password validation rules
const passwordRules = {
  oldPassword: [
    { required: true, message: 'Please enter your current password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: 'Please enter your new password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    { 
      validator: (_: any, value: string) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);
        
        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
          return Promise.reject('Password must include uppercase, lowercase, number, and special character');
        }
        return Promise.resolve();
      },
      trigger: 'change'
    }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' },
    { 
      validator: (_: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject('The two passwords do not match');
        }
        return Promise.resolve();
      },
      trigger: 'blur'
    }
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
  if (passwordStrength.value < 30) return 'bg-red-500';
  if (passwordStrength.value < 70) return 'bg-yellow-500';
  return 'bg-green-500';
});

// Form and loading states
const formRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const loading = ref(false);
const passwordLoading = ref(false);

// Avatar upload states
const fileInputRef = ref<HTMLInputElement | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);
const previewVisible = ref(false);
const previewImage = ref<string>('');
const uploadLoading = ref(false);

// Success notification state
const successVisible = ref(false);
const successMessage = ref('');
const successDescription = ref('');

// Handle avatar click to trigger file input
const handleAvatarClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// Handle cover photo click
const handleCoverPhotoClick = () => {
  if (coverInputRef.value) {
    coverInputRef.value.click();
  }
};

// Handle file change for avatar upload
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    
    // Check file type
    if (!file.type.includes('image/')) {
      message.error('You can only upload image files!');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error('Image must be smaller than 2MB!');
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

// Handle cover photo change
const handleCoverChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    
    // Check file type
    if (!file.type.includes('image/')) {
      message.error('You can only upload image files!');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be smaller than 5MB!');
      return;
    }
    
    // Simulate cover photo update
    message.success('Cover photo updated successfully');
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
    successMessage.value = 'Profile Picture Updated';
    successDescription.value = 'Your profile picture has been updated successfully.';
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
    formState.currentPassword = '';
    
    loading.value = false;
    
    // Show success message
    successMessage.value = 'Profile Updated';
    successDescription.value = 'Your profile information has been updated successfully.';
    successVisible.value = true;
  }, 2000);
};

// Password change handler
const onPasswordChange = (values: any) => {
  passwordLoading.value = true;
  
  // Simulate API call to change password
  setTimeout(() => {
    // Reset password form
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    
    passwordLoading.value = false;
    
    // Show success message
    successMessage.value = 'Password Changed';
    successDescription.value = 'Your password has been changed successfully. Please use your new password the next time you log in.';
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
    formState.currentPassword = '';
  }
};

// Reset password form
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields();
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  }
};

// Initialize component
onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #475569;
}

:deep(.ant-input),
:deep(.ant-input-affix-wrapper),
:deep(.ant-input-password) {
  border-radius: 0.5rem;
  border-color: #e2e8f0;
  transition: all 0.3s;
}

:deep(.ant-input:hover),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input-password:hover) {
  border-color: #8b5cf6;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-input-password-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

:deep(.ant-input[disabled]),
:deep(.ant-input-affix-wrapper-disabled) {
  color: #64748b;
  background-color: #f8fafc;
  cursor: not-allowed;
}

:deep(.ant-btn) {
  border-radius: 0.5rem;
  transition: all 0.3s;
}

:deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  border-bottom: 1px solid #e2e8f0;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: #334155;
}

/* Success modal animation */
.success-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

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

/* Preview modal styles */
.preview-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}

.preview-modal :deep(.ant-modal-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.preview-modal :deep(.ant-modal-title) {
  font-weight: 600;
  color: #334155;
}

.preview-modal :deep(.ant-modal-body) {
  padding: 24px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}
</style>