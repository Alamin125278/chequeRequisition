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
//   const colWidths = [25, 85, 110, 50, 55, 50, 50, 45, 95];
//   const tableXStart = marginX;

//   for (const challan of challans) {
//     let page = pdfDoc.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY;
//     let isBreakdownPage = false;

//     const drawHeaderFooter = () => {
//       // Header logo
//       page.drawImage(logoImage, {
//         x: pageWidth - 180,
//         y: pageHeight - 70,
//         width: 140,
//         height: 60,
//       });

//       // Footer image
//       page.drawImage(footerImage, {
//         x: marginX,
//         y: 20,
//         width: pageWidth - marginX * 2,
//         height: 40,
//       });
//     };

//     drawHeaderFooter();

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

//     // Header Info
//     drawText(`${challan.receivingBranchName}`, marginX, y, true);
//     y -= lineHeight;
//     drawText(`${challan.bankName}`, marginX, y, true);
//     y -= lineHeight;
//     drawText(
//       `Date: ${new Date(challan.challanDate).toLocaleDateString()}`,
//       marginX,
//       y,
//       true
//     );
//     drawText(`Challan No: ${challan.challanNumber}`, pageWidth - 200, y, true);
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

//         const maxChars = Math.floor(cellWidth / 6);
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

//     const summary: Record<string, number> = {};
//     let sl = 1;

//     for (const item of challan.items || []) {
//       if (y < 150) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         isBreakdownPage = true;
//         if (isBreakdownPage) {
//           y = pageHeight - 100;
//         } else {
//           y = pageHeight - marginY;
//         }
//         drawHeaderFooter();
//         drawTableHeader();
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

//     // Summary Section
//     y -= 20;
//     const summaryHeaders = ["#", ...Object.keys(summary), "Grand Total"];
//     const summaryValues = [
//       "Total",
//       ...Object.values(summary).map(String),
//       `${sl - 1}`,
//     ];
//     const summaryColWidth = 80;
//     const summaryRowHeight = 20;

//     let sx = marginX;
//     summaryHeaders.forEach((header) => {
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(1, 1, 1),
//       });
//       drawText(header, sx + 5, y - 15, true, 9);
//       sx += summaryColWidth;
//     });

//     sx = marginX;
//     summaryValues.forEach((val) => {
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight * 2,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(1, 1, 1),
//       });
//       drawText(val, sx + 5, y - summaryRowHeight - 15, false, 9);
//       sx += summaryColWidth;
//     });

//     y -= summaryRowHeight * 2 + 20;

//     // Signature only if no breakdown OR only on breakdown page
//     if (!isBreakdownPage || y > 140) {
//       drawText("Authorized Signature", marginX + 40, 100);
//       drawText("Receiving Signature", pageWidth - marginX - 150, 100);
//     }
//   }

//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
//   link.click();
// };

// Update the UI
// import {
//   PDFDocument,
//   PDFFont,
//   PDFImage,
//   PDFPage,
//   rgb,
//   StandardFonts,
//   type Color,
// } from "pdf-lib"; // Added 'Color' import

// // Define interfaces for better type safety
// interface ChallanItem {
//   accountNo?: string;
//   accountName?: string;
//   startNo?: string;
//   bookQty: number;
//   leaves: number;
//   endNo?: string;
//   chequeType?: string;
//   serverity: number; // Assuming 1 for Urgent, others for Normal
//   branchName?: string;
// }

// interface Challan {
//   bankName: string;
//   receivingBranchName: string;
//   challanDate: string; // Assuming ISO string or similar
//   vendorName?: string;
//   courierName?: string;
//   challanNumber: string;
//   branchName: string;
//   agentNum?: string | null;
//   items?: ChallanItem[];
// }

// interface DrawWrappedTextOptions {
//   font: PDFFont;
//   size: number;
//   color?: Color; // Changed type from '[number, number, number]' to 'Color'
//   maxWidth: number;
//   lineHeight: number;
//   alignment?: "left" | "center" | "right";
//   bold?: boolean;
// }

// export const generateChallanPdf = async (
//   challans: Challan[],
//   logoBase64: string,
//   footerBase64: string
// ): Promise<void> => {
//   const pdfDoc = await PDFDocument.create();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   // Fetch image bytes from base64 strings
//   // Assuming logoBase64 and footerBase64 are actual data URLs (e.g., "data:image/jpeg;base64,...")
//   const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
//   const footerBytes = await fetch(footerBase64).then((res) =>
//     res.arrayBuffer()
//   );

