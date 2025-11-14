import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hostel } from '@/types';
import hostelService from '@/lib/hostelService';

interface HostelContextType {
  selectedHostel: Hostel | null;
  setSelectedHostel: (hostel: Hostel | null) => void;
  hostels: Hostel[];
  refreshHostels: () => Promise<void>;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider = ({ children }: { children: ReactNode }) => {
  const [selectedHostel, setSelectedHostelState] = useState<Hostel | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);

  const refreshHostels = async () => {
    const data = await hostelService.getHostels();
    setHostels(data);
    
    // If there's a stored hostel ID, restore it
    const storedId = localStorage.getItem('selectedHostelId');
    if (storedId) {
      const hostel = data.find(h => h.id === storedId);
      if (hostel) {
        setSelectedHostelState(hostel);
      } else if (data.length > 0) {
        setSelectedHostelState(data[0]);
        localStorage.setItem('selectedHostelId', data[0].id);
      }
    } else if (data.length > 0) {
      setSelectedHostelState(data[0]);
      localStorage.setItem('selectedHostelId', data[0].id);
    }
  };

  useEffect(() => {
    refreshHostels();
  }, []);

  const setSelectedHostel = (hostel: Hostel | null) => {
    setSelectedHostelState(hostel);
    if (hostel) {
      localStorage.setItem('selectedHostelId', hostel.id);
    } else {
      localStorage.removeItem('selectedHostelId');
    }
  };

  return (
    <HostelContext.Provider value={{ selectedHostel, setSelectedHostel, hostels, refreshHostels }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within HostelProvider');
  }
  return context;
};
