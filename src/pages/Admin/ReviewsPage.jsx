import React, { useEffect, useState } from 'react';
import {
  BiSearch, BiCheck, BiX, BiTrash, BiStar, BiReply,
  BiChevronLeft, BiChevronRight,
} from 'react-icons/bi';
import useReviewStore from '../../store/useReviewStore';
import Topbar from '../../components/Topbar';

const ReviewsPage = () => {
  const {
    reviews,
    loading,
    pagination,
    fetchReviews,
    approveReview,
    rejectReview,
    deleteReview,
    replyToReview,
  } = useReviewStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch reviews
  useEffect(() => {
    fetchReviews({
      page: currentPage,
      limit: 20,
      search: debouncedSearch,
      status: statusFilter,
    });
  }, [currentPage, debouncedSearch, statusFilter]);

  // ✅ Approve
  const handleApprove = async (id) => {
    setActionLoading(id);
    await approveReview(id);
    setActionLoading(null);
  };

  // ✅ Reject
  const handleReject = async (id) => {
    setActionLoading(id);
    await rejectReview(id);
    setActionLoading(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    setActionLoading(id);
    await deleteReview(id);
    setActionLoading(null);
  };

  // ✅ Reply
  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert('Reply text required');
      return;
    }
    setActionLoading(id);
    const result = await replyToReview(id, replyText);
    if (result.success) {
      setReplyingTo(null);
      setReplyText('');
    }
    setActionLoading(null);
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <Topbar title="Reviews Management" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search reviews..."
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
          </select>

          <p className="text-sm text-stone-500 ml-auto">
            Total: <strong className="text-[#8c0a15]">{pagination.totalReviews}</strong> reviews
          </p>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            No reviews found.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-md p-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    {review.targetId?.image && (
                      <img
                        src={review.targetId.image}
                        alt={review.targetId.name}
                        className="w-12 h-12 object-cover rounded border border-stone-200"
                      />
                    )}
                    <div>
                      <p className="font-bold text-[#4a2e18] text-sm">
                        {review.targetId?.name || 'Item'}
                      </p>
                      <p className="text-xs text-stone-500">
                        by {review.user?.name || 'Unknown'} ({review.user?.email || ''})
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase">
                        Type: {review.targetModel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        statusColors[review.status] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {review.status || 'pending'}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <BiStar
                          key={i}
                          className={i < review.rating ? 'fill-amber-500' : 'text-stone-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-stone-700 mt-3">{review.comment}</p>

                <p className="text-[10px] text-stone-400 mt-1">
                  {new Date(review.createdAt).toLocaleString('en-IN')}
                </p>

                {/* Admin Reply */}
                {review.adminReply && (
                  <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-xs font-bold text-blue-800 mb-1">Admin Reply:</p>
                    <p className="text-sm text-blue-900">{review.adminReply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === review._id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="2"
                      placeholder="Write your reply..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#8c0a15]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(review._id)}
                        disabled={actionLoading === review._id}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold disabled:opacity-50"
                      >
                        {actionLoading === review._id ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-1.5 rounded text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      disabled={actionLoading === review._id}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold disabled:opacity-50"
                    >
                      <BiCheck /> Approve
                    </button>
                  )}

                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(review._id)}
                      disabled={actionLoading === review._id}
                      className="flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-md text-xs font-bold disabled:opacity-50"
                    >
                      <BiX /> Reject
                    </button>
                  )}

                  {!review.adminReply && (
                    <button
                      onClick={() => {
                        setReplyingTo(review._id);
                        setReplyText('');
                      }}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-bold"
                    >
                      <BiReply /> Reply
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={actionLoading === review._id}
                    className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-xs font-bold disabled:opacity-50 ml-auto"
                  >
                    <BiTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && reviews.length > 0 && (
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
              <span className="text-xs font-bold text-[#8c0a15]">
                {currentPage}
              </span>
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

export default ReviewsPage;