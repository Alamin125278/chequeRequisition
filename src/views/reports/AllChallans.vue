<template>
  <div class="bg-background min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-teal-500 rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-teal-500">All</span> Challans Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              View and manage all delivery challans in one centralized
              dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4 flex gap-3">
            <a-tooltip title="Refresh data">
              <a-button
                type="primary"
                class="bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600"
                @click="refreshData"
              >
                <template #icon><ReloadOutlined /></template>
                Refresh
              </a-button>
            </a-tooltip>
            <!-- <a-tooltip title="Export all challans">
              <a-button
                type="default"
                class="border-teal-500 text-teal-600 hover:bg-teal-50"
                @click="exportAllChallans"
              >
                <template #icon><DownloadOutlined /></template>
                Export All
              </a-button>
            </a-tooltip> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="mx-auto py-6">
      <!-- Search and Filter Section -->
      <div class="bg-card shadow-md rounded-md p-4 mb-6">
        <h3
          class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
        >
          Filter Challans
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <template v-if="challanStore.banks.length === 1">
            <a-input
              :value="challanStore.banks[0].bankName"
              disabled
              class="w-full"
              style="background-color: #fff; color: #000; cursor: default"
            />
          </template>
          <template v-else>
            <a-select
              placeholder="Select Bank"
              class="w-full"
              @change="challanStore.setBank"
              allowClear
            >
              <a-select-option
                v-for="bank in challanStore.banks"
                :key="bank.id"
                :value="bank.id"
              >
                {{ bank.bankName }}
              </a-select-option>
            </a-select>
          </template>

          <template v-if="challanStore.branches.length === 1">
            <a-input
              :value="challanStore.branches[0].branchName"
              disabled
              class="w-full"
              style="background-color: #fff; color: #000; cursor: default"
            />
          </template>
          <!-- If more than 1, show dropdown -->
          <template v-else>
            <a-select
              placeholder="All branches"
              class="rounded-md w-full"
              @change="challanStore.setBranch"
            >
              <a-select-option value="">All branches</a-select-option>
              <a-select-option
                v-for="branch in challanStore.branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.branchName }}
              </a-select-option>
            </a-select>
          </template>
          <a-input-search
            v-model:value="challanNoFilter"
            placeholder="Challan Number"
            class="w-full"
            @search="challanStore.setChallanNo"
            allowClear
          >
            <template #prefix>
              <FileTextOutlined class="text-secondary" />
            </template>
          </a-input-search>

          <a-date-picker
            v-model:value="dateRange"
            @change="challanStore.setRequestDate"
            class="w-full"
            placeholder="Select Challan Date"
          />
        </div>
      </div>

      <!-- Challans Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Challans</h3>
          <span class="text-sm text-secondary"
            >{{ challanStore.total }} challans found</span
          >
        </div>
        <a-table
          :dataSource="challanStore.challans"
          :columns="challanColumns"
          :loading="loading"
          :pagination="pagination"
          rowKey="id"
          @change="challanPagination"
          class="custom-table"
          :scroll="{ x: 1000 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record, index }">
            <!-- SL No Column -->
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>

            <!-- Challan Number Column -->
            <template v-if="column.key === 'challanNumber'">
              <a-tag
                color="blue"
                class="px-3 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border-teal-200"
              >
                {{ record.challanNumber }}
              </a-tag>
            </template>

            <template v-if="column.key === 'requisitionCount'">
              <a-tag
                color="red"
                class="px-3 py-1 rounded-lg text-xs font-medium"
              >
                {{ record.requisitionCount }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-if="column.key === 'actions'">
              <div class="flex flex-wrap justify-center gap-2">
                <a-tooltip title="View Challan Items">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-challan-view"
                    @click="viewChallanItems(record)"
                    ><EyeOutlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip title="Export Challan">
                  <a-button
                    type="primary"
                    shape="circle"
                    class="btn-challan-export"
                    @click="exportChallan(record.id)"
                  >
                    <FilePdfOutlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Challan Items Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      :title="`Challan Details: ${challanNo || ''}`"
      width="90%"
      style="top: 20px"
      :footer="null"
      class="challan-items-modal"
    >
      <div class="mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Bank</p>
            <p class="font-medium text-primary">
              {{ bankName ?? "N/A" }}
            </p>
          </div>
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Receiving Branch</p>
            <p class="font-medium text-primary">
              {{ receivingBranchName ?? "N/A" }}
            </p>
          </div>
          <div class="bg-background p-4 rounded-md">
            <p class="text-sm text-secondary">Challan Date</p>
            <p class="font-medium text-primary">
              {{ formatDate(challanDate) ?? "N/A" }}
            </p>
          </div>
        </div>

        <a-table
          :dataSource="challanItemStore.challanItems"
          :columns="challanItemColumns"
          :loading="itemsLoading"
          :pagination="itemPagination"
          rowKey="id"
          @change="challanItemPagination"
          class="custom-table"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
            <!-- Severity Column -->
            <template v-if="column.key === 'serverity'">
              <a-tag
                :color="
                  record.serverity === 1
                    ? 'error'
                    : record.serverity === 2
                    ? 'warning'
                    : 'default'
                "
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{
                  record.serverity === 1
                    ? "Urgent"
                    : record.serverity === 2
                    ? "Normal"
                    : "Unknown"
                }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import FinteraFooterImage from "@/assets/challanImages/finterafooter.png";
import FinteralogoImage from "@/assets/challanImages/finterlogo.png";
import FlexItlogoImage from "@/assets/challanImages/flexitHeader.png";
import AuthSignature from "@/assets/signature.png";
import { useChallanItemStore } from "@/stores/challanItemStore.ts";
import {
  EyeOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";
import { getChallanExportService } from "../../services/challan/challan.service";
import { useChallanStore, type Challan } from "../../stores/challanStore";
import { generateChallanPdf } from "../../utils/ExcelFile/generateChallanPdf";

// State variables
const loading = ref(false);
const itemsLoading = ref(false);
const selectedChallan = ref<Challan | null>(null);
const challanNoFilter = ref("");
const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const isModalVisible = ref(false);

const challanStore = useChallanStore();
const challanItemStore = useChallanItemStore();

const pagination = computed(() => ({
  current: Math.floor(challanStore.skip / challanStore.limit) + 1,
  pageSize: challanStore.limit,
  total: challanStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Challans`,
}));

const itemPagination = computed(() => ({
  current: Math.floor(challanItemStore.skip / challanItemStore.limit) + 1,
  pageSize: challanItemStore.limit,
  total: challanItemStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Challan Items`,
}));

// Challan columns for the table
const challanColumns = [
  {
    title: "SL No",
    key: "id",
    width: 80,
  },
  {
    title: "Challan Number",
    dataIndex: "challanNumber",
    key: "challanNumber",
    width: 180,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranchName",
    key: "receivingBranchName",
    width: 180,
  },
  {
    title: "Challan Date",
    dataIndex: "challanDate",
    key: "challanDate",
    width: 150,
    render: (text: string) => formatDate(text),
    sorter: (a: Challan, b: Challan) =>
      new Date(a.challanDate).getTime() - new Date(b.challanDate).getTime(),
  },
  {
    title: "Courier Name",
    dataIndex: "courierName",
    key: "courierName",
    width: 150,
  },
  {
    title: "Items Count",
    dataIndex: "requisitionCount",
    key: "requisitionCount",
    width: 120,
    align: "center",
  },
  {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 180,
    align: "center",
  },
];

// Challan item columns for the modal table
const challanItemColumns = [
  {
    title: "Sl No",
    key: "id",
    width: 80,
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
    width: 150,
  },
  {
    title: "Account Name",
    dataIndex: "accountName",
    key: "accountName",
    width: 200,
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
    width: 120,
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
    width: 120,
  },
  {
    title: "Book Quantity",
    dataIndex: "bookQty",
    key: "bookQty",
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "serverity",
    key: "serverity",
    width: 120,
  },
];

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const challanPagination = (p: any) =>
  challanStore.setPagination(p.current, p.pageSize);
const challanItemPagination = (p: any) =>
  challanItemStore.setItemPagination(p.current, p.pageSize);

let challanNo = ref("");
let bankName = ref("");
let receivingBranchName = ref("");
let challanDate = ref("");

// Refresh data
const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success("Data refreshed successfully");
  }, 800);
};

