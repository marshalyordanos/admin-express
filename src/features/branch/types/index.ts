export interface Staff {
  id: string;
  name: string;
  email: string;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId: string | null;
  orders: any[];
  staff: Staff[];
}

export interface PaginationType {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
