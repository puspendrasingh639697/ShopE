import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useBannerStore = create((set, get) => ({
  banners: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBanners: 0,
    limit: 20,
  },

  // ✅ Fetch all banners
  fetchBanners: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 20, position = '', isActive = '' } = params;

      const queryParams = new URLSearchParams({ page, limit });
      if (position) queryParams.append('position', position);
      if (isActive !== '') queryParams.append('isActive', isActive);

      const res = await apiClient.get(
        `/banners/admin/all?${queryParams.toString()}`
      );

      set({
        banners: res.data.banners || [],
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

  // ✅ Get single banner
  getBanner: async (id) => {
    try {
      const res = await apiClient.get(`/banners/admin/${id}`);
      return { success: true, banner: res.data.banner };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Create banner
  createBanner: async (bannerData) => {
    try {
      const res = await apiClient.post('/banners/admin', bannerData);
      set((state) => ({
        banners: [res.data.banner, ...state.banners],
      }));
      return { success: true, banner: res.data.banner };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const res = await apiClient.put(`/banners/admin/${id}`, bannerData);
      set((state) => ({
        banners: state.banners.map((b) =>
          b._id === id ? res.data.banner : b
        ),
      }));
      return { success: true, banner: res.data.banner };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Toggle status
  toggleBannerStatus: async (id) => {
    try {
      const res = await apiClient.put(`/banners/admin/${id}/toggle`);
      set((state) => ({
        banners: state.banners.map((b) =>
          b._id === id ? res.data.banner : b
        ),
      }));
      return { success: true, banner: res.data.banner };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Delete banner
  deleteBanner: async (id) => {
    try {
      await apiClient.delete(`/banners/admin/${id}`);
      set((state) => ({
        banners: state.banners.filter((b) => b._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Reset
  resetStore: () => {
    set({
      banners: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBanners: 0,
        limit: 20,
      },
    });
  },
}));

export default useBannerStore;