const viewChallanItems = async (challan: Challan) => {
  isModalVisible.value = true;
  challanNo.value = challan.challanNumber;
  bankName.value = challan.bankName;
  receivingBranchName.value = challan.receivingBranchName;
  challanDate.value = challan.challanDate;
  challanItemStore.setChallanId(challan.id);
};

// Export all challans
const exportChallan = async (id: number) => {
  try {
    const challanId = [id];
    const challans = await getChallanExportService(challanId);

    if (!challans || challans.length === 0) {
      message.error("No challan data found.");
    }

    if (challans[0].vendorName === "Fintera Solutions Limited") {
      const logoBase64 = await toBase64(FinteralogoImage);
      const footerBase64 = await toBase64(FinteraFooterImage);
      const AuthSignatureBase64 = await toBase64(AuthSignature);
      // generateSingleSheetChallanExcel(challans, logoBase64, footerBase64);
      generateChallanPdf(
        challans,
        logoBase64,
        footerBase64,
        AuthSignatureBase64
      );
    } else {
      const logoBase64 = await toBase64(FlexItlogoImage);
      const footerBase64 = await toBase64(FinteraFooterImage);
      const AuthSignatureBase64 = await toBase64(AuthSignature);
      // alert(logoBase64);
      generateChallanPdf(
        challans,
        logoBase64,
        footerBase64,
        AuthSignatureBase64
      );
    }
    message.success("Challan exported successfully");
  } catch (error) {
    console.error("Failed to export challan:", error);
    // Optional: show error to user using a toast or alert
    message.error("Something went wrong while exporting the challan.");
  }
};

