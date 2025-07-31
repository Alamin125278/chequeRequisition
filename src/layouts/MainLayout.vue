<template>
  <div class="layout-container">
    <!-- Sidebar - fixed position with collapsible functionality -->
    <aside
      :class="[
        'sidebar',
        { 'sidebar-collapsed': isSidebarCollapsed },
        { 'sidebar-mobile-visible': isMobile && isSidebarVisible },
      ]"
      collapsible
      v-show="isSidebarVisible"
    >
      <div class="sidebar-header">
        <img
          :src="logoSrc"
          alt="Logo"
          class="logo"
          v-if="!isSidebarCollapsed"
        />
        <img :src="favSrc" alt="Logo" class="logo-small" v-else />
      </div>

      <div class="sidebar-content">
        <a-menu
          mode="inline"
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          :inline-collapsed="isSidebarCollapsed"
          class="custom-menu"
        >
          <template v-for="item in menus" :key="item.id">
            <!-- Menu item with children -->
            <a-sub-menu
              v-if="item.children && item.children.length > 0"
              :key="item.id"
              style="padding: 0 2px 0 0px !important"
            >
              <template #icon>
                <component :is="getIconComponent(item.icon)" />
              </template>
              <template #title>{{ item.title }}</template>

              <a-menu-item
                v-for="child in item.children"
                :key="child.id"
                class="sb-menu-item submenu-child"
                @click="navigateTo(child.path)"
              >
                {{ child.title }}
              </a-menu-item>
            </a-sub-menu>

            <!-- Menu item without children -->
            <a-menu-item
              v-else
              :key="item?.id"
              @click="navigateTo(item.path)"
              style="padding: 0 0 0 20px !important"
            >
              <template #icon>
                <component :is="getIconComponent(item.icon)" />
              </template>
              {{ item.title }}
            </a-menu-item>
          </template>
        </a-menu>
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-footer-content">
          <span v-if="!isSidebarCollapsed"
            >© {{ new Date().getFullYear() }} {{ companyName }}</span
          >
          <span v-else>©</span>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div
      class="sidebar-overlay"
      v-if="isMobile && isSidebarVisible"
      @click="toggleMobileSidebar"
    ></div>

    <!-- Main content area -->
    <div
      :class="['main-content', { 'main-content-expanded': isSidebarCollapsed }]"
    >
      <!-- Header - fixed position -->
      <header class="header">
        <div class="header-left">
          <button
            class="menu-toggle"
            @click="toggleMobileSidebar"
            v-if="isMobile"
          >
            <MenuOutlined />
          </button>
          <button
            class="menu-toggle desktop-only"
            @click="toggleSidebar"
            v-else
          >
            <MenuFoldOutlined v-if="!isSidebarCollapsed" />
            <MenuUnfoldOutlined v-else />
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-home">Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ pageTitle }}</span>
          </div>
        </div>
        <div class="flex items-center hide-on-mobile hide-on-tablet">
          <div
            class="flex items-center justify-center sm:justify-end text-lg text-gray-800 p-3 rounded-xl font-inter transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <!-- Displays the current date with a bold font, now using the custom hex color #067C6A -->
            <span class="font-bold text-[#067C6A]">{{ currentDate }}</span>
            <!-- A subtle separator for visual distinction, in red -->
            <span class="mx-3 text-red-600">|</span>
            <!-- Displays the current time and the timezone abbreviation, time in dark gray, timezone in teal -->
            <span class="text-[#A73126] font-semibold"
              >{{ currentTime }}
              <span class="text-sm text-teal-600">(BD)</span></span
            >
          </div>
        </div>

        <div class="header-right">
          <!-- Search -->
          <!-- <div class="search-container hide-on-mobile">
            <input type="text" placeholder="Search..." class="search-input" />
            <button class="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div> -->

          <!-- Notification feature -->
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <a class="notification-dropdown" @click.prevent>
              <a-badge :count="notificationCount">
                <BellOutlined class="notification-icon" />
              </a-badge>
            </a>
            <template #overlay>
              <a-menu class="notification-menu">
                <div class="notification-header">
                  <span>Notifications</span>
                  <a-button type="link" size="small" @click="markAllAsRead"
                    >Mark all as read</a-button
                  >
                </div>
                <a-menu-item
                  v-for="(notification, index) in notifications"
                  :key="index"
                  class="notification-item"
                >
                  <div class="notification-content">
                    <div class="notification-title">
                      {{ notification.title }}
                    </div>
                    <div class="notification-message">
                      {{ notification.message }}
                    </div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item v-if="!notifications.length">
                  <div class="empty-notification">No notifications</div>
                </a-menu-item>
                <div class="notification-footer">
                  <a @click="viewAllNotifications">View all notifications</a>
                </div>
              </a-menu>
            </template>
          </a-dropdown>

          <a-dropdown placement="bottomRight">
            <a class="user-dropdown" @click.prevent>
              <a-avatar
                class="user-avatar"
                :src="
                  userStore.currentUser?.imagePath
                    ? baseConfig.BaseURL + userStore.currentUser.imagePath
                    : undefined
                "
              >
                {{
                  !userStore.currentUser?.imagePath &&
                  userStore.currentUser?.name
                    ? userStore.currentUser.name.charAt(0).toUpperCase()
                    : ""
                }}
              </a-avatar>

              <div class="user-info hide-on-mobile">
                <span class="username">{{ userStore.currentUser?.name }} </span>
                <span class="user-role">
                  {{ userStore.currentUser?.roleName }}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
            <template #overlay>
              <a-menu class="user-menu">
                <a-menu-item key="profile" @click="showProfileModal = true">
                  <UserOutlined />
                  <span>Profile Setting</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="logout">
                  <LogoutOutlined />
                  Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </header>

      <!-- Page content with adjusted padding for fixed header -->
      <main class="content">
        <router-view />
      </main>

      <UserProfileModal
        v-if="showProfileModal"
        v-model:visible="showProfileModal"
      />

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-copyright">
            <span
              >&copy; {{ new Date().getFullYear() }} {{ companyName }}. All
              rights reserved.</span
            >
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfileModal from "@/components/dashboard/UserProfile.vue";
import {
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BellOutlined,
  BranchesOutlined,
  CloudDownloadOutlined,
  ClusterOutlined,
  DashboardOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Component } from "vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import baseConfig from "../config/base-config";
