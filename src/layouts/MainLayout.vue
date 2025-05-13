<template>
  <div class="layout-container">
    <!-- Sidebar - fixed position with collapsible functionality -->
    <aside
      :class="[
        'sidebar',
        { 'sidebar-collapsed': isSidebarCollapsed },
        { 'sidebar-mobile-visible': isMobile && isSidebarVisible },
      ]"
      v-show="!isMobile || (isMobile && isSidebarVisible)"
    >
      <div class="sidebar-header">
        <img
          src="/public/image/logo_text.png"
          alt="Logo"
          class="logo"
          v-if="!isSidebarCollapsed"
        />
        <img
          src="/public/image/favicon.png"
          alt="Logo"
          class="logo-small"
          v-else
        />
      </div>

      <div class="sidebar-content">
        <a-menu
          mode="inline"
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          :inline-collapsed="isSidebarCollapsed"
          class="custom-menu"
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
          <h1 class="page-title">Home/{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
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
              <a-avatar class="bg-primary" :src="userStore.user?.avatar" />
              <span class="username hide-on-mobile">{{
                userStore.user?.name
              }}</span>
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <UserOutlined />
                  Profile
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  Settings
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
              &copy; {{ new Date().getFullYear() }} Fintera Solutions. All
              rights reserved.
            </p>
            <span class="text-gray-400 px-2 text-xs">&bull;</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BranchesOutlined,
  BankOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  DownOutlined,
  BellOutlined,
} from "@ant-design/icons-vue";
import { useMenuStore } from "@/stores/menuStore";
import { useUserStore } from "@/stores/userStore";
import { message } from "ant-design-vue";

// Router
const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const userStore = useUserStore();

const selectedKeys = ref<string[]>(["dashboard"]);
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

  // Check if sidebar was collapsed in previous session
  const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
  if (savedCollapsedState === "true") {
    isSidebarCollapsed.value = true;
  }
});

watch(
  () => route.path,
  () => {
    updateSelectedKeys();
  }
);

// Sidebar state
const isSidebarCollapsed = ref(false);
const isSidebarVisible = ref(false);
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
  console.log("Mobile sidebar toggled:", isSidebarVisible.value); // Debug log
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
  userStore.logout();
  message.success("Logged out successfully");
  // Implement logout logic here
  router.push("/login");
};

// Current year for footer
const currentYear = computed(() => new Date().getFullYear());

// Check if device is mobile
const checkIfMobile = () => {
  const mobileBreakpoint = 768;
  isMobile.value = window.innerWidth < mobileBreakpoint;

  // Handle responsive behavior
  if (isMobile.value) {
    // Don't auto-hide sidebar on resize if it's already visible
    if (!isSidebarVisible.value) {
      isSidebarVisible.value = false;
    }

    // On mobile, we want the sidebar to be full width when visible
    // but we don't want to auto-collapse it if it's already expanded
    if (!isSidebarCollapsed.value && !isSidebarVisible.value) {
      isSidebarCollapsed.value = false;
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIfMobile);
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

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Watch for route changes to update active menu
watch(
  () => route.path,
  () => {
    // Close mobile sidebar on route change
    if (isMobile.value) {
      isSidebarVisible.value = false;
    }
  }
);
</script>

<style scoped>
/* Base layout */
.layout-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* Sidebar styles */
.sidebar {
  width: 250px;
  background-color: var(--primary-color);
  color: white;
  transition: all 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  /* Fixed sidebar */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--primary-light);
  height: 64px;
}

.logo {
  height: 32px;
  max-width: 180px;
  transition: all 0.3s ease;
}

.logo-small {
  height: 32px;
  width: 32px;
  transition: all 0.3s ease;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
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
  margin-left: 250px;
  transition: margin-left 0.3s ease, width 0.3s ease;
  /* Ensure the main content takes full width minus sidebar */
  width: calc(100% - 250px);
}

.main-content-expanded {
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* Header styles */
.header {
  height: 64px;
  /* Colorful header with primary color */
  background-color: var(--primary-color);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  /* Fixed header */
  position: fixed;
  top: 0;
  right: 0;
  /* Width should match main content */
  width: inherit;
  z-index: 999;
  transition: width 0.3s ease, left 0.3s ease;
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
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 4px;
}

.menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.desktop-only {
  display: none;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Notification styles */
.notification-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.notification-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.notification-icon {
  font-size: 20px;
  color: white;
}

:deep(.notification-menu) {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--neutral-200);
  font-weight: 600;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--neutral-100);
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  font-weight: 600;
}

.notification-message {
  font-size: 14px;
  color: var(--neutral-600);
}

.notification-time {
  font-size: 12px;
  color: var(--neutral-500);
}

.empty-notification {
  text-align: center;
  padding: 16px;
  color: var(--neutral-500);
}

.notification-footer {
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid var(--neutral-200);
}

.notification-footer a {
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
}

/* User dropdown styles */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}

.user-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  margin: 0 8px;
  font-weight: 500;
}

/* Content area */
.content {
  flex: 1;
  padding: 24px;
  background-color: var(--neutral-50);
  overflow-y: auto;
  /* Add padding to account for fixed header */
  padding-top: 88px; /* 64px header height + 24px original padding */
}

/* Footer */
.footer {
  padding: 16px 24px;
  text-align: center;
  background-color: white;
  border-top: 1px solid var(--neutral-200);
  color: var(--neutral-600);
  font-size: 14px;
}

/* Custom styling for Ant Design menu */
:deep(.custom-menu) {
  background-color: var(--primary-color);
  border-right: none;
}

:deep(.custom-menu .ant-menu-item) {
  color: var(--neutral-300);
  transition: all 0.3s;
}

:deep(.custom-menu .ant-menu-submenu-title) {
  color: var(--neutral-300);
  transition: all 0.3s;
}

:deep(.custom-menu .ant-menu-item-active),
:deep(.custom-menu .ant-menu-item-selected) {
  color: white !important;
  background-color: var(--primary-light) !important;
}

:deep(.custom-menu .ant-menu-submenu-active > .ant-menu-submenu-title),
:deep(.custom-menu .ant-menu-submenu-open > .ant-menu-submenu-title) {
  background-color: var(--primary-light) !important;
  color: white !important;
}

:deep(.custom-menu .ant-menu-sub) {
  background-color: var(--primary-dark);
}

/* Collapsed menu styles */
:deep(.ant-menu-inline-collapsed) {
  width: 80px;
}

:deep(.ant-menu-inline-collapsed .ant-menu-item),
:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title) {
  padding: 0 calc(50% - 16px / 2) !important;
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
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    width: 250px !important; /* Force full width on mobile */
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
    padding-top: 80px; /* 64px header height + 16px original padding */
  }

  /* Hide username on mobile */
  .hide-on-mobile {
    display: none;
  }
}

/* Small screens */
@media (max-width: 480px) {
  .header {
    padding: 0 16px;
  }

  .page-title {
    font-size: 16px;
    max-width: 150px;
  }

  .header-right {
    gap: 8px;
  }

  .content {
    padding: 12px;
    padding-top: 76px;
  }
}

/* Medium screens */
@media (min-width: 481px) and (max-width: 768px) {
  .page-title {
    max-width: 250px;
  }
}

/* Large screens */
@media (min-width: 1200px) {
  .content {
    padding: 32px;
    padding-top: 96px;
  }
}
</style>