const toBase64 = async (filePath: string) => {
  return fetch(filePath)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};

// Fetch data on component mount
onMounted(() => {
  challanStore.resetFilters();
  challanStore.featchBanks();
});
</script>

<style scoped>
/* Custom table styles */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: var(--background);
  font-weight: 600;
  color: var(--text-primary);
  padding: 16px;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  color: var(--text-primary);
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: var(--background);
}

/* Custom modal styles */
.challan-items-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.challan-items-modal :deep(.ant-modal-header) {
  background-color: #e6fffa;
  border-bottom: 1px solid #b2f5ea;
  padding: 16px 24px;
}

.challan-items-modal :deep(.ant-modal-title) {
  color: #0d9488;
  font-weight: 600;
  font-size: 18px;
}

/* Custom form styles */
.ant-form-item-label > label {
  font-weight: 500;
  color: var(--text-primary);
}

.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector,
.ant-input-number,
.ant-picker {
  border-color: #e5e7eb !important;
  border-radius: var(--radius-sm) !important;
}

.ant-input:hover,
.ant-input-affix-wrapper:hover,
.ant-select-selector:hover,
.ant-input-number:hover,
.ant-picker:hover {
  border-color: #14b8a6 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #14b8a6 !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-color: #10b981 !important;
  color: #047857 !important;
}

.ant-tag-error {
  background-color: var(--error-light) !important;
  border-color: var(--error) !important;
  color: var(--error) !important;
}

.ant-tag-warning {
  background-color: #fff7ed !important;
  border-color: #fdba74 !important;
  color: #c2410c !important;
}

.ant-tag-teal {
  background-color: rgba(20, 184, 166, 0.1) !important;
  border-color: #14b8a6 !important;
  color: #0d9488 !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  border-radius: var(--radius-md) !important;
}

.ant-btn-primary.btn-challan-export {
  background-color: var(--color-teal-500) !important;
  border-color: var(--color-teal-500) !important;
}
.ant-btn-primary.btn-challan-export:hover,
.ant-btn-primary.btn-challan-export:focus {
  background-color: var(--color-teal-700) !important;
  border-color: var(--color-teal-700) !important;
}
.ant-btn-primary.btn-challan-view {
  background-color: var(--color-orange-500) !important;
  border-color: var(--color-orange-500) !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
