import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/orders/all`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <div className="text-center py-20">Loading...</div>;

  const statusColor = (s) => {
    const map = { pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
    return map[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">All Orders ({orders.length})</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b">
            <tr><th className="text-left p-3 font-medium">Order ID</th><th className="text-left p-3 font-medium">Customer</th><th className="text-left p-3 font-medium">Total</th><th className="text-left p-3 font-medium">Payment</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Date</th><th className="text-left p-3 font-medium">Action</th></tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3 font-mono text-xs">{o._id.slice(-8).toUpperCase()}</td>
                <td className="p-3">{o.user?.name || 'N/A'}</td>
                <td className="p-3 font-medium">₹{o.totalPrice.toFixed(2)}</td>
                <td className="p-3"><span className={o.isPaid ? 'text-green-600' : 'text-amber-600 dark:text-amber-400'}>{o.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                <td className="p-3"><span className={`px-2.5 py-1 rounded text-xs font-semibold ${statusColor(o.status)}`}>{o.status}</span></td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Link to={`/orders/${o._id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-xs font-medium">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
