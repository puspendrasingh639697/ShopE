import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiBell, BiCheck, BiTrash, BiX } from 'react-icons/bi';
import useNotificationStore from '../store/useNotificationStore';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  // ✅ Fetch on mount + polling every 30s
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Handle notification click
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  const typeIcons = {
    order: '🛒',
    user: '👤',
    product: '📦',
    payment: '💳',
    system: '🔔',
    blog: '📝',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ✅ Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-stone-100 transition"
        title="Notifications"
      >
        <BiBell className="text-xl text-stone-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ✅ Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50">
            <h3 className="text-sm font-bold text-[#4a2e18]">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#8c0a15] font-bold hover:underline flex items-center gap-1"
                >
                  <BiCheck /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <BiX />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-sm">
                🔔 No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition ${
                    !notif.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="text-xl flex-shrink-0">
                    {typeIcons[notif.type] || '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        !notif.isRead
                          ? 'font-bold text-[#4a2e18]'
                          : 'font-medium text-stone-700'
                      }`}
                    >
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="text-stone-300 hover:text-red-500 transition flex-shrink-0"
                  >
                    <BiTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;