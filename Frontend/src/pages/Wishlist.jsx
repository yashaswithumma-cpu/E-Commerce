import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const { user } = useAuth();
  const { wishlistItems, fetchWishlist, loading } = useWishlist();

  useEffect(() => {
    if (user) fetchWishlist(user.token);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 text-center py-20">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800 dark:text-white">Please Login</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base">Login to view your wishlist.</p>
        <Link to="/login" className="btn-primary !rounded-xl">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20 flex justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 dark:text-white">My Wishlist ({wishlistItems.length})</h2>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="btn-primary !rounded-xl">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
