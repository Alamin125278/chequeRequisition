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
  accFlag?: string;
}

interface Challan {
  bankId: number;
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
  reDate: string;
  isAgent: boolean;
  items?: ChallanItem[];
}

function cleanText(text: string) {
  return text
    .replace(/\u007f/g, "")
    .replace(/[\u0000-\u001F]/g, "")
    .trim();
}

export const generatePrimeBankPdf = async (
  challans: Challan[],
  headerImageBase64: string,
  footerImageBase64: string,
  authSignatureBase64: string,
  courier?: string,
) => {
  const pdfDoc = await PDFDocument.create();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const headerImage = await pdfDoc.embedPng(
    await fetch(headerImageBase64).then((r) => r.arrayBuffer()),
  );

  const footerImage = await pdfDoc.embedPng(
    await fetch(footerImageBase64).then((r) => r.arrayBuffer()),
  );

  const signatureImage = await pdfDoc.embedPng(
    await fetch(authSignatureBase64).then((r) => r.arrayBuffer()),
  );

  const pageWidth = 595.44;
  const pageHeight = 841.89;

  const marginX = 10;
  const marginY = 30;

  const rowHeight = 50;
  const headerHeight = 30;

  const MAX_ITEMS_PER_PAGE = 10;

  const colWidths = [90, 110, 40, 45, 40, 45, 45, 80, 80];

  const headers = [
    "Account No",
    "Account Name",
    "No Of Lvs",
    "Start No",
    "End No",
    "A/C Type",
    "A/C Flag",
    "Customer Signature",
    "Verified Signature",
  ];

  // ================= UTILS =================
  const wrapText = (
    text: string,
    maxCharsPerLine: number,
    maxLines: number,
  ): string[] => {
    if (!text) return [];

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let word of words) {
      const testLine = (currentLine + " " + word).trim();

      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;

        if (lines.length === maxLines - 1) {
          const remaining = words.slice(words.indexOf(word)).join(" ");
          lines.push(remaining);
          break;
        }
      }
    }

    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }

    // trim to max lines
    const result = lines.slice(0, maxLines);

    // add ellipsis if needed
    const originalLength = text.length;
    const shownText = result.join(" ");

    if (originalLength > shownText.length && result.length > 0) {
      const lastIndex = result.length - 1;
      result[lastIndex] =
        result[lastIndex].slice(0, maxCharsPerLine - 3) + "...";
    }

    return result;
  };
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
  // ================= HEADER =================
  const drawHeader = (
    page: any,
    y: number,
    challan: Challan,
    totalBooks: number,
  ) => {
    let pickupDate = "";

    if (challan.reDate) {
      let d = new Date(challan.reDate);

      // 1 দিন যোগ
      d.setDate(d.getDate() + 1);

      // Friday (5) বা Saturday (6) হলে Sunday এ নিয়ে যাও
      if (d.getDay() === 5) {
        d.setDate(d.getDate() + 2); // Friday -> Sunday
      } else if (d.getDay() === 6) {
        d.setDate(d.getDate() + 1); // Saturday -> Sunday
      }

      pickupDate = d.toString();
    }
    page.drawImage(headerImage, {
      x: pageWidth - marginX - 150,
      y,
      width: 140,
      height: 70,
    });
    page.drawText(`Printed By: ${challan.vendorName || "N/A"}`, {
      x: pageWidth - marginX - 150,
      y: y - 15,
      size: 9,
      font,
    });

    let cy = pageHeight - marginY - 20;

    page.drawText(challan.receivingBranchName, {
      x: marginX + 8,
      y: cy,
      font: fontBold,
      size: 11,
    });

    cy -= 18;

    page.drawText(challan.bankName, {
      x: marginX + 8,
      y: cy,
      font: fontBold,
      size: 11,
    });

    page.drawText(`Total Books: ${totalBooks}`, {
      x: pageWidth - marginX - 400,
      y: cy,
      font: fontBold,
      size: 11,
    });

    cy -= 16;

    page.drawText(`Challan No: ${challan.challanNumber}`, {
      x: marginX + 8,
      y: cy,
      font: fontBold,
      size: 10,
    });

    cy -= 16;

    page.drawText(`Pickup Date: ${formatDate(pickupDate)}`, {
      x: marginX + 8,
      y: cy,
      font,
      size: 9,
    });
    cy -= 20;
    page.drawText(`Requisition Date: ${formatDate(challan.reDate)}`, {
      x: marginX + 8,
      y: cy,
      font: fontBold,
      size: 10,
    });

    cy -= 30;

    page.drawText("Delivery Details", {
      x: (pageWidth - fontBold.widthOfTextAtSize("Delivery Details", 14)) / 2,
      y: cy,
      font: fontBold,
      size: 14,
    });
  };

  // ================= TABLE HEADER =================
  const drawTableHeader = (page: any, y: number) => {
    let x = marginX;

    headers.forEach((h, i) => {
      const w = colWidths[i];

      page.drawRectangle({
        x,
        y,
        width: w,
        height: headerHeight,
        borderWidth: 0.5,
        borderColor: rgb(0, 0, 0),
      });

      const textWidth = fontBold.widthOfTextAtSize(h, 8);
      const centerX = x + (w - textWidth) / 2;

      page.drawText(h, {
        x: Math.max(x + 2, centerX),
        y: y + 10,
        size: 8,
        font: fontBold,
      });

      x += w;
    });
  };

  // ================= ROW =================
  const drawRow = (page: any, item: ChallanItem, y: number) => {
    let x = marginX;

    const row = [
      item.accountNo,
      item.accountName,
      item.leaves,
      item.startNo,
      item.endNo,
      item.chequeType === "Payment Order" ? "PO" : item.chequeType,
      item.accFlag,
      "",
      "",
    ];

    colWidths.forEach((w, i) => {
      page.drawRectangle({
        x,
        y: y - 20,
        width: w,
        height: rowHeight,
        borderWidth: 0.5,
        borderColor: rgb(0, 0, 0),
      });

      // ✅ ACCOUNT NAME (wrapped)
      if (i === 1) {
        const lines = wrapText(String(row[i] ?? ""), 20, 3);

        lines.forEach((line, idx) => {
          page.drawText(line, {
            x: x + 3,
            y: y + 15 - idx * 10,
            size: 8,
            fontBold,
          });
        });
      }
      // other columns normal
      else {
        page.drawText(String(row[i] ?? ""), {
          x: x + 3,
          y: y + 5,
          size: 9,
          font,
        });
      }

      x += w;
    });
  };

  // ================= SUMMARY =================
  const getTextWidth = (text: string, size: number, font: any) => {
    return font.widthOfTextAtSize(String(text), size);
  };
  const getAutoColumnWidths = (
    headers: string[],
    rows: string[][],
    font: any,
    fontSize = 9,
    padding = 20,
  ) => {
    return headers.map((h, i) => {
      let max = getTextWidth(h, fontSize, font);

      for (const row of rows) {
        const cell = row[i] ?? "";
        const w = getTextWidth(cell, fontSize, font);
        if (w > max) max = w;
      }

      return max + padding;
    });
  };
  const drawSummaryTable = (
    page: any,
    y: number,
    summary: Record<string, number>,
    total: number,
  ) => {
    const rowH = 22;
    const fontSize = 9;

    const keys = Object.keys(summary);
    keys.sort((a, b) => {
      const typeOrder = ["CONV", "ISLM", "PRIO"];

      const [typeA, leavesA] = a.split("(");
      const [typeB, leavesB] = b.split("(");

      const indexA = typeOrder.indexOf(typeA);
      const indexB = typeOrder.indexOf(typeB);

      const leafA = parseInt(leavesA);
      const leafB = parseInt(leavesB);

      // 1st priority: type order
      if (indexA !== indexB) {
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }

      // 2nd priority: leaves number
      return leafA - leafB;
    });

    const headers = ["#", ...keys, "Grand Total"];

    const values = [
      "Total",
      ...keys.map((k) => summary[k].toString()),
      total.toString(),
    ];

    // ================= AUTO WIDTH =================
    const colWidths = getAutoColumnWidths(
      headers,
      [headers, values],
      font,
      fontSize,
      25,
    );

    let x = marginX;

    // ================= HEADER ROW =================
    headers.forEach((h, i) => {
      const w = colWidths[i];

      page.drawRectangle({
        x,
        y,
        width: w,
        height: rowH,
        borderWidth: 0.5,
        borderColor: rgb(0, 0, 0),
      });

      const textWidth = fontBold.widthOfTextAtSize(h, fontSize);
      const centerX = x + (w - textWidth) / 2;

      page.drawText(h, {
        x: Math.max(x + 5, centerX),
        y: y + 7,
        size: fontSize,
        font: fontBold,
      });

      x += w;
    });

    y -= rowH;

    // ================= VALUE ROW =================
    x = marginX;

    values.forEach((v, i) => {
      const w = colWidths[i];

      page.drawRectangle({
        x,
        y,
        width: w,
        height: rowH,
        borderWidth: 0.5,
        borderColor: rgb(0, 0, 0),
      });

      const textWidth = font.widthOfTextAtSize(v, fontSize);
      const centerX = x + (w - textWidth) / 2;

      page.drawText(v, {
        x: Math.max(x + 5, centerX),
        y: y + 7,
        size: fontSize,
        font,
      });

      x += w;
    });
  };
  // ================= SIGNATURE =================

  const drawSignature = (page: any, y: number) => {
    const sigY = y;
    const authX = marginX + 30;
    const recvX = pageWidth - marginX - 180;
    page.drawImage(signatureImage, {
      x: marginX + 50,
      y,
      width: 80,
      height: 25,
    });
    page.drawLine({
      start: { x: authX, y: sigY },
      end: { x: authX + 150, y: sigY },
      color: rgb(0, 0, 0),
    });

    page.drawText("Authorized Signature", {
      x: marginX + 50,
      y: y - 15,
      size: 9,
      font,
    });
    page.drawLine({
      start: { x: recvX, y: sigY },
      end: { x: recvX + 150, y: sigY },
      color: rgb(0, 0, 0),
    });

    page.drawText("Receiving Signature", {
      x: pageWidth - 150,
      y: y - 15,
      size: 9,
      font,
    });
  };

  // ================= MAIN =================
  let createdPages: any[] = [];
  let currentPage: any;

  let lastY = 0; // ✅ FIXED
  let challanDate = "";

  for (const challan of challans) {
    let totalBooks = challan.items?.reduce((a, b) => a + b.bookQty, 0) || 0;
    challanDate = challan.challanDate;
    const pages: ChallanItem[][] = [];
    let temp: ChallanItem[] = [];
    challan.items?.sort((a, b) => {
      // 1st priority: AccFlag
      const flagCompare = (a.accFlag || "").localeCompare(b.accFlag || "");
      // 1st priority: leaves
      const leavesCompare = Number(a.leaves || 0) - Number(b.leaves || 0);
      if (flagCompare !== 0) return flagCompare;
      if (leavesCompare !== 0) return leavesCompare;

      // 2nd priority: startNo
      return Number(a.startNo || 0) - Number(b.startNo || 0);
    });
    for (const item of challan.items || []) {
      if (temp.length >= MAX_ITEMS_PER_PAGE) {
        pages.push(temp);
        temp = [];
      }
      temp.push(item);
    }
    if (temp.length) pages.push(temp);

    createdPages = [];

    for (let i = 0; i < pages.length; i++) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

      let y = pageHeight - marginY - 80;

      // drawHeader(currentPage, y, challan, totalBooks);
      if (i === 0) {
        drawHeader(currentPage, y, challan, totalBooks);
      } else {
        currentPage.drawImage(headerImage, {
          x: pageWidth - marginX - 150,
          y,
          width: 140,
          height: 70,
        });
      }

      y -= 90;

      drawTableHeader(currentPage, y);

      y -= headerHeight;

      for (const item of pages[i]) {
        drawRow(currentPage, item, y);
        y -= rowHeight;
      }
      currentPage.drawImage(footerImage, {
        x: marginX,
        y: marginY,
        width: pageWidth - marginX * 2,
        height: 30,
      });

      lastY = y; // 🔥 IMPORTANT FIX

      createdPages.push(currentPage);
    }

    const summary: Record<string, number> = {};

    for (const item of challan.items || []) {
      const key = `${item.accFlag || "UNK"}-${item.leaves}`;
      summary[key] = (summary[key] || 0) + item.bookQty;
    }

    const lastPage = createdPages[createdPages.length - 1];

    const requiredSpace = 160;

    if (lastY > requiredSpace) {
      drawSummaryTable(lastPage, lastY, summary, totalBooks);
      drawSignature(lastPage, lastY - 90);
    } else {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(headerImage, {
        x: pageWidth - marginX - 150,
        y: pageHeight - marginY - 80,
        width: 140,
        height: 70,
      });
      let sy = pageHeight - 200;

      drawSummaryTable(page, sy, summary, totalBooks);
      drawSignature(page, sy - 90);
      page.drawImage(footerImage, {
        x: marginX,
        y: marginY,
        width: pageWidth - marginX * 2,
        height: 30,
      });
    }
  }
  const pdfBytes = await pdfDoc.save();
  const safeBuffer = new Uint8Array(pdfBytes);
  const blob = new Blob([safeBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  let dateObj = new Date(challanDate);

  // YYYY-MM-DD format
  let cDate = dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
  link.download = `${cDate}_${challans[0].bankName}_challan${
    challans[0].isAgent ? "_agent" : ""
  }${courier ? `_${courier}` : ""}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};