import {
  removeAuthorizationTokenService,
  validateTokenService,
} from "../services/auth/token.service";
import { useMenuStore } from "../stores/menuStore";
import { useUserStore } from "../stores/userStore";

const iconMap: Record<string, Component> = {
  DashboardOutlined,
  BankOutlined,
  BranchesOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FormOutlined,
  SettingOutlined,
  ClusterOutlined,
  BarcodeOutlined,
  CloudDownloadOutlined,
  AuditOutlined,
};
function getIconComponent(iconName: string): Component | null {
  return iconMap[iconName] || null;
}
const logoSrc = computed(() => {
  if (window.location.port === "4000") {
    return "/image/logo_text.png";
  } else {
    return "/image/FlexitMainLogo.jpg";
  }
});
const favSrc = computed(() => {
  if (window.location.port === "4000") {
    return "/image/favicon.png";
  } else {
    return "/image/flexITFavicon.jpg";
  }
});
const companyName = computed(() => {
  if (window.location.port === "4000") {
    return "Fintera Solutions LTD.";
  } else {
    return "FlexIT Services LTD.";
  }
});

// Router and stores
const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const userStore = useUserStore();
const showProfileModal = ref(false);

// Get menus from store using computed for reactivity
const menus = computed(() => menuStore.menus);

const currentDate = ref("");
const currentTime = ref("");

