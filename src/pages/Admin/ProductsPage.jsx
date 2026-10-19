

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import apiClient from '../../config/apiClient';
// // import {
// //   BiSearch, BiPlus, BiEdit, BiTrash,
// //   BiChevronLeft, BiChevronRight,
// // } from 'react-icons/bi';
// // import Topbar from '../../components/Topbar';

// // const ProductsPage = () => {
// //   const navigate = useNavigate();
// //   const [allProducts, setAllProducts] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [categoryFilter, setCategoryFilter] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const limit = 12;

// //   // ✅ Fetch all products
// //   const fetchProducts = async () => {
// //     try {
// //       const res = await apiClient.get('/products/all');
// //       const data = res.data.products || res.data || [];
// //       setAllProducts(data);
// //     } catch (err) {
// //       console.error('Fetch products error:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchProducts();
// //   }, []);

// //   // ✅ Frontend filter + pagination
// //   useEffect(() => {
// //     let filtered = [...allProducts];

// //     if (searchTerm) {
// //       filtered = filtered.filter(
// //         (p) =>
// //           p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (categoryFilter) {
// //       filtered = filtered.filter((p) => p.category?.name === categoryFilter);
// //     }

// //     const total = Math.ceil(filtered.length / limit);
// //     setTotalPages(total || 1);

// //     const start = (currentPage - 1) * limit;
// //     const paginated = filtered.slice(start, start + limit);
// //     setProducts(paginated);
// //   }, [allProducts, searchTerm, categoryFilter, currentPage]);

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, categoryFilter]);

// //   const categories = [
// //     ...new Set(allProducts.map((p) => p.category?.name).filter(Boolean)),
// //   ];

// //   // ✅ Delete product
// //   const handleDelete = async (e, productId, productName) => {
// //     e.stopPropagation();
// //     if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
// //     try {
// //       await apiClient.delete(`/admin/products/${productId}`);
// //       alert('Product deleted ✅');
// //       fetchProducts();
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to delete');
// //     }
// //   };

// //   const goToPage = (page) => {
// //     if (page < 1 || page > totalPages) return;
// //     setCurrentPage(page);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const filteredCount = allProducts.filter((p) => {
// //     let match = true;
// //     if (searchTerm) {
// //       match =
// //         match &&
// //         (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
// //     }
// //     if (categoryFilter) {
// //       match = match && p.category?.name === categoryFilter;
// //     }
// //     return match;
// //   }).length;

// //   return (
// //     <div>
// //       <Topbar title="Products Management" />

// //       <div className="p-6">
// //         {/* Filters + Add Button */}
// //         <div className="flex flex-wrap items-center gap-3 mb-4">
// //           <div className="relative flex-1 min-w-[250px]">
// //             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
// //             <input
// //               type="text"
// //               placeholder="Search products..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
// //             />
// //           </div>

// //           <select
// //             value={categoryFilter}
// //             onChange={(e) => setCategoryFilter(e.target.value)}
// //             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
// //           >
// //             <option value="">All Categories</option>
// //             {categories.map((cat) => (
// //               <option key={cat} value={cat}>
// //                 {cat}
// //               </option>
// //             ))}
// //           </select>

// //           <p className="text-sm text-stone-500">
// //             Total: <strong className="text-[#8c0a15]">{filteredCount}</strong>
// //           </p>

// //           <button
// //             onClick={() => navigate('/admin/products/new')}
// //             className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
// //           >
// //             <BiPlus /> Add Product
// //           </button>
// //         </div>

// //         {/* Products Grid */}
// //         {loading ? (
// //           <div className="text-center py-20 text-stone-500">Loading products...</div>
// //         ) : products.length === 0 ? (
// //           <div className="text-center py-20 text-stone-500">No products found.</div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //             {products.map((product) => (
// //               <div
// //                 key={product._id}
// //                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group relative"
// //               >
// //                 <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition">
// //                   <button
// //                     onClick={() => navigate(`/admin/products/edit/${product._id}`)}
// //                     className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 shadow"
// //                     title="Edit"
// //                   >
// //                     <BiEdit />
// //                   </button>
// //                   <button
// //                     onClick={(e) => handleDelete(e, product._id, product.name)}
// //                     className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 shadow"
// //                     title="Delete"
// //                   >
// //                     <BiTrash />
// //                   </button>
// //                 </div>

