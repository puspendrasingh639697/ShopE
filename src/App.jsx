


// // // import React from 'react';
// // // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // // import useAuthStore from './store/useAuthStore';
// // // import AdminLogin from './pages/Admin/AdminLogin';
// // // import Login from './Utils/Login';

// // // // ✅ Admin Layout + Dashboard
// // // import AdminLayout from './pages/Admin/AdminLayout';
// // // import DashboardHome from './pages/Admin/DashboardHome';
// // // import UsersPage from './pages/Admin/UsersPage';

// // // // ✅ Protected Route
// // // const ProtectedRoute = ({ children, allowedRoles }) => {
// // //   const token = localStorage.getItem('token');
// // //   const user = JSON.parse(localStorage.getItem('user') || 'null');

// // //   if (!token || !user) {
// // //     return <Navigate to="/login" replace />;
// // //   }

// // //   if (allowedRoles && !allowedRoles.includes(user.role)) {
// // //     return <Navigate to="/" replace />;
// // //   }

// // //   return children;
// // // };

// // // function App() {
// // //   return (
// // //     <BrowserRouter>
// // //       <Routes>
// // //         {/* ✅ User Login */}
// // //         <Route path="/login" element={<Login />} />

// // //         {/* ✅ Admin Logins */}
// // //         <Route path="/admin/login" element={<AdminLogin />} />
// // //         <Route path="/super-admin/login" element={<AdminLogin />} />
// // //         <Route path="/blog-admin/login" element={<AdminLogin />} />
// // //         <Route path="users" element={<UsersPage />} />

// // //         {/* ✅ Admin Panel — Layout ke saath */}
// // //         <Route
// // //           path="/admin"
// // //           element={
// // //             <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
// // //               <AdminLayout />
// // //             </ProtectedRoute>
// // //           }
// // //         >
// // //           <Route index element={<Navigate to="/admin/dashboard" replace />} />
// // //           <Route path="dashboard" element={<DashboardHome />} />
// // //         </Route>

// // //         {/* ✅ Default redirect */}
// // //         <Route path="/" element={<Navigate to="/admin/login" replace />} />
// // //         <Route path="*" element={<Navigate to="/admin/login" replace />} />
// // //       </Routes>
// // //     </BrowserRouter>
// // //   );
// // // }

// // // export default App;


// // import React from 'react';
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // import useAuthStore from './store/useAuthStore';
// // import AdminLogin from './pages/Admin/AdminLogin';
// // import Login from './Utils/Login';

// // // ✅ Admin Layout + Pages
// // import AdminLayout from './pages/Admin/AdminLayout';
// // import DashboardHome from './pages/Admin/DashboardHome';
// // import UsersPage from './pages/Admin/UsersPage';
// // import OrdersPage from './pages/Admin/OrdersPage';
// // import ProductsPage from './pages/Admin/ProductsPage';

// // // ✅ Protected Route
// // const ProtectedRoute = ({ children, allowedRoles }) => {
// //   const token = localStorage.getItem('token');
// //   const user = JSON.parse(localStorage.getItem('user') || 'null');

// //   if (!token || !user) {
// //     return <Navigate to="/admin/login" replace />;
// //   }

// //   if (allowedRoles && !allowedRoles.includes(user.role)) {
// //     return <Navigate to="/admin/login" replace />;
// //   }

// //   return children;
// // };

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* ✅ User Login */}
// //         <Route path="/login" element={<Login />} />

// //         {/* ✅ Admin Logins */}
// //         <Route path="/admin/login" element={<AdminLogin />} />
// //         <Route path="/super-admin/login" element={<AdminLogin />} />
// //         <Route path="/blog-admin/login" element={<AdminLogin />} />

