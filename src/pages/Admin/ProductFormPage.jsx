
// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import apiClient from '../../config/apiClient';
// // import { BiArrowBack, BiSave, BiX, BiUpload, BiLink } from 'react-icons/bi';
// // import Topbar from '../../components/Topbar';

// // const ProductFormPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const isEditMode = Boolean(id);

// //   const [formData, setFormData] = useState({
// //     name: '',
// //     price: '',
// //     description: '',
// //     image: '',
// //     category: '',
// //     stock: 0,
// //   });

// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [fetching, setFetching] = useState(isEditMode);
// //   const [uploading, setUploading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [imageMode, setImageMode] = useState('url');

// //   // ✅ Fetch categories
// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await apiClient.get('/categories');
// //         setCategories(res.data.categories || []);
// //       } catch (err) {
// //         console.error('Categories fetch error:', err);
// //       }
// //     };
// //     fetchCategories();
// //   }, []);

// //   // ✅ Fetch product (edit mode)
// //   useEffect(() => {
// //     if (!isEditMode) return;

// //     const fetchProduct = async () => {
// //       try {
// //         const res = await apiClient.get(`/admin/products/${id}`);
// //         const p = res.data.product;
// //         setFormData({
// //           name: p.name || '',
// //           price: p.price || '',
// //           description: p.description || '',
// //           image: p.image || '',
// //           category: p.category?._id || p.category || '',
// //           stock: p.stock || 0,
// //         });
// //       } catch (err) {
// //         setError('Failed to load product');
// //         console.error(err);
// //       } finally {
// //         setFetching(false);
// //       }
// //     };
// //     fetchProduct();
// //   }, [id, isEditMode]);

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   // ✅ File upload handler
// //   const handleFileUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     if (file.size > 5 * 1024 * 1024) {
// //       alert('File size should be less than 5MB');
// //       return;
// //     }

// //     // Preview
// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       setFormData((prev) => ({ ...prev, image: reader.result }));
// //     };
// //     reader.readAsDataURL(file);

// //     // Upload to Cloudinary via backend
// //     setUploading(true);
// //     try {
// //       const formDataObj = new FormData();
// //       formDataObj.append('image', file);

// //       // ✅ apiClient use karein (headers skip karein — auto set honge)
// //       const res = await apiClient.post('/admin/upload', formDataObj, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       if (res.data.success) {
// //         setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
// //         alert('Image uploaded successfully! ✅');
// //       }
// //     } catch (err) {
// //       console.error('Upload error:', err);
// //       alert(err.response?.data?.message || 'Failed to upload image');
// //       setFormData((prev) => ({ ...prev, image: '' }));
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     try {
// //       const payload = {
// //         ...formData,
// //         price: Number(formData.price),
// //         stock: Number(formData.stock),
// //         category: formData.category || null,
// //       };

// //       if (isEditMode) {
// //         await apiClient.put(`/admin/products/${id}`, payload);
// //         alert('Product updated successfully! ✅');
// //       } else {
// //         await apiClient.post('/admin/products', payload);
// //         alert('Product created successfully! ✅');
// //       }

// //       navigate('/admin/products');
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to save product');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (fetching) {
// //     return (
// //       <div>
// //         <Topbar title="Product Form" />
// //         <div className="p-6 text-center text-stone-500">Loading product...</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <Topbar title={isEditMode ? 'Edit Product' : 'Add New Product'} />

// //       <div className="p-6">
// //         <button
// //           onClick={() => navigate('/admin/products')}
// //           className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15] mb-4"
// //         >
// //           <BiArrowBack /> Back to Products
// //         </button>

// //         <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl">
// //           <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-6">
// //             {isEditMode ? 'Edit Product Details' : 'Create New Product'}
// //           </h2>

// //           {error && (
// //             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
// //               {error}
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             {/* Name */}
// //             <div>
// //               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
// //                 Product Name *
// //               </label>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="e.g., Eco-Friendly Terracotta Diya"
// //                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
// //               />
// //             </div>

// //             {/* Price + Stock */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
// //                   Price (₹) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="price"
// //                   value={formData.price}
// //                   onChange={handleChange}
// //                   required
// //                   min="0"
// //                   placeholder="499"
// //                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
// //                   Stock Quantity
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="stock"
// //                   value={formData.stock}
// //                   onChange={handleChange}
// //                   min="0"
// //                   placeholder="50"
// //                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
// //                 />
// //               </div>
// //             </div>

// //             {/* IMAGE SECTION */}
// //             <div>
// //               <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
// //                 Product Image *
// //               </label>

// //               <div className="flex gap-2 mb-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setImageMode('url')}
// //                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
// //                     imageMode === 'url'
// //                       ? 'bg-[#8c0a15] text-white'
// //                       : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
// //                   }`}
// //                 >
// //                   <BiLink /> Image URL
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setImageMode('upload')}
// //                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
// //                     imageMode === 'upload'
// //                       ? 'bg-[#8c0a15] text-white'
// //                       : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
// //                   }`}
// //                 >
// //                   <BiUpload /> Upload File
// //                 </button>
// //               </div>

