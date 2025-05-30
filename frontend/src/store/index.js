import { create } from 'zustand';

const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const useStore = create((set) => ({
  user: initialUser,
  setCredentials: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  signOut: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

export default useStore;
