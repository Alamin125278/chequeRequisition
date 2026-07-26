<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header Section -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"
            >
              <FileTextOutlined class="text-white text-xl" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Cheque Book Challan Report
              </h1>
              <p class="text-sm text-slate-500 mt-1">
                Generate and manage challan documents
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Request Date</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ currentDate }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200"
        >
          <div class="flex items-center gap-2">
            <FilterOutlined class="text-blue-600 text-lg" />
            <h2 class="text-lg font-semibold text-slate-900">Report Filters</h2>
          </div>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handlePreview">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
              <a-form-item
                label="Select Bank"
                name="bankId"
                :rules="[{ required: true, message: 'Please select a bank' }]"
              >
                <a-select
                  v-model:value="formState.bankId"
                  placeholder="Select bank"
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
              <a-form-item
                label="Request Date"
                name="requestDate"
                :rules="[{ required: true, message: 'Please select a date' }]"
              >
                <a-date-picker
                  v-model:value="formState.requestDate"
                  format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
              <a-button
                @click="resetForm"
                size="large"
                class="rounded-md mt-6 px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent flex items-center"
              >
                <ReloadOutlined class="mr-2" /> Reset
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :loading="isLoading"
                @click="downloadChallan"
                class="rounded-md mt-6 px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import {
  Form as AForm,
  FormItem as AFormItem,
  Select as ASelect,
  DatePicker as ADatePicker,
  Button as AButton,
  message,
} from "ant-design-vue";
import {
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import dayjs, { type Dayjs } from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { TableColumnsType } from "ant-design-vue";
import bankLogo from "@/assets/challanImages/finterlogo.png";
import AuthSignature from "@/assets/signature.png";
import { getAgentChallanReceipt } from "@/services/summary-report/summaryReportService";
import { getBankForBranchService } from "@/services/bank/bank.service";

// Types
interface ChequeBookItem {
  accountNo: string;
  accountName: string;
  startNo: string;
  bookQty: number;
  leaves: number;
  endNo: string;
  accType: string;
}

interface ChallanGroup {
  deliveryBranch: string;
  distId: string;
  challanNo: string;
  items: ChequeBookItem[];
  totalBookQty: number;
}

interface Bank {
  id: number;
  bankName: string;
}
// State
const formState = reactive({
  bankId: undefined as number | undefined,
  requestDate: dayjs(),
});

const isLoading = ref(false);
const isDownloading = ref(false);
const challanGroups = ref<ChallanGroup[]>([]);
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

const selectedBankName = computed(() => {
  const bank = banks.value.find((b) => b.id === formState.bankId);
  return bank?.bankName || "Unknown";
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
// Methods
const formatDate = (): string => {
  if (!formState.requestDate) return "";
  return formState.requestDate.format("DD-MM-YYYY");
};

// const generateChallanData = (): ChallanGroup[] => {
//   const mockItems = [
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST001",
//       challanNo: "CH001",
//       accountNo: "20507771234567891",
//       accountName: "Alamin Hossen,Shah Alam ,Faruk Mia",
//       startNo: "100001",
//       bookQty: 1,
//       leaves: 25,
//       endNo: "100050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Main Branch",
//       distId: "DIST003",
//       challanNo: "CH001",
//       accountNo: "ACC004",
//       accountName: "Account Name",
//       startNo: "200001",
//       bookQty: 1,
//       leaves: 50,
//       endNo: "200050",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Branch South",
//       distId: "DIST004",
//       challanNo: "CH003",
//       accountNo: "ACC005",
//       accountName: "Account Name",
//       startNo: "300001",
//       bookQty: 1,
//       leaves: 75,
//       endNo: "300075",
//       accType: "SAVINGS",
//     },
//     {
//       deliveryBranch: "Branch East",
//       distId: "DIST004",
//       challanNo: "CH004",
//       accountNo: "ACC006",
//       accountName: "Account Name",
//       startNo: "400001",
//       bookQty: 1,
//       leaves: 50,
//       endNo: "400050",
//       accType: "SAVINGS",
//     },
//   ];

//   const groupMap = new Map<string, ChallanGroup>();

//   mockItems.forEach((item) => {
//     if (item.distId && item.distId.trim() !== "") {
//       const key = `${item.deliveryBranch}|${item.distId}`;
//       if (!groupMap.has(key)) {
//         groupMap.set(key, {
//           deliveryBranch: item.deliveryBranch,
//           distId: item.distId,
//           challanNo: item.challanNo,
//           items: [],
//           totalbookQty: 0,
//         });
//       }
//       const group = groupMap.get(key)!;
//       group.items.push({
//         accountNo: item.accountNo ?? "",
//         accountName: item.accountName ?? "",
//         startNo: item.startNo ?? "",
//         bookQty: item.bookQty ?? 0,
//         leaves: item.leaves ?? 0,
//         endNo: item.endNo ?? "",
//         accType: item.accType ?? "",
//       });
//       group.totalbookQty += item.bookQty;
//     }
//   });

//   return Array.from(groupMap.values());
// };

const handlePreview = async () => {
  if (!formState.bankId || !formState.requestDate) {
    message.error("Please fill all required fields");
    return;
  }

  isLoading.value = true;

  try {
    const requestDate = formState.requestDate.format("YYYY-MM-DD");
    const params = {
      bankId: formState.bankId,
      requestDate: requestDate,
    };
    const challans = await getAgentChallanReceipt(params);
    challanGroups.value = challans.data.agentReceipts;
    if (challans.length === 0) {
      message.warning("No challan data available");
      return;
    }

    message.success("Challans generated successfully");
  } catch (error) {
    message.error("Failed to generate challans");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

// const downloadChallan = async () => {
//   if (challanGroups.value.length === 0) {
//     message.error("No challan data to download");
//     return;
//   }

//   isDownloading.value = true;

//   try {
//     const pdf = new jsPDF("p", "mm", "a4");
//     const bankName = selectedBankName.value;
//     const dateStr = formatDate();
//     let pageHeight = pdf.internal.pageSize.getHeight();
//     let yPosition = 15;

//     challanGroups.value.forEach((group, groupIdx) => {
//       // Add new page for each challan except the first
//       if (groupIdx > 0) {
//         pdf.addPage();
//         yPosition = 15;
//       }

//       // Title
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(`${bankName} - Challan Report`, 105, yPosition, {
//         align: "center",
//       });
//       yPosition += 8;

//       // Date
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(`Request Date: ${dateStr}`, 105, yPosition, { align: "center" });
//       yPosition += 8;

//       // Challan Info
//       pdf.setFontSize(10);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(
//         `Challan #${group.challanNo} | Branch: ${group.deliveryBranch} | Dist ID: ${group.distId}`,
//         105,
//         yPosition,
//         { align: "center" },
//       );
//       yPosition += 10;

//       // Table
//       const columns = [
//         "Sl",
//         "Account No",
//         "Account Name",
//         "Start No",
//         "Bks X Lvs",
//         "End No",
//         "Account Type",
//       ];
//       const rows = group.items.map((item, idx) => [
//         (idx + 1).toString(),
//         item.accountNo,
//         item.accountName,
//         item.startNo,
//         `${item.bookQty} X ${item.leaves}`,
//         item.endNo,
//         item.accType,
//       ]);

//       // Add total row
//       rows.push(["", "", "Total", group.totalbookQty.toString(), "", "", ""]);

//       // Generate table
//       const tableStartY = yPosition;
//       const cellHeight = 7;
//       const columnWidths = [12, 20, 25, 15, 15, 20, 20];
//       let tableYPosition = tableStartY;

//       // Header row
//       pdf.setFont("helvetica", "bold");
//       pdf.setFillColor(211, 211, 211);
//       let xPosition = 10;
//       columns.forEach((col, idx) => {
//         pdf.rect(
//           xPosition,
//           tableYPosition,
//           columnWidths[idx],
//           cellHeight,
//           "FD",
//         );
//         pdf.text(col, xPosition + 1, tableYPosition + 5, {
//           maxWidth: columnWidths[idx] - 2,
//         });
//         xPosition += columnWidths[idx];
//       });
//       tableYPosition += cellHeight;

//       // Data rows
//       pdf.setFont("helvetica", "bold");
//       pdf.setFillColor(255, 255, 255);
//       rows.forEach((row, rowIdx) => {
//         xPosition = 10;
//         const isLastRow = rowIdx === rows.length - 1;
//         if (isLastRow) {
//           pdf.setFont("helvetica", "bold");
//         }

//         row.forEach((cell, cellIdx) => {
//           pdf.rect(
//             xPosition,
//             tableYPosition,
//             columnWidths[cellIdx],
//             cellHeight,
//             "S",
//           );
//           pdf.text(cell.toString(), xPosition + 1, tableYPosition + 5, {
//             maxWidth: columnWidths[cellIdx] - 2,
//           });
//           xPosition += columnWidths[cellIdx];
//         });
//         tableYPosition += cellHeight;
//       });
//     });

//     pdf.save(`Challan_Report_${dateStr.replace(/\s+/g, "_")}.pdf`);
//     message.success("Challan PDF downloaded successfully");
//   } catch (error) {
//     console.error("PDF download error:", error);
//     message.error("Failed to download challan");
//   } finally {
//     isDownloading.value = false;
//   }
// };

const downloadChallan = async () => {
  await handlePreview();
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const bankName = selectedBankName.value || "BANK NAME";
  const dateStr = formatDate();
  challanGroups.value.sort((a, b) => {
    // 1. deliveryBranch
    const branchCompare = a.deliveryBranch.localeCompare(b.deliveryBranch);
    if (branchCompare !== 0) {
      return branchCompare;
    }

    // 2. distId (e.g. 123-007)
    const [aPrefix, aSuffix] = a.distId.split("-").map(Number);
    const [bPrefix, bSuffix] = b.distId.split("-").map(Number);

    if (aPrefix !== bPrefix) {
      return aPrefix - bPrefix;
    }

    return aSuffix - bSuffix;
  });

  challanGroups.value.forEach((group, index) => {
    if (index > 0) {
      pdf.addPage();
    }

    const startPage = pdf.getNumberOfPages();

    // =========================
    // FIRST PAGE HEADER
    // =========================

    pdf.addImage(bankLogo, "PNG", 150, 12, 45, 28);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);

    pdf.text(bankName, 95, 20, {
      align: "center",
    });

    pdf.setFontSize(10);

    pdf.text("Cheque Book Requisition Challan", 95, 27, {
      align: "center",
    });

    pdf.line(10, 45, 200, 45);

    pdf.setFontSize(10);

    pdf.text("Branch:", 10, 35);
    pdf.text(group.deliveryBranch, 25, 35);

    pdf.text("Challan No:", 10, 41);
    pdf.text(String(group.challanNo), 30, 41);

    pdf.text("Dist ID:", 110, 35);
    pdf.text(String(group.distId), 125, 35);

    pdf.text("Date:", 110, 41);
    pdf.text(dateStr, 120, 41);

    // =========================
    // TABLE ROWS
    // =========================

    const rows = group.items.map((item, i) => [
      i + 1,
      item.accountNo,
      item.accountName,
      item.startNo,
      `${item.bookQty} X ${item.leaves}`,
      item.endNo,
      item.accType,
    ]);

    rows.push(["", "", "", "TOTAL BOOK QTY", group.totalBookQty, "", ""]);

    autoTable(pdf, {
      startY: 48,

      showHead: "everyPage",

      pageBreak: "auto",

      rowPageBreak: "auto",

      margin: {
        top: 48,
        bottom: 35,
        left: 10,
        right: 10,
      },

      head: [
        [
          "SL",
          "Account No",
          "Account Name",
          "Start No",
          "Books X Leaves",
          "End No",
          "Type",
        ],
      ],

      body: rows,

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
      },

      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },

      columnStyles: {
        0: {
          cellWidth: 10,
          halign: "center",
        },
        1: {
          cellWidth: 35,
        },
        2: {
          cellWidth: 50,
        },
        3: {
          cellWidth: 20,
          halign: "center",
        },
        4: {
          cellWidth: 25,
          halign: "center",
        },
        5: {
          cellWidth: 20,
          halign: "center",
        },
        6: {
          cellWidth: 25,
          halign: "center",
        },
      },

      didParseCell: (data) => {
        if (data.row.index === rows.length - 1) {
          data.cell.styles.fillColor = [220, 230, 241];

          data.cell.styles.fontStyle = "bold";
        }
      },

      // =========================
      // PAGE BREAK HEADER
      // =========================

      didDrawPage: () => {
        const currentPage = pdf.getCurrentPageInfo().pageNumber;

        // Logo every page
        pdf.addImage(bankLogo, "PNG", 150, 12, 45, 28);

        // Only first page of current challan
        if (currentPage === startPage) {
          return;
        }

        pdf.line(10, 45, 200, 45);
      },
    });

    // =========================
    // SIGNATURE
    // =========================

    let finalY = (pdf as any).lastAutoTable.finalY + 20;

    if (finalY > 240) {
      pdf.addPage();

      pdf.addImage(bankLogo, "PNG", 150, 12, 45, 28);

      finalY = 60;
    }

    pdf.line(20, finalY, 70, finalY);

    pdf.line(140, finalY, 190, finalY);

    pdf.addImage(AuthSignature, "PNG", 25, finalY - 15, 40, 12);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    pdf.text("Authorized Signature", 45, finalY + 5, {
      align: "center",
    });

    pdf.text("Receiving Signature", 165, finalY + 5, {
      align: "center",
    });
  });
  // =========================
  // FOOTER
  // =========================
  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    pdf.setDrawColor(180);

    pdf.line(10, 275, 200, 275);

    pdf.setFontSize(8);

    pdf.setTextColor(0, 102, 204);

    pdf.text(
      "IMPORTANT NOTICE: For any query please contact +8801857-484444",
      105,
      281,
      {
        align: "center",
      },
    );

    pdf.setTextColor(0, 0, 0);

    pdf.text(`Page ${i} of ${pageCount}`, 195, 287, {
      align: "right",
    });
  }

  pdf.save(`${dateStr}_${bankName}_AgentReceipt.pdf`);
};
onMounted(() => {
  featchBanks();
});
const resetForm = () => {
  formState.bankId = undefined;
  formState.requestDate = dayjs();
  message.success("Form has been reset");
};
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc !important;
  font-weight: 600;
  color: #334155;
  border-color: #e2e8f0;
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr > td) {
  border-color: #e2e8f0;
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0f9ff;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #475569;
}

:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 0.5rem !important;
  border-color: #cbd5e1 !important;
}

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
</style>
