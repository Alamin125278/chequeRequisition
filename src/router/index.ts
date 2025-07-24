import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { getAuthorizationToken } from "@/services/auth/token.service";
import { CheckRoutePermission } from "@/services/Route/checkRoute.service";
import { useUserStore } from "@/stores/userStore";
import AllBranches from "@/views/branch/AllBranches.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import AllRequisition from "@/views/requisition/AllRequisition.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes
    {
      path: "/",
      component: AuthLayout,
      children: [
        {
          path: "",
          redirect: "/login",
        },
        {
          path: "/login",
          name: "Login",
          component: LoginPage,
          meta: { requiresAuth: false },
        },
        {
          path: "/register",
          name: "Register",
          component: RegisterPage,
          meta: { requiresAuth: false },
        },
      ],
    },
    {
      path: "/unauthorized",
      name: "UnAuthorized",
      component: () => import("@/views/unauthorize/unauthorize.vue"),
    },
    {
      path: "/user-profile",
      name: "User Profile",
      component: () => import("@/views/user/UserProfile.vue"),
      meta: { requiresAuth: false, requiresPermission: false },
    },
    // App routes
    {
      path: "/",
      component: MainLayout,
      meta: { requiresAuth: true, requiresPermission: true },
      children: [
        {
          path: "/dashboard",
          name: "Dashboard",
          component: DashboardPage,
        },
        {
          path: "/banks",
          name: "All Banks",
          component: () => import("@/views/bank/Bank.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/branches",
          name: "All Branches",
          component: AllBranches, // Placeholder, would be a real page in production
        },
        {
          path: "/users",
          name: "Users",
          component: () => import("@/views/user/UserList.vue"),
        },
        {
          path: "/manage-serial-no",
          name: "Manage Serial No",
          component: () => import("@/views/serial/ManageSerial.vue"),
        },
        {
          path: "/upload-requisition",
          name: "Upload Requisition Excel File",
          component: () =>
            import("@/views/LocalFileUpload/UploadRequisitionExcel.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/new",
          name: " Requisition/ New Requisition",
          component: () => import("@/views/requisition/CreateRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/all",
          name: " Requisition/ All Requisitions",
          component: AllRequisition, // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/pending",
          name: " Requisition/ Pending Requisitions",
          component: () => import("@/views/requisition/PendingRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/approved",
          name: " Requisition/ Approved Requisitions",
          component: () =>
            import("@/views/requisition/ApprovedRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/ordered",
          name: " Requisition/ Ordered Requisitions",
          component: () => import("@/views/requisition/OrderedRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/downloaded",
          name: " Requisition/ Downloaded Requisitions",
          component: () =>
            import("@/views/requisition/DownloadedRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/dispatched",
          name: " Requisition/ Dispatched Requisitions",
          component: () =>
            import("@/views/requisition/DispatchedRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/confirmed-delivery",
          name: " Requisition/ Confirmed Delivery Requisitions",
          component: () =>
            import("@/views/requisition/ConfirmDeliveryRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/requisitions/delivered",
          name: " Requisition/ Delivered Requisitions",
          component: () =>
            import("@/views/requisition/DeliveredRequisition.vue"), // Placeholder, would be a real page in production
        },

        {
          path: "/reports/challan-list",
          name: "Challan List",
          component: () => import("@/views/reports/AllChallans.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/reports/summary-report",
          name: "Make A Challan",
          component: () => import("@/views/reports/Summary.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/settings",
          name: "Settings",
          component: () => import("@/views/DashboardPage.vue"), // Placeholder, would be a real page in production
        },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = getAuthorizationToken();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requirePermission = to.matched.some(
    (record) => record.meta.requiresPermission
  );

  const isLoggedIn = userStore.isLoggedIn;
  const hasCurrentUser = !!userStore.currentUser;
  if (!to.matched.length) {
    return next({ name: "UnAuthorized" });
  }

  const localStorageCleared = !token || localStorage.length === 0;

  if (requiresAuth && localStorageCleared) {
    userStore.isLoggedIn = false;
    return next({ name: "Login" });
  }
  // Check permission only if route requires it
  let hasPermission = true;
  if (requirePermission) {
    hasPermission = await CheckRoutePermission(to.path, requiresAuth);
  }

  // Case 1: Route requires auth but user not logged in
  if (requiresAuth && !isLoggedIn) {
    return next({ name: "Login" });
  }
  // Case 2: User already logged in and trying to access login/register
  if (isLoggedIn && (to.path === "/login" || to.path === "/register")) {
    return next({ name: "Dashboard" });
  }

  // Case 3: Route needs permission but user doesn't have it
  if (requirePermission && !hasPermission) {
    return next({ name: "UnAuthorized" });
  }

  // Default: allow access
  next();
});

export default router;
