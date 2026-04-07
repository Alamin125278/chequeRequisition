import {
  getAllMenusService,
  getMenuService,
} from "@/services/menu/menu.service";
import {
  BankOutlined,
  BarChartOutlined,
  BarcodeOutlined,
  BranchesOutlined,
  CloudDownloadOutlined,
  DashboardOutlined,
  FormOutlined,
  SettingOutlined,
  TeamOutlined,
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
  TeamOutlined,
};

export const useMenuStore = defineStore("menu", () => {
  const menus = ref<MenuItem[]>([]);
  const allMenus = ref<MenuItem[]>([]);
  const loading = ref<boolean>(false);
  const total = ref<number>(0);
  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
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

  const fetchAllMenus = async () => {
    loading.value = true;
    try {
      const result = await getAllMenusService({
        search: search.value,
        status: status.value,
        skip: skip.value,
        limit: limit.value,
      });
      allMenus.value = result.menus;
      total.value = result.totalMenus;
    } catch (e) {
      console.error("Error fetching menus", e);
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (text: string) => {
    search.value = text;
    skip.value = 0;
    fetchAllMenus();
  };

  const setStatus = (value: string) => {
    status.value = value;
    skip.value = 0;
    fetchAllMenus();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchAllMenus();
  };

  return {
    menus,
    fetchMenus,
    errorMessage,
    allMenus,
    fetchAllMenus,
    setPagination,
    setSearch,
    setStatus,
    search,
    status,
    skip,
    limit,
    total,
    loading,
  };
});
