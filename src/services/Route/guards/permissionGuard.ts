import { useMenuStore } from "@/stores/menuStore";
import { useRouter, type RouteLocationNormalized } from "vue-router";

export const permissionGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => {
  //console.log("permissionGuard");

  const menuStore = useMenuStore();
  const router = useRouter();
  console.log(menuStore.menus);
  const findedMenu = menuStore.menus.find((menu) => {
    return menu.path === to.path;
  });
  if (findedMenu) {
    return true;
  }
  router.push("/");
};
