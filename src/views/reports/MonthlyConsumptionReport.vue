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
                <span class="text-accent">Consumption</span> Report
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Generate comprehensive Consumption Reports for item of books by
              date range and bank.
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
    <div class="py-6">
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FilterOutlined class="mr-2 text-accent" /> Report Filters
          </h2>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handleDownload">
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
                  :disabled-date="disabledStartDate"
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
                  :disabled-date="disabledEndDate"
                />
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
                  class="w-full"
                  :loading="banksLoading"
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
              <!-- Severity -->
              <a-form-item label="Severity" name="severity">
                <a-select
                  v-model:value="formState.severity"
                  placeholder="Select severity"
                  class="w-full"
                >
                  <a-select-option :value="null"
                    >Select Severity</a-select-option
                  >
                  <a-select-option :value="1">Urgent</a-select-option>
                  <a-select-option :value="2">Normal</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-4 pt-6 border-t border-gray-100"
            >
              <a-button @click="resetForm" size="large" class="rounded-md px-6">
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
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Report Information</h3>
            <p class="text-sm text-secondary">
              This report shows a consumption report for item of books including
              book leaves and denomination breakdowns for the selected date
              range and bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConsumptionReportService } from "@/services/summary-report/summaryReportService";
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
import logoImage from "@/assets/logo_text.png";

interface Bank {
  id: number;
  bankName: string;
}
const banks = ref<Bank[]>([]);
const banksLoading = ref(false);

const featchBanks = async () => {
  banksLoading.value = true;
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
    message.error("Failed to load banks");
  } finally {
    banksLoading.value = false;
  }
};

interface ReportItem {
  requestDate: string;
  csbcd5Books: number;
  csbcd5Leaves: number;
  csbcd10Books: number;
  csbcd10Leaves: number;
  csbcd20Books: number;
  csbcd20Leaves: number;
  csbcd50Books: number;
  csbcd50Leaves: number;
  isbcd5Books: number;
  isbcd5Leaves: number;
  isbcd10Books: number;
  isbcd10Leaves: number;
  isbcd20Books: number;
  isbcd20Leaves: number;
  isbcd50Books: number;
  isbcd50Leaves: number;
  psbcd10Books: number;
  psbcd10Leaves: number;
  psbcd20Books: number;
  psbcd20Leaves: number;
  psbcd50Books: number;
  psbcd50Leaves: number;
  conSb10Books: number;
  conSb10Leaves: number;
  conSb20Books: number;
  conSb20Leaves: number;
  conSb25Books: number;
  conSb25Leaves: number;
  islmSb10Books: number;
  islmSb10Leaves: number;
  islmSb20Books: number;
  islmSb20Leaves: number;
  islmSb25Books: number;
  islmSb25Leaves: number;
  conSba10Books: number;
  conSba10Leaves: number;
  conMsa10Books: number;
  conMsa10Leaves: number;
  conMsa20Books: number;
  conMsa20Leaves: number;
  conMsd10Books: number;
  conMsd10Leaves: number;
  conMsd50Books: number;
  conMsd50Leaves: number;
  conCd10Books: number;
  conCd10Leaves: number;
  conCd25Books: number;
  conCd25Leaves: number;
  conCd50Books: number;
  conCd50Leaves: number;
  islmCd25Books: number;
  islmCd25Leaves: number;
  islmCd50Books: number;
  islmCd50Leaves: number;
  conCd100Books: number;
  conCd100Leaves: number;
  conCc50Books: number;
  conCc50Leaves: number;
  conCc100Books: number;
  conCc100Leaves: number;
  conCda25Books: number;
  conCda25Leaves: number;
  conAcd25Books: number;
  conAcd25Leaves: number;
  conAcd50Books: number;
  conAcd50Leaves: number;
  conAcd100Books: number;
  conAcd100Leaves: number;
  conAwca20Books: number;
  conAwca20Leaves: number;
  conAwca50Books: number;
  conAwca50Leaves: number;
  conAwca100Books: number;
  conAwca100Leaves: number;
  conAwcd25Books: number;
  conAwcd25Leaves: number;
  conSna25Books: number;
  conSna25Leaves: number;
  conSnd25Books: number;
  conSnd25Leaves: number;
  conSnd50Books: number;
  conSnd50Leaves: number;
  conSnd100Books: number;
  conSnd100Leaves: number;
  conMsnd25Books: number;
  conMsnd25Leaves: number;
  conPo50Books: number;
  conPo50Leaves: number;
  conPo100Books: number;
  conPo100Leaves: number;
  conPoa50Books: number;
  conPoa50Leaves: number;
  conPoi50Books: number;
  conPoi50Leaves: number;
  conFdr50Books: number;
  conFdr50Leaves: number;
  conFdr100Books: number;
  conFdr100Leaves: number;
  conMtdr25Books: number;
  conMtdr25Leaves: number;
  conMtdr50Books: number;
  conMtdr50Leaves: number;
  totalBooks: number;
  totalLeaves: number;

  [key: string]: string | number;
}

