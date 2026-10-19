// import React, { useEffect, useState } from 'react';
// import {
//   BiPlus, BiEdit, BiTrash, BiX, BiUpload, BiLink,
//   BiCheckCircle, BiXCircle, BiImage,
// } from 'react-icons/bi';
// // import useBannerStore from '../../store/useBannerStore';
// // import apiClient from '../../config/apiClient';
// // import Topbar from '../../components/Topbar';
// import useBannerStore from '../store/useBannerStore';
// import apiClient from '../config/apiClient';
// import Topbar from './Topbar';

// const BannersPage = () => {
//   const {
//     banners,
//     loading,
//     pagination,
//     fetchBanners,
//     createBanner,
//     updateBanner,
//     toggleBannerStatus,
//     deleteBanner,
//   } = useBannerStore();

//   const [showForm, setShowForm] = useState(false);
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [imageMode, setImageMode] = useState('url');
//   const [positionFilter, setPositionFilter] = useState('');

//   const [formData, setFormData] = useState({
//     title: '',
//     subtitle: '',
//     image: '',
//     link: '',
//     buttonText: 'Shop Now',
//     position: 'hero',
//     displayOrder: 0,
//     isActive: true,
//   });

//   useEffect(() => {
//     fetchBanners({ position: positionFilter });
//   }, [positionFilter]);

//   // ✅ Reset form
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       subtitle: '',
//       image: '',
//       link: '',
//       buttonText: 'Shop Now',
//       position: 'hero',
//       displayOrder: 0,
//       isActive: true,
//     });
//     setEditingBanner(null);
//     setShowForm(false);
//     setImageMode('url');
//   };

//   // ✅ Edit
//   const handleEdit = (banner) => {
//     setEditingBanner(banner);
//     setFormData({
//       title: banner.title || '',
//       subtitle: banner.subtitle || '',
//       image: banner.image || '',
//       link: banner.link || '',
//       buttonText: banner.buttonText || 'Shop Now',
//       position: banner.position || 'hero',
//       displayOrder: banner.displayOrder || 0,
//       isActive: banner.isActive !== false,
//     });
//     setShowForm(true);
//   };

//   // ✅ File upload
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size should be less than 5MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData((prev) => ({ ...prev, image: reader.result }));
//     };
//     reader.readAsDataURL(file);

//     setUploading(true);
//     try {
//       const formDataObj = new FormData();
//       formDataObj.append('image', file);

//       const res = await apiClient.post('/admin/upload', formDataObj, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (res.data.success) {
//         setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
//         alert('Image uploaded! ✅');
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Upload failed');
//       setFormData((prev) => ({ ...prev, image: '' }));
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ✅ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.image) {
//       alert('Title and image are required');
//       return;
//     }

//     let result;
//     if (editingBanner) {
//       result = await updateBanner(editingBanner._id, formData);
//     } else {
//       result = await createBanner(formData);
//     }

//     if (result.success) {
//       alert(editingBanner ? 'Banner updated! ✅' : 'Banner created! ✅');
//       resetForm();
//     } else {
//       alert(result.error || 'Failed');
//     }
//   };

//   // ✅ Toggle
//   const handleToggle = async (id) => {
//     await toggleBannerStatus(id);
//   };

//   // ✅ Delete
//   const handleDelete = async (id, title) => {
//     if (!window.confirm(`Delete banner "${title}"?`)) return;
//     const result = await deleteBanner(id);
//     if (result.success) {
//       alert('Banner deleted ✅');
//     }
//   };

//   return (
//     <div>
//       <Topbar title="Banners Management" />

//       <div className="p-6">
//         {/* Header */}
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <select
//             value={positionFilter}
//             onChange={(e) => setPositionFilter(e.target.value)}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Positions</option>
//             <option value="hero">Hero</option>
//             <option value="middle">Middle</option>
//             <option value="bottom">Bottom</option>
//             <option value="sidebar">Sidebar</option>
//           </select>

//           <p className="text-sm text-stone-500 ml-auto">
//             Total: <strong className="text-[#8c0a15]">{pagination.totalBanners}</strong> banners
//           </p>

//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
//           >
//             <BiPlus /> Add Banner
//           </button>
//         </div>

//         {/* Form */}
//         {showForm && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
//                 {editingBanner ? 'Edit Banner' : 'Add New Banner'}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="text-stone-400 hover:text-stone-600"
//               >
//                 <BiX className="text-xl" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Title */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData({ ...formData, title: e.target.value })
//                   }
//                   required
//                   placeholder="e.g., Diwali Special Sale"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>

//               {/* Subtitle */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Subtitle
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subtitle}
//                   onChange={(e) =>
//                     setFormData({ ...formData, subtitle: e.target.value })
//                   }
//                   placeholder="e.g., Up to 50% off on all products"
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>

//               {/* Image */}
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
//                   Banner Image *
//                 </label>

