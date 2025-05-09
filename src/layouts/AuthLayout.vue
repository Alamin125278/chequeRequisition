<template>
  <div class="auth-layout min-h-screen flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 bg-white shadow-sm">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div class="logo flex items-center">
            <div class="logo-icon text-white text-2xl font-bold bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center">
              CR
            </div>
            <span class="logo-text text-gray-800 text-lg font-semibold ml-3">Cheque requisition System</span>
          </div>
          <div class="flex items-center space-x-4">
            <a-button type="link" @click="navigateTo('/register')" v-if="showRegister">Register</a-button>
            <a-button type="link" @click="navigateTo('/login')" v-if="showLogin">Login</a-button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 px-6 bg-white border-t">
      <div class="container mx-auto">
        <div class="text-center text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Fintera Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Determine which auth links to show based on current route
const showLogin = ref(route.path !== '/login');
const showRegister = ref(route.path !== '/register');

// Update the refs when the route changes
watch(
  () => route.path,
  (newPath) => {
    showLogin.value = newPath !== '/login';
    showRegister.value = newPath !== '/register';
  },
  { immediate: true }
);

// Navigation function
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.auth-layout {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