//   const logoImage: PDFImage = await pdfDoc.embedJpg(logoBytes);
//   const footerImage: PDFImage = await pdfDoc.embedJpg(footerBytes);

//   const pageWidth = 595.28; // A4 width
//   const pageHeight = 841.89; // A4 height
//   const marginX = 30; // Increased margin for better look
//   const marginY = 40;
//   const headerSectionHeight = 150; // Height reserved for top header info
//   const footerSectionHeight = 60; // Height reserved for footer image and signatures

//   // Adjusted column widths for better text fitting, especially Account Name and Cus.Branch
//   const colWidths = [
//     25, // Sl.No
//     80, // Account No
//     130, // Account Name (more space)
//     45, // Start No
//     50, // Books X Lvs
//     45, // End No
//     50, // A/C Type
//     40, // Status
//     70, // Cus.Branch (adjusted to fit total width)
//   ];
//   const tableWidth = colWidths.reduce((sum, w) => sum + w, 0); // Sum of column widths should be pageWidth - 2 * marginX
//   const tableXStart = marginX;
//   const tableRowPadding = 3; // Padding inside table cells

//   // Helper function to draw text, including wrapping
//   const drawWrappedText = (
//     page: PDFPage,
//     text: string | number | null | undefined, // Allow null/undefined for convenience
//     x: number,
//     y: number,
//     options: DrawWrappedTextOptions
//   ): number => {
//     const {
//       font,
//       size,
//       color = rgb(0, 0, 0), // This will now correctly assign an RGB object
//       maxWidth,
//       lineHeight,
//       alignment = "left",
//       bold = false,
//     } = options;

//     if (text === null || text === undefined || String(text).trim() === "")
//       return 0; // Return 0 height if no text or empty string

//     const textString = String(text);
//     const textFont = bold ? fontBold : font;
//     const words = textString.split(" ");
//     let currentLine = "";
//     let lines: string[] = [];

//     for (let i = 0; i < words.length; i++) {
//       const word = words[i];
//       const testLine =
//         currentLine.length === 0 ? word : `${currentLine} ${word}`;
//       const textWidth = textFont.widthOfTextAtSize(testLine, size);

//       if (maxWidth && textWidth > maxWidth && currentLine.length > 0) {
//         lines.push(currentLine);
//         currentLine = word;
//       } else {
//         currentLine = testLine;
//       }
//     }
//     lines.push(currentLine);

//     let currentY = y;
//     lines.forEach((line) => {
//       let lineX = x;
//       const lineWidth = textFont.widthOfTextAtSize(line, size);
//       if (alignment === "center") {
//         lineX = x + (maxWidth - lineWidth) / 2;
//       } else if (alignment === "right") {
//         lineX = x + maxWidth - lineWidth;
//       }

//       page.drawText(line, {
//         x: lineX,
//         y: currentY,
//         font: textFont,
//         size,
//         color, // This will now be of type Color (RGB)
//       });
//       currentY -= lineHeight;
//     });

//     return lines.length * lineHeight; // Return total height used
//   };

//   for (const challan of challans) {
//     let page: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY; // Starting Y position for content
//     const footerY = 50;

//     // Function to draw header and footer on each page
//     const drawHeaderFooter = (currentPage: PDFPage) => {
//       // Header logo
//       currentPage.drawImage(logoImage, {
//         x: pageWidth - 180,
//         y: pageHeight - 70,
//         width: 140,
//         height: 60,
//       });

//       // Footer image
//       currentPage.drawImage(footerImage, {
//         x: marginX,
//         y: footerY,
//         width: pageWidth - marginX * 2,
//         height: 30,
//       });
//     };

//     drawHeaderFooter(page);

//     // Header Info
//     drawWrappedText(page, challan.receivingBranchName, marginX, y, {
//       font,
//       size: 12,
//       bold: true,
//       maxWidth: pageWidth / 2 - marginX,
//       lineHeight: 15,
//     });
//     y -= 15; // Smaller line height for header info
//     drawWrappedText(page, challan.bankName, marginX, y, {
//       font,
//       size: 12,
//       bold: true,
//       maxWidth: pageWidth / 2 - marginX,
//       lineHeight: 15,
//     });
//     y -= 15;

