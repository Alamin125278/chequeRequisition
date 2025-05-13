<template>
  <a-layout class="min-h-screen">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sidebar"
      :width="240"
    >
      <div class="logo-container p-4 flex items-center justify-center">
        <div class="logo flex items-center">
          <div
            v-if="collapsed"
            class="logo-icon text-white text-2xl font-bold bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center"
          >
            <img src="../../public/image/favicon.png" alt="logo" />
          </div>
          <span
            v-if="!collapsed"
            class="logo-text text-white text-lg font-semibold ml-3"
          >
            <img src="../../public/image/logo_text.png" alt="logo" />
          </span>
        </div>
      </div>

      <!-- Menu -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="dark"
      >
        <template v-for="item in menuStore.menuItems" :key="item.key">
          <!-- Menu item with children -->
          <a-sub-menu
            v-if="item.children && item.children.length > 0"
            :key="item.key"
          >
            <template #icon>
              <component :is="item.icon" />
            </template>
            <template #title>{{ item.title }}</template>

            <a-menu-item
              v-for="child in item.children"
              :key="child.key"
              @click="navigateTo(child.path)"
            >
              {{ child.title }}
            </a-menu-item>
          </a-sub-menu>

          <!-- Menu item without children -->
          <a-menu-item v-else :key="item.key" @click="navigateTo(item.path)">
            <template #icon>
              <component :is="item.icon" />
            </template>
            {{ item.title }}
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- Header -->
      <a-layout-header
        class="header bg-white p-0 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center">
          <!-- Collapse button -->
          <div
            class="trigger px-4 cursor-pointer text-lg"
            @click="toggleCollapsed"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>

          <!-- Breadcrumb -->
          <a-breadcrumb class="ml-4">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentRoute }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <!-- Header right -->
        <div class="header-right flex items-center mr-4">
          <!-- Search -->
          <a-input-search
            placeholder="Search..."
            style="width: 200px"
            class="mr-4"
          />

          <!-- Notifications -->
          <a-dropdown :trigger="['click']">
            <a-badge count="5" class="mr-4 cursor-pointer">
              <bell-outlined class="text-lg" />
            </a-badge>
            <template #overlay>
              <a-menu class="notification-menu" style="width: 300px">
                <a-menu-item key="notifications-title" class="font-semibold">
                  Notifications (5)
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="notification-1">
                  <div class="notification-item">
                    <div class="font-medium">New requisition submitted</div>
                    <div class="text-xs text-gray-500">2 minutes ago</div>
                  </div>
                </a-menu-item>
                <a-menu-item key="notification-2">
                  <div class="notification-item">
                    <div class="font-medium">Your requisition was approved</div>
                    <div class="text-xs text-gray-500">1 hour ago</div>
                  </div>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="view-all">
                  <a class="text-blue-600">View all notifications</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <!-- User dropdown -->
          <a-dropdown :trigger="['click']">
            <div class="user-dropdown flex items-center cursor-pointer">
              <a-avatar :src="userStore.user?.avatar" />
              <span v-if="!collapsed" class="ml-2">{{
                userStore.user?.name
              }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined />
                  Profile
                </a-menu-item>
                <a-menu-item key="settings">
                  <setting-outlined />
                  Settings
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="content p-6 bg-gray-100">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { useMenuStore } from "@/stores/menuStore";
import { useUserStore } from "@/stores/userStore";
import { message } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const userStore = useUserStore();

const collapsed = ref(false);
const selectedKeys = ref<string[]>(["dashboard"]);
const openKeys = ref<string[]>([]);

// Toggle sidebar collapse
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

// Navigate to route
const navigateTo = (path: string) => {
  router.push(path);
};

// Get current route name for breadcrumb
const currentRoute = computed(() => {
  return route.name || "";
});

// Handle logout
const handleLogout = () => {
  userStore.logout();
  message.success("Logged out successfully");
  router.push("/login");
};

// Update selected keys based on current route
const updateSelectedKeys = () => {
  // Find the menu item that matches the current path
  const findMenuItem = (items: any[]): string | null => {
    for (const item of items) {
      if (item.path === route.path) {
        return item.key;
      }
      if (item.children) {
        const key = findMenuItem(item.children);
        if (key) {
          openKeys.value = [item.key];
          return key;
        }
      }
    }
    return null;
  };

  const key = findMenuItem(menuStore.menuItems);
  if (key) {
    selectedKeys.value = [key];
  }
};

// Call on component mount
onMounted(() => {
  updateSelectedKeys();
});

watch(
  () => route.path,
  () => {
    updateSelectedKeys();
  }
);
</script>

<style scoped>
.logo-container {
  height: 64px;
  overflow: hidden;
}

.header {
  height: 64px;
  line-height: 64px;
}

.notification-item {
  padding: 8px 0;
}

.sidebar {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

:deep(.ant-menu-dark) {
  background: transparent;
}
</style>
