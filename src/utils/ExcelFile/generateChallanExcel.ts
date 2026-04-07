// import type { FetchChallanParams } from "@/services/challan/challan.service";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const generateSingleSheetChallanExcel = async (
//   challans: FetchChallanParams[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Delivery Challans");

//   const PAGE_HEIGHT = 40;
//   const HEADER_HEIGHT = 10;
//   const FOOTER_HEIGHT = 4;
//   const USABLE_ROWS = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

//   const borderStyle = {
//     top: { style: "thin" },
//     left: { style: "thin" },
//     bottom: { style: "thin" },
//     right: { style: "thin" },
//   };

//   for (const challan of challans) {
//     const items = challan.items;
//     const chunks: (typeof items)[] = [];

//     for (let i = 0; i < items.length; i += USABLE_ROWS) {
//       chunks.push(items.slice(i, i + USABLE_ROWS));
//     }

//     for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
//       const chunk = chunks[pageIndex];
//       const startRow = sheet.lastRow?.number ? sheet.lastRow.number + 2 : 1;

//       // ✅ Always add header image/logo
//       const logoImageId = workbook.addImage({
//         base64: logoBase64,
//         extension: "jpeg",
//       });
//       sheet.addImage(logoImageId, {
//         tl: { col: 6, row: startRow - 1 },
//         ext: { width: 150, height: 50 },
//       });

//       // ✅ Only on first page: show full header
//       if (pageIndex === 0) {
//         sheet.mergeCells(`A${startRow}:D${startRow}`);
//         sheet.getCell(`A${startRow}`).value =
//           "Delivery Br.: " + challan.receivingBranchName;
//         sheet.getCell(`A${startRow}`).font = { bold: true, size: 12 };

//         sheet.mergeCells(`A${startRow + 1}:D${startRow + 1}`);
//         sheet.getCell(`A${startRow + 1}`).value = challan.bankName;
//         sheet.getCell(`A${startRow + 1}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 2}:D${startRow + 2}`);
//         sheet.getCell(`A${startRow + 2}`).value =
//           "Date: " +
//           new Date(challan.challanDate).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           });
//         sheet.getCell(`A${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 3}:D${startRow + 3}`);
//         sheet.getCell(`A${startRow + 3}`).value =
//           "Printed By: " + challan.vendorName;
//         sheet.getCell(`A${startRow + 3}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 4}:D${startRow + 4}`);
//         sheet.getCell(`A${startRow + 4}`).value =
//           "Courier: " + challan.courierName;
//         sheet.getCell(`A${startRow + 4}`).font = { bold: true, size: 10 };

//         sheet.getCell(`A${startRow + 5}`).value = "To";
//         sheet.getCell(`A${startRow + 5}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 6}:C${startRow + 6}`);
//         sheet.getCell(`A${startRow + 6}`).value = "Manager";
//         sheet.getCell(`A${startRow + 6}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 2}:H${startRow + 2}`);
//         sheet.getCell(`E${startRow + 2}`).value =
//           "Challan No: " + challan.challanNumber;
//         sheet.getCell(`E${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 3}:H${startRow + 3}`);
//         sheet.getCell(`E${startRow + 3}`).value = `Con: ${
//           challan.agentNum || "N/A"
//         }`;
//         sheet.getCell(`E${startRow + 3}`).font = { bold: true, size: 8 };

//         sheet.mergeCells(`E${startRow + 7}:H${startRow + 7}`);
//         sheet.getCell(`E${startRow + 7}`).value = "Delivery Challan";
//         sheet.getCell(`E${startRow + 7}`).font = { bold: true, size: 14 };
//       }

//       // ✅ Table headers
//       const headerRow = sheet.addRow([
//         "Sl.No",
//         "Account No",
//         "Account Name",
//         "Start No",
//         "End No",
//         "Cheque Type",
//         "Book Qty",
//         "Leaves",
//         "Serverity",
//         "Branch Name",
//       ]);
//       headerRow.eachCell((cell: any) => {
//         cell.font = { bold: true };
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//         };
//         cell.border = borderStyle;
//       });

