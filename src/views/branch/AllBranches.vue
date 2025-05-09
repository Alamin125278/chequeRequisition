<template>
  <div class="branch-list-container p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Branch Management</h1>
          <p class="text-gray-500 mt-1">View and manage all bank branches</p>
        </div>
        <div class="mt-4 md:mt-0">
          <a-button
            type="primary"
            class="add-branch-btn"
            @click="showModal('add')"
          >
            <template #icon><PlusOutlined /></template>
            Add New Branch
          </a-button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Branches</p>
            <p class="text-2xl font-bold">{{ requisitions.length }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <BranchesOutlined style="font-size: 24px; color: #3b82f6" />
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Banks</p>
            <p class="text-2xl font-bold">1</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <BankOutlined style="font-size: 24px; color: #a855f7" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-5 border-b border-gray-200 flex justify-between">
        <h2 class="text-lg font-semibold text-gray-800">All Branch List</h2>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search branches..."
          style="max-width: 300px"
          @search="onSearch"
          allow-clear
        />
      </div>

      <a-table
        :dataSource="filteredRequisitions"
        :columns="columns"
        :pagination="{
          pageSize: 10,
          showTotal: (total:number) => `Total ${total} branches`,
        }"
        :loading="loading"
        :rowClassName="rowClassName"
        class="custom-table"
      >
        <!-- Bank Name Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'bankName'">
            <div class="flex items-center">
              <BankOutlined class="mr-2 text-gray-500" />
              {{ record.bankName }}
            </div>
          </template>

          <!-- Branch Name Column -->
          <template v-if="column.key === 'branchName'">
            <div class="font-medium">{{ record.branchName }}</div>
          </template>

          <!-- Action Column -->
          <template v-if="column.key === 'action'">
            <div class="flex space-x-2">
              <a-tooltip title="View Details">
                <a-button type="link" size="small" style="color: #4096ff">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Edit Branch">
                <a-button
                  type="link"
                  size="small"
                  style="color: #22c55e"
                  @click="showModal('edit', record)"
                >
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Delete Branch">
                <a-button type="link" size="small" danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Enhanced Professional Branch Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="null"
      :footer="null"
      :width="800"
      :bodyStyle="{ padding: '0' }"
      style="top: 20px"
      :maskClosable="false"
      class="branch-modal"
    >
      <!-- Custom Header -->
      <div class="modal-custom-header">
        <div class="flex items-center">
          <div class="modal-icon">
            <template v-if="modalMode === 'add'">
              <PlusOutlined />
            </template>
            <template v-else>
              <EditOutlined />
            </template>
          </div>
          <div>
            <h3 class="modal-title">
              {{ modalMode === "add" ? "Add New Branch" : "Edit Branch" }}
            </h3>
            <p class="modal-subtitle">
              {{
                modalMode === "add"
                  ? "Create a new bank branch with the form below"
                  : "Update branch information"
              }}
            </p>
          </div>
        </div>
        <a-button
          type="text"
          @click="modalVisible = false"
          class="modal-close-btn"
        >
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>

      <!-- Form Content -->
      <div class="modal-content">
        <a-form
          :model="formState"
          layout="vertical"
          :rules="rules"
          ref="formRef"
        >
          <div class="form-section">
            <h4 class="form-section-title">Basic Information</h4>

            <div class="form-row">
              <a-form-item label="Bank Name" name="bankName" class="form-item">
                <a-select
                  v-model:value="formState.bankName"
                  placeholder="Select bank"
                >
                  <a-select-option value="Public Bank"
                    >Public Bank</a-select-option
                  >
                  <a-select-option value="Commercial Bank"
                    >Commercial Bank</a-select-option
                  >
                  <a-select-option value="City Bank">City Bank</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Branch Name"
                name="branchName"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.branchName"
                  placeholder="Enter branch name"
                />
              </a-form-item>
            </div>

            <div class="form-row">
              <a-form-item
                label="Branch Code"
                name="branchCode"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.branchCode"
                  placeholder="Enter branch code"
                />
              </a-form-item>

              <a-form-item
                label="Routing Number"
                name="routingNumber"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.routingNumber"
                  placeholder="Enter routing number"
                />
              </a-form-item>
            </div>
          </div>

          <div class="form-section">
            <h4 class="form-section-title">Contact Information</h4>

            <div class="form-row">
              <a-form-item
                label="Branch Email"
                name="branchEmail"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.branchEmail"
                  placeholder="Enter email address"
                >
                  <template #prefix>
                    <MailOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item
                label="Branch Phone"
                name="branchPhone"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.branchPhone"
                  placeholder="Enter phone number"
                >
                  <template #prefix>
                    <PhoneOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <a-form-item label="Branch Address" name="branchAddress">
              <a-textarea
                v-model:value="formState.branchAddress"
                placeholder="Enter complete address"
                :rows="3"
                :autoSize="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </div>
        </a-form>
      </div>

      <!-- Custom Footer -->
      <div class="modal-footer">
        <a-button @click="modalVisible = false"> Cancel </a-button>
        <a-button type="primary" @click="handleModalSubmit" class="submit-btn">
          <template v-if="submitting">
            <LoadingOutlined />
            {{ modalMode === "add" ? "Creating..." : "Updating..." }}
          </template>
          <template v-else>
            {{ modalMode === "add" ? "Create Branch" : "Save Changes" }}
          </template>
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  BankOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";

// Search and filter states
const searchText = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentBranchId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();

// Function for row class name
const rowClassName = (record: any, index: number) => {
  return index % 2 === 0 ? "bg-gray-50" : "";
};

// Form state for modal
const formState = reactive({
  bankName: "Public Bank",
  branchName: "",
  branchCode: "",
  branchEmail: "",
  routingNumber: "",
  branchPhone: "",
  branchAddress: "",
  status: "active",
  type: "main",
});

