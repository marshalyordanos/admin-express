// src/types.ts

/** ───── Base API Response ───── */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

/** ───── Enums ───── */
export enum DriverStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  INTAKE = "INTAKE",
  ENROUTE = "ENROUTE",
  BREAK = "BREAK",
}

export enum DriverType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}

export enum AddressPurpose {
  USER_HOME = "USER_HOME",
  USER_WORK = "USER_WORK",
  ORDER_PICKUP = "ORDER_PICKUP",
  ORDER_DELIVERY = "ORDER_DELIVERY",
  BRANCH_LOCATION = "BRANCH_LOCATION",
}

export enum CongestionLevel {
  FREE = "FREE",
  LIGHT = "LIGHT",
  MEDIUM = "MEDIUM",
  HEAVY = "HEAVY",
}

export enum OptimizationType {
  SINGLE_ROUTE = "SINGLE_ROUTE",
  MULTI_STOP = "MULTI_STOP",
}

export enum OptimizationStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum VehicleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export enum FeeType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
  PER_KG = "PER_KG",
  PER_KM = "PER_KM",
}

export enum OrderStatus {
  CREATED = "CREATED",
  COLLECTED = "COLLECTED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  VALIDATED = "VALIDATED",
  SUCCESS = "SUCCESS",
  ASSIGNED = "ASSIGNED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKUP_ATTEMPTED = "PICKUP_ATTEMPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DROPOFF_ATTEMPTED = "DROPOFF_ATTEMPTED",
  DROPPED_OFF = "DROPPED_OFF",
  DISPATCHED = "DISPATCHED",
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  EXCEPTION = "EXCEPTION",
  CANCELED = "CANCELED",
}

export enum ServiceType {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  SAME_DAY = "SAME_DAY",
  OVERNIGHT = "OVERNIGHT",
}

export enum PaymentMethod {
  TELEBIRR = "TELEBIRR",
  WALLET = "WALLET",
  BANK = "BANK",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum FulfillmentType {
  PICKUP = "PICKUP",
  DROPOFF = "DROPOFF",
}

export enum ParcelCategory {
  DOCUMENT = "DOCUMENT",
  ELECTRONICS = "ELECTRONICS",
  FOOD = "FOOD",
  FRAGILE_ITEM = "FRAGILE_ITEM",
  CHEMICAL = "CHEMICAL",
  OTHER = "OTHER",
}

export enum ShipmentType {
  PARCEL = "PARCEL",
  CARRIER = "CARRIER",
}

export enum ShippingScope {
  REGIONAL = "REGIONAL",
  TOWN = "TOWN",
  INTERNATIONAL = "INTERNATIONAL",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ESCALATED = "ESCALATED",
}

export enum DispatchStatus {
  PENDING = "PENDING",
  READY = "READY",
  ASSIGNED = "ASSIGNED",
  COLLECTED = "COLLECTED",
  DISPATCHED = "DISPATCHED",
  PICKEDUP = "PICKEDUP",
  DELIVERED_TO_AIRPORT = "DELIVERED_TO_AIRPORT",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED_AT_DESTINATION = "ARRIVED_AT_DESTINATION",
  OUT_FOR_BRANCH_TRANSFER = "OUT_FOR_BRANCH_TRANSFER",
  AT_BRANCH = "AT_BRANCH",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/** ───── Core Models ───── */
export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  location?: string;
  manager?: any | null;
  orders?: Order[];
  staff: Staff[];
  createdAt?: string;
  updatedAt?: string;
  address: any;
  totalOrders: number;
  activeOrders: number;
  interbranchActive: number;
  staffCount: number;
  revenue: number;
  efficiency: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  manager: any;
  emailVerified: boolean;
  role: Role;
  branch: Branch;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FleetDriver {
  id: string;
  userId: string;
  vehicleId: string;
  status: string;
  availablityStatus: string;
  type: string;
  licenseNumber: string | null;
  licenseExpiry: string | null;
  licenseIssue: string | null;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  verifiedByOCR: boolean;
  currentLat: number;
  currentLon: number;
  updatedAt: string;
  createdBy: string | null;
  user: any;
}

export interface FleetVehicle {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
  model: string;
  driverId: string;
  maxLoad: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  driver: FleetDriver;
}

/** ───── Vehicle ───── */
export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  status: VehicleStatus;
  model?: string;
  driverId?: string;
  createdAt: string;
  updatedAt: string;
  user: any;
}

/** ───── Order ───── */
export interface CustomerAddress {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat: string;
  long: string;
  purpose: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  branchId: string | null;
  createdBy: string | null;
}

export interface CustomerRole {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

export interface CustomerCorporateInfo {
  // Assuming corporate info can have its own fields
  // Keep as nullable for now since the JSON shows null
}

export interface CustomerPreferences {
  // Assuming preferences structure, nullable for now
}

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

