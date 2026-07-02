import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

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

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <button onClick={() => navigate('/orders')} className="text-sm text-indigo-600 dark:text-indigo-400 mb-4 hover:underline">&larr; Back to Orders</button>
      {msg && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{msg}</p>}

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            {order.estimatedDelivery && <p className="text-sm text-green-600 font-medium">Est. Delivery: {order.estimatedDelivery}</p>}
          </div>
          <span className={`px-3 py-1.5 rounded text-sm font-semibold ${statusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {order.status !== 'cancelled' && (
          <div className="flex items-center gap-2 mb-6">
            {statusSteps.map((step, i) => {
              const currentIdx = statusSteps.indexOf(order.status);
              const done = i <= currentIdx;
              return (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-300'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs ${done ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-400 dark:text-slate-300'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={item.image || 'https://via.placeholder.com/60'} alt="" className="w-16 h-16 object-contain border rounded" />
                <div className="flex-1">
                  <Link to={`/products/${item.product}`} className="font-medium text-sm hover:text-indigo-600 dark:hover:text-indigo-400">{item.name}</Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">₹{item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm h-fit space-y-3">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Payment</span><span>{order.paymentMethod}</span></div>
          <div className="flex justify-between text-sm"><span>Status</span><span className={order.isPaid ? 'text-green-600' : 'text-amber-600'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></div>
          {order.couponCode && <div className="text-sm text-green-600">Coupon: {order.couponCode}</div>}

          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-1">Shipping To</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.address}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {(order.status === 'pending' || order.status === 'confirmed') && (
          <button onClick={() => setShowCancel(!showCancel)} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-500 hover:text-white">
            Cancel Order
          </button>
        )}
        {order.isDelivered && !order.returnRequest?.requested && (
          <button onClick={() => setShowReturn(!showReturn)} className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm hover:bg-orange-500 hover:text-white">
            Request Return
          </button>
        )}
      </div>

      {showCancel && (
        <div className="mt-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-red-200 dark:border-red-900/30">
          <h4 className="font-semibold mb-2">Cancel Order</h4>
          <textarea placeholder="Reason for cancellation (optional)" value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[60px] bg-white dark:bg-slate-800 dark:text-slate-100" />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Confirm Cancel</button>
            <button onClick={() => setShowCancel(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Close</button>
          </div>
        </div>
      )}

      {showReturn && (
        <div className="mt-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-orange-200 dark:border-orange-900/30">
          <h4 className="font-semibold mb-2">Request Return</h4>
          <textarea placeholder="Reason for return" value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[60px] bg-white dark:bg-slate-800 dark:text-slate-100" required />
          <div className="flex gap-2 mt-2">
            <button onClick={handleReturn} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">Submit Request</button>
            <button onClick={() => setShowReturn(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Close</button>
          </div>
        </div>
      )}

      {order.returnRequest?.requested && (
        <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm font-medium">Return Request: <span className="capitalize">{order.returnRequest.status}</span></p>
          {order.returnRequest.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reason: {order.returnRequest.reason}</p>}
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
