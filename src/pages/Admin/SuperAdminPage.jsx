// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BiCrown, BiUserCheck, BiUserX, BiSearch } from 'react-icons/bi';
// import API_BASE_URL from '../../config/api';
// import Topbar from '../../components/Topbar';

// const SuperAdminPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [actionLoading, setActionLoading] = useState(null);
//   const token = localStorage.getItem('token');

//   // ✅ Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/admin/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.error('Fetch users error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // ✅ Make Admin
//   const handleMakeAdmin = async (userId) => {
//     if (!window.confirm('Make this user an Admin?')) return;
//     setActionLoading(userId);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/make-admin/${userId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('User promoted to Admin ✅');
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to promote');
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ✅ Remove Admin
//   const handleRemoveAdmin = async (userId) => {
//     if (!window.confirm('Remove Admin role from this user?')) return;
//     setActionLoading(userId);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/remove-admin/${userId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Admin role removed ✅');
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to remove');
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Filter out super_admin (khud ko nahi hatana)
//   const filteredUsers = users.filter(
//     (u) =>
//       u.role !== 'super_admin' &&
//       (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div>
//       <Topbar title="Super Admin Panel" />

//       <div className="p-6">
//         {/* Header Badge */}
//         <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
//           <BiCrown className="text-3xl text-amber-600" />
//           <div>
//             <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
//               Super Admin Privileges
//             </h2>
//             <p className="text-xs text-stone-600">
//               Promote users to Admin or remove Admin role
//             </p>
//           </div>
//         </div>

//         {/* Search + Count */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="relative">
//             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-80 focus:outline-none focus:border-[#8c0a15]"
//             />
//           </div>
//           <p className="text-sm text-stone-500">
//             Total: <strong className="text-[#8c0a15]">{filteredUsers.length}</strong> users
//           </p>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {loading ? (
//             <div className="p-6 text-center text-stone-500">Loading users...</div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="p-6 text-center text-stone-500">No users found.</div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Name</th>
//                   <th className="px-4 py-3 text-left">Email</th>
//                   <th className="px-4 py-3 text-left">Current Role</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user._id} className="border-b hover:bg-stone-50">
//                     <td className="px-4 py-3 font-medium text-[#4a2e18]">
//                       {user.name}
//                     </td>
//                     <td className="px-4 py-3 text-stone-600">{user.email}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded text-xs font-bold uppercase ${
//                           user.role === 'admin'
//                             ? 'bg-blue-100 text-blue-800'
//                             : user.role === 'blog_admin'
//                             ? 'bg-pink-100 text-pink-800'
//                             : 'bg-stone-100 text-stone-700'
//                         }`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-end gap-2">
//                         {user.role === 'admin' ? (
//                           <button
//                             onClick={() => handleRemoveAdmin(user._id)}
//                             disabled={actionLoading === user._id}
//                             className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-xs font-bold transition disabled:opacity-50"
//                           >
//                             <BiUserX /> Remove Admin
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => handleMakeAdmin(user._id)}
//                             disabled={actionLoading === user._id}
//                             className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold transition disabled:opacity-50"
//                           >
//                             <BiUserCheck /> Make Admin
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminPage;


import React, { useEffect, useState } from 'react';
import apiClient from '../../config/apiClient';
import { BiCrown, BiUserCheck, BiUserX, BiSearch } from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Make Admin
  const handleMakeAdmin = async (userId) => {
    if (!window.confirm('Make this user an Admin?')) return;
    setActionLoading(userId);
    try {
      await apiClient.put(`/admin/make-admin/${userId}`);
      alert('User promoted to Admin ✅');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Remove Admin
  const handleRemoveAdmin = async (userId) => {
    if (!window.confirm('Remove Admin role from this user?')) return;
    setActionLoading(userId);
    try {
      await apiClient.put(`/admin/remove-admin/${userId}`);
      alert('Admin role removed ✅');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter out super_admin
  const filteredUsers = users.filter(
    (u) =>
      u.role !== 'super_admin' &&
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Topbar title="Super Admin Panel" />

      <div className="p-6">
        {/* Header Badge */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <BiCrown className="text-3xl text-amber-600" />
          <div>
            <h2 className="text-lg font-serif font-bold text-[#4a2e18]">
              Super Admin Privileges
            </h2>
            <p className="text-xs text-stone-600">
              Promote users to Admin or remove Admin role
            </p>
          </div>
        </div>

        {/* Search + Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-80 focus:outline-none focus:border-[#8c0a15]"
            />
          </div>
          <p className="text-sm text-stone-500">
            Total: <strong className="text-[#8c0a15]">{filteredUsers.length}</strong> users
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-stone-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-stone-500">No users found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Current Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-[#4a2e18]">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role === 'blog_admin'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => handleRemoveAdmin(user._id)}
                            disabled={actionLoading === user._id}
                            className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-xs font-bold transition disabled:opacity-50"
                          >
                            <BiUserX /> Remove Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            disabled={actionLoading === user._id}
                            className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold transition disabled:opacity-50"
                          >
                            <BiUserCheck /> Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;