import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (viewedIds.length > 0) {
      const cached = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '{}');
      const items = viewedIds.map((id) => cached[id]).filter(Boolean);
      setProducts(items.slice(0, 6));
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="card !p-5 !rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Recently Viewed</h3>
      </div>
      <div className="space-y-3">
        {products.map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} className="flex items-center gap-3 no-underline group">
            <img src={p.image} alt={p.name} className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-700 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{p.name}</p>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                ₹{(p.discount ? p.price - (p.price * p.discount) / 100 : p.price).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
