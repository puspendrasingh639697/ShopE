import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useActivityStore = create((set, get) => ({
  activities: [],
  loading: false,
  error: null,
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalActivities: 0,
    limit: 30,
  },

  // ✅ Fetch all activities
  fetchActivities: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const {
        page = 1,
        limit = 30,
        search = '',
        action = '',
        targetModel = '',
        startDate = '',
        endDate = '',
      } = params;

      const queryParams = new URLSearchParams({ page, limit });
      if (search) queryParams.append('search', search);
      if (action) queryParams.append('action', action);
      if (targetModel) queryParams.append('targetModel', targetModel);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const res = await apiClient.get(`/activity?${queryParams.toString()}`);

      set({
        activities: res.data.activities || [],
        pagination: res.data.pagination || get().pagination,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return { success: false, error: err.message };
    }
  },

  // ✅ Fetch stats
  fetchStats: async () => {
    try {
      const res = await apiClient.get('/activity/stats');
      set({ stats: res.data.stats });
      return { success: true, stats: res.data.stats };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Delete activity
  deleteActivity: async (id) => {
    try {
      await apiClient.delete(`/activity/${id}`);
      set((state) => ({
        activities: state.activities.filter((a) => a._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Cleanup old
  cleanupOld: async (days = 30) => {
    try {
      const res = await apiClient.delete(`/activity/cleanup?days=${days}`);
      set({ activities: [] });
      return { success: true, deletedCount: res.data.deletedCount };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Clear all
  clearAll: async () => {
    try {
      await apiClient.delete('/activity');
      set({
        activities: [],
        pagination: { ...get().pagination, totalActivities: 0 },
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reset
  resetStore: () => {
    set({
      activities: [],
      loading: false,
      error: null,
      stats: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalActivities: 0,
        limit: 30,
      },
    });
  },
}));

export default useActivityStore;