//       // ✅ Table data
//       chunk.forEach((item, index) => {
//         const row = sheet.addRow([
//           index + 1 + pageIndex * USABLE_ROWS,
//           item.accountNo,
//           item.accountName,
//           item.startNo,
//           item.endNo,
//           item.chequeType,
//           item.bookQty,
//           item.leaves,
//           item.serverity,
//           item.branchName,
//         ]);
//         row.eachCell((cell: any) => {
//           cell.border = borderStyle;
//         });
//       });

//       // ✅ Footer always at bottom of page
//       const currentRow = sheet.lastRow!.number;
//       const usedRows = currentRow - startRow + 1;
//       const padBeforeFooter = PAGE_HEIGHT - usedRows - FOOTER_HEIGHT;
//       for (let i = 0; i < padBeforeFooter; i++) {
//         sheet.addRow([]);
//       }

//       const footerStart = sheet.lastRow!.number + 1;

//       // ✅ Signature only on last page
//       if (pageIndex === chunks.length - 1) {
//         sheet.getCell(`A${footerStart}`).value = "Authorized Signature";
//         sheet.getCell(`I${footerStart}`).value = "Receiving Signature";
//       }

//       // ✅ Footer image always
//       const footerImageId = workbook.addImage({
//         base64: footerBase64,
//         extension: "jpeg",
//       });
//       sheet.addImage(footerImageId, {
//         tl: { col: 0, row: footerStart + 1 },
//         ext: { width: 794, height: 60 },
//       });
//     }
//   }

//   // ✅ Save file
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   saveAs(blob, `Challans_${new Date().toISOString().split("T")[0]}.xlsx`);
// };

// import type { FetchChallanParams } from "@/services/challan/challan.service";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const generateSingleSheetChallanExcel = async (
//   challans: FetchChallanParams[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Delivery Challans");

//   // ✅ Set A4 Paper Size with Margins
//   sheet.pageSetup = {
//     paperSize: 9, // A4
//     orientation: "portrait",
//     margins: {
//       left: 0.5,
//       right: 0.5,
//       top: 0.75,
//       bottom: 0.75,
//       header: 0.3,
//       footer: 0.3,
//     },
//   };

//   sheet.properties.defaultRowHeight = 20;

//   const PAGE_HEIGHT = 40;
//   const HEADER_HEIGHT = 10;
//   const FOOTER_HEIGHT = 4;
//   const USABLE_ROWS = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

//   const borderStyle = {
//     top: { style: "thin" },
//     left: { style: "thin" },
//     bottom: { style: "thin" },
//     right: { style: "thin" },
//   };

//   for (const challan of challans) {
//     const items = challan.items;
//     const chunks: (typeof items)[] = [];

//     for (let i = 0; i < items.length; i += USABLE_ROWS) {
//       chunks.push(items.slice(i, i + USABLE_ROWS));
//     }

//     for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
//       const chunk = chunks[pageIndex];
//       const startRow = sheet.lastRow?.number ? sheet.lastRow.number + 4 : 1;

//       // ✅ Add Header Logo (top-left)
//       const logoImageId = workbook.addImage({
//         base64: logoBase64,
//         extension: "jpeg",
//       });

//       sheet.addImage(logoImageId, {
//         tl: { col: 8, row: startRow - 1 },
//         ext: { width: 300, height: 75 },
//       });

//       if (pageIndex === 0) {
//         sheet.mergeCells(`A${startRow}:D${startRow}`);
//         sheet.getCell(`A${startRow}`).value =
//           "Delivery Br.: " + challan.receivingBranchName;
//         sheet.getCell(`A${startRow}`).font = { bold: true, size: 12 };

//         sheet.mergeCells(`A${startRow + 1}:D${startRow + 1}`);
//         sheet.getCell(`A${startRow + 1}`).value = challan.bankName;
//         sheet.getCell(`A${startRow + 1}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 2}:D${startRow + 2}`);
//         sheet.getCell(`A${startRow + 2}`).value =
//           "Date: " +
//           new Date(challan.challanDate).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           });
//         sheet.getCell(`A${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 3}:D${startRow + 3}`);
//         sheet.getCell(`A${startRow + 3}`).value =
//           "Printed By: " + challan.vendorName;
//         sheet.getCell(`A${startRow + 3}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 4}:D${startRow + 4}`);
//         sheet.getCell(`A${startRow + 4}`).value =
//           "Courier: " + challan.courierName;
//         sheet.getCell(`A${startRow + 4}`).font = { bold: true, size: 10 };

