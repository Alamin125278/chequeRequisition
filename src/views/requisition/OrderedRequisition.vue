<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          <span class="text-blue-600">Ordered</span> Requisitions
        </h1>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div class="flex flex-wrap gap-4">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by requisition number"
            enter-button
            @search="handleSearch"
            class="w-full md:w-64"
            :allowClear="true"
          />

          <a-select
            v-model:value="bankFilter"
            placeholder="Filter by Bank Name"
            class="w-full md:w-48"
            @change="handleBankFilterChange"
          >
            <a-select-option value="">All Banks</a-select-option>
            <a-select-option value="National Bank"
              >National Bank</a-select-option
            >
            <a-select-option value="City Bank">City Bank</a-select-option>
            <a-select-option value="Metro Bank">Metro Bank</a-select-option>
            <a-select-option value="Global Bank">Global Bank</a-select-option>
          </a-select>

          <a-select
            v-model:value="branchFilter"
            placeholder="Filter by Branch Name"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
          >
            <a-select-option value="">All Branches</a-select-option>
            <a-select-option value="Main Branch">Main Branch</a-select-option>
            <a-select-option value="North Branch">North Branch</a-select-option>
            <a-select-option value="South Branch">South Branch</a-select-option>
            <a-select-option value="East Branch">East Branch</a-select-option>
            <a-select-option value="West Branch">West Branch</a-select-option>
          </a-select>

          <!-- Added Cheque Type Filter -->
          <a-select
            v-model:value="chequeTypeFilter"
            placeholder="Filter by Cheque Type"
            class="w-full md:w-48"
            @change="handleChequeTypeFilterChange"
          >
            <a-select-option value="">All Types</a-select-option>
            <a-select-option value="Standard">Standard</a-select-option>
            <a-select-option value="Premium">Premium</a-select-option>
            <a-select-option value="Business">Business</a-select-option>
            <a-select-option value="Corporate">Corporate</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full md:w-auto"
            :placeholder="['Start Date', 'End Date']"
          />
          <!-- Export Preview Button -->
          <a-button
            type="primary"
            @click="showExportPreview"
            :disabled="filteredRequisitions.length === 0"
            class="bg-emerald-600 hover:bg-emerald-700 border-0"
          >
            <template #icon><DownloadOutlined /></template>
            Export Preview
          </a-button>
        </div>
      </div>

      <!-- Requisition Table -->
      <a-table
        :dataSource="filteredRequisitions"
        :columns="columns"
        :loading="loading"
        :pagination="{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total:number) => `Total ${total} items`,
            }"
        rowKey="id"
        class="mb-6 custom-table"
        :rowClassName="
              (record:any) =>
                record.id === selectedRequisition?.id ? 'bg-emerald-50' : ''
            "
      >
        <!-- Status Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'severity'">
            <a-tag
              :color="getSeverityColor(record.severity)"
              class="px-3 py-1 rounded-full"
            >
              {{ record.severity }}
            </a-tag>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag
              :color="getStatusColor(record.status)"
              class="px-3 py-1 rounded-full"
            >
              {{ record.status }}
            </a-tag>
          </template>

          <!-- Actions Column -->
          <template v-if="column.key === 'actions'">
            <div class="flex gap-2">
              <a-tooltip title="View Details">
                <a-button
                  type="primary"
                  size="small"
                  @click="viewRequisition(record)"
                >
                  View
                </a-button>
              </a-tooltip>

              <a-tooltip v-if="canDispatch(record)" title="Dispatch">
                <a-button
                  type="primary"
                  size="small"
                  class="bg-purple-600 hover:bg-purple-700 border-0"
                  @click="dispatchRequisition(record)"
                >
                  Dispatch
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Redesigned Requisition Detail Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="`Requisition Details: ${
        selectedRequisition?.requisitionNo || ''
      }`"
      width="90%"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
      style="top: 0px"
      class="custom-modal"
    >
      <div v-if="selectedRequisition" class="p-0">
        <!-- Header with basic info -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
          <div class="flex flex-wrap justify-between items-center">
            <div>
              <p class="text-lg font-medium text-gray-800">
                {{ selectedRequisition.requisitionNo }}
                <a-tag
                  :color="getStatusColor(selectedRequisition.status)"
                  class="ml-2 px-3 py-1 rounded-full"
                >
                  {{ selectedRequisition.status }}
                </a-tag>
              </p>
              <p class="text-sm text-gray-500">
                Bank: {{ selectedRequisition.bankName }} | Branch:
                {{ selectedRequisition.branchName }} | Request Date:
                {{ formatDate(selectedRequisition.requestDate) }}
              </p>
            </div>

            <div class="flex gap-2 mt-4 md:mt-0">
              <a-button
                v-if="canDispatch(selectedRequisition)"
                type="primary"
                class="bg-purple-600 hover:bg-purple-700 border-0"
                @click="dispatchRequisition(selectedRequisition)"
              >
                <template #icon><CarOutlined /></template>
                Dispatch
              </a-button>

              <a-button
                v-else-if="
                  !allItemsCompleted && selectedRequisition.status === 'Ordered'
                "
                type="default"
                disabled
              >
                <template #icon><InfoCircleOutlined /></template>
                Waiting for Completion
              </a-button>
            </div>
          </div>
        </div>

        <!-- Cheque Type Tabs -->
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Cheque Types</h3>
          <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange">
            <a-tab-pane key="All" tab="All">
              <!-- Cheque Items Table with Checkboxes -->
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                  <a-checkbox
                    :checked="allChecked"
                    :indeterminate="indeterminate"
                    @change="onCheckAllChange"
                  >
                    Select All
                  </a-checkbox>
                </div>
                <div class="flex gap-2">
                  <a-button
                    type="primary"
                    :disabled="!hasSelectedDownloadedItems"
                    @click="markAsWorking"
                    class="bg-blue-600 hover:bg-blue-700 border-0"
                  >
                    Is Working
                  </a-button>
                  <a-button
                    type="primary"
                    :disabled="!hasSelectedWorkingItems"
                    @click="markAsComplete"
                    class="bg-green-600 hover:bg-green-700 border-0"
                  >
                    Working Complete
                  </a-button>
                </div>
              </div>

              <a-table
                :dataSource="filteredItemsByType"
                :columns="requisitionItemColumnsWithCheckbox"
                :pagination="{ pageSize: 5 }"
                rowKey="id"
                class="mb-2 custom-table"
                :scroll="{ x: 1500 }"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.key === 'checkbox'">
                    <a-checkbox
                      v-model:checked="checkedItems[record.id]"
                      @change="() => onItemCheckChange(record)"
                    />
                  </template>
                  <template v-if="column.key === 'severity'">
                    <a-tag
                      :color="getSeverityColor(text)"
                      class="px-2 py-0.5 rounded-full"
                    >
                      {{ text }}
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'status'">
                    <a-tag
                      :color="getItemStatusColor(text)"
                      class="px-2 py-0.5 rounded-full"
                    >
                      {{ text }}
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'itemActions'">
                    <a-button
                      v-if="record.status === 'Pending'"
                      type="primary"
                      size="small"
                      @click="downloadItem(record)"
                    >
                      Download
                    </a-button>
                    <a-button
                      v-else-if="record.status === 'Downloaded'"
                      type="primary"
                      size="small"
                      class="bg-blue-600 hover:bg-blue-700 border-0"
                      @click="markItemAsWorking(record)"
                    >
                      Is Working
                    </a-button>
                    <a-button
                      v-else-if="record.status === 'Is Working'"
                      type="primary"
                      size="small"
                      class="bg-green-600 hover:bg-green-700 border-0"
                      @click="markItemAsComplete(record)"
                    >
                      Working Complete
                    </a-button>
                    <a-tag
                      v-else-if="record.status === 'Complete Working'"
                      color="success"
                    >
                      Completed
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane
              v-for="type in selectedRequisition.chequeTypes"
              :key="type"
              :tab="type"
            >
              <!-- Cheque Items Table with Checkboxes -->
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                  <a-checkbox
                    :checked="allChecked"
                    :indeterminate="indeterminate"
                    @change="onCheckAllChange"
                  >
                    Select All
                  </a-checkbox>
                </div>
                <div class="flex gap-2">
                  <a-button
                    type="primary"
                    :disabled="!hasSelectedDownloadedItems"
                    @click="markAsWorking"
                    class="bg-blue-600 hover:bg-blue-700 border-0"
                  >
                    Is Working
                  </a-button>
                  <a-button
                    type="primary"
                    :disabled="!hasSelectedWorkingItems"
                    @click="markAsComplete"
                    class="bg-green-600 hover:bg-green-700 border-0"
                  >
                    Working Complete
                  </a-button>
                </div>
              </div>

              <a-table
                :dataSource="filteredItemsByType"
                :columns="requisitionItemColumnsWithCheckbox"
                :pagination="{ pageSize: 5 }"
                rowKey="id"
                class="mb-2 custom-table"
                :scroll="{ x: 1500 }"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.key === 'checkbox'">
                    <a-checkbox
                      v-model:checked="checkedItems[record.id]"
                      @change="() => onItemCheckChange(record)"
                    />
                  </template>
                  <template v-if="column.key === 'severity'">
                    <a-tag
                      :color="getSeverityColor(text)"
                      class="px-2 py-0.5 rounded-full"
                    >
                      {{ text }}
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'status'">
                    <a-tag
                      :color="getItemStatusColor(text)"
                      class="px-2 py-0.5 rounded-full"
                    >
                      {{ text }}
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'itemActions'">
                    <a-button
                      v-if="record.status === 'Pending'"
                      type="primary"
                      size="small"
                      @click="downloadItem(record)"
                    >
                      Download
                    </a-button>
                    <a-button
                      v-else-if="record.status === 'Downloaded'"
                      type="primary"
                      size="small"
                      class="bg-blue-600 hover:bg-blue-700 border-0"
                      @click="markItemAsWorking(record)"
                    >
                      Is Working
                    </a-button>
                    <a-button
                      v-else-if="record.status === 'Is Working'"
                      type="primary"
                      size="small"
                      class="bg-green-600 hover:bg-green-700 border-0"
                      @click="markItemAsComplete(record)"
                    >
                      Working Complete
                    </a-button>
                    <a-tag
                      v-else-if="record.status === 'Complete Working'"
                      color="success"
                    >
                      Completed
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>

        <div
          class="flex justify-end gap-3 p-2 bg-gray-50 border-t border-gray-200"
        >
          <a-button @click="modalVisible = false">Close</a-button>
        </div>
      </div>
    </a-modal>

    <!-- Export Preview Modal -->
    <a-modal
      v-model:visible="exportModalVisible"
      title="Export Preview"
      width="90%"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
      class="custom-modal"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            Filtered Requisition Items
            <span
              v-if="chequeTypeFilter"
              class="ml-2 text-base font-normal text-gray-500"
            >
              (Filtered by Cheque Type: {{ chequeTypeFilter }})
            </span>
          </h3>
          <div class="flex gap-2">
            <a-button type="primary" @click="exportAsExcel">
              <template #icon><FileExcelOutlined /></template>
              Export as Excel
            </a-button>
            <a-button @click="exportAsCSV">
              <template #icon><FileTextOutlined /></template>
              Export as CSV
            </a-button>
          </div>
        </div>

        <a-table
          :dataSource="filteredRequisitionItems"
          :columns="exportColumns"
          :pagination="{ pageSize: 10 }"
          rowKey="id"
          class="custom-table"
          :scroll="{ x: 1500 }"
        >
        </a-table>
      </div>
    </a-modal>

    <!-- Confirmation Modal -->
    <a-modal
      v-model:visible="confirmModalVisible"
      :title="confirmModalTitle"
      @ok="handleConfirmAction"
      :okText="confirmModalOkText"
      :okButtonProps="{
        type: 'primary',
        class: 'bg-purple-600 hover:bg-purple-700 border-0',
      }"
    >
      <p>{{ confirmModalMessage }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  reactive,
} from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  EyeOutlined,
  CheckOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  CarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

interface RequisitionItem {
  id: number;
  sl: number;
  requisitionNo: string;
  bankName: string;
  branchNameAddress: string;
  accountName: string;
  customerAddress: string;
  chequePrefix: string;
  accountNo: string;
  chequeSerialNo: string;
  leavesQuantity: number;
  bookQuantity: number;
  routingNo: string;
  transactionCode: number;
  chequeType: string;
  status: "Pending" | "Downloaded" | "Is Working" | "Complete Working";
}

interface Requisition {
  id: number;
  sl: number;
  requisitionNo: string;
  bankName: string;
  branchName: string;
  requestDate: string;
  severity: "High" | "Medium" | "Low";
  status: "Ordered" | "Working Complete" | "Dispatch" | "Delivered";
  chequeTypes: string[];
}

export default defineComponent({
  name: "RequisitionList",
  components: {
    EyeOutlined,
    CheckOutlined,
    SendOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    FileTextOutlined,
    CarOutlined,
    InfoCircleOutlined,
  },
  setup() {
    const requisitions = ref<Requisition[]>([]);
    const loading = ref(true);
    const searchText = ref("");
    const branchFilter = ref("");
    const bankFilter = ref("");
    const chequeTypeFilter = ref("");
    const dateRange = ref<[Dayjs, Dayjs] | null>(null);
    const modalVisible = ref(false);
    const exportModalVisible = ref(false);
    const selectedRequisition = ref<Requisition | null>(null);
    const confirmModalVisible = ref(false);
    const confirmModalTitle = ref("");
    const confirmModalMessage = ref("");
    const confirmModalOkText = ref("");
    const confirmModalAction = ref("");
    const requisitionToAction = ref<Requisition | null>(null);
    const requisitionItems = ref<RequisitionItem[]>([]);
    const allRequisitionItems = ref<RequisitionItem[]>([]);
    const allItemsDownloaded = ref(false);
    const allItemsCompleted = ref(false);
    const itemToAction = ref<RequisitionItem | null>(null);

    // New properties for the redesigned modal
    const activeTabKey = ref<string>("");
    const checkedItems = reactive<Record<number, boolean>>({});
    const allChecked = ref(false);
    const indeterminate = ref(false);

    // Table columns definition for requisitions
    const columns = [
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        sorter: (a: Requisition, b: Requisition) =>
          a.requisitionNo.localeCompare(b.requisitionNo),
      },
      {
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
        sorter: (a: Requisition, b: Requisition) =>
          a.bankName.localeCompare(b.bankName),
      },
      {
        title: "Branch Name",
        dataIndex: "branchName",
        key: "branchName",
        sorter: (a: Requisition, b: Requisition) =>
          a.branchName.localeCompare(b.branchName),
      },
      {
        title: "Request Date",
        dataIndex: "requestDate",
        key: "requestDate",
        render: (text: string) => formatDate(text),
        sorter: (a: Requisition, b: Requisition) =>
          new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
      },
      {
        title: "Severity",
        dataIndex: "severity",
        key: "severity",
        filters: [
          { text: "High", value: "High" },
          { text: "Medium", value: "Medium" },
          { text: "Low", value: "Low" },
        ],
        onFilter: (value: string, record: Requisition) =>
          record.severity === value,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Ordered", value: "Ordered" },
          { text: "Working Complete", value: "Working Complete" },
          { text: "Dispatch", value: "Dispatch" },
          { text: "Delivered", value: "Delivered" },
        ],
        onFilter: (value: string, record: Requisition) =>
          record.status === value,
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "center",
      },
    ];

    // Requisition item columns with checkbox for the modal view
    const requisitionItemColumnsWithCheckbox = [
      {
        title: "",
        key: "checkbox",
        width: 50,
      },
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        width: 150,
      },
      {
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
        width: 150,
      },
      {
        title: "Branch Name/Address",
        dataIndex: "branchNameAddress",
        key: "branchNameAddress",
        width: 200,
      },
      {
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        width: 180,
      },
      {
        title: "Customer Address",
        dataIndex: "customerAddress",
        key: "customerAddress",
        width: 250,
      },
      {
        title: "Cheque Type",
        dataIndex: "chequeType",
        key: "chequeType",
        width: 140,
      },
      {
        title: "Cheque Prefix",
        dataIndex: "chequePrefix",
        key: "chequePrefix",
        width: 140,
      },
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        width: 150,
      },
      {
        title: "Cheque Serial No",
        dataIndex: "chequeSerialNo",
        key: "chequeSerialNo",
        width: 160,
      },
      {
        title: "Leaves Quantity",
        dataIndex: "leavesQuantity",
        key: "leavesQuantity",
        width: 150,
      },
      {
        title: "Book Quantity",
        dataIndex: "bookQuantity",
        key: "bookQuantity",
        width: 140,
      },
      {
        title: "Routing No",
        dataIndex: "routingNo",
        key: "routingNo",
        width: 150,
      },
      {
        title: "Transaction Code",
        dataIndex: "transactionCode",
        key: "transactionCode",
        width: 160,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
      },
      {
        title: "Actions",
        key: "itemActions",
        width: 150,
        align: "center",
      },
    ];

    // Original requisition item columns (without checkbox)
    const requisitionItemColumns = [
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        width: 150,
      },
      {
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
        width: 150,
      },
      {
        title: "Branch Name/Address",
        dataIndex: "branchNameAddress",
        key: "branchNameAddress",
        width: 200,
      },
      {
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        width: 180,
      },
      {
        title: "Customer Address",
        dataIndex: "customerAddress",
        key: "customerAddress",
        width: 250,
      },
      {
        title: "Cheque Type",
        dataIndex: "chequeType",
        key: "chequeType",
        width: 140,
      },
      {
        title: "Cheque Prefix",
        dataIndex: "chequePrefix",
        key: "chequePrefix",
        width: 140,
      },
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        width: 150,
      },
      {
        title: "Cheque Serial No",
        dataIndex: "chequeSerialNo",
        key: "chequeSerialNo",
        width: 160,
      },
      {
        title: "Leaves Quantity",
        dataIndex: "leavesQuantity",
        key: "leavesQuantity",
        width: 150,
      },
      {
        title: "Book Quantity",
        dataIndex: "bookQuantity",
        key: "bookQuantity",
        width: 140,
      },
      {
        title: "Routing No",
        dataIndex: "routingNo",
        key: "routingNo",
        width: 150,
      },
      {
        title: "Transaction Code",
        dataIndex: "transactionCode",
        key: "transactionCode",
        width: 160,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
      },
      {
        title: "Actions",
        key: "itemActions",
        width: 120,
        align: "center",
      },
    ];

    // Export columns (same as requisitionItemColumns but without status and actions)
    const exportColumns = [
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        width: 150,
      },
      {
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
        width: 150,
      },
      {
        title: "Branch Name/Address",
        dataIndex: "branchNameAddress",
        key: "branchNameAddress",
        width: 200,
      },
      {
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        width: 180,
      },
      {
        title: "Customer Address",
        dataIndex: "customerAddress",
        key: "customerAddress",
        width: 250,
      },
      {
        title: "Cheque Type",
        dataIndex: "chequeType",
        key: "chequeType",
        width: 140,
      },
      {
        title: "Cheque Prefix",
        dataIndex: "chequePrefix",
        key: "chequePrefix",
        width: 140,
      },
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        width: 150,
      },
      {
        title: "Cheque Serial No",
        dataIndex: "chequeSerialNo",
        key: "chequeSerialNo",
        width: 160,
      },
      {
        title: "Leaves Quantity",
        dataIndex: "leavesQuantity",
        key: "leavesQuantity",
        width: 150,
      },
      {
        title: "Book Quantity",
        dataIndex: "bookQuantity",
        key: "bookQuantity",
        width: 140,
      },
      {
        title: "Routing No",
        dataIndex: "routingNo",
        key: "routingNo",
        width: 150,
      },
      {
        title: "Transaction Code",
        dataIndex: "transactionCode",
        key: "transactionCode",
        width: 160,
      },
    ];

    // Computed property for filtered requisitions
    const filteredRequisitions = computed(() => {
      let result = [...requisitions.value];

      // Apply search filter
      if (searchText.value) {
        const searchLower = searchText.value.toLowerCase();
        result = result.filter(
          (req) =>
            req.requisitionNo.toLowerCase().includes(searchLower) ||
            req.branchName.toLowerCase().includes(searchLower) ||
            req.bankName.toLowerCase().includes(searchLower)
        );
      }

      // Apply branch filter
      if (branchFilter.value) {
        result = result.filter((req) => req.branchName === branchFilter.value);
      }

      // Apply bank filter
      if (bankFilter.value) {
        result = result.filter((req) => req.bankName === bankFilter.value);
      }

      // Apply cheque type filter
      if (chequeTypeFilter.value) {
        result = result.filter((req) =>
          req.chequeTypes.includes(chequeTypeFilter.value)
        );
      }

      // Apply date range filter
      if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        const startDate = dateRange.value[0].valueOf();
        const endDate = dateRange.value[1].valueOf();

        result = result.filter((req) => {
          const reqDate = new Date(req.requestDate).getTime();
          return reqDate >= startDate && reqDate <= endDate;
        });
      }

      return result;
    });

    // Computed property for filtered requisition items by selected cheque type
    const filteredItemsByType = computed(() => {
      if (!activeTabKey.value || activeTabKey.value === "All") {
        return requisitionItems.value;
      }

      return requisitionItems.value.filter(
        (item) => item.chequeType === activeTabKey.value
      );
    });

    // Computed property to check if there are selected items with "Downloaded" status
    const hasSelectedDownloadedItems = computed(() => {
      return filteredItemsByType.value.some(
        (item) => checkedItems[item.id] && item.status === "Downloaded"
      );
    });

    // Computed property to check if there are selected items with "Is Working" status
    const hasSelectedWorkingItems = computed(() => {
      return filteredItemsByType.value.some(
        (item) => checkedItems[item.id] && item.status === "Is Working"
      );
    });

    // Computed property for filtered requisition items (for export)
    const filteredRequisitionItems = computed(() => {
      if (!chequeTypeFilter.value) {
        return allRequisitionItems.value;
      }

      return allRequisitionItems.value.filter(
        (item) => item.chequeType === chequeTypeFilter.value
      );
    });

    // Fetch requisition data
    const fetchRequisitions = async () => {
      loading.value = true;
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          requisitions.value = generateMockRequisitions();
          loading.value = false;
        }, 1000);
      } catch (error) {
        message.error("Failed to fetch requisitions");
        loading.value = false;
      }
    };

    // Generate mock requisitions for demonstration
    const generateMockRequisitions = (): Requisition[] => {
      const severities: Array<"High" | "Medium" | "Low"> = [
        "High",
        "Medium",
        "Low",
      ];
      const bankNames = [
        "National Bank",
        "City Bank",
        "Metro Bank",
        "Global Bank",
      ];
      const branchNames = [
        "Main Branch",
        "North Branch",
        "South Branch",
        "East Branch",
        "West Branch",
      ];
      const chequeTypes = ["Standard", "Premium", "Business", "Corporate"];

      return Array.from({ length: 20 }, (_, i) => {
        // Randomly select 1-3 cheque types for this requisition
        const numChequeTypes = Math.floor(Math.random() * 3) + 1;
        const reqChequeTypes: string[] = [];

        for (let j = 0; j < numChequeTypes; j++) {
          const randomType =
            chequeTypes[Math.floor(Math.random() * chequeTypes.length)];
          if (!reqChequeTypes.includes(randomType)) {
            reqChequeTypes.push(randomType);
          }
        }

        return {
          id: i + 1,
          sl: i + 1,
          requisitionNo: `REQ-${2023}-${1000 + i}`,
          bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
          branchName:
            branchNames[Math.floor(Math.random() * branchNames.length)],
          requestDate: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ).toISOString(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: "Ordered", // All requisitions have status "Ordered"
          chequeTypes: reqChequeTypes,
        };
      });
    };

    // Generate mock requisition items for a requisition
    const generateRequisitionItems = (
      requisition: Requisition
    ): RequisitionItem[] => {
      // Generate 5-10 items per requisition
      const itemCount = Math.floor(Math.random() * 6) + 5;

      // Use the cheque types from the requisition
      const chequeTypes = requisition.chequeTypes;

      return Array.from({ length: itemCount }, (_, i) => ({
        id: i + 1,
        sl: i + 1,
        requisitionNo: requisition.requisitionNo,
        bankName: requisition.bankName,
        branchNameAddress: `${requisition.branchName}, 123 Main St, City ${
          i + 1
        }`,
        accountName: `Account Holder ${i + 1}`,
        customerAddress: `${123 + i} Main St, City ${requisition.id}, Country`,
        chequePrefix: `PFX-${i % 5}`,
        accountNo: `AC-${100000 + i}-${requisition.id}`,
        chequeSerialNo: `${1000 + i * 100} - ${1099 + i * 100}`,
        leavesQuantity: (Math.floor(Math.random() * 5) + 1) * 10,
        bookQuantity: Math.floor(Math.random() * 5) + 1,
        routingNo: `RT-${200000 + i}-${requisition.id}`,
        transactionCode: 1000 + i + requisition.id,
        chequeType: chequeTypes[i % chequeTypes.length], // Assign cheque type from requisition's types
        status: "Pending", // Initially all items are pending
      }));
    };

    // Generate all requisition items for export preview
    const generateAllRequisitionItems = () => {
      const items: RequisitionItem[] = [];

      filteredRequisitions.value.forEach((requisition) => {
        const reqItems = generateRequisitionItems(requisition);
        items.push(...reqItems);
      });

      return items;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Get color for status tag
    const getStatusColor = (status: string) => {
      const colorMap: Record<string, string> = {
        Ordered: "blue",
        "Working Complete": "orange",
        Dispatch: "purple",
        Delivered: "green",
      };

      return colorMap[status] || "default";
    };

    // Get color for item status tag
    const getItemStatusColor = (status: string) => {
      const colorMap: Record<string, string> = {
        Pending: "warning",
        Downloaded: "blue",
        "Is Working": "orange",
        "Complete Working": "green",
      };

      return colorMap[status] || "default";
    };

    // Get color for severity tag
    const getSeverityColor = (severity: string) => {
      const colorMap: Record<string, string> = {
        High: "red",
        Medium: "orange",
        Low: "green",
      };

      return colorMap[severity] || "default";
    };

    // Handle search
    const handleSearch = (value: string) => {
      searchText.value = value;
    };

    // Handle branch filter change
    const handleBranchFilterChange = (value: string) => {
      branchFilter.value = value;
    };

    // Handle bank filter change
    const handleBankFilterChange = (value: string) => {
      bankFilter.value = value;
    };

    // Handle cheque type filter change
    const handleChequeTypeFilterChange = (value: string) => {
      chequeTypeFilter.value = value;
    };

    // Handle date range change
    const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
      dateRange.value = dates;
    };

    // Handle tab change
    const handleTabChange = (key: string) => {
      activeTabKey.value = key;
      // Reset checkboxes when changing tabs
      Object.keys(checkedItems).forEach((key) => {
        checkedItems[parseInt(key)] = false;
      });
      updateCheckStatus();
    };

    // Handle "Select All" checkbox change
    const onCheckAllChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;

      filteredItemsByType.value.forEach((item) => {
        checkedItems[item.id] = checked;
      });

      indeterminate.value = false;
      allChecked.value = checked;
    };

    // Handle individual item checkbox change
    const onItemCheckChange = (record: RequisitionItem) => {
      updateCheckStatus();
    };

    // Update the status of the "Select All" checkbox
    const updateCheckStatus = () => {
      const items = filteredItemsByType.value;
      if (!items.length) {
        allChecked.value = false;
        indeterminate.value = false;
        return;
      }

      const checkedCount = items.filter((item) => checkedItems[item.id]).length;
      allChecked.value = checkedCount === items.length;
      indeterminate.value = checkedCount > 0 && checkedCount < items.length;
    };

    // Check if all items are completed to enable dispatch
    const canDispatch = (record: Requisition) => {
      if (record.status === "Working Complete") return true;
      return false;
    };

    // Check if all items under a requisition are completed
    const checkAllItemsCompleted = () => {
      const allCompleted = requisitionItems.value.every(
        (item) => item.status === "Complete Working"
      );

      if (allCompleted && selectedRequisition.value) {
        // Update requisition status to "Working Complete"
        const index = requisitions.value.findIndex(
          (r) => r.id === selectedRequisition.value?.id
        );

        if (index !== -1) {
          requisitions.value[index].status = "Working Complete";
          selectedRequisition.value.status = "Working Complete";
          message.success(
            `All items completed. Requisition ${selectedRequisition.value.requisitionNo} is ready for dispatch.`
          );
        }
      }

      allItemsCompleted.value = allCompleted;
    };

    // View requisition details
    const viewRequisition = (record: Requisition) => {
      selectedRequisition.value = record;
      // Generate requisition items for this requisition
      requisitionItems.value = generateRequisitionItems(record);

      // Set "All" as the default active tab
      activeTabKey.value = "All";

      // Reset checkboxes
      Object.keys(checkedItems).forEach((key) => {
        delete checkedItems[parseInt(key)];
      });

      // Initialize checkboxes for all items
      requisitionItems.value.forEach((item) => {
        checkedItems[item.id] = false;
      });

      updateCheckStatus();

      // Check if all items are completed
      checkAllItemsCompleted();

      modalVisible.value = true;
    };

    // Download an item
    const downloadItem = (record: RequisitionItem) => {
      // Find the item in the requisitionItems array
      const index = requisitionItems.value.findIndex(
        (item) => item.id === record.id
      );
      if (index !== -1) {
        // Update the status to "Downloaded"
        requisitionItems.value[index].status = "Downloaded";
        message.success(`Item ${record.chequeSerialNo} has been downloaded`);
      }
    };

    // Mark an item as "Is Working"
    const markItemAsWorking = (record: RequisitionItem) => {
      const index = requisitionItems.value.findIndex(
        (item) => item.id === record.id
      );
      if (
        index !== -1 &&
        requisitionItems.value[index].status === "Downloaded"
      ) {
        requisitionItems.value[index].status = "Is Working";
        message.success(`Item ${record.chequeSerialNo} is now being worked on`);
      }
    };

    // Mark an item as "Complete Working"
    const markItemAsComplete = (record: RequisitionItem) => {
      const index = requisitionItems.value.findIndex(
        (item) => item.id === record.id
      );
      if (
        index !== -1 &&
        requisitionItems.value[index].status === "Is Working"
      ) {
        requisitionItems.value[index].status = "Complete Working";
        message.success(
          `Item ${record.chequeSerialNo} work has been completed`
        );

        // Check if all items are now completed
        checkAllItemsCompleted();
      }
    };

    // Mark selected items as "Is Working"
    const markAsWorking = () => {
      let updatedCount = 0;

      filteredItemsByType.value.forEach((item) => {
        if (checkedItems[item.id] && item.status === "Downloaded") {
          const index = requisitionItems.value.findIndex(
            (i) => i.id === item.id
          );
          if (index !== -1) {
            requisitionItems.value[index].status = "Is Working";
            updatedCount++;
          }
        }
      });

      if (updatedCount > 0) {
        message.success(`${updatedCount} items are now being worked on`);
        // Reset checkboxes
        Object.keys(checkedItems).forEach((key) => {
          checkedItems[parseInt(key)] = false;
        });
        updateCheckStatus();
      }
    };

    // Mark selected items as "Complete Working"
    const markAsComplete = () => {
      let updatedCount = 0;

      filteredItemsByType.value.forEach((item) => {
        if (checkedItems[item.id] && item.status === "Is Working") {
          const index = requisitionItems.value.findIndex(
            (i) => i.id === item.id
          );
          if (index !== -1) {
            requisitionItems.value[index].status = "Complete Working";
            updatedCount++;
          }
        }
      });

      if (updatedCount > 0) {
        message.success(`${updatedCount} items have been completed`);
        // Reset checkboxes
        Object.keys(checkedItems).forEach((key) => {
          checkedItems[parseInt(key)] = false;
        });
        updateCheckStatus();

        // Check if all items are now completed
        checkAllItemsCompleted();
      }
    };

    // Show export preview
    const showExportPreview = () => {
      allRequisitionItems.value = generateAllRequisitionItems();
      exportModalVisible.value = true;
    };

    // Export as Excel
    const exportAsExcel = () => {
      message.success("Exporting as Excel...");
      // In a real application, this would trigger an actual export
      setTimeout(() => {
        message.success("Excel file downloaded successfully");
      }, 1500);
    };

    // Export as CSV
    const exportAsCSV = () => {
      message.success("Exporting as CSV...");
      // In a real application, this would trigger an actual export
      setTimeout(() => {
        message.success("CSV file downloaded successfully");
      }, 1500);
    };

    // Dispatch requisition
    const dispatchRequisition = (record: Requisition) => {
      confirmModalTitle.value = "Dispatch Requisition";
      confirmModalMessage.value = `Are you sure you want to dispatch requisition ${record.requisitionNo}?`;
      confirmModalOkText.value = "Dispatch";
      confirmModalAction.value = "dispatch";
      requisitionToAction.value = record;
      confirmModalVisible.value = true;
    };

    // Handle confirm action
    const handleConfirmAction = () => {
      if (!requisitionToAction.value) return;

      const record = requisitionToAction.value;
      const recordIndex = requisitions.value.findIndex(
        (r) => r.id === record.id
      );

      if (recordIndex === -1) return;

      if (confirmModalAction.value === "dispatch") {
        // Update status to Dispatch
        requisitions.value[recordIndex].status = "Dispatch";
        message.success(
          `Requisition ${record.requisitionNo} has been dispatched`
        );
      }

      // Update selected requisition if it's the same record
      if (
        selectedRequisition.value &&
        selectedRequisition.value.id === record.id
      ) {
        selectedRequisition.value = { ...requisitions.value[recordIndex] };
      }

      confirmModalVisible.value = false;
      requisitionToAction.value = null;
    };

    // Fetch data on component mount
    onMounted(() => {
      fetchRequisitions();
    });

    return {
      requisitions,
      loading,
      searchText,
      branchFilter,
      bankFilter,
      chequeTypeFilter,
      dateRange,
      columns,
      requisitionItemColumns,
      requisitionItemColumnsWithCheckbox,
      exportColumns,
      requisitionItems,
      allRequisitionItems,
      filteredRequisitionItems,
      filteredRequisitions,
      filteredItemsByType,
      modalVisible,
      exportModalVisible,
      selectedRequisition,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalOkText,
      confirmModalAction,
      allItemsDownloaded,
      allItemsCompleted,
      activeTabKey,
      checkedItems,
      allChecked,
      indeterminate,
      hasSelectedDownloadedItems,
      hasSelectedWorkingItems,
      handleSearch,
      handleBranchFilterChange,
      handleBankFilterChange,
      handleChequeTypeFilterChange,
      handleDateRangeChange,
      handleTabChange,
      viewRequisition,
      downloadItem,
      markItemAsWorking,
      markItemAsComplete,
      markAsWorking,
      markAsComplete,
      onCheckAllChange,
      onItemCheckChange,
      showExportPreview,
      exportAsExcel,
      exportAsCSV,
      dispatchRequisition,
      handleConfirmAction,
      formatDate,
      getStatusColor,
      getItemStatusColor,
      getSeverityColor,
      canDispatch,
    };
  },
});
</script>

<style scoped>
/* Enhanced custom styles */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0fdf4;
}

.custom-table :deep(.ant-table-tbody > tr.bg-emerald-50 > td) {
  background-color: #ecfdf5;
}

.custom-modal :deep(.ant-modal-header) {
  border-bottom: none;
  padding: 16px 24px;
  background-color: #f9fafb;
}

.custom-modal :deep(.ant-modal-content) {
  overflow: hidden;
  border-radius: 8px;
}

/* Ensure buttons have consistent width */
.ant-btn {
  min-width: 32px;
}

.ant-btn:not(.ant-btn-circle) {
  min-width: 80px;
}

/* Transition effects */
.ant-table-row {
  transition: background-color 0.3s ease;
}

.ant-tag {
  transition: all 0.3s ease;
}

.ant-btn {
  transition: all 0.3s ease;
}

/* Make the modal scrollable */
.custom-modal :deep(.ant-modal-body) {
  max-height: 80vh;
  overflow-y: auto;
}

/* Tab styles */
.ant-tabs-tab {
  transition: all 0.2s ease;
}

.ant-tabs-tab:hover {
  color: #10b981;
}

.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #10b981;
  font-weight: 500;
}

.ant-tabs-ink-bar {
  background-color: #10b981;
}
</style>
