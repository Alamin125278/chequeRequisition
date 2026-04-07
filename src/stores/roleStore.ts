import { getAllRolesService } from "@/services/role/role.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface role {
  id: number;
  roleName: string;
  isActive: boolean;
}
export const useRoleStore = defineStore("role", () => {
  const roles = ref<role[]>([]);
  const loading = ref<boolean>(false);
  const total = ref<number>(0);
  const search = ref<string>("");
  const status = ref<string>("");
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const errorMessage = ref("");

  const fetchAllRoles = async () => {
    loading.value = true;
    try {
      const result = await getAllRolesService({
        search: search.value,
        status: status.value,
        skip: skip.value,
        limit: limit.value,
      });
      console.log(result);
      roles.value = result.userRoleDtos;
      //   total.value = result.totalRoles;
    } catch (e) {
      console.error("Error fetching roles", e);
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (text: string) => {
    search.value = text;
    skip.value = 0;
    fetchAllRoles();
  };

  const setStatus = (value: string) => {
    status.value = value;
    skip.value = 0;
    fetchAllRoles();
  };

  const setPagination = (currentPage: number, pageSize: number) => {
    limit.value = pageSize;
    skip.value = (currentPage - 1) * pageSize;
    fetchAllRoles();
  };

  return {
    roles,
    errorMessage,
    fetchAllRoles,
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
