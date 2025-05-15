<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/public/image/logo_text.png" alt="Logo" class="login-logo" />
        <h1 class="login-title">Sign In</h1>
        <p class="login-subtitle">
          Enter your credentials to access your account
        </p>
      </div>

      <a-form
        :model="formState"
        name="loginForm"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        :validate-messages="validateMessages"
        layout="vertical"
        class="login-form"
      >
        <a-form-item
          name="username"
          label="Username"
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
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          label="Password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="Enter your password"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="login-options">
          <a-checkbox v-model:checked="formState.remember"
            >Remember me</a-checkbox
          >
        </div>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            class="login-button"
            :loading="loading"
          >
            Sign In
          </a-button>
        </a-form-item>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();

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
const errorMessage = ref<string>("");
const showAlert = ref<boolean>(false);

// Validation messages
const validateMessages = {
  required: "${label} is required!",
};

// Form submission
const onFinish = async (values: any) => {
  loading.value = true
  errorMessage.value = ""
  showAlert.value = false

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Try logging in with Pinia store
    userStore.login(values.username, values.password)

    if (userStore.isLoggedIn) {
      message.success("Login successful!")
      router.push("/dashboard")
    } else {
      errorMessage.value = userStore.errorMessage || "Invalid credentials"
      showAlert.value = true
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = "An error occurred. Please try again later."
    showAlert.value = true
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  showAlert.value = false; // Initialize showAlert in onMounted
});

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  height: 40px;
  margin-bottom: 24px;
}

.login-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
}

.login-subtitle {
  margin: 0;
  color: var(--neutral-600);
  font-size: 14px;
}

.login-form {
  width: 100%;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: var(--secondary-color);
  font-size: 14px;
  cursor: pointer;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 44px;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.login-button:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

/* Responsive styles */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .login-logo {
    height: 32px;
    margin-bottom: 16px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
