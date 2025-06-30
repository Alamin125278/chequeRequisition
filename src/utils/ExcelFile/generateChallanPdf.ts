// import type { FetchChallanParams } from "@/services/challan/challan.service";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.vfs;

// export const generateChallanPdf = (challans: FetchChallanParams[]) => {
//   const docDefinition: any = {
//     pageSize: "A4",
//     pageMargins: [40, 60, 40, 80], // Increased bottom margin for footer space
//     content: [],
//     styles: {
//       subheader: { fontSize: 12, margin: [0, 0, 0, 4] },
//       tableHeader: { bold: true, fillColor: "#eeeeee" },
//     },
//     defaultStyle: {
//       fontSize: 10,
//     },
//     footer: (currentPage: number, pageCount: number) => {
//       return {
//         margin: [40, 0, 40, 20],
//         columns: [
//           {
//             text: "Authorized Signature",
//             alignment: "left",
//             margin: [0, 20, 0, 0],
//           },
//           {
//             text: "Receiving Signature",
//             alignment: "right",
//             margin: [0, 20, 0, 0],
//           },
//         ],
//       };
//     },
//   };

//   challans.forEach((challan, index) => {
//     const itemsPerPage = 18;
//     const totalPages = Math.ceil(challan.items.length / itemsPerPage);

//     for (let page = 0; page < totalPages; page++) {
//       const itemsChunk = challan.items.slice(
//         page * itemsPerPage,
//         (page + 1) * itemsPerPage
//       );

//       const tableBody = [
//         [
//           { text: "Account No", style: "tableHeader" },
//           { text: "Account Name", style: "tableHeader" },
//           { text: "Start No", style: "tableHeader" },
//           { text: "End No", style: "tableHeader" },
//           { text: "Cheque Type", style: "tableHeader" },
//           { text: "Book Qty", style: "tableHeader" },
//           { text: "Leaves", style: "tableHeader" },
//           { text: "Serverity", style: "tableHeader" },
//           { text: "Branch Name", style: "tableHeader" },
//         ],
//         ...itemsChunk.map((item: any) => [
//           item.accountNo,
//           item.accountName,
//           item.startNo,
//           item.endNo,
//           item.chequeType,
//           item.bookQty.toString(),
//           item.leaves.toString(),
//           item.serverity.toString(),
//           item.branchName,
//         ]),
//       ];

//       const contentPage: any[] = [];

//       if (page === 0) {
//         contentPage.push(
//           { text: `Bank Name: ${challan.bankName}`, style: "subheader" },
//           {
//             text: `Challan Number: ${challan.challanNumber}`,
//             style: "subheader",
//           },
//           { text: `Challan Date: ${challan.challanDate}`, style: "subheader" },
//           { text: `Vendor: ${challan.vendorName}`, style: "subheader" },
//           { text: `Courier: ${challan.courierName}`, style: "subheader" },
//           {
//             text: `Receiving Branch: ${challan.receivingBranchName}`,
//             style: "subheader",
//           },
//           { text: `Branch: ${challan.branchName}`, style: "subheader" },
//           { text: " ", margin: [0, 0, 0, 10] }
//         );
//       }

//       contentPage.push({
//         table: {
//           headerRows: 1,
//           widths: [
//             "auto",
//             "*",
//             "auto",
//             "auto",
//             "auto",
//             "auto",
//             "auto",
//             "auto",
//             "*",
//           ],
//           body: tableBody,
//         },
//         layout: "lightHorizontalLines",
//       });

//       docDefinition.content.push(...contentPage);

//       if (!(index === challans.length - 1 && page === totalPages - 1)) {
//         docDefinition.content.push({ text: "", pageBreak: "after" });
//       }
//     }
//   });

//   pdfMake.createPdf(docDefinition).download("Challan_Export.pdf");
// };

// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// export const generateChallanPdf = async (
//   challans: any[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const pdfDoc = await PDFDocument.create();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
//   const footerBytes = await fetch(footerBase64).then((res) =>
//     res.arrayBuffer()
//   );

//   const logoImage = await pdfDoc.embedJpg(logoBytes);
//   const footerImage = await pdfDoc.embedJpg(footerBytes);

//   const pageWidth = 595.28;
//   const pageHeight = 841.89;

//   const marginX = 40;
//   const marginY = 40;
//   const lineHeight = 16;

//   const colWidths = [40, 60, 80, 50, 50, 60, 50, 40, 50, 80];
//   const tableXStart = marginX;
//   const tableYStart = pageHeight - 200;

