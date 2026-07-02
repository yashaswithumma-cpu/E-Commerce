import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

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
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Shipping Address</h3>
          <input type="text" placeholder="Street Address" value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })} required
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-slate-100" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })} required
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-slate-100" />
            <input type="text" placeholder="Postal Code" value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-slate-100" />
          </div>
          <input type="text" placeholder="Country" value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })} required
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-slate-100" />

          <h3 className="font-semibold text-lg pt-4">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="text-sm font-medium">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
              <input type="radio" name="payment" value="Stripe" checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="text-sm font-medium">Credit/Debit Card (Stripe)</span>
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full p-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 active:scale-[0.98]">
            {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2 text-sm">
                <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-3" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            {appliedCoupon && <div className="flex justify-between text-sm text-green-600 dark:text-green-400"><span>Discount ({appliedCoupon.coupon})</span><span>-₹{appliedCoupon.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Coupon Code</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter coupon code" value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm uppercase bg-white dark:bg-slate-800 dark:text-slate-100" />
              <button type="button" onClick={handleApplyCoupon}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Apply</button>
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
