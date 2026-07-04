import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const finalTotal = appliedCoupon ? Math.max(0, cartTotal - appliedCoupon.discount) : cartTotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg('');
    try {
      const { data } = await axios.post(`${API}/coupons/validate`, {
        code: couponCode, orderValue: cartTotal,
      });
      if (data.valid) {
        setAppliedCoupon(data);
        setCouponMsg(`Coupon applied! You save ₹${data.discount.toFixed(2)}`);
      }
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { navigate('/cart'); return; }
    setLoading(true);
    try {
      const items = cartItems.map((i) => ({
        product: i._id, name: i.name, quantity: i.quantity,
        price: i.price, image: i.image || '',
      }));
      const { data } = await axios.post(`${API}/orders`, {
        items,
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.coupon || '',
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      clearCart();
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed. Please try again.');
    }
    setLoading(false);
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 dark:text-white">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-10">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white">Shipping Address</h3>
          <input type="text" placeholder="Street Address" value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })} required
              className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
            <input type="text" placeholder="Postal Code" value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required
              className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          </div>
          <input type="text" placeholder="Country" value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />

          <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white pt-4">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <input type="radio" name="payment" value="Stripe" checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Credit/Debit Card (Stripe)</span>
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60 active:scale-[0.98] transition-all">
            {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-white">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3 mb-3 text-sm">
                <img src={item.image} alt={item.name} className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg shrink-0 hidden sm:block" />
                <span className="truncate flex-1 text-slate-600 dark:text-slate-400">{item.name} x{item.quantity}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            {appliedCoupon && <div className="flex justify-between text-sm text-green-600 dark:text-green-400"><span>Discount ({appliedCoupon.coupon})</span><span>-₹{appliedCoupon.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base sm:text-lg border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 text-slate-800 dark:text-white">
              <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Coupon Code</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="Enter coupon code" value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm uppercase bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
              <button type="button" onClick={handleApplyCoupon}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-all active:scale-[0.98]">Apply</button>
            </div>
            {couponMsg && <p className={`text-sm mt-2 ${appliedCoupon ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{couponMsg}</p>}
            {appliedCoupon && <button onClick={() => { setAppliedCoupon(null); setCouponMsg(''); setCouponCode(''); }}
              className="text-xs text-red-500 dark:text-red-400 mt-1 hover:underline bg-none border-none cursor-pointer">Remove coupon</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
