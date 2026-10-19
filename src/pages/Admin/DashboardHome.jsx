

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
  BiUser, BiShoppingBag, BiBox, BiRupee, BiErrorCircle,
} from 'react-icons/bi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line,   // ✅ ADD
} from 'recharts';
import Topbar from '../../components/Topbar';
import StatsCard from '../../components/StatsCard';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
    orderStatus: [],
    userGrowth: [],   // ✅ ADD
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, chartsRes, lowStockRes, topProductsRes] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/orders'),
          apiClient.get('/admin/stats/charts'),
          apiClient.get('/admin/products/low-stock?threshold=10'),
          apiClient.get('/admin/stats/top-products?limit=5'),
        ]);

        setStats(statsRes.data.stats);
        setOrders(ordersRes.data.orders.slice(0, 5));
        setChartData({
          monthlyRevenue: chartsRes.data.monthlyRevenue || [],
          orderStatus: chartsRes.data.orderStatus || [],
          userGrowth: chartsRes.data.userGrowth || [],   // ✅ ADD
        });
        setLowStock(lowStockRes.data.products || []);
        setTopProducts(topProductsRes.data.topProducts || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Topbar title="Dashboard" />
        <div className="p-6 text-center text-stone-500">Loading stats...</div>
      </div>
    );
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyData = chartData.monthlyRevenue.map((item) => ({
    month: monthNames[item._id - 1],
    revenue: item.revenue,
    orders: item.orders,
  }));

  const statusData = chartData.orderStatus.map((item) => ({
    name: item._id || 'Processing',
    value: item.count,
  }));

  const STATUS_COLORS = {
    Processing: '#f59e0b',
    Shipped: '#3b82f6',
    Delivered: '#10b981',
    Cancelled: '#ef4444',
    Returned: '#8b5cf6',
  };

  const COLORS = statusData.map((s) => STATUS_COLORS[s.name] || '#8c0a15');

  return (
    <div>
      <Topbar title="Dashboard Overview" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Users" value={stats?.totalUsers} icon={<BiUser />} color="#3b82f6" />
          <StatsCard title="Total Orders" value={stats?.totalOrders} icon={<BiShoppingBag />} color="#10b981" />
          <StatsCard title="Total Products" value={stats?.totalProducts} icon={<BiBox />} color="#f59e0b" />
          <StatsCard title="Revenue" value={stats?.totalRevenue} icon={<BiRupee />} color="#8c0a15" prefix="₹" />
        </div>

        {/* Low Stock Alert Widget */}
        {lowStock.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-red-600 flex items-center gap-2">
                <BiErrorCircle /> Low Stock Alert ({lowStock.length})
              </h2>
              <button
                onClick={() => navigate('/admin/products')}
                className="text-xs font-bold text-[#8c0a15] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStock.slice(0, 6).map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                  className="flex items-center gap-3 p-3 border border-red-100 bg-red-50/30 rounded-lg cursor-pointer hover:bg-red-50 transition"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded border border-stone-200"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#4a2e18] line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {product.category?.name || ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock}
                    </p>
                    <p className="text-[10px] text-stone-500">left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Products Chart */}
        {topProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              🏆 Top Selling Products
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" xAxisId="qty" tick={{ fontSize: 12 }} />
                <XAxis type="number" xAxisId="revenue" orientation="top" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={180}
                  tickFormatter={(value) =>
                    value?.length > 25 ? value.substring(0, 25) + '...' : value
                  }
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Revenue') {
                      return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                    }
                    return [value, 'Qty Sold'];
                  }}
                />
                <Legend />
                <Bar dataKey="totalQty" fill="#8c0a15" name="Qty Sold" xAxisId="qty" radius={[0, 4, 4, 0]} />
                <Bar dataKey="totalRevenue" fill="#f59e0b" name="Revenue" xAxisId="revenue" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ✅ User Growth Chart */}
        {chartData.userGrowth.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              📈 User Growth (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [value, 'New Users']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8c0a15"
                  strokeWidth={3}
                  name="New Users"
                  dot={{ r: 5, fill: '#8c0a15' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Charts Row — Monthly Revenue + Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Monthly Revenue (Last 6 Months)
            </h2>
            {monthlyData.length === 0 ? (
              <p className="text-stone-500 text-sm">No data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value
                    }
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8c0a15" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" fill="#f59e0b" name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
              Order Status
            </h2>
            {statusData.length === 0 ? (
              <p className="text-stone-500 text-sm">No data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-serif font-bold text-[#4a2e18] mb-4">
            Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-stone-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id} className="border-b hover:bg-stone-50">
                      <td className="px-4 py-2 font-mono text-xs">
                        {ord._id?.slice(-8)}
                      </td>
                      <td className="px-4 py-2">{ord.user?.name || 'N/A'}</td>
                      <td className="px-4 py-2 font-bold text-[#8c0a15]">
                        ₹{ord.totalPrice}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            ord.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : ord.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : ord.status === 'Returned'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status || 'Processing'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-stone-500">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;