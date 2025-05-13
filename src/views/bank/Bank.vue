<template>
  <div class="bank-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-title-container">
          <h1 class="header-title">Bank Management</h1>
          <p class="header-subtitle">View and manage all banks</p>
        </div>
        <div class="header-actions">
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
    <div class="stats-container">
      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Total Banks</p>
            <p class="stats-value">{{ banks.length }}</p>
          </div>
          <div class="stats-icon">
            <BankOutlined />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Active Banks</p>
            <p class="stats-value">{{ banks.length }}</p>
          </div>
          <div class="stats-icon stats-icon-navy">
            <CheckCircleOutlined />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Last Updated</p>
            <p class="stats-value">Today</p>
          </div>
          <div class="stats-icon stats-icon-teal-light">
            <ClockCircleOutlined />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <div class="table-header">
        <h2 class="table-title">All Bank List</h2>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search banks..."
          class="search-input"
          @search="onSearch"
          allow-clear
        />
      </div>

      <div class="table-responsive">
        <a-table
          :dataSource="filteredBanks"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total:number) => `Total ${total} banks`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }"
          :loading="loading"
          :rowClassName="rowClassName"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- Bank Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'bankName'">
              <div class="bank-name-cell">
                <div class="bank-icon">
                  <BankOutlined />
                </div>
                <span>{{ record.bankName }}</span>
              </div>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <a-tooltip title="Edit Bank">
                  <a-button
                    type="primary"
                    size="small"
                    class="edit-btn"
                    @click="showModal('edit', record)"
                  >
                    <template #icon>
                      <EditOutlined class="pb-13" />
                    </template>
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete Bank">
                  <a-button type="primary" size="small" class="delete-btn">
                    <template #icon>
                      <DeleteOutlined class="pb-13" />
                    </template>
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
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
        <div class="modal-header-content">
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
        <a-button @click="modalVisible = false" class="cancel-btn">
          Cancel
        </a-button>
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
  ClockCircleOutlined,
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
  return index % 2 === 0 ? "table-row-light" : "table-row-dark";
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
/* Base container */
.bank-management-container {
  padding: 0;
  background-color: var(--neutral-50);
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Header Section - Now using secondary colors */
.header-section {
  background: linear-gradient(
    135deg,
    var(--secondary-color) 0%,
    var(--secondary-light) 100%
  );
  padding: 2rem;
  color: white;
  border-radius: 0 0 1rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.header-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
}

/* Add Bank Button - Now using primary colors */
.add-bank-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 500;
  height: 40px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.add-bank-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
  transform: translateY(-1px);
}

/* Stats Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Stats Card - Now using secondary color for border */
.stats-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--secondary-color);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stats-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-label {
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin: 0 0 0.25rem 0;
}

.stats-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--neutral-800);
  margin: 0;
}

/* Stats Icons - Swapped colors */
.stats-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: rgba(13, 148, 136, 0.1);
  color: var(--secondary-color);
  font-size: 1.5rem;
}

.stats-icon-navy {
  background-color: rgba(10, 25, 47, 0.1);
  color: var(--primary-color);
}

.stats-icon-teal-light {
  background-color: rgba(20, 184, 166, 0.1);
  color: var(--secondary-light);
}

/* Table Section */
.table-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin: 0 1.5rem 1.5rem 1.5rem;
  overflow: hidden;
}

.table-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
}

@media (min-width: 768px) {
  .table-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.search-input {
  max-width: 100%;
}

@media (min-width: 768px) {
  .search-input {
    max-width: 300px;
  }
}

.table-responsive {
  overflow-x: auto;
}

/* Custom Table Styling */
:deep(.custom-table .ant-table) {
  background-color: transparent;
}

:deep(.custom-table .ant-table-thead > tr > th) {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  font-weight: 600;
  border-bottom: 2px solid var(--neutral-200);
  padding: 1rem 1rem;
}

:deep(.custom-table .ant-table-tbody > tr > td) {
  padding: 1rem 1rem;
  border-bottom: 1px solid var(--neutral-200);
}

:deep(.table-row-light) {
  background-color: #ffffff;
}

:deep(.table-row-dark) {
  background-color: var(--neutral-50);
}

/* Table hover - Now using primary color */
:deep(.custom-table .ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: rgba(10, 25, 47, 0.05) !important;
}

/* Pagination - Now using secondary color */
:deep(.ant-pagination-item-active) {
  border-color: var(--secondary-color);
}

:deep(.ant-pagination-item-active a) {
  color: var(--secondary-color);
}

/* Search button - Now using secondary color */
:deep(.ant-input-search-button) {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

:deep(.ant-input-search-button:hover) {
  background-color: var(--secondary-light);
  border-color: var(--secondary-light);
}

/* Bank Name Cell - Now using secondary color */
.bank-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bank-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: rgba(13, 148, 136, 0.1);
  color: var(--secondary-color);
}

/* Action Buttons - Swapped colors */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.edit-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

.delete-btn {
  background-color: #ef4444;
  border-color: #ef4444;
}

.delete-btn:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Modal Styling */
.bank-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--neutral-100);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header-content {
  display: flex;
  align-items: center;
}

/* Modal icon - Now using primary color */
.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  margin-right: 1rem;
  font-size: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin: 0.25rem 0 0 0;
}

.modal-close-btn {
  color: var(--neutral-500);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--neutral-200);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-item {
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: var(--neutral-100);
  border-top: 1px solid var(--neutral-200);
}

.cancel-btn {
  border-radius: 0.5rem;
}

/* Submit button - Now using primary color */
.submit-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  border-radius: 0.5rem;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

:deep(.site-form-item-icon) {
  color: var(--neutral-400);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .header-section {
    padding: 1.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .stats-container {
    padding: 0 1rem;
  }

  .table-container {
    margin: 0 1rem 1rem 1rem;
  }

  .table-header {
    padding: 1rem;
  }

  .modal-content {
    padding: 1rem;
  }
}

@media (min-width: 1280px) {
  .header-section {
    padding: 2.5rem;
  }

  .stats-container {
    padding: 0 2rem;
  }

  .table-container {
    margin: 0 2rem 2rem 2rem;
  }
}
</style>
