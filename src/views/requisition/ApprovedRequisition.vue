<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          <span class="text-emerald-600">Approved</span> Requisitions
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
            v-model:value="branchFilter"
            placeholder="Filter by Branch Name"
            class="w-full md:w-48"
            @change="handleBranchFilterChange"
          >
            <a-select-option value="">All Branches</a-select-option>
            <a-select-option value="Main">Main Branch</a-select-option>
            <a-select-option value="North">North Branch</a-select-option>
            <a-select-option value="South">South Branch</a-select-option>
            <a-select-option value="East">East Branch</a-select-option>
            <a-select-option value="West">West Branch</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateRangeChange"
            class="w-full md:w-auto"
            :placeholder="['Start Date', 'End Date']"
          />
        </div>
      </div>

      <!-- Requisition Table -->
      <a-table
        :dataSource="filteredRequisitions"
        :columns="columns"
        :loading="loading"
        :pagination="{
            pageSize: 10,
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

              <a-tooltip v-if="record.status === 'Pending'" title="Approve">
                <a-button
                  type="primary"
                  size="small"
                  class="bg-green-600 hover:bg-green-700 border-0"
                  style="background-color: #309898"
                  @click="approveRequisition(record)"
                >
                  Approve
                </a-button>
              </a-tooltip>

              <a-tooltip v-if="record.status === 'Approved'" title="Order">
                <a-button
                  type="primary"
                  size="small"
                  class="bg-blue-600 hover:bg-blue-700 border-0"
                  style="background-color: #d98324"
                  @click="OrderRequisition(record)"
                >
                  Order
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
      width="75%"
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
                Requested by {{ selectedRequisition.requestedBy }} on
                {{ formatDate(selectedRequisition.requestDate) }}
              </p>
            </div>

            <div class="flex gap-2 mt-4 md:mt-0">
              <a-button
                v-if="selectedRequisition.status === 'Pending'"
                type="primary"
                class="bg-green-600 hover:bg-green-700 border-0"
                @click="approveRequisition(selectedRequisition)"
              >
                <template #icon><CheckOutlined /></template>
                Approve
              </a-button>

              <a-button
                v-if="selectedRequisition.status === 'Approved'"
                type="primary"
                @click="OrderRequisition(selectedRequisition)"
              >
                <template #icon><SendOutlined /></template>
                Order
              </a-button>

              <a-button
                v-if="selectedRequisition.status === 'Ordered'"
                type="default"
                disabled
              >
                <template #icon><CheckCircleOutlined /></template>
                Sent
              </a-button>
            </div>
          </div>
        </div>

        <!-- Cheque Items Table -->
        <div class="p-6 overflow-auto">
          <h3 class="text-lg font-semibold mb-4">Requisition Items</h3>

          <a-table
            :dataSource="chequeItems"
            :columns="chequeItemColumns"
            :pagination="{ pageSize: 5 }"
            rowKey="id"
            class="mb-2 custom-table"
            :scroll="{ x: 500 }"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'severity'">
                <a-tag
                  :color="getSeverityColor(text)"
                  class="px-2 py-0.5 rounded-full"
                >
                  {{ text }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </div>

        <div
          class="flex justify-end gap-3 p-2 bg-gray-50 border-t border-gray-200"
        >
          <a-button @click="modalVisible = false">Close</a-button>
        </div>
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
        danger: confirmModalAction === 'delete',
        class:
          confirmModalAction === 'approve'
            ? 'bg-green-600 hover:bg-green-700 border-0'
            : '',
      }"
    >
      <p>{{ confirmModalMessage }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  PlusOutlined,
  EyeOutlined,
  CheckOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";

interface ChequeItem {
  id: number;
  requisitionNo: string;
  accountNo: string;
  routingNo: string;
  startNo: number;
  endNo: number;
  prefix: string;
  series: string;
  severity: string;
  branchName: string;
  accountName: string;
  customerAddress: string;
  bookQuantity: number;
  transactionCode: number;
  leafCount: number;
  courierCode: string;
  distributionPointName: string;
  receivingBranch: string;
}

interface RequisitionDetail {
  accountNo: string;
  routetingNo: string;
  startNo: number;
  endNo: number;
  prefix: string;
  series: string;
  serverity: string;
  branchName: string;
  accountName: string;
  cusAddress: string;
  bookQty: number;
  transactionCode: number;
  leafCount: number;
  courierCode: string;
  distributionPointName: string;
  receiviningBranch: string;
  requestDate: string;
}

interface Requisition {
  id: number;
  branchId: number;
  branchName: string;
  requestedBy: string;
  requisitionNo: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Ordered" | "Dispatch" | "Delivered";
  details: RequisitionDetail;
}

export default defineComponent({
  name: "RequisitionList",
  components: {
    PlusOutlined,
    EyeOutlined,
    CheckOutlined,
    SendOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
  },
  setup() {
    const requisitions = ref<Requisition[]>([]);
    const loading = ref(true);
    const searchText = ref("");
    const branchFilter = ref("");
    const dateRange = ref<[Dayjs, Dayjs] | null>(null);
    const modalVisible = ref(false);
    const selectedRequisition = ref<Requisition | null>(null);
    const confirmModalVisible = ref(false);
    const confirmModalTitle = ref("");
    const confirmModalMessage = ref("");
    const confirmModalOkText = ref("");
    const confirmModalAction = ref("");
    const requisitionToAction = ref<Requisition | null>(null);
    const chequeItems = ref<ChequeItem[]>([]);

    // Table columns definition
    const columns = [
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        sorter: (a: Requisition, b: Requisition) =>
          a.requisitionNo.localeCompare(b.requisitionNo),
      },
      {
        title: "Branch",
        dataIndex: "branchName",
        key: "branchName",
        sorter: (a: Requisition, b: Requisition) =>
          a.branchName.localeCompare(b.branchName),
      },
      {
        title: "Requested By",
        dataIndex: "requestedBy",
        key: "requestedBy",
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Pending", value: "Pending" },
          { text: "Approved", value: "Approved" },
          { text: "Ordered", value: "Ordered" },
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

    // Cheque item columns for the modal view
    const chequeItemColumns = [
      {
        title: "Requisition No",
        dataIndex: "requisitionNo",
        key: "requisitionNo",
        fixed: "left",
        width: 150,
      },
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        width: 150,
      },
      {
        title: "Routing No",
        dataIndex: "routingNo",
        key: "routingNo",
        width: 150,
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
        title: "Prefix",
        dataIndex: "prefix",
        key: "prefix",
        width: 120,
      },
      {
        title: "Series",
        dataIndex: "series",
        key: "series",
        width: 120,
      },
      {
        title: "Severity",
        dataIndex: "severity",
        key: "severity",
        width: 120,
      },
      {
        title: "Branch Name",
        dataIndex: "branchName",
        key: "branchName",
        width: 150,
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
        title: "Book Quantity",
        dataIndex: "bookQuantity",
        key: "bookQuantity",
        width: 140,
      },
      {
        title: "Transaction Code",
        dataIndex: "transactionCode",
        key: "transactionCode",
        width: 160,
      },
      {
        title: "Leaf Count",
        dataIndex: "leafCount",
        key: "leafCount",
        width: 130,
      },
      {
        title: "Courier Code",
        dataIndex: "courierCode",
        key: "courierCode",
        width: 140,
      },
      {
        title: "Distribution Point",
        dataIndex: "distributionPointName",
        key: "distributionPointName",
        width: 180,
      },
      {
        title: "Receiving Branch",
        dataIndex: "receivingBranch",
        key: "receivingBranch",
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
            req.requestedBy.toLowerCase().includes(searchLower)
        );
      }
      // Apply branch filter
      if (branchFilter.value) {
        result = result.filter((req) => req.branchName === branchFilter.value);
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

      // Apply approved status filter - only show approved requisitions
      result = result.filter((req) => req.status === "Approved");
      return result;
    });

    // Fetch requisition data
    const fetchRequisitions = async () => {
      loading.value = true;
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          requisitions.value = generateMockData();
          loading.value = false;
        }, 1000);
      } catch (error) {
        message.error("Failed to fetch requisitions");
        loading.value = false;
      }
    };

    // Generate mock data for demonstration
    const generateMockData = (): Requisition[] => {
      const statuses: Array<
        "Pending" | "Approved" | "Ordered" | "Dispatch" | "Delivered"
      > = ["Pending", "Approved", "Ordered", "Dispatch", "Delivered"];

      return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        branchId: Math.floor(Math.random() * 10) + 1,
        branchName: `Branch ${Math.floor(Math.random() * 10) + 1}`,
        requestedBy: `User ${Math.floor(Math.random() * 5) + 1}`,
        requisitionNo: `REQ-${2023}-${1000 + i}`,
        requestDate: new Date(
          2023,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        details: {
          accountNo: `AC-${100000 + i}`,
          routetingNo: `RT-${200000 + i}`,
          startNo: 1000 + i * 100,
          endNo: 1099 + i * 100,
          prefix: `PFX-${i % 5}`,
          series: `S-${i % 3}`,
          serverity: ["High", "Medium", "Low"][i % 3],
          branchName: `Branch ${Math.floor(Math.random() * 10) + 1}`,
          accountName: `Account Holder ${i + 1}`,
          cusAddress: `123 Main St, City ${i + 1}, Country`,
          bookQty: Math.floor(Math.random() * 5) + 1,
          transactionCode: 1000 + i,
          leafCount: (Math.floor(Math.random() * 5) + 1) * 10,
          courierCode: `CR-${1000 + i}`,
          distributionPointName: `Distribution Point ${(i % 5) + 1}`,
          receiviningBranch: `Branch ${Math.floor(Math.random() * 10) + 1}`,
          requestDate: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ).toISOString(),
        },
      }));
    };

    // Generate mock cheque items for a requisition
    const generateChequeItems = (requisition: Requisition): ChequeItem[] => {
      // For demo purposes, generate 5-10 cheque items per requisition
      const itemCount = Math.floor(Math.random() * 6) + 5;

      return Array.from({ length: itemCount }, (_, i) => ({
        id: i + 1,
        requisitionNo: requisition.requisitionNo,
        accountNo: `AC-${100000 + i}-${requisition.id}`,
        routingNo: `RT-${200000 + i}-${requisition.id}`,
        startNo: requisition.details.startNo + i * 100,
        endNo: requisition.details.startNo + i * 100 + 99,
        prefix: requisition.details.prefix,
        series: requisition.details.series,
        severity: ["High", "Medium", "Low"][i % 3],
        branchName: requisition.branchName,
        accountName: `Account ${i + 1} for ${requisition.requisitionNo}`,
        customerAddress: `${123 + i} Main St, City ${requisition.id}, Country`,
        bookQuantity: Math.floor(Math.random() * 5) + 1,
        transactionCode: 1000 + i + requisition.id,
        leafCount: (Math.floor(Math.random() * 5) + 1) * 10,
        courierCode: requisition.details.courierCode,
        distributionPointName: requisition.details.distributionPointName,
        receivingBranch: requisition.details.receiviningBranch,
      }));
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
        Pending: "orange",
        Approved: "green",
        Ordered: "blue",
        Dispatch: "purple",
        Delivered: "cyan",
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

    // Handle date range change
    const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
      dateRange.value = dates;
    };

    // View requisition details
    const viewRequisition = (record: Requisition) => {
      selectedRequisition.value = record;
      // Generate cheque items for this requisition
      chequeItems.value = generateChequeItems(record);
      modalVisible.value = true;
    };

    // Approve requisition
    const approveRequisition = (record: Requisition) => {
      confirmModalTitle.value = "Approve Requisition";
      confirmModalMessage.value = `Are you sure you want to approve requisition ${record.requisitionNo}?`;
      confirmModalOkText.value = "Approve";
      confirmModalAction.value = "approve";
      requisitionToAction.value = record;
      confirmModalVisible.value = true;
    };

    // Order requisition
    const OrderRequisition = (record: Requisition) => {
      confirmModalTitle.value = "Order Requisition";
      confirmModalMessage.value = `Are you sure you want to Order requisition ${record.requisitionNo}?`;
      confirmModalOkText.value = "Order";
      confirmModalAction.value = "Order";
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

      if (confirmModalAction.value === "approve") {
        // Update status to Approved
        requisitions.value[recordIndex].status = "Approved";
        message.success(
          `Requisition ${record.requisitionNo} has been approved`
        );
      } else if (confirmModalAction.value === "Order") {
        // Update status to Ordered
        requisitions.value[recordIndex].status = "Ordered";
        message.success(`Requisition ${record.requisitionNo} has been Ordered`);
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
      dateRange,
      columns,
      chequeItemColumns,
      chequeItems,
      filteredRequisitions,
      modalVisible,
      selectedRequisition,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalOkText,
      confirmModalAction,
      handleSearch,
      handleBranchFilterChange,
      handleDateRangeChange,
      viewRequisition,
      approveRequisition,
      OrderRequisition,
      handleConfirmAction,
      formatDate,
      getStatusColor,
      getSeverityColor,
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
</style>
