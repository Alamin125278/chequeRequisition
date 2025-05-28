<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <a-result
          status="403"
          title="403"
          sub-title="Sorry, you are not authorized to access this page."
        >
          <template #icon>
            <div class="text-6xl mb-4">
              <LockOutlined class="text-red-500" />
            </div>
          </template>

          <template #extra>
            <div class="space-y-4">
              <div class="text-gray-600 text-sm mb-6">
                <p>You don't have permission to view this resource.</p>
                <p>
                  Please contact your administrator if you believe this is an
                  error.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a-button
                  type="primary"
                  size="large"
                  @click="goToLogin"
                  class="flex items-center justify-center"
                >
                  <UserOutlined class="mr-2" />
                  Login
                </a-button>

                <a-button
                  size="large"
                  @click="goBack"
                  class="flex items-center justify-center"
                >
                  <ArrowLeftOutlined class="mr-2" />
                  Go Back
                </a-button>
              </div>

              <a-button
                type="link"
                @click="goHome"
                class="text-blue-600 hover:text-blue-800"
              >
                <HomeOutlined class="mr-1" />
                Return to Home
              </a-button>
            </div>
          </template>
        </a-result>
      </div>

      <!-- Additional Info Card -->
      <a-card class="mt-8 shadow-sm border-0">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p class="flex items-center justify-center">
              <MailOutlined class="mr-2 text-blue-500" />
              Contact support: support@company.com
            </p>
            <p class="flex items-center justify-center">
              <PhoneOutlined class="mr-2 text-green-500" />
              Call us: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </a-card>

      <!-- Error Code Display -->
      <div class="mt-6 text-center">
        <a-tag color="red" class="text-xs">
          Error Code: 403_UNAUTHORIZED_ACCESS
        </a-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeftOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

// Navigation methods
const goToLogin = () => {
  // Replace with your actual login route
  window.location.href = "/login";
  message.info("Redirecting to login page...");
};

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    goHome();
  }
};

const goHome = () => {
  // Replace with your actual home route
  window.location.href = "/";
  message.info("Redirecting to home page...");
};
</script>

<style scoped>
/* Custom styles for better visual appeal */
.ant-result-title {
  color: #ef4444 !important;
  font-weight: 700;
}

.ant-result-subtitle {
  color: #6b7280;
  font-size: 16px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-result-title {
    font-size: 48px !important;
  }

  .ant-result-subtitle {
    font-size: 14px;
  }
}

/* Hover effects for buttons */
.ant-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Card styling */
.ant-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Icon animations */
.anticon {
  transition: all 0.3s ease;
}

.anticon:hover {
  transform: scale(1.1);
}
</style>
