export type UserRole = 'admin' | 'warden' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Hostel {
  id: string;
  name: string;
  type: 'boys' | 'girls';
  totalRooms: number;
  occupiedRooms: number;
  capacity: number;
  currentOccupancy: number;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: 'single' | 'double' | 'triple';
  status: 'available' | 'full' | 'maintenance';
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  roomId?: string;
  hostelId?: string;
  admissionDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'allocated';
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  year: number;
  preferredHostel?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
  postedBy: string;
  postedAt: string;
  expiresAt?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  semester: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}
