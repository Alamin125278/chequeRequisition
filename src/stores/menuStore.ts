import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DashboardOutlined,
  FormOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  BankOutlined,
  BranchesOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue";
import Branch from "@/views/branch/branch.vue";

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
    },
    {
      key: "banks",
      title: "Banks",
      icon: BankOutlined,
      path: "/banks",
    },
    {
      key: "branches",
      title: "Branches",
      icon: BranchesOutlined,
      path: "/branches",
    },
    {
      key: "users",
      title: "Users",
      icon: UsergroupAddOutlined,
      path: "/users",
    },
    {
      key: "requisitions",
      title: "Requisitions",
      icon: FormOutlined,
      path: "/requisitions",
      children: [
        {
          key: "new-requisition",
          title: "New Requisition",
          path: "/requisitions/new",
          icon: undefined,
        },

        {
          key: "all-requisitions-page",
          title: "All Requisitions",
          path: "/requisitions/all",
          icon: undefined,
        },
        {
          key: "pending-requisitions",
          title: "Pending Requisitions",
          path: "/requisitions/pending",
          icon: undefined,
        },
        {
          key: "approved-requisitions",
          title: "Approved Requisitions",
          path: "/requisitions/approved",
          icon: undefined,
        },
        {
          key: "ordered-requisitions",
          title: "Ordered Requisitions",
          path: "/requisitions/ordered",
          icon: undefined,
        },
        {
          key: "dispatch-requisitions",
          title: "Dispatch Requisitions",
          path: "/requisitions/dispatch",
          icon: undefined,
        },
        {
          key: "delivered-requisitions",
          title: "Delivered Requisitions",
          path: "/requisitions/delivered",
          icon: undefined,
        },
      ],
    },
    {
      key: "reports",
      title: "Reports",
      icon: BarChartOutlined,
      path: "/reports",
    },
    {
      key: "settings",
      title: "Settings",
      icon: SettingOutlined,
      path: "/settings",
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

  return {
    menuItems,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
  };
});
