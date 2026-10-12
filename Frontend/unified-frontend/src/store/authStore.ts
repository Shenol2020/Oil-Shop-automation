import { create } from 'zustand';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  role: 'Customer' | 'ShopStaff' | 'MainAdmin' | null;
  token: string | null;
  setUser: (user: AuthUser | null, token?: string | null) => void;
  logout: () => void;
}

const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('doc_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  role: initialUser ? initialUser.role : null,
  token: localStorage.getItem('doc_auth_token'),
  setUser: (user, token = null) => {
    if (user) {
      localStorage.setItem('doc_user', JSON.stringify(user));
      if (token) localStorage.setItem('doc_auth_token', token);
      set({ user, role: user.role, token: token || localStorage.getItem('doc_auth_token') });
    } else {
      localStorage.removeItem('doc_user');
      localStorage.removeItem('doc_auth_token');
      set({ user: null, role: null, token: null });
    }
  },
  logout: () => {
    localStorage.removeItem('doc_user');
    localStorage.removeItem('doc_auth_token');
    set({ user: null, role: null, token: null });
  },
}));