const updateDateTime = () => {
  const now = new Date();

  // Format date for Bangladesh
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Format time for Bangladesh
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  currentDate.value = now.toLocaleDateString("en-US", dateOptions);
  currentTime.value = now.toLocaleTimeString("en-US", timeOptions);
};

// Lifecycle
let timeInterval: ReturnType<typeof setInterval>;

// Initialize menu data on component mount
onMounted(async () => {
  await menuStore.fetchMenus();
  updateSelectedKeys();
  updateDateTime();
  timeInterval = setInterval(updateDateTime, 1000);

  // Check if sidebar was collapsed in previous session
  const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
  if (savedCollapsedState === "true") {
    isSidebarCollapsed.value = true;
  }
});
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

// Menu state
const selectedKeys = ref<number[]>([1]);
const openKeys = ref<string[]>([]);

// Page title
const pageTitle = computed(() => {
  return route.name || "";
});

// Notification system
const notificationCount = ref(3);
const notifications = ref([
  {
    id: 1,
    title: "New Requisition",
    message: "A new requisition has been submitted for approval",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Requisition Approved",
    message: "Your requisition #REQ-2023-001 has been approved",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "System Update",
    message: "The system will be down for maintenance on Sunday",
    time: "2 days ago",
    read: false,
  },
]);

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
  notificationCount.value = 0;
  message.success("All notifications marked as read");
};

const viewAllNotifications = () => {
  router.push("/notifications");
};

// Update selected keys based on current route
const updateSelectedKeys = () => {
  // মেনু আইটেম খুঁজবে যেটার path route.path এর সাথে মিলে
  const findMenuItem = (items: any[]): number | null => {
    for (const item of items) {
      if (item.path === route.path) {
        return item.id; // int হিসেবে id রিটার্ন করো
      }
      if (item.children) {
        const key = findMenuItem(item.children);
        if (key !== null) {
          openKeys.value = [item.id]; // প্যারেন্ট মেনুর id int হিসেবেই রাখো
          return key;
        }
      }
    }
    return null;
  };

  const key = findMenuItem(menus.value);

  if (key !== null) {
    selectedKeys.value = [key];
  } else {
    // কোন মেনু আইটেম না পেলে ডিফল্ট 1 সেট করবে
    selectedKeys.value = [1];
  }
};

// Watch for route changes to update active menu
watch(
  () => route.path,
  () => {
    updateSelectedKeys();
    // Close mobile sidebar on route change
    if (isMobile.value) {
      isSidebarVisible.value = false;
    }
  }
);

// Sidebar state
const isSidebarCollapsed = ref(false);
const isSidebarVisible = ref(true);
const isMobile = ref(false);

// Toggle sidebar collapse state
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  // Save state to localStorage
  localStorage.setItem(
    "sidebar-collapsed",
    isSidebarCollapsed.value.toString()
  );

  // Close open submenus when collapsing
  if (isSidebarCollapsed.value) {
    openKeys.value = [];
  }
};

// Toggle mobile sidebar visibility
const toggleMobileSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

// Navigation
const navigateTo = (path: string) => {
  router.push(path);
  if (isMobile.value) {
    isSidebarVisible.value = false;
  }
};

// Logout function
const logout = () => {
  userStore.isLoggedIn = false;
  removeAuthorizationTokenService();
  message.success("Logged out successfully");
  router.push("/login");
};

// Check if device is mobile
const checkIfMobile = () => {
  const mobileBreakpoint = 768;
  isMobile.value = window.innerWidth < mobileBreakpoint;

  if (isMobile.value) {
    if (!isSidebarVisible.value) {
      isSidebarVisible.value = false;
    }
    if (!isSidebarCollapsed.value && !isSidebarVisible.value) {
      isSidebarCollapsed.value = false;
    }
  }
};

