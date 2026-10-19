// import { create } from 'zustand';
// import axios from 'axios';
// import API_BASE_URL from '../config/api';

// const useAuthStore = create((set) => ({
//   user: JSON.parse(localStorage.getItem('user') || 'null'),
//   token: localStorage.getItem('token') || null,
//   loading: false,
//   error: null,

//   // ✅ Universal Login
//   login: async (email, password) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       });

//       const { token, refreshToken, user } = response.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       localStorage.setItem('user', JSON.stringify(user));

//       set({ user, token, loading: false, error: null });
//       return { success: true, user };
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Login failed';
//       set({ error: errorMsg, loading: false });
//       return { success: false, error: errorMsg };
//     }
//   },

//   // ✅ Logout
//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     localStorage.removeItem('cartUserId');
//     set({ user: null, token: null });
//   },

//   // ✅ Role Checks
//   isAdmin: () => {
//     const u = JSON.parse(localStorage.getItem('user') || '{}');
//     return u.role === 'admin' || u.role === 'super_admin';
//   },
//   isSuperAdmin: () => {
//     const u = JSON.parse(localStorage.getItem('user') || '{}');
//     return u.role === 'super_admin';
//   },
//   isBlogAdmin: () => {
//     const u = JSON.parse(localStorage.getItem('user') || '{}');
//     return u.role === 'blog_admin' || u.role === 'super_admin';
//   },
// }));

// export default useAuthStore;


import { create } from 'zustand';
import apiClient from '../config/apiClient';   // ✅ apiClient import

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // ✅ Universal Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // ✅ apiClient use karein
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ✅ Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cartUserId');
    set({ user: null, token: null });
  },

  // ✅ Role Checks
  isAdmin: () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.role === 'admin' || u.role === 'super_admin';
  },
  isSuperAdmin: () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.role === 'super_admin';
  },
  isBlogAdmin: () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.role === 'blog_admin' || u.role === 'super_admin';
  },
}));

export default useAuthStore;