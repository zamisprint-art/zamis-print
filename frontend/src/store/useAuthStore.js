import { create } from 'zustand';

// Parse initial state from localStorage if it exists
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const useAuthStore = create((set) => ({
    userInfo: userInfoFromStorage,
    
    setCredentials: (data) => set(() => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        return { userInfo: data };
    }),
    
    logout: () => set(() => {
        localStorage.removeItem('userInfo');
        return { userInfo: null };
    }),
}));
