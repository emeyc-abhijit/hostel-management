import { Room, Student } from '@/types';

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
  };
};

const mapRoom = (r: unknown): Room => {
  const obj = r as Record<string, unknown>;
  const students = Array.isArray(obj.students) ? obj.students : [];
  return {
    id: String(obj._id ?? obj.id ?? ''),
    number: String(obj.number ?? ''),
    floor: Number(obj.floor ?? 0),
    capacity: Number(obj.capacity ?? 0),
    occupied: Number(obj.occupied ?? 0),
  type: (String(obj.type ?? 'double') as Room['type']),
  status: (String(obj.status ?? 'available') as Room['status']),
    hostel: String(obj.hostel ?? ''),
    students: students.map((s) => mapStudent(s)),
  } as Room;
};

export const initStorage = () => {
  // keep localStorage seed for fallback and offline usage (no-op here)
};

export const getRooms = async (): Promise<Room[]> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    return (data.rooms || []).map((r: unknown) => mapRoom(r)) as Room[];
  } catch (e) {
    // Fallback to empty array if backend unavailable
    return [];
  }
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms/${id}`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    if (!data.room) return undefined;
    return mapRoom(data.room) as Room;
  } catch (e) {
    return undefined;
  }
};

export const createRoom = async (room: Partial<Room>): Promise<Room | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(room) });
    return data.room ? mapRoom(data.room) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const updateRoom = async (id: string, updates: Partial<Room>): Promise<Room | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(updates) });
    return data.room ? mapRoom(data.room) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteRoom = async (id: string): Promise<boolean> => {
  try {
    await safeFetch(`${API_BASE}/api/rooms/${id}`, { method: 'DELETE', headers: { ...tokenHeader() } });
    return true;
  } catch (e) {
    return false;
  }
};

export const getStudents = async (): Promise<Student[]> => {
  try {
    // Prefer backend /api/students which includes unassigned students
    const res = await safeFetch(`${API_BASE}/api/students`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    const list = (res.students || []).map((s: unknown) => {
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
    });
    return list;
  } catch (e) {
    return [];
  }
};

export const updateStudent = async (_id: string, updates: Partial<Student>): Promise<Student | undefined> => {
  // No students API yet; frontend updates are local only.
  return undefined;
};

export const assignStudentToRoom = async (roomId: string, studentId: string): Promise<{room?: Room; student?: Student}> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms/${roomId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify({ studentId }) });
    return { room: data.room ? mapRoom(data.room) : undefined, student: data.student ? mapStudent(data.student) : undefined };
  } catch (e) {
    return {};
  }
};

export const removeStudentFromRoom = async (roomId: string, studentId: string): Promise<{room?: Room; student?: Student}> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/rooms/${roomId}/students/${studentId}`, { method: 'DELETE', headers: { ...tokenHeader() } });
    return { room: data.room ? mapRoom(data.room) : undefined, student: data.student ? mapStudent(data.student) : undefined };
  } catch (e) {
    return {};
  }
};

export default {
  initStorage,
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getStudents,
  updateStudent,
  assignStudentToRoom,
  removeStudentFromRoom,
};
