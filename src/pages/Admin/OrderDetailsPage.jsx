


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   BiArrowBack, BiPackage, BiUser, BiMap, BiWallet,
//   BiCalendar, BiDownload,
// } from 'react-icons/bi';
// import API_BASE_URL from '../../config/api';
// import Topbar from '../../components/Topbar';

// const OrderDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const token = localStorage.getItem('token');

//   const fetchOrder = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/admin/orders/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOrder(res.data.order);
//     } catch (err) {
//       console.error('Fetch order error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const handleStatusUpdate = async (newStatus) => {
//     setUpdating(true);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/admin/orders/${id}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setOrder({ ...order, status: newStatus });
//       alert('Status updated! ✅');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to update');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <Topbar title="Order Details" />
//         <div className="p-6 text-center text-stone-500">Loading order...</div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div>
//         <Topbar title="Order Details" />
//         <div className="p-6 text-center text-stone-500">Order not found.</div>
//       </div>
//     );
//   }

//   const statusColors = {
//     Processing: 'bg-amber-100 text-amber-800',
//     Shipped: 'bg-blue-100 text-blue-800',
//     Delivered: 'bg-green-100 text-green-800',
//     Cancelled: 'bg-red-100 text-red-800',
//   };

//   const timeline = [
//     { status: 'Processing', label: 'Order Placed', icon: '📦' },
//     { status: 'Shipped', label: 'Shipped', icon: '🚚' },
//     { status: 'Delivered', label: 'Delivered', icon: '✅' },
//   ];

//   const statusIndex = timeline.findIndex((t) => t.status === order.status);

//   // ✅ Calculate subtotal from items
//   const calculatedSubtotal =
//     order.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

//   return (
//     <div>
//       <Topbar title={`Order #${order._id?.slice(-8)}`} />

//       <div className="p-6 space-y-6">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/admin/orders')}
//           className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15]"
//         >
//           <BiArrowBack /> Back to Orders
//         </button>

//         {/* Header - Order ID + Status */}
//         <div className="bg-white rounded-xl shadow-md p-6 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">
//               Order ID
//             </p>
//             <p className="text-lg font-mono text-[#8c0a15] font-bold">
//               #{order._id}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span
//               className={`px-3 py-1.5 rounded text-sm font-bold ${
//                 statusColors[order.status] || 'bg-stone-100 text-stone-700'
//               }`}
//             >
//               {order.status || 'Processing'}
//             </span>
//             <select
//               value={order.status || 'Processing'}
//               onChange={(e) => handleStatusUpdate(e.target.value)}
//               disabled={updating}
//               className="text-sm border border-stone-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#8c0a15] disabled:opacity-50"
//             >
//               <option value="Processing">Processing</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>

//         {/* Status Timeline */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4">
//             Order Timeline
//           </h2>
//           <div className="flex items-center justify-between">
//             {timeline.map((step, idx) => (
//               <div key={step.status} className="flex-1 flex items-center">
//                 <div className="flex flex-col items-center">
//                   <div
//                     className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
//                       idx <= statusIndex
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-stone-100 text-stone-400'
//                     }`}
//                   >
//                     {step.icon}
//                   </div>
//                   <p
//                     className={`text-xs mt-2 font-bold ${
//                       idx <= statusIndex ? 'text-green-700' : 'text-stone-400'
//                     }`}
//                   >
//                     {step.label}
//                   </p>
//                 </div>
//                 {idx < timeline.length - 1 && (
//                   <div
//                     className={`flex-1 h-1 mx-2 ${
//                       idx < statusIndex ? 'bg-green-500' : 'bg-stone-200'
//                     }`}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Customer */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
//               <BiUser /> Customer
//             </h2>
//             <p className="font-bold text-[#4a2e18]">{order.user?.name || 'N/A'}</p>
//             <p className="text-sm text-stone-600">{order.user?.email || ''}</p>
//             <p className="text-sm text-stone-600">{order.user?.phone || ''}</p>
//           </div>

//           {/* Shipping Address */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
//               <BiMap /> Shipping Address
//             </h2>
//             <p className="text-sm text-stone-700">
//               {order.shippingAddress?.street || 'N/A'}
//             </p>
//             <p className="text-sm text-stone-700">
//               {order.shippingAddress?.city}, {order.shippingAddress?.state}
//             </p>
//             <p className="text-sm text-stone-700">
//               PIN: {order.shippingAddress?.zipCode || 'N/A'}
//             </p>
//           </div>

//           {/* Payment */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
//               <BiWallet /> Payment
//             </h2>
//             <p className="text-sm text-stone-700">
//               Method: <span className="font-bold">{order.paymentMethod || 'COD'}</span>
//             </p>
//             <p className="text-sm text-stone-700">
//               Total:{' '}
//               <span className="font-bold text-[#8c0a15]">
//                 ₹{order.totalPrice?.toLocaleString('en-IN')}
//               </span>
//             </p>
//             <p className="text-sm text-stone-700 flex items-center gap-1">
//               <BiCalendar />{' '}
//               {new Date(order.createdAt).toLocaleDateString('en-IN')}
//             </p>
//           </div>
//         </div>

//         {/* ✅ Order Items — POORA CODE */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
//             <BiPackage /> Order Items ({order.orderItems?.length || 0})
//           </h2>

//           <div className="space-y-4">
//             {order.orderItems?.map((item, idx) => {
//               const productImage = item.productId?.image || item.image || '';

//               const itemTotal = (item.price || 0) * (item.qty || 1);

