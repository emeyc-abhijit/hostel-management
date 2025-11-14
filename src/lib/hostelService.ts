import { Hostel } from '@/types';

const STORAGE_KEY = 'hms_hostels';

const seedHostels: Hostel[] = [
  {
    id: 'h1',
    name: 'Block A - Boys Hostel',
    code: 'BLK-A',
    address: 'Medhavi Campus, North Wing',
    capacity: 200,
    occupied: 150,
    warden: 'Warden Singh',
    wardenPhone: '+91 9876500001',
    facilities: ['WiFi', 'Gym', 'Mess', 'Common Room', 'Laundry'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h2',
    name: 'Block B - Girls Hostel',
    code: 'BLK-B',
    address: 'Medhavi Campus, South Wing',
    capacity: 150,
    occupied: 120,
    warden: 'Mrs. Sharma',
    wardenPhone: '+91 9876500010',
    facilities: ['WiFi', 'Gym', 'Mess', 'Common Room', 'Laundry', 'Security'],
    createdAt: new Date().toISOString(),
  },
];

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedHostels));
  }
}

const getHostels = async (): Promise<Hostel[]> => {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Hostel[];
};

const getHostelById = async (id: string): Promise<Hostel | undefined> => {
  const list = await getHostels();
  return list.find((h) => h.id === id);
};

const createHostel = async (hostel: Hostel): Promise<void> => {
  const list = await getHostels();
  list.push(hostel);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const updateHostel = async (id: string, updates: Partial<Hostel>): Promise<Hostel | undefined> => {
  const list = await getHostels();
  const idx = list.findIndex((h) => h.id === id);
  if (idx === -1) return undefined;
  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return updated;
};

const deleteHostel = async (id: string): Promise<boolean> => {
  const list = await getHostels();
  const filtered = list.filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length !== list.length;
};

export default {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};