//     // Date and Challan No. on the same line, right aligned for Challan No.
//     const dateText = `Date: ${new Date(
//       challan.challanDate
//     ).toLocaleDateString()}`;
//     const challanNoText = `Challan No: ${challan.challanNumber}`;
//     drawWrappedText(page, dateText, marginX, y, {
//       font,
//       size: 10,
//       bold: true,
//       maxWidth: pageWidth / 2 - marginX,
//       lineHeight: 12,
//     });
//     y -= 15;

//     drawWrappedText(
//       page,
//       `Printed By: ${challan.vendorName || "N/A"}`,
//       marginX,
//       y,
//       { font, size: 9, maxWidth: pageWidth / 2 - marginX, lineHeight: 12 }
//     );
//     drawWrappedText(
//       page,
//       challanNoText,
//       pageWidth - marginX - fontBold.widthOfTextAtSize(challanNoText, 10),
//       y,
//       {
//         font,
//         size: 10,
//         bold: true,
//         maxWidth: pageWidth / 2 - marginX,
//         lineHeight: 12,
//       }
//     );
//     y -= 15;

//     drawWrappedText(
//       page,
//       `Courier: ${challan.courierName || "N/A"}`,
//       marginX,
//       y,
//       { font, size: 9, maxWidth: pageWidth / 2 - marginX, lineHeight: 12 }
//     );
//     drawWrappedText(
//       page,
//       `Con: ${challan.agentNum || "N/A"}`,
//       pageWidth -
//         marginX -
//         font.widthOfTextAtSize(`Con: ${challan.agentNum || "N/A"}`, 9),
//       y,
//       { font, size: 9, maxWidth: pageWidth / 2 - marginX, lineHeight: 12 }
//     );
//     y -= 25; // More space before "Delivery Challan"

//     // Centered "Delivery Challan" title
//     const deliveryChallanTitle = "Delivery Challan";
//     const titleWidth = fontBold.widthOfTextAtSize(deliveryChallanTitle, 16);
//     drawWrappedText(
//       page,
//       deliveryChallanTitle,
//       (pageWidth - titleWidth) / 2,
//       y,
//       {
//         font,
//         size: 16,
//         bold: true,
//         maxWidth: pageWidth - 2 * marginX,
//         lineHeight: 20,
//       }
//     );
//     y -= 20; // More space after title

//     // Table Headers
//     const headers: { text: string; align: "left" | "center" | "right" }[] = [
//       { text: "Sl.No", align: "left" },
//       { text: "Account No", align: "center" },
//       { text: "Account Name", align: "center" },
//       { text: "Start No", align: "left" },
//       { text: "Books X Lvs", align: "left" },
//       { text: "End No", align: "left" },
//       { text: "A/C Type", align: "left" },
//       { text: "Status", align: "left" },
//       { text: "Cus.Branch", align: "left" },
//     ];
//     const headerRowHeight = 25; // Fixed height for header row

//     const drawTableHeader = (currentPage: PDFPage) => {
//       let x = tableXStart;
//       headers.forEach((header, i) => {
//         const width = colWidths[i];
//         currentPage.drawRectangle({
//           x,
//           y: y - headerRowHeight,
//           width,
//           height: headerRowHeight,
//           color: rgb(0.9, 0.9, 0.9), // Light gray background for header
//           borderColor: rgb(0, 0, 0),
//           borderWidth: 0.75, // Slightly thicker border
//         });
//         // Adjust textX for alignment within the header cell
//         const headerTextWidth = fontBold.widthOfTextAtSize(header.text, 8);
//         let textX = x + tableRowPadding;
//         if (header.align === "center") {
//           textX = x + (width - headerTextWidth) / 2;
//         } else if (header.align === "right") {
//           textX = x + width - headerTextWidth - tableRowPadding;
//         }

//         drawWrappedText(
//           currentPage,
//           header.text,
//           textX,
//           y - headerRowHeight / 2 + 3,
//           {
//             font,
//             size: 8,
//             bold: true,
//             maxWidth: width - tableRowPadding * 2,
//             lineHeight: 10,
//             alignment: header.align,
//           }
//         );
//         x += width;
//       });
//       y -= headerRowHeight;
//     };