// //               {imageMode === 'url' && (
// //                 <input
// //                   type="url"
// //                   name="image"
// //                   value={formData.image}
// //                   onChange={handleChange}
// //                   required
// //                   placeholder="https://res.cloudinary.com/.../image.jpg"
// //                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
// //                 />
// //               )}

// //               {imageMode === 'upload' && (
// //                 <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
// //                   <input
// //                     type="file"
// //                     id="image-upload"
// //                     accept="image/*"
// //                     onChange={handleFileUpload}
// //                     className="hidden"
// //                     disabled={uploading}
// //                   />
// //                   <label
// //                     htmlFor="image-upload"
// //                     className="cursor-pointer flex flex-col items-center gap-2"
// //                   >
// //                     <BiUpload className="text-4xl text-stone-400" />
// //                     <span className="text-sm font-bold text-[#4a2e18]">
// //                       {uploading ? 'Uploading...' : 'Click to upload image'}
// //                     </span>
// //                     <span className="text-xs text-stone-500">
// //                       Max 5MB • JPG, PNG, WEBP
// //                     </span>
// //                   </label>
// //                 </div>
// //               )}

// //               {formData.image && (
// //                 <div className="mt-3 flex items-center gap-3">
// //                   <img
// //                     src={formData.image}
// //                     alt="Preview"
// //                     className="w-24 h-24 object-cover rounded-lg border border-stone-200"
// //                     onError={(e) => (e.target.style.display = 'none')}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setFormData({ ...formData, image: '' })}
// //                     className="text-xs text-red-600 hover:text-red-700 font-bold"
// //                   >
// //                     Remove Image
// //                   </button>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Category */}
// //             <div>
// //               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
// //                 Category
// //               </label>
// //               <select
// //                 name="category"
// //                 value={formData.category}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
// //               >
// //                 <option value="">-- Select Category --</option>
// //                 {categories.map((cat) => (
// //                   <option key={cat._id} value={cat._id}>
// //                     {cat.name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Description */}
// //             <div>
// //               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
// //                 Description
// //               </label>
// //               <textarea
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //                 rows="4"
// //                 placeholder="Product description..."
// //                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
// //               ></textarea>
// //             </div>

// //             {/* Buttons */}
// //             <div className="flex gap-3 pt-4 border-t border-stone-100">
// //               <button
// //                 type="submit"
// //                 disabled={loading || uploading}
// //                 className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
// //               >
// //                 <BiSave />
// //                 {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => navigate('/admin/products')}
// //                 className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-bold text-sm transition"
// //               >
// //                 <BiX /> Cancel
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductFormPage;




// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../config/apiClient';
// import { BiArrowBack, BiSave, BiX, BiUpload, BiLink } from 'react-icons/bi';
// import Topbar from '../../components/Topbar';

// const ProductFormPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     image: '',
//     category: '',
//     stock: 0,
//   });

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(isEditMode);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [imageMode, setImageMode] = useState('url');

//   // ✅ Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await apiClient.get('/categories');
//         setCategories(res.data.categories || []);
//       } catch (err) {
//         console.error('Categories fetch error:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ Fetch product (edit mode)
//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchProduct = async () => {
//       try {
//         const res = await apiClient.get(`/admin/products/${id}`);
//         const p = res.data.product;
//         setFormData({
//           name: p.name || '',
//           price: p.price || '',
//           description: p.description || '',
//           image: p.image || '',
//           category: p.category?._id || p.category || '',
//           stock: p.stock || 0,
//         });
//       } catch (err) {
//         setError('Failed to load product');
//         console.error(err);
//       } finally {
//         setFetching(false);
//       }
//     };
//     fetchProduct();
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // // ✅ File upload handler
//   // const handleFileUpload = async (e) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   if (file.size > 5 * 1024 * 1024) {
//   //     alert('File size should be less than 5MB');
//   //     return;
//   //   }

//   //   // Preview
//   //   const reader = new FileReader();
//   //   reader.onloadend = () => {
//   //     setFormData((prev) => ({ ...prev, image: reader.result }));
//   //   };
//   //   reader.readAsDataURL(file);

//   //   // Upload to Cloudinary via backend
//   //   setUploading(true);
//   //   try {
//   //     const formDataObj = new FormData();
//   //     formDataObj.append('image', file);

//   //     // ✅ apiClient use karein (headers skip karein — auto set honge)
//   //     const res = await apiClient.post('/admin/upload', formDataObj, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //     });

//   //     if (res.data.success) {
//   //       setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
//   //       alert('Image uploaded successfully! ✅');
//   //     }
//   //   } catch (err) {
//   //     console.error('Upload error:', err);
//   //     alert(err.response?.data?.message || 'Failed to upload image');
//   //     setFormData((prev) => ({ ...prev, image: '' }));
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };

//   const handleFileUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   if (file.size > 5 * 1024 * 1024) {
//     alert('File size should be less than 5MB');
//     return;
//   }

//   // ✅ Preview (Base64)
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     setFormData((prev) => ({ ...prev, image: reader.result }));
//   };
//   reader.readAsDataURL(file);

//   // ✅ Upload to Cloudinary via backend
//   setUploading(true);
//   try {
//     const formDataObj = new FormData();
//     formDataObj.append('image', file);

//     const res = await apiClient.post('/admin/upload', formDataObj, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (res.data.success) {
//       // ✅ DEBUG — URL check karo
//       const rawUrl = res.data.imageUrl;
//       console.log("🔍 UPLOAD — RAW URL:", rawUrl);
//       console.log("🔍 UPLOAD — DOTS COUNT:", (rawUrl?.match(/\./g) || []).length);

//       // ✅ Manual fix — agar dots missing hain toh restore karo
//       let fixedUrl = rawUrl;
//       if (fixedUrl && !fixedUrl.includes('res.cloudinary.com')) {
//         fixedUrl = fixedUrl
//           .replace('rescloudinarycom', 'res.cloudinary.com')
//           .replace(/(\w)(jpg|jpeg|png|webp|gif)$/i, '$1.$2');
//       }

//       console.log("🔍 UPLOAD — FIXED URL:", fixedUrl);
//       console.log("🔍 UPLOAD — FIXED DOTS:", (fixedUrl?.match(/\./g) || []).length);

//       setFormData((prev) => ({ ...prev, image: fixedUrl }));
//       alert('Image uploaded successfully! ✅');
//     }
//   } catch (err) {
//     console.error('Upload error:', err);
//     alert(err.response?.data?.message || 'Failed to upload image');
//     setFormData((prev) => ({ ...prev, image: '' }));
//   } finally {
//     setUploading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         stock: Number(formData.stock),
//         category: formData.category || null,
//       };

