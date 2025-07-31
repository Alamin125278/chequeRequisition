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
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-blue-500">Ordered</span> Requisition
                Management
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Manage and export your ordered cheque requisitions in one
              centralized dashboard.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Export Preview">
              <a-button
                type="primary"
                class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                @click="showExportPreview"
                :disabled="!hasAppliedFilters"
              >
                <template #icon><ExportOutlined /></template>
                Export Preview
              </a-button>
            </a-tooltip>
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
          Filter Orders Requisitions
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Bank</label
            >
            <a-select
              v-model:value="filters.bank"
              placeholder="Select Bank"
              class="w-full"
              @change="orderRequisitionStore.setBank"
              allowClear
            >
              <a-select-option
                v-for="option in banks"
                :key="option.id"
                :value="option.id"
              >
                {{ option.bankName }}
              </a-select-option>
            </a-select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Severity</label
            >
            <a-select
              v-model:value="filters.severity"
              placeholder="Select Severity"
              class="w-full"
              @change="orderRequisitionStore.setSeverity"
              allowClear
            >
              <a-select-option value="1">Urgent</a-select-option>
              <a-select-option value="2">Normal</a-select-option>
            </a-select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Request Date</label
            >
            <a-date-picker
              v-model:value="filters.requestDate"
              class="w-full"
              @change="orderRequisitionStore.setRequestDate"
              placeholder="Select Date"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-secondary"
              >Account Number</label
            >
            <a-input-search
              v-model:value="filters.accountNumber"
              placeholder="Search orders..."
              class="w-full"
              @search="orderRequisitionStore.setSearch"
              allow-clear
            >
              <template #prefix>
                <SearchOutlined class="text-secondary" /> </template
            ></a-input-search>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-card shadow-md rounded-md overflow-hidden">
        <div
          class="px-4 py-5 sm:p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-primary">Order Requisitions</h3>
          <span class="text-sm text-secondary"
            >{{ orderRequisitionStore.total }} orders found</span
          >
        </div>
        <a-table
          :columns="columns"
          :data-source="orderRequisitionStore.orderRequisition"
          :pagination="pagination"
          :loading="loading"
          @change="orderPagination"
          class="custom-table"
          :scroll="{ x: 1500 }"
          :rowClassName="() => 'hover:bg-background'"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'id'">
              {{ index + 1 }}
            </template>
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
            <template v-if="column.key === 'statusName'">
              <a-tag
                color="success"
                class="px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {{ record.statusName }}
              </a-tag>
            </template>
          </template>
        </a-table>

        <!-- Empty State -->
        <!-- <div
          v-if="!loading && orderRequisitionStore.total === 0"
          class="text-center py-12 bg-background rounded-md"
        >
          <InboxOutlined
            style="font-size: 48px"
            class="text-secondary opacity-30"
          />
          <p class="mt-3 text-primary text-lg font-medium">No orders found</p>
          <p class="text-secondary">
            Try adjusting your filters to see more results
          </p>
        </div> -->
      </div>
    </div>

    <!-- Export Preview Modal -->
    <a-modal
      v-model:visible="exportModalVisible"
      title="Export Preview"
      :width="1080"
      :footer="null"
      style="top: 20px"
      class="requisition-modal"
    >
      <div class="p-4">
        <div class="mb-6 bg-gray-50 rounded-md">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium text-primary">Export Progress</h3>
            <span class="text-sm text-secondary">
              {{ completedExports ?? 0 }} of
              {{ totalRequiredExports }} completed
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>

          <div class="text-sm text-gray-600">
            {{ progressPercentage }}% Complete
            <span v-if="!allExportsCompleted" class="ml-2 text-orange-600">
              - Complete all exports to enable Challan Preview
            </span>
            <span v-else class="ml-2 text-green-600">
              - Ready for Challan Preview
            </span>
          </div>
        </div>
        <div class="mb-6">
          <div class="flex flex-wrap gap-3 justify-between border-gray-100">
            <div>
              <a-button
                type="primary"
                @click="exportPSI"
                :loading="exportStates.psi.loading"
                :disabled="exportStates.psi.completed"
                class="mr-2"
                :class="{
                  'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600':
                    exportStates.psi.completed,
                  'bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600':
                    !exportStates.psi.completed,
                }"
              >
                <template #icon>
                  <CheckOutlined v-if="exportStates.psi.completed" />
                  <FileExcelOutlined v-else />
                </template>
                {{ exportStates.psi.completed ? "PSI Exported" : "Export PSI" }}
              </a-button>
              <a-button
                type="primary"
                @click="showChallanPreview"
                :disabled="!allExportsCompleted"
                :class="{
                  'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600':
                    allExportsCompleted,
                  'bg-gray-400 border-gray-400 cursor-not-allowed':
                    !allExportsCompleted,
                }"
              >
                <template #icon><FileDoneOutlined /></template>
                {{
                  allExportsCompleted
                    ? "Export Challan"
                    : "Complete Exports First"
                }}
              </a-button>
            </div>
          </div>
        </div>

        <!-- Check Type Buttons -->
        <div class="mb-6 pb-4 border-b border-gray-100">
          <h3
            class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
          >
            Export by Cheque Type
          </h3>
          <div class="flex flex-wrap gap-3">
            <a-button
              v-for="checkTypeVariation in checkTypeVariations"
              :key="`${checkTypeVariation.type}-${checkTypeVariation.pages}`"
              @click="
                exportByCheckTypeAndPages(
                  checkTypeVariation.type,
                  checkTypeVariation.pages
                )
              "
              :loading="checkTypeVariation.loading"
              :disabled="checkTypeVariation.completed"
              size="middle"
              :class="{
                'bg-green-500 border-green-500 text-black hover:bg-green-600 hover:border-green-600':
                  checkTypeVariation.completed,
                'bg-blue-500 border-blue-500 text-black hover:bg-blue-600 hover:border-blue-600':
                  !checkTypeVariation.completed,
              }"
            >
              <template #icon>
                <CheckOutlined v-if="checkTypeVariation.completed" />
                <FileTextOutlined v-else />
              </template>
              <span>
                {{ checkTypeVariation.completed ? "Exported" : "" }}
                {{ checkTypeVariation.type }} ({{ checkTypeVariation.pages }})
              </span>
              <a-badge :count="checkTypeVariation.count" class="ml-2" />
            </a-button>
          </div>
        </div>

        <!-- Preview Table -->
        <div class="bg-background p-4 rounded-md mb-6">
          <h3
            class="text-sm font-medium text-secondary uppercase tracking-wider mb-4"
          >
            Preview
          </h3>
          <a-table
            :columns="previewColumns"
            :data-source="orderRequisitionStore.orderRequisitionForExport"
            :loading="loading"
            class="custom-table"
            :scroll="{ x: 1500 }"
            :pagination="false"
            :rowClassName="() => 'hover:bg-background'"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'id'">
                {{ index + 1 }}
              </template>
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
              <template v-if="column.key === 'statusName'">
                <a-tag
                  color="success"
                  class="px-2 py-0.5 rounded-md text-xs font-medium"
                >
                  {{ record.statusName }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </div>

        <!-- Export Actions -->
        <!-- <div class="flex flex-wrap gap-3 justify-end border-t border-gray-100">
          <a-button
            type="primary"
            @click="submitExport"
            class="bg-success border-success hover:bg-success-dark hover:border-success-dark"
          >
            <template #icon><CheckOutlined /></template>
            Submit
          </a-button>
        </div> -->
      </div>
    </a-modal>

    <!-- Challan Preview Modal -->
    <a-modal
      v-model:visible="challanPreviewVisible"
      title="Challan Preview"
      :width="980"
      :footer="null"
      class="requisition-modal"
    >
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2 text-primary">
            Challan Preview by Receiving Branch
          </h3>
          <p class="text-secondary">
            {{ Object.keys(challanData).length }} receiving branches found
          </p>
        </div>

        <div v-for="(orders, branch) in challanData" :key="branch" class="mb-8">
          <div class="bg-background p-4 rounded-md mb-3">
            <h4 class="text-base font-medium mb-2 text-primary">
              {{ branch }}
            </h4>
            <p class="text-secondary">{{ orders.length }} orders</p>
          </div>

          <a-table
            :columns="challanColumns"
            :data-source="orders"
            :pagination="false"
            row-key="id"
            class="custom-table mb-4"
            size="small"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'id'">
                {{ index + 1 }}
              </template>
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

        <div
          class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
        >
          <a-button @click="challanPreviewVisible = false"> Cancel </a-button>
          <a-button
            type="primary"
            @click="confirmExportChallan"
            class="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          >
            <template #icon><DownloadOutlined /></template>
            Confirm Export
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import FinteraFooterImage from "@/assets/challanImages/finterafooter.png";
import FinteralogoImage from "@/assets/challanImages/finterlogo.png";
// import FlexItFooterImage from "@/assets/challanImages/flexitFooter.png";
import FlexItlogoImage from "@/assets/challanImages/flexitHeader.png";
import AuthSignature from "@/assets/signature.png";
import {
  CheckOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";
import {
  createChallan,
  getChallanExportService,
} from "../../services/challan/challan.service";
import {
  useOrderRequisitionStore,
  type OrderRequisition,
} from "../../stores/orderRequisitionStore";
import { exportToExcel } from "../../utils/ExcelFile/chequeBookExportExcel";
import { generateChallanPdf } from "../../utils/ExcelFile/generateChallanPdf";

interface Bank {
  id: number;
  bankName: string;
}
const orderRequisitionStore = useOrderRequisitionStore();
const banks = ref<Bank[]>([]);
// ========== ১. Reactive Variations Setup ==========
const checkTypeVariations = ref<
  {
    type: string;
    pages: number;
    count: number;
    loading: boolean;
    completed: boolean;
  }[]
>([]);

watchEffect(() => {
  const variations: typeof checkTypeVariations.value = [];

  orderRequisitionStore.orderRequisitionForExport.forEach((order) => {
    const existing = variations.find(
      (v) => v.type === order.chequeType && v.pages === order.leaves
    );
    if (existing) {
      existing.count++;
    } else {
      variations.push({
        type: order.chequeType,
        pages: order.leaves,
        count: 1,
        loading: false,
        completed: false,
      });
    }
  });

  variations.sort((a, b) => {
    if (a.type === b.type) return a.pages - b.pages;
    return a.type.localeCompare(b.type);
  });

  checkTypeVariations.value = variations;
});

// Export states management
const exportStates = reactive({
  psi: {
    loading: false,
    completed: false,
  },
});
// ========== ৩. Helper Functions ==========
const setExportState = (
  variation: any,
  options: { loading?: boolean; completed?: boolean }
) => {
  if (variation) {
    if (options.loading !== undefined) variation.loading = options.loading;
    if (options.completed !== undefined)
      variation.completed = options.completed;
  }
};

const setPsiExportState = (options: {
  loading?: boolean;
  completed?: boolean;
}) => {
  if (options.loading !== undefined) exportStates.psi.loading = options.loading;
  if (options.completed !== undefined)
    exportStates.psi.completed = options.completed;
};

// Computed properties for progress tracking
const completedExports = computed(() => {
  const psiCompleted = exportStates.psi.completed ? 1 : 0;
  const checkTypeCompleted = checkTypeVariations.value.filter(
    (ct) => ct.completed
  ).length;
  return psiCompleted + checkTypeCompleted;
});

const totalRequiredExports = computed(() => {
  return 1 + checkTypeVariations.value.length; // PSI + check types
});

const progressPercentage = computed(() => {
  if (totalRequiredExports.value === 0) return 0;
  return Math.round(
    (completedExports.value / totalRequiredExports.value) * 100
  );
});

const allExportsCompleted = computed(() => {
  return completedExports.value === totalRequiredExports.value;
});
//Get the banks from the database
const featchBanks = async () => {
  loading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  } finally {
    loading.value = false;
  }
};

// Table columns
const columns = [
  {
    title: "SL.",
    key: "id",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Home Branch",
    dataIndex: "branchName",
    key: "branchName",
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
  },
  {
    title: "Account Holder",
    dataIndex: "accountName",
    key: "accountName",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNo",
    key: "routingNo",
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranchName", // or receivingBranch if name available
    key: "receivingBranchName",
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
  },
  {
    title: "Severity",
    dataIndex: "serverity",
    key: "serverity",
  },
  {
    title: "Micr No",
    dataIndex: "micrNo",
    key: "micrNo",
  },
  {
    title: "Transaction Code",
    dataIndex: "transactionCode",
    key: "transactionCode",
  },
  {
    title: "Series",
    dataIndex: "series",
    key: "series",
  },
  {
    title: "Cheque Type",
    dataIndex: "chequeType",
    key: "chequeType",
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
  },

  {
    title: "Status",
    dataIndex: "statusName",
    key: "statusName",
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
  },
];

// Preview columns (simplified for modal)
const previewColumns = [
  {
    title: "SL.",
    key: "id",
    width: 70,
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Home Branch",
    dataIndex: "branchName",
    key: "branchName",
  },
  {
    title: "Account No",
    dataIndex: "accountNo",
    key: "accountNo",
  },
  {
    title: "Account Holder",
    dataIndex: "accountName",
    key: "accountName",
  },
  {
    title: "Routing Number",
    dataIndex: "routingNo",
    key: "routingNo",
  },
  {
    title: "Receiving Branch",
    dataIndex: "receivingBranchName", // or receivingBranch if name available
    key: "receivingBranchName",
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
  },
  {
    title: "Severity",
    dataIndex: "serverity",
    key: "serverity",
  },
  {
    title: "Micr No",
    dataIndex: "micrNo",
    key: "micrNo",
  },
  {
    title: "Transaction Code",
    dataIndex: "transactionCode",
    key: "transactionCode",
  },
  {
    title: "Series",
    dataIndex: "series",
    key: "series",
  },
  {
    title: "Cheque Type",
    dataIndex: "chequeType",
    key: "chequeType",
  },
  {
    title: "Leaves",
    dataIndex: "leaves",
    key: "leaves",
  },
  {
    title: "Book Qty",
    dataIndex: "bookQty",
    key: "bookQty",
  },

  {
    title: "Status",
    dataIndex: "statusName",
    key: "statusName",
  },
  {
    title: "Request Date",
    dataIndex: "requestDate",
    key: "requestDate",
  },
];

// Challan columns
const challanColumns = [
  {
    title: "SL.",
    key: "id",
    width: 70,
  },
  {
    title: "Account No",
    dataIndex: "micrNo",
    key: "micrNo",
  },

  {
    title: "Account Name",
    dataIndex: "accountName",
    key: "accountName",
  },
  {
    title: "Start No",
    dataIndex: "startNo",
    key: "startNo",
  },
  {
    title: "Books X Lvs",
    key: "booksXleaves",
    customRender: ({ record }: { record: OrderRequisition }) =>
      `${record.bookQty} x ${record.leaves}`,
  },
  {
    title: "End No",
    dataIndex: "endNo",
    key: "endNo",
  },
  {
    title: "A/C Type",
    dataIndex: "chequeType",
    key: "chequeType",
  },
  {
    title: "Status",
    key: "serverity",
    dataIndex: "serverity",
  },
  {
    title: "Cus.Branch",
    key: "branchName",
    dataIndex: "branchName",
  },
];

// State
const orders = ref<any[]>([]);
const loading = ref(true);
const exportModalVisible = ref(false);
const challanPreviewVisible = ref(false);
const challanData = ref<Record<string, any[]>>({});
const filters = ref({
  bank: undefined as string | undefined,
  accountNumber: undefined as string | undefined,
  severity: undefined as string | undefined,
  requestDate: undefined as string | undefined,
});

onMounted(() => {
  orderRequisitionStore.resetFilters();
  orderRequisitionStore.fetchOrderRequisitions();
});

const pagination = computed(() => ({
  current:
    Math.floor(orderRequisitionStore.skip / orderRequisitionStore.limit) + 1,
  pageSize: orderRequisitionStore.limit,
  total: orderRequisitionStore.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => `Total ${total} Order Requisitions`,
}));

const orderPagination = (p: any) =>
  orderRequisitionStore.setPagination(p.current, p.pageSize);
// Generate check type variations with page counts

const hasAppliedFilters = computed(() => !!filters.value.bank);

const showExportPreview = () => {
  orderRequisitionStore.fetchOrderRequisitionsForExport();
  if (
    !orderRequisitionStore.orderRequisition ||
    orderRequisitionStore.orderRequisition.length === 0
  ) {
    message.warning("No orders match the selected filters");
    return;
  }
  // Generate check type variations when modal opens
  // generateCheckTypeVariations();
  exportModalVisible.value = true;
};

const exportByCheckTypeAndPages = async (checkType: string, pages: number) => {
  const variation = checkTypeVariations.value.find(
    (ct) => ct.type === checkType && ct.pages === pages
  );

  if (!variation || variation.completed) return;

  setExportState(variation, { loading: true });

  try {
    const matchingOrders =
      orderRequisitionStore.orderRequisitionForExport.filter(
        (order) => order.chequeType === checkType && order.leaves === pages
      );

    const todayDate = new Date().toISOString().split("T")[0];
    const bankName = matchingOrders[0]?.bankName || "UnknownBank";
    const fileName = `${bankName}_${checkType}_${pages}_${todayDate}_pages`;

    const formattedData = matchingOrders.map((order) => ({
      "Bank Name": order.bankName,
      "Branch Name": order.agentNum
        ? `B- ${order.branchName} (${
            order.receivingBranchName?.slice(-7) || ""
          })`
        : order.branchName,
      "Account Name": order.accountName,
      "Customer Address": order.receivingBranchName,
      "Cheque Prefix": order.chequePrefix,
      "MICR No": order.micrNo,
      "Cheque Serial": order.startNo,
      "Leaves Quantity": order.leaves,
      "Book Quantity": order.bookQty,
      "Routing No": order.routingNo,
      "Transaction Code": order.transactionCode,
      "Account No": order.accountNo,
    }));

    exportToExcel(formattedData, fileName, checkType);
    setExportState(variation, { completed: true });
  } catch (error) {
    message.error(`Failed to export ${checkType} (${pages} pages)`);
  } finally {
    setExportState(variation, { loading: false });
  }
};

// const exportByCheckTypeAndPages = async (checkType: string, pages: number) => {
//   // Find the specific check type variation
//   const variation = checkTypeVariations.value.find(
//     (ct) => ct.type === checkType && ct.pages === pages
//   );

//   if (!variation || variation.completed) return;

//   variation.loading = true;
//   exportStates.psi.loading = true;

//   try {
//     const matchingOrders =
//       orderRequisitionStore.orderRequisitionForExport.filter(
//         (order) => order.chequeType === checkType && order.leaves === pages
//       );

//     const todayDate = new Date().toISOString().split("T")[0];
//     const bankName = matchingOrders[0].bankName;
//     const fileName = `${bankName}_${checkType}_${pages}_${todayDate}_pages`;

//     const formattedData = matchingOrders.map((order) => ({
//       "Bank Name": order.bankName,
//       "Branch Name": order.branchName,
//       "Account Name": order.accountName,
//       "Customer Address": order.receivingBranchName,
//       "Cheque Prefix": order.chequePrefix,
//       "MICR No": order.micrNo,
//       "Cheque Serial": order.startNo,
//       "Leaves Quantity": order.leaves,
//       "Book Quantity": order.bookQty,
//       "Routing No": order.routingNo,
//       "Transaction Code": order.transactionCode,
//       "Account No": order.accountNo,
//     }));

//     exportToExcel(formattedData, fileName, checkType);

//     variation.completed = true;
//     // alert(variation.completed);
//   } catch (error) {
//     message.error(`Failed to export ${checkType} (${pages} pages)`);
//   } finally {
//     variation.loading = false;
//     exportStates.psi.loading = false;
//   }
// };

const exportPSI = () => {
  if (exportStates.psi.completed) return;

  setPsiExportState({ loading: true });

  try {
    const psiOrders = orderRequisitionStore.orderRequisitionForExport;
    const bankName = psiOrders[0].bankName;
    const formattedData = psiOrders.map((order) => ({
      "Account No": order.accountNo,
      "Start No": order.startNo,
      "No of Leaves": order.leaves,
      "End No": order.endNo,
      "MICR No": order.micrNo,
      "Routing No": order.routingNo,
      "Transaction Code": order.transactionCode,
      Name: order.accountName,
      "Home Branch Name": order.agentNum
        ? `B- ${order.branchName} (${
            order.receivingBranchName?.slice(-7) || ""
          })`
        : order.branchName,
      "Ac Prefix": order.chequePrefix,
      "Distribution Point Name": order.cusAddress,
      "Receiving Branch Name": order.receivingBranchName,
    }));
    const fileName = `PSI_Format_${bankName}${
      new Date().toISOString().split("T")[0]
    }`;
    exportToExcel(formattedData, fileName, "PSI");
    setPsiExportState({ completed: true });
  } catch (error) {
    message.error("Failed to export PSI");
  } finally {
    setPsiExportState({ loading: false });
  }
};

const showChallanPreview = () => {
  if (!allExportsCompleted.value) {
    message.warning("Please complete all exports before previewing challan");
    return;
  }
  // Group by receiving branch
  const branches: Record<string, any[]> = {};
  orderRequisitionStore.orderRequisitionForExport.forEach((order) => {
    if (!branches[order.receivingBranchName]) {
      branches[order.receivingBranchName] = [];
    }
    branches[order.receivingBranchName].push(order);
  });

  challanData.value = branches;
  challanPreviewVisible.value = true;
};

const confirmExportChallan = async () => {
  try {
    const payload = {
      challanData: challanData.value, // assuming challanData is a ref or reactive
    };

    const response = await createChallan(payload);

    if (response?.isCreated) {
      var challanIds = response?.createdChallanIds ?? [];

      if (challanIds.length > 0) {
        var challans = await getChallanExportService(challanIds);
        // var FinteralogoImage = "../../assets/images/Finteralogo.jpeg";
        // var FinteraFooterImage = "../../assets/images/FinteraFooter.jpeg";
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
          generateChallanPdf(
            challans,
            logoBase64,
            footerBase64,
            AuthSignatureBase64
          );
        }
        orderRequisitionStore.fetchOrderRequisitions();
      } else {
        message.error("Failed to Get challan");
      }
    } else {
      message.error("Failed to create challan");
    }
  } catch (error) {
    console.error("Challan export error:", error);
    message.error("An error occurred while exporting challan");
  } finally {
    challanPreviewVisible.value = false;
    submitExport();
  }
};

const submitExport = () => {
  if (!allExportsCompleted.value) {
    message.warning("Please complete all exports before submitting");
    return;
  }

  // Reset all states
  exportStates.psi.completed = false;
  exportStates.psi.loading = false;
  checkTypeVariations.value.forEach((ct) => {
    ct.completed = false;
    ct.loading = false;
  });
  orderRequisitionStore.fetchOrderRequisitions();
  orderRequisitionStore.fetchOrderRequisitionsForExport();
  orderRequisitionStore.resetFilters();
  message.success(
    `Updated status of ${orderRequisitionStore.orderRequisitionForExport.length} orders to "Downloaded"`
  );
  exportModalVisible.value = false;
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

// Lifecycle hooks
onMounted(() => {
  // Get the banks from the database
  featchBanks();
  // Simulate API call
  // to fetch orders
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

.custom-table :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Custom modal styles */
.requisition-modal :deep(.ant-modal-content) {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.requisition-modal :deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

.requisition-modal :deep(.ant-modal-title) {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
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
  border-color: #3b82f6 !important;
}

.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-focused,
.ant-input-affix-wrapper-focused,
.ant-select-focused .ant-select-selector,
.ant-select-selector:focus,
.ant-input-number-focused,
.ant-picker-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

/* Custom tag styles */
.ant-tag-success {
  background-color: rgba(34, 197, 94, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
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

.ant-tag-processing {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
  color: #3b82f6 !important;
}

.ant-tag-purple {
  background-color: rgba(147, 51, 234, 0.1) !important;
  border-color: #9333ea !important;
  color: #9333ea !important;
}

/* Ant Design button overrides */
.ant-btn-primary {
  border-radius: var(--radius-md) !important;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: var(--shadow-sm) !important;
}

.shadow-md {
  box-shadow: var(--shadow-md) !important;
}

.shadow-lg {
  box-shadow: var(--shadow-lg) !important;
}

/* Rounded utilities */
.rounded-sm {
  border-radius: var(--radius-sm) !important;
}

.rounded-md {
  border-radius: var(--radius-md) !important;
}

.rounded-lg {
  border-radius: var(--radius-lg) !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ant-table {
    font-size: 0.875rem;
  }
}
</style>
