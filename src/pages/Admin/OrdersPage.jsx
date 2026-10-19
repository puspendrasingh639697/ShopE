


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../../config/apiClient';
// import {
//   BiSearch, BiShow,
//   BiChevronLeft, BiChevronRight,
// } from 'react-icons/bi';
// import Topbar from '../../components/Topbar';

// const OrdersPage = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [updatingId, setUpdatingId] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalOrders: 0,
//     limit: 20,
//   });
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   // ✅ Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // ✅ Fetch orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: pagination.currentPage,
//         limit: pagination.limit,
//       });
//       if (debouncedSearch) params.append('search', debouncedSearch);
//       if (statusFilter) params.append('status', statusFilter);

//       const res = await apiClient.get(`/admin/orders?${params.toString()}`);

//       setOrders(res.data.orders || []);
//       setPagination((prev) => ({ ...prev, ...res.data.pagination }));
//     } catch (err) {
//       console.error('Fetch orders error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [pagination.currentPage, debouncedSearch, statusFilter]);

//   // ✅ Update status
//   const handleStatusUpdate = async (e, orderId, newStatus) => {
//     e.stopPropagation();
//     setUpdatingId(orderId);
//     try {
//       await apiClient.put(`/admin/orders/${orderId}`, { status: newStatus });
//       fetchOrders();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed');
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.totalPages) return;
//     setPagination((prev) => ({ ...prev, currentPage: page }));
//   };

//   const statusColors = {
//     Processing: 'bg-amber-100 text-amber-800',
//     Shipped: 'bg-blue-100 text-blue-800',
//     Delivered: 'bg-green-100 text-green-800',
//     Cancelled: 'bg-red-100 text-red-800',
//   };

//   return (
//     <div>
//       <Topbar title="Orders Management" />

//       <div className="p-6">
//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="relative flex-1 min-w-[250px]">
//             <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
//             <input
//               type="text"
//               placeholder="Search by address, city..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPagination((prev) => ({ ...prev, currentPage: 1 }));
//             }}
//             className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
//           >
//             <option value="">All Status</option>
//             <option value="Processing">Processing</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Delivered">Delivered</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>

//           <p className="text-sm text-stone-500 ml-auto">
//             Total: <strong className="text-[#8c0a15]">{pagination.totalOrders}</strong> orders
//           </p>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {loading ? (
//             <div className="p-6 text-center text-stone-500">Loading orders...</div>
//           ) : orders.length === 0 ? (
//             <div className="p-6 text-center text-stone-500">No orders found.</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
//                   <tr>
//                     <th className="px-4 py-3 text-left">Order ID</th>
//                     <th className="px-4 py-3 text-left">Customer</th>
//                     <th className="px-4 py-3 text-left">Items</th>
//                     <th className="px-4 py-3 text-left">Total</th>
//                     <th className="px-4 py-3 text-left">Date</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Update</th>
//                     <th className="px-4 py-3 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr
//                       key={order._id}
//                       onClick={() => navigate(`/admin/orders/${order._id}`)}
//                       className="border-b hover:bg-stone-50 cursor-pointer transition"
//                     >
//                       <td className="px-4 py-3 font-mono text-xs text-[#8c0a15]">
//                         #{order._id?.slice(-8)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="font-medium text-[#4a2e18]">{order.user?.name || 'N/A'}</p>
//                         <p className="text-xs text-stone-500">{order.user?.email || ''}</p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="text-xs text-stone-600">{order.orderItems?.length || 0} items</p>
//                         <p className="text-xs text-stone-400 line-clamp-1">
//                           {order.orderItems?.map((i) => i.name).join(', ')}
//                         </p>
//                       </td>
//                       <td className="px-4 py-3 font-bold text-[#8c0a15]">
//                         ₹{order.totalPrice?.toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-4 py-3 text-xs text-stone-500">
//                         {new Date(order.createdAt).toLocaleDateString('en-IN')}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-bold ${
//                             statusColors[order.status] || 'bg-stone-100 text-stone-700'
//                           }`}
//                         >
//                           {order.status || 'Processing'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <select
//                           value={order.status || 'Processing'}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) =>
//                             handleStatusUpdate(e, order._id, e.target.value)
//                           }
//                           disabled={updatingId === order._id}
//                           className="text-xs border border-stone-300 rounded px-2 py-1 focus:outline-none focus:border-[#8c0a15] disabled:opacity-50"
//                         >
//                           <option value="Processing">Processing</option>
//                           <option value="Shipped">Shipped</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex justify-end">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/admin/orders/${order._id}`);
//                             }}
//                             className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
//                           >
//                             <BiShow />
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
//           {!loading && orders.length > 0 && (
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

// export default OrdersPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiSearch, BiShow,
  BiChevronLeft, BiChevronRight, BiDownload,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 20,
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);

      const res = await apiClient.get(`/admin/orders?${params.toString()}`);

      setOrders(res.data.orders || []);
      setPagination((prev) => ({ ...prev, ...res.data.pagination }));
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, debouncedSearch, statusFilter]);

  // ✅ Update status
  const handleStatusUpdate = async (e, orderId, newStatus) => {
    e.stopPropagation();
    setUpdatingId(orderId);
    try {
      await apiClient.put(`/admin/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Export orders to CSV
  const handleExport = async () => {
    try {
      const res = await apiClient.get('/admin/export/orders', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('Orders exported! ✅');
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const statusColors = {
    Processing: 'bg-amber-100 text-amber-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <Topbar title="Orders Management" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by address, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total: <strong className="text-[#8c0a15]">{pagination.totalOrders}</strong> orders
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
            <div className="p-6 text-center text-stone-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-stone-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Update</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="border-b hover:bg-stone-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#8c0a15]">
                        #{order._id?.slice(-8)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#4a2e18]">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-stone-500">{order.user?.email || ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-stone-600">{order.orderItems?.length || 0} items</p>
                        <p className="text-xs text-stone-400 line-clamp-1">
                          {order.orderItems?.map((i) => i.name).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#8c0a15]">
                        ₹{order.totalPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            statusColors[order.status] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status || 'Processing'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusUpdate(e, order._id, e.target.value)
                          }
                          disabled={updatingId === order._id}
                          className="text-xs border border-stone-300 rounded px-2 py-1 focus:outline-none focus:border-[#8c0a15] disabled:opacity-50"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/orders/${order._id}`);
                            }}
                            className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            <BiShow />
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
          {!loading && orders.length > 0 && (
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

export default OrdersPage;