//                 <div className="flex gap-2 mb-3">
//                   <button
//                     type="button"
//                     onClick={() => setImageMode('url')}
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
//                     onClick={() => setImageMode('upload')}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
//                       imageMode === 'upload'
//                         ? 'bg-[#8c0a15] text-white'
//                         : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                     }`}
//                   >
//                     <BiUpload /> Upload
//                   </button>
//                 </div>

//                 {imageMode === 'url' && (
//                   <input
//                     type="url"
//                     value={formData.image}
//                     onChange={(e) =>
//                       setFormData({ ...formData, image: e.target.value })
//                     }
//                     required
//                     placeholder="https://res.cloudinary.com/..."
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                   />
//                 )}

//                 {imageMode === 'upload' && (
//                   <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
//                     <input
//                       type="file"
//                       id="banner-upload"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                       disabled={uploading}
//                     />
//                     <label
//                       htmlFor="banner-upload"
//                       className="cursor-pointer flex flex-col items-center gap-2"
//                     >
//                       <BiUpload className="text-4xl text-stone-400" />
//                       <span className="text-sm font-bold text-[#4a2e18]">
//                         {uploading ? 'Uploading...' : 'Click to upload'}
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
//                       className="w-full max-w-md h-32 object-cover rounded-lg border border-stone-200"
//                       onError={(e) => (e.target.style.display = 'none')}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Link + Button */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                     Link URL
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.link}
//                     onChange={(e) =>
//                       setFormData({ ...formData, link: e.target.value })
//                     }
//                     placeholder="/products/yantra"
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                     Button Text
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.buttonText}
//                     onChange={(e) =>
//                       setFormData({ ...formData, buttonText: e.target.value })
//                     }
//                     placeholder="Shop Now"
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Position + Display Order */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                     Position
//                   </label>
//                   <select
//                     value={formData.position}
//                     onChange={(e) =>
//                       setFormData({ ...formData, position: e.target.value })
//                     }
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
//                   >
//                     <option value="hero">Hero (Top)</option>
//                     <option value="middle">Middle</option>
//                     <option value="bottom">Bottom</option>
//                     <option value="sidebar">Sidebar</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                     Display Order
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.displayOrder}
//                     onChange={(e) =>
//                       setFormData({ ...formData, displayOrder: Number(e.target.value) })
//                     }
//                     min="0"
//                     className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Active */}
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isActive}
//                   onChange={(e) =>
//                     setFormData({ ...formData, isActive: e.target.checked })
//                   }
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
//                   disabled={uploading}
//                   className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
//                 >
//                   {editingBanner ? 'Update Banner' : 'Create Banner'}
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

//         {/* Banners Grid */}
//         {loading ? (
//           <div className="p-6 text-center text-stone-500 bg-white rounded-xl">Loading banners...</div>
//         ) : banners.length === 0 ? (
//           <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
//             <BiImage className="text-4xl mx-auto mb-2 text-stone-300" />
//             No banners yet. Add your first banner above.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {banners.map((banner) => (
//               <div
//                 key={banner._id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden group"
//               >
//                 {/* Image */}
//                 <div className="relative aspect-video bg-stone-100 overflow-hidden">
//                   <img
//                     src={banner.image}
//                     alt={banner.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   {/* Status badge */}
//                   <span
//                     className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
//                       banner.isActive
//                         ? 'bg-green-500 text-white'
//                         : 'bg-red-500 text-white'
//                     }`}
//                   >
//                     {banner.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   {/* Position badge */}
//                   <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-[#8c0a15] text-white uppercase">
//                     {banner.position}
//                   </span>
//                 </div>

//                 {/* Info */}
//                 <div className="p-4">
//                   <h3 className="font-bold text-[#4a2e18] text-sm line-clamp-1">
//                     {banner.title}
//                   </h3>
//                   {banner.subtitle && (
//                     <p className="text-xs text-stone-500 line-clamp-1 mt-1">
//                       {banner.subtitle}
//                     </p>
//                   )}
//                   {banner.link && (
//                     <p className="text-xs text-blue-600 mt-1 truncate">
//                       🔗 {banner.link}
//                     </p>
//                   )}
//                   <p className="text-xs text-stone-400 mt-1">
//                     Order: {banner.displayOrder || 0}
//                   </p>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
//                     <button
//                       onClick={() => handleToggle(banner._id)}
//                       className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
//                         banner.isActive
//                           ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                           : 'bg-green-100 text-green-700 hover:bg-green-200'
//                       }`}
//                     >
//                       {banner.isActive ? (
//                         <><BiXCircle /> Deactivate</>
//                       ) : (
//                         <><BiCheckCircle /> Activate</>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => handleEdit(banner)}
//                       className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold"
//                     >
//                       <BiEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(banner._id, banner.title)}
//                       className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-xs font-bold ml-auto"
//                     >
//                       <BiTrash />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BannersPage;


