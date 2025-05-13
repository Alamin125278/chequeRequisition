<template>
  <div
    class="branch-management-container"
    :class="{ 'modal-open': modalVisible }"
  >
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-title-container">
          <h1 class="header-title">Branch Management</h1>
          <p class="header-subtitle">View and manage all bank branches</p>
        </div>
        <div class="header-actions">
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
    <div class="stats-container">
      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Total Branches</p>
            <p class="stats-value">{{ branches.length }}</p>
          </div>
          <div class="stats-icon">
            <BranchesOutlined />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-info">
            <p class="stats-label">Active Branches</p>
            <p class="stats-value">{{ activeCount }}</p>
          </div>
          <div class="stats-icon stats-icon-navy">
            <CheckCircleOutlined />
          </div>
        </div>
      </div>
    </div>

    <!-- Branch Map Section
    <div class="map-container">
      <div class="map-header">
        <h2 class="map-title">Branch Locations</h2>
        <a-select
          v-model:value="selectedRegion"
          placeholder="Filter by region"
          class="region-filter"
          allowClear
        >
          <a-select-option value="north">North Region</a-select-option>
          <a-select-option value="south">South Region</a-select-option>
          <a-select-option value="east">East Region</a-select-option>
          <a-select-option value="west">West Region</a-select-option>
          <a-select-option value="central">Central Region</a-select-option>
        </a-select>
      </div>
      <div class="map-placeholder">
        <EnvironmentOutlined class="map-icon" />
        <p class="map-text">Interactive branch map will be displayed here</p>
      </div>
    </div> -->

    <!-- Table Section -->
    <div class="table-container">
      <div class="table-header">
        <h2 class="table-title">All Branch List</h2>
        <div class="table-actions">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search branches..."
            class="search-input"
            @search="onSearch"
            allow-clear
          />
          <a-select
            v-model:value="statusFilter"
            placeholder="Status"
            class="status-filter"
            allowClear
          >
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="inactive">Inactive</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="table-responsive">
        <a-table
          :dataSource="filteredBranches"
          :columns="columns"
          :pagination="{
            pageSize: 10,
            showTotal: (total:number) => `Total ${total} branches`,
          }"
          :loading="loading"
          :rowClassName="rowClassName"
          class="custom-table"
          :scroll="{ x: 1000 }"
        >
          <!-- Branch Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'bankName'">
              <div class="flex items-center">
                <BankOutlined class="mr-2 text-gray-500" />
                {{ record.bankName }}
              </div>
            </template>
            <template v-if="column.key === 'branchName'">
              <div class="branch-name-cell">
                <div class="branch-icon">
                  <BranchesOutlined />
                </div>
                <span>{{ record.branchName }}</span>
              </div>
            </template>

            <!-- Status Column -->
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'success' : 'error'">
                {{ record.status === "active" ? "Active" : "Inactive" }}
              </a-tag>
            </template>

            <!-- Action Column -->
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <a-tooltip title="Edit Branch">
                  <a-button
                    type="primary"
                    size="small"
                    class="edit-btn"
                    @click="showModal('edit', record)"
                  >
                    <template #icon>
                      <EditOutlined class="btn-icon" />
                    </template>
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete Branch">
                  <a-button type="primary" size="small" class="delete-btn">
                    <template #icon>
                      <DeleteOutlined class="btn-icon" />
                    </template>
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
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
      :zIndex="100"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }"
      class="branch-modal"
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
              {{ modalMode === "add" ? "Add New Branch" : "Edit Branch" }}
            </h3>
            <p class="modal-subtitle">
              {{
                modalMode === "add"
                  ? "Create a new branch with the form below"
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
                  <a-select-option value="">Select bank</a-select-option>
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

            <div class="form-row">
              <a-form-item label="Status" name="status" class="form-item">
                <a-select
                  v-model:value="formState.status"
                  placeholder="Select status"
                >
                  <a-select-option value="active">Active</a-select-option>
                  <a-select-option value="inactive">Inactive</a-select-option>
                </a-select>
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
        <a-button @click="modalVisible = false" class="cancel-btn">
          Cancel
        </a-button>
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
import { ref, computed, reactive, watch } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";

// Search and filter states
const searchText = ref("");
const statusFilter = ref("");
const selectedRegion = ref("");
const loading = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentBranchId = ref<string | null>(null);
const submitting = ref(false);
const formRef = ref();

// Function for row class name
const rowClassName = (record: any, index: number) => {
  return index % 2 === 0 ? "table-row-light" : "table-row-dark";
};

// Form state for modal
const formState = reactive({
  bankName: "",
  branchName: "",
  branchCode: "",
  routingNumber: "",
  branchEmail: "",
  branchPhone: "",
  branchAddress: "",
  status: "active",
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
  { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
  },
  { title: "Branch Code", dataIndex: "branchCode", key: "branchCode" },
  { title: "Routing Number", dataIndex: "routingNumber", key: "routingNumber" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Branch Email", dataIndex: "branchEmail", key: "branchEmail" },
  { title: "Branch Phone", dataIndex: "branchPhone", key: "branchPhone" },
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

// Sample data
const branches = [
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
  },
];

// Computed properties
const activeCount = computed(() => {
  return branches.filter((branch) => branch.status === "active").length;
});

// Filtered data based on search and filters
const filteredBranches = computed(() => {
  let result = [...branches];

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.branchName.toLowerCase().includes(search) ||
        item.branchCode.toLowerCase().includes(search) ||
        item.branchEmail.toLowerCase().includes(search) ||
        item.branchPhone.toLowerCase().includes(search) ||
        item.branchAddress.toLowerCase().includes(search) ||
        item.bankName.toLowerCase().includes(search) ||
        item.routingNumber.toLowerCase().includes(search)
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value);
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
      branchName: "",
      branchCode: "",
      status: "active",
      branchEmail: "",
      branchPhone: "",
      branchAddress: "",
      routingNumber: "",
    });
    currentBranchId.value = null;
  } else if (mode === "edit" && record) {
    // Populate form with branch data for editing
    Object.assign(formState, {
      bankName: record.bankName,
      branchName: record.branchName,
      branchCode: record.branchCode,
      routingNumber: record.routingNumber,
      branchPhone: record.branchPhone,
      branchAddress: record.branchAddress,
      status: record.status || "active",
    });
    currentBranchId.value = record.id;
  }

  modalVisible.value = true;
  // Set body z-index to -1 when modal opens
  document.body.style.zIndex = "-1";
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
        // Reset body z-index when modal closes
        document.body.style.zIndex = "";
      }, 1000);
    })
    .catch((error: any) => {
      console.log("Validation failed:", error);
    });
};

