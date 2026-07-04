import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    axios.get(`${API}/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setOrder(data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleCancel = async () => {
    try {
      const { data } = await axios.put(`${API}/orders/${id}/cancel`, { reason: cancelReason }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrder(data);
      setShowCancel(false);
      setMsg('Order cancelled');
    } catch (err) { alert(err.response?.data?.message || 'Failed to cancel'); }
  };

  const handleReturn = async () => {
    try {
      const { data } = await axios.put(`${API}/orders/${id}/return`, { reason: returnReason }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrder(data);
      setShowReturn(false);
      setMsg('Return requested');
    } catch (err) { alert(err.response?.data?.message || 'Failed to request return'); }
  };

  const statusColor = (s) => {
    const map = { pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400', confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400', cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
    return map[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  };

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];

  if (loading) return <div className="text-center py-20 flex justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <button onClick={() => navigate('/orders')} className="text-sm text-brand-600 dark:text-brand-400 mb-4 hover:underline bg-none border-none cursor-pointer">&larr; Back to Orders</button>
      {msg && <p className="text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-4 text-sm">{msg}</p>}

      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Order #{order._id.slice(-8).toUpperCase()}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            {order.estimatedDelivery && <p className="text-sm text-green-600 font-medium">Est. Delivery: {order.estimatedDelivery}</p>}
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${statusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {order.status !== 'cancelled' && (
          <div className="flex items-center gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2">
            {statusSteps.map((step, i) => {
              const currentIdx = statusSteps.indexOf(order.status);
              const done = i <= currentIdx;
              return (
                <div key={step} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${done ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-300'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs whitespace-nowrap ${done ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-slate-400 dark:text-slate-300'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 min-w-[12px] sm:min-w-[20px] ${i < currentIdx ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4">
                <img src={item.image || 'https://via.placeholder.com/60'} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-contain border rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product}`} className="font-medium text-sm hover:text-brand-600 dark:hover:text-brand-400 text-slate-800 dark:text-slate-200 truncate block">{item.name}</Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">₹{item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm h-fit space-y-3">
          <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Order Summary</h3>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-base sm:text-lg border-t border-slate-200 dark:border-slate-700 pt-3 text-slate-800 dark:text-white"><span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Payment</span><span>{order.paymentMethod}</span></div>
          <div className="flex justify-between text-sm"><span>Status</span><span className={order.isPaid ? 'text-green-600' : 'text-amber-600'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></div>
          {order.couponCode && <div className="text-sm text-green-600">Coupon: {order.couponCode}</div>}

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <h4 className="text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Shipping To</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.address}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {(order.status === 'pending' || order.status === 'confirmed') && (
          <button onClick={() => setShowCancel(!showCancel)} className="px-4 py-2 min-h-[44px] border border-red-500 text-red-500 rounded-xl text-sm hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]">
            Cancel Order
          </button>
        )}
        {order.isDelivered && !order.returnRequest?.requested && (
          <button onClick={() => setShowReturn(!showReturn)} className="px-4 py-2 min-h-[44px] border border-orange-500 text-orange-500 rounded-xl text-sm hover:bg-orange-500 hover:text-white transition-all active:scale-[0.98]">
            Request Return
          </button>
        )}
      </div>

      {showCancel && (
        <div className="mt-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-900/30">
          <h4 className="font-semibold mb-2 text-slate-800 dark:text-white">Cancel Order</h4>
          <textarea placeholder="Reason for cancellation (optional)" value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)} className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500" />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCancel} className="px-4 py-2 min-h-[44px] bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-all">Confirm Cancel</button>
            <button onClick={() => setShowCancel(false)} className="px-4 py-2 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Close</button>
          </div>
        </div>
      )}

      {showReturn && (
        <div className="mt-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-orange-200 dark:border-orange-900/30">
          <h4 className="font-semibold mb-2 text-slate-800 dark:text-white">Request Return</h4>
          <textarea placeholder="Reason for return" value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)} className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500" required />
          <div className="flex gap-2 mt-2">
            <button onClick={handleReturn} className="px-4 py-2 min-h-[44px] bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-all">Submit Request</button>
            <button onClick={() => setShowReturn(false)} className="px-4 py-2 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Close</button>
          </div>
        </div>
      )}

      {order.returnRequest?.requested && (
        <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-900/30">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Return Request: <span className="capitalize">{order.returnRequest.status}</span></p>
          {order.returnRequest.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reason: {order.returnRequest.reason}</p>}
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
