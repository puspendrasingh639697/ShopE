// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   BiSave, BiPlus, BiTrash, BiStore, BiPhone, BiPackage,
//   BiWallet, BiShare, BiTag, BiX,
// } from 'react-icons/bi';
// import API_BASE_URL from '../../config/api';
// import Topbar from '../../components/Topbar';

// const SettingsPage = () => {
//   const [settings, setSettings] = useState({
//     siteName: '',
//     siteTagline: '',
//     siteLogo: '',
//     contactEmail: '',
//     contactPhone: '',
//     contactAddress: '',
//     standardShippingCharge: 99,
//     expressShippingCharge: 199,
//     freeShippingThreshold: 999,
//     codEnabled: true,
//     razorpayEnabled: true,
//     razorpayKeyId: '',
//     facebookUrl: '',
//     instagramUrl: '',
//     whatsappNumber: '',
//   });

//   const [coupons, setCoupons] = useState([]);
//   const [newCoupon, setNewCoupon] = useState({
//     code: '',
//     discountType: 'percentage',
//     discountValue: '',
//     minOrderAmount: '',
//     expiresAt: '',
//   });
//   const [showCouponForm, setShowCouponForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState('general');
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   const fetchSettings = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/settings`);
//       setSettings(res.data.settings);
//       setCoupons(res.data.settings.coupons || []);
//     } catch (err) {
//       console.error('Fetch settings error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings({
//       ...settings,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError('');
//     try {
//       await axios.put(`${API_BASE_URL}/settings`, settings, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Settings saved successfully! ✅');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleAddCoupon = async () => {
//     if (!newCoupon.code || !newCoupon.discountValue) {
//       alert('Code and discount value are required');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/settings/coupons`,
//         newCoupon,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCoupons(res.data.coupons);
//       setNewCoupon({
//         code: '',
//         discountType: 'percentage',
//         discountValue: '',
//         minOrderAmount: '',
//         expiresAt: '',
//       });
//       setShowCouponForm(false);
//       alert('Coupon added! ✅');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add coupon');
//     }
//   };

//   const handleDeleteCoupon = async (code) => {
//     if (!window.confirm(`Delete coupon "${code}"?`)) return;
//     try {
//       const res = await axios.delete(
//         `${API_BASE_URL}/settings/coupons/${code}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCoupons(res.data.coupons);
//       alert('Coupon deleted ✅');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete');
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <Topbar title="Settings" />
//         <div className="p-6 text-center text-stone-500">Loading settings...</div>
//       </div>
//     );
//   }

//   // ✅ TABS — BiTruck hata diya, BiPackage use kiya
//   const tabs = [
//     { id: 'general', label: 'General', icon: <BiStore /> },
//     { id: 'contact', label: 'Contact', icon: <BiPhone /> },
//     { id: 'shipping', label: 'Shipping', icon: <BiPackage /> },   // ✅
//     { id: 'payment', label: 'Payment', icon: <BiWallet /> },
//     { id: 'social', label: 'Social', icon: <BiShare /> },
//     { id: 'coupons', label: 'Coupons', icon: <BiTag /> },
//   ];

//   return (
//     <div>
//       <Topbar title="Settings" />

//       <div className="p-6">
//         <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
//           <div className="flex flex-wrap border-b border-stone-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition ${
//                   activeTab === tab.id
//                     ? 'bg-[#8c0a15] text-white'
//                     : 'text-stone-600 hover:bg-stone-50'
//                 }`}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
//             {error}
//           </div>
//         )}

