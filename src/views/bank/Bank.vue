<template>
  <div class="branch-list-container p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Bank Management</h1>
          <p class="text-gray-500 mt-1">View and manage all banks</p>
        </div>
        <div class="mt-4 md:mt-0">
          <a-button
            type="primary"
            class="add-bank-btn"
            @click="showModal('add')"
          >
            <template #icon><PlusOutlined /></template>
            Add New Bank
          </a-button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Banks</p>
            <p class="text-2xl font-bold">{{ banks.length }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <BankOutlined style="font-size: 24px; color: #3b82f6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-5 border-b border-gray-200 flex justify-between">
        <h2 class="text-lg font-semibold text-gray-800">All Bank List</h2>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search banks..."
          style="max-width: 300px"
          @search="onSearch"
          allow-clear
        />
      </div>

      <a-table
        :dataSource="filteredBanks"
        :columns="columns"
        :pagination="{
            pageSize: 10,
            showTotal: (total:number) => `Total ${total} banks`,
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

    <!-- Enhanced Professional Bank Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="null"
      :footer="null"
      :width="800"
      :bodyStyle="{ padding: '0' }"
      style="top: 20px"
      :maskClosable="false"
      class="bank-modal"
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
              {{ modalMode === "add" ? "Add New Bank" : "Edit Bank" }}
            </h3>
            <p class="modal-subtitle">
              {{
                modalMode === "add"
                  ? "Create a new bank with the form below"
                  : "Update bank information"
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
                <a-input
                  v-model:value="formState.bankName"
                  placeholder="Enter bank name"
                />
              </a-form-item>
              <a-form-item label="Bank Code" name="bankCode" class="form-item">
                <a-input
                  v-model:value="formState.bankCode"
                  placeholder="Enter bank code"
                />
              </a-form-item>
            </div>

            <div class="form-row">
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
                label="Bank Email"
                name="bankEmail"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.bankEmail"
                  placeholder="Enter email address"
                >
                  <template #prefix>
                    <MailOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item
                label="Bank Phone"
                name="bankPhone"
                class="form-item"
              >
                <a-input
                  v-model:value="formState.bankPhone"
                  placeholder="Enter phone number"
                >
                  <template #prefix>
                    <PhoneOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <a-form-item label="Bank Address" name="bankAddress">
              <a-textarea
                v-model:value="formState.bankAddress"
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
            {{ modalMode === "add" ? "Create Bank" : "Save Changes" }}
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
const currentBankId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();

// Function for row class name
const rowClassName = (record: any, index: number) => {
  return index % 2 === 0 ? "bg-gray-50" : "";
};

// Form state for modal
const formState = reactive({
  bankName: "",
  bankCode: "",
  routingNumber: "",
  bankEmail: "",
  bankPhone: "",
  bankAddress: "",
});

// Form validation rules
const rules = {
  bankName: [{ required: true, message: "Please input bank name!" }],
  bankCode: [{ required: true, message: "Please input bank code!" }],
  routingNumber: [{ required: true, message: "Please input routing number!" }],
  bankEmail: [{ required: true, message: "Please input bank email!" }],
  bankPhone: [{ required: true, message: "Please input bank phone!" }],
  bankAddress: [{ required: true, message: "Please input bank address!" }],
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
  { title: "Bank Code", dataIndex: "bankCode", key: "bankCode" },
  { title: "Routing Number", dataIndex: "routingNumber", key: "routingNumber" },
  { title: "Bank Email", dataIndex: "bankEmail", key: "bankEmail" },
  { title: "Bank Phone", dataIndex: "bankPhone", key: "bankPhone" },
  { title: "Bank Address", dataIndex: "bankAddress", key: "bankAddress" },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 150,
  },
];

// Sample data (expanded with more entries)
const banks = [
  {
    id: "1",
    bankName: "Public Bank",
    bankCode: "PB",
    routingNumber: "123456789",
    bankEmail: "publicbank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
  },
  {
    id: "2",
    bankName: "Commercial Bank",
    bankCode: "CB",
    routingNumber: "123456789",
    bankEmail: "commercialbank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
  },
  {
    id: "3",
    bankName: "City Bank",
    bankCode: "CB",
    routingNumber: "123456789",
    bankEmail: "citybank@gmail.com",
    bankPhone: "1234567890",
    bankAddress: "Dhaka, Bangladesh",
  },
  // Additional entries omitted for brevity
];

// Filtered data based on search and filters
const filteredBanks = computed(() => {
  let result = [...banks];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.bankName.toLowerCase().includes(search) ||
        item.bankCode.toLowerCase().includes(search) ||
        item.bankEmail.toLowerCase().includes(search) ||
        item.bankPhone.toLowerCase().includes(search) ||
        item.bankAddress.toLowerCase().includes(search)
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
      bankName: "",
      bankCode: "",
      routingNumber: "",
      bankEmail: "",
      bankPhone: "",
      bankAddress: "",
    });
    currentBankId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with branch data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      bankCode: record.bankCode,
      routingNumber: record.routingNumber,
      bankEmail: record.bankEmail,
      bankPhone: record.bankPhone,
      bankAddress: record.bankAddress,
    });
    currentBankId.value = record.id;
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
          console.log("Adding new bank:", formState);
          // You would typically make an API call here
        } else {
          // Logic to update existing branch
          console.log("Updating bank ID:", currentBankId.value, formState);
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
.add-bank-btn {
  background-color: #22c55e;
  border-color: #22c55e;
}

.add-bank-btn:hover {
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
.bank-modal :deep(.ant-modal-content) {
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
