export interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  type: "Individual" | "Corporate";
  status: "Active" | "Inactive" | "Suspended";
  registrationDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  address: string;
  city: string;
  notes: string;
  // Corporate specific fields
  companyName?: string;
  contactPerson?: string;
  contractNumber?: string;
  creditLimit?: number;
  paymentTerms?: string;
  // Additional fields
  preferredLanguage: string;
  communicationPreference: "Email" | "SMS" | "Phone";
  marketingOptIn: boolean;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  note: string;
  type: "General" | "Special Instructions" | "Issue" | "Follow-up";
  createdBy: string;
  createdAt: string;
  isImportant: boolean;
}

export interface CustomerComplaint {
  id: string;
  customerId: string;
  orderId?: string;
  type: "Service" | "Delivery" | "Billing" | "Product";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  description: string;
  resolution?: string;
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CustomerRefund {
  id: string;
  customerId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "Pending" | "Approved" | "Processed" | "Rejected";
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  processedAt?: string;
}

export interface CustomerDiscount {
  id: string;
  customerId: string;
  type: "Percentage" | "Fixed Amount" | "Free Shipping";
  value: number;
  description: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  city: string;
  notes: string;
  companyName: string;
  contactPerson: string;
  contractNumber: string;
  creditLimit: string;
  paymentTerms: string;
  preferredLanguage: string;
  communicationPreference: string;
  marketingOptIn: boolean;
}
