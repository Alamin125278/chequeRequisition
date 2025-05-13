<template>
  <div class="auth-layout min-h-screen flex flex-col">
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
    >
      <div class="container mx-auto px-6">
        <div class="flex justify-center items-center">
          <span class="text-gray-400 px-2 text-xs">&bull;</span>
          <p
            class="text-sm font-semibold text-gray-500 font-light tracking-wide"
          >
            &copy; {{ new Date().getFullYear() }} Fintera Solutions. All rights
            reserved.
          </p>
          <span class="text-gray-400 px-2 text-xs">&bull;</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Determine which auth links to show based on current route
const showLogin = ref(route.path !== "/login");
const showRegister = ref(route.path !== "/register");

// Update the refs when the route changes
watch(
  () => route.path,
  (newPath) => {
    showLogin.value = newPath !== "/login";
    showRegister.value = newPath !== "/register";
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
