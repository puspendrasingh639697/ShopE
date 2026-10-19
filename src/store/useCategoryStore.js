import { create } from 'zustand';
import apiClient from '../config/apiClient';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    limit: 20,
  },

  // ✅ Fetch all categories (Admin)
  fetchCategories: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 20, search = '', isActive = '' } = params;

      const queryParams = new URLSearchParams({ page, limit });
      if (search) queryParams.append('search', search);
      if (isActive !== '') queryParams.append('isActive', isActive);

      const res = await apiClient.get(
        `/categories/admin/all?${queryParams.toString()}`
      );

      set({
        categories: res.data.categories || [],
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

  // ✅ Fetch public categories (only active — for products form)
  fetchPublicCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      set({ categories: res.data.categories || [] });
      return { success: true, categories: res.data.categories };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Create category
  createCategory: async (formData) => {
    try {
      const res = await apiClient.post('/categories/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({
        categories: [res.data.category, ...state.categories],
      }));
      return { success: true, category: res.data.category };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Update category
  updateCategory: async (id, formData) => {
    try {
      const res = await apiClient.put(`/categories/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === id ? { ...res.data.category, productCount: c.productCount } : c
        ),
      }));
      return { success: true, category: res.data.category };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Toggle status
  toggleCategoryStatus: async (id) => {
    try {
      const res = await apiClient.put(`/categories/admin/${id}/toggle`);
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === id ? { ...c, isActive: res.data.category.isActive } : c
        ),
      }));
      return { success: true, category: res.data.category };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ✅ Delete
  deleteCategory: async (id) => {
    try {
      await apiClient.delete(`/categories/admin/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ✅ Reset
  resetStore: () => {
    set({
      categories: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCategories: 0,
        limit: 20,
      },
    });
  },
}));

export default useCategoryStore;