interface Totals {
  csbcd5Books: number;
  csbcd5Leaves: number;
  csbcd10Books: number;
  csbcd10Leaves: number;
  csbcd20Books: number;
  csbcd20Leaves: number;
  csbcd50Books: number;
  csbcd50Leaves: number;
  isbcd5Books: number;
  isbcd5Leaves: number;
  isbcd10Books: number;
  isbcd10Leaves: number;
  isbcd20Books: number;
  isbcd20Leaves: number;
  isbcd50Books: number;
  isbcd50Leaves: number;
  psbcd10Books: number;
  psbcd10Leaves: number;
  psbcd20Books: number;
  psbcd20Leaves: number;
  psbcd50Books: number;
  psbcd50Leaves: number;
  conSb10Books: number;
  conSb10Leaves: number;
  conSb20Books: number;
  conSb20Leaves: number;
  conSb25Books: number;
  conSb25Leaves: number;
  islmSb10Books: number;
  islmSb10Leaves: number;
  islmSb20Books: number;
  islmSb20Leaves: number;
  islmSb25Books: number;
  islmSb25Leaves: number;
  conSba10Books: number;
  conSba10Leaves: number;
  conMsa10Books: number;
  conMsa10Leaves: number;
  conMsa20Books: number;
  conMsa20Leaves: number;
  conMsd10Books: number;
  conMsd10Leaves: number;
  conMsd50Books: number;
  conMsd50Leaves: number;
  conCd10Books: number;
  conCd10Leaves: number;
  conCd25Books: number;
  conCd25Leaves: number;
  conCd50Books: number;
  conCd50Leaves: number;
  islmCd25Books: number;
  islmCd25Leaves: number;
  islmCd50Books: number;
  islmCd50Leaves: number;
  conCd100Books: number;
  conCd100Leaves: number;
  conCc50Books: number;
  conCc50Leaves: number;
  conCc100Books: number;
  conCc100Leaves: number;
  conCda25Books: number;
  conCda25Leaves: number;
  conAcd25Books: number;
  conAcd25Leaves: number;
  conAcd50Books: number;
  conAcd50Leaves: number;
  conAcd100Books: number;
  conAcd100Leaves: number;
  conAwca20Books: number;
  conAwca20Leaves: number;
  conAwca50Books: number;
  conAwca50Leaves: number;
  conAwca100Books: number;
  conAwca100Leaves: number;
  conAwcd25Books: number;
  conAwcd25Leaves: number;
  conSna25Books: number;
  conSna25Leaves: number;
  conSnd25Books: number;
  conSnd25Leaves: number;
  conSnd50Books: number;
  conSnd50Leaves: number;
  conSnd100Books: number;
  conSnd100Leaves: number;
  conMsnd25Books: number;
  conMsnd25Leaves: number;
  conPo50Books: number;
  conPo50Leaves: number;
  conPo100Books: number;
  conPo100Leaves: number;
  conPoa50Books: number;
  conPoa50Leaves: number;
  conPoi50Books: number;
  conPoi50Leaves: number;
  conFdr50Books: number;
  conFdr50Leaves: number;
  conFdr100Books: number;
  conFdr100Leaves: number;
  conMtdr25Books: number;
  conMtdr25Leaves: number;
  conMtdr50Books: number;
  conMtdr50Leaves: number;
  totalBooks: number;
  totalLeaves: number;
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const formState = reactive({
  startDate: dayjs().startOf("month"), // বর্তমান মাসের প্রথম দিন
  endDate: dayjs(),
  bankId: null as number | null,
  severity: null as number | null,
});

const disabledStartDate = (current: any) => {
  if (!formState.endDate) return false;
  return current && current > dayjs(formState.endDate);
};

const disabledEndDate = (current: any) => {
  if (!formState.startDate) return false;
  return current && current < dayjs(formState.startDate);
};

const isLoading = ref(false);
const reportData = ref<ReportItem[]>([]);

const totals = computed((): Totals => {
  const data = reportData.value;
  return {
    csbcd5Books: data.reduce((sum, item) => sum + item.csbcd5Books, 0),
    csbcd5Leaves: data.reduce((sum, item) => sum + item.csbcd5Leaves, 0),
    csbcd10Books: data.reduce((sum, item) => sum + item.csbcd10Books, 0),
    csbcd10Leaves: data.reduce((sum, item) => sum + item.csbcd10Leaves, 0),
    csbcd20Books: data.reduce((sum, item) => sum + item.csbcd20Books, 0),
    csbcd20Leaves: data.reduce((sum, item) => sum + item.csbcd20Leaves, 0),
    csbcd50Books: data.reduce((sum, item) => sum + item.csbcd50Books, 0),
    csbcd50Leaves: data.reduce((sum, item) => sum + item.csbcd50Leaves, 0),
    isbcd5Books: data.reduce((sum, item) => sum + item.isbcd5Books, 0),
    isbcd5Leaves: data.reduce((sum, item) => sum + item.isbcd5Leaves, 0),
    isbcd10Books: data.reduce((sum, item) => sum + item.isbcd10Books, 0),
    isbcd10Leaves: data.reduce((sum, item) => sum + item.isbcd10Leaves, 0),
    isbcd20Books: data.reduce((sum, item) => sum + item.isbcd20Books, 0),
    isbcd20Leaves: data.reduce((sum, item) => sum + item.isbcd20Leaves, 0),
    isbcd50Books: data.reduce((sum, item) => sum + item.isbcd50Books, 0),
    isbcd50Leaves: data.reduce((sum, item) => sum + item.isbcd50Leaves, 0),
    psbcd10Books: data.reduce((sum, item) => sum + item.psbcd10Books, 0),
    psbcd10Leaves: data.reduce((sum, item) => sum + item.psbcd10Leaves, 0),
    psbcd20Books: data.reduce((sum, item) => sum + item.psbcd20Books, 0),
    psbcd20Leaves: data.reduce((sum, item) => sum + item.psbcd20Leaves, 0),
    psbcd50Books: data.reduce((sum, item) => sum + item.psbcd50Books, 0),
    psbcd50Leaves: data.reduce((sum, item) => sum + item.psbcd50Leaves, 0),
    conSb10Books: data.reduce((sum, item) => sum + item.conSb10Books, 0),
    conSb10Leaves: data.reduce((sum, item) => sum + item.conSb10Leaves, 0),
    conSb20Books: data.reduce((sum, item) => sum + item.conSb20Books, 0),
    conSb20Leaves: data.reduce((sum, item) => sum + item.conSb20Leaves, 0),
    conSb25Books: data.reduce((sum, item) => sum + item.conSb25Books, 0),
    conSb25Leaves: data.reduce((sum, item) => sum + item.conSb25Leaves, 0),
    islmSb10Books: data.reduce((sum, item) => sum + item.islmSb10Books, 0),
    islmSb10Leaves: data.reduce((sum, item) => sum + item.islmSb10Leaves, 0),
    islmSb20Books: data.reduce((sum, item) => sum + item.islmSb20Books, 0),
    islmSb20Leaves: data.reduce((sum, item) => sum + item.islmSb20Leaves, 0),
    islmSb25Books: data.reduce((sum, item) => sum + item.islmSb25Books, 0),
    islmSb25Leaves: data.reduce((sum, item) => sum + item.islmSb25Leaves, 0),
    conSba10Books: data.reduce((sum, item) => sum + item.conSba10Books, 0),
    conSba10Leaves: data.reduce((sum, item) => sum + item.conSba10Leaves, 0),
    conMsa10Books: data.reduce((sum, item) => sum + item.conMsa10Books, 0),
    conMsa10Leaves: data.reduce((sum, item) => sum + item.conMsa10Leaves, 0),
    conMsa20Books: data.reduce((sum, item) => sum + item.conMsa20Books, 0),
    conMsa20Leaves: data.reduce((sum, item) => sum + item.conMsa20Leaves, 0),
    conMsd10Books: data.reduce((sum, item) => sum + item.conMsd10Books, 0),
    conMsd10Leaves: data.reduce((sum, item) => sum + item.conMsd10Leaves, 0),
    conMsd50Books: data.reduce((sum, item) => sum + item.conMsd50Books, 0),
    conMsd50Leaves: data.reduce((sum, item) => sum + item.conMsd50Leaves, 0),
    conCd10Books: data.reduce((sum, item) => sum + item.conCd10Books, 0),
    conCd10Leaves: data.reduce((sum, item) => sum + item.conCd10Leaves, 0),
    conCd25Books: data.reduce((sum, item) => sum + item.conCd25Books, 0),
    conCd25Leaves: data.reduce((sum, item) => sum + item.conCd25Leaves, 0),
    conCd50Books: data.reduce((sum, item) => sum + item.conCd50Books, 0),
    conCd50Leaves: data.reduce((sum, item) => sum + item.conCd50Leaves, 0),
    islmCd25Books: data.reduce((sum, item) => sum + item.islmCd25Books, 0),
    islmCd25Leaves: data.reduce((sum, item) => sum + item.islmCd25Leaves, 0),
    islmCd50Books: data.reduce((sum, item) => sum + item.islmCd50Books, 0),
    islmCd50Leaves: data.reduce((sum, item) => sum + item.islmCd50Leaves, 0),
    conCd100Books: data.reduce((sum, item) => sum + item.conCd100Books, 0),
    conCd100Leaves: data.reduce((sum, item) => sum + item.conCd100Leaves, 0),
    conCc50Books: data.reduce((sum, item) => sum + item.conCc50Books, 0),
    conCc50Leaves: data.reduce((sum, item) => sum + item.conCc50Leaves, 0),
    conCc100Books: data.reduce((sum, item) => sum + item.conCc100Books, 0),
    conCc100Leaves: data.reduce((sum, item) => sum + item.conCc100Leaves, 0),
    conCda25Books: data.reduce((sum, item) => sum + item.conCda25Books, 0),
    conCda25Leaves: data.reduce((sum, item) => sum + item.conCda25Leaves, 0),
    conAcd25Books: data.reduce((sum, item) => sum + item.conAcd25Books, 0),
    conAcd25Leaves: data.reduce((sum, item) => sum + item.conAcd25Leaves, 0),
    conAcd50Books: data.reduce((sum, item) => sum + item.conAcd50Books, 0),
    conAcd50Leaves: data.reduce((sum, item) => sum + item.conAcd50Leaves, 0),
    conAcd100Books: data.reduce((sum, item) => sum + item.conAcd100Books, 0),
    conAcd100Leaves: data.reduce((sum, item) => sum + item.conAcd100Leaves, 0),
    conAwca20Books: data.reduce((sum, item) => sum + item.conAwca20Books, 0),
    conAwca20Leaves: data.reduce((sum, item) => sum + item.conAwca20Leaves, 0),
    conAwca50Books: data.reduce((sum, item) => sum + item.conAwca50Books, 0),
    conAwca50Leaves: data.reduce((sum, item) => sum + item.conAwca50Leaves, 0),
    conAwca100Books: data.reduce((sum, item) => sum + item.conAwca100Books, 0),
    conAwca100Leaves: data.reduce(
      (sum, item) => sum + item.conAwca100Leaves,
      0,
    ),
    conAwcd25Books: data.reduce((sum, item) => sum + item.conAwcd25Books, 0),
    conAwcd25Leaves: data.reduce((sum, item) => sum + item.conAwcd25Leaves, 0),
    conSna25Books: data.reduce((sum, item) => sum + item.conSna25Books, 0),
    conSna25Leaves: data.reduce((sum, item) => sum + item.conSna25Leaves, 0),
    conSnd25Books: data.reduce((sum, item) => sum + item.conSnd25Books, 0),
    conSnd25Leaves: data.reduce((sum, item) => sum + item.conSnd25Leaves, 0),
    conSnd50Books: data.reduce((sum, item) => sum + item.conSnd50Books, 0),
    conSnd50Leaves: data.reduce((sum, item) => sum + item.conSnd50Leaves, 0),
    conSnd100Books: data.reduce((sum, item) => sum + item.conSnd100Books, 0),
    conSnd100Leaves: data.reduce((sum, item) => sum + item.conSnd100Leaves, 0),
    conMsnd25Books: data.reduce((sum, item) => sum + item.conMsnd25Books, 0),
    conMsnd25Leaves: data.reduce((sum, item) => sum + item.conMsnd25Leaves, 0),
    conPo50Books: data.reduce((sum, item) => sum + item.conPo50Books, 0),
    conPo50Leaves: data.reduce((sum, item) => sum + item.conPo50Leaves, 0),
    conPo100Books: data.reduce((sum, item) => sum + item.conPo100Books, 0),
    conPo100Leaves: data.reduce((sum, item) => sum + item.conPo100Leaves, 0),
    conPoa50Books: data.reduce((sum, item) => sum + item.conPoa50Books, 0),
    conPoa50Leaves: data.reduce((sum, item) => sum + item.conPoa50Leaves, 0),
    conPoi50Books: data.reduce((sum, item) => sum + item.conPoi50Books, 0),
    conPoi50Leaves: data.reduce((sum, item) => sum + item.conPoi50Leaves, 0),
    conFdr50Books: data.reduce((sum, item) => sum + item.conFdr50Books, 0),
    conFdr50Leaves: data.reduce((sum, item) => sum + item.conFdr50Leaves, 0),
    conFdr100Books: data.reduce((sum, item) => sum + item.conFdr100Books, 0),
    conFdr100Leaves: data.reduce((sum, item) => sum + item.conFdr100Leaves, 0),
    conMtdr25Books: data.reduce((sum, item) => sum + item.conMtdr25Books, 0),
    conMtdr25Leaves: data.reduce((sum, item) => sum + item.conMtdr25Leaves, 0),
    conMtdr50Books: data.reduce((sum, item) => sum + item.conMtdr50Books, 0),
    conMtdr50Leaves: data.reduce((sum, item) => sum + item.conMtdr50Leaves, 0),
    totalBooks: data.reduce((sum, item) => sum + item.totalBooks, 0),
    totalLeaves: data.reduce((sum, item) => sum + item.totalLeaves, 0),
  };
});

const handleDownload = async () => {
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
    const stDate = formState.startDate.format("YYYY-MM-DD");
    const enDate = formState.endDate.format("YYYY-MM-DD");

    // reportData.value = generateMockReportData(stDate, enDate);

    // reportData.value.sort((a, b) => {
    //   const aDate = new Date(a.requestDate).getTime();
    //   const bDate = new Date(b.requestDate).getTime();
    //   return aDate - bDate;
    // });
    const params = {
      bankId: formState.bankId,
      startDate: stDate,
      endDate: enDate,
      severity: formState.severity,
    };
    const response = await getConsumptionReportService(params);
    if (response.success == true) {
      reportData.value = response.data.consumptionReports;
      reportData.value.sort((a, b) => {
        const aDate = new Date(a.requestDate).getTime();
        const bDate = new Date(b.requestDate).getTime();
        return aDate - bDate;
      });
      // if (response.data.consumptionReports.length === 0) {
      //   message.warning("No data found for the selected date range");
      //   return;
      // } else {
      downloadExcel();
      message.success("Report generated successfully");
      // }
    } else {
      message.error("Failed to generate report");
    }
  } catch (error) {
    message.error("Failed to generate report");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  featchBanks();
});