  isStaff: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  branch: string | null;
  addresses: CustomerAddress[];
  customerType: string;
  role: CustomerRole;
  corporateInfo: CustomerCorporateInfo | null;
  preferences: CustomerPreferences | null;
}

export interface Receiver {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  serviceType: "EXPRESS" | string;
  fulfillmentType: "PICKUP" | string;
  pickupDriverId: string | null;
  deliveryDriverId: string | null;
  status: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  category: string[];
  isFragile: boolean;
  shipmentType: "PARCEL" | string;
  shippingScope: "TOWN" | string;
  isUnusual: boolean;
  unusualReason: string | null;
  pickupAddressId: string;
  pickupDate: string; // ISO date string
  deliveryAddressId: string;
  deliveryAddress: any;
  deliveryDate: string; // ISO date string
  distance: number;
  validatedBy: string | null;
  validatedNotes: string | null;
  estimatedDeliveryAt: string | null;
  actualDeliveryAt: string | null;
  batchId: string | null;
  finalPrice: number;
  currency: string;
  customer: Customer;
  receiver: Receiver;
  branch: any | null; // Replace 'any' with proper type if known
  payment: any | null; // Replace 'any' with proper type if known
}

/** ───── Driver ───── */
export interface Driver {
  id: string;
  userId: string;
  vehicleId?: string;
  status: DriverStatus;
  type: DriverType;
  currentLat?: number;
  currentLon?: number;
  updatedAt?: string;
  createdBy?: string;
}

/** ───── Other Supporting Models ───── */
export interface ProfilePicture {
  id: string;
  userId: string;
  url: string;
  publicId?: string;
  fileName?: string;
  fileType?: string;
  uploadedAt: string;
}

export interface PodImage {
  id: string;
  driverId: string;
  orderId: string;
  url: string;
  publicId?: string;
  fileName?: string;
  fileType?: string;
  uploadedAt: string;
}

/** ───── Role Permission Models ───── */
export interface Permission {
  id: string;
  resource: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createAction: boolean;
  readAction: boolean;
  updateAction: boolean;
  deleteAction: boolean;
  scope: string[];
  createdBy?: string | null;
  permission: Permission;
}

/** ───── Extended Role with Permissions ───── */
export interface RoleWithPermissions {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  rolePermissions: RolePermission[];
}

/** ───── Response Types ───── */
export type RoleWithPermissionsResponse = ApiResponse<RoleWithPermissions>;
export type RoleWithPermissionsListResponse =
  PaginatedResponse<RoleWithPermissions>;
/** ───── Response Types ───── */
// Single staff
export type StaffDetailResponse = ApiResponse<Staff>;

// Staff list
export type StaffListResponse = PaginatedResponse<Staff>;

// Vehicle response
export type VehicleDetailResponse = ApiResponse<Vehicle>;
export type VehicleListResponse = PaginatedResponse<Vehicle>;

// Order response
export type OrderDetailResponse = ApiResponse<Order>;
export type OrderListResponse = PaginatedResponse<Order>;

// Driver response
export type DriverDetailResponse = ApiResponse<Driver>;
export type DriverListResponse = PaginatedResponse<Driver>;

// Single Branch
export type BranchDetailResponse = ApiResponse<Branch>;

// Branch list
export type BranchListResponse = PaginatedResponse<Branch>;

export type CustomerDetailResponse = ApiResponse<Customer>;
export type CustomerListResponse = PaginatedResponse<Customer>;

export type FleetDetailResponse = ApiResponse<FleetVehicle>;
export type FleetListResponse = PaginatedResponse<FleetVehicle>;

// Generic create/update/delete response
export interface GenericResponse {
  success: boolean;
  message: string;
  data?: any;
}
