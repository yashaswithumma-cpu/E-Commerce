import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const desktopProfileRef = useRef();
  const mobileProfileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (desktopProfileRef.current && !desktopProfileRef.current.contains(e.target)) &&
        (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target))
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const navLinks = (
    <>
      <Link to="/products" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Products</Link>
      <Link to="/wishlist" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Wishlist</Link>
      <Link to="/cart" className="relative text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">
        Cart
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[11px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>
      {user ? (
        <>
          <Link to="/orders" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Orders</Link>
          {user.role === 'seller' && (
            <Link to="/seller-dashboard" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-amber-600 no-underline hover:text-amber-800">Admin</Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
          <Link to="/register" className="text-sm font-medium text-slate-800 dark:text-slate-200 no-underline hover:text-indigo-600 dark:hover:text-indigo-400">Register</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm px-5">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[60px]">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 no-underline">ShopEZ</Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks}
          {user && (
            <div ref={desktopProfileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center cursor-pointer border-2 border-indigo-600 hover:border-indigo-400 transition-colors">
                {initial}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">My Profile</Link>
                  <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Order History</Link>
                  <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Wishlist</Link>
                  {user.role === 'seller' && (
                    <Link to="/seller-dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Admin Panel</Link>
                  )}
                  <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 bg-none border-none cursor-pointer">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer text-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user && (
            <div ref={mobileProfileRef} className="md:hidden relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center cursor-pointer border-2 border-indigo-600">
                {initial}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">My Profile</Link>
                  <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Order History</Link>
                  <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Wishlist</Link>
                  {user.role === 'seller' && (
                    <Link to="/seller-dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 no-underline">Admin Panel</Link>
                  )}
                  <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 bg-none border-none cursor-pointer">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-none border-none text-xl cursor-pointer p-2 dark:text-slate-200">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-700 pt-3">
          {navLinks}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
