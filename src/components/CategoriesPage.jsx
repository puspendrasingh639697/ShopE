// import React, { useEffect, useState } from 'react';
// import {
//   BiPlus, BiEdit, BiTrash, BiX, BiUpload, BiLink,
//   BiCheckCircle, BiXCircle, BiCategory, BiSearch,
//   BiChevronLeft, BiChevronRight,
// } from 'react-icons/bi';
// import useCategoryStore from '../store/useCategoryStore';
// import Topbar from './Topbar';
// // import useCategoryStore from '../../store/useCategoryStore';
// // import Topbar from '../../components/Topbar';

// const CategoriesPage = () => {
//   const {
//     categories,
//     loading,
//     pagination,
//     fetchCategories,
//     createCategory,
//     updateCategory,
//     toggleCategoryStatus,
//     deleteCategory,
//   } = useCategoryStore();

//   const [showForm, setShowForm] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imageMode, setImageMode] = useState('url');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     image: '',
//     isActive: true,
//   });

//   // ✅ Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setCurrentPage(1);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // ✅ Fetch categories
//   useEffect(() => {
//     fetchCategories({
//       page: currentPage,
//       limit: 20,
//       search: debouncedSearch,
//       isActive: statusFilter,
//     });
//   }, [currentPage, debouncedSearch, statusFilter]);

//   const resetForm = () => {
//     setFormData({ name: '', description: '', image: '', isActive: true });
//     setEditingCategory(null);
//     setImageFile(null);
//     setShowForm(false);
//     setImageMode('url');
//   };

//   const handleEdit = (category) => {
//     setEditingCategory(category);
//     setFormData({
//       name: category.name || '',
//       description: category.description || '',
//       image: category.image || '',
//       isActive: category.isActive !== false,
//     });
//     setImageFile(null);
//     setImageMode('url');
//     setShowForm(true);
//   };

//   // ✅ File upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size should be less than 5MB');
//       return;
//     }

//     setImageFile(file);

//     // Preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData((prev) => ({ ...prev, image: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   // ✅ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name) {
//       alert('Name is required');
//       return;
//     }

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('description', formData.description);
//     data.append('isActive', formData.isActive);

//     // ✅ Image: File ya URL
//     if (imageFile) {
//       data.append('image', imageFile);
//     } else if (formData.image && !formData.image.startsWith('data:')) {
//       data.append('image', formData.image);
//     }

//     let result;
//     if (editingCategory) {
//       result = await updateCategory(editingCategory._id, data);
//     } else {
//       result = await createCategory(data);
//     }

//     if (result.success) {
//       alert(editingCategory ? 'Category updated! ✅' : 'Category created! ✅');
//       resetForm();
//       fetchCategories({ page: currentPage });
//     } else {
//       alert(result.error || 'Failed');
//     }
//   };

//   const handleToggle = async (id) => {
//     await toggleCategoryStatus(id);
//   };

//   const handleDelete = async (id, name, productCount) => {
//     if (productCount > 0) {
//       alert(`Cannot delete. ${productCount} products exist in this category.`);
//       return;
//     }
//     if (!window.confirm(`Delete category "${name}"?`)) return;
//     const result = await deleteCategory(id);
//     if (result.success) {
//       alert('Category deleted ✅');
//     } else {
//       alert(result.error || 'Failed');
//     }
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.totalPages) return;
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Topbar title="Categories Management" />

//       <div className="p-6">
//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="relative flex-1 min-w-[250px]">
//             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
//             <input
//               type="text"
//               placeholder="Search categories..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Status</option>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>

//           <p className="text-sm text-stone-500 ml-auto">
//             Total: <strong className="text-[#8c0a15]">{pagination.totalCategories}</strong> categories
//           </p>

//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
//           >
//             <BiPlus /> Add Category
//           </button>
//         </div>

//         {/* Form */}
//         {showForm && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
//                 {editingCategory ? 'Edit Category' : 'Add New Category'}
//               </h2>
//               <button onClick={resetForm} className="text-stone-400 hover:text-stone-600">
//                 <BiX className="text-xl" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Name */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Category Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                   placeholder="e.g., Yantra & Idols"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows="3"
//                   placeholder="Category description..."
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 ></textarea>
//               </div>

//               {/* Image */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
//                   Category Image
//                 </label>

//                 <div className="flex gap-2 mb-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setImageMode('url');
//                       setImageFile(null);
//                     }}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
//                       imageMode === 'url'
//                         ? 'bg-[#8c0a15] text-white'
//                         : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                     }`}
//                   >
//                     <BiLink /> Image URL
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setImageMode('upload');
//                       setFormData({ ...formData, image: '' });
//                     }}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
//                       imageMode === 'upload'
//                         ? 'bg-[#8c0a15] text-white'
//                         : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                     }`}
//                   >
//                     <BiUpload /> Upload File
//                   </button>
//                 </div>

//                 {imageMode === 'url' && (
//                   <input
//                     type="url"
//                     value={formData.image}
//                     onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//                     placeholder="https://res.cloudinary.com/..."
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                   />
//                 )}

//                 {imageMode === 'upload' && (
//                   <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
//                     <input
//                       type="file"
//                       id="cat-upload"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                     <label
//                       htmlFor="cat-upload"
//                       className="cursor-pointer flex flex-col items-center gap-2"
//                     >
//                       <BiUpload className="text-4xl text-stone-400" />
//                       <span className="text-sm font-bold text-[#4a2e18]">
//                         {imageFile ? imageFile.name : 'Click to upload image'}
//                       </span>
//                       <span className="text-xs text-stone-500">Max 5MB</span>
//                     </label>
//                   </div>
//                 )}

//                 {formData.image && (
//                   <div className="mt-3">
//                     <img
//                       src={formData.image}
//                       alt="Preview"
//                       className="w-32 h-32 object-cover rounded-lg border border-stone-200"
//                       onError={(e) => (e.target.style.display = 'none')}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Active */}
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isActive}
//                   onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                   className="w-5 h-5"
//                 />
//                 <span className="text-sm font-bold text-[#4a2e18]">
//                   Active (Show on website)
//                 </span>
//               </label>

//               {/* Buttons */}
//               <div className="flex gap-3 pt-4 border-t border-stone-100">
//                 <button
//                   type="submit"
//                   className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition"
//                 >
//                   {editingCategory ? 'Update Category' : 'Create Category'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-bold text-sm transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Categories Grid */}
//         {loading ? (
//           <div className="p-6 text-center text-stone-500 bg-white rounded-xl">Loading categories...</div>
//         ) : categories.length === 0 ? (
//           <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
//             <BiCategory className="text-4xl mx-auto mb-2 text-stone-300" />
//             No categories yet. Add your first category above.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {categories.map((category) => (
//               <div
//                 key={category._id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden group"
//               >
//                 {/* Image */}
//                 <div className="relative aspect-video bg-stone-100 overflow-hidden">
//                   {category.image ? (
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => (e.target.style.display = 'none')}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <BiCategory className="text-5xl text-stone-300" />
//                     </div>
//                   )}
//                   <span
//                     className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
//                       category.isActive
//                         ? 'bg-green-500 text-white'
//                         : 'bg-red-500 text-white'
//                     }`}
//                   >
//                     {category.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-[#8c0a15] text-white">
//                     {category.productCount || 0} products
//                   </span>
//                 </div>

//                 {/* Info */}
//                 <div className="p-4">
//                   <h3 className="font-bold text-[#4a2e18] text-sm">{category.name}</h3>
//                   <p className="text-xs text-stone-500 mt-1">/{category.slug}</p>
//                   {category.description && (
//                     <p className="text-xs text-stone-600 mt-2 line-clamp-2">
//                       {category.description}
//                     </p>
//                   )}

//                   {/* Actions */}
//                   <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
//                     <button
//                       onClick={() => handleToggle(category._id)}
//                       className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
//                         category.isActive
//                           ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                           : 'bg-green-100 text-green-700 hover:bg-green-200'
//                       }`}
//                     >
//                       {category.isActive ? (
//                         <><BiXCircle /> Deactivate</>
//                       ) : (
//                         <><BiCheckCircle /> Activate</>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => handleEdit(category)}
//                       className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold"
//                     >
//                       <BiEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(category._id, category.name, category.productCount)}
//                       className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold ml-auto transition ${
//                         category.productCount > 0
//                           ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
//                           : 'bg-red-100 text-red-700 hover:bg-red-200'
//                       }`}
//                       title={category.productCount > 0 ? 'Cannot delete — products exist' : 'Delete'}
//                     >
//                       <BiTrash />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && categories.length > 0 && pagination.totalPages > 1 && (
//           <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
//             <p className="text-xs text-stone-500">
//               Page <strong>{currentPage}</strong> of <strong>{pagination.totalPages}</strong>
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={!pagination.hasPrevPage}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
//               >
//                 <BiChevronLeft /> Prev
//               </button>
//               <span className="text-xs font-bold text-[#8c0a15]">{currentPage}</span>
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={!pagination.hasNextPage}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
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

// export default CategoriesPage;


