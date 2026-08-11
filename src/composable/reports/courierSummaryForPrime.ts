import { getCourierSummaryReportService } from "@/services/summary-report/summaryReportService";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import signatureImage from "@/assets/signature.png";
import { getBankForBranchService } from "@/services/bank/bank.service";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
const previewModalVisible = ref(false);
const isLoading = ref(false);
const isDownloading = ref(false);

interface Bank {
  id: number;
  bankName: string;
}
interface Courier {
  id: number;
  courierName: string;
  courierCode: string;
}

const banks = ref<Bank[]>([]);
const couriers = ref<Courier[]>([]);
//Get the banks from the database
const featchBanks = async () => {
  try {
    const result = await getBankForBranchService();
    banks.value = result;
  } catch (e) {
    console.error("Error fetching banks", e);
  }
};

export interface ReportItemForPrime {
  homeBranch?: string;
  bankId: number;
  deliveryBranch: string;
  challanNo: string;
  challanDate: string;
  courierName: string;
  branchAddress: string;
  branchPhone: string;
  requestDate: string;
  isAgent: boolean;
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
  conpo100: number;
  total: number;
}

interface Totals {
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
  conpo100: number;
  grandTotal: number;
}

// Report data
const reportData = ref<ReportItemForPrime[]>([]);

// Calculate totals
const totals = computed((): Totals => {
  const data = reportData.value;
  return {
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
    conpo100: data.reduce((sum, item) => sum + item.conpo100, 0),
    grandTotal: data.reduce((sum, item) => sum + item.total, 0),
  };
});

type ReportColumnKey =
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
  | "prio50"
  | "conpo100";
const conditionalHeaders: { key: ReportColumnKey; label: string }[] = [
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

const activeColumns = computed(() => {
  return conditionalHeaders.filter((h) => totals.value[h.key] > 0);
});
let startDate = "";
let endDate = "";

export const courierSummaryForPrime = async (params: any) => {
  featchBanks();
  const response = await getCourierSummaryReportService(params);
  startDate = params.startDate;
  endDate = params.endDate;
  if (response.success == true) {
    reportData.value = response.data.summaryReports;
    reportData.value.sort((a, b) => {
      const aLast6 = a.challanNo.slice(-6);
      const bLast6 = b.challanNo.slice(-6);
      return aLast6.localeCompare(bLast6);
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
};

// Download Excel
const downloadExcel = async () => {
  isDownloading.value = true;
  try {
    const signatureImageBase64 = await toBase64(signatureImage);
    // Get selected bank name
    const selectedBank = banks.value.find((bank) => bank.id === 8);
    const bankName = selectedBank?.bankName || "Unknown Bank";
    const bankId = selectedBank?.id || 0;
    const severityType = "Normal";

    const start = dayjs(startDate);
    const end = dayjs(endDate);

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
    const sheet = workbook.addWorksheet("Courier Summary Report");
    sheet.pageSetup = {
      paperSize: 9, // 9 = A4 size in ExcelJS
      orientation: "landscape", // or "landscape"
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
    sheet.mergeCells("A3:L3");
    const bankCell = sheet.getCell("B3");
    bankCell.value = `${bankName} Courier Summary Report`;
    bankCell.font = { bold: true, size: 16 };
    bankCell.alignment = { horizontal: "center" };

    // Heading: Date Range
    sheet.mergeCells("A4:L4");
    const dateCell = sheet.getCell("B4");
    dateCell.value = dateRange;
    dateCell.font = { bold: true, size: 12 };
    dateCell.alignment = { horizontal: "center" };
    // Heading: Report Type
    sheet.mergeCells("A5:L5");
    const reportTypeCell = sheet.getCell("B5");
    reportTypeCell.value = ` Report Status: ${severityType}`;
    reportTypeCell.font = { bold: true, size: 12 };
    reportTypeCell.alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow([]);
    const hasBranchInfo =
      bankId === 2 || bankId === 4 || bankId === 6 || bankId === 8;

    // Table Header
    const tableHeaders = [
      "Sl No",
      "Courier Name",
      "Requestion Date",
      "Delivery Branch",
      ...(hasBranchInfo ? ["Branch Address"] : []),
      "Challan No",
      "Challan Date",
      ...conditionalHeaders
        .filter((h) => totals.value[h.key] > 0)
        .map((h) => h.label),
      "Total",
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
      const row = sheet.addRow([
        index + 1,
        item.courierName,
        item.requestDate,
        item.deliveryBranch,
        ...(hasBranchInfo ? [item.branchAddress] : []),
        item.challanNo,
        item.challanDate,
        ...activeColumns.value.map((h) => item[h.key]),
        item.total,
      ]);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: "left", vertical: "middle" };
      });
    });

    // Totals row
    const totalsRow = sheet.addRow([
      "",
      "",
      "",
      ...(hasBranchInfo ? [""] : []),
      "",
      "",
      "Grand Total",
      ...activeColumns.value.map((h) => totals.value[h.key]), // ✅ dynamically get totals
      totals.value.grandTotal,
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
    const columnWidths = [8, 20, 15, 15, 10, 10, 10, 10, 10, 10, 10, 10, 12];
    sheet.columns.forEach((col, index) => {
      col.width = columnWidths[index];
    });

    const courierName =
      reportData.value.length > 0
        ? reportData.value[0].courierName
        : "Unknown_Courier";
    const formattedBankName = bankName.trim().replace(/\s+/g, "_");
    const formattedCourierName = courierName?.trim().replace(/\s+/g, "_");
    // Generate filename
    // const filename = `${dateRangeLabel}_Courier_Summary_Report_${bankName.replace(
    //   /\s+/g,
    //   "_",
    // )}_${courierName}_${formState.severity===1?"Urgent_":""}${formState.agentType ? "Agent" : ""}.xlsx`;

    const filename =
      [
        dateRangeLabel, // Date Range
        "Courier_Summary_Report", // Report Type
        formattedBankName, // Bank Name
        formattedCourierName, // Courier Name
      ]
        .filter(Boolean) // Remove empty/null values
        .join("_") + ".xlsx";
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