// //                 <div className="aspect-square bg-[#faf6f0] overflow-hidden">
// //                   <img
// //                     src={product.image}
// //                     alt={product.name}
// //                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
// //                   />
// //                 </div>

// //                 <div className="p-4">
// //                   {product.category?.name && (
// //                     <span className="text-[10px] uppercase tracking-wider text-[#8c0a15] font-bold">
// //                       {product.category.name}
// //                     </span>
// //                   )}
// //                   <h3 className="text-sm font-medium text-[#4a2e18] line-clamp-2 mt-1">
// //                     {product.name}
// //                   </h3>
// //                   <div className="flex items-center justify-between mt-3">
// //                     <span className="text-lg font-bold text-[#8c0a15]">
// //                       ₹{product.price?.toLocaleString('en-IN')}
// //                     </span>
// //                     <span
// //                       className={`text-xs font-bold px-2 py-1 rounded ${
// //                         product.stock > 0
// //                           ? 'bg-green-100 text-green-700'
// //                           : 'bg-red-100 text-red-700'
// //                       }`}
// //                     >
// //                       {product.stock > 0 ? `In Stock (${product.stock})` : 'Out'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Pagination */}
// //         {!loading && products.length > 0 && totalPages > 1 && (
// //           <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
// //             <p className="text-xs text-stone-500">
// //               Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
// //             </p>

// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => goToPage(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 <BiChevronLeft /> Prev
// //               </button>

// //               <div className="flex gap-1">
// //                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                   let pageNum;
// //                   if (totalPages <= 5) {
// //                     pageNum = i + 1;
// //                   } else if (currentPage <= 3) {
// //                     pageNum = i + 1;
// //                   } else if (currentPage >= totalPages - 2) {
// //                     pageNum = totalPages - 4 + i;
// //                   } else {
// //                     pageNum = currentPage - 2 + i;
// //                   }

// //                   return (
// //                     <button
// //                       key={pageNum}
// //                       onClick={() => goToPage(pageNum)}
// //                       className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
// //                         currentPage === pageNum
// //                           ? 'bg-[#8c0a15] text-white'
// //                           : 'border border-stone-300 hover:bg-stone-50'
// //                       }`}
// //                     >
// //                       {pageNum}
// //                     </button>
// //                   );
// //                 })}
// //               </div>

// //               <button
// //                 onClick={() => goToPage(currentPage + 1)}
// //                 disabled={currentPage === totalPages}
// //                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 Next <BiChevronRight />
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductsPage;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../../config/apiClient';
// import {
//   BiSearch, BiPlus, BiEdit, BiTrash,
//   BiChevronLeft, BiChevronRight, BiDownload,
// } from 'react-icons/bi';
// import Topbar from '../../components/Topbar';

// const ProductsPage = () => {
//   const navigate = useNavigate();
//   const [allProducts, setAllProducts] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 12;

//   // ✅ Fetch all products
//   const fetchProducts = async () => {
//     try {
//       const res = await apiClient.get('/products/all');
//       const data = res.data.products || res.data || [];
//       setAllProducts(data);
//     } catch (err) {
//       console.error('Fetch products error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ✅ Frontend filter + pagination
//   useEffect(() => {
//     let filtered = [...allProducts];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (p) =>
//           p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (categoryFilter) {
//       filtered = filtered.filter((p) => p.category?.name === categoryFilter);
//     }

//     const total = Math.ceil(filtered.length / limit);
//     setTotalPages(total || 1);