//     drawTableHeader(page);
//     let sl = 1;
//     const summary: Record<string, number> = {};

//     for (const item of challan.items || []) {
//       const rowData: (string | number)[] = [
//         sl,
//         item.accountNo || "",
//         item.accountName || "",
//         item.startNo || "",
//         `${item.bookQty}X${item.leaves}`,
//         item.endNo || "",
//         item.chequeType || "",
//         item.serverity === 1 ? "Urgent" : "Normal",
//         item.branchName || "",
//       ];

//       // 🔍 Calculate max row height needed
//       let maxCellHeight = 0;
//       for (let i = 0; i < rowData.length; i++) {
//         const text = String(rowData[i] ?? "");
//         const cellWidth = colWidths[i];
//         const cellHeight = drawWrappedText(page, text, 0, 0, {
//           font,
//           size: 7,
//           maxWidth: cellWidth - tableRowPadding * 2,
//           lineHeight: 9,
//         });
//         maxCellHeight = Math.max(maxCellHeight, cellHeight);
//       }

//       const actualRowHeight = Math.max(maxCellHeight + tableRowPadding * 2, 18);

//       // ✅ Set a safe bottom margin above footer
//       const safeBottomY = marginY + footerSectionHeight + 60;

//       // 🚨 Page break if space not enough
//       if (y - actualRowHeight < safeBottomY) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = pageHeight - headerSectionHeight - 10;
//         drawHeaderFooter(page);

//         // Optional: Draw continued info on new page
//         drawWrappedText(page, dateText, marginX, y + 20, {
//           font,
//           size: 9,
//           bold: true,
//           maxWidth: pageWidth / 2 - marginX,
//           lineHeight: 12,
//         });

//         drawWrappedText(
//           page,
//           challanNoText,
//           pageWidth - marginX - fontBold.widthOfTextAtSize(challanNoText, 9),
//           y + 20,
//           {
//             font,
//             size: 9,
//             bold: true,
//             maxWidth: pageWidth / 2 - marginX,
//             lineHeight: 12,
//           }
//         );

//         drawWrappedText(
//           page,
//           "(Continued)",
//           pageWidth / 2 - font.widthOfTextAtSize("(Continued)", 8) / 2,
//           y,
//           {
//             font,
//             size: 8,
//             color: rgb(0.5, 0.5, 0.5),
//             maxWidth: pageWidth - 2 * marginX,
//             lineHeight: 10,
//           }
//         );
//         y -= 15;

//         drawTableHeader(page);
//       }

//       // ✅ Draw actual row
//       let x = tableXStart;
//       rowData.forEach((text, i) => {
//         const cellWidth = colWidths[i];
//         const isEvenRow = sl % 2 === 0;

//         page.drawRectangle({
//           x,
//           y: y - actualRowHeight,
//           width: cellWidth,
//           height: actualRowHeight,
//           color: isEvenRow ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1),
//           borderColor: rgb(0, 0, 0),
//           borderWidth: 0.75,
//         });

//         const textY = y - actualRowHeight / 2 + 3;
//         const alignment = headers[i].align;
//         const currentTextWidth = font.widthOfTextAtSize(String(text ?? ""), 7);

//         let textX = x + tableRowPadding;
//         if (alignment === "center") {
//           textX = x + (cellWidth - currentTextWidth) / 2;
//         } else if (alignment === "right") {
//           textX = x + cellWidth - currentTextWidth - tableRowPadding;
//         }

//         drawWrappedText(page, String(text ?? ""), textX, textY, {
//           font,
//           size: 7,
//           color: rgb(0, 0, 0),
//           maxWidth: cellWidth - tableRowPadding * 2,
//           lineHeight: 9,
//           alignment,
//         });

//         x += cellWidth;
//       });

//       y -= actualRowHeight;

//       // 🧮 Update summary
//       const acLabel = `${item.chequeType}(${item.leaves})`;
//       summary[acLabel] = (summary[acLabel] || 0) + 1;
//       sl++;
//     }

//     // Summary Section
//     y -= 30; // Space before summary
//     const summaryHeaders: string[] = [
//       "#",
//       ...Object.keys(summary),
//       "Grand Total",
//     ];
//     const summaryValues: string[] = [
//       "Total",
//       ...Object.values(summary).map(String),
//       `${sl - 1}`,
//     ];
//     const summaryColWidth = 80;
//     const summaryRowHeight = 20;
//     // Calculate how much vertical space is needed for summary + signature
//     const summaryHeight =
//       2 * summaryRowHeight + // Summary header + values
//       40 + // Space before signature
//       50 + // Signature lines + labels
//       footerSectionHeight +
//       20; // footer buffer