//   for (const challan of challans) {
//     let page = pdfDoc.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY;

//     // ✅ Header Logo
//     page.drawImage(logoImage, {
//       x: pageWidth - 180,
//       y: y - 50,
//       width: 140,
//       height: 40,
//     });

//     y -= 60;
//     const drawText = (
//       text: string,
//       x: number,
//       y: number,
//       bold = false,
//       size = 10
//     ) => {
//       page.drawText(text, {
//         x,
//         y,
//         size,
//         font: bold ? fontBold : font,
//         color: rgb(0, 0, 0),
//       });
//     };

//     drawText(`Delivery Br.: ${challan.receivingBranchName}`, marginX, y, true);
//     y -= lineHeight;
//     drawText(`${challan.bankName}`, marginX, y);
//     y -= lineHeight;
//     drawText(
//       `Date: ${new Date(challan.challanDate).toLocaleDateString()}`,
//       marginX,
//       y
//     );
//     drawText(`Challan No: ${challan.challanNumber}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Printed By: ${challan.vendorName}`, marginX, y);
//     drawText(`Con: ${challan.agentNum || "N/A"}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Courier: ${challan.courierName}`, marginX, y);
//     y -= lineHeight;

//     drawText("Delivery Challan", pageWidth / 2 - 60, y, true, 14);
//     y -= 30;

//     // ✅ Table Header
//     const tableHeaders = [
//       "Sl.No",
//       "Account No",
//       "Account Name",
//       "Start No",
//       "Books X Lvs",
//       "End No",
//       "A/C Type",
//       "Satus",
//       "Cus.Branch",
//     ];
//     let x = tableXStart;
//     tableHeaders.forEach((header, i) => {
//       drawText(header, x + 2, y, true);
//       x += colWidths[i];
//     });
//     y -= lineHeight;

//     const drawRow = (rowData: string[]) => {
//       let x = tableXStart;
//       rowData.forEach((text, i) => {
//         page.drawText(String(text), { x: x + 2, y, size: 9, font });
//         // border
//         page.drawRectangle({
//           x,
//           y: y - 2,
//           width: colWidths[i],
//           height: lineHeight,
//           borderWidth: 0.5,
//           color: rgb(1, 1, 1),
//           borderColor: rgb(0.8, 0.8, 0.8),
//         });
//         x += colWidths[i];
//       });
//     };

//     const summary: Record<string, number> = {};
//     let sl = 1;

//     for (const item of challan.items || []) {
//       if (y < 120) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = pageHeight - marginY;
//       }

//       const acLabel = `${item.chequeType}(${item.leaves})`;
//       summary[acLabel] = (summary[acLabel] || 0) + 1;
//       var bookQty = item.bookQty;
//       var leaves = item.leaves;
//       var bookXlvs = bookQty + "X" + leaves;
//       var status = "";
//       if (item.serverity == 1) {
//         status = "Urgent";
//       } else {
//         status = "Normal";
//       }
//       const row = [
//         sl,
//         item.accountNo,
//         item.accountName,
//         item.startNo,
//         bookXlvs,
//         item.endNo,
//         item.chequeType,
//         status,
//         item.branchName,
//       ];
//       drawRow(row);
//       y -= lineHeight;
//       sl++;
//     }

//     // ✅ Table Footer Summary
//     y -= 10;
//     const footerRowY = y;
//     const keys = Object.keys(summary);
//     const total = Object.values(summary).reduce((a, b) => a + b, 0);

//     drawText("Total", tableXStart, y, true);
//     drawText("Grand Total", tableXStart + 70, y);
//     drawText(`${total}`, tableXStart + 160, y);

//     let fx = tableXStart + 250;
//     keys.forEach((key) => {
//       drawText(key, fx, y);
//       drawText(`${summary[key]}`, fx, y - lineHeight);
//       fx += 90;
//     });

//     // ✅ Signatures - Only if space allows, otherwise go to next page
//     if (y - 60 < 80) {
//       page = pdfDoc.addPage([pageWidth, pageHeight]);
//       y = pageHeight - marginY;
//     }

//     // ✅ Signatures
//     y -= 60;
//     drawText("Authorized Signature", marginX, y);
//     drawText("Receiving Signature", pageWidth - marginX - 150, y);

//     // ✅ Footer Image
//     page.drawImage(footerImage, {
//       x: marginX,
//       y: 20,
//       width: pageWidth - marginX * 2,
//       height: 40,
//     });
//   }