const getExcelColumnLetter = (columnNumber: number): string => {
  let column = columnNumber;
  let result = "";

  while (column > 0) {
    const remainder = (column - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    column = Math.floor((column - 1) / 26);
  }

  return result;
};

const downloadExcel = async () => {
  try {
    /* =========================================================
     * 1. BANK
     * ========================================================= */

    const selectedBank = banks.value.find(
      (bank) => bank.id === formState.bankId,
    );

    const bankName = selectedBank?.bankName?.trim() || "Unknown Bank";

    const normalizedBankName = bankName.toLowerCase();

    const isPrimeBank = bankName === "Prime Bank PLC.";

    const isMidlandBank = bankName === "Midland Bank PLC";

    const isIBBL = formState.bankId === 9;

    /* =========================================================
     * 2. DATE RANGE
     * ========================================================= */

    const start = dayjs(formState.startDate);
    const end = dayjs(formState.endDate);

    if (!start.isValid() || !end.isValid()) {
      message.error("Please select a valid date range.");
      return;
    }

    if (start.isAfter(end)) {
      message.error("Start date cannot be greater than end date.");
      return;
    }

    let dateRange = "";
    let dateRangeLabel = "";

    if (start.isSame(end, "day")) {
      dateRange = start.format("D MMMM YYYY");

      dateRangeLabel = start.format("DD-MM-YYYY");
    } else if (start.isSame(end, "month")) {
      dateRange = `${start.format("MMMM D")}–${end.format("D, YYYY")}`;

      dateRangeLabel = `${start.format("MMMM_D")}_to_${end.format("D_YYYY")}`;
    } else {
      dateRange = `${start.format("MMMM YYYY")} to ${end.format("MMMM YYYY")}`;

      dateRangeLabel = `${start.format("MMMM_YYYY")}_to_${end.format(
        "MMMM_YYYY",
      )}`;
    }

    /* =========================================================
     * 3. BANK CONFIGURATION
     *
     * Business logic is kept exactly as existing.
     * ========================================================= */

    type BankConfig = {
      mainHeaders: string[];
      dataKeys: string[];
      workOrderRef?: string;
    };

    const BANK_CONFIG: Record<string, BankConfig> = {
      "Bengal Commercial Bank PLC.": {
        mainHeaders: [
          "SL",
          "Date",
          "SBA-10",
          "MSD-10",
          "CDA-25",
          "AWCD-25",
          "SNA-25",
          "MSND-25",
          "POA-50",
          "POI-50",
          "FDR-50",
          "MTDR-50",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "conSba10",
          "conMsd10",
          "conCda25",
          "conAwcd25",
          "conSna25",
          "conMsnd25",
          "conPoa50",
          "conPoi50",
          "conFdr50",
          "conMtdr50",
        ],
      },

      "Pubali Bank PLC.": {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "SB-25",
          "CD-25",
          "CD-50",
          "CD-100",
          "CC-50",
          "CC-100",
          "PO-100",
          "FDR-100",
          "MTDR-25",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "conSb10",
          "conSb25",
          "conCd25",
          "conCd50",
          "conCd100",
          "conCc50",
          "conCc100",
          "conPo100",
          "conFdr100",
          "conMtdr25",
        ],
      },

      "Midland Bank PLC": {
        mainHeaders: [
          "SL",
          "Date",
          "Gen-SB-20",
          "Gen-CD-10",
          "Gen-CD-25",
          "Gen-CD-50",
          "Islm-SB-20",
          "Islm-CD-25",
          "Islm-CD-50",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "conSb20",
          "conCd10",
          "conCd25",
          "conCd50",
          "islmSb20",
          "islmCd25",
          "islmCd50",
        ],
      },

      "Modhumoti Bank PLC.": {
        mainHeaders: ["SL", "Date", "PO-100", "Total Books", "Total Leaves"],

        dataKeys: ["conPo100"],
      },

      "Shahjalal Islami Bank PLC": {
        mainHeaders: [
          "SL",
          "Date",
          "MSD-10",
          "MSD-50",
          "ACD-25",
          "ACD-50",
          "ACD-100",
          "SND-25",
          "SND-50",
          "SND-100",
          "PO-100",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "conMsd10",
          "conMsd50",
          "conAcd25",
          "conAcd50",
          "conAcd100",
          "conSnd25",
          "conSnd50",
          "conSnd100",
          "conPo100",
        ],
      },

      "Jamuna Bank PLC": {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "CD-50",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: ["conSb10", "conCd50"],
      },

      "Prime Bank PLC.": {
        mainHeaders: [
          "SL",
          "Date",
          "SB/CD-05",
          "SB/CD-10",
          "SB/CD-20",
          "SB/CD-50",
          "SB/CD-05",
          "SB/CD-10",
          "SB/CD-20",
          "SB/CD-50",
          "SB/CD-10",
          "SB/CD-20",
          "SB/CD-50",
          "PO-100",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "csbcd5",
          "csbcd10",
          "csbcd20",
          "csbcd50",
          "isbcd5",
          "isbcd10",
          "isbcd20",
          "isbcd50",
          "psbcd10",
          "psbcd20",
          "psbcd50",
          "conPo100",
        ],
      },

      IBBL: {
        mainHeaders: [
          "SL",
          "Date",
          "MSA-10",
          "MSA-20",
          "AWCA-20",
          "AWCA-50",
          "AWCA-100",
          "PO-50",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: [
          "conMsa10",
          "conMsa20",
          "conAwca20",
          "conAwca50",
          "conAwca100",
          "conPo50",
        ],
      },

      "Shimanto Bank PLC": {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "CD-25",
          "PO-100",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: ["conSb10", "conCd25", "conPo100"],

        workOrderRef: "SMBL/HO/IDP/Fintera Solutions-MICR Cheque/2025/998",
      },

      default: {
        mainHeaders: [
          "SL",
          "Date",
          "SB-10",
          "SB-25",
          "CD-25",
          "Total Books",
          "Total Leaves",
        ],

        dataKeys: ["conSb10", "conSb25", "conCd25"],
      },
    };

    const config = BANK_CONFIG[bankName] ?? BANK_CONFIG.default;

    const dataKeys = config.dataKeys;

    /* =========================================================
     * 4. WORKBOOK
     * ========================================================= */

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Item Of Books");

    /* =========================================================
     * 5. COMMON STYLES
     * ========================================================= */

    const borderStyle = {
      top: { style: "thin" as const },
      bottom: { style: "thin" as const },
      left: { style: "thin" as const },
      right: { style: "thin" as const },
    };

    const centerAlignment = {
      horizontal: "center" as const,
      vertical: "middle" as const,
    };

    const yellowFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: {
        argb: "FFFF00",
      },
    };

    const subHeaderFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: {
        argb: "D9E8F5",
      },
    };

    const applyHeaderStyle = (cell: ExcelJS.Cell, fill = yellowFill) => {
      cell.font = {
        bold: true,
      };

      cell.alignment = centerAlignment;

      cell.fill = fill;

      cell.border = borderStyle;
    };

    /* =========================================================
     * 6. PAGE SETUP
     * ========================================================= */

    sheet.pageSetup = {
      paperSize: 9,

      orientation: isIBBL ? "portrait" : "landscape",

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 0,

      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    /* =========================================================
     * 7. HEADER ROW DEFINITIONS
     *
     * IMPORTANT:
     *
     * Normal:
     * Row 6 = Item Of Books
     * Row 7 = Main Header
     * Row 8 = Books / Leaves
     *
     * Prime:
     * Row 5 = Item Of Books
     * Row 6 = Account Groups
     * Row 7 = Main Header
     * Row 8 = Books / Leaves
     * ========================================================= */

    const mainHeaderRow = 7;
    const subHeaderRow = 8;

    const slDateHeaderRow = isPrimeBank ? 6 : 7;

    const titleRow = isPrimeBank ? 5 : 6;

    /* =========================================================
     * 8. SL COLUMN
     * ========================================================= */

    sheet.mergeCells(slDateHeaderRow, 1, subHeaderRow, 1);

    const slCell = sheet.getCell(slDateHeaderRow, 1);

    slCell.value = "SL";

    applyHeaderStyle(slCell);

    /* =========================================================
     * 9. DATE COLUMN
     * ========================================================= */

    sheet.mergeCells(slDateHeaderRow, 2, subHeaderRow, 2);

    const dateCell = sheet.getCell(slDateHeaderRow, 2);

    dateCell.value = "Date";

    applyHeaderStyle(dateCell);

    /* =========================================================
     * 10. DYNAMIC BOOK TYPE HEADERS
     * ========================================================= */

    let currentCol = 3;

    dataKeys.forEach((key, index) => {
      const headerText = config.mainHeaders[index + 2];

      /*
       * Main Book Type Header
       *
       * C:D
       * E:F
       * G:H
       * ...
       */

      sheet.mergeCells(
        mainHeaderRow,
        currentCol,
        mainHeaderRow,
        currentCol + 1,
      );

      const mainHeaderCell = sheet.getCell(mainHeaderRow, currentCol);

      mainHeaderCell.value = headerText;

      applyHeaderStyle(mainHeaderCell);

      /*
       * Books
       */

      const booksCell = sheet.getCell(subHeaderRow, currentCol);

      booksCell.value = "Books";

      applyHeaderStyle(booksCell, subHeaderFill);

      /*
       * Leaves
       */

      const leavesCell = sheet.getCell(subHeaderRow, currentCol + 1);

      leavesCell.value = "Leaves";

      applyHeaderStyle(leavesCell, subHeaderFill);

      currentCol += 2;
    });

    /* =========================================================
     * 11. TOTAL BOOKS
     * ========================================================= */

    const totalBooksCol = currentCol;

    sheet.mergeCells(
      slDateHeaderRow,
      totalBooksCol,
      subHeaderRow,
      totalBooksCol,
    );

    const totalBooksCell = sheet.getCell(slDateHeaderRow, totalBooksCol);

    totalBooksCell.value = "Total Books";

    applyHeaderStyle(totalBooksCell);

    /* =========================================================
     * 12. TOTAL LEAVES
     * ========================================================= */

    const totalLeavesCol = currentCol + 1;

    sheet.mergeCells(
      slDateHeaderRow,
      totalLeavesCol,
      subHeaderRow,
      totalLeavesCol,
    );

    const totalLeavesCell = sheet.getCell(slDateHeaderRow, totalLeavesCol);

    totalLeavesCell.value = "Total Leaves";

    applyHeaderStyle(totalLeavesCell);

    /* =========================================================
     * 13. MIDLAND - POSITIVE PAY
     * ========================================================= */

    let positivePayCol: number | null = null;

    if (isMidlandBank) {
      positivePayCol = currentCol + 2;

      sheet.mergeCells(
        slDateHeaderRow,
        positivePayCol,
        subHeaderRow,
        positivePayCol,
      );

      const positivePayCell = sheet.getCell(slDateHeaderRow, positivePayCol);

      positivePayCell.value = "Total Positive Pay";

      applyHeaderStyle(positivePayCell);
    }

    /* =========================================================
     * 14. LAST COLUMN
     * ========================================================= */

    const lastColumn = positivePayCol ?? totalLeavesCol;

    const lastColumnLetter = getExcelColumnLetter(lastColumn);

    /* =========================================================
     * 15. PRIME BANK ACCOUNT GROUP HEADER
     *
     * IMPORTANT:
     *
     * C:J  = Conventional
     * K:R  = Islamic
     * S:X  = Priority
     * Y:Z  = Pay Order
     *
     * AA   = Total Books
     * AB   = Total Leaves
     * ========================================================= */

    if (isPrimeBank) {
      const primeGroups = [
        {
          startCol: 3,
          endCol: 10,
          title: "Conventional Books",
          color: "16365C",
        },

        {
          startCol: 11,
          endCol: 18,
          title: "Islamic Banking",
          color: "4F6228",
        },

        {
          startCol: 19,
          endCol: 24,
          title: "Priority Banking",
          color: "A82323",
        },

        {
          startCol: 25,
          endCol: 26,
          title: "Pay Order",
          color: "70AD47",
        },
      ];

      primeGroups.forEach((group) => {
        const startLetter = getExcelColumnLetter(group.startCol);

        const endLetter = getExcelColumnLetter(group.endCol);

        sheet.mergeCells(`${startLetter}6:${endLetter}6`);

        const cell = sheet.getCell(`${startLetter}6`);

        cell.value = group.title;

        cell.font = {
          bold: true,
          size: 14,
          color: {
            argb: "FFFFFF",
          },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: group.color,
          },
        };

        cell.alignment = centerAlignment;

        cell.border = borderStyle;
      });
    }

    /* =========================================================
     * 16. TITLE / REPORT HEADER
     * ========================================================= */

    if (isPrimeBank) {
      /*
       * ---------------------------
       * PRIME BANK
       * ---------------------------
       */

      sheet.mergeCells(`A2:${lastColumnLetter}2`);

      const bankTitle = sheet.getCell("A2");

      bankTitle.value = bankName;

      bankTitle.font = {
        bold: true,
        size: 16,
      };

      bankTitle.alignment = centerAlignment;

      /*
       * Work Order
       */

      let workOrderRef = "BGCB-GSD-TIO-2024/101";

      if (normalizedBankName === "ibbl") {
        workOrderRef = "IBBPLC/HO/CSD/PSSD/2025/1659";
      }

      sheet.mergeCells(`A3:${lastColumnLetter}3`);

      const workOrderCell = sheet.getCell("A3");

      workOrderCell.value = `Work Order Ref: ${workOrderRef}`;

      workOrderCell.font = {
        bold: true,
        size: 12,
      };

      workOrderCell.alignment = centerAlignment;

      /*
       * Date
       */

      sheet.mergeCells(`A4:${lastColumnLetter}4`);

      const dateRangeCell = sheet.getCell("A4");

      dateRangeCell.value = `Date: ${dateRange}`;

      dateRangeCell.font = {
        bold: true,
        size: 12,
      };

      dateRangeCell.alignment = centerAlignment;

      /*
       * Main Title
       */

      sheet.mergeCells(`A5:${lastColumnLetter}5`);

      const titleCell = sheet.getCell("A5");

      titleCell.value = "Item Of Books";

      titleCell.font = {
        bold: true,
        size: 14,
        color: {
          argb: "FFFFFF",
        },
      };

      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "E26B0A",
        },
      };

      titleCell.alignment = centerAlignment;

      titleCell.border = borderStyle;
    } else {
      /*
       * ---------------------------
       * OTHER BANKS
       * ---------------------------
       */

      sheet.mergeCells(`A3:${lastColumnLetter}3`);

      const bankTitle = sheet.getCell("A3");

      bankTitle.value = bankName;

      bankTitle.font = {
        bold: true,
        size: 16,
      };

      bankTitle.alignment = centerAlignment;

      /* =======================================================
       * IBBL LOGO
       * ======================================================= */

      if (isIBBL) {
        const logoImageBase64 = await toBase64(logoImage);

        const logoId = workbook.addImage({
          base64: logoImageBase64,

          extension: "png",
        });

        sheet.addImage(logoId, {
          tl: {
            col: 1,
            row: 0,
          },

          ext: {
            width: 300,
            height: 75,
          },
        });
      }

      /*
       * Work Order
       */

      let workOrderRef = config.workOrderRef ?? "BGCB-GSD-TIO-2024/101";

      if (normalizedBankName === "ibbl") {
        workOrderRef = "IBBPLC/HO/CSD/PSSD/2025/1659";
      }

      sheet.mergeCells(`A4:${lastColumnLetter}4`);

      const workOrderCell = sheet.getCell("A4");

      workOrderCell.value = `Work Order Ref: ${workOrderRef}`;

      workOrderCell.font = {
        bold: true,
        size: 12,
      };

      workOrderCell.alignment = centerAlignment;

      /*
       * Date
       */

      sheet.mergeCells(`A5:${lastColumnLetter}5`);

      const dateCellHeader = sheet.getCell("A5");

      dateCellHeader.value = `Date: ${dateRange}`;

      dateCellHeader.font = {
        bold: true,
        size: 12,
      };

      dateCellHeader.alignment = centerAlignment;

      /*
       * Item Of Books
       */

      sheet.mergeCells(`A6:${lastColumnLetter}6`);

      const titleCell = sheet.getCell("A6");

      titleCell.value = "Item Of Books";

      titleCell.font = {
        bold: true,
        size: 14,
        color: {
          argb: "FFFFFF",
        },
      };

      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "70AD47",
        },
      };

      titleCell.alignment = centerAlignment;

      titleCell.border = borderStyle;
    }

    /* =========================================================
     * 17. DATA ROWS
     * ========================================================= */

    reportData.value.forEach((item, index) => {
      const rowData: (string | number)[] = [
        index + 1,

        dayjs(item.requestDate).format("DD-MMM-YY"),
      ];

      /*
       * Book Type Data
       */

      dataKeys.forEach((key) => {
        const booksKey = `${key}Books` as keyof ReportItem;

        const leavesKey = `${key}Leaves` as keyof ReportItem;

        rowData.push(Number(item[booksKey] ?? 0));

        rowData.push(Number(item[leavesKey] ?? 0));
      });

      /*
       * Total Books
       */

      rowData.push(Number(item.totalBooks ?? 0));

      /*
       * Total Leaves
       */

      rowData.push(Number(item.totalLeaves ?? 0));

      /*
       * Midland Positive Pay
       */

      if (isMidlandBank) {
        rowData.push(Number(item.totalBooks ?? 0) * 10);
      }

      const row = sheet.addRow(rowData);

      row.eachCell((cell) => {
        cell.border = borderStyle;

        cell.alignment = centerAlignment;

        cell.numFmt = "0";
      });
    });

    /* =========================================================
     * 18. GRAND TOTAL
     * ========================================================= */

    const grandTotalData: (string | number)[] = ["", "Grand Total"];

    dataKeys.forEach((key) => {
      const booksKey = `${key}Books` as keyof typeof totals.value;

      const leavesKey = `${key}Leaves` as keyof typeof totals.value;

      grandTotalData.push(Number(totals.value[booksKey] ?? 0));

      grandTotalData.push(Number(totals.value[leavesKey] ?? 0));
    });

    /*
     * Total Books
     */

    grandTotalData.push(Number(totals.value.totalBooks ?? 0));

    /*
     * Total Leaves
     */

    grandTotalData.push(Number(totals.value.totalLeaves ?? 0));

    /*
     * Midland Positive Pay
     */

    if (isMidlandBank) {
      grandTotalData.push(Number(totals.value.totalBooks ?? 0) * 10);
    }

    const grandTotalRow = sheet.addRow(grandTotalData);

    grandTotalRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "70AD47",
        },
      };

      cell.border = borderStyle;

      cell.alignment = centerAlignment;

      cell.numFmt = "0";
    });

    /* =========================================================
     * 19. COLUMN WIDTH
     * ========================================================= */

    sheet.columns.forEach((column) => {
      column.width = 12;
    });

    sheet.getColumn(1).width = 8;

    sheet.getColumn(2).width = 12;

    /* =========================================================
     * 20. ROW HEIGHT
     * ========================================================= */

    const rowHeight = isIBBL ? 35 : 25;

    sheet.eachRow((row) => {
      row.height = rowHeight;
    });

    /* =========================================================
     * 21. FILE NAME
     * ========================================================= */

    const safeBankName = bankName.replace(/\s+/g, "_");

    const filename = `Consumption_Report_${dateRangeLabel}_${safeBankName}.xlsx`;

    /* =========================================================
     * 22. GENERATE & DOWNLOAD
     * ========================================================= */

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    fallbackDownload(blob, filename);
  } catch (error) {
    console.error("Excel download error:", error);

    message.error("Failed to download Excel file");
  }
};
const fallbackDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
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

const resetForm = () => {
  formState.startDate = dayjs().startOf("month"); // বর্তমান মাসের প্রথম দিন
  formState.endDate = dayjs();
  formState.bankId = null;
  reportData.value = [];
  message.success("Form has been reset");
};
</script>

<style scoped>
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