//     // If not enough space, add new page before drawing summary
//     const safeBottomY = footerY + 30 + 10; // 30 = footer image height, 10 buffer
//     if (y - summaryHeight < safeBottomY) {
//       page = pdfDoc.addPage([pageWidth, pageHeight]);
//       y = pageHeight - headerSectionHeight;
//       drawHeaderFooter(page);

//       // Repeat Challan No. and Date for context
//       drawWrappedText(page, dateText, marginX, y + 20, {
//         font,
//         size: 9,
//         bold: true,
//         maxWidth: pageWidth / 2 - marginX,
//         lineHeight: 12,
//       });
//       drawWrappedText(
//         page,
//         challanNoText,
//         pageWidth - marginX - fontBold.widthOfTextAtSize(challanNoText, 9),
//         y + 20,
//         {
//           font,
//           size: 9,
//           bold: true,
//           maxWidth: pageWidth / 2 - marginX,
//           lineHeight: 12,
//         }
//       );
//       y -= 15;
//     }

//     // Draw summary headers
//     let sx = marginX;
//     summaryHeaders.forEach((header) => {
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(0.9, 0.9, 0.9), // Light gray background for summary header
//       });
//       drawWrappedText(page, header, sx + 5, y - 15, {
//         font,
//         size: 9,
//         bold: true,
//         maxWidth: summaryColWidth - 10,
//         lineHeight: 12,
//       });
//       sx += summaryColWidth;
//     });
//     y -= summaryRowHeight;

//     // Draw summary values
//     sx = marginX;
//     summaryValues.forEach((val) => {
//       page.drawRectangle({
//         x: sx,
//         y: y - summaryRowHeight,
//         width: summaryColWidth,
//         height: summaryRowHeight,
//         borderColor: rgb(0, 0, 0),
//         borderWidth: 0.5,
//         color: rgb(1, 1, 1),
//       });
//       drawWrappedText(page, val, sx + 5, y - 15, {
//         font,
//         size: 9,
//         bold: false,
//         maxWidth: summaryColWidth - 10,
//         lineHeight: 12,
//       });
//       sx += summaryColWidth;
//     });
//     y -= summaryRowHeight;

//     y -= 40; // Space before signatures

//     // Signature Block
//     const signatureLineY = marginY + 60; // Position above footer
//     const signatureTextSize = 10;

//     // Authorized Signature
//     const authSigText = "Authorized Signature";
//     const authSigTextWidth = font.widthOfTextAtSize(
//       authSigText,
//       signatureTextSize
//     );
//     page.drawLine({
//       start: { x: marginX + 40, y: signatureLineY },
//       end: { x: marginX + 40 + 150, y: signatureLineY },
//       thickness: 0.5,
//       color: rgb(0, 0, 0),
//     });
//     drawWrappedText(
//       page,
//       authSigText,
//       marginX + 40 + (150 - authSigTextWidth) / 2,
//       signatureLineY - 15,
//       {
//         font,
//         size: signatureTextSize,
//         maxWidth: 150,
//         lineHeight: 12,
//         alignment: "center",
//       }
//     );

//     // Receiving Signature
//     const recSigText = "Receiving Signature";
//     const recSigTextWidth = font.widthOfTextAtSize(
//       recSigText,
//       signatureTextSize
//     );
//     page.drawLine({
//       start: { x: pageWidth - marginX - 190, y: signatureLineY },
//       end: { x: pageWidth - marginX - 190 + 150, y: signatureLineY },
//       thickness: 0.5,
//       color: rgb(0, 0, 0),
//     });
//     drawWrappedText(
//       page,
//       recSigText,
//       pageWidth - marginX - 190 + (150 - recSigTextWidth) / 2,
//       signatureLineY - 15,
//       {
//         font,
//         size: signatureTextSize,
//         maxWidth: 150,
//         lineHeight: 12,
//         alignment: "center",
//       }
//     );
//   }

