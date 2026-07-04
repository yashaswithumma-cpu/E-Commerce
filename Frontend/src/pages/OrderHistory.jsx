import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="max-w-[1200px] mx-auto px-5 text-center py-20">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800 dark:text-white">Please Login</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base">Login to view your orders.</p>
      <Link to="/login" className="btn-primary !rounded-xl">Login</Link>
    </div>
  );

  const statusColor = (s) => {
    const map = { pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400', confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400', cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
    return map[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  };

  if (loading) return <div className="text-center py-20 flex justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 dark:text-white">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 mb-4">No orders yet.</p>
          <Link to="/products" className="btn-primary !rounded-xl">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all no-underline text-slate-800 dark:text-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">₹{order.totalPrice.toFixed(2)}</p>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {order.items.slice(0, 4).map((item, i) => (
                  <img key={i} src={item.image || 'https://via.placeholder.com/60'} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain border rounded-lg" />
                ))}
                {order.items.length > 4 && <span className="text-sm text-slate-400 self-center">+{order.items.length - 4}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
