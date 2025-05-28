import { getMenuService } from "@/services/menu/menu.service";
import {
  BankOutlined,
  BarChartOutlined,
  BarcodeOutlined,
  BranchesOutlined,
  CloudDownloadOutlined,
  DashboardOutlined,
  FormOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface MenuItem {
  id: number;
  menuName: string;
  title: string;
  path: string;
  icon: string;
  parentId: number;
  children?: MenuItem[];
}
const icon = {
  BankOutlined,
  BarChartOutlined,
  BarcodeOutlined,
  BranchesOutlined,
  CloudDownloadOutlined,
  DashboardOutlined,
  FormOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
};

export const useMenuStore = defineStore("menu", () => {
  const menus = ref<MenuItem[]>([]);
  const errorMessage = ref("");
  const buildNestedMenus = (flatMenus: MenuItem[]): MenuItem[] => {
    const menuMap = new Map<number, MenuItem>();
    const rootMenus: MenuItem[] = [];

    flatMenus.forEach((menu) => {
      menu.children = [];
      menuMap.set(menu.id, menu);
    });

    flatMenus.forEach((menu) => {
      if (menu.parentId !== 0) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children?.push(menu);
        }
      } else {
        rootMenus.push(menu);
      }
    });

    return rootMenus;
  };

  // মেনু লোড করার ফাংশন
  const fetchMenus = async () => {
    try {
      const flatMenus = await getMenuService();
      menus.value = buildNestedMenus(flatMenus);
    } catch (error: any) {
      errorMessage.value = error?.message || "Menu loading failed";
    }
  };

  return {
    menus,
    fetchMenus,
    errorMessage,
  };
});
