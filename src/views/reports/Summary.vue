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
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <FileTextOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Branch Wise</span> Bill Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive branch wise bill reports for cheque
              requisitions by date range and bank.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Current Date">
              <div
                class="bg-card border border-gray-200 rounded-md px-4 py-2 flex items-center"
              >
                <CalendarOutlined class="mr-2 text-accent" />
                {{ currentDate }}
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="mx-auto py-6">
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FilterOutlined class="mr-2 text-accent" /> Report Filters
          </h2>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handlePreview">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- Start Date -->
              <a-form-item
                label="Start Date"
                name="startDate"
                :rules="[
                  { required: true, message: 'Please select start date' },
                ]"
              >
                <a-date-picker
                  v-model:value="formState.startDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select start date"
                />
              </a-form-item>

              <!-- End Date -->
              <a-form-item
                label="End Date"
                name="endDate"
                :rules="[{ required: true, message: 'Please select end date' }]"
              >
                <a-date-picker
                  v-model:value="formState.endDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select end date"
                />
              </a-form-item>

              <!-- Agent Type -->
              <a-form-item label="AgentType" name="agentType">
                <a-select
                  v-model:value="formState.agentType"
                  placeholder="Select Type"
                  class="w-full"
                >
                  <a-select-option :value="null">Select Type</a-select-option>
                  <a-select-option :value="true">Agent Type</a-select-option>
                  <a-select-option :value="false"
                    >Non-Agent Type</a-select-option
                  >
                </a-select>
              </a-form-item>

              <!-- Bank ID -->
              <a-form-item
                label="Bank"
                name="bankId"
                :rules="[{ required: true, message: 'Please select a bank' }]"
              >
                <a-select
                  v-model:value="formState.bankId"
                  placeholder="Select bank"
                  @change="handleBankChange"
                  class="w-full"
                >
                  <a-select-option value="">Select Bank</a-select-option>
                  <a-select-option
                    v-for="bank in banks"
                    :key="bank.id"
                    :value="bank.id"
                  >
                    {{ bank.bankName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-4 pt-6 border-t border-gray-100"
            >
              <a-button
                @click="resetForm"
                size="large"
                class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent flex items-center"
              >
                <ReloadOutlined class="mr-2" /> Reset
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :loading="isLoading"
                class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
              >
                <DownloadOutlined class="mr-2" /> Download Report
              </a-button>
            </div>
          </a-form>
        </div>
      </div>

      <!-- Help Card -->
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6 mb-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Report Information</h3>
            <p class="text-sm text-secondary">
              This report shows a summary of cheque requisitions including
              branch details, challan information, and denomination breakdowns
              for the selected date range and bank.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <a-modal
      v-model:visible="previewModalVisible"
      :footer="null"
      style="top: 20px"
      title="Summary Report Preview"
      width="1200px"
      class="preview-modal"
      :maskClosable="false"
    >
      <div class="space-y-6 py-2">
        <!-- Report Header -->
        <div class="bg-background p-5 rounded-md border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-primary flex items-center">
              <FileTextOutlined class="mr-2 text-accent" /> Report Branch Wise
              Bill
            </h3>
            <div class="text-sm text-secondary">
              {{ dayjs(formState.startDate)?.format("YYYY-MM-DD") }} to
              {{ dayjs(formState.endDate)?.format("YYYY-MM-DD") }}
            </div>
          </div>

          <!-- Summary Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Sl No
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Home Branch
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Courier Name
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Requestion Date
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Delivery Branch
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Challan No
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    Challan Date
                  </th>
                  <th
                    v-for="col in activeColumns"
                    :key="col.key"
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    {{ col.label }}
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-900"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in reportData"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ index + 1 }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{
                      item.isAgent && formState.bankId === 2
                        ? `B- ${item.homeBranch} (${
                            item.deliveryBranch?.slice(-7) || ""
                          })`
                        : item.homeBranch
                    }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.courierName }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.requestDate }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.deliveryBranch }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.challanNo }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    {{ item.challanDate }}
                  </td>
                  <td
                    v-for="col in activeColumns"
                    :key="col.key"
                    class="border border-gray-300 px-3 py-2 text-sm text-center"
                  >
                    {{ item[col.key] }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-medium"
                  >
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-100 font-medium">
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm"
                    colspan="6"
                  ></td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm font-bold"
                  >
                    Grand Total
                  </td>
                  <td
                    v-for="col in activeColumns"
                    :key="col.key"
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals[col.key] }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-sm text-center font-bold"
                  >
                    {{ totals.grandTotal }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div
          class="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-200"
        >
          <a-button
            @click="previewModalVisible = false"
            size="large"
            class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent"
          >
            Close
          </a-button>
          <a-button
            type="primary"
            @click="downloadExcel"
            :loading="isDownloading"
            size="large"
            class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
          >
            <DownloadOutlined v-if="!isDownloading" class="mr-2" />
            {{ isDownloading ? "Generating..." : "Download Excel" }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import signatureImage from "@/assets/signature.png";
import { getSummaryReportService } from "@/services/summary-report/summaryReportService";
import {
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { computed, onMounted, reactive, ref } from "vue";
import { getBankForBranchService } from "../../services/bank/bank.service";

interface Bank {
  id: number;
  bankName: string;
}

const banks = ref<Bank[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  }
};

interface ReportItem {
  homeBranch: string;
  deliveryBranch: string;
  challanNo: string;
  challanDate: string;
  courierName: string;
  requestDate: string;
  isAgent: boolean;
  distId?: string;
  consb10: number;
  islmsb10: number;
  consb20: number;
  islmsb20: number;
  consb25: number;
  islmsb25: number;
  consba10: number;
  conmsd10: number;
  conmsa10: number;
  conmsa20: number;
  conmsd50: number;
  concd10: number;
  concd20: number;
  concd25: number;
  islmcd25: number;
  concd50: number;
  islmcd50: number;
  concd100: number;
  conacd25: number;
  conacd50: number;
  conacd100: number;
  concda25: number;
  conawcd25: number;
  conawca20: number;
  conawca50: number;
  conawca100: number;
  // msna50: number;
  // msna100: number;
  consna25: number;
  consnd25: number;
  consnd50: number;
  consnd100: number;
  conmsnd25: number;
  conpo50: number;
  conpo100: number;
  conpoa50: number;
  conpoi50: number;
  conca50: number;
  conca100: number;
  confdr50: number;
  confdr100: number;
  conmtdr25: number;
  conmtdr50: number;
  conv5: number;
  conv10: number;
  conv20: number;
  conv50: number;
  islm5: number;
  islm10: number;
  islm20: number;
  islm50: number;
  prio10: number;
  prio20: number;
  prio50: number;
  total: number;
  totalLeaves: number;
}

interface Totals {
  consb10: number;
  islmsb10: number;
  consb20: number;
  islmsb20: number;
  consb25: number;
  islmsb25: number;
  consba10: number;
  conmsd10: number;
  conmsa10: number;
  conmsa20: number;
  conmsd50: number;
  concd10: number;
  concd20: number;
  concd25: number;
  islmcd25: number;
  concd50: number;
  islmcd50: number;
  concd100: number;
  conacd25: number;
  conacd50: number;
  conacd100: number;
  concda25: number;
  conawcd25: number;
  conawca20: number;
  conawca50: number;
  conawca100: number;
  // msna50: number;
  // msna100: number;
  consna25: number;
  consnd25: number;
  consnd50: number;
  consnd100: number;
  conmsnd25: number;
  conpo50: number;
  conpo100: number;
  conpoa50: number;
  conpoi50: number;
  conca50: number;
  conca100: number;
  confdr50: number;
  confdr100: number;
  conmtdr25: number;
  conmtdr50: number;
  conv5: number;
  conv10: number;
  conv20: number;
  conv50: number;
  islm5: number;
  islm10: number;
  islm20: number;
  islm50: number;
  prio10: number;
  prio20: number;
  prio50: number;
  grandTotal: number;
  grandTotalLeaves: number;
}

// Current date for display
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Form state
const formState = reactive({
  startDate: dayjs().startOf("month"), // বর্তমান মাসের প্রথম দিন
  endDate: dayjs(),
  bankId: null as number | null,
  agentType: null as boolean | null,
});

// Modal and loading states
const previewModalVisible = ref(false);
const isLoading = ref(false);
const isDownloading = ref(false);

// Report data
const reportData = ref<ReportItem[]>([]);

// Calculate totals
const totals = computed((): Totals => {
  const data = reportData.value;
  return {
    consb10: data.reduce((sum, item) => sum + item.consb10, 0),
    islmsb10: data.reduce((sum, item) => sum + item.islmsb10, 0),
    consb20: data.reduce((sum, item) => sum + item.consb20, 0),
    islmsb20: data.reduce((sum, item) => sum + item.islmsb20, 0),
    consb25: data.reduce((sum, item) => sum + item.consb25, 0),
    islmsb25: data.reduce((sum, item) => sum + item.islmsb25, 0),
    consba10: data.reduce((sum, item) => sum + item.consba10, 0),
    conmsd10: data.reduce((sum, item) => sum + item.conmsd10, 0),
    conmsa10: data.reduce((sum, item) => sum + item.conmsa10, 0),
    conmsa20: data.reduce((sum, item) => sum + item.conmsa20, 0),
    conmsd50: data.reduce((sum, item) => sum + item.conmsd50, 0),
    concd10: data.reduce((sum, item) => sum + item.concd10, 0),
    concd20: data.reduce((sum, item) => sum + item.concd20, 0),
    concd25: data.reduce((sum, item) => sum + item.concd25, 0),
    islmcd25: data.reduce((sum, item) => sum + item.islmcd25, 0),
    concd50: data.reduce((sum, item) => sum + item.concd50, 0),
    islmcd50: data.reduce((sum, item) => sum + item.islmcd50, 0),
    concd100: data.reduce((sum, item) => sum + item.concd100, 0),
    conacd25: data.reduce((sum, item) => sum + item.conacd25, 0),
    conacd50: data.reduce((sum, item) => sum + item.conacd50, 0),
    conacd100: data.reduce((sum, item) => sum + item.conacd100, 0),
    concda25: data.reduce((sum, item) => sum + item.concda25, 0),
    conawcd25: data.reduce((sum, item) => sum + item.conawcd25, 0),
    conawca20: data.reduce((sum, item) => sum + item.conawca20, 0),
    conawca50: data.reduce((sum, item) => sum + item.conawca50, 0),
    conawca100: data.reduce((sum, item) => sum + item.conawca100, 0),
    // msna50: data.reduce((sum, item) => sum + item.msna50, 0),
    // msna100: data.reduce((sum, item) => sum + item.msna100, 0),
    consna25: data.reduce((sum, item) => sum + item.consna25, 0),
    consnd25: data.reduce((sum, item) => sum + item.consnd25, 0),
    consnd50: data.reduce((sum, item) => sum + item.consnd50, 0),
    consnd100: data.reduce((sum, item) => sum + item.consnd100, 0),
    conmsnd25: data.reduce((sum, item) => sum + item.conmsnd25, 0),
    conpo50: data.reduce((sum, item) => sum + item.conpo50, 0),
    conpo100: data.reduce((sum, item) => sum + item.conpo100, 0),
    conpoa50: data.reduce((sum, item) => sum + item.conpoa50, 0),
    conpoi50: data.reduce((sum, item) => sum + item.conpoi50, 0),
    conca50: data.reduce((sum, item) => sum + item.conca50, 0),
    conca100: data.reduce((sum, item) => sum + item.conca100, 0),
    confdr50: data.reduce((sum, item) => sum + item.confdr50, 0),
    confdr100: data.reduce((sum, item) => sum + item.confdr100, 0),
    conmtdr25: data.reduce((sum, item) => sum + item.conmtdr25, 0),
    conmtdr50: data.reduce((sum, item) => sum + item.conmtdr50, 0),
    conv5: data.reduce((sum, item) => sum + item.conv5, 0),
    conv10: data.reduce((sum, item) => sum + item.conv10, 0),
    conv20: data.reduce((sum, item) => sum + item.conv20, 0),
    conv50: data.reduce((sum, item) => sum + item.conv50, 0),
    islm5: data.reduce((sum, item) => sum + item.islm5, 0),
    islm10: data.reduce((sum, item) => sum + item.islm10, 0),
    islm20: data.reduce((sum, item) => sum + item.islm20, 0),
    islm50: data.reduce((sum, item) => sum + item.islm50, 0),
    prio10: data.reduce((sum, item) => sum + item.prio10, 0),
    prio20: data.reduce((sum, item) => sum + item.prio20, 0),
    prio50: data.reduce((sum, item) => sum + item.prio50, 0),
    grandTotal: data.reduce((sum, item) => sum + item.total, 0),
    grandTotalLeaves: data.reduce((sum, item) => sum + item.totalLeaves, 0),
  };
});

type ReportColumnKey =
  | "consb10"
  | "islmsb10"
  | "consb20"
  | "islmsb20"
  | "consb25"
  | "islmsb25"
  | "consba10"
  | "conmsd10"
  | "conmsa10"
  | "conmsa20"
  | "conmsd50"
  | "concd10"
  | "concd20"
  | "concd25"
  | "islmcd25"
  | "concd50"
  | "islmcd50"
  | "concd100"
  | "conacd25"
  | "conacd50"
  | "conacd100"
  | "concda25"
  | "conawcd25"
  | "conawca20"
  | "conawca50"
  | "conawca100"
  | "consna25"
  | "consnd25"
  | "consnd50"
  | "consnd100"
  | "conmsnd25"
  | "conpo50"
  | "conpo100"
  | "conpoa50"
  | "conpoi50"
  | "conca50"
  | "conca100"
  | "confdr50"
  | "confdr100"
  | "conmtdr25"
  | "conmtdr50"
  | "conv5"
  | "conv10"
  | "conv20"
  | "conv50"
  | "islm5"
  | "islm10"
  | "islm20"
  | "islm50"
  | "prio10"
  | "prio20"
  | "prio50";
let conditionalHeaders: { key: ReportColumnKey; label: string }[];
const handleBankChange = () => {
  if (formState.bankId === 8) {
    conditionalHeaders = [
      { key: "conv5", label: "Conv(5)" },
      { key: "conv10", label: "Conv(10)" },
      { key: "conv20", label: "Conv(20)" },
      { key: "conv50", label: "Conv(50)" },
      { key: "islm5", label: "ISLM(5)" },
      { key: "islm10", label: "ISLM(10)" },
      { key: "islm20", label: "ISLM(20)" },
      { key: "islm50", label: "ISLM(50)" },
      { key: "prio10", label: "Prio(10)" },
      { key: "prio20", label: "Prio(20)" },
      { key: "prio50", label: "Prio(50)" },
      { key: "conpo100", label: "PO(100)" },
    ];
  } else {
    conditionalHeaders = [
      { key: "consb10", label: "Gen-SB(10)" },
      { key: "consb20", label: "Gen-SB(20)" },
      { key: "consb25", label: "Gen-SB(25)" },
      { key: "concd10", label: "Gen-CD(10)" },
      { key: "concd25", label: "Gen-CD(25)" },
      { key: "concd50", label: "Gen-CD(50)" },
      { key: "concd100", label: "Gen-CD(100)" },
      { key: "conacd25", label: "Gen-ACD(25)" },
      { key: "conacd50", label: "Gen-ACD(50)" },
      { key: "conacd100", label: "Gen-ACD(100)" },
      { key: "concda25", label: "Gen-CDA(25)" },
      { key: "conawcd25", label: "Gen-AWCD(25)" },
      { key: "conawca20", label: "Gen-AWCA(20)" },
      { key: "conawca50", label: "Gen-AWCA(50)" },
      { key: "conawca100", label: "Gen-AWCA(100)" },
      { key: "consna25", label: "Gen-SNA(25)" },
      { key: "consnd25", label: "Gen-SND(25)" },
      { key: "consnd50", label: "Gen-SND(50)" },
      { key: "consnd100", label: "Gen-SND(100)" },
      { key: "conmsnd25", label: "Gen-MSND(25)" },
      { key: "conpo50", label: "Gen-PO(50)" },
      { key: "conpo100", label: "Gen-PO(100)" },
      { key: "conpoa50", label: "Gen-POA(50)" },
      { key: "conpoi50", label: "Gen-POI(50)" },
      { key: "conca50", label: "Gen-CA(50)" },
      { key: "conca100", label: "Gen-CA(100)" },
      { key: "confdr50", label: "Gen-FDR(50)" },
      { key: "confdr100", label: "Gen-FDR(100)" },
      { key: "conmtdr25", label: "Gen-MTDR(25)" },
      { key: "conmtdr50", label: "Gen-MTDR(50)" },
      { key: "islmsb10", label: "ISLM-SB(10)" },
      { key: "islmsb20", label: "ISLM-SB(20)" },
      { key: "islmsb25", label: "ISLM-SB(25)" },
      { key: "islmcd25", label: "ISLM-CD(25)" },
      { key: "islmcd50", label: "ISLM-CD(50)" },
    ];
  }
};

const activeColumns = computed(() => {
  return conditionalHeaders.filter((h) => totals.value[h.key] > 0);
});

// Handle preview
const handlePreview = async () => {
  if (!formState.startDate || !formState.endDate || !formState.bankId) {
    message.error("Please fill all required fields");
    return;
  }

  if (dayjs(formState.startDate).isAfter(dayjs(formState.endDate))) {
    message.error("Start date cannot be after end date");
    return;
  }

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const stDate = formState.startDate.format("YYYY-MM-DD");
    const enDate = formState.endDate.format("YYYY-MM-DD");
    const params = {
      bankId: formState.bankId,
      startDate: stDate,
      endDate: enDate,
      severity: 1,
      agentType: formState.agentType,
    };
    // Generate mock data
    const response = await getSummaryReportService(params);
    if (response.success == true) {
      // alert(response.success);
      // console.log(response.data);
      reportData.value = response.data.summaryReports;
      reportData.value.sort((a, b) => {
        const branchCompare = a.deliveryBranch.localeCompare(b.deliveryBranch);

        if (branchCompare !== 0) {
          return branchCompare;
        }

        const distA = (a.distId ?? "").trim();
        const distB = (b.distId ?? "").trim();

        // Empty distId first
        if (distA === "" && distB !== "") return -1;
        if (distA !== "" && distB === "") return 1;

        return distA.localeCompare(distB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      if (reportData.value.length === 0) {
        message.warning("No data found for the selected options");
        return;
      } else {
        downloadExcel();
        message.success("Report generated successfully");
      }
    } else {
      message.error("Failed to generate report");
    }
    // reportData.value = generateMockData();

    previewModalVisible.value = false;
  } catch (error) {
    message.error("Failed to generate report");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  featchBanks();
});
// Download Excel
const downloadExcel = async () => {
  isDownloading.value = true;
  try {
    const signatureImageBase64 = await toBase64(signatureImage);
    // Get selected bank name
    const selectedBank = banks.value.find(
      (bank) => bank.id === formState.bankId,
    );
    const bankName = selectedBank?.bankName || "Unknown Bank";

    const start = dayjs(formState.startDate);
    const end = dayjs(formState.endDate);

    let dateRange = "";
    let dateRangeLabel = "";

    if (start && end) {
      const sameDay = start.isSame(end, "day");

      if (sameDay) {
        dateRange = start.format("D MMMM YYYY");
        dateRangeLabel = start.format("DD-MM-YYYY");
      } else {
        dateRange = `${start.format("D MMMM YYYY")} to ${end.format(
          "D MMMM YYYY",
        )}`;
        dateRangeLabel = `${start.format("DD-MM-YYYY")}_to_${end.format(
          "DD-MM-YYYY",
        )}`;
      }
    }

    // Create workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Branch Wise Bill Report");
    sheet.pageSetup = {
      paperSize: 9, // 9 = A4 size in ExcelJS
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0, // Let it flow vertically
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    // Styles
    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    } as const;

    const headerStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: "center" },
    };

    const cellStyle = {
      border: borderStyle,
      alignment: { horizontal: "center", vertical: "middle" },
    };

    // Heading: Bank Name
    sheet.mergeCells("A3:I3");
    const bankCell = sheet.getCell("B3");
    bankCell.value = `${bankName}`;
    bankCell.font = { bold: true, size: 16 };
    bankCell.alignment = { horizontal: "center" };
    // Heading: Bank Name
    sheet.mergeCells("A4:I4");
    const reportTypeCell = sheet.getCell("B4");
    reportTypeCell.value = `Report: Branch Wise Summary`;
    reportTypeCell.font = { bold: true, size: 16 };
    reportTypeCell.alignment = { horizontal: "center" };

    // Heading: Date Range
    sheet.mergeCells("A5:I5");
    const dateCell = sheet.getCell("B5");
    dateCell.value = `Requistion Date: ${dateRange}`;
    dateCell.font = { bold: true, size: 14 };
    dateCell.alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow([]);

    // Table Header
    const tableHeaders = [
      "Sl No",
      "Delivery Branch",
      ...conditionalHeaders
        .filter((h) => totals.value[h.key] > 0)
        .map((h) => h.label),
      "Total Books",
      "Total Leaves",
    ];
    // const activeColumns = conditionalHeaders.filter(
    //   (h) => totals.value[h.key] > 0
    // );

    const headerRow = sheet.addRow(tableHeaders);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Data rows
    reportData.value.forEach((item, index) => {
      const distId = (item.distId ?? "").trim();
      const row = sheet.addRow([
        index + 1,
        `${item.deliveryBranch} ${distId !== "" ? "(" + distId + ")" : ""}`,
        ...activeColumns.value.map((h) => item[h.key]),
        item.total,
        item.totalLeaves,
      ]);

      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: "left", vertical: "middle" };
      });
    });

    // Totals row
    const totalsRow = sheet.addRow([
      "",
      "Grand Total",
      ...activeColumns.value.map((h) => totals.value[h.key]), // ✅ dynamically get totals
      totals.value.grandTotal,
      totals.value.grandTotalLeaves,
    ]);

    totalsRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add spacing row after total
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    // Underline row first (will appear above the text visually)
    const underlineRow = sheet.addRow([]);
    const sigCol = 2; // B column
    underlineRow.getCell(sigCol).border = {
      bottom: { style: "thin" }, // creates the line
    };

    // Now the "Authorized Signature" text
    const sigRow = sheet.addRow([]);
    sigRow.getCell(sigCol).value = "Authorized Signature";
    sigRow.getCell(sigCol).font = { bold: true };
    sigRow.getCell(sigCol).alignment = { horizontal: "left" };

    const signatureImageId = workbook.addImage({
      base64: signatureImageBase64,
      extension: "png",
    });

    sheet.addImage(signatureImageId, {
      tl: { col: 1, row: sigRow.number - 4 }, // Slightly above the text row
      ext: { width: 150, height: 50 },
    });

    // Set column widths
    const columnWidths = [
      8, 30, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20,
    ];
    sheet.columns.forEach((col, index) => {
      col.width = columnWidths[index];
    });
    sheet.eachRow((row) => {
      row.height = 25;
    });

    // Generate filename
    const filename = `${dateRangeLabel}_Branch_Wise_Bill_Report_${bankName.replace(
      /\s+/g,
      "_",
    )}_${formState.agentType ? "Agent" : ""}.xlsx`;

    // Create blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Check if browser supports File System Access API (Chrome/Edge)
    if ("showSaveFilePicker" in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: "Excel files",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        message.success("Excel file saved successfully");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          fallbackDownload(blob, filename);
        }
      }
    } else {
      fallbackDownload(blob, filename);
    }
    previewModalVisible.value = false;
  } catch (error) {
    message.error("Failed to download Excel file");
    console.error("Excel download error:", error);
  } finally {
    isDownloading.value = false;
  }
};
// To Base 64 function
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
        }),
    );
};

