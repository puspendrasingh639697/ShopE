

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../../config/apiClient';
// import {
//   BiTrash, BiBlock, BiCheckCircle, BiSearch,
//   BiChevronLeft, BiChevronRight,
// } from 'react-icons/bi';
// import Topbar from '../../components/Topbar';

// const UsersPage = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalUsers: 0,
//     limit: 20,
//   });
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   // ✅ Debounce search (500ms)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // ✅ Fetch users with pagination
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: pagination.currentPage,
//         limit: pagination.limit,
//       });
//       if (debouncedSearch) params.append('search', debouncedSearch);
//       if (roleFilter) params.append('role', roleFilter);
//       if (statusFilter) params.append('status', statusFilter);

//       const res = await apiClient.get(`/admin/users?${params.toString()}`);

//       setUsers(res.data.users || []);
//       setPagination((prev) => ({
//         ...prev,
//         ...res.data.pagination,
//       }));
//     } catch (err) {
//       console.error('Fetch users error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [pagination.currentPage, debouncedSearch, roleFilter, statusFilter]);

//   // ✅ Block/Unblock
//   const handleToggleBlock = async (e, userId) => {
//     e.stopPropagation();
//     if (!window.confirm('Toggle block status for this user?')) return;
//     try {
//       await apiClient.put(`/admin/users/${userId}/block`);
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed');
//     }
//   };

//   // ✅ Delete
//   const handleDelete = async (e, userId) => {
//     e.stopPropagation();
//     if (!window.confirm('Delete this user?')) return;
//     try {
//       await apiClient.delete(`/admin/users/${userId}`);
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed');
//     }
//   };

//   // ✅ Page change
//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.totalPages) return;
//     setPagination((prev) => ({ ...prev, currentPage: page }));
//   };

//   return (
//     <div>
//       <Topbar title="Users Management" />

//       <div className="p-6">
//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="relative flex-1 min-w-[250px]">
//             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
//             <input
//               type="text"
//               placeholder="Search name, email, phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
//             />
//           </div>

//           <select
//             value={roleFilter}
//             onChange={(e) => {
//               setRoleFilter(e.target.value);
//               setPagination((prev) => ({ ...prev, currentPage: 1 }));
//             }}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Roles</option>
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//             <option value="super_admin">Super Admin</option>
//             <option value="blog_admin">Blog Admin</option>
//             <option value="astrologer">Astrologer</option>
//           </select>

//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPagination((prev) => ({ ...prev, currentPage: 1 }));
//             }}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="blocked">Blocked</option>
//           </select>

//           <p className="text-sm text-stone-500 ml-auto">
//             Total: <strong className="text-[#8c0a15]">{pagination.totalUsers}</strong> users
//           </p>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {loading ? (
//             <div className="p-6 text-center text-stone-500">Loading users...</div>
//           ) : users.length === 0 ? (
//             <div className="p-6 text-center text-stone-500">No users found.</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
//                   <tr>
//                     <th className="px-4 py-3 text-left">Name</th>
//                     <th className="px-4 py-3 text-left">Email</th>
//                     <th className="px-4 py-3 text-left">Phone</th>
//                     <th className="px-4 py-3 text-left">Role</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr
//                       key={user._id}
//                       onClick={() => navigate(`/admin/users/${user._id}`)}
//                       className="border-b hover:bg-stone-50 cursor-pointer transition"
//                     >
//                       <td className="px-4 py-3 font-medium text-[#4a2e18]">{user.name}</td>
//                       <td className="px-4 py-3 text-stone-600">{user.email}</td>
//                       <td className="px-4 py-3 text-stone-600">{user.phone || 'N/A'}</td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-bold uppercase ${
//                             user.role === 'super_admin'
//                               ? 'bg-amber-100 text-amber-800'
//                               : user.role === 'admin'
//                               ? 'bg-blue-100 text-blue-800'
//                               : user.role === 'blog_admin'
//                               ? 'bg-pink-100 text-pink-800'
//                               : 'bg-stone-100 text-stone-700'
//                           }`}
//                         >
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`flex items-center gap-1 text-xs font-bold ${
//                             user.isActive !== false ? 'text-green-600' : 'text-red-600'
//                           }`}
//                         >
//                           {user.isActive !== false ? (
//                             <><BiCheckCircle /> Active</>
//                           ) : (
//                             <><BiBlock /> Blocked</>
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={(e) => handleToggleBlock(e, user._id)}
//                             className={`p-2 rounded-md transition ${
//                               user.isActive !== false
//                                 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//                             }`}
//                           >
//                             {user.isActive !== false ? <BiBlock /> : <BiCheckCircle />}
//                           </button>
//                           <button
//                             onClick={(e) => handleDelete(e, user._id)}
//                             className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
//                           >
//                             <BiTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {!loading && users.length > 0 && (
//             <div className="flex items-center justify-between p-4 border-t border-stone-200">
//               <p className="text-xs text-stone-500">
//                 Page <strong>{pagination.currentPage}</strong> of{' '}
//                 <strong>{pagination.totalPages}</strong>
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => goToPage(pagination.currentPage - 1)}
//                   disabled={!pagination.hasPrevPage}
//                   className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <BiChevronLeft /> Prev
//                 </button>

//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (pagination.totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                       pageNum = pagination.totalPages - 4 + i;
//                     } else {
//                       pageNum = pagination.currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => goToPage(pageNum)}
//                         className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
//                           pagination.currentPage === pageNum
//                             ? 'bg-[#8c0a15] text-white'
//                             : 'border border-stone-300 hover:bg-stone-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => goToPage(pagination.currentPage + 1)}
//                   disabled={!pagination.hasNextPage}
//                   className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next <BiChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiTrash, BiBlock, BiCheckCircle, BiSearch,
  BiChevronLeft, BiChevronRight, BiDownload,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20,
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ✅ Debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch users with pagination
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await apiClient.get(`/admin/users?${params.toString()}`);

      setUsers(res.data.users || []);
      setPagination((prev) => ({
        ...prev,
        ...res.data.pagination,
      }));
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, debouncedSearch, roleFilter, statusFilter]);

  // ✅ Block/Unblock
  const handleToggleBlock = async (e, userId) => {
    e.stopPropagation();
    if (!window.confirm('Toggle block status for this user?')) return;
    try {
      await apiClient.put(`/admin/users/${userId}/block`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  // ✅ Delete
  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this user?')) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  // ✅ Export users to CSV
  const handleExport = async () => {
    try {
      const res = await apiClient.get('/admin/export/users', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('Users exported! ✅');
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed');
    }
  };

  // ✅ Page change
  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div>
      <Topbar title="Users Management" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="blog_admin">Blog Admin</option>
            <option value="astrologer">Astrologer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total: <strong className="text-[#8c0a15]">{pagination.totalUsers}</strong> users
          </p>

          {/* ✅ Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
          >
            <BiDownload /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-stone-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-stone-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="border-b hover:bg-stone-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-medium text-[#4a2e18]">{user.name}</td>
                      <td className="px-4 py-3 text-stone-600">{user.email}</td>
                      <td className="px-4 py-3 text-stone-600">{user.phone || 'N/A'}</td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleToggleBlock(e, user._id)}
                            className={`p-2 rounded-md transition ${
                              user.isActive !== false
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.isActive !== false ? <BiBlock /> : <BiCheckCircle />}
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, user._id)}
                            className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            <BiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Page <strong>{pagination.currentPage}</strong> of{' '}
                <strong>{pagination.totalPages}</strong>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BiChevronLeft /> Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
                          pagination.currentPage === pageNum
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
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <BiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;