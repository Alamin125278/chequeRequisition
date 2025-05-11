<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          <span class="text-blue-600">Challan</span> List
        </h1>
        <div class="flex items-center space-x-3">
          <a-button
            type="primary"
            class="bg-blue-600 hover:bg-blue-700 border-0"
            :disabled="!selectedChallan"
            @click="exportToExcel"
          >
            <template #icon><FileExcelOutlined /></template>
            Export to Excel
          </a-button>
        </div>
      </div>

      <!-- Filter Section -->
      <div
        class="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
      >
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FilterOutlined class="mr-2" /> Filter Challans
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bank</label
            >
            <a-select
              v-model:value="bankFilter"
              placeholder="Select Bank"
              class="w-full"
              :allowClear="true"
            >
              <a-select-option value="">All Banks</a-select-option>
              <a-select-option value="National Bank"
                >National Bank</a-select-option
              >
              <a-select-option value="City Bank">City Bank</a-select-option>
              <a-select-option value="Metro Bank">Metro Bank</a-select-option>
              <a-select-option value="Global Bank">Global Bank</a-select-option>
            </a-select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Branch</label
            >
            <a-select
              v-model:value="branchFilter"
              placeholder="Select Branch"
              class="w-full"
              :allowClear="true"
              :disabled="!bankFilter"
            >
              <a-select-option value="">All Branches</a-select-option>
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
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Request Date</label
            >
            <a-date-picker v-model:value="requestDate" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Challan Number</label
            >
            <a-input
              v-model:value="challanNumberFilter"
              placeholder="Enter Challan Number"
              class="w-full"
              allowClear
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Challan Date</label
            >
            <a-date-picker v-model:value="challanDate" class="w-full" />
          </div>

          <div class="flex items-end">
            <a-button
              type="primary"
              class="w-full bg-blue-600 hover:bg-blue-700 border-0 h-10 text-base"
              @click="searchChallans"
            >
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
          </div>
        </div>
      </div>

      <!-- Challans Table -->
      <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="flex justify-between items-center p-4 border-b border-gray-200"
        >
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <UnorderedListOutlined class="mr-2" /> All Challans
          </h2>
          <div class="text-sm text-gray-500">
            Total: {{ filteredChallans.length }} challans
          </div>
        </div>

        <a-table
          :dataSource="filteredChallans"
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
          :rowClassName="
            (record) => (record.id === selectedChallan?.id ? 'bg-blue-50' : '')
          "
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'challanNumber'">
              <a
                @click="selectChallan(record)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                {{ record.challanNumber }}
              </a>
            </template>

            <template v-if="column.key === 'requisitionNumbers'">
              <div class="flex flex-wrap gap-1">
                <a-tag
                  v-for="req in record.requisitionNumbers"
                  :key="req"
                  color="blue"
                  class="px-2 py-0.5 rounded-full"
                >
                  {{ req }}
                </a-tag>
              </div>
            </template>

            <template v-if="column.key === 'actions'">
              <div class="flex gap-2">
                <a-button
                  type="primary"
                  size="small"
                  @click="viewChallanDetails(record)"
                  class="bg-blue-500 hover:bg-blue-600 border-0"
                >
                  <template #icon><EyeOutlined /></template>
                  View
                </a-button>
                <a-button
                  type="primary"
                  size="small"
                  @click="printChallan(record)"
                  class="bg-green-500 hover:bg-green-600 border-0"
                >
                  <template #icon><PrinterOutlined /></template>
                  Print
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Selected Challan Summary -->
      <div
        v-if="selectedChallan"
        class="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <FileTextOutlined class="mr-2" /> Selected Challan Details
          </h2>
          <div class="flex items-center">
            <a-tag color="blue" class="px-3 py-1 rounded-full text-base">
              {{ selectedChallan.challanNumber }}
            </a-tag>
            <a-button
              type="primary"
              class="ml-3 bg-blue-600 hover:bg-blue-700 border-0"
              @click="exportToExcel"
            >
              <template #icon><FileExcelOutlined /></template>
              Export to Excel
            </a-button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Challan Date</p>
            <p class="font-medium">
              {{ formatDate(selectedChallan.challanDate) }}
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Bank</p>
            <p class="font-medium">{{ selectedChallan.bankName }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Branch</p>
            <p class="font-medium">{{ selectedChallan.branchName }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Receiving Branch</p>
            <p class="font-medium">{{ selectedChallan.receivingBranch }}</p>
          </div>
        </div>

        <div class="mb-6">
          <h3
            class="text-md font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2"
          >
            Requisition Items by Account Type
          </h3>
          <a-table
            :dataSource="groupedItems"
            :columns="accountTypeColumns"
            :pagination="false"
            rowKey="accountType"
            class="custom-table"
            :scroll="{ x: 800 }"
            size="middle"
          >
            <template #summary>
              <a-table-summary>
                <a-table-summary-row>
                  <a-table-summary-cell
                    :index="0"
                    :colSpan="2"
                    class="font-medium text-gray-700"
                  >
                    Total Summary
                  </a-table-summary-cell>
                  <a-table-summary-cell
                    :index="2"
                    class="font-medium text-right"
                  >
                    100%
                  </a-table-summary-cell>
                  <a-table-summary-cell
                    :index="3"
                    class="font-medium text-right"
                  >
                    {{ totalItems }}
                  </a-table-summary-cell>
                </a-table-summary-row>
              </a-table-summary>
            </template>
          </a-table>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 class="text-md font-semibold mb-2 text-blue-700">
            Summary by Account Type
          </h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in groupedItems"
              :key="item.accountType"
              class="bg-white px-3 py-2 rounded-md border border-blue-200 shadow-sm"
            >
              <span class="font-medium">{{ item.accountType }}</span>
              <span class="text-gray-600"> ({{ item.itemCount }}) = </span>
              <span class="font-medium">{{ item.itemCount }}</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-blue-200">
            <div class="font-medium text-blue-700">
              Total Items: {{ totalItems }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Challan Details Modal -->
    <a-modal
      v-model:visible="detailsModalVisible"
      :title="`Challan Details: ${
        selectedChallanForModal?.challanNumber || ''
      }`"
      width="90%"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
      class="custom-modal"
    >
      <div v-if="selectedChallanForModal" class="p-0">
        <!-- Header with basic info -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
          <div class="flex flex-wrap justify-between items-center">
            <div>
              <p class="text-lg font-medium text-gray-800">
                {{ selectedChallanForModal.challanNumber }}
                <a-tag color="blue" class="ml-2 px-3 py-1 rounded-full">
                  {{ formatDate(selectedChallanForModal.challanDate) }}
                </a-tag>
              </p>
              <p class="text-sm text-gray-500">
                Bank: {{ selectedChallanForModal.bankName }} | Branch:
                {{ selectedChallanForModal.branchName }} | Receiving Branch:
                {{ selectedChallanForModal.receivingBranch }}
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <p class="text-sm text-gray-500">
                <span class="font-medium">Courier:</span>
                {{ selectedChallanForModal.courierName }}
              </p>
              <p class="text-sm text-gray-500">
                <span class="font-medium">Tracking:</span>
                {{ selectedChallanForModal.trackingNumber }}
              </p>
            </div>
          </div>
        </div>

        <!-- Challan Content -->
        <div class="p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <UnorderedListOutlined class="mr-2" /> Requisitions
            </h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <a-tag
                v-for="req in selectedChallanForModal.requisitionNumbers"
                :key="req"
                color="blue"
                class="px-3 py-1 rounded-full text-base"
              >
                {{ req }}
              </a-tag>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <UnorderedListOutlined class="mr-2" /> Requisition Items
            </h3>
            <a-table
              :dataSource="modalItems"
              :columns="itemColumns"
              :pagination="{ pageSize: 10 }"
              rowKey="id"
              class="mb-2 custom-table"
              :scroll="{ x: 1500 }"
            >
              <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'accountType'">
                  <a-tag color="blue" class="px-2 py-0.5 rounded-full">
                    {{ text }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 class="text-md font-semibold mb-2 text-blue-700">
              Summary by Account Type
            </h3>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="item in modalGroupedItems"
                :key="item.accountType"
                class="bg-white px-3 py-2 rounded-md border border-blue-200 shadow-sm"
              >
                <span class="font-medium">{{ item.accountType }}</span>
                <span class="text-gray-600"> ({{ item.itemCount }}) = </span>
                <span class="font-medium">{{ item.itemCount }}</span>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-blue-200">
              <div class="font-medium text-blue-700">
                Total Items: {{ modalTotalItems }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200"
        >
          <a-button @click="printSelectedChallan" class="mr-2">
            <template #icon><PrinterOutlined /></template>
            Print Challan
          </a-button>
          <a-button
            type="primary"
            @click="exportSelectedChallan"
            class="bg-blue-600 hover:bg-blue-700 border-0"
          >
            <template #icon><FileExcelOutlined /></template>
            Export to Excel
          </a-button>
          <a-button @click="detailsModalVisible = false">Close</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import {
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons-vue";

interface ChallanItem {
  id: number;
  sl: number;
  requisitionNo: string;
  accountName: string;
  accountNo: string;
  chequeSerialNo: string;
  leavesQuantity: number;
  bookQuantity: number;
  accountType: string; // SB, CD, PO, etc.
}

interface Challan {
  id: number;
  sl: number;
  challanNumber: string;
  challanDate: string;
  bankName: string;
  branchName: string;
  courierName: string;
  trackingNumber: string;
  requisitionNumbers: string[];
  receivingBranch: string;
  items: ChallanItem[];
}

interface GroupedItem {
  accountType: string;
  itemCount: number;
}

export default defineComponent({
  name: "ChallanList",
  components: {
    SearchOutlined,
    EyeOutlined,
    FilterOutlined,
    UnorderedListOutlined,
    FileTextOutlined,
    FileExcelOutlined,
    PrinterOutlined,
  },
  setup() {
    // Filter state
    const bankFilter = ref("");
    const branchFilter = ref("");
    const requestDate = ref<Dayjs | null>(null);
    const challanNumberFilter = ref("");
    const challanDate = ref<Dayjs | null>(null);

    // Table state
    const loading = ref(false);
    const challans = ref<Challan[]>([]);
    const selectedChallan = ref<Challan | null>(null);

    // Modal state
    const detailsModalVisible = ref(false);
    const selectedChallanForModal = ref<Challan | null>(null);

    // Table columns for challans
    const columns = [
      {
        title: "SL.",
        dataIndex: "sl",
        key: "sl",
        width: 70,
      },
      {
        title: "Challan Number",
        dataIndex: "challanNumber",
        key: "challanNumber",
        sorter: (a: Challan, b: Challan) =>
          a.challanNumber.localeCompare(b.challanNumber),
      },
      {
        title: "Challan Date",
        dataIndex: "challanDate",
        key: "challanDate",
        render: (text: string) => formatDate(text),
        sorter: (a: Challan, b: Challan) =>
          new Date(a.challanDate).getTime() - new Date(b.challanDate).getTime(),
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
        title: "Courier Name",
        dataIndex: "courierName",
        key: "courierName",
      },
      {
        title: "Tracking Number",
        dataIndex: "trackingNumber",
        key: "trackingNumber",
      },
      {
        title: "Requisition Number(s)",
        dataIndex: "requisitionNumbers",
        key: "requisitionNumbers",
      },
      {
        title: "Receiving Branch",
        dataIndex: "receivingBranch",
        key: "receivingBranch",
      },
      {
        title: "Actions",
        key: "actions",
        width: 150,
        align: "center",
        fixed: "right",
      },
    ];

    // Table columns for account type summary
    const accountTypeColumns = [
      {
        title: "Account Type",
        dataIndex: "accountType",
        key: "accountType",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Percentage",
        dataIndex: "percentage",
        key: "percentage",
        align: "right",
        render: (text: string) => `${text}%`,
      },
      {
        title: "Item Count",
        dataIndex: "itemCount",
        key: "itemCount",
        align: "right",
      },
    ];

    // Table columns for items in modal
    const itemColumns = [
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
        title: "Account Type",
        dataIndex: "accountType",
        key: "accountType",
        width: 120,
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

    // Computed property for filtered challans
    const filteredChallans = computed(() => {
      let result = [...challans.value];

      if (bankFilter.value) {
        result = result.filter(
          (challan) => challan.bankName === bankFilter.value
        );
      }

      if (branchFilter.value) {
        result = result.filter(
          (challan) => challan.branchName === branchFilter.value
        );
      }

      if (requestDate.value) {
        // In a real app, this would filter based on the request date of the requisitions
        // For demo purposes, we'll just use the challan date
        const reqDate = requestDate.value.toDate().toISOString().split("T")[0];
        result = result.filter((challan) => {
          const challanDateStr = new Date(challan.challanDate)
            .toISOString()
            .split("T")[0];
          return challanDateStr === reqDate;
        });
      }

      if (challanNumberFilter.value) {
        result = result.filter((challan) =>
          challan.challanNumber
            .toLowerCase()
            .includes(challanNumberFilter.value.toLowerCase())
        );
      }

      if (challanDate.value) {
        const challanDateStr = challanDate.value
          .toDate()
          .toISOString()
          .split("T")[0];
        result = result.filter((challan) => {
          const date = new Date(challan.challanDate)
            .toISOString()
            .split("T")[0];
          return date === challanDateStr;
        });
      }

      return result;
    });

    // Computed property for grouped items by account type
    const groupedItems = computed(() => {
      if (!selectedChallan.value) return [];

      const items = selectedChallan.value.items;
      const grouped: Record<string, GroupedItem> = {};

      items.forEach((item) => {
        if (!grouped[item.accountType]) {
          grouped[item.accountType] = {
            accountType: item.accountType,
            itemCount: 0,
          };
        }

        grouped[item.accountType].itemCount += 1;
      });

      // Convert to array and add description and percentage
      const totalItems = items.length;
      return Object.values(grouped).map((group) => ({
        ...group,
        description: getAccountTypeDescription(group.accountType),
        percentage: Math.round((group.itemCount / totalItems) * 100),
      }));
    });

    // Computed property for grouped items in modal
    const modalGroupedItems = computed(() => {
      if (!selectedChallanForModal.value) return [];

      const items = selectedChallanForModal.value.items;
      const grouped: Record<string, GroupedItem> = {};

      items.forEach((item) => {
        if (!grouped[item.accountType]) {
          grouped[item.accountType] = {
            accountType: item.accountType,
            itemCount: 0,
          };
        }

        grouped[item.accountType].itemCount += 1;
      });

      return Object.values(grouped);
    });

    // Computed property for modal items
    const modalItems = computed(() => {
      if (!selectedChallanForModal.value) return [];
      return selectedChallanForModal.value.items;
    });

    // Computed property for total items
    const totalItems = computed(() => {
      if (!selectedChallan.value) return 0;
      return selectedChallan.value.items.length;
    });

    // Computed property for modal total items
    const modalTotalItems = computed(() => {
      if (!selectedChallanForModal.value) return 0;
      return selectedChallanForModal.value.items.length;
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

    // Get account type description
    const getAccountTypeDescription = (accountType: string) => {
      const descriptions: Record<string, string> = {
        SB: "Savings Account",
        CD: "Current Account",
        PO: "Payment Order",
        DD: "Demand Draft",
        CC: "Credit Card",
        OD: "Overdraft",
      };

      return descriptions[accountType] || accountType;
    };

    // Load all challans on component mount
    onMounted(() => {
      loadAllChallans();
    });

    // Load all challans
    const loadAllChallans = () => {
      loading.value = true;

      // In a real application, this would be an API call
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        challans.value = generateMockChallans();
        loading.value = false;
      }, 1000);
    };

    // Search for challans
    const searchChallans = () => {
      loading.value = true;

      // In a real application, this would be an API call with filters
      // For demo purposes, we'll just reload the mock data
      setTimeout(() => {
        challans.value = generateMockChallans();
        loading.value = false;

        // Reset selection
        selectedChallan.value = null;
      }, 1000);
    };

    // Generate mock challans for demonstration
    const generateMockChallans = (): Challan[] => {
      const banks = ["National Bank", "City Bank", "Metro Bank", "Global Bank"];

      const branches = [
        "Main Branch",
        "North Branch",
        "South Branch",
        "East Branch",
        "West Branch",
      ];

      const couriers = [
        "Express Courier",
        "Fast Delivery",
        "Secure Post",
        "Quick Ship",
      ];

      // Generate 10-20 challans
      const count = Math.floor(Math.random() * 11) + 10;

      return Array.from({ length: count }, (_, i) => {
        const bankName =
          bankFilter.value || banks[Math.floor(Math.random() * banks.length)];
        const branchName =
          branchFilter.value ||
          branches[Math.floor(Math.random() * branches.length)];
        const receivingBranch =
          branches[Math.floor(Math.random() * branches.length)];
        const courierName =
          couriers[Math.floor(Math.random() * couriers.length)];

        // Generate 1-3 requisition numbers
        const reqCount = Math.floor(Math.random() * 3) + 1;
        const requisitionNumbers = Array.from(
          { length: reqCount },
          (_, j) => `REQ-${2023}-${1000 + i * 10 + j}`
        );

        // Generate challan date
        let challanDateStr = new Date();
        if (challanDate.value) {
          challanDateStr = challanDate.value.toDate();
        } else {
          // Random date in the last 30 days
          const daysAgo = Math.floor(Math.random() * 30);
          challanDateStr = new Date();
          challanDateStr.setDate(challanDateStr.getDate() - daysAgo);
        }

        // Generate items
        const itemCount = Math.floor(Math.random() * 16) + 5; // 5-20 items
        const items = generateMockItems(itemCount, requisitionNumbers);

        return {
          id: i + 1,
          sl: i + 1,
          challanNumber: `CH-${2023}${String(i + 1).padStart(4, "0")}`,
          challanDate: challanDateStr.toISOString(),
          bankName,
          branchName,
          courierName,
          trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`,
          requisitionNumbers,
          receivingBranch,
          items,
        };
      });
    };

    // Generate mock items for a challan
    const generateMockItems = (
      count: number,
      requisitionNumbers: string[]
    ): ChallanItem[] => {
      const accountTypes = ["SB", "CD", "PO", "DD", "CC", "OD"];

      return Array.from({ length: count }, (_, i) => {
        const accountType =
          accountTypes[Math.floor(Math.random() * accountTypes.length)];
        const requisitionNo =
          requisitionNumbers[
            Math.floor(Math.random() * requisitionNumbers.length)
          ];

        return {
          id: i + 1,
          sl: i + 1,
          requisitionNo,
          accountName: `Account Holder ${i + 1}`,
          accountNo: `AC-${100000 + i}`,
          chequeSerialNo: `${1000 + i * 100} - ${1099 + i * 100}`,
          leavesQuantity: (Math.floor(Math.random() * 5) + 1) * 10,
          bookQuantity: Math.floor(Math.random() * 5) + 1,
          accountType,
        };
      });
    };

    // Select a challan
    const selectChallan = (challan: Challan) => {
      selectedChallan.value = challan;
    };

    // View challan details
    const viewChallanDetails = (challan: Challan) => {
      selectedChallanForModal.value = challan;
      detailsModalVisible.value = true;
    };

    // Print challan
    const printChallan = (challan: Challan) => {
      message.success(`Printing Challan: ${challan.challanNumber}`);
      // In a real application, this would trigger a print function
    };

    // Print selected challan from modal
    const printSelectedChallan = () => {
      if (!selectedChallanForModal.value) return;
      message.success(
        `Printing Challan: ${selectedChallanForModal.value.challanNumber}`
      );
      // In a real application, this would trigger a print function
    };

    // Export to Excel
    const exportToExcel = () => {
      if (!selectedChallan.value) {
        message.warning("Please select a challan to export");
        return;
      }

      message.success(
        `Exporting Challan ${selectedChallan.value.challanNumber} to Excel with summary`
      );

      // In a real application, this would trigger an Excel export with the summary
      // The summary would include the format: "SB (10) = 10" for each account type
      // and the total count

      const summaryData = groupedItems.value.map((item) => ({
        AccountType: item.accountType,
        Count: `${item.accountType} (${item.itemCount}) = ${item.itemCount}`,
      }));

      // Add total row
      summaryData.push({
        AccountType: "Total",
        Count: `Total Items: ${totalItems.value}`,
      });

      console.log("Excel Export Summary Data:", summaryData);
    };

    // Export selected challan from modal
    const exportSelectedChallan = () => {
      if (!selectedChallanForModal.value) return;
      message.success(
        `Exporting Challan ${selectedChallanForModal.value.challanNumber} to Excel with summary`
      );

      // Similar to the exportToExcel function but for the modal
      const summaryData = modalGroupedItems.value.map((item) => ({
        AccountType: item.accountType,
        Count: `${item.accountType} (${item.itemCount}) = ${item.itemCount}`,
      }));

      // Add total row
      summaryData.push({
        AccountType: "Total",
        Count: `Total Items: ${modalTotalItems.value}`,
      });

      console.log("Excel Export Summary Data (Modal):", summaryData);
    };

    return {
      // Filter state
      bankFilter,
      branchFilter,
      requestDate,
      challanNumberFilter,
      challanDate,

      // Table state
      loading,
      challans,
      filteredChallans,
      selectedChallan,
      columns,
      accountTypeColumns,
      itemColumns,

      // Modal state
      detailsModalVisible,
      selectedChallanForModal,
      modalItems,
      modalGroupedItems,

      // Computed properties
      groupedItems,
      totalItems,
      modalTotalItems,

      // Methods
      formatDate,
      searchChallans,
      selectChallan,
      viewChallanDetails,
      printChallan,
      printSelectedChallan,
      exportToExcel,
      exportSelectedChallan,
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
  background-color: #f0f7ff;
}

.custom-table :deep(.ant-table-tbody > tr.bg-blue-50 > td) {
  background-color: #eff6ff;
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

/* Summary row styles */
.custom-table :deep(.ant-table-summary) {
  background-color: #f0f7ff;
}

.custom-table :deep(.ant-table-summary-cell) {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}
</style>
