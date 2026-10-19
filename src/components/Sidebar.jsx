// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   BiHome, BiUser, BiShoppingBag, BiBox,
//   BiCrown, BiLogOut, BiEdit,
// } from 'react-icons/bi';
// import useAuthStore from '../store/useAuthStore';
// import { BiCog } from 'react-icons/bi'; 

// const Sidebar = () => {
//   const { user, logout } = useAuthStore();

//   const isSuperAdmin = user?.role === 'super_admin';
//   const isBlogAdmin = user?.role === 'blog_admin';

//   const menuItems = [
//     { path: '/admin/dashboard', label: 'Dashboard', icon: <BiHome />, show: true },
//     { path: '/admin/users', label: 'Users', icon: <BiUser />, show: true },
//     { path: '/admin/orders', label: 'Orders', icon: <BiShoppingBag />, show: true },
//     { path: '/admin/products', label: 'Products', icon: <BiBox />, show: true },
//     { path: '/admin/super-admin', label: 'Super Admin', icon: <BiCrown />, show: isSuperAdmin },
//     { path: '/blog-admin/dashboard', label: 'Blog Management', icon: <BiEdit />, show: isBlogAdmin || isSuperAdmin },
//     { path: '/admin/settings', label: 'Settings', icon: <BiCog />, show: true },
//   ];

//   return (
//     <aside className="w-64 bg-[#4a2e18] text-white min-h-screen flex flex-col">
//       {/* Logo */}
//       <div className="p-6 border-b border-white/10">
//         <h1 className="text-xl font-serif font-bold">🕉️ Japam Admin</h1>
//         <p className="text-xs text-white/60 mt-1">
//           {user?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
//         </p>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 p-4 space-y-1">
//         {menuItems.map((item) =>
//           item.show ? (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
//                   isActive
//                     ? 'bg-[#8c0a15] text-white font-semibold'
//                     : 'text-white/70 hover:bg-white/10 hover:text-white'
//                 }`
//               }
//             >
//               {item.icon}
//               {item.label}
//             </NavLink>
//           ) : null
//         )}
//       </nav>

//       {/* User Info + Logout */}
//       <div className="p-4 border-t border-white/10">
//         <div className="mb-3">
//           <p className="text-xs text-white/60">Logged in as</p>
//           <p className="text-sm font-bold truncate">{user?.name}</p>
//           <p className="text-xs text-white/50 truncate">{user?.email}</p>
//         </div>
//         <button
//           onClick={logout}
//           className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold"
//         >
//           <BiLogOut /> Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BiHome, BiUser, BiShoppingBag, BiBox,
  BiCrown, BiLogOut, BiEdit, BiCog, BiStar,
} from 'react-icons/bi';
import useAuthStore from '../store/useAuthStore';
import { BiImage } from 'react-icons/bi';
import { BiCategory } from 'react-icons/bi';
import { BiPackage } from 'react-icons/bi';
import { BiHistory } from 'react-icons/bi';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const isSuperAdmin = user?.role === 'super_admin';
  const isBlogAdmin = user?.role === 'blog_admin';

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BiHome />, show: true },
    { path: '/admin/users', label: 'Users', icon: <BiUser />, show: true },
    { path: '/admin/orders', label: 'Orders', icon: <BiShoppingBag />, show: true },
    { path: '/admin/products', label: 'Products', icon: <BiBox />, show: true },
    { path: '/admin/reviews', label: 'Reviews', icon: <BiStar />, show: true },
    { path: '/admin/banners', label: 'Banners', icon: <BiImage />, show: true },
    { path: '/admin/categories', label: 'Categories', icon: <BiCategory />, show: true },
    { path: '/admin/returns', label: 'Returns', icon: <BiPackage />, show: true },
    { path: '/admin/activity', label: 'Activity Log', icon: <BiHistory />, show: true },
    { path: '/admin/super-admin', label: 'Super Admin', icon: <BiCrown />, show: isSuperAdmin },
    { path: '/blog-admin/dashboard', label: 'Blog Management', icon: <BiEdit />, show: isBlogAdmin || isSuperAdmin },
    { path: '/admin/settings', label: 'Settings', icon: <BiCog />, show: true },
  ];

  return (
    <aside className="w-64 bg-[#4a2e18] text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-serif font-bold">🕉️ Puja Hetu</h1>
        <p className="text-xs text-white/60 mt-1">
          {user?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) =>
          item.show ? (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                  isActive
                    ? 'bg-[#8c0a15] text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ) : null
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="mb-3">
          <p className="text-xs text-white/60">Logged in as</p>
          <p className="text-sm font-bold truncate">{user?.name}</p>
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold"
        >
          <BiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;