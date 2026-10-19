// import { create } from 'zustand';
// import axios from 'axios';
// import API_BASE_URL from '../config/api';

// const useNotificationStore = create((set) => ({
//   notifications: [],
//   unreadCount: 0,
//   loading: false,

//   // ✅ Fetch notifications
//   fetchNotifications: async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     set({ loading: true });
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/admin/notifications/admin`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set({
//         notifications: res.data.notifications || [],
//         unreadCount: res.data.unreadCount || 0,
//         loading: false,
//       });
//     } catch (err) {
//       console.error('Fetch notifications error:', err);
//       set({ loading: false });
//     }
//   },

//   // ✅ Fetch unread count only
//   fetchUnreadCount: async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/admin/notifications/unread-count`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set({ unreadCount: res.data.unreadCount || 0 });
//     } catch (err) {
//       console.error(err);
//     }
//   },

//   // ✅ Mark as read
//   markAsRead: async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/notifications/${id}/read`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set((state) => ({
//         notifications: state.notifications.map((n) =>
//           n._id === id ? { ...n, isRead: true } : n
//         ),
//         unreadCount: Math.max(0, state.unreadCount - 1),
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   },

//   // ✅ Mark all as read
//   markAllAsRead: async () => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/notifications/read-all`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set((state) => ({
//         notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
//         unreadCount: 0,
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   },

//   // ✅ Delete notification
//   deleteNotification: async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(
//         `${API_BASE_URL}/admin/notifications/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set((state) => ({
//         notifications: state.notifications.filter((n) => n._id !== id),
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   },
// }));

// export default useNotificationStore;

import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ loading: true });
    try {
      const res = await apiClient.get('/admin/notifications/admin');
      set({
        notifications: res.data.notifications || [],
        unreadCount: res.data.unreadCount || 0,
        loading: false,
      });
    } catch (err) {
      console.error('Fetch notifications error:', err);
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await apiClient.get('/admin/notifications/unread-count');
      set({ unreadCount: res.data.unreadCount || 0 });
    } catch (err) {
      console.error(err);
    }
  },

  markAsRead: async (id) => {
    try {
      await apiClient.put(`/admin/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.put('/admin/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteNotification: async (id) => {
    try {
      await apiClient.delete(`/admin/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useNotificationStore;