// Fallback download function
const fallbackDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Force download attribute and trigger click
  link.setAttribute("download", filename);
  link.style.display = "none";

  // Add to DOM, click, and remove
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);

  message.success("Excel file download initiated");
};

// Reset form
const resetForm = () => {
  formState.startDate = dayjs().startOf("month"); // বর্তমান মাসের প্রথম দিন
  formState.endDate = dayjs();
  formState.bankId = null;
  reportData.value = [];
  message.success("Form has been reset");
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-input-affix-wrapper),
:deep(.ant-textarea) {
  border-radius: var(--radius-md) !important;
  transition: all 0.3s;
  border-color: #e2e8f0;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border-radius: 0 !important;
}

:deep(.ant-btn) {
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

:deep(.ant-btn-primary) {
  background-color: #6b8e23;
  border-color: #6b8e23;
}

:deep(.ant-btn-primary:hover) {
  background-color: #5a7a1f;
  border-color: #5a7a1f;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-textarea-focused) {
  border-color: #6b8e23 !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-textarea:hover) {
  border-color: #6b8e23 !important;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

:deep(.ant-modal-content) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: #374151;
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: #6b7280;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-select-item) {
  padding: 8px 12px;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.05);
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.1);
  font-weight: 500;
}

/* Table styling */
.preview-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}

/* Custom CSS variables for consistent theming */
:root {
  --radius-md: 6px;
  --radius-lg: 8px;
  --accent-cta: #6b8e23;
  --accent-dark: #5a7a1f;
  --text-primary: #374151;
  --text-secondary: #6b7280;
  --card-bg: #ffffff;
  --background: #f9fafb;
}
</style>
