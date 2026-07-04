import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/products?limit=100`).then(({ data }) => {
      setProducts(data.products || data);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setProducts(products.filter((p) => p._id !== id));
    } catch { alert('Failed to delete'); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{products.length} total products</p>
        </div>
        <div className="relative max-w-xs w-full">
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-brand-500 rounded-xl text-sm outline-none dark:text-slate-100 transition-all" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 dark:text-slate-400">No products found</p>
        </div>
      ) : (
        <div className="card !rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Product</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Seller</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Price</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Stock</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Category</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-700" />
                        <span className="font-medium text-slate-800 dark:text-white truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{p.seller?.name || 'N/A'}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-white">
                      ₹{p.discount ? (p.price - (p.price * p.discount) / 100).toFixed(2) : p.price.toFixed(2)}
                      {p.discount > 0 && <span className="ml-1.5 text-xs text-red-500">-{p.discount}%</span>}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${p.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{p.category}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(p._id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