import React, { useEffect, useState } from 'react';
import {
  BiPlus, BiEdit, BiTrash, BiX, BiUpload, BiLink,
  BiCheckCircle, BiXCircle, BiCategory, BiSearch,
  BiChevronLeft, BiChevronRight,
} from 'react-icons/bi';
import useCategoryStore from '../store/useCategoryStore';
import Topbar from './Topbar';
import apiClient from '../config/apiClient';
const CategoriesPage = () => {
  const {
    categories,
    loading,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
  } = useCategoryStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageMode, setImageMode] = useState('url');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch categories
  useEffect(() => {
    fetchCategories({
      page: currentPage,
      limit: 20,
      search: debouncedSearch,
      isActive: statusFilter,
    });
  }, [currentPage, debouncedSearch, statusFilter]);

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '', isActive: true });
    setEditingCategory(null);
    setImageFile(null);
    setShowForm(false);
    setImageMode('url');
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== false,
    });
    setImageFile(null);
    setImageMode('url');
    setShowForm(true);
  };

  // // ✅ File upload
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   if (file.size > 5 * 1024 * 1024) {
  //     alert('File size should be less than 5MB');
  //     return;
  //   }

  //   setImageFile(file);

  //   // Preview (Base64)
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setFormData((prev) => ({ ...prev, image: reader.result }));
  //   };
  //   reader.readAsDataURL(file);
  // };


  // ✅ File upload (with backend call)
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('File size should be less than 5MB');
    return;
  }

  // ✅ Preview (Base64)
  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData((prev) => ({ ...prev, image: reader.result }));
  };
  reader.readAsDataURL(file);

  // ✅ Backend par upload karo — Cloudinary URL lene ke liye
  try {
    console.log('🔍 Uploading file:', file.name);

    const uploadData = new FormData();
    uploadData.append('image', file);

    const res = await apiClient.post('/admin/upload', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('🔍 Upload response:', res.data);

    if (res.data.success) {
      console.log('✅ Cloudinary URL:', res.data.imageUrl);
      console.log('🔍 DOTS:', (res.data.imageUrl.match(/\./g) || []).length);

      // ✅ Cloudinary URL set karo
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
      setImageFile(file);
    } else {
      alert('Upload failed: ' + (res.data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('❌ Upload error:', err);
    alert('Upload error: ' + (err.response?.data?.message || err.message));
  }
};
  // // ✅ Submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!formData.name) {
  //     alert('Name is required');
  //     return;
  //   }

  //   const data = new FormData();
  //   data.append('name', formData.name);
  //   data.append('description', formData.description || '');
  //   data.append('isActive', formData.isActive);

  //   // ✅ Image: File ya URL
  //   if (imageFile) {
  //     data.append('image', imageFile);
  //     console.log('🔍 UPLOAD — FILE:', imageFile.name);
  //   } else if (formData.image && !formData.image.startsWith('data:')) {
  //     data.append('image', formData.image);
  //     console.log('🔍 UPLOAD — URL:', formData.image);
  //     console.log('🔍 UPLOAD — DOTS:', (formData.image.match(/\./g) || []).length);
  //   } else {
  //     console.log('❌ No image provided');
  //   }

  //   let result;
  //   if (editingCategory) {
  //     result = await updateCategory(editingCategory._id, data);
  //   } else {
  //     result = await createCategory(data);
  //   }

  //   if (result.success) {
  //     alert(editingCategory ? 'Category updated! ✅' : 'Category created! ✅');
  //     resetForm();
  //     fetchCategories({ page: currentPage });
  //   } else {
  //     alert(result.error || 'Failed');
  //   }
  // };


 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name) {
    alert('Name is required');
    return;
  }

  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description || '');
  data.append('isActive', formData.isActive);

  // ✅ Image: Cloudinary URL priority
  if (formData.image && formData.image.startsWith('http')) {
    // ✅ Cloudinary URL hai — yeh bhejo
    data.append('image', formData.image);
    console.log('🔍 SUBMIT — URL:', formData.image);
    console.log('🔍 SUBMIT — DOTS:', (formData.image.match(/\./g) || []).length);
  } else if (imageFile) {
    // ✅ File hai — yeh bhejo
    data.append('image', imageFile);
    console.log('🔍 SUBMIT — FILE:', imageFile.name);
  } else {
    console.log('❌ SUBMIT — No image');
  }

  let result;
  if (editingCategory) {
    result = await updateCategory(editingCategory._id, data);
  } else {
    result = await createCategory(data);
  }

  if (result.success) {
    alert(editingCategory ? 'Category updated! ✅' : 'Category created! ✅');
    resetForm();
    fetchCategories({ page: currentPage });
  } else {
    alert(result.error || 'Failed');
  }
};

  const handleToggle = async (id) => {
    await toggleCategoryStatus(id);
  };

  const handleDelete = async (id, name, productCount) => {
    if (productCount > 0) {
      alert(`Cannot delete. ${productCount} products exist in this category.`);
      return;
    }
    if (!window.confirm(`Delete category "${name}"?`)) return;
    const result = await deleteCategory(id);
    if (result.success) {
      alert('Category deleted ✅');
    } else {
      alert(result.error || 'Failed');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <Topbar title="Categories Management" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total: <strong className="text-[#8c0a15]">{pagination.totalCategories}</strong> categories
          </p>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
          >
            <BiPlus /> Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={resetForm} className="text-stone-400 hover:text-stone-600">
                <BiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Yantra & Idols"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Category description..."
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                ></textarea>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                  Category Image
                </label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImageMode('url');
                      setImageFile(null);
                    }}
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
                    onClick={() => {
                      setImageMode('upload');
                      setFormData({ ...formData, image: '' });
                    }}
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
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                  />
                )}

                {imageMode === 'upload' && (
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
                    <input
                      type="file"
                      id="cat-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cat-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <BiUpload className="text-4xl text-stone-400" />
                      <span className="text-sm font-bold text-[#4a2e18]">
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </span>
                      <span className="text-xs text-stone-500">Max 5MB</span>
                    </label>
                  </div>
                )}

                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-stone-200"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              {/* Active */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-bold text-[#4a2e18]">
                  Active (Show on website)
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-bold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            <BiCategory className="text-4xl mx-auto mb-2 text-stone-300" />
            No categories yet. Add your first category above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl shadow-md overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-video bg-stone-100 overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        // ✅ Fallback: broken icon dikhane ke bajaye category icon dikhao
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BiCategory className="text-5xl text-stone-300" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      category.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-[#8c0a15] text-white">
                    {category.productCount || 0} products
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#4a2e18] text-sm">{category.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">/{category.slug}</p>
                  {category.description && (
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => handleToggle(category._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                        category.isActive
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {category.isActive ? (
                        <><BiXCircle /> Deactivate</>
                      ) : (
                        <><BiCheckCircle /> Activate</>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold"
                    >
                      <BiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name, category.productCount)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold ml-auto transition ${
                        category.productCount > 0
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      title={category.productCount > 0 ? 'Cannot delete — products exist' : 'Delete'}
                    >
                      <BiTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && categories.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
            <p className="text-xs text-stone-500">
              Page <strong>{currentPage}</strong> of <strong>{pagination.totalPages}</strong>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
              >
                <BiChevronLeft /> Prev
              </button>
              <span className="text-xs font-bold text-[#8c0a15]">{currentPage}</span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
              >
                Next <BiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;