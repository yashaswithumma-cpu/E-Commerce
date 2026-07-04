import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import RecentlyViewed from '../components/RecentlyViewed';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORY_ICONS = {
  Electronics: '🖥️',
  Clothing: '👕',
  Footwear: '👟',
  'Home & Kitchen': '🏠',
  Books: '📚',
  Beauty: '💄',
  Sports: '⚽',
  Toys: '🧸',
  Bags: '🎒',
  Stationery: '✏️',
  Grocery: '🛒',
};

function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/products?limit=50`);
        const items = data.products || data;

        const dealsItems = items.filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 4);
        setDeals(dealsItems);
        setFeatured(items.slice(0, 8));

        const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (viewedIds.length > 0) {
          const viewed = items.filter((p) => viewedIds.includes(p._id));
          setRecentlyViewed(viewed.slice(0, 4));
        }

        const cats = [...new Set(items.map((p) => p.category))].filter(Boolean);
        setCategories(cats.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-brand-500 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-400 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-5 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-brand-300 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                New arrivals added daily
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                Smart Shopping,{' '}
                <span className="text-gradient-light">Best Deals</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
                Discover amazing products at unbeatable prices. From electronics to fashion, we've got everything you need.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-white !px-8 !py-3 !rounded-xl !text-base font-bold shadow-2xl shadow-brand-500/20">
                  Shop Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link to="/products?sort=rating" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 !px-8 !py-3 !rounded-xl !text-base font-semibold">
                  Top Rated
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Easy Returns
                </div>
              </div>
            </div>
            <div className="hidden md:block relative animate-fade-in">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-[40px] rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent rounded-[40px] -rotate-3" />
                <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 rounded-[40px] flex items-center justify-center p-8 shadow-2xl border border-slate-700/50">
                  <div className="text-center">
                    <div className="text-8xl mb-6 animate-float">🛍️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">ShopEZ Deals</h3>
                    <p className="text-slate-400">Up to 30% off on top brands</p>
                    <div className="mt-6 flex gap-3 justify-center">
                      <span className="bg-brand-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">HOT</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-lg text-sm font-semibold">NEW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 -mt-10 relative z-10 mb-6">
        <BannerCarousel />
      </section>

      <section className="max-w-[1200px] mx-auto px-5 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'Orders over ₹499' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% secure' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day policy' },
            { icon: '💬', title: '24/7 Support', desc: 'Dedicated team' },
          ].map((f, i) => (
            <div key={f.title} className="card !rounded-xl p-4 md:p-5 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of categories</p>
          </div>
          <Link to="/products" className="btn-outline !rounded-xl !text-xs !px-4 !py-2 hidden sm:inline-flex">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
              className="card !rounded-2xl p-5 text-center no-underline group hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{CATEGORY_ICONS[cat] || '📦'}</div>
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      {deals.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-12">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">🔥</span>
                  <h2 className="section-title !text-white">Hot Deals</h2>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">LIMITED TIME</span>
                </div>
                <p className="text-white/80">Grab these amazing discounts before they're gone!</p>
              </div>
              <Link to="/products?sort=price_asc" className="btn-white !rounded-xl !text-xs !px-4 !py-2 hidden sm:inline-flex">View All Deals</Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {deals.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked favorites just for you</p>
          </div>
          <Link to="/products" className="btn-primary !rounded-xl !text-xs !px-4 !py-2 hidden sm:inline-flex">View All</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
          {featured.map((product, i) => (
            <div key={product._id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-800/50 py-12">
          <div className="max-w-[1200px] mx-auto px-5">
            <h2 className="section-title mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
              {recentlyViewed.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <h2 className="section-title text-center mb-2">What Our Customers Say</h2>
        <p className="section-subtitle text-center mb-10">Trusted by thousands of happy shoppers</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Priya S.', role: 'Verified Buyer', text: 'Amazing quality products! The delivery was super fast and the customer service was excellent.', stars: 5 },
            { name: 'Rahul K.', role: 'Regular Customer', text: 'ShopEZ has the best deals on electronics. I saved over ₹2000 on my laptop purchase!', stars: 5 },
            { name: 'Ananya M.', role: 'Fashion Lover', text: 'The clothing collection is fantastic. Great quality fabrics and perfect fit. Highly recommended!', stars: 5 },
          ].map((t, i) => (
            <div key={i} className="card !rounded-2xl p-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex text-amber-400 mb-3">
                {[...Array(t.stars)].map((_, si) => <span key={si}>★</span>)}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 dark:bg-slate-950 py-12">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Products' },
              { value: '5K+', label: 'Happy Customers' },
              { value: '500+', label: 'Brands' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-600 to-brand-500 py-14">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to Start Shopping?</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">Join thousands of happy customers and discover amazing products at unbeatable prices.</p>
          <Link to="/products" className="btn-white !px-10 !py-3.5 !rounded-xl !text-base font-bold shadow-2xl">
            Explore Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
