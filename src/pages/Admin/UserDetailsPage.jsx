// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   BiArrowBack, BiUser, BiEnvelope, BiPhone, BiShoppingBag,
//   BiWallet, BiHeart, BiMap, BiBlock, BiCheckCircle, BiTrash,
//   BiCrown, BiCalendar,
// } from 'react-icons/bi';
// import API_BASE_URL from '../../config/api';
// import Topbar from '../../components/Topbar';

// const UserDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const token = localStorage.getItem('token');

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/admin/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error('Fetch user error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   // ✅ Block/Unblock
//   const handleToggleBlock = async () => {
//     if (!window.confirm('Toggle block status for this user?')) return;
//     setActionLoading(true);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/users/${id}/block`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('User status updated ✅');
//       fetchUser();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to update');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ✅ Make Admin
//   const handleMakeAdmin = async () => {
//     if (!window.confirm('Promote this user to Admin?')) return;
//     setActionLoading(true);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/make-admin/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('User promoted to Admin ✅');
//       fetchUser();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to promote');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ✅ Remove Admin
//   const handleRemoveAdmin = async () => {
//     if (!window.confirm('Remove Admin role from this user?')) return;
//     setActionLoading(true);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/remove-admin/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Admin role removed ✅');
//       fetchUser();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to remove');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ✅ Delete User
//   const handleDelete = async () => {
//     if (!window.confirm('Delete this user permanently? This cannot be undone!')) return;
//     setActionLoading(true);
//     try {
//       await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('User deleted ✅');
//       navigate('/admin/users');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete');
//       setActionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <Topbar title="User Details" />
//         <div className="p-6 text-center text-stone-500">Loading user...</div>
//       </div>
//     );
//   }

//   if (!data || !data.user) {
//     return (
//       <div>
//         <Topbar title="User Details" />
//         <div className="p-6 text-center text-stone-500">User not found.</div>
//       </div>
//     );
//   }

//   const { user, orders, stats } = data;

//   const statusColors = {
//     Processing: 'bg-amber-100 text-amber-800',
//     Shipped: 'bg-blue-100 text-blue-800',
//     Delivered: 'bg-green-100 text-green-800',
//     Cancelled: 'bg-red-100 text-red-800',
//   };

//   return (
//     <div>
//       <Topbar title={`User: ${user.name}`} />

//       <div className="p-6 space-y-6">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/admin/users')}
//           className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15]"
//         >
//           <BiArrowBack /> Back to Users
//         </button>

//         {/* Profile Header */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <div className="flex flex-wrap items-center gap-6">
//             <div className="w-20 h-20 rounded-full bg-[#8c0a15] text-white flex items-center justify-center text-3xl font-bold">
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl font-serif font-bold text-[#4a2e18]">
//                 {user.name}
//               </h1>
//               <p className="text-sm text-stone-600 mt-1 flex items-center gap-2">
//                 <BiEnvelope /> {user.email}
//               </p>
//               <p className="text-sm text-stone-600 flex items-center gap-2">
//                 <BiPhone /> {user.phone || 'N/A'}
//               </p>
//               <div className="flex items-center gap-2 mt-2">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-bold uppercase ${
//                     user.role === 'super_admin'
//                       ? 'bg-amber-100 text-amber-800'
//                       : user.role === 'admin'
//                       ? 'bg-blue-100 text-blue-800'
//                       : user.role === 'blog_admin'
//                       ? 'bg-pink-100 text-pink-800'
//                       : 'bg-stone-100 text-stone-700'
//                   }`}
//                 >
//                   {user.role}
//                 </span>
//                 <span
//                   className={`flex items-center gap-1 text-xs font-bold ${
//                     user.isActive !== false ? 'text-green-600' : 'text-red-600'
//                   }`}
//                 >
//                   {user.isActive !== false ? (
//                     <><BiCheckCircle /> Active</>
//                   ) : (
//                     <><BiBlock /> Blocked</>
//                   )}
//                 </span>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-stone-500 flex items-center gap-1 justify-end">
//                 <BiCalendar /> Joined
//               </p>
//               <p className="font-bold text-[#4a2e18]">
//                 {new Date(user.createdAt).toLocaleDateString('en-IN')}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs uppercase text-stone-500 font-bold">Orders</p>
//                 <p className="text-2xl font-bold text-[#4a2e18]">{stats.totalOrders}</p>
//               </div>
//               <BiShoppingBag className="text-3xl text-blue-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs uppercase text-stone-500 font-bold">Total Spent</p>
//                 <p className="text-2xl font-bold text-[#8c0a15]">
//                   ₹{stats.totalSpent.toLocaleString('en-IN')}
//                 </p>
//               </div>
//               <BiWallet className="text-3xl text-green-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs uppercase text-stone-500 font-bold">Wishlist</p>
//                 <p className="text-2xl font-bold text-[#4a2e18]">{stats.wishlistCount}</p>
//               </div>
//               <BiHeart className="text-3xl text-red-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs uppercase text-stone-500 font-bold">Addresses</p>
//                 <p className="text-2xl font-bold text-[#4a2e18]">{stats.addressCount}</p>
//               </div>
//               <BiMap className="text-3xl text-amber-500" />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3">
//           <button
//             onClick={handleToggleBlock}
//             disabled={actionLoading}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 ${
//               user.isActive !== false
//                 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//             }`}
//           >
//             {user.isActive !== false ? <><BiBlock /> Block User</> : <><BiCheckCircle /> Unblock User</>}
//           </button>

//           {user.role === 'admin' ? (
//             <button
//               onClick={handleRemoveAdmin}
//               disabled={actionLoading}
//               className="flex items-center gap-2 bg-stone-100 text-stone-700 hover:bg-stone-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
//             >
//               <BiCrown /> Remove Admin
//             </button>
//           ) : user.role === 'user' ? (
//             <button
//               onClick={handleMakeAdmin}
//               disabled={actionLoading}
//               className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
//             >
//               <BiCrown /> Make Admin
//             </button>
//           ) : null}

//           <button
//             onClick={handleDelete}
//             disabled={actionLoading}
//             className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 ml-auto"
//           >
//             <BiTrash /> Delete User
//           </button>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
//             <BiShoppingBag /> Recent Orders ({orders.length})
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-stone-500 text-sm">No orders yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
//                   <tr>
//                     <th className="px-4 py-2 text-left">Order ID</th>
//                     <th className="px-4 py-2 text-left">Total</th>
//                     <th className="px-4 py-2 text-left">Status</th>
//                     <th className="px-4 py-2 text-left">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((ord) => (
//                     <tr
//                       key={ord._id}
//                       onClick={() => navigate(`/admin/orders/${ord._id}`)}
//                       className="border-b hover:bg-stone-50 cursor-pointer"
//                     >
//                       <td className="px-4 py-2 font-mono text-xs text-[#8c0a15]">
//                         #{ord._id?.slice(-8)}
//                       </td>
//                       <td className="px-4 py-2 font-bold text-[#8c0a15]">
//                         ₹{ord.totalPrice?.toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-4 py-2">
//                         <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[ord.status] || 'bg-stone-100 text-stone-700'}`}>
//                           {ord.status || 'Processing'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 text-xs text-stone-500">
//                         {new Date(ord.createdAt).toLocaleDateString('en-IN')}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Addresses */}
//         {user.addresses && user.addresses.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
//               <BiMap /> Addresses ({user.addresses.length})
//             </h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {user.addresses.map((addr, idx) => (
//                 <div key={idx} className="border border-stone-200 rounded-lg p-4">
//                   {addr.isDefault && (
//                     <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
//                       Default
//                     </span>
//                   )}
//                   <p className="text-sm text-stone-700 mt-2">{addr.street}</p>
//                   <p className="text-sm text-stone-700">
//                     {addr.city}, {addr.state} - {addr.zipCode}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {user.wishlist && user.wishlist.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
//               <BiHeart /> Wishlist ({user.wishlist.length})
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {user.wishlist.slice(0, 8).map((item, idx) => (
//                 <div key={idx} className="border border-stone-200 rounded-lg p-2">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-24 object-cover rounded"
//                   />
//                   <p className="text-xs font-bold mt-2 line-clamp-2">{item.name}</p>
//                   <p className="text-xs text-[#8c0a15] font-bold">₹{item.price}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDetailsPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiArrowBack, BiUser, BiEnvelope, BiPhone, BiShoppingBag,
  BiWallet, BiHeart, BiMap, BiBlock, BiCheckCircle, BiTrash,
  BiCrown, BiCalendar,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await apiClient.get(`/admin/users/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // ✅ Block/Unblock
  const handleToggleBlock = async () => {
    if (!window.confirm('Toggle block status for this user?')) return;
    setActionLoading(true);
    try {
      await apiClient.put(`/admin/users/${id}/block`);
      alert('User status updated ✅');
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Make Admin
  const handleMakeAdmin = async () => {
    if (!window.confirm('Promote this user to Admin?')) return;
    setActionLoading(true);
    try {
      await apiClient.put(`/admin/make-admin/${id}`);
      alert('User promoted to Admin ✅');
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Remove Admin
  const handleRemoveAdmin = async () => {
    if (!window.confirm('Remove Admin role from this user?')) return;
    setActionLoading(true);
    try {
      await apiClient.put(`/admin/remove-admin/${id}`);
      alert('Admin role removed ✅');
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Delete User
  const handleDelete = async () => {
    if (!window.confirm('Delete this user permanently? This cannot be undone!')) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/admin/users/${id}`);
      alert('User deleted ✅');
      navigate('/admin/users');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Topbar title="User Details" />
        <div className="p-6 text-center text-stone-500">Loading user...</div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div>
        <Topbar title="User Details" />
        <div className="p-6 text-center text-stone-500">User not found.</div>
      </div>
    );
  }

  const { user, orders, stats } = data;

  const statusColors = {
    Processing: 'bg-amber-100 text-amber-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <Topbar title={`User: ${user.name}`} />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15]"
        >
          <BiArrowBack /> Back to Users
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#8c0a15] text-white flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-serif font-bold text-[#4a2e18]">
                {user.name}
              </h1>
              <p className="text-sm text-stone-600 mt-1 flex items-center gap-2">
                <BiEnvelope /> {user.email}
              </p>
              <p className="text-sm text-stone-600 flex items-center gap-2">
                <BiPhone /> {user.phone || 'N/A'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    user.role === 'super_admin'
                      ? 'bg-amber-100 text-amber-800'
                      : user.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : user.role === 'blog_admin'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-bold ${
                    user.isActive !== false ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user.isActive !== false ? (
                    <><BiCheckCircle /> Active</>
                  ) : (
                    <><BiBlock /> Blocked</>
                  )}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 flex items-center gap-1 justify-end">
                <BiCalendar /> Joined
              </p>
              <p className="font-bold text-[#4a2e18]">
                {new Date(user.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-stone-500 font-bold">Orders</p>
                <p className="text-2xl font-bold text-[#4a2e18]">{stats.totalOrders}</p>
              </div>
              <BiShoppingBag className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-stone-500 font-bold">Total Spent</p>
                <p className="text-2xl font-bold text-[#8c0a15]">
                  ₹{stats.totalSpent.toLocaleString('en-IN')}
                </p>
              </div>
              <BiWallet className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-stone-500 font-bold">Wishlist</p>
                <p className="text-2xl font-bold text-[#4a2e18]">{stats.wishlistCount}</p>
              </div>
              <BiHeart className="text-3xl text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-stone-500 font-bold">Addresses</p>
                <p className="text-2xl font-bold text-[#4a2e18]">{stats.addressCount}</p>
              </div>
              <BiMap className="text-3xl text-amber-500" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3">
          <button
            onClick={handleToggleBlock}
            disabled={actionLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 ${
              user.isActive !== false
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {user.isActive !== false ? <><BiBlock /> Block User</> : <><BiCheckCircle /> Unblock User</>}
          </button>

          {user.role === 'admin' ? (
            <button
              onClick={handleRemoveAdmin}
              disabled={actionLoading}
              className="flex items-center gap-2 bg-stone-100 text-stone-700 hover:bg-stone-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
            >
              <BiCrown /> Remove Admin
            </button>
          ) : user.role === 'user' ? (
            <button
              onClick={handleMakeAdmin}
              disabled={actionLoading}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
            >
              <BiCrown /> Make Admin
            </button>
          ) : null}

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 ml-auto"
          >
            <BiTrash /> Delete User
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
            <BiShoppingBag /> Recent Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-stone-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr
                      key={ord._id}
                      onClick={() => navigate(`/admin/orders/${ord._id}`)}
                      className="border-b hover:bg-stone-50 cursor-pointer"
                    >
                      <td className="px-4 py-2 font-mono text-xs text-[#8c0a15]">
                        #{ord._id?.slice(-8)}
                      </td>
                      <td className="px-4 py-2 font-bold text-[#8c0a15]">
                        ₹{ord.totalPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[ord.status] || 'bg-stone-100 text-stone-700'}`}>
                          {ord.status || 'Processing'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-stone-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Addresses */}
        {user.addresses && user.addresses.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
              <BiMap /> Addresses ({user.addresses.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {user.addresses.map((addr, idx) => (
                <div key={idx} className="border border-stone-200 rounded-lg p-4">
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                      Default
                    </span>
                  )}
                  <p className="text-sm text-stone-700 mt-2">{addr.street}</p>
                  <p className="text-sm text-stone-700">
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist */}
        {user.wishlist && user.wishlist.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
              <BiHeart /> Wishlist ({user.wishlist.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {user.wishlist.slice(0, 8).map((item, idx) => (
                <div key={idx} className="border border-stone-200 rounded-lg p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs font-bold mt-2 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-[#8c0a15] font-bold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;