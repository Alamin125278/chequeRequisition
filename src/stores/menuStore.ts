import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DashboardOutlined,
  FormOutlined,
  SettingOutlined,
  BarChartOutlined,
  BankOutlined,
  BranchesOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue";

export interface MenuItem {
  key: string;
  title: string;
  icon: any;
  path: string;
  children?: MenuItem[];
  permissions?: string[];
}

export const useMenuStore = defineStore("menu", () => {
  const menuItems = ref<MenuItem[]>([
    {
      key: "dashboard",
      title: "Dashboard",
      icon: DashboardOutlined,
      path: "/dashboard",
      permissions: ["view-dashboard"],
    },
    {
      key: "banks",
      title: "Banks",
      icon: BankOutlined,
      path: "/banks",
      permissions: ["manage-banks"],
    },
    {
      key: "branches",
      title: "Branches",
      icon: BranchesOutlined,
      path: "/branches",
      permissions: ["manage-branches"],

    },
    {
      key: "users",
      title: "Users",
      icon: UsergroupAddOutlined,
      path: "/users",
      permissions: ["manage-users"],
    },
    {
      key: "requisitions",
      title: "Requisitions",
      icon: FormOutlined,
      path: "/requisitions",
      permissions: ["view-requisitions"],
      children: [
        {
          key: "new-requisition",
          title: "New Requisition",
          path: "/requisitions/new",
          icon: undefined,
          permissions: ["new-requisition"],
        },

        {
          key: "all-requisitions-page",
          title: "All Requisitions",
          path: "/requisitions/all",
          icon: undefined,
          permissions: ["all-requisitions"],
        },
        {
          key: "pending-requisitions",
          title: "Pending Requisitions",
          path: "/requisitions/pending",
          icon: undefined,
          permissions: ["pending-requisitions"],
        },
        {
          key: "approved-requisitions",
          title: "Approved Requisitions",
          path: "/requisitions/approved",
          icon: undefined,
          permissions: ["approved-requisitions"],
        },
        {
          key: "ordered-requisitions",
          title: "Ordered Requisitions",
          path: "/requisitions/ordered",
          icon: undefined,
          permissions: ["ordered-requisitions"],
        },
        {
          key: "downloaded-requisitions",
          title: "Downloaded Requisitions",
          path: "/requisitions/downloaded",
          icon: undefined,
          permissions: ["downloaded-requisitions"],
        },
        {
          key: "dispatched-requisitions",
          title: "Dispatched Requisitions",
          path: "/requisitions/dispatched",
          icon: undefined,
          permissions: ["dispatched-requisitions"],
        },
        {
          key: "confirmed-delivery-requisitions",
          title: "Confirmed Delivery Requisitions",
          path: "/requisitions/confirmed-delivery",
          icon: undefined,
          permissions: ["confirmed-delivery-requisitions"],
        },
        {
          key: "delivered-requisitions",
          title: "Delivered Requisitions",
          path: "/requisitions/delivered",
          icon: undefined,
          permissions: ["delivered-requisitions"],
        },
      ],
    },
    {
      key: "reports",
      title: "Reports",
      icon: BarChartOutlined,
      path: "/reports",
      children: [
        {
          key: "make-challan",
          title: "Make A Challan",
          path: "/reports/make-challan",
          icon: undefined,
        },
        {
          key: "challan-list",
          title: "All Challans",
          path: "/reports/challan-list",
          icon: undefined,
        },
      ],
    },
    {
      key: "settings",
      title: "Settings",
      icon: SettingOutlined,
      path: "/settings",
      permissions: ["view-settings"],
    },
  ]);

  // Function to add a new menu item
  const addMenuItem = (item: MenuItem) => {
    menuItems.value.push(item);
  };

  // Function to remove a menu item by key
  const removeMenuItem = (key: string) => {
    const index = menuItems.value.findIndex((item) => item.key === key);
    if (index !== -1) {
      menuItems.value.splice(index, 1);
    }
  };

  // Function to update a menu item
  const updateMenuItem = (key: string, updatedItem: Partial<MenuItem>) => {
    const item = menuItems.value.find((item) => item.key === key);
    if (item) {
      Object.assign(item, updatedItem);
    }
  };

    // Permission-based filter function
function filterMenuByPermissions(items: MenuItem[], userPermissions: string[]): MenuItem[] {
  return items
    .filter((item) => {
      // ✅ শুধু তখনই থাকবে, যখন permissions আছে এবং তা userPermissions-এ মিলে
      return (
        item.permissions &&
        item.permissions.length > 0 &&
        item.permissions.some((perm) => userPermissions.includes(perm))
      );
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByPermissions(item.children, userPermissions) : undefined,
    }))
    .filter((item) => {
      // ✅ যদি children থাকে, সেগুলো ফিল্টার করার পর অন্তত একটি থাকতে হবে
      return !item.children || item.children.length > 0;
    });
}


  const getFilteredMenu = (userPermissions: string[]) => {
    return filterMenuByPermissions(menuItems.value, userPermissions)
  }


  return {
    menuItems,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
    getFilteredMenu,
  };
});