// Lifecycle hooks
onMounted(async () => {
  const isValid = await validateTokenService();
  if (!isValid) {
    userStore.isLoggedIn = false;
    removeAuthorizationTokenService();
    message.error("Session expired. Please log in again.");
    router.push("/login");
    return;
  }
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(async () => {
  window.removeEventListener("resize", checkIfMobile);
  document.removeEventListener("click", handleClickOutside);
});

// Close sidebar when clicking outside on mobile
const handleClickOutside = (event: MouseEvent) => {
  const sidebar = document.querySelector(".sidebar");
  const menuToggle = document.querySelector(".menu-toggle");

  if (
    isMobile.value &&
    isSidebarVisible.value &&
    sidebar &&
    !sidebar.contains(event.target as Node) &&
    menuToggle &&
    !menuToggle.contains(event.target as Node)
  ) {
    isSidebarVisible.value = false;
  }
};
</script>

<style scoped>
::v-deep(.submenu-child.ant-menu-item) {
  padding-inline-start: 48px !important;
}

/* Base layout */
.layout-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* .custom-menu .submenu-child {
  padding-left: 48px !important;
} */

/* Sidebar styles */
.sidebar {
  width: 260px;
  background-color: var(--primary-ui);
  color: var(--background);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  /* Fixed sidebar */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 70px;
}

.logo {
  height: 40px;
  max-width: 220px;
  transition: all 0.3s ease;
}

.logo-small {
  height: 32px;
  width: 32px;
  transition: all 0.3s ease;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.sidebar-footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Overlay for mobile sidebar */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(2px);
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Main content styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  /* Adjust margin to account for fixed sidebar */
  margin-left: 260px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* Ensure the main content takes full width minus sidebar */
  width: calc(100% - 260px);
}

.main-content-expanded {
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* Header styles */
.header {
  height: 70px;
  background-color: var(--card-bg);
  color: var(--text-primary);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  /* Fixed header */
  position: fixed;
  top: 0;
  right: 0;
  /* Width should match main content */
  width: inherit;
  z-index: 999;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: transparent;
  border: none;
  font-size: 18px;
  margin-right: 16px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
  width: 36px;
  height: 36px;
}

.menu-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--accent-cta);
}

.desktop-only {
  display: none;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.breadcrumb-home {
  color: var(--text-secondary);
}

.breadcrumb-separator {
  margin: 0 8px;
  color: var(--text-secondary);
}

.breadcrumb-current {
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Search styles */
.search-container {
  position: relative;
  width: 240px;
}
.datetime-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  padding-right: 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-cta);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(107, 142, 35, 0.1);
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.search-input:focus + .search-button {
  color: var(--accent-cta);
}

/* Notification styles */
.notification-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
}

.notification-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.notification-icon {
  font-size: 18px;
  color: var(--text-primary);
}

:deep(.notification-menu) {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.notification-item {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
}

.notification-message {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.empty-notification {
  text-align: center;
  padding: 24px 16px;
  color: var(--text-secondary);
  font-size: 14px;
}

.notification-footer {
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-footer a {
  color: var(--accent-cta);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.notification-footer a:hover {
  color: #5a7a1f;
  text-decoration: underline;
}

/* User dropdown styles */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  background-color: var(--accent-cta);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin: 0 12px;
  line-height: 1.2;
}

.username {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.user-role {
  font-size: 12px;
  color: var(--text-secondary);
}

.chevron-down {
  color: var(--text-secondary);
  margin-left: 4px;
}

:deep(.user-menu) {
  min-width: 180px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

:deep(.user-menu .ant-dropdown-menu-item) {
  /* padding: 12px 16px; */
  transition: all 0.2s ease;
}

:deep(.user-menu .ant-dropdown-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}
.anticon {
  vertical-align: 0.1em !important;
}

:deep(.user-menu .ant-dropdown-menu-item .anticon) {
  margin-right: 10px;
  font-size: 16px;
  vertical-align: 0.1em !important;
}

.menu-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

/* Content area */
.content {
  flex: 1;
  padding: 24px;
  background-color: var(--background);
  overflow-y: auto;
  /* Add padding to account for fixed header */
  padding-top: 94px; /* 70px header height + 24px original padding */
}

/* Footer */
.footer {
  padding: 20px 24px;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-copyright {
  font-size: 14px;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--accent-cta);
}

/* Custom styling for Ant Design menu */
:deep(.custom-menu) {
  background-color: var(--primary-ui);
  border-right: none;
}

:deep(.custom-menu .ant-menu-item) {
  margin: 4px 8px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
  height: 40px;
  line-height: 40px;
  padding-left: 16px !important;
}

:deep(.custom-menu .ant-menu-submenu-title) {
  margin: 4px 8px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
  height: 40px;
  line-height: 40px;
  padding-left: 16px !important;
}

:deep(.custom-menu .ant-menu-item-active),
:deep(.custom-menu .ant-menu-item-selected) {
  color: white !important;
  background-color: var(--accent-cta) !important;
}

:deep(.custom-menu .ant-menu-submenu-active > .ant-menu-submenu-title),
:deep(.custom-menu .ant-menu-submenu-open > .ant-menu-submenu-title) {
  color: white !important;
}

:deep(.custom-menu .ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: white !important;
  background-color: var(--teal-dark) !important;
  border-radius: 8px;
}

:deep(.custom-menu .ant-menu-sub) {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px;
  border-radius: 8px;
  margin: 0 8px;
}

:deep(.custom-menu .ant-menu-sub .ant-menu-item) {
  margin: 4px 0;
  padding-left: 12px !important;
  height: 36px;
  line-height: 36px;
}

/* Collapsed menu styles */
:deep(.ant-menu-inline-collapsed) {
  width: 64px;
}

:deep(.ant-menu-inline-collapsed .ant-menu-item),
:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title) {
  padding: 0 calc(50% - 16px / 2) !important;
  margin: 4px 8px !important;
}

:deep(.ant-menu-inline-collapsed .ant-menu-item .anticon),
:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title .anticon) {
  margin: 0;
  font-size: 16px;
  line-height: 40px;
}

:deep(.ant-menu-inline-collapsed .ant-menu-item-icon),
:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title-icon) {
  margin: 0;
}

:deep(.ant-menu-inline-collapsed .ant-menu-item-title),
:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title-title) {
  opacity: 0;
  max-width: 0;
}

/* Badge styling */
:deep(.ant-badge .ant-badge-count) {
  background-color: var(--error);
  box-shadow: 0 0 0 1px white;
}

/* Responsive styles */
@media (min-width: 769px) {
  .desktop-only {
    display: flex;
  }

  /* Hide mobile menu toggle on desktop */
  .header .menu-toggle:not(.desktop-only) {
    display: none;
  }
}

@media (max-width: 768px) {
  /* Mobile sidebar */
  .sidebar {
    transform: translateX(-100%);
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.2);
    width: 280px !important; /* Force full width on mobile */
  }

  /* Show sidebar when visible */
  .sidebar-mobile-visible {
    transform: translateX(0) !important;
  }

  /* Main content takes full width on mobile */
  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .main-content-expanded {
    margin-left: 0;
    width: 100%;
  }

  /* Full width header on mobile */
  .header {
    width: 100% !important;
  }

  /* Adjust content padding */
  .content {
    padding: 16px;
    padding-top: 86px; /* 70px header height + 16px original padding */
  }

  /* Hide username on mobile */
  .hide-on-mobile {
    display: none;
  }

  /* Hide UserName on Tablet */
  @media screen and (min-width: 768px) {
    .hide-on-tablet {
      display: none;
    }
  }

  /* Footer adjustments */
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .footer-links {
    gap: 16px;
  }
}

/* Small screens */
@media (max-width: 480px) {
  .header {
    padding: 0 16px;
  }

  .breadcrumb {
    font-size: 13px;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-right {
    gap: 8px;
  }

  .content {
    padding: 12px;
    padding-top: 82px;
  }

  .footer {
    padding: 16px;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
