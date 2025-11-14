import { Student } from '@/types';

const API_BASE = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:4000';

const tokenHeader = () => {
  const token = localStorage.getItem('hms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeFetch = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('Network');
  return res.json();
};

const mapStudent = (s: unknown): Student => {
  const obj = s as Record<string, unknown>;
  return {
    id: String(obj._id ?? obj.id ?? ''),
    name: String(obj.name ?? ''),
    email: String(obj.email ?? ''),
    phone: String(obj.phone ?? ''),
    roomNumber: obj.roomNumber as string | undefined,
    enrollmentNumber: String(obj.enrollmentNumber ?? ''),
    course: String(obj.course ?? ''),
    year: Number(obj.year ?? 0),
    guardianName: String(obj.guardianName ?? ''),
    guardianPhone: String(obj.guardianPhone ?? ''),
    address: String(obj.address ?? ''),
    avatar: String(obj.avatar ?? ''),
  } as Student;
};

export const getStudents = async (): Promise<Student[]> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/students`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    return (data.students || []).map((s: unknown) => mapStudent(s));
  } catch (e) {
    return [];
  }
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/students/${id}`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    if (!data.student) return undefined;
    return mapStudent(data.student);
  } catch (e) {
    return undefined;
  }
};

export const createStudent = async (payload: Partial<Student>): Promise<Student | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/students`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(payload) });
    return data.student ? mapStudent(data.student) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(updates) });
    return data.student ? mapStudent(data.student) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    await safeFetch(`${API_BASE}/api/students/${id}`, { method: 'DELETE', headers: { ...tokenHeader() } });
    return true;
  } catch (e) {
    return false;
  }
};

export default { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