//   // ✅ Save and download
//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
//   link.click();
// };

// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// // ✅ Main function
// export const generateChallanPdf = async (
//   challans: any[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const pdfDoc = await PDFDocument.create();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
//   const footerBytes = await fetch(footerBase64).then((res) =>
//     res.arrayBuffer()
//   );

//   const logoImage = await pdfDoc.embedJpg(logoBytes);
//   const footerImage = await pdfDoc.embedJpg(footerBytes);

//   // ✅ Page dimensions
//   const pageWidth = 595.28;
//   const pageHeight = 841.89;
//   const marginX = 20;
//   const marginY = 40;
//   const lineHeight = 20;

//   // ✅ Column widths (header and row এর জন্য)
//   const colWidths = [10, 100, 110, 50, 70, 50, 60, 40, 90];
//   const tableXStart = marginX;

//   for (const challan of challans) {
//     let page = pdfDoc.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY;

//     // ✅ Header Logo
//     page.drawImage(logoImage, {
//       x: pageWidth - 180,
//       y: y - 50,
//       width: 140,
//       height: 40,
//     });

//     y -= 60;

//     // ✅ drawText helper function
//     const drawText = (
//       text: string,
//       x: number,
//       y: number,
//       bold = false,
//       size = 10
//     ) => {
//       page.drawText(text, {
//         x,
//         y,
//         size,
//         font: bold ? fontBold : font,
//         color: rgb(0, 0, 0),
//       });
//     };

//     // ✅ Header info
//     drawText(`Delivery Br.: ${challan.receivingBranchName}`, marginX, y, true);
//     y -= lineHeight;
//     drawText(`${challan.bankName}`, marginX, y);
//     y -= lineHeight;
//     drawText(
//       `Date: ${new Date(challan.challanDate).toLocaleDateString()}`,
//       marginX,
//       y
//     );
//     drawText(`Challan No: ${challan.challanNumber}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Printed By: ${challan.vendorName}`, marginX, y);
//     drawText(`Con: ${challan.agentNum || "N/A"}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Courier: ${challan.courierName}`, marginX, y);

//     y -= lineHeight;
//     drawText("Delivery Challan", pageWidth / 2 - 60, y, true, 14);
//     y -= lineHeight * 2;

//     // ✅ Table Header
//     const headers = [
//       "Sl.No",
//       "Account No",
//       "Account Name",
//       "Start No",
//       "Books X Lvs",
//       "End No",
//       "A/C Type",
//       "Status",
//       "Cus.Branch",
//     ];

//     let x = tableXStart;
//     headers.forEach((header, i) => {
//       const width = colWidths[i];

//       // Header Cell Box
//       page.drawRectangle({
//         x,
//         y: y - lineHeight,
//         width,
//         height: lineHeight,
//         color: rgb(1, 1, 1),
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//       });

//       // Header Text
//       drawText(header, x + 3, y - 14, true);
//       x += width;
//     });

//     y -= lineHeight;

//     // ✅ Table Row Drawing Function
//     const drawRow = (rowData: (string | number)[]) => {
//       let x = tableXStart;
//       rowData.forEach((text, i) => {
//         const cellWidth = colWidths[i];

//         // Row cell border
//         page.drawRectangle({
//           x,
//           y: y - lineHeight,
//           width: cellWidth,
//           height: lineHeight,
//           color: rgb(1, 1, 1),
//           borderColor: rgb(0.75, 0.75, 0.75),
//           borderWidth: 0.5,
//         });

//         // Row text
//         page.drawText(String(text ?? ""), {
//           x: x + 3,
//           y: y - 14,
//           size: 9,
//           font,
//           color: rgb(0, 0, 0),
//         });

//         x += cellWidth;
//       });
//     };

//     // ✅ Draw rows
//     const summary: Record<string, number> = {};
//     let sl = 1;

//     for (const item of challan.items || []) {
//       if (y < 150) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = pageHeight - marginY;
//       }

//       const acLabel = `${item.chequeType}(${item.leaves})`;
//       summary[acLabel] = (summary[acLabel] || 0) + 1;

//       const bookXlvs = `${item.bookQty}X${item.leaves}`;
//       const status = item.serverity === 1 ? "Urgent" : "Normal";

//       const row = [
//         sl,
//         item.accountNo || "",
//         item.accountName || "",
//         item.startNo || "",
//         bookXlvs,
//         item.endNo || "",
//         item.chequeType || "",
//         status,
//         item.branchName || "",
//       ];
//       drawRow(row);
//       y -= lineHeight;
//       sl++;
//     }