//         {activeTab === 'general' && (
//           <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
//               General Settings
//             </h2>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Site Name
//               </label>
//               <input
//                 type="text"
//                 name="siteName"
//                 value={settings.siteName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Tagline
//               </label>
//               <input
//                 type="text"
//                 name="siteTagline"
//                 value={settings.siteTagline}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Logo URL
//               </label>
//               <input
//                 type="url"
//                 name="siteLogo"
//                 value={settings.siteLogo}
//                 onChange={handleChange}
//                 placeholder="https://res.cloudinary.com/..."
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//               {settings.siteLogo && (
//                 <img
//                   src={settings.siteLogo}
//                   alt="Logo"
//                   className="w-20 h-20 object-contain mt-2 rounded border border-stone-200"
//                 />
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === 'contact' && (
//           <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
//               Contact Information
//             </h2>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Contact Email
//               </label>
//               <input
//                 type="email"
//                 name="contactEmail"
//                 value={settings.contactEmail}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Contact Phone
//               </label>
//               <input
//                 type="text"
//                 name="contactPhone"
//                 value={settings.contactPhone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Address
//               </label>
//               <textarea
//                 name="contactAddress"
//                 value={settings.contactAddress}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               ></textarea>
//             </div>
//           </div>
//         )}

//         {activeTab === 'shipping' && (
//           <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
//               Shipping Settings
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Standard Shipping (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="standardShippingCharge"
//                   value={settings.standardShippingCharge}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Express Shipping (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="expressShippingCharge"
//                   value={settings.expressShippingCharge}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Free Shipping Above (₹)
//               </label>
//               <input
//                 type="number"
//                 name="freeShippingThreshold"
//                 value={settings.freeShippingThreshold}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//               <p className="text-xs text-stone-500 mt-1">
//                 Orders above this amount get free shipping
//               </p>
//             </div>
//           </div>
//         )}

//         {activeTab === 'payment' && (
//           <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
//               Payment Settings
//             </h2>

//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="codEnabled"
//                 checked={settings.codEnabled}
//                 onChange={handleChange}
//                 className="w-5 h-5"
//               />
//               <span className="text-sm font-bold text-[#4a2e18]">
//                 Enable Cash on Delivery (COD)
//               </span>
//             </label>

//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="razorpayEnabled"
//                 checked={settings.razorpayEnabled}
//                 onChange={handleChange}
//                 className="w-5 h-5"
//               />
//               <span className="text-sm font-bold text-[#4a2e18]">
//                 Enable Razorpay (Online Payment)
//               </span>
//             </label>

//             {settings.razorpayEnabled && (
//               <div>
//                 <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                   Razorpay Key ID
//                 </label>
//                 <input
//                   type="text"
//                   name="razorpayKeyId"
//                   value={settings.razorpayKeyId}
//                   onChange={handleChange}
//                   placeholder="rzp_live_..."
//                   className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'social' && (
//           <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
//               Social Links
//             </h2>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Facebook URL
//               </label>
//               <input
//                 type="url"
//                 name="facebookUrl"
//                 value={settings.facebookUrl}
//                 onChange={handleChange}
//                 placeholder="https://facebook.com/yourpage"
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 Instagram URL
//               </label>
//               <input
//                 type="url"
//                 name="instagramUrl"
//                 value={settings.instagramUrl}
//                 onChange={handleChange}
//                 placeholder="https://instagram.com/yourpage"
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                 WhatsApp Number
//               </label>
//               <input
//                 type="text"
//                 name="whatsappNumber"
//                 value={settings.whatsappNumber}
//                 onChange={handleChange}
//                 placeholder="9876543210"
//                 className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
//               />
//             </div>
//           </div>
//         )}

//         {activeTab === 'coupons' && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
//                 Coupons ({coupons.length})
//               </h2>
//               <button
//                 onClick={() => setShowCouponForm(!showCouponForm)}
//                 className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold transition"
//               >
//                 {showCouponForm ? <><BiX /> Cancel</> : <><BiPlus /> Add Coupon</>}
//               </button>
//             </div>

//             {showCouponForm && (
//               <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6 space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                       Coupon Code *
//                     </label>
//                     <input
//                       type="text"
//                       value={newCoupon.code}
//                       onChange={(e) =>
//                         setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
//                       }
//                       placeholder="DIVINE10"
//                       className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm uppercase"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                       Discount Type
//                     </label>
//                     <select
//                       value={newCoupon.discountType}
//                       onChange={(e) =>
//                         setNewCoupon({ ...newCoupon, discountType: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//                     >
//                       <option value="percentage">Percentage (%)</option>
//                       <option value="fixed">Fixed (₹)</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                       Discount Value *
//                     </label>
//                     <input
//                       type="number"
//                       value={newCoupon.discountValue}
//                       onChange={(e) =>
//                         setNewCoupon({ ...newCoupon, discountValue: e.target.value })
//                       }
//                       placeholder="10"
//                       className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                       Min Order Amount (₹)
//                     </label>
//                     <input
//                       type="number"
//                       value={newCoupon.minOrderAmount}
//                       onChange={(e) =>
//                         setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })
//                       }
//                       placeholder="500"
//                       className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
//                     Expires At (optional)
//                   </label>
//                   <input
//                     type="date"
//                     value={newCoupon.expiresAt}
//                     onChange={(e) =>
//                       setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
//                   />
//                 </div>
//                 <button
//                   onClick={handleAddCoupon}
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition"
//                 >
//                   Save Coupon
//                 </button>
//               </div>
//             )}

//             {coupons.length === 0 ? (
//               <div className="text-center py-10 text-stone-500 text-sm">
//                 No coupons yet. Add your first coupon above.
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {coupons.map((coupon) => (
//                   <div
//                     key={coupon.code}
//                     className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50"
//                   >
//                     <div>
//                       <p className="font-mono font-bold text-[#8c0a15] text-lg">
//                         {coupon.code}
//                       </p>
//                       <p className="text-xs text-stone-600">
//                         {coupon.discountType === 'percentage'
//                           ? `${coupon.discountValue}% OFF`
//                           : `₹${coupon.discountValue} OFF`}
//                         {coupon.minOrderAmount > 0 && ` • Min order ₹${coupon.minOrderAmount}`}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteCoupon(coupon.code)}
//                       className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
//                     >
//                       <BiTrash />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab !== 'coupons' && (
//           <div className="flex justify-end mt-6">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
//             >
//               <BiSave />
//               {saving ? 'Saving...' : 'Save Settings'}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;


import React, { useEffect, useState } from 'react';
import apiClient from '../../config/apiClient';
import {
  BiSave, BiPlus, BiTrash, BiStore, BiPhone, BiPackage,
  BiWallet, BiShare, BiTag, BiX,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteTagline: '',
    siteLogo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    standardShippingCharge: 99,
    expressShippingCharge: 199,
    freeShippingThreshold: 999,
    codEnabled: true,
    razorpayEnabled: true,
    razorpayKeyId: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappNumber: '',
  });

  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiresAt: '',
  });
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      setSettings(res.data.settings);
      setCoupons(res.data.settings.coupons || []);
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.put('/settings', settings);
      alert('Settings saved successfully! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };
const handleAddCoupon = async () => {
  if (!newCoupon.code || !newCoupon.discountValue) {
    alert('Code and discount value are required');
    return;
  }

  // ✅ Coupon data prepare karein
  const couponData = {
    code: newCoupon.code,
    discountType: newCoupon.discountType,
    discountValue: Number(newCoupon.discountValue),
    minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
    // ✅ expiresAt valid date ho toh hi bhejein
    expiresAt: newCoupon.expiresAt ? newCoupon.expiresAt : null,
  };

  try {
    const res = await apiClient.post('/settings/coupons', couponData);
    setCoupons(res.data.coupons);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      expiresAt: '',
    });
    setShowCouponForm(false);
    alert('Coupon added! ✅');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add coupon');
  }
};

  const handleDeleteCoupon = async (code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await apiClient.delete(`/settings/coupons/${code}`);
      setCoupons(res.data.coupons);
      alert('Coupon deleted ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div>
        <Topbar title="Settings" />
        <div className="p-6 text-center text-stone-500">Loading settings...</div>
      </div>
    );
  }

  // ✅ TABS
  const tabs = [
    { id: 'general', label: 'General', icon: <BiStore /> },
    { id: 'contact', label: 'Contact', icon: <BiPhone /> },
    { id: 'shipping', label: 'Shipping', icon: <BiPackage /> },
    { id: 'payment', label: 'Payment', icon: <BiWallet /> },
    { id: 'social', label: 'Social', icon: <BiShare /> },
    { id: 'coupons', label: 'Coupons', icon: <BiTag /> },
  ];

  return (
    <div>
      <Topbar title="Settings" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-stone-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-[#8c0a15] text-white'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              General Settings
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Tagline
              </label>
              <input
                type="text"
                name="siteTagline"
                value={settings.siteTagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                name="siteLogo"
                value={settings.siteLogo}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/..."
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
              {settings.siteLogo && (
                <img
                  src={settings.siteLogo}
                  alt="Logo"
                  className="w-20 h-20 object-contain mt-2 rounded border border-stone-200"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Contact Information
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Address
              </label>
              <textarea
                name="contactAddress"
                value={settings.contactAddress}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              ></textarea>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Shipping Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Standard Shipping (₹)
                </label>
                <input
                  type="number"
                  name="standardShippingCharge"
                  value={settings.standardShippingCharge}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Express Shipping (₹)
                </label>
                <input
                  type="number"
                  name="expressShippingCharge"
                  value={settings.expressShippingCharge}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Free Shipping Above (₹)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
              <p className="text-xs text-stone-500 mt-1">
                Orders above this amount get free shipping
              </p>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Payment Settings
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="codEnabled"
                checked={settings.codEnabled}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm font-bold text-[#4a2e18]">
                Enable Cash on Delivery (COD)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="razorpayEnabled"
                checked={settings.razorpayEnabled}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm font-bold text-[#4a2e18]">
                Enable Razorpay (Online Payment)
              </span>
            </label>

            {settings.razorpayEnabled && (
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  name="razorpayKeyId"
                  value={settings.razorpayKeyId}
                  onChange={handleChange}
                  placeholder="rzp_live_..."
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Social Links
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
                Coupons ({coupons.length})
              </h2>
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-4 py-2 rounded-lg text-sm font-bold transition"
              >
                {showCouponForm ? <><BiX /> Cancel</> : <><BiPlus /> Add Coupon</>}
              </button>
            </div>

            {showCouponForm && (
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                      }
                      placeholder="DIVINE10"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountType: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      value={newCoupon.discountValue}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountValue: e.target.value })
                      }
                      placeholder="10"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                      Min Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })
                      }
                      placeholder="500"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Expires At (optional)
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiresAt}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={handleAddCoupon}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition"
                >
                  Save Coupon
                </button>
              </div>
            )}

            {coupons.length === 0 ? (
              <div className="text-center py-10 text-stone-500 text-sm">
                No coupons yet. Add your first coupon above.
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50"
                  >
                    <div>
                      <p className="font-mono font-bold text-[#8c0a15] text-lg">
                        {coupon.code}
                      </p>
                      <p className="text-xs text-stone-600">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                        {coupon.minOrderAmount > 0 && ` • Min order ₹${coupon.minOrderAmount}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      <BiTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'coupons' && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              <BiSave />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;