//         sheet.getCell(`A${startRow + 5}`).value = "To";
//         sheet.getCell(`A${startRow + 5}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 6}:C${startRow + 6}`);
//         sheet.getCell(`A${startRow + 6}`).value = "Manager";
//         sheet.getCell(`A${startRow + 6}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 2}:H${startRow + 2}`);
//         sheet.getCell(`E${startRow + 2}`).value =
//           "Challan No: " + challan.challanNumber;
//         sheet.getCell(`E${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 3}:H${startRow + 3}`);
//         sheet.getCell(`E${startRow + 3}`).value = `Con: ${
//           challan.agentNum || "N/A"
//         }`;
//         sheet.getCell(`E${startRow + 3}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 7}:H${startRow + 7}`);
//         sheet.getCell(`E${startRow + 7}`).value = "Delivery Challan";
//         sheet.getCell(`E${startRow + 7}`).font = { bold: true, size: 14 };
//       }

//       // ✅ Table Header
//       const headerRow = sheet.addRow([
//         "Sl.No",
//         "Account No",
//         "Account Name",
//         "Start No",
//         "End No",
//         "Cheque Type",
//         "Book Qty",
//         "Leaves",
//         "Serverity",
//         "Branch Name",
//       ]);
//       headerRow.eachCell((cell: any) => {
//         cell.font = { bold: true };
//         cell.fill = {
//           type: "pattern",
//         };
//         cell.border = borderStyle;
//       });

//       // ✅ Table Data
//       chunk.forEach((item, index) => {
//         const row = sheet.addRow([
//           index + 1 + pageIndex * USABLE_ROWS,
//           item.accountNo,
//           item.accountName,
//           item.startNo,
//           item.endNo,
//           item.chequeType,
//           item.bookQty,
//           item.leaves,
//           item.serverity,
//           item.branchName,
//         ]);
//         row.eachCell((cell: any) => {
//           cell.border = borderStyle;
//         });
//       });

//       // ✅ Pad empty rows
//       const currentRow = sheet.lastRow!.number;
//       const usedRows = currentRow - startRow + 1;
//       const padBeforeFooter = PAGE_HEIGHT - usedRows - FOOTER_HEIGHT;
//       for (let i = 0; i < padBeforeFooter; i++) {
//         sheet.addRow([]);
//       }

//       const footerStart = sheet.lastRow!.number + 1;

//       // ✅ Signature on last page only
//       if (pageIndex === chunks.length - 1) {
//         sheet.getCell(`A${footerStart}`).value = "Authorized Signature";
//         sheet.getCell(`I${footerStart}`).value = "Receiving Signature";
//       }

//       // ✅ Add Footer Image on Every Page
//       const footerImageId = workbook.addImage({
//         base64: footerBase64,
//         extension: "jpeg",
//       });

//       sheet.addImage(footerImageId, {
//         tl: { col: 0, row: footerStart + 1 },
//         ext: { width: 794, height: 60 },
//       });
//     }
//   }

//   // ✅ Export Excel File
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   saveAs(blob, `Challans_${new Date().toISOString().split("T")[0]}.xlsx`);
// };

// import type { FetchChallanParams } from "@/services/challan/challan.service";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const generateSingleSheetChallanExcel = async (
//   challans: FetchChallanParams[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Delivery Challans");

//   sheet.pageSetup = {
//     paperSize: 9,
//     orientation: "portrait",
//     margins: {
//       left: 0.5,
//       right: 0.5,
//       top: 0.75,
//       bottom: 0.75,
//       header: 0.3,
//       footer: 0.3,
//     },
//   };

//   sheet.properties.defaultRowHeight = 20;

//   const PAGE_HEIGHT = 40;
//   const HEADER_HEIGHT = 10;
//   const FOOTER_HEIGHT = 4;
//   const USABLE_ROWS = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

//   const borderStyle = {
//     top: { style: "thin" },
//     left: { style: "thin" },
//     bottom: { style: "thin" },
//     right: { style: "thin" },
//   };

//   for (const challan of challans) {
//     const items = challan.items;
//     const chunks: (typeof items)[] = [];

