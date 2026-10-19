import React, { useEffect, useState } from 'react';
import {
  BiSearch, BiCheck, BiX, BiDollar,
  BiChevronLeft, BiChevronRight, BiTime, BiPackage,
} from 'react-icons/bi';
import useReturnStore from '../../store/useReturnStore';
import Topbar from '../../components/Topbar';

const ReturnsPage = () => {
  const {
    returns,
    loading,
    pagination,
    fetchReturns,
    approveReturn,
    rejectReturn,
    processRefund,
  } = useReturnStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ Modals
  const [reviewModal, setReviewModal] = useState(null); // pending return
  const [refundModal, setRefundModal] = useState(null); // approved return

  const [adminNote, setAdminNote] = useState('');
  const [refundData, setRefundData] = useState({
    refundMethod: 'Original Payment Method',
    refundTransactionId: '',
  });

  // ✅ Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchReturns({
      page: currentPage,
      limit: 20,
      search: debouncedSearch,
      status: statusFilter,
    });
  }, [currentPage, debouncedSearch, statusFilter]);

  // ✅ Approve
  const handleApprove = async (id) => {
    setActionLoading(id);
    const result = await approveReturn(id, adminNote);
    if (result.success) {
      alert('Return approved! ✅');
      setReviewModal(null);
      setAdminNote('');
    } else {
      alert(result.error);
    }
    setActionLoading(null);
  };

  // ✅ Reject
  const handleReject = async (id) => {
    if (!adminNote.trim()) {
      alert('Please add a note for rejection');
      return;
    }
    setActionLoading(id);
    const result = await rejectReturn(id, adminNote);
    if (result.success) {
      alert('Return rejected');
      setReviewModal(null);
      setAdminNote('');
    } else {
      alert(result.error);
    }
    setActionLoading(null);
  };

  // ✅ Process Refund
  const handleProcessRefund = async (id) => {
    setActionLoading(id);
    const result = await processRefund(id, refundData);
    if (result.success) {
      alert('Refund processed! ✅');
      setRefundModal(null);
      setRefundData({
        refundMethod: 'Original Payment Method',
        refundTransactionId: '',
      });
    } else {
      alert(result.error);
    }
    setActionLoading(null);
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-stone-100 text-stone-700',
  };

  return (
    <div>
      <Topbar title="Returns & Refunds" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search returns..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total: <strong className="text-[#8c0a15]">{pagination.totalReturns}</strong> returns
          </p>
        </div>

        {/* Returns List */}
        {loading ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">Loading returns...</div>
        ) : returns.length === 0 ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            <BiPackage className="text-4xl mx-auto mb-2 text-stone-300" />
            No return requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((returnReq) => (
              <div key={returnReq._id} className="bg-white rounded-xl shadow-md p-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-stone-200">
                  <div>
                    <p className="text-xs text-stone-500 font-bold uppercase">
                      Return ID: {returnReq._id.slice(-8)}
                    </p>
                    <p className="text-sm font-bold text-[#4a2e18] mt-1">
                      Order #{returnReq.order?._id?.slice(-8) || 'N/A'}
                    </p>
                    <p className="text-xs text-stone-500">
                      by {returnReq.user?.name} ({returnReq.user?.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        statusColors[returnReq.status] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {returnReq.status}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-[#8c0a15] text-white">
                      {returnReq.returnType || 'Refund'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-3">
                  <p className="text-xs font-bold text-stone-500 uppercase mb-2">Items:</p>
                  <div className="space-y-2">
                   {returnReq.items?.map((item, idx) => (
  <div key={idx} className="flex items-center gap-3">
    {/* ✅ Image with fallback */}
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        className="w-10 h-10 object-cover rounded border border-stone-200"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/40?text=IMG';
        }}
      />
    ) : (
      <div className="w-10 h-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center">
        <BiPackage className="text-stone-400" />
      </div>
    )}

    <div className="flex-1">
      <p className="text-xs font-medium text-[#4a2e18]">{item.name}</p>
      <p className="text-[10px] text-stone-500">
        Qty: {item.qty} × ₹{item.price}
      </p>
    </div>
  </div>
))}
                  </div>
                </div>

                {/* Reason */}
                <div className="py-3 border-t border-stone-100">
                  <p className="text-xs font-bold text-stone-500 uppercase">Reason:</p>
                  <p className="text-sm text-[#8c0a15] font-bold">{returnReq.reason}</p>
                  {returnReq.description && (
                    <p className="text-xs text-stone-600 mt-1">{returnReq.description}</p>
                  )}
                </div>

                {/* Refund + Date */}
                <div className="py-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Refund Amount:</p>
                    <p className="text-lg font-bold text-[#8c0a15]">
                      ₹{returnReq.refundAmount?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 flex items-center gap-1 justify-end">
                      <BiTime /> {new Date(returnReq.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Admin Note */}
                {returnReq.adminNote && (
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-xs font-bold text-blue-800">Admin Note:</p>
                    <p className="text-sm text-blue-900">{returnReq.adminNote}</p>
                  </div>
                )}

                {/* Refund Transaction */}
                {returnReq.refundTransactionId && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                    <p className="font-bold text-green-800">
                      Refund ID: {returnReq.refundTransactionId}
                    </p>
                    <p className="text-green-700">
                      Method: {returnReq.refundMethod}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  {returnReq.status === 'pending' && (
                    <button
                      onClick={() => {
                        setReviewModal(returnReq);
                        setAdminNote('');
                      }}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition"
                    >
                      <BiCheck /> Review & Approve
                    </button>
                  )}

                  {returnReq.status === 'approved' && (
                    <button
                      onClick={() => {
                        setRefundModal(returnReq);
                        setRefundData({
                          refundMethod: 'Original Payment Method',
                          refundTransactionId: '',
                        });
                      }}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold transition"
                    >
                      <BiDollar /> Process Refund
                    </button>
                  )}

                  {returnReq.status === 'completed' && (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <BiCheck /> Refund Completed
                    </span>
                  )}

                  {returnReq.status === 'rejected' && (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                      <BiX /> Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && returns.length > 0 && pagination.totalPages > 1 && (
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

      {/* ✅ Review Modal (Pending) */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Review Return Request
            </h3>

            <div className="bg-stone-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-stone-500">Order ID</p>
              <p className="text-sm font-bold">#{reviewModal.order?._id?.slice(-8)}</p>
              <p className="text-xs text-stone-500 mt-2">Customer</p>
              <p className="text-sm font-bold">{reviewModal.user?.name}</p>
              <p className="text-xs text-stone-500 mt-2">Refund Amount</p>
              <p className="text-lg font-bold text-[#8c0a15]">
                ₹{reviewModal.refundAmount?.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-stone-500 mt-2">Reason</p>
              <p className="text-sm font-bold text-[#8c0a15]">{reviewModal.reason}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Admin Note (Required for reject)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows="3"
                placeholder="Write your note..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#8c0a15]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(reviewModal._id)}
                disabled={actionLoading === reviewModal._id}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
              >
                <BiCheck /> Approve
              </button>
              <button
                onClick={() => handleReject(reviewModal._id)}
                disabled={actionLoading === reviewModal._id}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
              >
                <BiX /> Reject
              </button>
              <button
                onClick={() => {
                  setReviewModal(null);
                  setAdminNote('');
                }}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2.5 rounded-lg font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Refund Modal (Approved) */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Process Refund
            </h3>

            <div className="bg-stone-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-stone-500">Refund Amount</p>
              <p className="text-2xl font-bold text-[#8c0a15]">
                ₹{refundModal.refundAmount?.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-stone-500 mt-2">Customer</p>
              <p className="text-sm font-bold">{refundModal.user?.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Refund Method
              </label>
              <select
                value={refundData.refundMethod}
                onChange={(e) =>
                  setRefundData({ ...refundData, refundMethod: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm bg-white"
              >
                <option value="Original Payment Method">Original Payment Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Razorpay">Razorpay</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={refundData.refundTransactionId}
                onChange={(e) =>
                  setRefundData({ ...refundData, refundTransactionId: e.target.value })
                }
                placeholder="e.g., pay_ABC123XYZ"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8c0a15] text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleProcessRefund(refundModal._id)}
                disabled={actionLoading === refundModal._id}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
              >
                <BiDollar /> {actionLoading === refundModal._id ? 'Processing...' : 'Process Refund'}
              </button>
              <button
                onClick={() => setRefundModal(null)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2.5 rounded-lg font-bold text-sm"
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

export default ReturnsPage;