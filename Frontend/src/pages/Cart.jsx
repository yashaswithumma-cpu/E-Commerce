import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 text-center py-16 sm:py-20">
        <div className="text-5xl sm:text-6xl mb-4">🛒</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base">Browse our products and add items you love!</p>
        <Link to="/products" className="btn-primary !rounded-xl">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shopping Cart ({cartItems.length} items)</h2>
      <div className="flex flex-col gap-3 sm:gap-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg shrink-0" />
              <div className="min-w-0 flex-1">
                <Link to={`/products/${item._id}`}
                  className="font-semibold text-sm sm:text-base block mb-0.5 text-slate-800 dark:text-slate-200 no-underline hover:text-brand-600 dark:hover:text-brand-400 truncate">
                  {item.name}
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-10 h-10 sm:w-11 sm:h-11 border border-slate-200 dark:border-slate-700 rounded-xl bg-none cursor-pointer text-base hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center active:scale-90 transition-all font-medium">−</button>
                <span className="w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-10 h-10 sm:w-11 sm:h-11 border border-slate-200 dark:border-slate-700 rounded-xl bg-none cursor-pointer text-base hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center active:scale-90 transition-all font-medium">+</button>
              </div>
              <div className="font-bold text-sm sm:text-base w-20 sm:w-24 text-right sm:order-last">₹{(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item._id)}
                className="bg-none border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-xs sm:text-sm font-medium hover:bg-red-500 hover:text-white transition-all active:scale-95 whitespace-nowrap min-h-[44px]">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm gap-4">
        <h3 className="text-xl sm:text-2xl font-bold">Total: ₹{cartTotal.toFixed(2)}</h3>
        <button onClick={handleCheckout}
          className="w-full sm:w-auto btn-primary !rounded-xl !px-8 !py-3 !text-sm sm:!text-base">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