//       if (isEditMode) {
//         await apiClient.put(`/admin/products/${id}`, payload);
//         alert('Product updated successfully! ✅');
//       } else {
//         await apiClient.post('/admin/products', payload);
//         alert('Product created successfully! ✅');
//       }

//       navigate('/admin/products');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div>
//         <Topbar title="Product Form" />
//         <div className="p-6 text-center text-stone-500">Loading product...</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Topbar title={isEditMode ? 'Edit Product' : 'Add New Product'} />

//       <div className="p-6">
//         <button
//           onClick={() => navigate('/admin/products')}
//           className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15] mb-4"
//         >
//           <BiArrowBack /> Back to Products
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl">
//           <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-6">
//             {isEditMode ? 'Edit Product Details' : 'Create New Product'}
//           </h2>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Eco-Friendly Terracotta Diya"
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             {/* Price + Stock */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   placeholder="499"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Stock Quantity
//                 </label>
//                 <input
//                   type="number"
//                   name="stock"
//                   value={formData.stock}
//                   onChange={handleChange}
//                   min="0"
//                   placeholder="50"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>
//             </div>

//             {/* IMAGE SECTION */}
//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
//                 Product Image *
//               </label>

//               <div className="flex gap-2 mb-3">
//                 <button
//                   type="button"
//                   onClick={() => setImageMode('url')}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
//                     imageMode === 'url'
//                       ? 'bg-[#8c0a15] text-white'
//                       : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                   }`}
//                 >
//                   <BiLink /> Image URL
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setImageMode('upload')}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
//                     imageMode === 'upload'
//                       ? 'bg-[#8c0a15] text-white'
//                       : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                   }`}
//                 >
//                   <BiUpload /> Upload File
//                 </button>
//               </div>

//               {imageMode === 'url' && (
//                 <input
//                   type="url"
//                   name="image"
//                   value={formData.image}
//                   onChange={handleChange}
//                   required
//                   placeholder="https://res.cloudinary.com/.../image.jpg"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               )}

//               {imageMode === 'upload' && (
//                 <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
//                   <input
//                     type="file"
//                     id="image-upload"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                     disabled={uploading}
//                   />
//                   <label
//                     htmlFor="image-upload"
//                     className="cursor-pointer flex flex-col items-center gap-2"
//                   >
//                     <BiUpload className="text-4xl text-stone-400" />
//                     <span className="text-sm font-bold text-[#4a2e18]">
//                       {uploading ? 'Uploading...' : 'Click to upload image'}
//                     </span>
//                     <span className="text-xs text-stone-500">
//                       Max 5MB • JPG, PNG, WEBP
//                     </span>
//                   </label>
//                 </div>
//               )}

