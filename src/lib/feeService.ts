import { Fee } from '@/types';
import { mockFees } from '@/lib/mockData';

const API_BASE = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:4000';

const tokenHeader = () => {
  const token = localStorage.getItem('hms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeFetch = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('Network');
  return res.json();
};

// localStorage fallback
const FEES_KEY = 'hms_fees';
const loadOrSeed = <T,>(key: string, seed: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
};

export const initFeesStorage = () => {
  loadOrSeed<Fee[]>(FEES_KEY, mockFees);
};

const normalizeId = (val: unknown) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>;
    return String(o._id ?? o.id ?? '');
  }
  return '';
};

export const getFees = async (): Promise<Fee[]> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/fees`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    return (data.fees || []).map((f: unknown) => {
      const obj = f as Record<string, unknown>;
      return {
        id: String(obj._id ?? obj.id ?? ''),
  studentId: normalizeId(obj.studentId),
        studentName: String(obj.studentName ?? ''),
        amount: Number(obj.amount ?? 0),
        dueDate: String(obj.dueDate ?? ''),
        paidDate: obj.paidDate ? String(obj.paidDate) : undefined,
        status: String(obj.status ?? 'pending') as Fee['status'],
        type: String(obj.type ?? 'hostel') as Fee['type'],
        description: String(obj.description ?? ''),
      } as Fee;
    });
  } catch (err) {
    initFeesStorage();
    const raw = localStorage.getItem(FEES_KEY)!;
    return JSON.parse(raw) as Fee[];
  }
};

export const getFeeById = async (id: string): Promise<Fee | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/fees/${id}`, { headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    const f = data.fee;
    if (!f) return undefined;
    const obj = f as Record<string, unknown>;
    return {
      id: String(obj._id ?? obj.id ?? ''),
  studentId: normalizeId(obj.studentId),
      studentName: String(obj.studentName ?? ''),
      amount: Number(obj.amount ?? 0),
      dueDate: String(obj.dueDate ?? ''),
      paidDate: obj.paidDate ? String(obj.paidDate) : undefined,
      status: String(obj.status ?? 'pending') as Fee['status'],
      type: String(obj.type ?? 'hostel') as Fee['type'],
      description: String(obj.description ?? ''),
    } as Fee;
  } catch (err) {
    const fees = await getFees();
    return fees.find((x) => x.id === id);
  }
};

export const createFee = async (fee: Partial<Fee>): Promise<Fee | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/fees`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(fee) });
    return data.fee ? await getFeeById(String(data.fee._id ?? data.fee.id)) : undefined;
  } catch (err) {
    const fees = await getFees();
    const id = Math.random().toString(36).slice(2, 9);
    const newFee: Fee = {
      id,
      studentId: String(fee.studentId ?? ''),
      studentName: String(fee.studentName ?? ''),
      amount: Number(fee.amount ?? 0),
      dueDate: String(fee.dueDate ?? new Date().toISOString()),
      status: (fee.status ?? 'pending') as Fee['status'],
      type: (fee.type ?? 'hostel') as Fee['type'],
      description: String(fee.description ?? ''),
    };
    fees.push(newFee);
    localStorage.setItem(FEES_KEY, JSON.stringify(fees));
    return newFee;
  }
};

export const updateFee = async (id: string, updates: Partial<Fee>): Promise<Fee | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/fees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...tokenHeader() }, body: JSON.stringify(updates) });
    return data.fee ? await getFeeById(String(data.fee._id ?? data.fee.id)) : undefined;
  } catch (err) {
    const fees = await getFees();
    const idx = fees.findIndex(f => f.id === id);
    if (idx === -1) return undefined;
    fees[idx] = { ...fees[idx], ...updates } as Fee;
    localStorage.setItem(FEES_KEY, JSON.stringify(fees));
    return fees[idx];
  }
};

export const deleteFee = async (id: string): Promise<boolean> => {
  try {
    await safeFetch(`${API_BASE}/api/fees/${id}`, { method: 'DELETE', headers: { ...tokenHeader() } });
    return true;
  } catch (err) {
    let fees = await getFees();
    fees = fees.filter(f => f.id !== id);
    localStorage.setItem(FEES_KEY, JSON.stringify(fees));
    return true;
  }
};

export const markFeePaid = async (id: string): Promise<Fee | undefined> => {
  try {
    const data = await safeFetch(`${API_BASE}/api/fees/${id}/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...tokenHeader() } });
    return data.fee ? await getFeeById(String(data.fee._id ?? data.fee.id)) : undefined;
  } catch (err) {
    const fees = await getFees();
    const idx = fees.findIndex(f => f.id === id);
    if (idx === -1) return undefined;
    fees[idx].status = 'paid';
    fees[idx].paidDate = new Date().toISOString();
    localStorage.setItem(FEES_KEY, JSON.stringify(fees));
    return fees[idx];
  }
};

export default {
  initFeesStorage,
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  markFeePaid,
};