//     for (let i = 0; i < items.length; i += USABLE_ROWS) {
//       chunks.push(items.slice(i, i + USABLE_ROWS));
//     }

//     for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
//       const chunk = chunks[pageIndex];
//       const startRow = sheet.lastRow?.number ? sheet.lastRow.number + 4 : 1;

//       const logoImageId = workbook.addImage({
//         base64: logoBase64,
//         extension: "jpeg",
//       });

//       sheet.addImage(logoImageId, {
//         tl: { col: 8, row: startRow - 1 },
//         ext: { width: 300, height: 75 },
//       });

//       if (pageIndex === 0) {
//         sheet.mergeCells(`A${startRow}:D${startRow}`);
//         sheet.getCell(`A${startRow}`).value =
//           "Delivery Br.: " + challan.receivingBranchName;
//         sheet.getCell(`A${startRow}`).font = { bold: true, size: 12 };

//         sheet.mergeCells(`A${startRow + 1}:D${startRow + 1}`);
//         sheet.getCell(`A${startRow + 1}`).value = challan.bankName;
//         sheet.getCell(`A${startRow + 1}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 2}:D${startRow + 2}`);
//         sheet.getCell(`A${startRow + 2}`).value =
//           "Date: " +
//           new Date(challan.challanDate).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           });
//         sheet.getCell(`A${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 3}:D${startRow + 3}`);
//         sheet.getCell(`A${startRow + 3}`).value =
//           "Printed By: " + challan.vendorName;
//         sheet.getCell(`A${startRow + 3}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 4}:D${startRow + 4}`);
//         sheet.getCell(`A${startRow + 4}`).value =
//           "Courier: " + challan.courierName;
//         sheet.getCell(`A${startRow + 4}`).font = { bold: true, size: 10 };

//         sheet.getCell(`A${startRow + 5}`).value = "To";
//         sheet.getCell(`A${startRow + 5}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`A${startRow + 6}:C${startRow + 6}`);
//         sheet.getCell(`A${startRow + 6}`).value = "Manager";
//         sheet.getCell(`A${startRow + 6}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 2}:H${startRow + 2}`);
//         sheet.getCell(`E${startRow + 2}`).value =
//           "Challan No: " + challan.challanNumber;
//         sheet.getCell(`E${startRow + 2}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 3}:H${startRow + 3}`);
//         sheet.getCell(`E${startRow + 3}`).value = `Con: ${
//           challan.agentNum || "N/A"
//         }`;
//         sheet.getCell(`E${startRow + 3}`).font = { bold: true, size: 10 };

//         sheet.mergeCells(`E${startRow + 7}:H${startRow + 7}`);
//         sheet.getCell(`E${startRow + 7}`).value = "Delivery Challan";
//         sheet.getCell(`E${startRow + 7}`).font = { bold: true, size: 14 };
//       }

//       const headerRow = sheet.addRow([
//         "Sl.No",
//         "Account No",
//         "Account Name",
//         "Start No",
//         "End No",
//         "Cheque Type",
//         "Book Qty",
//         "Leaves",
//         "Serverity",
//         "Branch Name",
//       ]);
//       headerRow.eachCell((cell: any) => {
//         cell.font = { bold: true };
//         cell.border = borderStyle;
//       });

//       chunk.forEach((item, index) => {
//         const row = sheet.addRow([
//           index + 1 + pageIndex * USABLE_ROWS,
//           item.accountNo,
//           item.accountName,
//           item.startNo,
//           item.endNo,
//           item.chequeType,
//           item.bookQty,
//           item.leaves,
//           item.serverity,
//           item.branchName,
//         ]);
//         row.eachCell((cell: any) => {
//           cell.border = borderStyle;
//         });
//       });

//       const currentRow = sheet.lastRow!.number;
//       const usedRows = currentRow - startRow + 1;
//       const padBeforeFooter = PAGE_HEIGHT - usedRows - FOOTER_HEIGHT;
//       for (let i = 0; i < padBeforeFooter; i++) {
//         sheet.addRow([]);
//       }

//       const footerStart = sheet.lastRow!.number + 1;