import React, { useEffect, useState } from 'react';
import {
  BiPlus, BiEdit, BiTrash, BiX, BiUpload, BiLink,
  BiCheckCircle, BiXCircle, BiImage,
} from 'react-icons/bi';
import useBannerStore from '../store/useBannerStore';
import apiClient from '../config/apiClient';
import Topbar from './Topbar';

const BannersPage = () => {
  const {
    banners,
    loading,
    pagination,
    fetchBanners,
    createBanner,
    updateBanner,
    toggleBannerStatus,
    deleteBanner,
  } = useBannerStore();

  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState('url');
  const [positionFilter, setPositionFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: 'Shop Now',
    position: 'hero',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchBanners({ position: positionFilter });
  }, [positionFilter]);

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      buttonText: 'Shop Now',
      position: 'hero',
      displayOrder: 0,
      isActive: true,
    });
    setEditingBanner(null);
    setShowForm(false);
    setImageMode('url');
  };

  // ✅ Edit
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      link: banner.link || '',
      buttonText: banner.buttonText || 'Shop Now',
      position: banner.position || 'hero',
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive !== false,
    });
    setShowForm(true);

    // ✅ Agar already URL hai toh URL mode
    if (banner.image && banner.image.startsWith('http')) {
      setImageMode('url');
    }
  };

  // ✅ File upload (Sirf Cloudinary URL set hoga, base64 nahi)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const res = await apiClient.post('/admin/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('🔍 Upload response:', res.data);

      if (res.data.success) {
        // ✅ Sirf Cloudinary URL set karo
        setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
        alert('Image uploaded successfully! ✅');
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      alert(err.response?.data?.message || 'Upload failed');
      setFormData((prev) => ({ ...prev, image: '' }));
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.image) {
      alert('Title and image are required');
      return;
    }

    // ✅ Base64 check — agar upload complete nahi hua toh rok do
    if (formData.image.startsWith('data:image')) {
      alert(
        '⚠️ Image upload abhi complete nahi hua. Kripya wait karein ya "Image URL" tab se URL daalein.'
      );
      return;
    }

    let result;
    if (editingBanner) {
      result = await updateBanner(editingBanner._id, formData);
    } else {
      result = await createBanner(formData);
    }

    if (result.success) {
      alert(editingBanner ? 'Banner updated! ✅' : 'Banner created! ✅');
      resetForm();
    } else {
      alert(result.error || 'Failed');
    }
  };

  // ✅ Toggle
  const handleToggle = async (id) => {
    await toggleBannerStatus(id);
  };

  // ✅ Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    const result = await deleteBanner(id);
    if (result.success) {
      alert('Banner deleted ✅');
    }
  };

  return (
    <div>
      <Topbar title="Banners Management" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Positions</option>
            <option value="hero">Hero</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
            <option value="sidebar">Sidebar</option>
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total:{' '}
            <strong className="text-[#8c0a15]">
              {pagination.totalBanners || banners.length}
            </strong>{' '}
            banners
          </p>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
          >
            <BiPlus /> Add Banner
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button
                onClick={resetForm}
                className="text-stone-400 hover:text-stone-600"
              >
                <BiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Diwali Special Sale"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="e.g., Up to 50% off on all products"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                  Banner Image *
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
                    onClick={() => {
                      setImageMode('upload');
                      setFormData((prev) => ({ ...prev, image: '' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                      imageMode === 'upload'
                        ? 'bg-[#8c0a15] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <BiUpload /> Upload
                  </button>
                </div>

                {imageMode === 'url' && (
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    required
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                  />
                )}

                {imageMode === 'upload' && (
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#8c0a15] transition">
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <BiUpload className="text-4xl text-stone-400" />
                      <span className="text-sm font-bold text-[#4a2e18]">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <span className="text-xs text-stone-500">
                        Max 5MB • JPG, PNG, WEBP
                      </span>
                    </label>
                  </div>
                )}

                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg border border-stone-200"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              {/* Link + Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="/products/yantra"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                    placeholder="Shop Now"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                  />
                </div>
              </div>

              {/* Position + Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
                  >
                    <option value="hero">Hero (Top)</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                  />
                </div>
              </div>

              {/* Active */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
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
                  disabled={uploading}
                  className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
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

        {/* Banners Grid */}
        {loading ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            <BiImage className="text-4xl mx-auto mb-2 text-stone-300" />
            No banners yet. Add your first banner above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-xl shadow-md overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-video bg-stone-100 overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Status badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      banner.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {/* Position badge */}
                  <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-[#8c0a15] text-white uppercase">
                    {banner.position}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#4a2e18] text-sm line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <p className="text-xs text-blue-600 mt-1 truncate">
                      🔗 {banner.link}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 mt-1">
                    Order: {banner.displayOrder || 0}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => handleToggle(banner._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                        banner.isActive
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <BiXCircle /> Deactivate
                        </>
                      ) : (
                        <>
                          <BiCheckCircle /> Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold"
                    >
                      <BiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id, banner.title)}
                      className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-xs font-bold ml-auto"
                    >
                      <BiTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannersPage;