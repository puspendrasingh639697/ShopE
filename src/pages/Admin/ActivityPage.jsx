import React, { useEffect, useState } from 'react';
import {
  BiSearch, BiTrash, BiTime, BiUser, BiLogIn, BiLogOut,
  BiPlus, BiEdit, BiX, BiCheck, BiDollar, BiDownload,
  BiBlock, BiCrown, BiPackage, BiChevronLeft, BiChevronRight,
  BiRefresh, BiHistory,
} from 'react-icons/bi';
import useActivityStore from '../../store/useActivityStore';
import Topbar from '../../components/Topbar';

const ActivityPage = () => {
  const {
    activities,
    loading,
    pagination,
    stats,
    fetchActivities,
    fetchStats,
    deleteActivity,
    cleanupOld,
    clearAll,
  } = useActivityStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchActivities({
      page: currentPage,
      limit: 30,
      search: debouncedSearch,
      action: actionFilter,
      targetModel: targetFilter,
      startDate,
      endDate,
    });
    fetchStats();
  }, [currentPage, debouncedSearch, actionFilter, targetFilter, startDate, endDate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity log?')) return;
    await deleteActivity(id);
  };

  const handleCleanup = async () => {
    if (!window.confirm('Delete activities older than 30 days?')) return;
    const result = await cleanupOld(30);
    if (result.success) {
      alert(`Deleted ${result.deletedCount} old activities ✅`);
      fetchActivities({ page: 1 });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ Clear ALL activity logs? This cannot be undone!')) return;
    const result = await clearAll();
    if (result.success) {
      alert('All activities cleared ✅');
      fetchActivities({ page: 1 });
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  const actionIcons = {
    LOGIN: <BiLogIn className="text-blue-600" />,
    LOGOUT: <BiLogOut className="text-stone-600" />,
    CREATE: <BiPlus className="text-green-600" />,
    UPDATE: <BiEdit className="text-blue-600" />,
    DELETE: <BiX className="text-red-600" />,
    APPROVE: <BiCheck className="text-green-600" />,
    REJECT: <BiX className="text-red-600" />,
    REFUND: <BiDollar className="text-green-600" />,
    EXPORT: <BiDownload className="text-purple-600" />,
    BLOCK: <BiBlock className="text-red-600" />,
    UNBLOCK: <BiCheck className="text-green-600" />,
    MAKE_ADMIN: <BiCrown className="text-amber-600" />,
    REMOVE_ADMIN: <BiCrown className="text-stone-600" />,
    STOCK_UPDATE: <BiPackage className="text-amber-600" />,
  };

  const actionColors = {
    LOGIN: 'bg-blue-100 text-blue-800',
    LOGOUT: 'bg-stone-100 text-stone-700',
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    APPROVE: 'bg-green-100 text-green-800',
    REJECT: 'bg-red-100 text-red-800',
    REFUND: 'bg-green-100 text-green-800',
    EXPORT: 'bg-purple-100 text-purple-800',
    BLOCK: 'bg-red-100 text-red-800',
    UNBLOCK: 'bg-green-100 text-green-800',
    MAKE_ADMIN: 'bg-amber-100 text-amber-800',
    REMOVE_ADMIN: 'bg-stone-100 text-stone-700',
    STOCK_UPDATE: 'bg-amber-100 text-amber-800',
  };

  return (
    <div>
      <Topbar title="Activity Log" />

      <div className="p-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs uppercase text-stone-500 font-bold">Total Activities</p>
              <p className="text-2xl font-bold text-[#4a2e18]">{stats.totalActivities}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs uppercase text-stone-500 font-bold">Last 24 Hours</p>
              <p className="text-2xl font-bold text-[#8c0a15]">{stats.recentActivities}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs uppercase text-stone-500 font-bold">Actions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byAction?.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs uppercase text-stone-500 font-bold">Target Types</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byTargetModel?.length || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by user, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm w-full focus:outline-none focus:border-[#8c0a15]"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
              <option value="REFUND">Refund</option>
              <option value="EXPORT">Export</option>
              <option value="BLOCK">Block</option>
              <option value="MAKE_ADMIN">Make Admin</option>
            </select>

            <select
              value={targetFilter}
              onChange={(e) => {
                setTargetFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Targets</option>
              <option value="User">User</option>
              <option value="Product">Product</option>
              <option value="Order">Order</option>
              <option value="Review">Review</option>
              <option value="Banner">Banner</option>
              <option value="Category">Category</option>
              <option value="Return">Return</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />

            <button
              onClick={handleCleanup}
              className="flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-2 rounded-lg text-xs font-bold"
            >
              <BiRefresh /> Cleanup
            </button>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg text-xs font-bold"
            >
              <BiTrash /> Clear All
            </button>
          </div>
        </div>

        {/* Activity List */}
        {loading ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-stone-500 bg-white rounded-xl">
            <BiHistory className="text-4xl mx-auto mb-2 text-stone-300" />
            No activity logs yet.
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                  {actionIcons[activity.action] || <BiTime className="text-stone-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        actionColors[activity.action] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {activity.action}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {activity.targetModel}
                    </span>
                    {activity.status === 'failed' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        FAILED
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#4a2e18] font-medium mt-1">
                    {activity.description || `${activity.action} ${activity.targetModel}`}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-stone-500 mt-1">
                    <span className="flex items-center gap-1">
                      <BiUser /> {activity.userName} ({activity.userRole})
                    </span>
                    <span className="flex items-center gap-1">
                      <BiTime /> {new Date(activity.createdAt).toLocaleString('en-IN')}
                    </span>
                    {activity.ipAddress && <span>IP: {activity.ipAddress}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(activity._id)}
                  className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition flex-shrink-0"
                >
                  <BiTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && activities.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md p-4">
            <p className="text-xs text-stone-500">
              Page <strong>{currentPage}</strong> of <strong>{pagination.totalPages}</strong>{' '}
              ({pagination.totalActivities} total)
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

export default ActivityPage;