//     // ✅ Summary
//     y -= 20;
//     drawText("Summary:", marginX, y, true);

//     const keys = Object.keys(summary);
//     const total = Object.values(summary).reduce((a, b) => a + b, 0);
//     y -= lineHeight;

//     drawText("Total:", marginX + 20, y);
//     drawText(`${total}`, marginX + 70, y);

//     let sx = marginX + 150;
//     keys.forEach((key) => {
//       drawText(`${key}:`, sx, y);
//       drawText(`${summary[key]}`, sx + 50, y);
//       sx += 120;
//     });

//     // ✅ Signatures
//     y -= 60;
//     drawText("Authorized Signature", marginX, y);
//     drawText("Receiving Signature", pageWidth - marginX - 150, y);

//     // ✅ Footer Image
//     page.drawImage(footerImage, {
//       x: marginX,
//       y: 20,
//       width: pageWidth - marginX * 2,
//       height: 40,
//     });
//   }

//   // ✅ Save and trigger download
//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
//   link.click();
// };

// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// export const generateChallanPdf = async (
//   challans: any[],
//   logoBase64: string,
//   footerBase64: string
// ) => {
//   const pdfDoc = await PDFDocument.create();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
//   const footerBytes = await fetch(footerBase64).then((res) =>
//     res.arrayBuffer()
//   );

//   const logoImage = await pdfDoc.embedJpg(logoBytes);
//   const footerImage = await pdfDoc.embedJpg(footerBytes);

//   const pageWidth = 595.28;
//   const pageHeight = 841.89;
//   const marginX = 15;
//   const marginY = 40;
//   const lineHeight = 22;

//   // ✅ Updated column widths
//   const colWidths = [25, 85, 110, 50, 55, 50, 50, 45, 95];
//   const tableXStart = marginX;

//   for (const challan of challans) {
//     let page = pdfDoc.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY;

//     // ✅ Header Logo
//     page.drawImage(logoImage, {
//       x: pageWidth - 180,
//       y: y - 50,
//       width: 140,
//       height: 40,
//     });

//     y -= 60;

//     const drawText = (
//       text: string,
//       x: number,
//       y: number,
//       bold = false,
//       size = 10
//     ) => {
//       page.drawText(text, {
//         x,
//         y,
//         size,
//         font: bold ? fontBold : font,
//         color: rgb(0, 0, 0),
//       });
//     };

//     const truncateText = (text: string, maxLength: number) =>
//       text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;

//     // ✅ Header Info
//     drawText(`Delivery Br.: ${challan.receivingBranchName}`, marginX, y, true);
//     y -= lineHeight;
//     drawText(`${challan.bankName}`, marginX, y);
//     y -= lineHeight;
//     drawText(
//       `Date: ${new Date(challan.challanDate).toLocaleDateString()}`,
//       marginX,
//       y
//     );
//     drawText(`Challan No: ${challan.challanNumber}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Printed By: ${challan.vendorName}`, marginX, y);
//     drawText(`Con: ${challan.agentNum || "N/A"}`, pageWidth - 200, y);
//     y -= lineHeight;
//     drawText(`Courier: ${challan.courierName}`, marginX, y);

//     y -= lineHeight;
//     drawText("Delivery Challan", pageWidth / 2 - 60, y, true, 14);
//     y -= lineHeight * 2;

//     const headers = [
//       "Sl.No",
//       "Account No",
//       "Account Name",
//       "Start No",
//       "Books X Lvs",
//       "End No",
//       "A/C Type",
//       "Status",
//       "Cus.Branch",
//     ];

//     const drawTableHeader = () => {
//       let x = tableXStart;
//       headers.forEach((header, i) => {
//         const width = colWidths[i];
//         page.drawRectangle({
//           x,
//           y: y - lineHeight,
//           width,
//           height: lineHeight,
//           color: rgb(1, 1, 1),
//           borderColor: rgb(0, 0, 0),
//           borderWidth: 0.5,
//         });
//         drawText(header, x + 3, y - 15, true, 7);
//         x += width;
//       });
//       y -= lineHeight;
//     };

//     drawTableHeader();