// Form validation rules
const rules = {
  bankName: [{ required: true, message: "Please select a bank" }],
  branchName: [{ required: true, message: "Please enter branch name" }],
  branchCode: [{ required: true, message: "Please enter branch code" }],
  branchEmail: [
    { required: true, message: "Please enter branch email" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  routingNumber: [{ required: true, message: "Please enter routing number" }],
  branchPhone: [{ required: true, message: "Please enter branch phone" }],
  branchAddress: [{ required: true, message: "Please enter branch address" }],
};

// Table columns
const columns = [
  {
    title: "SL No",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
  },
  {
    title: "Branch Code",
    dataIndex: "branchCode",
    key: "branchCode",
  },
  {
    title: "Branch Email",
    dataIndex: "branchEmail",
    key: "branchEmail",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNumber",
    key: "routingNumber",
  },
  {
    title: "Branch Phone",
    dataIndex: "branchPhone",
    key: "branchPhone",
  },
  {
    title: "Branch Address",
    dataIndex: "branchAddress",
    key: "branchAddress",
    ellipsis: true,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 150,
  },
];

// Sample data (expanded with more entries)
const requisitions = [
  {
    id: "1",
    bankName: "Public Bank",
    branchName: "Mohakhali Branch",
    branchCode: "MOH",
    branchEmail: "mohakhalibranch@gmail.com",
    routingNumber: "125278",
    branchPhone: "1234567890",
    branchAddress: "Mohakhali, Dhaka, Bangladesh",
    status: "active",
    type: "main",
  },
  {
    id: "2",
    bankName: "Public Bank",
    branchName: "Tejgaon Branch",
    branchCode: "TEJ",
    branchEmail: "tejgaonbranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Tejgaon, Dhaka, Bangladesh",
    status: "active",
    type: "sub",
  },
  {
    id: "3",
    bankName: "Public Bank",
    branchName: "Dhaka Branch",
    branchCode: "DHA",
    branchEmail: "dhakabranch@gmail.com",
    routingNumber: "123456789",
    branchPhone: "1234567890",
    branchAddress: "Dhaka, Bangladesh",
    status: "active",
    type: "main",
  },
  {
    id: "4",
    bankName: "Public Bank",
    branchName: "Gulshan Branch",
    branchCode: "GUL",
    branchEmail: "gulshanbranch@gmail.com",
    routingNumber: "987654321",
    branchPhone: "0987654321",
    branchAddress: "Gulshan, Dhaka, Bangladesh",
    status: "inactive",
    type: "sub",
  },
  {
    id: "5",
    bankName: "Public Bank",
    branchName: "Banani Branch",
    branchCode: "BAN",
    branchEmail: "bananibranch@gmail.com",
    routingNumber: "456789123",
    branchPhone: "4567891230",
    branchAddress: "Banani, Dhaka, Bangladesh",
    status: "active",
    type: "main",
  },
  // Additional entries omitted for brevity
];

// Filtered data based on search and filters
const filteredRequisitions = computed(() => {
  let result = [...requisitions];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.branchName.toLowerCase().includes(search) ||
        item.bankName.toLowerCase().includes(search) ||
        item.branchCode.toLowerCase().includes(search) ||
        item.branchEmail.toLowerCase().includes(search) ||
        item.routingNumber.toLowerCase().includes(search)
    );
  }

  return result;
});

// Search function
const onSearch = (value: string) => {
  searchText.value = value;
  simulateLoading();
};

// Simulate loading for better UX
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// Show modal for adding or editing
const showModal = (mode: "add" | "edit", record?: any) => {
  modalMode.value = mode;

  if (mode === "add") {
    // Reset form for adding new branch
    Object.assign(formState, {
      bankName: "Public Bank",
      branchName: "",
      branchCode: "",
      branchEmail: "",
      routingNumber: "",
      branchPhone: "",
      branchAddress: "",
      status: "active",
      type: "main",
    });
    currentBranchId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with branch data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      branchName: record.branchName,
      branchCode: record.branchCode,
      branchEmail: record.branchEmail,
      routingNumber: record.routingNumber,
      branchPhone: record.branchPhone,
      branchAddress: record.branchAddress,
      status: record.status || "active",
      type: record.type || "main",
    });
    currentBranchId.value = record.id;
  }

  modalVisible.value = true;
};

// Handle modal submit
const handleModalSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      submitting.value = true;

      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", formState);

        if (modalMode.value === "add") {
          // Logic to add new branch
          console.log("Adding new branch:", formState);
          // You would typically make an API call here
        } else {
          // Logic to update existing branch
          console.log("Updating branch ID:", currentBranchId.value, formState);
          // You would typically make an API call here
        }

        submitting.value = false;
        modalVisible.value = false;
      }, 1000);
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};
</script>

<style scoped>
.add-branch-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.add-branch-btn:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.ant-pagination-item-active) {
  border-color: #22c55e;
}

:deep(.ant-pagination-item-active a) {
  color: #22c55e;
}

:deep(.ant-table-row:hover > td) {
  background-color: #f0fdf4 !important;
}

:deep(.ant-input-search-button) {
  background-color: #22c55e;
  border-color: #22c55e;
}

:deep(.ant-input-search-button:hover) {
  background-color: #16a34a;
  border-color: #16a34a;
}

/* Modal Styling */
.branch-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #22c55e;
  color: white;
  margin-right: 16px;
  font-size: 18px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.modal-close-btn {
  color: #6b7280;
}

.modal-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-item {
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.submit-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.submit-btn:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

:deep(.site-form-item-icon) {
  color: rgba(0, 0, 0, 0.45);
}
</style>
