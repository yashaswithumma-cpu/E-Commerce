import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-[80px] bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">ShopEZ</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              Your one-stop destination for smart online shopping. Discover amazing deals across thousands of products with fast, reliable delivery.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg cursor-pointer hover:bg-brand-600 transition-all">📘</span>
              <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg cursor-pointer hover:bg-brand-600 transition-all">📷</span>
              <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg cursor-pointer hover:bg-brand-600 transition-all">🐦</span>
              <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg cursor-pointer hover:bg-brand-600 transition-all">💼</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Shop</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/products" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">All Products</Link>
              <Link to="/products?category=Electronics" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Electronics</Link>
              <Link to="/products?category=Clothing" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Clothing</Link>
              <Link to="/products?category=Home+%26+Kitchen" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Home & Kitchen</Link>
              <Link to="/products?category=Books" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Books</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/contact" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Contact Us</Link>
              <Link to="/faq" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">FAQ</Link>
              <Link to="/about" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">About Us</Link>
              <span className="text-sm text-slate-400">Track Order</span>
              <span className="text-sm text-slate-400">Returns</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Account</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/profile" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">My Profile</Link>
              <Link to="/orders" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Order History</Link>
              <Link to="/wishlist" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Wishlist</Link>
              <Link to="/cart" className="text-sm text-slate-400 hover:text-brand-400 no-underline transition-all">Cart</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-slate-500 flex-wrap">
            <span className="hover:text-slate-300 cursor-pointer transition-all">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-all">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer transition-all">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