//     const drawRow = (rowData: (string | number)[]) => {
//       let x = tableXStart;
//       rowData.forEach((text, i) => {
//         const cellWidth = colWidths[i];
//         page.drawRectangle({
//           x,
//           y: y - lineHeight,
//           width: cellWidth,
//           height: lineHeight,
//           color: rgb(1, 1, 1),
//           borderColor: rgb(0.75, 0.75, 0.75),
//           borderWidth: 0.5,
//         });

//         const maxChars = Math.floor(cellWidth / 6); // Adjust char width based on width
//         page.drawText(truncateText(String(text ?? ""), maxChars), {
//           x: x + 3,
//           y: y - 15,
//           size: 7,
//           font,
//           color: rgb(0, 0, 0),
//         });

//         x += cellWidth;
//       });
//     };

//     // ✅ Draw rows
//     const summary: Record<string, number> = {};
//     let sl = 1;

//     for (const item of challan.items || []) {
//       if (y < 150) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = pageHeight - marginY;

//         drawTableHeader(); // Redraw header on new page
//       }

//       const acLabel = `${item.chequeType}(${item.leaves})`;
//       summary[acLabel] = (summary[acLabel] || 0) + 1;

//       const bookXlvs = `${item.bookQty}X${item.leaves}`;
//       const status = item.serverity === 1 ? "Urgent" : "Normal";

//       const row = [
//         sl,
//         item.accountNo || "",
//         item.accountName || "",
//         item.startNo || "",
//         bookXlvs,
//         item.endNo || "",
//         item.chequeType || "",
//         status,
//         item.branchName || "",
//       ];
//       drawRow(row);
//       y -= lineHeight;
//       sl++;
//     }

//     // ✅ Summary
//     // 🟥 Summary Section
//     y -= 20;
//     const summaryHeaders = ["Total", ...Object.keys(summary)];
//     const summaryValues = [`${sl - 1}`, ...Object.values(summary).map(String)];
//     const summaryColWidth = 80;
//     const summaryRowHeight = 20;

//     let sx = marginX;
//     summaryHeaders.forEach((header, i) => {
//       // Header cell box
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(1, 1, 1),
//       });

//       // Header text
//       page.drawText(header, {
//         x: sx + 5,
//         y: y - 15,
//         size: 9,
//         font: fontBold,
//         color: rgb(0, 0, 0),
//       });

//       sx += summaryColWidth;
//     });

//     // Value row
//     sx = marginX;
//     summaryValues.forEach((val, i) => {
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight * 2,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(1, 1, 1),
//       });

//       page.drawText(val, {
//         x: sx + 5,
//         y: y - summaryRowHeight - 15,
//         size: 9,
//         font,
//         color: rgb(0, 0, 0),
//       });

//       sx += summaryColWidth;
//     });

//     // Update y position after table
//     y -= summaryRowHeight * 2 + 20;

//     // ✅ Signatures
//     // 🖋️ Signatures
//     drawText("Authorized Signature", marginX + 20, 100);
//     drawText("Receiving Signature", pageWidth - marginX - 150, 100);

//     // 🖼️ Footer Image (fixed position)
//     page.drawImage(footerImage, {
//       x: marginX,
//       y: 20,
//       width: pageWidth - marginX * 2,
//       height: 40,
//     });
//   }

