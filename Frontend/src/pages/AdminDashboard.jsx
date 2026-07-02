import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setData(data)).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (!data) return <div className="text-center py-20">Loading...</div>;

  const stats = [
    { label: 'Total Users', value: data.totalUsers, link: '/admin/users', color: 'text-blue-600' },
    { label: 'Total Sellers', value: data.totalSellers, link: '/admin/users', color: 'text-purple-600' },
    { label: 'Total Products', value: data.totalProducts, link: '/admin/products', color: 'text-green-600' },
    { label: 'Total Orders', value: data.totalOrders, link: '/admin/orders', color: 'text-orange-600' },
    { label: 'Revenue', value: `₹${data.totalRevenue.toFixed(2)}`, link: '#', color: 'text-indigo-600' },
    { label: 'Pending Orders', value: data.pendingOrders, link: '/admin/orders', color: 'text-red-600' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.link} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm text-center no-underline text-slate-800 dark:text-slate-200 hover:shadow-md">
            <h3 className={`text-[28px] font-bold ${s.color}`}>{s.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', to: '/admin/users' },
              { label: 'Manage Products', to: '/admin/products' },
              { label: 'Manage Categories', to: '/admin/categories' },
              { label: 'Manage Coupons', to: '/admin/coupons' },
              { label: 'All Orders', to: '/admin/orders' },
              { label: 'Contact Messages', to: '/admin/contact' },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-center hover:bg-slate-50 dark:hover:bg-slate-700 no-underline text-slate-700 dark:text-slate-300">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Monthly Revenue</h2>
          {data.monthlyRevenue?.length > 0 ? (
            <div className="space-y-2">
              {data.monthlyRevenue.slice(-6).map((m) => (
                <div key={m._id} className="flex justify-between text-sm">
                  <span>{m._id}</span>
                  <span className="font-medium">₹{m.revenue.toFixed(2)} ({m.orders} orders)</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400">No data yet</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
