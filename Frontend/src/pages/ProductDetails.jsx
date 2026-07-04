import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API}/products/${id}`).then(({ data }) => setProduct(data));
    axios.get(`${API}/products/${id}/related`).then(({ data }) => setRelated(data));
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product._id, ...viewed.filter((v) => v !== product._id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      const cache = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '{}');
      cache[product._id] = { _id: product._id, name: product.name, image: product.image, price: product.price, discount: product.discount };
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(cache));
    }
  }, [product]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Review added!');
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data);
    } catch {
      setMessage('Failed to add review');
    }
  };

  if (!product) return (
    <div className="max-w-[1200px] mx-auto px-5 py-20 flex justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;
  const inWishlist = isInWishlist(product._id);

  const toggleWishlist = () => {
    if (!user) return navigate('/login');
    if (inWishlist) removeFromWishlist(product._id, user.token);
    else addToWishlist(product._id, user.token);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold bg-none border border-slate-200 dark:border-slate-700 mb-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-slate-600 dark:text-slate-400">
        &larr; Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-xl bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-[28px] font-bold text-slate-800 dark:text-white mb-1">{product.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                {product.brand && <><span className="font-medium text-slate-700 dark:text-slate-300">{product.brand}</span> · </>}
                <span className="capitalize">{product.category}</span>
              </p>
            </div>
            {user && (
              <button onClick={toggleWishlist} className="bg-none border-none text-2xl cursor-pointer p-1 shrink-0" title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                {inWishlist ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          {product.discount > 0 ? (
            <div className="mb-3">
              <span className="text-xl sm:text-2xl font-bold text-red-500 mr-2">₹{discountedPrice.toFixed(2)}</span>
              <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 line-through mr-2">₹{product.price.toFixed(2)}</span>
              <span className="bg-red-50 dark:bg-red-900/30 text-red-500 text-xs px-2 py-[2px] rounded font-semibold">{product.discount}% OFF</span>
            </div>
          ) : (
            <p className="text-xl sm:text-2xl font-bold text-brand-600 dark:text-brand-400 mb-3">₹{product.price.toFixed(2)}</p>
          )}

          <div className="text-amber-400 text-sm mb-3">
            {product.ratings > 0 ? (
              <>{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}
                <span className="text-slate-500 dark:text-slate-400 ml-1.5">({product.numReviews} reviews)</span></>
            ) : <span className="text-slate-500 dark:text-slate-400">No reviews yet</span>}
          </div>

          <p className={product.stock > 0 ? 'text-green-600 font-semibold my-3' : 'text-red-500 font-semibold my-3'}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 my-4 leading-relaxed text-sm sm:text-base">{product.description}</p>

          <div className="flex items-center gap-3 my-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity:</label>
            <input type="number" min="1" max={product.stock} value={quantity}
              onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.stock))}
              className="w-[70px] p-2 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-base text-center bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 my-4">
            <button onClick={() => { addToCart(product, quantity); navigate('/cart'); }}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60 active:scale-[0.98] transition-all"
              disabled={product.stock === 0}>Add to Cart</button>
            <button onClick={handleBuyNow}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 min-h-[48px] rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 active:scale-[0.98] transition-all"
              disabled={product.stock === 0}>Buy Now</button>
          </div>

          <p className="text-sm text-slate-400 mt-2">Estimated delivery: 5-7 business days</p>

          {user && (
            <form onSubmit={handleReview} className="mt-8 p-4 md:p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">Write a Review</h3>
              <select value={rating} onChange={(e) => setRating(e.target.value)}
                className="w-full p-2.5 min-h-[48px] mb-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>
                ))}
              </select>
              <textarea placeholder="Share your thoughts..." value={comment}
                onChange={(e) => setComment(e.target.value)} required
                className="w-full p-2.5 mb-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm min-h-[48px] resize-y bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500" />
              <button type="submit"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] transition-all">Submit Review</button>
              {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            </form>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Customer Reviews ({product.numReviews})</h3>
            {product.reviews.map((review, i) => (
              <div key={i} className="py-3 border-b border-slate-200 dark:border-b-slate-700">
                <strong className="block mb-1 text-slate-800 dark:text-slate-200">{review.name}</strong>
                <div className="text-amber-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-slate-800 dark:text-white">Related Products</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
