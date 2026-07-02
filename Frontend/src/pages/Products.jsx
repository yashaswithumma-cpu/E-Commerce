import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', brand: '', minPrice: '', maxPrice: '', search: '', sort: 'newest' });
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef();

  useEffect(() => {
    axios.get(`${API}/products/categories`).then(({ data }) => setCategories(data));
    axios.get(`${API}/products/brands`).then(({ data }) => setBrands(data));
  }, []);

  const handleSearch = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 400);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    axios.get(`${API}/products?${params}`).then(({ data }) => {
      setProducts(data.products || data);
    }).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row max-w-[1200px] mx-auto px-5 py-10 gap-8">
      <aside className="w-full md:w-[240px] shrink-0">
        <h3 className="font-semibold mb-4">Filters</h3>
        <div className="relative mb-3">
          <input type="text" placeholder="Search products..." value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { clearTimeout(debounceRef.current); setFilters((prev) => ({ ...prev, search: searchInput })); } }}
            className="w-full p-2.5 pr-10 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
          <button onClick={() => { clearTimeout(debounceRef.current); setFilters((prev) => ({ ...prev, search: searchInput })); }} className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs px-2 py-1.5 rounded-md hover:bg-indigo-700 border-none cursor-pointer">Go</button>
        </div>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <div className="flex gap-2 mb-3">
          <input type="number" placeholder="Min ₹" value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-1/2 p-2.5 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
          <input type="number" placeholder="Max ₹" value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-1/2 p-2.5 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        </div>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </aside>

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
