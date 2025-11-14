export type UserRole = 'admin' | 'warden' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
  enrollmentNumber: string;
  course: string;
  year: number;
  guardianName: string;
  guardianPhone: string;
  address: string;
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: 'single' | 'double' | 'triple' | 'quad';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  hostel: string;
  students?: Student[];
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'hostel' | 'mess' | 'security' | 'other';
  description: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: 'maintenance' | 'cleanliness' | 'food' | 'security' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'warden' | 'other';
  position?: string;
  hostel?: string;
  avatar?: string;
}


export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  createdBy: string;
  targetRoles: UserRole[];
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  occupied: number;
  warden?: string;
  wardenPhone?: string;
  facilities: string[];
  createdAt: string;
}
