import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import NewRequisitionPage from "@/views/NewRequisitionPage.vue";
import AllBranches from "@/views/branch/AllBranches.vue";
import AllRequisition from "@/views/requisition/AllRequisition.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    // App routes
    {
      path: "/",
      component: MainLayout,
      meta: { requiresAuth: true },
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
          component: () => import("@/views/user/userPage.vue"), // Placeholder, would be a real page in production
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
          component: () => import("@/views/requisition/AllRequisition.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/reports/make-challan",
          name: "Make A Challan",
          component: () => import("@/views/reports/MakeChallan.vue"), // Placeholder, would be a real page in production
        },
        {
          path: "/reports/challan-list",
          name: "Challan List",
          component: () => import("@/views/reports/AllChallans.vue"), // Placeholder, would be a real page in production
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
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !userStore.isLoggedIn) {
    next("/login");
  }
  // If user is logged in and trying to access auth pages, redirect to dashboard
  else if (
    userStore.isLoggedIn &&
    (to.path === "/login" || to.path === "/register")
  ) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
