import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useReturnStore = create((set, get) => ({
  returns: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReturns: 0,
    limit: 20,
  },
  stats: null,

  // ✅ Fetch all returns (Admin)
  fetchReturns: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 20, search = '', status = '' } = params;

      const queryParams = new URLSearchParams({ page, limit });
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);

      const res = await apiClient.get(
        `/returns/admin/all?${queryParams.toString()}`
      );

      set({
        returns: res.data.returns || [],
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

  // ✅ Get single return
  getReturn: async (id) => {
    try {
      const res = await apiClient.get(`/returns/admin/${id}`);
      return { success: true, returnRequest: res.data.returnRequest };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Approve return
  approveReturn: async (id, adminNote) => {
    try {
      const res = await apiClient.put(`/returns/admin/${id}/approve`, { adminNote });
      set((state) => ({
        returns: state.returns.map((r) =>
          r._id === id ? res.data.returnRequest : r
        ),
      }));
      return { success: true, returnRequest: res.data.returnRequest };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Reject return
  rejectReturn: async (id, adminNote) => {
    try {
      const res = await apiClient.put(`/returns/admin/${id}/reject`, { adminNote });
      set((state) => ({
        returns: state.returns.map((r) =>
          r._id === id ? res.data.returnRequest : r
        ),
      }));
      return { success: true, returnRequest: res.data.returnRequest };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Process refund
  processRefund: async (id, refundData) => {
    try {
      const res = await apiClient.put(`/returns/admin/${id}/refund`, refundData);
      set((state) => ({
        returns: state.returns.map((r) =>
          r._id === id ? res.data.returnRequest : r
        ),
      }));
      return { success: true, returnRequest: res.data.returnRequest };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Fetch stats
  fetchStats: async () => {
    try {
      const res = await apiClient.get('/returns/admin/stats');
      set({ stats: res.data.stats });
      return { success: true, stats: res.data.stats };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reset
  resetStore: () => {
    set({
      returns: [],
      loading: false,
      error: null,
      stats: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalReturns: 0,
        limit: 20,
      },
    });
  },
}));

export default useReturnStore;