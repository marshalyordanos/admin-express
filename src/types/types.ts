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
  analytics: any;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  role: Role;
  branch: Branch;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
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
}

/** ───── Order ───── */
export interface Order {
  id: string;
  trackingCode: string;
  customerId: string;
  receiverId?: string;
  branchId?: string;
  pickupDriverId?: string;
  deliveryDriverId?: string;
  status: OrderStatus;
  serviceType: ServiceType;
  fulfillmentType: FulfillmentType;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  category?: ParcelCategory;
  isFragile: boolean;
  shipmentType?: ShipmentType;
  shippingScope?: ShippingScope;
  isUnusual: boolean;
  unusualReason?: string;
  pickupAddressId?: string;
  pickupDate?: string;
  deliveryAddressId?: string;
  deliveryDate?: string;
  pickupConfirmed: boolean;
  dropoffConfirmed: boolean;
  actualPickupDate?: string;
  actualDropoffDate?: string;
  notes?: string;
  cost?: number;
  distance?: number;
  validatedBy?: string;
  validatedAt?: string;
  validatedNotes?: string;
  quantity?: number;
  createdAt: string;
  updatedAt: string;
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

// Generic create/update/delete response
export interface GenericResponse {
  success: boolean;
  message: string;
  data?: any;
}