//   // ✅ Save and Download
//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
//   link.click();
// };

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generateChallanPdf = async (
  challans: any[],
  logoBase64: string,
  footerBase64: string
) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
  const footerBytes = await fetch(footerBase64).then((res) =>
    res.arrayBuffer()
  );

  const logoImage = await pdfDoc.embedJpg(logoBytes);
  const footerImage = await pdfDoc.embedJpg(footerBytes);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 15;
  const marginY = 40;
  const lineHeight = 22;
  const colWidths = [25, 85, 110, 50, 55, 50, 50, 45, 95];
  const tableXStart = marginX;

  for (const challan of challans) {
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - marginY;
    let isBreakdownPage = false;

    const drawHeaderFooter = () => {
      // Header logo
      page.drawImage(logoImage, {
        x: pageWidth - 180,
        y: pageHeight - 70,
        width: 140,
        height: 60,
      });

      // Footer image
      page.drawImage(footerImage, {
        x: marginX,
        y: 20,
        width: pageWidth - marginX * 2,
        height: 40,
      });
    };

    drawHeaderFooter();

    const drawText = (
      text: string,
      x: number,
      y: number,
      bold = false,
      size = 10
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color: rgb(0, 0, 0),
      });
    };

    const truncateText = (text: string, maxLength: number) =>
      text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;

    // Header Info
    drawText(`${challan.receivingBranchName}`, marginX, y, true);
    y -= lineHeight;
    drawText(`${challan.bankName}`, marginX, y, true);
    y -= lineHeight;
    drawText(
      `Date: ${new Date(challan.challanDate).toLocaleDateString()}`,
      marginX,
      y,
      true
    );
    drawText(`Challan No: ${challan.challanNumber}`, pageWidth - 200, y, true);
    y -= lineHeight;
    drawText(`Printed By: ${challan.vendorName}`, marginX, y);
    drawText(`Con: ${challan.agentNum || "N/A"}`, pageWidth - 200, y);
    y -= lineHeight;
    drawText(`Courier: ${challan.courierName}`, marginX, y);
    y -= lineHeight;
    drawText("Delivery Challan", pageWidth / 2 - 60, y, true, 14);
    y -= lineHeight * 2;

    const headers = [
      "Sl.No",
      "Account No",
      "Account Name",
      "Start No",
      "Books X Lvs",
      "End No",
      "A/C Type",
      "Status",
      "Cus.Branch",
    ];

    const drawTableHeader = () => {
      let x = tableXStart;
      headers.forEach((header, i) => {
        const width = colWidths[i];
        page.drawRectangle({
          x,
          y: y - lineHeight,
          width,
          height: lineHeight,
          color: rgb(1, 1, 1),
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5,
        });
        drawText(header, x + 3, y - 15, true, 7);
        x += width;
      });
      y -= lineHeight;
    };

    drawTableHeader();

    const drawRow = (rowData: (string | number)[]) => {
      let x = tableXStart;
      rowData.forEach((text, i) => {
        const cellWidth = colWidths[i];
        page.drawRectangle({
          x,
          y: y - lineHeight,
          width: cellWidth,
          height: lineHeight,
          color: rgb(1, 1, 1),
          borderColor: rgb(0.75, 0.75, 0.75),
          borderWidth: 0.5,
        });

        const maxChars = Math.floor(cellWidth / 6);
        page.drawText(truncateText(String(text ?? ""), maxChars), {
          x: x + 3,
          y: y - 15,
          size: 7,
          font,
          color: rgb(0, 0, 0),
        });

        x += cellWidth;
      });
    };

    const summary: Record<string, number> = {};
    let sl = 1;

    for (const item of challan.items || []) {
      if (y < 150) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        isBreakdownPage = true;
        if (isBreakdownPage) {
          y = pageHeight - 100;
        } else {
          y = pageHeight - marginY;
        }
        drawHeaderFooter();
        drawTableHeader();
      }

      const acLabel = `${item.chequeType}(${item.leaves})`;
      summary[acLabel] = (summary[acLabel] || 0) + 1;

      const bookXlvs = `${item.bookQty}X${item.leaves}`;
      const status = item.serverity === 1 ? "Urgent" : "Normal";

      const row = [
        sl,
        item.accountNo || "",
        item.accountName || "",
        item.startNo || "",
        bookXlvs,
        item.endNo || "",
        item.chequeType || "",
        status,
        item.branchName || "",
      ];
      drawRow(row);
      y -= lineHeight;
      sl++;
    }

    // Summary Section
    y -= 20;
    const summaryHeaders = ["#", ...Object.keys(summary), "Grand Total"];
    const summaryValues = [
      "Total",
      ...Object.values(summary).map(String),
      `${sl - 1}`,
    ];
    const summaryColWidth = 80;
    const summaryRowHeight = 20;

    let sx = marginX;
    summaryHeaders.forEach((header) => {
      page.drawRectangle({
        x: sx,
        y: y - summaryRowHeight,
        width: summaryColWidth,
        height: summaryRowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
        color: rgb(1, 1, 1),
      });
      drawText(header, sx + 5, y - 15, true, 9);
      sx += summaryColWidth;
    });

    sx = marginX;
    summaryValues.forEach((val) => {
      page.drawRectangle({
        x: sx,
        y: y - summaryRowHeight * 2,
        width: summaryColWidth,
        height: summaryRowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
        color: rgb(1, 1, 1),
      });
      drawText(val, sx + 5, y - summaryRowHeight - 15, false, 9);
      sx += summaryColWidth;
    });

    y -= summaryRowHeight * 2 + 20;

    // Signature only if no breakdown OR only on breakdown page
    if (!isBreakdownPage || y > 140) {
      drawText("Authorized Signature", marginX + 40, 100);
      drawText("Receiving Signature", pageWidth - marginX - 150, 100);
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
  link.click();
};
