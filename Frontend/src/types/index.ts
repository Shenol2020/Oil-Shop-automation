export interface Product {
  pID: number;
  p_name: string;
  categoryID: number;
  price: string | number;
  current_stock_quantity: number;
  supplierID?: number;
  description?: string;
  image_url?: string;
  pic?: string;
  brand?: string;
  volume?: string;
}

export interface CustomerUser {
  userId: string;
  name: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  role: 'Customer';
}

export interface EmployeeUser {
  userId: string;
  name: string;
  email: string;
  role: 'ShopStaff' | 'MainAdmin' | 'Manager';
  accessLevel?: string;
  dateJoined?: string;
  qrCodeBase64?: string;
}

export type AuthUser = CustomerUser | EmployeeUser;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrderItem {
  orderItemId?: number;
  product: Product;
  quantity: number;
  unitPriceAtOrder: number;
}

export interface CustomerOrder {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
  payment: string;
  customer?: {
    userId: string;
    name: string;
    email: string;
  };
  orderItems: CustomerOrderItem[];
}

export interface LeaveRequest {
  leaveId: number;
  userId: string;
  userName?: string;
  leaveType: 'ANNUAL' | 'CASUAL' | 'SICK' | 'MATERNITY' | 'OTHER';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
  appliedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  workDate: string;
  arrivalTime: string;
  departureTime?: string | null;
  workHours?: number;
}

export interface AttendanceScanResponse {
  action: 'ARRIVAL' | 'DEPARTURE';
  record: AttendanceRecord;
  totalPay: number;
}
