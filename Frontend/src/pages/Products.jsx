import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRICE_RANGES = [
  { label: 'Under ₹500', min: '', max: '500' },
  { label: '₹500 - ₹1,000', min: '500', max: '1000' },
  { label: '₹1,000 - ₹5,000', min: '1000', max: '5000' },
  { label: '₹5,000 - ₹10,000', min: '5000', max: '10000' },
  { label: 'Over ₹10,000', min: '10000', max: '' },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const debounceRef = useRef();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const onSale = searchParams.get('onSale') || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    axios.get(`${API}/products/categories`).then(({ data }) => setCategories(data));
    axios.get(`${API}/products/brands`).then(({ data }) => setBrands(data));
  }, []);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products?${searchParams}`)
      .then(({ data }) => {
        setProducts(data.products || data);
        if (data.pages) setPagination({ page: data.page, pages: data.pages, total: data.total });
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateSearchParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') next.delete('page');
      return next;
    }, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSearchInput('');
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearchParam('search', value);
    }, 400);
  };

  const setPage = (p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [category, brand, minPrice, maxPrice, search, onSale].filter(Boolean).length;

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 bg-none border-none cursor-pointer py-1">
          {title}
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && <div className="mt-3">{children}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">Products</h1>
          {!loading && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{pagination.total} product{pagination.total !== 1 ? 's' : ''} found</p>}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden btn-outline !px-3 !py-2 !rounded-xl !text-xs relative">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" /></svg>
          Filters
          {activeFilterCount > 0 && <span className="ml-1 bg-brand-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${filtersOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} md:block md:w-[260px] shrink-0`}>
          <div className={`${filtersOpen ? 'w-[280px] bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-xl p-6 animate-slide-right' : ''} md:w-auto md:bg-transparent md:p-0 md:shadow-none md:overflow-visible`}>
            {filtersOpen && (
              <div className="flex items-center justify-between mb-4 md:hidden">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-none cursor-pointer">✕</button>
              </div>
            )}
            <div className="md:sticky md:top-20">
              <div className="hidden md:flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-brand-600 dark:text-brand-400 hover:underline bg-none border-none cursor-pointer font-medium">Clear all</button>
                )}
              </div>

              <div className="relative mb-4">
                <input type="text" placeholder="Search products..." value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { clearTimeout(debounceRef.current); updateSearchParam('search', searchInput); } }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-brand-500 rounded-xl text-sm outline-none dark:text-slate-100 transition-all" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <FilterSection title="Category">
                <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto">
                  <button onClick={() => updateSearchParam('category', '')}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all bg-none border-none cursor-pointer ${!category ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>All Categories</button>
                  {categories.map((c) => (
                    <button key={c} onClick={() => updateSearchParam('category', c)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all bg-none border-none cursor-pointer ${category === c ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{c}</button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="flex flex-col gap-1.5">
                  {PRICE_RANGES.map((r) => (
                    <button key={r.label} onClick={() => { updateSearchParam('minPrice', r.min); updateSearchParam('maxPrice', r.max); }}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all bg-none border-none cursor-pointer ${minPrice === r.min && maxPrice === r.max ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{r.label}</button>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input type="number" placeholder="Min" value={minPrice}
                      onChange={(e) => updateSearchParam('minPrice', e.target.value)}
                      className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-slate-100" />
                    <span className="text-slate-400 self-center">-</span>
                    <input type="number" placeholder="Max" value={maxPrice}
                      onChange={(e) => updateSearchParam('maxPrice', e.target.value)}
                      className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-slate-100" />
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Brand">
                <select value={brand} onChange={(e) => updateSearchParam('brand', e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-slate-100">
                  <option value="">All Brands</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Deals">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${onSale === 'true' ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <input type="checkbox" checked={onSale === 'true'}
                      onChange={(e) => updateSearchParam('onSale', e.target.checked ? 'true' : '')}
                      className="sr-only" />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${onSale === 'true' ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">On Sale Only</span>
                </label>
              </FilterSection>

              <FilterSection title="Sort By">
                <select value={sort} onChange={(e) => updateSearchParam('sort', e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-slate-100">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </FilterSection>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="md:hidden w-full btn-outline !rounded-xl !text-sm !py-2.5 mt-4">Clear All Filters</button>
              )}
            </div>
          </div>
          {filtersOpen && <div className="flex-1 bg-black/30 md:hidden" onClick={() => setFiltersOpen(false)} />}
        </aside>

        <div className="hidden xl:block w-[220px] shrink-0">
          <RecentlyViewed />
        </div>

        <div className="flex-1 min-w-0">
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-medium">
                  "{search}"
                  <button onClick={() => { updateSearchParam('search', ''); setSearchInput(''); }} className="bg-none border-none cursor-pointer text-brand-600 hover:text-brand-800">&times;</button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-medium">
                  {category}
                  <button onClick={() => updateSearchParam('category', '')} className="bg-none border-none cursor-pointer text-brand-600 hover:text-brand-800">&times;</button>
                </span>
              )}
              {brand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-medium">
                  {brand}
                  <button onClick={() => updateSearchParam('brand', '')} className="bg-none border-none cursor-pointer text-brand-600 hover:text-brand-800">&times;</button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-medium">
                  {minPrice ? `₹${minPrice}` : '₹0'} - {maxPrice ? `₹${maxPrice}` : '∞'}
                  <button onClick={() => { updateSearchParam('minPrice', ''); updateSearchParam('maxPrice', ''); }} className="bg-none border-none cursor-pointer text-brand-600 hover:text-brand-800">&times;</button>
                </span>
              )}
              {onSale === 'true' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                  On Sale
                  <button onClick={() => updateSearchParam('onSale', '')} className="bg-none border-none cursor-pointer text-red-600 hover:text-red-800">&times;</button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-none border-none cursor-pointer underline ml-1">Clear all</button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className="card !rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-[220px] bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filter criteria</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                    let p;
                    if (pagination.pages <= 7) {
                      p = i + 1;
                    } else if (page <= 4) {
                      p = i + 1;
                    } else if (page >= pagination.pages - 3) {
                      p = pagination.pages - 6 + i;
                    } else {
                      p = page - 3 + i;
                    }
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all bg-none border-none cursor-pointer ${page === p ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>
                    );
                  })}
                  <button onClick={() => setPage(page + 1)} disabled={page >= pagination.pages}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
