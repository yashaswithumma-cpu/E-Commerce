import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
  pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  delivered: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/orders/all`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o._id.slice(-8).toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="text-center py-16"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{orders.length} orders · ₹{totalRevenue.toFixed(2)} total revenue</p>
        </div>
        <div className="relative max-w-xs w-full">
          <input type="text" placeholder="Search by ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-brand-500 rounded-xl text-sm outline-none dark:text-slate-100 transition-all" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all bg-none border-none cursor-pointer ${filter === s ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{s} {s === 'all' ? `(${orders.length})` : `(${orders.filter((o) => o.status === s).length})`}</button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-500 dark:text-slate-400">No orders found</p>
        </div>
      ) : (
        <div className="card !rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Order</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Customer</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Total</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Payment</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-lg">#{o._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-white">{o.user?.name || 'N/A'}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-white">₹{o.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${o.isPaid ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {o.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}>{o.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link to={`/orders/${o._id}`}
                        className="inline-flex px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all no-underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