//       // ✅ Footer summary table (only on last page)
//       if (pageIndex === chunks.length - 1) {
//         // ✅ Prepare summary data
//         const footerSummary: Record<string, number> = {};
//         let grandTotal = 0;

//         challan.items.forEach((item) => {
//           const key = `${item.chequeType}(${item.leaves})`;
//           footerSummary[key] = (footerSummary[key] || 0) + 1;
//           grandTotal += 1;
//         });

//         const footerKeys = Object.keys(footerSummary).sort((a, b) =>
//           a.localeCompare(b)
//         );

//         // ✅ Header row
//         const summaryHeaderRow = sheet.getRow(footerStart);
//         summaryHeaderRow.getCell(1).value = ""; // A blank
//         summaryHeaderRow.getCell(2).value = "Grand Total";
//         footerKeys.forEach((key, index) => {
//           summaryHeaderRow.getCell(3 + index).value = key;
//         });
//         summaryHeaderRow.eachCell((cell: any) => {
//           cell.font = { bold: true };
//           cell.border = borderStyle;
//         });
//         summaryHeaderRow.commit();

//         // ✅ Count row
//         const summaryCountRow = sheet.getRow(footerStart + 1);
//         summaryCountRow.getCell(1).value = "Total"; // A column
//         summaryCountRow.getCell(2).value = grandTotal;
//         footerKeys.forEach((key, index) => {
//           summaryCountRow.getCell(3 + index).value = footerSummary[key];
//         });
//         summaryCountRow.eachCell((cell: any) => {
//           cell.border = borderStyle;
//         });
//         summaryCountRow.commit();

//         // ✅ Signatures
//         sheet.getCell(`A${footerStart + 3}`).value = "Authorized Signature";
//         sheet.getCell(`I${footerStart + 3}`).value = "Receiving Signature";

//         // ✅ Footer image
//         const footerImageId = workbook.addImage({
//           base64: footerBase64,
//           extension: "jpeg",
//         });

//         sheet.addImage(footerImageId, {
//           tl: { col: 0, row: footerStart + 4 },
//           ext: { width: 794, height: 60 },
//         });
//       }
//     }
//   }

//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   saveAs(blob, `Challans_${new Date().toISOString().split("T")[0]}.xlsx`);
// };

