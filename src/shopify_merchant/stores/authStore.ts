import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'staff';
  avatar: string;
}

interface AuthState {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  collaborators: { name: string; email: string; role: string; permissions: string[] }[];
  addCollaborator: (collab: { name: string; email: string; role: string; permissions: string[] }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: {
    name: 'YONGCHENG LUO',
    email: 'centrotuina90@gmail.com',
    role: 'owner',
    avatar: 'YL',
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  collaborators: [
    { name: '员工-01: Admin Director', email: 'admin@mystore.com', role: 'admin', permissions: ['sales', 'procurement', 'products'] },
    { name: '员工-02: Warehouse Assistant', email: 'staff@mystore.com', role: 'staff', permissions: ['inventory_read', 'shipping_read'] },
  ],
  addCollaborator: (collab) => set((state) => ({ collaborators: [...state.collaborators, collab] })),
}));
