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
      <div className="max-w-[1200px] mx-auto px-5 text-center py-20">
        <h2 className="text-2xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Browse our products and add items you love!</p>
        <Link to="/products" className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 no-underline active:scale-[0.98]">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length} items)</h2>
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded shrink-0" />
              <div className="min-w-0 flex-1">
                <Link to={`/products/${item._id}`} className="font-semibold block mb-1 text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400 truncate">{item.name}</Link>
                <p className="text-slate-500 dark:text-slate-400 text-sm">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 border border-slate-200 dark:border-slate-700 rounded bg-none cursor-pointer text-base hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center">-</button>
                <span className="w-[30px] text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 border border-slate-200 dark:border-slate-700 rounded bg-none cursor-pointer text-base hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center">+</button>
              </div>
              <div className="font-bold text-base w-24 text-right">₹{(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item._id)}
                className="bg-none border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-lg px-3 py-1.5 cursor-pointer text-sm hover:bg-red-500 hover:text-white whitespace-nowrap">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm gap-4">
        <h3 className="text-2xl font-bold">Total: ₹{cartTotal.toFixed(2)}</h3>
        <button onClick={handleCheckout}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