//     const start = (currentPage - 1) * limit;
//     const paginated = filtered.slice(start, start + limit);
//     setProducts(paginated);
//   }, [allProducts, searchTerm, categoryFilter, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, categoryFilter]);

//   const categories = [
//     ...new Set(allProducts.map((p) => p.category?.name).filter(Boolean)),
//   ];

//   // ✅ Delete product
//   const handleDelete = async (e, productId, productName) => {
//     e.stopPropagation();
//     if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
//     try {
//       await apiClient.delete(`/admin/products/${productId}`);
//       alert('Product deleted ✅');
//       fetchProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete');
//     }
//   };

//   // ✅ Export products to CSV
//   const handleExport = async () => {
//     try {
//       const res = await apiClient.get('/admin/export/products', {
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `products_${Date.now()}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       alert('Products exported! ✅');
//     } catch (err) {
//       console.error('Export error:', err);
//       alert('Export failed');
//     }
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const filteredCount = allProducts.filter((p) => {
//     let match = true;
//     if (searchTerm) {
//       match =
//         match &&
//         (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
//     }
//     if (categoryFilter) {
//       match = match && p.category?.name === categoryFilter;
//     }
//     return match;
//   }).length;

//   return (
//     <div>
//       <Topbar title="Products Management" />

//       <div className="p-6">
//         {/* Filters + Add Button */}
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="relative flex-1 min-w-[250px]">
//             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
//             />
//           </div>

//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>

//           <p className="text-sm text-stone-500">
//             Total: <strong className="text-[#8c0a15]">{filteredCount}</strong>
//           </p>

//           {/* ✅ Export Button */}
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
//           >
//             <BiDownload /> Export CSV
//           </button>

//           <button
//             onClick={() => navigate('/admin/products/new')}
//             className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
//           >
//             <BiPlus /> Add Product
//           </button>
//         </div>

//         {/* Products Grid */}
//         {loading ? (
//           <div className="text-center py-20 text-stone-500">Loading products...</div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20 text-stone-500">No products found.</div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group relative"
//               >
//                 <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition">
//                   <button
//                     onClick={() => navigate(`/admin/products/edit/${product._id}`)}
//                     className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 shadow"
//                     title="Edit"
//                   >
//                     <BiEdit />
//                   </button>
//                   <button
//                     onClick={(e) => handleDelete(e, product._id, product.name)}
//                     className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 shadow"
//                     title="Delete"
//                   >
//                     <BiTrash />
//                   </button>
//                 </div>

//                 <div className="aspect-square bg-[#faf6f0] overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>

//                 <div className="p-4">
//                   {product.category?.name && (
//                     <span className="text-[10px] uppercase tracking-wider text-[#8c0a15] font-bold">
//                       {product.category.name}
//                     </span>
//                   )}
//                   <h3 className="text-sm font-medium text-[#4a2e18] line-clamp-2 mt-1">
//                     {product.name}
//                   </h3>
//                   <div className="flex items-center justify-between mt-3">
//                     <span className="text-lg font-bold text-[#8c0a15]">
//                       ₹{product.price?.toLocaleString('en-IN')}
//                     </span>
//                     <span
//                       className={`text-xs font-bold px-2 py-1 rounded ${
//                         product.stock > 0
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                     >
//                       {product.stock > 0 ? `In Stock (${product.stock})` : 'Out'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && products.length > 0 && totalPages > 1 && (
//           <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
//             <p className="text-xs text-stone-500">
//               Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <BiChevronLeft /> Prev
//               </button>

//               <div className="flex gap-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => goToPage(pageNum)}
//                       className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
//                         currentPage === pageNum
//                           ? 'bg-[#8c0a15] text-white'
//                           : 'border border-stone-300 hover:bg-stone-50'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next <BiChevronRight />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiSearch, BiPlus, BiEdit, BiTrash,
  BiChevronLeft, BiChevronRight, BiDownload, BiErrorCircle,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products/all');
      const data = res.data.products || res.data || [];
      setAllProducts(data);
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Frontend filter + pagination
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category?.name === categoryFilter);
    }

    // ✅ Stock Filter
    if (stockFilter === 'low') {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 10);
    }
    if (stockFilter === 'out') {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    const total = Math.ceil(filtered.length / limit);
    setTotalPages(total || 1);

    const start = (currentPage - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    setProducts(paginated);
  }, [allProducts, searchTerm, categoryFilter, currentPage, stockFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter]);

  const categories = [
    ...new Set(allProducts.map((p) => p.category?.name).filter(Boolean)),
  ];

  // ✅ Delete product
  const handleDelete = async (e, productId, productName) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/admin/products/${productId}`);
      alert('Product deleted ✅');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  // ✅ Stock Update
  const handleStockUpdate = async (productId) => {
    if (newStock === '' || newStock < 0) {
      alert('Valid stock required');
      return;
    }

    try {
      await apiClient.put(`/admin/products/${productId}/stock`, {
        stock: Number(newStock),
      });
      setEditingStock(null);
      setNewStock('');
      fetchProducts();
      alert('Stock updated! ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  // ✅ Export products to CSV
  const handleExport = async () => {
    try {
      const res = await apiClient.get('/admin/export/products', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('Products exported! ✅');
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCount = allProducts.filter((p) => {
    let match = true;
    if (searchTerm) {
      match =
        match &&
        (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter) {
      match = match && p.category?.name === categoryFilter;
    }
    if (stockFilter === 'low') {
      match = match && p.stock > 0 && p.stock <= 10;
    }
    if (stockFilter === 'out') {
      match = match && p.stock === 0;
    }
    return match;
  }).length;

  return (
    <div>
      <Topbar title="Products Management" />

      <div className="p-6">
        {/* Filters + Add Button */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* ✅ Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Stock</option>
            <option value="low">⚠️ Low Stock (≤10)</option>
            <option value="out">❌ Out of Stock</option>
          </select>

          <p className="text-sm text-stone-500">
            Total: <strong className="text-[#8c0a15]">{filteredCount}</strong>
          </p>

          {/* ✅ Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
          >
            <BiDownload /> Export CSV
          </button>

          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
          >
            <BiPlus /> Add Product
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-stone-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group relative"
              >
                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                    className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 shadow"
                    title="Edit"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, product._id, product.name)}
                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 shadow"
                    title="Delete"
                  >
                    <BiTrash />
                  </button>
                </div>

                {/* ✅ Low Stock Badge */}
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <BiErrorCircle /> Low
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                    Out
                  </div>
                )}

                <div className="aspect-square bg-[#faf6f0] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4">
                  {product.category?.name && (
                    <span className="text-[10px] uppercase tracking-wider text-[#8c0a15] font-bold">
                      {product.category.name}
                    </span>
                  )}
                  <h3 className="text-sm font-medium text-[#4a2e18] line-clamp-2 mt-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-[#8c0a15]">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    {/* ✅ Stock badge — Click to update */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingStock(product._id);
                        setNewStock(product.stock || 0);
                      }}
                      className={`text-xs font-bold px-2 py-1 rounded transition hover:scale-105 ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stock <= 10
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                      title="Click to update stock"
                    >
                      {product.stock === 0
                        ? 'Out of Stock'
                        : product.stock <= 10
                        ? `⚠️ Low (${product.stock})`
                        : `In Stock (${product.stock})`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
            <p className="text-xs text-stone-500">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiChevronLeft /> Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-[#8c0a15] text-white'
                          : 'border border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <BiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Stock Update Modal */}
      {editingStock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Update Stock
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                New Stock Quantity
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                autoFocus
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStockUpdate(editingStock)}
                className="flex-1 bg-[#8c0a15] hover:bg-[#6b080f] text-white py-2.5 rounded-lg font-bold text-sm"
              >
                Update Stock
              </button>
              <button
                onClick={() => {
                  setEditingStock(null);
                  setNewStock('');
                }}
                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-2.5 rounded-lg font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;