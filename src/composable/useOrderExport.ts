import FinteraFooterImage from "@/assets/challanImages/finterafooter.png";
import FinteralogoImage from "@/assets/challanImages/finterlogo.png";
import FlexItFooterImage from "@/assets/challanImages/flexitFooter.png";
import FlexItlogoImage from "@/assets/challanImages/flexitHeader.png";
import AuthSignature from "@/assets/signature.png";
import {
  createChallan,
  getChallanExportService,
} from "@/services/challan/challan.service";
import type {
  CheckTypeVariation,
  ExportStates,
  OrderRequisition,
} from "@/types/order";
import { exportToExcel } from "@/utils/ExcelFile/chequeBookExportExcel";
import { generateChallanPdf } from "@/utils/ExcelFile/generateChallanPdf";
import { message } from "ant-design-vue";
import { computed, reactive, ref } from "vue";

export const useOrderExport = () => {
  const exportStates = reactive<ExportStates>({
    psi: {
      loading: false,
      completed: false,
    },
  });

  const checkTypeVariations = ref<CheckTypeVariation[]>([]);
  const challanExportLoading = ref(false); // নতুন লোডিং স্টেট

  // প্রোগ্রেস ট্র্যাকিং
  const completedExports = computed(() => {
    const psiCompleted = exportStates.psi.completed ? 1 : 0;
    const checkTypeCompleted = checkTypeVariations.value.filter(
      (ct) => ct.completed,
    ).length;
    return psiCompleted + checkTypeCompleted;
  });

  const totalRequiredExports = computed(() => {
    return 1 + checkTypeVariations.value.length;
  });

  const progressPercentage = computed(() => {
    if (totalRequiredExports.value === 0) return 0;
    return Math.round(
      (completedExports.value / totalRequiredExports.value) * 100,
    );
  });

  const allExportsCompleted = computed(() => {
    return completedExports.value === totalRequiredExports.value;
  });

  // ভ্যারিয়েশন আপডেট
  const updateCheckTypeVariations = (orders: OrderRequisition[]) => {
    const variations: CheckTypeVariation[] = [];

    if (orders[0]?.bankId !== 8) {
      orders.forEach((order) => {
        const existing = variations.find(
          (v) => v.type === order.chequeType && v.pages === order.leaves,
        );
        if (existing) {
          existing.count++;
        } else {
          variations.push({
            type: order.chequeType,
            pages: order.leaves,
            count: 1,
            loading: false,
            completed: false,
          });
        }
      });

      variations.sort((a, b) => {
        const typeA = a.type ?? "";
        const typeB = b.type ?? "";

        if (typeA === typeB) return a.pages - b.pages;
        return typeA.localeCompare(typeB);
      });

      checkTypeVariations.value = variations;
    } else {
      orders.forEach((order) => {
        const existing = variations.find(
          (v) => v.pages === order.leaves && v.accFlag === order.accFlag,
        );
        if (existing) {
          existing.count++;
        } else {
          variations.push({
            type: order.chequeType,
            pages: order.leaves,
            count: 1,
            loading: false,
            completed: false,
            accFlag: order.accFlag,
          });
        }
      });

      variations.sort((a, b) => {
        const typeA = a.type ?? "";
        const typeB = b.type ?? "";

        if (typeA === typeB) return a.pages - b.pages;
        return typeA.localeCompare(typeB);
      });

      checkTypeVariations.value = variations;
    }
  };

  // এক্সপোর্ট স্টেট ম্যানেজমেন্ট
  const setExportState = (
    variation: CheckTypeVariation | null,
    options: { loading?: boolean; completed?: boolean },
  ) => {
    if (variation) {
      if (options.loading !== undefined) variation.loading = options.loading;
      if (options.completed !== undefined)
        variation.completed = options.completed;
    }
  };

  const setPsiExportState = (options: {
    loading?: boolean;
    completed?: boolean;
  }) => {
    if (options.loading !== undefined)
      exportStates.psi.loading = options.loading;
    if (options.completed !== undefined)
      exportStates.psi.completed = options.completed;
  };

  // চেক টাইপ এক্সপোর্ট
  const exportByCheckTypeAndPages = async (
    checkType: string,
    pages: number,
    orders: OrderRequisition[],
    accFlag?: string,
    courier?: string,
  ) => {
    const bankId = orders[0]?.bankId;
    // 🔹 Find variation (if bankId === 8, include accFlag in condition)
    const variation = checkTypeVariations.value.find((ct) =>
      bankId === 8
        ? ct.pages === pages && ct.accFlag === accFlag
        : ct.type === checkType && ct.pages === pages,
    );

    if (!variation || variation.completed) return;

    setExportState(variation, { loading: true });

    try {
      // 🔹 Filter matching orders
      const matchingOrders = orders.filter((order) =>
        bankId === 8
          ? order.leaves === pages && order.accFlag === accFlag
          : order.chequeType === checkType && order.leaves === pages,
      );
      if (!matchingOrders.length) {
        message.warning("No matching data found");
        return;
      }
      // 🔹 Generate file name
      const todayDate = new Date()
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");

      const bankName = matchingOrders[0]?.bankName || "UnknownBank";

      let fileName = "";

      if (bankId === 8) {
        fileName = `${todayDate}_${bankName}_${accFlag}_${pages}${
          courier ? `_${courier}` : ""
        }`;
      } else {
        const suffix = courier
          ? `_${courier}`
          : matchingOrders[0]?.isAgent
            ? "_Agent"
            : "";

        fileName = `${todayDate}_${bankName}_${checkType}_${pages}${
          accFlag ? `_${accFlag}` : ""
        }${suffix}`;
      }

      // চেক টাইপের জন্য আলাদা ফরম্যাটিং
      const formattedData = formatCheckTypeData(matchingOrders);
      if (bankId === 8) {
        await exportToExcel(formattedData, fileName, accFlag);
      } else {
        await exportToExcel(formattedData, fileName, checkType);
      }

      setExportState(variation, { completed: true });
      if (bankId === 8) {
        message.success(`Successfully exported ${accFlag} (${pages} pages)`);
      } else {
        message.success(
          `Successfully exported ${checkType} (${pages} pages) ${accFlag ? "(" + accFlag + ")" : ""}`,
        );
      }
    } catch (error) {
      console.error(
        `Export error for ${checkType} (${pages}) ${accFlag ? "(" + accFlag + ")" : ""}:`,
        error,
      );
      message.error(
        `Failed to export ${checkType} (${pages} pages) ${accFlag ? "(" + accFlag + ")" : ""}`,
      );
    } finally {
      setExportState(variation, { loading: false });
    }
  };

  // PSI এক্সপোর্ট
  const exportPSI = async (orders: OrderRequisition[], courier?: string) => {
    if (exportStates.psi.completed) return;

    setPsiExportState({ loading: true });

    try {
      const bankName = orders[0]?.bankName || "UnknownBank";
      const formattedData = formatPSIData(orders); // PSI-এর জন্য আলাদা ফরম্যাটিং
      const todayDate = new Date()
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");

      let fileName = "";
      if (orders[0]?.isAgent) {
        fileName = `${todayDate}_${bankName}PSI__Agent`;
      } else if (courier != null) {
        fileName = `${todayDate}_${bankName}_PSI_${courier}`;
      } else {
        fileName = `${todayDate}_${bankName}_PSI`;
      }

      await exportToExcel(formattedData, fileName, "PSI");
      setPsiExportState({ completed: true });
      message.success("PSI exported successfully");
    } catch (error) {
      console.error("PSI export error:", error);
      message.error("Failed to export PSI");
    } finally {
      setPsiExportState({ loading: false });
    }
  };

  // চালান এক্সপোর্ট
  const exportChallan = async (
    orders: OrderRequisition[],
    courier?: string,
  ) => {
    challanExportLoading.value = true;

    try {
      // Group by receiving branch
      const branches: Record<string, any[]> = {};
      orders.forEach((order) => {
        if (!branches[order.receivingBranchName]) {
          branches[order.receivingBranchName] = [];
        }
        branches[order.receivingBranchName].push(order);
      });

      // Sort branches A to Z
      const sortedBranches: Record<string, any[]> = {};
      Object.keys(branches)
        .sort((a, b) => a.localeCompare(b))
        .forEach((branchName) => {
          sortedBranches[branchName] = branches[branchName];
        });

      // Create challan
      const payload = { challanData: sortedBranches };
      const response = await createChallan(payload);

      if (!response?.isCreated) {
        throw new Error("Invoice creation failed");
      }

      // Get challan IDs and data
      const challanIds = response.createdChallanIds ?? [];
      if (challanIds.length === 0) {
        throw new Error("No invoice ID found.");
      }

      challanIds.sort((a: number, b: number) => a - b);
      let challans = await getChallanExportService(challanIds);
      challans.sort((a, b) =>
        a.receivingBranchName.localeCompare(b.receivingBranchName),
      );

      // Generate PDF
      const vendorName = challans[0].vendorName;
      const isFintera = vendorName === "Fintera Solutions Limited";

      const [logoBase64, footerBase64, authSignatureBase64] = await Promise.all(
        [
          toBase64(isFintera ? FinteralogoImage : FlexItlogoImage),
          toBase64(isFintera ? FinteraFooterImage : FlexItFooterImage),
          toBase64(AuthSignature),
        ],
      );

      generateChallanPdf(
        challans,
        logoBase64,
        footerBase64,
        authSignatureBase64,
        courier,
      );
      return true;
    } catch (error) {
      console.error("Invoice export error:", error);
      message.error("An error occurred while exporting invoices.");
      return false;
    } finally {
      challanExportLoading.value = false;
    }
  };

  // Base64 conversion helper
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

  // PSI-এর জন্য আলাদা ফরম্যাটিং ফাংশন
  const formatPSIData = (orders: OrderRequisition[]) => {
    return orders.flatMap((order) => {
      const {
        bookQty,
        leaves,
        startNo,
        bankId,
        bankName,
        accountName,
        chequePrefix,
        micrNo,
        routingNo,
        transactionCode,
        accountNo,
      } = order;

      const branchName = getPSIFormattedBranchName(order);
      const receivingBranchName = getPSIFormattedDeliveryBranchName(order);

      let bookStartNo = Number(startNo);

      return Array.from({ length: bookQty }, () => {
        const strStartNo = bookStartNo.toString().padStart(7, "0");
        const bookEndNo = (bookStartNo + leaves - 1)
          .toString()
          .padStart(7, "0");

        const data = {
          "Bank Name": bankName,
          "Branch Name": branchName,
          "Account Name": accountName,
          "Customer Address": receivingBranchName,
          "Cheque Prefix": chequePrefix,
          "MICR No": micrNo,
          "Cheque Serial": strStartNo,
          "Leaves Quantity": leaves,
          "End No": bookEndNo,
          "Routing No": routingNo,
          "Transaction Code": transactionCode,
          "Account No": accountNo,
          "ID(Inside QR)": order.qrId,
          "Security Code(QR+Under QR)": order.securityCode,
          "Token Text(Leveas Counter part)": order.tokenText,
          "Cover Text(Cover Page)": order.coverText,
        };

        bookStartNo += leaves;

        return data;
      });
    });
  };

  // চেক টাইপ এক্সপোর্টের জন্য আলাদা ফরম্যাটিং ফাংশন
  const formatCheckTypeData = (orders: OrderRequisition[]) => {
    return orders.flatMap((order) => {
      const branchName = getCheckTypeFormattedBranchName(order);
      const receivingBranchName =
        getCheckTypeFormattedDeliveryBranchName(order);

      let bookStartNo = Number(order.startNo);
      // let codes = order.securityCode
      //   ? order.securityCode.split(",").map((code) => code.trim())
      //   : [];
      // codes.join(",")
      return Array.from({ length: order.bookQty }, () => {
        const strStartNo = bookStartNo.toString().padStart(7, "0");

        const data = {
          "Bank Name": order.bankName,
          "Branch Name": branchName,
          "Account Name": order.accountName,
          "Customer Address": receivingBranchName,
          "Cheque Prefix": order.chequePrefix,
          "MICR No": order.micrNo,
          "Cheque Serial": strStartNo,
          "Leaves Quantity": order.leaves,
          "Book Quantity": 1,
          "Routing No": order.routingNo,
          "Transaction Code": order.transactionCode,
          "Account No": order.accountNo,
          "ID(Inside QR)": order.qrId,
          "Security Code(QR+Under QR)": order.securityCode,
          "Token Text(Leveas Counter part)": order.tokenText,
          "Cover Text(Cover Page)": order.coverText,
        };

        bookStartNo += order.leaves;

        return data;
      });
    });
  };
  // PSI-এর জন্য ব্রাঞ্চ নাম ফরম্যাটিং
  const getPSIFormattedBranchName = (order: OrderRequisition) => {
    if (order.isAgent && order.bankId === 2) {
      return `B-${order.branchName} (${
        order.receivingBranchName?.slice(-7) || ""
      })`;
    } else if (order.bankId === 1) {
      return order.branchName.split(",")[0];
    } else if (order.bankId === 7) {
      return order.branchCode;
    } else if (
      (order.bankId === 3 && order.chequePrefix === "PO") ||
      order.bankId === 5 ||
      order.bankId === 8 ||
      order.bankId === 9
    ) {
      return `${order.branchName} (${order.routingNo})`;
    } else {
      return order.branchName;
    }
  };
  const getPSIFormattedDeliveryBranchName = (order: OrderRequisition) => {
    if (order.bankId === 7) {
      return order.branchCode;
    } else if (order.bankId === 5 || order.bankId === 9) {
      return order.branchName;
    } else {
      return order.receivingBranchName;
    }
  };
  // চেক টাইপ এক্সপোর্টের জন্য ব্রাঞ্চ নাম ফরম্যাটিং
  const getCheckTypeFormattedBranchName = (order: OrderRequisition) => {
    if (order.isAgent && order.bankId === 2) {
      return `B-${order.branchName} (${
        order.receivingBranchName?.slice(-7) || ""
      }) (${order.routingNo})`;
    } else if (
      (order.bankId === 3 && order.chequePrefix === "PO") ||
      order.bankId === 5 ||
      order.bankId === 8 ||
      order.bankId === 9
    ) {
      return `${order.branchName} (${order.routingNo})`;
    } else if (order.bankId === 1) {
      return order.branchName.split(",")[0];
    } else if (order.bankId === 7) {
      return order.branchCode;
    } else {
      return order.branchName;
    }
  };
  const getCheckTypeFormattedDeliveryBranchName = (order: OrderRequisition) => {
    if (order.bankId === 7) {
      return order.branchCode;
    } else if (order.bankId === 5 || order.bankId === 9) {
      return order.branchName;
    } else {
      return order.receivingBranchName;
    }
  };

  // রিসেট এক্সপোর্ট স্টেট
  const resetExportStates = () => {
    exportStates.psi.completed = false;
    exportStates.psi.loading = false;
    challanExportLoading.value = false;
    checkTypeVariations.value.forEach((ct) => {
      ct.completed = false;
      ct.loading = false;
    });
  };

  return {
    exportStates,
    checkTypeVariations,
    challanExportLoading,
    completedExports,
    totalRequiredExports,
    progressPercentage,
    allExportsCompleted,
    updateCheckTypeVariations,
    exportByCheckTypeAndPages,
    exportPSI,
    exportChallan,
    resetExportStates,
  };
};
