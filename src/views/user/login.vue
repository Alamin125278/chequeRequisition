<template>
  <div class="login-page bg-white rounded-lg shadow-md p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
      <p class="text-gray-600 mt-2">Sign in to your account to continue</p>
    </div>

    <!-- Login Form -->
    <a-form
      :model="formState"
      name="loginForm"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :validate-messages="validateMessages"
    >
      <!-- Username/Email Field -->
      <a-form-item
        name="username"
        :rules="[
          { required: true, message: 'Please input your username or email!' },
        ]"
      >
        <a-input
          v-model:value="formState.username"
          size="large"
          placeholder="Username or Email"
        >
          <template #prefix>
            <user-outlined class="site-form-item-icon text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <!-- Password Field -->
      <a-form-item
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
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

      <!-- Remember Me & Forgot Password -->
      <div class="flex justify-between items-center mb-6">
        <a-checkbox v-model:checked="formState.remember"
          >Remember me</a-checkbox
        >
        <a
          class="text-blue-600 hover:text-blue-800 text-sm"
          @click="forgotPassword"
          >Forgot password?</a
        >
      </div>

      <!-- Login Button -->
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          class="w-full"
          :loading="loading"
        >
          Log in
        </a-button>
      </a-form-item>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <a-button size="large" class="flex items-center justify-center">
          <google-outlined />
          <span class="ml-2">Google</span>
        </a-button>
        <a-button size="large" class="flex items-center justify-center">
          <microsoft-outlined />
          <span class="ml-2">Microsoft</span>
        </a-button>
      </div>

      <!-- Register Link -->
      <div class="text-center text-gray-600 text-sm">
        Don't have an account?
        <a class="text-blue-600 hover:text-blue-800" @click="navigateToRegister"
          >Register now</a
        >
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";
import { onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();

// Form state
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: "",
  password: "",
  remember: false,
});

// Loading state and error message
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");
const showAlert = ref<boolean>(false);

// Validation messages
const validateMessages = {
  required: "${label} is required!",
};

// Form submission
const onFinish = async (values: any) => {
  loading.value = true;
  errorMessage.value = "";
  showAlert.value = false;

  try {
    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo credentials check
    if (values.username === "admin" && values.password === "password") {
      // Login successful
      userStore.login();
      message.success("Login successful!");
      router.push("/dashboard");
    } else {
      // Login failed
      errorMessage.value =
        'Invalid username or password. Try using "admin" and "password".';
      showAlert.value = true;
    }
  } catch (error) {
    errorMessage.value = "An error occurred during login. Please try again.";
    showAlert.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  showAlert.value = false; // Initialize showAlert in onMounted
});

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

// Navigation functions
const navigateToRegister = () => {
  router.push("/register");
};

const forgotPassword = () => {
  message.info("Password reset functionality would be implemented here.");
};
</script>

<style scoped>
.login-page {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