import type { FetchChallanParams } from "@/services/challan/challan.service";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const generateSingleSheetChallanExcel = async (
  challans: FetchChallanParams[],
  logoBase64: string,
  footerBase64: string
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Delivery Challans");

  sheet.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    margins: {
      left: 0.5,
      right: 0.5,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    },
  };

  sheet.properties.defaultRowHeight = 20;

  const PAGE_HEIGHT = 40;
  const HEADER_HEIGHT = 10;
  const FOOTER_HEIGHT = 4;
  const USABLE_ROWS = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  for (const challan of challans) {
    const items = challan.items;
    const chunks: (typeof items)[] = [];

    for (let i = 0; i < items.length; i += USABLE_ROWS) {
      chunks.push(items.slice(i, i + USABLE_ROWS));
    }

    for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
      const chunk = chunks[pageIndex];
      const startRow = sheet.lastRow?.number ? sheet.lastRow.number + 4 : 1;

      const logoImageId = workbook.addImage({
        base64: logoBase64,
        extension: "jpeg",
      });

      sheet.addImage(logoImageId, {
        tl: { col: 8, row: startRow - 1 },
        ext: { width: 300, height: 75 },
      });

      if (pageIndex === 0) {
        sheet.mergeCells(`A${startRow}:D${startRow}`);
        sheet.getCell(`A${startRow}`).value =
          "Delivery Br.: " + challan.receivingBranchName;
        sheet.getCell(`A${startRow}`).font = { bold: true, size: 12 };

        sheet.mergeCells(`A${startRow + 1}:D${startRow + 1}`);
        sheet.getCell(`A${startRow + 1}`).value = challan.bankName;
        sheet.getCell(`A${startRow + 1}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`A${startRow + 2}:D${startRow + 2}`);
        sheet.getCell(`A${startRow + 2}`).value =
          "Date: " +
          new Date(challan.challanDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        sheet.getCell(`A${startRow + 2}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`A${startRow + 3}:D${startRow + 3}`);
        sheet.getCell(`A${startRow + 3}`).value =
          "Printed By: " + challan.vendorName;
        sheet.getCell(`A${startRow + 3}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`A${startRow + 4}:D${startRow + 4}`);
        sheet.getCell(`A${startRow + 4}`).value =
          "Courier: " + challan.courierName;
        sheet.getCell(`A${startRow + 4}`).font = { bold: true, size: 10 };

        sheet.getCell(`A${startRow + 5}`).value = "To";
        sheet.getCell(`A${startRow + 5}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`A${startRow + 6}:C${startRow + 6}`);
        sheet.getCell(`A${startRow + 6}`).value = "Manager";
        sheet.getCell(`A${startRow + 6}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`E${startRow + 2}:H${startRow + 2}`);
        sheet.getCell(`E${startRow + 2}`).value =
          "Challan No: " + challan.challanNumber;
        sheet.getCell(`E${startRow + 2}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`E${startRow + 3}:H${startRow + 3}`);
        sheet.getCell(`E${startRow + 3}`).value = `Con: ${
          challan.agentNum || "N/A"
        }`;
        sheet.getCell(`E${startRow + 3}`).font = { bold: true, size: 10 };

        sheet.mergeCells(`E${startRow + 7}:H${startRow + 7}`);
        sheet.getCell(`E${startRow + 7}`).value = "Delivery Challan";
        sheet.getCell(`E${startRow + 7}`).font = { bold: true, size: 14 };
      }

      const headerRow = sheet.addRow([
        "Sl.No",
        "Account No",
        "Account Name",
        "Start No",
        "End No",
        "Cheque Type",
        "Book Qty",
        "Leaves",
        "Serverity",
        "Branch Name",
      ]);
      headerRow.eachCell((cell: any) => {
        cell.font = { bold: true };
        cell.border = borderStyle;
      });

      chunk.forEach((item, index) => {
        const row = sheet.addRow([
          index + 1 + pageIndex * USABLE_ROWS,
          item.accountNo,
          item.accountName,
          item.startNo,
          item.endNo,
          item.chequeType,
          item.bookQty,
          item.leaves,
          item.serverity,
          item.branchName,
        ]);
        row.eachCell((cell: any) => {
          cell.border = borderStyle;
        });
      });

      // ✅ Add summary footer right after last data row
      const footerSummary: Record<string, number> = {};
      let grandTotal = 0;

      challan.items.forEach((item) => {
        const key = `${item.chequeType}(${item.leaves})`;
        footerSummary[key] = (footerSummary[key] || 0) + 1;
        grandTotal += 1;
      });

      const footerKeys = Object.keys(footerSummary).sort((a, b) =>
        a.localeCompare(b)
      );

      // Header row for summary
      const summaryHeaderRow = sheet.addRow([]);
      summaryHeaderRow.getCell(1).value = ""; // A column blank
      summaryHeaderRow.getCell(2).value = "Grand Total";
      footerKeys.forEach((key, index) => {
        summaryHeaderRow.getCell(3 + index).value = key;
      });
      summaryHeaderRow.eachCell((cell: any) => {
        cell.font = { bold: true };
        cell.border = borderStyle;
      });
      summaryHeaderRow.commit();

      // Count row
      const summaryCountRow = sheet.addRow([]);
      summaryCountRow.getCell(1).value = "Total"; // A column
      summaryCountRow.getCell(2).value = grandTotal;
      footerKeys.forEach((key, index) => {
        summaryCountRow.getCell(3 + index).value = footerSummary[key];
      });
      summaryCountRow.eachCell((cell: any) => {
        cell.border = borderStyle;
      });
      summaryCountRow.commit();

      // ✅ Signature
      const signatureRow = sheet.addRow([]);
      signatureRow.getCell(1).value = "Authorized Signature";
      signatureRow.getCell(9).value = "Receiving Signature";
      signatureRow.commit();

      // ✅ Footer image
      const footerImageId = workbook.addImage({
        base64: footerBase64,
        extension: "jpeg",
      });
      sheet.addImage(footerImageId, {
        tl: { col: 0, row: sheet.lastRow!.number + 1 },
        ext: { width: 794, height: 60 },
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Challans_${new Date().toISOString().split("T")[0]}.xlsx`);
};