//               return (
//                 <div
//                   key={idx}
//                   className="flex items-center gap-4 pb-4 border-b border-stone-100 last:border-b-0"
//                 >
//                   {/* Image */}
//                   {productImage ? (
//                     <img
//                       src={productImage}
//                       alt={item.name}
//                       className="w-16 h-16 object-cover rounded border border-stone-200 flex-shrink-0"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   ) : (
//                     <div className="w-16 h-16 bg-stone-100 rounded border border-stone-200 flex items-center justify-center flex-shrink-0">
//                       <BiPackage className="text-stone-400 text-xl" />
//                     </div>
//                   )}

//                   {/* Name + Qty + Price */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-[#4a2e18] line-clamp-2">
//                       {item.name || 'Product'}
//                     </p>
//                     <p className="text-xs text-stone-500 mt-1">
//                       Qty: {item.qty || 1} × ₹{(item.price || 0).toLocaleString('en-IN')}
//                     </p>
//                   </div>

//                   {/* Total */}
//                   <p className="font-bold text-[#8c0a15] text-right whitespace-nowrap">
//                     ₹{itemTotal.toLocaleString('en-IN')}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Total Summary */}
//           <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-stone-600">Subtotal</span>
//               <span className="font-bold">
//                 ₹{calculatedSubtotal.toLocaleString('en-IN')}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-stone-600">Shipping</span>
//               <span className="font-bold text-green-600">Free</span>
//             </div>
//             <div className="flex justify-between text-base font-bold text-[#4a2e18] pt-3 border-t">
//               <span>Total</span>
//               <span className="text-[#8c0a15]">
//                 ₹{order.totalPrice?.toLocaleString('en-IN')}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Download Invoice */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => window.print()}
//             className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition"
//           >
//             <BiDownload /> Download Invoice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiArrowBack, BiPackage, BiUser, BiMap, BiWallet,
  BiCalendar, BiDownload,
} from 'react-icons/bi';
import Topbar from '../../components/Topbar';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await apiClient.get(`/admin/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Fetch order error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await apiClient.put(`/admin/orders/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      alert('Status updated! ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Topbar title="Order Details" />
        <div className="p-6 text-center text-stone-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Topbar title="Order Details" />
        <div className="p-6 text-center text-stone-500">Order not found.</div>
      </div>
    );
  }

  const statusColors = {
    Processing: 'bg-amber-100 text-amber-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const timeline = [
    { status: 'Processing', label: 'Order Placed', icon: '📦' },
    { status: 'Shipped', label: 'Shipped', icon: '🚚' },
    { status: 'Delivered', label: 'Delivered', icon: '✅' },
  ];

  const statusIndex = timeline.findIndex((t) => t.status === order.status);

  const calculatedSubtotal =
    order.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

  return (
    <div>
      <Topbar title={`Order #${order._id?.slice(-8)}`} />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8c0a15]"
        >
          <BiArrowBack /> Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">
              Order ID
            </p>
            <p className="text-lg font-mono text-[#8c0a15] font-bold">
              #{order._id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded text-sm font-bold ${
                statusColors[order.status] || 'bg-stone-100 text-stone-700'
              }`}
            >
              {order.status || 'Processing'}
            </span>
            <select
              value={order.status || 'Processing'}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="text-sm border border-stone-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#8c0a15] disabled:opacity-50"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4">
            Order Timeline
          </h2>
          <div className="flex items-center justify-between">
            {timeline.map((step, idx) => (
              <div key={step.status} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      idx <= statusIndex
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-xs mt-2 font-bold ${
                      idx <= statusIndex ? 'text-green-700' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {idx < timeline.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      idx < statusIndex ? 'bg-green-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
              <BiUser /> Customer
            </h2>
            <p className="font-bold text-[#4a2e18]">{order.user?.name || 'N/A'}</p>
            <p className="text-sm text-stone-600">{order.user?.email || ''}</p>
            <p className="text-sm text-stone-600">{order.user?.phone || ''}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
              <BiMap /> Shipping Address
            </h2>
            <p className="text-sm text-stone-700">
              {order.shippingAddress?.street || 'N/A'}
            </p>
            <p className="text-sm text-stone-700">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>
            <p className="text-sm text-stone-700">
              PIN: {order.shippingAddress?.zipCode || 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-sm font-bold uppercase text-stone-500 mb-3 flex items-center gap-2">
              <BiWallet /> Payment
            </h2>
            <p className="text-sm text-stone-700">
              Method: <span className="font-bold">{order.paymentMethod || 'COD'}</span>
            </p>
            <p className="text-sm text-stone-700">
              Total:{' '}
              <span className="font-bold text-[#8c0a15]">
                ₹{order.totalPrice?.toLocaleString('en-IN')}
              </span>
            </p>
            <p className="text-sm text-stone-700 flex items-center gap-1">
              <BiCalendar />{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-base font-serif font-bold text-[#4a2e18] mb-4 flex items-center gap-2">
            <BiPackage /> Order Items ({order.orderItems?.length || 0})
          </h2>

          <div className="space-y-4">
            {order.orderItems?.map((item, idx) => {
              const productImage = item.productId?.image || item.image || '';
              const itemTotal = (item.price || 0) * (item.qty || 1);

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-4 border-b border-stone-100 last:border-b-0"
                >
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border border-stone-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-stone-100 rounded border border-stone-200 flex items-center justify-center flex-shrink-0">
                      <BiPackage className="text-stone-400 text-xl" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#4a2e18] line-clamp-2">
                      {item.name || 'Product'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Qty: {item.qty || 1} × ₹{(item.price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <p className="font-bold text-[#8c0a15] text-right whitespace-nowrap">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-bold">
                ₹{calculatedSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#4a2e18] pt-3 border-t">
              <span>Total</span>
              <span className="text-[#8c0a15]">
                ₹{order.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Download Invoice */}
        <div className="flex justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#8c0a15] hover:bg-[#6b080f] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition"
          >
            <BiDownload /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;