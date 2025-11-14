/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default to localhost backend port 4000 when VITE_API_URL isn't set (dev convenience).
const API_BASE = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:4000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session: prefer token-based session with backend /me endpoint
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('hms_token');
      const storedUser = localStorage.getItem('hms_user');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Session invalid');
          const data = await res.json();
          // backend returns { user }
          const backendUser = data.user as User;
          setUser(backendUser);
          localStorage.setItem('hms_user', JSON.stringify(backendUser));
          setIsLoading(false);
          return;
        } catch (err) {
          // clear invalid session
          localStorage.removeItem('hms_token');
          localStorage.removeItem('hms_user');
        }
      }

      // fallback: check stored user (for dev/mocked sessions)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (_) {
          localStorage.removeItem('hms_user');
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json();
      const token = data.token as string;
      const loggedUser = data.user as User;
      if (token) localStorage.setItem('hms_token', token);
      if (loggedUser) localStorage.setItem('hms_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