// //         {/* ✅ Admin Panel — Layout ke saath */}
// //         <Route
// //           path="/admin"
// //           element={
// //             <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
// //               <AdminLayout />
// //             </ProtectedRoute>
// //           }
// //         >
// //           <Route index element={<Navigate to="/admin/dashboard" replace />} />
// //           <Route path="dashboard" element={<DashboardHome />} />
// //           <Route path="users" element={<UsersPage />} />
// //           <Route path="orders" element={<OrdersPage />} />
// //           <Route path="products" element={<ProductsPage />} />
// //         </Route>

// //         {/* ✅ Default redirect */}
// //         <Route path="/" element={<Navigate to="/admin/login" replace />} />
// //         <Route path="*" element={<Navigate to="/admin/login" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import useAuthStore from './store/useAuthStore';
// import AdminLogin from './pages/Admin/AdminLogin';
// import Login from './Utils/Login';

// // ✅ Admin Layout + Pages
// import AdminLayout from './pages/Admin/AdminLayout';
// import DashboardHome from './pages/Admin/DashboardHome';
// import UsersPage from './pages/Admin/UsersPage';
// import OrdersPage from './pages/Admin/OrdersPage';
// import ProductsPage from './pages/Admin/ProductsPage';
// import SuperAdminPage from './pages/Admin/SuperAdminPage';  // ✅ ADD kiya

// // ✅ Protected Route
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user') || 'null');

//   if (!token || !user) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ✅ User Login */}
//         <Route path="/login" element={<Login />} />

//         {/* ✅ Admin Logins */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/super-admin/login" element={<AdminLogin />} />
//         <Route path="/blog-admin/login" element={<AdminLogin />} />

//         {/* ✅ Admin Panel — Layout ke saath */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Navigate to="/admin/dashboard" replace />} />
//           <Route path="dashboard" element={<DashboardHome />} />
//           <Route path="users" element={<UsersPage />} />
//           <Route path="orders" element={<OrdersPage />} />
//           <Route path="products" element={<ProductsPage />} />

//           {/* ✅ Super Admin only page */}
//           <Route
//             path="super-admin"
//             element={
//               <ProtectedRoute allowedRoles={['super_admin']}>
//                 <SuperAdminPage />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* ✅ Default redirect */}
//         <Route path="/" element={<Navigate to="/admin/login" replace />} />
//         <Route path="*" element={<Navigate to="/admin/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './pages/Admin/AdminLogin';
import Login from './Utils/Login';

import AdminLayout from './pages/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import UsersPage from './pages/Admin/UsersPage';
import OrdersPage from './pages/Admin/OrdersPage';
import ProductsPage from './pages/Admin/ProductsPage';
import SuperAdminPage from './pages/Admin/SuperAdminPage';
import OrderDetailsPage from './pages/Admin/OrderDetailsPage';
import ProductFormPage from './pages/Admin/ProductFormPage';
import UserDetailsPage from './pages/Admin/UserDetailsPage';
import SettingsPage from './pages/Admin/SettingsPage';
import ReviewsPage from './pages/Admin/ReviewsPage';
import BannersPage from './components/BannersPage';
import CategoriesPage from './components/CategoriesPage';
import ReturnsPage from './pages/Admin/ReturnsPage';
import ActivityPage from './pages/Admin/ActivityPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Logins */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<AdminLogin />} />
        <Route path="/blog-admin/login" element={<AdminLogin />} />

        {/* ✅ Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} /> 
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} /> 
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />                {/* Create */}
      <Route path="products/edit/:id" element={<ProductFormPage />} /> 
      <Route path="settings" element={<SettingsPage />} />
       <Route path="reviews" element={<ReviewsPage />} /> 
       <Route path="banners" element={<BannersPage />} />
       <Route path="categories" element={<CategoriesPage />} />
       <Route path="returns" element={<ReturnsPage />} />
       <Route path="activity" element={<ActivityPage />} />

          <Route
            path="super-admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ✅ Super Admin Dashboard (same layout) */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* ✅ Blog Admin Dashboard */}
        <Route
          path="/blog-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['blog_admin', 'super_admin']}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* ✅ Default */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;