import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 20,
  },

  // ✅ Fetch all reviews (Admin)
  fetchReviews: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 20, search = '', status = '' } = params;

      const queryParams = new URLSearchParams({ page, limit });
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);

      const res = await apiClient.get(
        `/reviews/admin/all?${queryParams.toString()}`
      );

      set({
        reviews: res.data.reviews || [],
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

  // ✅ Approve review
  approveReview: async (id) => {
    try {
      await apiClient.put(`/reviews/admin/${id}/approve`);
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === id ? { ...r, status: 'approved' } : r
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reject review
  rejectReview: async (id) => {
    try {
      await apiClient.put(`/reviews/admin/${id}/reject`);
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === id ? { ...r, status: 'rejected' } : r
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Delete review
  deleteReview: async (id) => {
    try {
      await apiClient.delete(`/reviews/${id}`);
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reply to review
  replyToReview: async (id, reply) => {
    try {
      await apiClient.post(`/reviews/admin/${id}/reply`, { reply });
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === id ? { ...r, adminReply: reply } : r
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reset store
  resetStore: () => {
    set({
      reviews: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        limit: 20,
      },
    });
  },
}));

export default useReviewStore;