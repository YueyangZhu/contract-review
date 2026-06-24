import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('cr_token'),
  username: localStorage.getItem('cr_username'),
  setAuth: (token, username) => {
    localStorage.setItem('cr_token', token);
    localStorage.setItem('cr_username', username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem('cr_token');
    localStorage.removeItem('cr_username');
    set({ token: null, username: null });
  },
}));