// Watch for modal visibility changes to update body z-index
watch(modalVisible, (isVisible) => {
  if (isVisible) {
    document.body.style.zIndex = "-1";
  } else {
    document.body.style.zIndex = "";
  }
});
</script>

<style scoped>
/* Base container */
.branch-management-container {
  padding: 0;
  background-color: var(--neutral-50);
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  position: relative;
}

/* Header Section */
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

/* Add Branch Button */
.add-branch-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 500;
  height: 40px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.add-branch-btn:hover {
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

/* Stats Card */
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

/* Stats Icons */
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

/* Map Section */
.map-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin: 0 1.5rem 1.5rem 1.5rem;
  overflow: hidden;
}

.map-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
}

@media (min-width: 768px) {
  .map-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.map-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.region-filter {
  width: 100%;
  max-width: 200px;
}

.map-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  padding: 2rem;
}

.map-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.map-text {
  font-size: 1rem;
  text-align: center;
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

.table-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .table-actions {
    flex-direction: row;
    width: auto;
  }
}

.search-input {
  width: 100%;
}

@media (min-width: 768px) {
  .search-input {
    width: 250px;
  }
}

.status-filter {
  width: 100%;
}

@media (min-width: 768px) {
  .status-filter {
    width: 150px;
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

/* Table hover */
:deep(.custom-table .ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: rgba(10, 25, 47, 0.05) !important;
}

/* Pagination */
:deep(.ant-pagination-item-active) {
  border-color: var(--secondary-color);
}

:deep(.ant-pagination-item-active a) {
  color: var(--secondary-color);
}

/* Search button */
:deep(.ant-input-search-button) {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

:deep(.ant-input-search-button:hover) {
  background-color: var(--secondary-light);
  border-color: var(--secondary-light);
}

/* Branch Name Cell */
.branch-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.branch-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: rgba(13, 148, 136, 0.1);
  color: var(--secondary-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.view-btn:hover {
  background-color: var(--secondary-light);
  border-color: var(--secondary-light);
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
.branch-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Enhanced modal mask (backdrop) */
:deep(.ant-modal-mask) {
  background-color: rgba(0, 0, 0, 0.65) !important;
}

/* Modal wrapper */
:deep(.ant-modal-wrap) {
  z-index: 100 !important;
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

/* Modal icon */
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

/* Submit button */
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

/* Fix for button icon alignment */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .header-section {
    padding: 1.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .stats-container,
  .map-container,
  .table-container {
    margin: 0 1rem 1rem 1rem;
  }

  .table-header,
  .map-header {
    padding: 1rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .map-placeholder {
    height: 200px;
  }
}

@media (min-width: 1280px) {
  .header-section {
    padding: 2.5rem;
  }

  .stats-container,
  .map-container,
  .table-container {
    margin: 0 2rem 2rem 2rem;
  }

  .map-placeholder {
    height: 400px;
  }
}
</style>
