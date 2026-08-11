// types/order.ts - নিচের ইম্পোর্টগুলো যোগ করুন
export interface OrderRequisition {
  id: number;
  bankId: number;
  bankName: string;
  branchName: string;
  accountNo: string;
  accountName: string;
  routingNo: string;
  receivingBranchName: string;
  startNo: string;
  endNo: string;
  serverity: number;
  micrNo: string;
  transactionCode: number;
  series: string;
  chequeType: string;
  leaves: number;
  bookQty: number;
  statusName: string;
  reDate: string;
  isAgent: boolean;
  chequePrefix?: string;
  vendorName?: string;
  branchCode?: string;
  deliveryBranchCode?: string;
  accFlag?: string;
  qrId?: string;
  securityCode?: string;
  tokenText?: string;
  coverText?: string;
}

export interface Bank {
  id: number;
  bankName: string;
}
export interface Courier {
  id: number;
  courierName: string;
  courierCode: string;
}

export interface CheckTypeVariation {
  type?: string;
  pages: number;
  count: number;
  accFlag?: string;
  bankId: number;
  loading: boolean;
  completed: boolean;
}

export interface ExportStates {
  psi: {
    loading: boolean;
    completed: boolean;
  };
}

export interface Filters {
  bank?: number;
  accountNumber?: string;
  severity?: number;
  requestDate?: string;
  agentType?: boolean;
  courier?: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
}
