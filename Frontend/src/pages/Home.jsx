import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products`).then(({ data }) => {
      const items = data.products || data;
      setFeatured(items.slice(0, 4));

      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (viewedIds.length > 0) {
        const viewed = items.filter((p) => viewedIds.includes(p._id));
        setRecentlyViewed(viewed.slice(0, 4));
      }

      if (items.length >= 4) {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 4));
      }
    });
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white text-center px-5 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Welcome to ShopEZ</h1>
        <p className="text-lg mb-6 opacity-90">Your one-stop destination for effortless online shopping.</p>
        <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-semibold bg-white text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 no-underline transition">Shop Now</Link>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 py-[60px]">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Shop With Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🔒', title: 'Secure Checkout', desc: 'Safe and encrypted payment processing for peace of mind.' },
            { icon: '⚡', title: 'Instant Confirmation', desc: 'Receive immediate order confirmation after purchase.' },
            { icon: '📊', title: 'Seller Dashboard', desc: 'Robust analytics and order management for sellers.' },
            { icon: '🏷️', title: 'Best Deals', desc: 'Exclusive discounts and offers on top products.' },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 pb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {featured.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 pb-12">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {recentlyViewed.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 pb-12">
          <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {recommended.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
