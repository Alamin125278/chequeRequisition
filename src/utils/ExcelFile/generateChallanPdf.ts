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

  // Image Embed করার জন্য ArrayBuffer নিয়ে আসা
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

  function drawWrappedTextWithCharLimit(
    page: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    font: any,
    fontSize: number,
    lineHeight: number,
    maxChars: number = 30
  ) {
    // Step 1: Character limit check
    let trimmedText = text;
    if (text.length > maxChars) {
      trimmedText = text.slice(0, maxChars).trim() + "...";
    }

    // Step 2: Word-wrapping the (possibly trimmed) text
    const words = trimmedText.split(" ");
    let line = "";
    let curY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? line + " " + words[i] : words[i];
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && i > 0) {
        // আগের লাইন ড্র করো
        page.drawText(line.trim(), { x, y: curY, size: fontSize, font });
        line = words[i];
        curY -= lineHeight;
      } else {
        line = testLine;
      }
    }

    // বাকি লাইন ড্র করো
    if (line) {
      page.drawText(line.trim(), { x, y: curY, size: fontSize, font });
    }
  }

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 16;
  const marginY = 30;
  const colWidths = [30, 75, 115, 50, 55, 50, 55, 45, 90]; // কলামের প্রস্থ সামঞ্জস্য করা হয়েছে
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
  const headerHeight = 180; // হেডারের জন্য পর্যাপ্ত জায়গা
  const footerHeight = 80; // ফুটার এবং সিগনেচারের জন্য জায়গা

  for (const challan of challans) {
    let TotalBooks = 0;
    for (const item of challan.items || []) {
      TotalBooks += item.bookQty;
    }

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - marginY - 60; // শুরুটা উপরে থেকে করুন
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
        y: y,
        width: 140,
        height: 70,
      });

      page.drawText(`Challan No: ${challan.challanNumber}`, {
        x: pageWidth - marginX - 150,
        y: y - 15,
        font: fontBold,
        size: 10,
      });
      page.drawText(`Courier: ${challan.courierName || "N/A"}`, {
        x: pageWidth - marginX - 150,
        y: y - 30,
        font,
        size: 9,
      });

      page.drawText(`Courier Mob: ${challan.courierPhone}`, {
        x: pageWidth - marginX - 150,
        y: y - 45,
        font,
        size: 9,
      });

      let contentY = pageHeight - marginY - 20;
      page.drawText(challan.receivingBranchName, {
        x: marginX + 8,
        y: contentY,
        font: fontBold,
        size: 11,
      });
      contentY -= 18;
      page.drawText(challan.bankName, {
        x: marginX + 8,
        y: contentY,
        font: fontBold,
        size: 11,
      });
      contentY -= 16;
      page.drawText(`Date: ${formatDate(challan.challanDate)}`, {
        x: marginX + 8,
        y: contentY,
        font,
        size: 9,
      });
      contentY -= 15;
      page.drawText(`Printed By: ${challan.vendorName || "N/A"}`, {
        x: marginX + 8,
        y: contentY,
        font,
        size: 9,
      });

      page.drawText(`Total Books: ${TotalBooks}`, {
        x: pageWidth - marginX - 360,
        y: contentY,
        font: fontBold,
        size: 11,
      });

      if (challan.isAgent) {
        contentY -= 15;
        page.drawText(`Agent Mob: ${challan.agentNum || "N/A"}`, {
          x: marginX + 8,
          y: contentY,
          font,
          size: 9,
        });
      }

      contentY -= 15;
      if (challan.isAgent) {
        page.drawText(`Add: ${challan.cusAddress || "N/A"}`, {
          x: marginX + 8,
          y: contentY,
          font,
          size: 9,
        });
      }

      contentY -= 22;
      page.drawText("To", {
        x: marginX + 8,
        y: contentY,
        font: fontBold,
        size: 12,
      });
      contentY -= 16;
      page.drawText("Manager", {
        x: marginX + 8,
        y: contentY,
        font: fontBold,
        size: 12,
      });

      contentY -= 32;
      const title = "Delivery Challan";
      page.drawText(title, {
        x: (pageWidth - fontBold.widthOfTextAtSize(title, 14)) / 2,
        y: contentY,
        font: fontBold,
        size: 14,
      });

      // টেবিল হেডার আঁকার জন্য Y পজিশন সেট করুন
      y = contentY - 32;

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

        // হেডার টেক্সট সেন্টার করুন
        const textWidth = fontBold.widthOfTextAtSize(h, 8);
        const centerX = x + (colWidths[i] - textWidth) / 2;

        page.drawText(h, {
          x: Math.max(x + 2, centerX),
          y: y + 7,
          font: fontBold,
          size: 8,
        });
        x += colWidths[i];
      });
      y -= rowHeight;
    };

    drawHeader();

    for (const item of challan.items || []) {
      // নতুন পেজ চেক করার লজিক উন্নত করুন
      if (y < marginY + footerHeight + rowHeight * 3) {
        drawFooter();
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - marginY - 60;
        // drawHeader();
        page.drawImage(headerImage, {
          x: pageWidth - marginX - 150,
          y: y,
          width: 140,
          height: 70,
        });
        y -= rowHeight + 22;
      }

      const row = [
        sl.toString(),
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

        // অ্যাকাউন্ট নাম এবং শাখার নামের জন্য টেক্সট র‍্যাপিং ব্যবহার করুন
        if (headers[i] === "Cus.Branch" || headers[i] === "Account Name") {
          drawWrappedTextWithCharLimit(
            page,
            String(row[i] ?? ""),
            cx + 3,
            y + rowHeight - 7,
            w - 6,
            font,
            7,
            9,
            30
          );
        } else {
          // অন্যান্য কলামের জন্য সেন্টার করা টেক্সট
          const text = String(row[i] ?? "");
          const textWidth = font.widthOfTextAtSize(text, 7);
          const centerX = cx + (w - textWidth) / 2;
          const textY = y + (rowHeight - 7) / 2 + 3;

          page.drawText(text, {
            x: Math.max(cx + 2, centerX),
            y: textY,
            size: 7,
            font,
          });
        }

        cx += w;
      });

      let typeCode;
      switch (item.chequeType?.toLowerCase()) {
        case "savings":
          typeCode = "SB";
          break;
        case "current":
          typeCode = "CD";
          break;
        case "payment order":
          typeCode = "PO";
          break;
        case "cash credit":
          typeCode = "CC";
          break;
        default:
          typeCode = item.chequeType;
      }

      const key = `${typeCode}(${item.leaves})`;
      summary[key] = (summary[key] || 0) + item.bookQty;

      y -= rowHeight;
      sl++;
    }

    // সামারি এবং সিগনেচারের জন্য পর্যাপ্ত জায়গা আছে কিনা চেক করুন
    if (y < marginY + footerHeight + 100) {
      drawFooter();
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - marginY - 40;
      drawHeader();
    }

    y -= 25;
    const sumKeys = Object.keys(summary);
    const summaryHeader = ["#", ...sumKeys, "Grand Total"];
    const summaryValues = [
      "Total",
      ...sumKeys.map((k) => summary[k].toString()),
      TotalBooks.toString(),
    ];

    let sx = marginX;
    const summaryColWidth = 50;

    summaryHeader.forEach((txt) => {
      page.drawRectangle({
        x: sx,
        y,
        width: summaryColWidth,
        height: rowHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });

      // সামারি হেডার টেক্সট সেন্টার করুন
      const textWidth = fontBold.widthOfTextAtSize(txt, 8);
      const centerX = sx + (summaryColWidth - textWidth) / 2;

      page.drawText(txt, {
        x: Math.max(sx + 2, centerX),
        y: y + 7,
        size: 8,
        font: fontBold,
      });
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

      // সামারি ভ্যালু টেক্সট সেন্টার করুন
      const textWidth = font.widthOfTextAtSize(val, 8);
      const centerX = sx + (summaryColWidth - textWidth) / 2;

      page.drawText(val, {
        x: Math.max(sx + 2, centerX),
        y: y + 7,
        size: 8,
        font,
      });
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

  // pdf save & download
  const pdfBytes = await pdfDoc.save();
  const safeBuffer = new Uint8Array(pdfBytes);
  const blob = new Blob([safeBuffer], { type: "application/pdf" });

  // if ("showSaveFilePicker" in window) {
  //   const fileHandle = await (window as any).showSaveFilePicker({
  //     suggestedName: `${challans[0].bankName}_challan_${
  //       new Date().toISOString().split("T")[0]
  //     }.pdf`,
  //     types: [
  //       {
  //         description: "PDF Files",
  //         accept: { "application/pdf": [".pdf"] },
  //       },
  //     ],
  //   });

  //   const writable = await fileHandle.createWritable();
  //   await writable.write(blob);
  //   await writable.close();
  // } else {
  // fallback for unsupported browsers
  const url = URL.createObjectURL(blob);
  // window.open(url, "_blank");
  const link = document.createElement("a");
  link.href = url;
  const todayDate = new Date().toLocaleDateString("en-GB").split("/").join("-");
  link.download = `${todayDate}_${challans[0].bankName}_challan${
    challans[0].isAgent ? "_agent" : ""
  }.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  // }
};
