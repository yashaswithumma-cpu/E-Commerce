import { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: '📊', exact: true },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Products', path: '/admin/products', icon: '🏷️' },
  { label: 'Categories', path: '/admin/categories', icon: '📂' },
  { label: 'Orders', path: '/admin/orders', icon: '📦' },
  { label: 'Coupons', path: '/admin/coupons', icon: '🎫' },
  { label: 'Messages', path: '/admin/contact', icon: '💬' },
];

function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(({ data }) => setData(data)).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'Total Users', value: data.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600', link: '/admin/users' },
    { label: 'Total Sellers', value: data.totalSellers, icon: '🛒', color: 'from-purple-500 to-purple-600', link: '/admin/users' },
    { label: 'Products', value: data.totalProducts, icon: '🏷️', color: 'from-emerald-500 to-emerald-600', link: '/admin/products' },
    { label: 'Orders', value: data.totalOrders, icon: '📦', color: 'from-brand-500 to-brand-600', link: '/admin/orders' },
    { label: 'Revenue', value: `₹${data.totalRevenue.toFixed(2)}`, icon: '💰', color: 'from-cyan-500 to-cyan-600', link: '/admin/orders' },
    { label: 'Pending', value: data.pendingOrders, icon: '⏳', color: 'from-red-500 to-red-600', link: '/admin/orders' },
  ];

  const sidebar = (
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
        return (
          <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${active ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your store</p>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden btn-outline !px-3 !py-2 !rounded-xl !text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:block lg:w-52 shrink-0`}>
          <div className={`${sidebarOpen ? 'w-60 bg-white dark:bg-slate-900 h-full p-5 shadow-xl' : ''} lg:bg-transparent lg:p-0 lg:shadow-none lg:sticky lg:top-20`}>
            {sidebarOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold">Navigation</h3>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-none cursor-pointer">✕</button>
              </div>
            )}
            {sidebar}
          </div>
          {sidebarOpen && <div className="flex-1 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-8">
            {stats.map((s) => (
              <Link key={s.label} to={s.link} className="relative overflow-hidden card !p-5 !rounded-2xl no-underline hover:shadow-md transition-all group">
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-5 -mt-5 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <span className="text-xl mb-2 block">{s.icon}</span>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card !p-6 !rounded-2xl">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Product', to: '/admin/products', icon: '➕' },
                  { label: 'Create Coupon', to: '/admin/coupons', icon: '🎫' },
                  { label: 'Add Category', to: '/admin/categories', icon: '📂' },
                  { label: 'View Orders', to: '/admin/orders', icon: '📦' },
                ].map((a) => (
                  <Link key={a.label} to={a.to}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 no-underline transition-all">
                    <span className="text-xl">{a.icon}</span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="card !p-6 !rounded-2xl">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Monthly Revenue</h2>
              {data.monthlyRevenue?.length > 0 ? (
                <div className="space-y-2.5">
                  {data.monthlyRevenue.slice(-6).map((m, i) => {
                    const max = Math.max(...data.monthlyRevenue.map((x) => x.revenue), 1);
                    const pct = (m.revenue / max) * 100;
                    return (
                      <div key={m._id} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-14 shrink-0">{m._id}</span>
                        <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, #f59e0b, #d97706)` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-28 text-right">₹{m.revenue.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">No revenue data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