//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `challans_${new Date().toISOString().split("T")[0]}.pdf`;
//   link.click();
// };

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface ChallanItem {
  accountNo?: string;
  accountName?: string;
  startNo?: string;
  bookQty: number;
  leaves: number;
  endNo?: string;
  chequeType?: string;
  serverity: number;
  branchName?: string;
}

interface Challan {
  bankName: string;
  receivingBranchName: string;
  challanDate: string;
  vendorName?: string;
  courierName?: string;
  courierPhone: string;
  challanNumber: string;
  branchName: string;
  cusAddress?: string | null;
  agentNum?: string | null;
  isAgent: boolean;
  items?: ChallanItem[];
}

export const generateChallanPdf = async (
  challans: Challan[],
  headerImageBase64: string,
  footerImageBase64: string,
  authSignatureBase64: string
) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const headerImageBytes = await fetch(headerImageBase64).then((r) =>
    r.arrayBuffer()
  );
  const footerImageBytes = await fetch(footerImageBase64).then((r) =>
    r.arrayBuffer()
  );
  const headerImage = await pdfDoc.embedPng(headerImageBytes);
  const footerImage = await pdfDoc.embedPng(footerImageBytes);

  const authorizedSignatureBytes = await fetch(authSignatureBase64).then((r) =>
    r.arrayBuffer()
  );
  const authorizedSignatureImage = await pdfDoc.embedPng(
    authorizedSignatureBytes
  );

  function formatDate(dateInput: string | Date): string {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    const day = date.getDate();
    const monthNames: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month: string = monthNames[date.getMonth()];
    const year: number = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 24;
  const marginY = 30;
  const colWidths = [25, 80, 110, 50, 55, 49, 55, 42, 80];
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
  const rowHeight = 22;
  // const headerHeight = 50;
  const footerHeight = 50;
  const signatureHeight = 80;

  for (const challan of challans) {
    let TotalBooks = 0;
    for (const item of challan.items || []) {
      TotalBooks += item.bookQty;
    }
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - marginY;
    let sl = 1;
    const summary: Record<string, number> = {};

    const drawFooter = () => {
      page.drawImage(footerImage, {
        x: marginX,
        y: marginY,
        width: pageWidth - marginX * 2,
        height: 30,
      });
    };

    const drawHeader = () => {
      page.drawImage(headerImage, {
        x: pageWidth - marginX - 150,
        y: pageHeight - marginY - 60,
        width: 140,
        height: 70,
      });

      page.drawText(`Challan No: ${challan.challanNumber}`, {
        x: pageWidth - marginX - 150,
        y: pageHeight - marginY - 75,
        font: fontBold,
        size: 10,
      });
      page.drawText(`Mob: ${challan.agentNum || "N/A"}`, {
        x: pageWidth - marginX - 150,
        y: pageHeight - marginY - 90,
        font,
        size: 10,
      });

      if (challan.isAgent) {
        page.drawText(`Add: ${challan.cusAddress || "N/A"}`, {
          x: pageWidth - marginX - 150,
          y: pageHeight - marginY - 105,
          font,
          size: 9,
        });
      }

      y = pageHeight - marginY - 20;
      page.drawText(challan.receivingBranchName, {
        x: marginX,
        y,
        font: fontBold,
        size: 15,
      });
      y -= 18;
      page.drawText(challan.bankName, {
        x: marginX,
        y,
        font: fontBold,
        size: 13,
      });
      y -= 16;
      page.drawText(`Date: ${formatDate(challan.challanDate)}`, {
        x: marginX,
        y,
        font,
        size: 9,
      });
      y -= 15;
      page.drawText(`Printed By: ${challan.vendorName || "N/A"}`, {
        x: marginX,
        y,
        font,
        size: 9,
      });

      page.drawText(`Total Books: ${TotalBooks}`, {
        x: pageWidth - marginX - 315,
        y,
        font: fontBold,
        size: 13,
      });
      y -= 15;
      page.drawText(`Courier: ${challan.courierName || "N/A"}`, {
        x: marginX,
        y,
        font,
        size: 9,
      });
      y -= 15;
      page.drawText(`Courier Mob: ${challan.courierPhone}`, {
        x: marginX,
        y,
        font,
        size: 9,
      });
      y -= 22;
      page.drawText("To", {
        x: marginX,
        y,
        font: fontBold,
        size: 12,
      });
      y -= 16;
      page.drawText("Manager", {
        x: marginX,
        y,
        font: fontBold,
        size: 12,
      });

      y -= 32;
      const title = "Delivery Challan";
      page.drawText(title, {
        x: (pageWidth - fontBold.widthOfTextAtSize(title, 14)) / 2,
        y,
        font: fontBold,
        size: 14,
      });
      y -= 32;

      let x = marginX;
      headers.forEach((h, i) => {
        page.drawRectangle({
          x,
          y,
          width: colWidths[i],
          height: rowHeight,
          borderWidth: 0.5,
          borderColor: rgb(0.7, 0.7, 0.7),
        });
        page.drawText(h, { x: x + 3, y: y + 5, font: fontBold, size: 8 });
        x += colWidths[i];
      });
      y -= rowHeight;
    };

    drawHeader();

    for (const item of challan.items || []) {
      if (y < marginY + footerHeight + signatureHeight + rowHeight + 10) {
        drawFooter();
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - marginY;
        drawHeader();
      }

      const row = [
        sl,
        item.accountNo,
        item.accountName,
        item.startNo,
        `${item.bookQty}X${item.leaves}`,
        item.endNo,
        item.chequeType,
        item.serverity === 1 ? "Urgent" : "Normal",
        challan.isAgent ? `B-${item.branchName}` : item.branchName,
      ];

      let cx = marginX;
      colWidths.forEach((w, i) => {
        page.drawRectangle({
          x: cx,
          y,
          width: w,
          height: rowHeight,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
        page.drawText(String(row[i] ?? ""), {
          x: cx + 3,
          y: y + 5,
          size: 7,
          font,
        });
        cx += w;
      });

      const key = `${item.chequeType}(${item.leaves})`;
      summary[key] = (summary[key] || 0) + 1;
      TotalBooks += item.bookQty;

      y -= rowHeight;
      sl++;
    }

    if (y < marginY + footerHeight + signatureHeight + 80) {
      drawFooter();
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - marginY;
      drawHeader();
    }

    y -= 25;
    const sumKeys = Object.keys(summary);
    const summaryHeader = ["#", ...sumKeys, "Grand Total"];
    const summaryValues = [
      "Total",
      ...sumKeys.map((k) => summary[k].toString()),
      (sl - 1).toString(),
    ];
    let sx = marginX;
    const summaryColWidth = 70;

    summaryHeader.forEach((txt) => {
      page.drawRectangle({
        x: sx,
        y,
        width: summaryColWidth,
        height: rowHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      page.drawText(txt, { x: sx + 3, y: y + 5, size: 8, font: fontBold });
      sx += summaryColWidth;
    });
    y -= rowHeight;

    sx = marginX;
    summaryValues.forEach((val) => {
      page.drawRectangle({
        x: sx,
        y,
        width: summaryColWidth,
        height: rowHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      page.drawText(val, { x: sx + 3, y: y + 5, size: 8, font });
      sx += summaryColWidth;
    });
    y -= 60;

    const sigY = y;
    const authX = marginX + 30;
    const recvX = pageWidth - marginX - 180;

    page.drawLine({
      start: { x: authX, y: sigY },
      end: { x: authX + 150, y: sigY },
      color: rgb(0, 0, 0),
    });

    // Draw authorized signature image
    page.drawImage(authorizedSignatureImage, {
      x: authX + 30,
      y: sigY + 5,
      width: 90,
      height: 30,
    });

    page.drawText("Authorized Signature", {
      x: authX + 45,
      y: sigY - 15,
      size: 9,
      font,
    });

    // Receiving Signature line
    page.drawLine({
      start: { x: recvX, y: sigY },
      end: { x: recvX + 150, y: sigY },
      color: rgb(0, 0, 0),
    });

    page.drawText("Receiving Signature", {
      x: recvX + 45,
      y: sigY - 15,
      size: 9,
      font,
    });

    drawFooter();
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(blob);
  // const fileName = `styled_challan_${
  //   new Date().toISOString().split("T")[0]
  // }.pdf`;
  // link.click();
  // saveAs(blob, fileName);
  if ("showSaveFilePicker" in window) {
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName: `${challans[0].bankName}_challan_${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      types: [
        {
          description: "PDF Files",
          accept: { "application/pdf": [".pdf"] },
        },
      ],
    });

    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  } else {
    // fallback to window.open or saveAs
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }
};
