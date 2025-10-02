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
  orders: Order[];
  staff: Staff[];
}

export interface Order {
  id: string;
  description: string;
  amount: number;
}

export interface PaginationType {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