//               {formData.image && (
//                 <div className="mt-3 flex items-center gap-3">
//                   <img
//                     src={formData.image}
//                     alt="Preview"
//                     className="w-24 h-24 object-cover rounded-lg border border-stone-200"
//                     onError={(e) => (e.target.style.display = 'none')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setFormData({ ...formData, image: '' })}
//                     className="text-xs text-red-600 hover:text-red-700 font-bold"
//                   >
//                     Remove Image
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
//               >
//                 <option value="">-- Select Category --</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="4"
//                 placeholder="Product description..."
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               ></textarea>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-3 pt-4 border-t border-stone-100">
//               <button
//                 type="submit"
//                 disabled={loading || uploading}
//                 className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
//               >
//                 <BiSave />
//                 {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/products')}
//                 className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-bold text-sm transition"
//               >
//                 <BiX /> Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductFormPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { BiArrowBack, BiSave, BiX, BiUpload, BiLink } from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mrp: '',           // ✅ MRP add kiya
    description: '',
    image: '',
    category: '',
    stock: 0,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageMode, setImageMode] = useState('url');

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Categories fetch error:', err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch product (edit mode)
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`/admin/products/${id}`);
        const p = res.data.product;
        setFormData({
          name: p.name || '',
          price: p.price || '',
          mrp: p.mrp || '',               // ✅ MRP add kiya
          description: p.description || '',
          image: p.image || '',
          category: p.category?._id || p.category || '',
          stock: p.stock || 0,
        });
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend
    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const res = await apiClient.post('/admin/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        const rawUrl = res.data.imageUrl;
        console.log("🔍 UPLOAD — RAW URL:", rawUrl);
        console.log("🔍 UPLOAD — DOTS COUNT:", (rawUrl?.match(/\./g) || []).length);

        let fixedUrl = rawUrl;
        if (fixedUrl && !fixedUrl.includes('res.cloudinary.com')) {
          fixedUrl = fixedUrl
            .replace('rescloudinarycom', 'res.cloudinary.com')
            .replace(/(\w)(jpg|jpeg|png|webp|gif)$/i, '$1.$2');
        }

        console.log("🔍 UPLOAD — FIXED URL:", fixedUrl);

        setFormData((prev) => ({ ...prev, image: fixedUrl }));
        alert('Image uploaded successfully! ✅');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Failed to upload image');
      setFormData((prev) => ({ ...prev, image: '' }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : 0,   // ✅ MRP add kiya
        stock: Number(formData.stock),
        category: formData.category || null,
      };

      console.log("🔍 SUBMIT — PAYLOAD:", payload);

      if (isEditMode) {
        await apiClient.put(`/admin/products/${id}`, payload);
        alert('Product updated successfully! ✅');
      } else {
        await apiClient.post('/admin/products', payload);
        alert('Product created successfully! ✅');
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Discount calculate (preview ke liye)
  const calculateDiscount = () => {
    const price = Number(formData.price) || 0;
    const mrp = Number(formData.mrp) || 0;

    if (mrp > price && mrp > 0) {
      const percent = Math.round(((mrp - price) / mrp) * 100);
      const save = mrp - price;
      return { percent, save };
    }
    return { percent: 0, save: 0 };
  };

  const discount = calculateDiscount();

  if (fetching) {
    return (
      <div>
        <Topbar title="Product Form" />
        <div className="p-6 text-center text-stone-500">Loading product...</div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title={isEditMode ? 'Edit Product' : 'Add New Product'} />

      <div className="p-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15] mb-4"
        >
          <BiArrowBack /> Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl">
          <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-6">
            {isEditMode ? 'Edit Product Details' : 'Create New Product'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Eco-Friendly Terracotta Diya"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            {/* Selling Price + MRP + Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="499"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  min="0"
                  placeholder="999"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
                <p className="text-[10px] text-stone-500 mt-1">Original price</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="50"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>
            </div>

            {/* ✅ Discount Preview */}
            {discount.percent > 0 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-sm font-bold text-green-800">
                    {discount.percent}% OFF — Save ₹{discount.save}
                  </p>
                  <p className="text-xs text-green-600">
                    Customer will see: <strong>₹{formData.price}</strong>{' '}
                    <span className="line-through">₹{formData.mrp}</span>
                  </p>
                </div>
              </div>
            )}

            {/* IMAGE SECTION */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                Product Image *
              </label>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                    imageMode === 'url'
                      ? 'bg-[#8c0a15] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <BiLink /> Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                    imageMode === 'upload'
                      ? 'bg-[#8c0a15] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <BiUpload /> Upload File
                </button>
              </div>

              {imageMode === 'url' && (
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              )}

              {imageMode === 'upload' && (
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <BiUpload className="text-4xl text-stone-400" />
                    <span className="text-sm font-bold text-[#4a2e18]">
                      {uploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <span className="text-xs text-stone-500">
                      Max 5MB • JPG, PNG, WEBP
                    </span>
                  </label>
                </div>
              )}

              {formData.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-xs text-red-600 hover:text-red-700 font-bold"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Product description..."
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                <BiSave />
                {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-bold text-sm transition"
              >
                <BiX /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;