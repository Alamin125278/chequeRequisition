<template>
  <div class="bg-background min-h-screen">
    <!-- Hero Header Section -->
    <div class="bg-card border-b border-gray-200 mb-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <MenuOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                Menu Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Manage all application menus and pages in one centralized
              dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-button
              type="primary"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
              @click="showModal('add')"
            >
              <template #icon><PlusOutlined /></template>
              Add New Menu
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Table Section -->
    <div class="mx-auto pb-8">
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-lg font-medium text-primary">All Menus List</h2>
              <p class="mt-1 text-sm text-secondary">
                A complete list of all application menus
              </p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <a-input-search
                v-model:value="searchText"
                placeholder="Search menus..."
                class="w-64"
                @search="menusStore.setSearch"
                allow-clear
              >
                <template #prefix>
                  <SearchOutlined class="text-secondary" />
                </template>
              </a-input-search>
            </div>
          </div>
        </div>

        <a-table
          :dataSource="menusStore.allMenus"
          :columns="columns"
          :loading="menusStore.loading"
          :pagination="pagination"
          @change="menuPagination"
          :rowClassName="() => 'hover:bg-background'"
          class="custom-table"
          :scroll="{ x: 800 }"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'menuName'">
              <div class="flex items-center">
                <!-- <component
                  :is="getIcon(record.icon)"
                  class="mr-2 text-accent"
                /> -->
                <span class="font-medium">{{ record.menuName }}</span>
              </div>
            </template>
            <template v-if="column.key === 'parentMenu'">
              <span v-if="record.parentId">{{
                getParentName(record.parentId)
              }}</span>
              <span v-else class="text-secondary italic">Root Menu</span>
            </template>
            <template v-if="column.key === 'isActive'">
              <a-tag
                :color="record.isActive ? 'success' : 'error'"
                class="px-3 py-1 rounded-md text-xs font-medium"
              >
                {{ record.isActive ? "Active" : "Inactive" }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex justify-center space-x-2">
                <a-tooltip title="Edit Menu">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="flex items-center justify-center bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
                    @click="showModal('edit', record)"
                  >
                    <EditOutlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip title="Delete Menu">
                  <a-button
                    type="primary"
                    shape="circle"
                    danger
                    class="flex items-center justify-center"
                    @click="showDeleteConfirm(record)"
                  >
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Menu Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'add' ? 'Add New Menu' : 'Edit Menu'"
      :width="600"
      :footer="null"
    >
      <div class="p-4">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <a-form-item label="Menu Name" name="menuName">
            <a-input
              v-model:value="formState.menuName"
              placeholder="Enter menu name"
              class="rounded-md"
            />
          </a-form-item>
          <a-form-item label="Title" name="title">
            <a-input
              v-model:value="formState.title"
              placeholder="Enter menu title"
              class="rounded-md"
            />
          </a-form-item>

          <a-form-item label="Menu Path" name="path">
            <a-input
              v-model:value="formState.path"
              placeholder="/dashboard"
              class="rounded-md"
            >
              <template #prefix>
                <LinkOutlined class="text-secondary" />
              </template>
            </a-input>
          </a-form-item>

          <div class="grid grid-cols-2 gap-4">
            <a-form-item label="Parent Menu" name="parentId">
              <a-select
                v-model:value="formState.parentId"
                placeholder="Select parent menu"
                class="rounded-md w-full"
                allow-clear
              >
                <a-select-option :value="null">Root Menu</a-select-option>
                <a-select-option
                  v-for="menu in menusStore.allMenus.filter(
                    (m) => m.id !== currentMenuId
                  )"
                  :key="menu.id"
                  :value="menu.id"
                >
                  {{ menu.menuName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <a-form-item label="Icon" name="icon">
            <a-select
              v-model:value="formState.icon"
              placeholder="Select icon"
              class="rounded-md w-full"
            >
              <a-select-option
                v-for="icon in iconOptions"
                :key="icon.value"
                :value="icon.value"
              >
                <component :is="getIcon(icon.value)" class="mr-2" />
                {{ icon.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Status" name="isActive">
            <a-switch
              v-model:checked="formState.isActive"
              checked-children="Active"
              un-checked-children="Inactive"
            />
          </a-form-item>

          <div
            class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
          >
            <a-button @click="modalVisible = false">Cancel</a-button>
            <a-button
              type="primary"
              @click="handleModalSubmit"
              :loading="submitting"
              class="bg-accent border-accent hover:bg-accent-dark hover:border-accent-dark"
            >
              {{ modalMode === "add" ? "Create Menu" : "Save Changes" }}
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { saveMenuService } from "@/services/menu/menu.service";
import { useMenuStore } from "@/stores/menuStore";
import {
  DashboardOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  LinkOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";

interface Menu {
  id: number;
  menuName: string;
  title: string;
  path: string;
  icon: string;
  parentId: number | null;
  isActive: boolean;
}

const searchText = ref("");
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentMenuId = ref<number | null>(null);
const submitting = ref(false);
const formRef = ref();
const menusStore = useMenuStore();

const iconOptions = [
  { label: "Dashboard", value: "DashboardOutlined" },
  { label: "Team", value: "TeamOutlined" },
  { label: "User", value: "UserOutlined" },
  { label: "Menu", value: "MenuOutlined" },
  { label: "File", value: "FileTextOutlined" },
  { label: "Settings", value: "SettingOutlined" },
];

const formState = reactive({
  menuName: "",
  title: "",
  path: "",
  icon: "",
  parentId: null as number | null,
  isActive: true,
});

const rules = {
  menuName: [{ required: true, message: "Please enter menu name" }],
  path: [{ required: true, message: "Please enter menu path" }],
  icon: [{ required: true, message: "Please select an icon" }],
};

const columns = [
  { title: "SL No", key: "id", width: 80 },
  {
    title: "Menu Name",
    key: "menuName",
    sorter: (a: Menu, b: Menu) => a.menuName.localeCompare(b.menuName),
  },
  { title: "Menu Path", dataIndex: "path", key: "menuPath" },
  { title: "Title", dataIndex: "title", key: "title" },
  { title: "Parent Menu", key: "parentMenu" },
  { title: "Status", key: "isActive", width: 100 },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 120,
    align: "center",
  },
];

onMounted(() => {
  menusStore.fetchAllMenus();
});

const menuPagination = (p: any) =>
  menusStore.setPagination(p.current, p.pageSize);
const pagination = computed(() => ({
  current: Math.floor(menusStore.skip / menusStore.limit) + 1,
  pageSize: menusStore.limit,
  total: menusStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} menus found`,
}));

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    DashboardOutlined,
    TeamOutlined,
    UserOutlined,
    MenuOutlined,
    FileTextOutlined,
    SettingOutlined,
  };
  return icons[iconName] || MenuOutlined;
};

const getParentName = (parentId: number) => {
  const parent = menusStore.allMenus.find((m) => m.id === parentId);
  return parent ? parent.menuName : "N/A";
};

const showModal = (mode: "add" | "edit", record?: Menu) => {
  modalMode.value = mode;
  if (mode === "add") {
    Object.assign(formState, {
      menuName: "",
      title: "",
      path: "",
      icon: "",
      parentId: null,
      isActive: true,
    });
    currentMenuId.value = null;
  } else if (mode === "edit" && record) {
    Object.assign(formState, { ...record });
    currentMenuId.value = record.id;
  }
  modalVisible.value = true;
};

const showDeleteConfirm = (record: Menu) => {
  Modal.confirm({
    title: "Are you sure you want to delete this menu?",
    content: `You are about to delete "${record.menuName}". This action cannot be undone.`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      menusStore.allMenus = menusStore.allMenus.filter(
        (m) => m.id !== record.id
      );
      message.success("Menu deleted successfully");
    },
  });
};

const handleModalSubmit = () => {
  formRef.value.validate().then(async () => {
    submitting.value = true;
    const payload = {
      id: currentMenuId.value, // required for update
      menuName: formState.menuName,
      title: formState.title,
      path: formState.path,
      icon: formState.icon,
      parentId: formState.parentId,
      isActive: formState.isActive,
    };
    // Simulate API call
    try {
      await saveMenuService(payload, modalMode.value === "edit");
      message.success(
        modalMode.value === "edit"
          ? "Menu updated successfully"
          : "Menu created successfully"
      );

      // refresh Menus list
      await menusStore.fetchAllMenus();
      modalVisible.value = false;
      submitting.value = false;
    } catch (error) {
      console.error("API error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      submitting.value = false;
    }
  });
};
</script>
