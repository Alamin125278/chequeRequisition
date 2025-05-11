<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          <span class="text-emerald-600">Make</span> Challan
        </h1>
        <div class="flex items-center space-x-2">
          <a-badge
            :count="selectedCount"
            :overflowCount="99"
            :numberStyle="{ backgroundColor: '#10B981' }"
          />
          <span class="text-gray-500">Selected Requisitions</span>
        </div>
      </div>

      <!-- Filter Section -->
      <div
        class="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
      >
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FilterOutlined class="mr-2" /> Filter Requisitions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bank <span class="text-red-500">*</span></label
            >
            <a-select
              v-model:value="bankFilter"
              placeholder="Select Bank"
              class="w-full"
              :allowClear="false"
              :status="bankFilterError ? 'error' : ''"
            >
              <a-select-option value="">Select Bank</a-select-option>
              <a-select-option value="National Bank"
                >National Bank</a-select-option
              >
              <a-select-option value="City Bank">City Bank</a-select-option>
              <a-select-option value="Metro Bank">Metro Bank</a-select-option>
              <a-select-option value="Global Bank">Global Bank</a-select-option>
            </a-select>
            <div v-if="bankFilterError" class="text-red-500 text-xs mt-1">
              Bank is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Branch <span class="text-red-500">*</span></label
            >
            <a-select
              v-model:value="branchFilter"
              placeholder="Select Branch"
              class="w-full"
              :allowClear="false"
              :disabled="!bankFilter"
              :status="branchFilterError ? 'error' : ''"
            >
              <a-select-option value="">Select Branch</a-select-option>
              <a-select-option value="Main Branch">Main Branch</a-select-option>
              <a-select-option value="North Branch"
                >North Branch</a-select-option
              >
              <a-select-option value="South Branch"
                >South Branch</a-select-option
              >
              <a-select-option value="East Branch">East Branch</a-select-option>
              <a-select-option value="West Branch">West Branch</a-select-option>
            </a-select>
            <div v-if="branchFilterError" class="text-red-500 text-xs mt-1">
              Branch is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Request Date <span class="text-red-500">*</span></label
            >
            <a-date-picker
              v-model:value="requestDate"
              class="w-full"
              :status="requestDateError ? 'error' : ''"
            />
            <div v-if="requestDateError" class="text-red-500 text-xs mt-1">
              Request Date is required
            </div>
          </div>

          <div class="flex items-end">
            <a-button
              type="primary"
              class="w-full bg-emerald-600 hover:bg-emerald-700 border-0 h-10 text-base"
              @click="searchRequisitions"
            >
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
          </div>
        </div>
      </div>

      <!-- Requisitions Table -->
      <div v-if="showTable" class="transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <UnorderedListOutlined class="mr-2" /> Completed Requisitions
          </h2>
          <a-button
            type="primary"
            :disabled="!hasSelectedRequisitions"
            @click="createChallan"
            class="bg-emerald-600 hover:bg-emerald-700 border-0 h-10"
          >
            <template #icon><FileAddOutlined /></template>
            Create Challan
          </a-button>
        </div>

        <div
          class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
        >
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
            class="custom-table"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  :checked="allSelected"
                  :indeterminate="indeterminate"
                  @change="onSelectAllChange"
                />
              </template>
              <template v-else>
                {{ column.title }}
              </template>
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  v-model:checked="selectedRequisitions[record.id]"
                  @change="() => onRequisitionCheckChange()"
                />
              </template>

              <template v-if="column.key === 'status'">
                <a-tag
                  :color="getStatusColor(record.status)"
                  class="px-3 py-1 rounded-full"
                >
                  {{ record.status }}
                </a-tag>
              </template>

              <template v-if="column.key === 'severity'">
                <a-tag
                  :color="getSeverityColor(record.severity)"
                  class="px-3 py-1 rounded-full"
                >
                  {{ record.severity }}
                </a-tag>
              </template>

              <template v-if="column.key === 'actions'">
                <div class="flex gap-2">
                  <a-button
                    type="primary"
                    size="small"
                    @click="viewRequisitionDetails(record)"
                    class="bg-blue-500 hover:bg-blue-600 border-0"
                  >
                    View
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <template v-if="selectedCount > 0">
              {{ selectedCount }} requisition(s) selected
            </template>
            <template v-else>
              Select requisitions to create a challan
            </template>
          </div>
          <a-button
            type="primary"
            :disabled="!hasSelectedRequisitions"
            @click="createChallan"
            class="bg-emerald-600 hover:bg-emerald-700 border-0"
          >
            <template #icon><FileAddOutlined /></template>
            Create Challan
          </a-button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!showTable" class="text-center py-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4"
        >
          <FileSearchOutlined style="font-size: 24px" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No Requisitions Found
        </h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">
          Use the filter options above to search for completed requisitions that
          are ready for challan creation.
        </p>
      </div>
    </div>

    <!-- Requisition Details Modal -->
    <a-modal
      v-model:visible="detailsModalVisible"
      :title="`Requisition Details: ${
        selectedRequisition?.requisitionNo || ''
      }`"
      width="90%"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
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
            <div class="mt-4 md:mt-0">
              <a-checkbox
                v-model:checked="selectedRequisitions[selectedRequisition.id]"
                @change="() => onRequisitionCheckChange()"
              >
                Select for Challan
              </a-checkbox>
            </div>
          </div>
        </div>

        <!-- Requisition Items -->
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <UnorderedListOutlined class="mr-2" /> Requisition Items
          </h3>
          <a-table
            :dataSource="requisitionItems"
            :columns="itemColumns"
            :pagination="{ pageSize: 5 }"
            rowKey="id"
            class="mb-2 custom-table"
            :scroll="{ x: 1500 }"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'status'">
                <a-tag
                  :color="getItemStatusColor(text)"
                  class="px-2 py-0.5 rounded-full"
                >
                  {{ text }}
                </a-tag>
              </template>
              <template v-if="column.key === 'receivingBranch'">
                <a-tag color="blue" class="px-2 py-0.5 rounded-full">
                  {{ text }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </div>

        <div
          class="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200"
        >
          <a-button @click="detailsModalVisible = false">Close</a-button>
        </div>
      </div>
    </a-modal>

    <!-- Challan Preview Modal -->
    <a-modal
      v-model:visible="challanModalVisible"
      title="Challan Preview"
      width="90%"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
      class="custom-modal"
    >
      <div class="p-6">
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold flex items-center">
              <FileTextOutlined class="mr-2" /> Generated Challans
            </h3>
            <div class="flex items-center">
              <a-badge
                :count="challanGroups.length"
                :numberStyle="{ backgroundColor: '#10B981' }"
              />
              <span class="ml-2 text-gray-500">Challans Generated</span>
            </div>
          </div>

          <p
            class="text-sm text-gray-500 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start"
          >
            <InfoCircleOutlined class="text-blue-500 mr-2 mt-0.5" />
            <span>
              {{ challanGroups.length }} challan(s) have been generated based on
              receiving branches. Each tab below represents a separate challan.
              You can print each challan individually or finalize all at once.
            </span>
          </p>

          <a-tabs
            v-model:activeKey="activeChallanTab"
            type="card"
            class="custom-tabs"
          >
            <a-tab-pane
              v-for="(group, index) in challanGroups"
              :key="index.toString()"
              :tab="'Challan #' + (index + 1) + ' - ' + group.receivingBranch"
            >
              <div
                class="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm print:shadow-none"
              >
                <div
                  class="flex justify-between items-start mb-8 border-b border-gray-200 pb-6"
                >
                  <div>
                    <h4 class="text-2xl font-bold text-gray-800">
                      Delivery Challan
                    </h4>
                    <p class="text-sm text-gray-500 mt-1">
                      Challan No:
                      <span class="font-medium"
                        >CH-{{ generateChallanNumber(index) }}</span
                      >
                    </p>
                    <p class="text-sm text-gray-500">
                      Date:
                      <span class="font-medium">{{
                        formatDate(new Date().toISOString())
                      }}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <h4 class="text-xl font-semibold text-gray-800">
                      {{ bankFilter }}
                    </h4>
                    <p class="text-sm text-gray-500">{{ branchFilter }}</p>
                    <div
                      class="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium"
                    >
                      {{ group.items.length }} Items
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <div
                    class="flex flex-col md:flex-row md:justify-between md:items-start gap-6"
                  >
                    <div
                      class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1"
                    >
                      <h5 class="font-semibold mb-2 text-gray-700">From:</h5>
                      <p class="font-medium">{{ bankFilter }}</p>
                      <p>{{ branchFilter }}</p>
                      <p class="text-gray-500 text-sm">123 Main Street, City</p>
                      <p class="text-gray-500 text-sm">Phone: (123) 456-7890</p>
                    </div>

                    <div
                      class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1"
                    >
                      <h5 class="font-semibold mb-2 text-gray-700">To:</h5>
                      <p class="font-medium">{{ bankFilter }}</p>
                      <p>{{ group.receivingBranch }}</p>
                      <p class="text-gray-500 text-sm">
                        456 Branch Avenue, City
                      </p>
                      <p class="text-gray-500 text-sm">Phone: (123) 456-7890</p>
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <h5
                    class="font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2"
                  >
                    Requisition Items:
                  </h5>
                  <a-table
                    :dataSource="group.items"
                    :columns="challanItemColumns"
                    :pagination="false"
                    rowKey="id"
                    class="mb-2 custom-table challan-table"
                    :scroll="{ x: 1200 }"
                    size="middle"
                  />
                </div>

                <div class="mt-12 pt-6 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <div class="border-t-2 border-gray-400 pt-2 mt-16">
                        <p class="text-center font-medium">Prepared By</p>
                        <p class="text-center text-sm text-gray-500">
                          {{ branchFilter }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div class="border-t-2 border-gray-400 pt-2 mt-16">
                        <p class="text-center font-medium">Authorized By</p>
                        <p class="text-center text-sm text-gray-500">
                          Branch Manager
                        </p>
                      </div>
                    </div>
                    <div>
                      <div class="border-t-2 border-gray-400 pt-2 mt-16">
                        <p class="text-center font-medium">Received By</p>
                        <p class="text-center text-sm text-gray-500">
                          {{ group.receivingBranch }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <a-button @click="printChallan(index)">
                  <template #icon><PrinterOutlined /></template>
                  Print Challan
                </a-button>
                <a-button
                  type="primary"
                  class="bg-emerald-600 hover:bg-emerald-700 border-0"
                >
                  <template #icon><DownloadOutlined /></template>
                  Download PDF
                </a-button>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <div
        class="flex justify-between gap-3 p-4 bg-gray-50 border-t border-gray-200"
      >
        <div>
          <a-button
            type="primary"
            @click="printAllChallans"
            class="bg-blue-500 hover:bg-blue-600 border-0 mr-2"
          >
            <template #icon><PrinterOutlined /></template>
            Print All
          </a-button>
          <a-button>
            <template #icon><DownloadOutlined /></template>
            Download All
          </a-button>
        </div>
        <div>
          <a-button @click="challanModalVisible = false" class="mr-2"
            >Cancel</a-button
          >
          <a-button
            type="primary"
            @click="finalizeChallan"
            class="bg-emerald-600 hover:bg-emerald-700 border-0"
          >
            <template #icon><CheckCircleOutlined /></template>
            Finalize All Challans
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, watch } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  SearchOutlined,
  FileAddOutlined,
  PrinterOutlined,
  EyeOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  BranchesOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
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
  status: "Complete Working";
  receivingBranch: string;
}

interface Requisition {
  id: number;
  sl: number;
  requisitionNo: string;
  bankName: string;
  branchName: string;
  requestDate: string;
  severity: "High" | "Medium" | "Low";
  status: "Working Complete";
  chequeTypes: string[];
  itemCount: number;
}

interface ChallanGroup {
  receivingBranch: string;
  items: RequisitionItem[];
}

export default defineComponent({
  name: "MakeChallan",
  components: {
    SearchOutlined,
    FileAddOutlined,
    PrinterOutlined,
    EyeOutlined,
    FilterOutlined,
    UnorderedListOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    BranchesOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
  },
  setup() {
    // Filter state
    const bankFilter = ref("");
    const branchFilter = ref("");
    const requestDate = ref<Dayjs | null>(null);
    const bankFilterError = ref(false);
    const branchFilterError = ref(false);
    const requestDateError = ref(false);

    // Table state
    const loading = ref(false);
    const showTable = ref(false);
    const requisitions = ref<Requisition[]>([]);
    const selectedRequisitions = reactive<Record<number, boolean>>({});
    const allSelected = ref(false);
    const indeterminate = ref(false);

    // Modal state
    const detailsModalVisible = ref(false);
    const selectedRequisition = ref<Requisition | null>(null);
    const requisitionItems = ref<RequisitionItem[]>([]);

    // Challan state
    const challanModalVisible = ref(false);
    const challanGroups = ref<ChallanGroup[]>([]);
    const activeChallanTab = ref("0");

    // Computed property for selected count
    const selectedCount = computed(() => {
      return Object.values(selectedRequisitions).filter(Boolean).length;
    });

    // Table columns for requisitions
    const columns = [
      {
        title: "",
        key: "checkbox",
        width: 50,
        align: "center",
        fixed: "left",
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
        sorter: (a: Requisition, b: Requisition) =>
          a.requisitionNo.localeCompare(b.requisitionNo),
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
        title: "Request Date",
        dataIndex: "requestDate",
        key: "requestDate",
        render: (text: string) => formatDate(text),
      },
      {
        title: "Severity",
        dataIndex: "severity",
        key: "severity",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Item Count",
        dataIndex: "itemCount",
        key: "itemCount",
      },
      {
        title: "Actions",
        key: "actions",
        width: 180,
        align: "center",
        fixed: "right",
      },
    ];

    // Table columns for requisition items
    const itemColumns = [
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        width: 180,
      },
      {
        title: "Cheque Type",
        dataIndex: "chequeType",
        key: "chequeType",
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
        title: "Receiving Branch",
        dataIndex: "receivingBranch",
        key: "receivingBranch",
        width: 180,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
      },
    ];

    // Table columns for challan items
    const challanItemColumns = [
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
        title: "Account Name",
        dataIndex: "accountName",
        key: "accountName",
        width: 180,
      },
      {
        title: "Account No",
        dataIndex: "accountNo",
        key: "accountNo",
        width: 150,
      },
      {
        title: "Cheque Type",
        dataIndex: "chequeType",
        key: "chequeType",
        width: 140,
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
    ];

    // Computed property for filtered requisitions
    const filteredRequisitions = computed(() => {
      return requisitions.value.filter(
        (req) => req.status === "Working Complete"
      );
    });

    // Computed property to check if any requisitions are selected
    const hasSelectedRequisitions = computed(() => {
      return Object.values(selectedRequisitions).some((value) => value);
    });

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

    // Validate form fields
    const validateForm = () => {
      let isValid = true;

      if (!bankFilter.value) {
        bankFilterError.value = true;
        isValid = false;
      } else {
        bankFilterError.value = false;
      }

      if (!branchFilter.value) {
        branchFilterError.value = true;
        isValid = false;
      } else {
        branchFilterError.value = false;
      }

      if (!requestDate.value) {
        requestDateError.value = true;
        isValid = false;
      } else {
        requestDateError.value = false;
      }

      return isValid;
    };

    // Search for requisitions
    const searchRequisitions = () => {
      if (!validateForm()) {
        message.error("Please fill in all required fields");
        return;
      }

      loading.value = true;

      // In a real application, this would be an API call
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        requisitions.value = generateMockRequisitions();
        showTable.value = true;
        loading.value = false;

        // Reset selection
        Object.keys(selectedRequisitions).forEach((key) => {
          delete selectedRequisitions[parseInt(key)];
        });

        // Initialize selection state
        requisitions.value.forEach((req) => {
          selectedRequisitions[req.id] = false;
        });

        allSelected.value = false;
        indeterminate.value = false;
      }, 1000);
    };

    // Generate mock requisitions for demonstration
    const generateMockRequisitions = (): Requisition[] => {
      const severities: Array<"High" | "Medium" | "Low"> = [
        "High",
        "Medium",
        "Low",
      ];

      // Use the selected bank and branch
      const bankName = bankFilter.value;
      const branchName = branchFilter.value;

      // Generate 5-10 requisitions
      const count = Math.floor(Math.random() * 6) + 5;

      return Array.from({ length: count }, (_, i) => {
        const itemCount = Math.floor(Math.random() * 6) + 5;

        return {
          id: i + 1,
          sl: i + 1,
          requisitionNo: `REQ-${2023}-${1000 + i}`,
          bankName,
          branchName,
          requestDate: requestDate.value
            ? requestDate.value.toDate().toISOString()
            : new Date().toISOString(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: "Working Complete",
          chequeTypes: ["Standard", "Premium", "Business"].slice(
            0,
            Math.floor(Math.random() * 3) + 1
          ),
          itemCount,
        };
      });
    };

    // Generate mock requisition items for a requisition
    const generateRequisitionItems = (
      requisition: Requisition
    ): RequisitionItem[] => {
      const branchNames = [
        "Main Branch",
        "North Branch",
        "South Branch",
        "East Branch",
        "West Branch",
      ];

      return Array.from({ length: requisition.itemCount }, (_, i) => {
        // Randomly assign a receiving branch
        const receivingBranch =
          branchNames[Math.floor(Math.random() * branchNames.length)];

        return {
          id: i + 1,
          sl: i + 1,
          requisitionNo: requisition.requisitionNo,
          bankName: requisition.bankName,
          branchNameAddress: `${requisition.branchName}, 123 Main St, City ${
            i + 1
          }`,
          accountName: `Account Holder ${i + 1}`,
          customerAddress: `${123 + i} Main St, City ${
            requisition.id
          }, Country`,
          chequePrefix: `PFX-${i % 5}`,
          accountNo: `AC-${100000 + i}-${requisition.id}`,
          chequeSerialNo: `${1000 + i * 100} - ${1099 + i * 100}`,
          leavesQuantity: (Math.floor(Math.random() * 5) + 1) * 10,
          bookQuantity: Math.floor(Math.random() * 5) + 1,
          routingNo: `RT-${200000 + i}-${requisition.id}`,
          transactionCode: 1000 + i + requisition.id,
          chequeType:
            requisition.chequeTypes[i % requisition.chequeTypes.length],
          status: "Complete Working",
          receivingBranch,
        };
      });
    };

    // Handle "Select All" checkbox change
    const onSelectAllChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;

      filteredRequisitions.value.forEach((req) => {
        selectedRequisitions[req.id] = checked;
      });

      allSelected.value = checked;
      indeterminate.value = false;
    };

    // Handle individual requisition checkbox change
    const onRequisitionCheckChange = () => {
      const totalCount = filteredRequisitions.value.length;
      const selectedCount = filteredRequisitions.value.filter(
        (req) => selectedRequisitions[req.id]
      ).length;

      allSelected.value = totalCount > 0 && selectedCount === totalCount;
      indeterminate.value = selectedCount > 0 && selectedCount < totalCount;
    };

    // Watch for changes in filteredRequisitions to update selection state
    watch(filteredRequisitions, () => {
      onRequisitionCheckChange();
    });

    // View requisition details
    const viewRequisitionDetails = (record: Requisition) => {
      selectedRequisition.value = record;
      requisitionItems.value = generateRequisitionItems(record);
      detailsModalVisible.value = true;
    };

    // Create challan from selected requisitions
    const createChallan = () => {
      // Get all selected requisitions
      const selected = filteredRequisitions.value.filter(
        (req) => selectedRequisitions[req.id]
      );

      if (selected.length === 0) {
        message.warning("Please select at least one requisition");
        return;
      }

      // Get all items from selected requisitions
      let allItems: RequisitionItem[] = [];

      selected.forEach((req) => {
        const items = generateRequisitionItems(req);
        allItems = [...allItems, ...items];
      });

      // Group items by receiving branch
      const groupedByBranch: Record<string, RequisitionItem[]> = {};

      allItems.forEach((item) => {
        if (!groupedByBranch[item.receivingBranch]) {
          groupedByBranch[item.receivingBranch] = [];
        }

        groupedByBranch[item.receivingBranch].push(item);
      });

      // Create challan groups
      challanGroups.value = Object.entries(groupedByBranch).map(
        ([branch, items]) => ({
          receivingBranch: branch,
          items: items.map((item, index) => ({
            ...item,
            sl: index + 1, // Reassign serial numbers
          })),
        })
      );

      // Show challan modal
      activeChallanTab.value = "0";
      challanModalVisible.value = true;
    };

    // Generate a unique challan number
    const generateChallanNumber = (index: number) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}${month}${day}-${index + 1}`;
    };

    // Print challan
    const printChallan = (index: number) => {
      message.success(`Printing Challan #${index + 1}`);
      // In a real application, this would trigger a print function
    };

    // Print all challans
    const printAllChallans = () => {
      message.success(`Printing all ${challanGroups.value.length} challans`);
      // In a real application, this would trigger a print function for all challans
    };

    // Finalize all challans
    const finalizeChallan = () => {
      message.success("All challans have been finalized");
      challanModalVisible.value = false;

      // Reset selection
      Object.keys(selectedRequisitions).forEach((key) => {
        selectedRequisitions[parseInt(key)] = false;
      });

      allSelected.value = false;
      indeterminate.value = false;

      // In a real application, this would update the status of the requisitions
    };

    return {
      // Filter state
      bankFilter,
      branchFilter,
      requestDate,
      bankFilterError,
      branchFilterError,
      requestDateError,

      // Table state
      loading,
      showTable,
      requisitions,
      filteredRequisitions,
      selectedRequisitions,
      allSelected,
      indeterminate,
      columns,
      hasSelectedRequisitions,
      selectedCount,

      // Modal state
      detailsModalVisible,
      selectedRequisition,
      requisitionItems,
      itemColumns,

      // Challan state
      challanModalVisible,
      challanGroups,
      activeChallanTab,
      challanItemColumns,

      // Methods
      formatDate,
      getStatusColor,
      getItemStatusColor,
      getSeverityColor,
      validateForm,
      searchRequisitions,
      onSelectAllChange,
      onRequisitionCheckChange,
      viewRequisitionDetails,
      createChallan,
      generateChallanNumber,
      printChallan,
      printAllChallans,
      finalizeChallan,
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
.custom-tabs :deep(.ant-tabs-tab) {
  transition: all 0.2s ease;
  padding: 8px 16px;
  border-radius: 8px 8px 0 0;
}

.custom-tabs :deep(.ant-tabs-tab:hover) {
  color: #10b981;
}

.custom-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #10b981;
  font-weight: 500;
}

.custom-tabs :deep(.ant-tabs-ink-bar) {
  background-color: #10b981;
}

.custom-tabs :deep(.ant-tabs-nav::before) {
  border-bottom-color: #e5e7eb;
}

/* Challan table styles */
.challan-table :deep(.ant-table-thead > tr > th) {
  background-color: #f0fdf4;
  color: #065f46;
  font-weight: 600;
}

.challan-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0fdf4;
}

/* Print styles */
@media print {
  .ant-btn,
  .ant-tabs-nav {
    display: none !important;
  }

  .custom-modal :deep(.ant-modal-body) {
    padding: 0 !important;
    margin: 0 !important;
  }

  .custom-modal :deep(.ant-modal-content) {
    box-shadow: none !important;
  }
}
</style>
