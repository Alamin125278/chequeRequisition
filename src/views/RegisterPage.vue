<template>
  <div class="register-page bg-white rounded-lg shadow-md p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Create an Account</h1>
      <p class="text-gray-600 mt-2">Fill in the details to get started</p>
    </div>

    <!-- Registration Form -->
    <a-form
      :model="formState"
      name="registerForm"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :validate-messages="validateMessages"
    >
      <!-- Full Name Field -->
      <a-form-item
        name="fullName"
        :rules="[{ required: true, message: 'Please input your full name!' }]"
      >
        <a-input 
          v-model:value="formState.fullName" 
          size="large"
          placeholder="Full Name"
        >
          <template #prefix>
            <user-outlined class="site-form-item-icon text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <!-- Email Field -->
      <a-form-item
        name="email"
        :rules="[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email address!' }
        ]"
      >
        <a-input 
          v-model:value="formState.email" 
          size="large"
          placeholder="Email Address"
        >
          <template #prefix>
            <mail-outlined class="site-form-item-icon text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <!-- Password Field -->
      <a-form-item
        name="password"
        :rules="[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters!' }
        ]"
      >
        <a-input-password 
          v-model:value="formState.password" 
          size="large"
          placeholder="Password"
        >
          <template #prefix>
            <lock-outlined class="site-form-item-icon text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <!-- Confirm Password Field -->
      <a-form-item
        name="confirmPassword"
        :rules="[
          { required: true, message: 'Please confirm your password!' },
          { validator: validateConfirmPassword }
        ]"
      >
        <a-input-password 
          v-model:value="formState.confirmPassword" 
          size="large"
          placeholder="Confirm Password"
        >
          <template #prefix>
            <lock-outlined class="site-form-item-icon text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <!-- Terms and Conditions -->
      <a-form-item
        name="agreement"
        :rules="[
          { 
            validator: (_, value) => 
              value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
          }
        ]"
        valuePropName="checked"
      >
        <a-checkbox v-model:checked="formState.agreement">
          I agree to the <a class="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a class="text-blue-600 hover:text-blue-800">Privacy Policy</a>
        </a-checkbox>
      </a-form-item>

      <!-- Register Button -->
      <a-form-item>
        <a-button 
          type="primary" 
          html-type="submit" 
          size="large" 
          class="w-full"
          :loading="loading"
        >
          Register
        </a-button>
      </a-form-item>

      <!-- Login Link -->
      <div class="text-center text-gray-600 text-sm">
        Already have an account? 
        <a class="text-blue-600 hover:text-blue-800" @click="navigateToLogin">Log in</a>
      </div>
    </a-form>

    <!-- Error Alert -->
    <a-alert
      v-if="errorMessage"
      type="error"
      :message="errorMessage"
      class="mt-4"
      show-icon
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { 
  UserOutlined, 
  LockOutlined,
  MailOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// Form state
interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

const formState = reactive<FormState>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false,
});

// Loading state and error message
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');

// Validation messages
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};

// Validate confirm password
const validateConfirmPassword = async (_: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject(new Error('The two passwords do not match!'));
  }
  return Promise.resolve();
};

// Form submission
const onFinish = async (values: any) => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Registration would be implemented here
    console.log('Registration values:', values);
    message.success('Registration successful! Please log in.');
    router.push('/login');
  } catch (error) {
    errorMessage.value = 'An error occurred during registration. Please try again.';
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// Navigation function
const navigateToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-page {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
