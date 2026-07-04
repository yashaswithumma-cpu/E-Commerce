import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (inWishlist) removeFromWishlist(product._id, user.token);
    else addToWishlist(product._id, user.token);
  };

  return (
    <div className="group card !rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 relative">
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg shadow-red-500/30">
            {product.discount}% OFF
          </span>
        </div>
      )}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col gap-2">
        {user && (
          <button onClick={toggleWishlist}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-lg hover:scale-110 transition-all shadow-sm active:scale-90"
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
            {inWishlist ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          {!imgLoaded && (
            <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img src={product.image} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-[180px] sm:h-[200px] md:h-[220px] object-contain p-3 sm:p-4 md:p-5 group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`} />
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider font-medium truncate">{product.brand || product.category}</p>
        <Link to={`/products/${product._id}`}
          className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 no-underline block mb-1.5 sm:mb-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors leading-tight line-clamp-2">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-amber-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
          {product.ratings > 0 ? (
            <>{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}<span className="text-slate-400 dark:text-slate-500 ml-1">({product.numReviews})</span></>
          ) : <span className="text-slate-400 dark:text-slate-500">New</span>}
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className={`font-bold ${product.discount > 0 ? 'text-base sm:text-lg text-red-500 dark:text-red-400' : 'text-lg sm:text-xl text-brand-600 dark:text-brand-400'}`}>
            ₹{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">₹{product.price.toFixed(2)}</span>}
        </div>
        <button onClick={() => addToCart(product)}
          className="inline-flex items-center justify-center w-full gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30 min-h-[44px] sm:min-h-0"
          disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : (
            <><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>Add to Cart</>
          )}
        </button>
        {product.stock > 0 && product.stock < 5 && (
          <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-1.5 sm:mt-2 text-center font-medium">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
