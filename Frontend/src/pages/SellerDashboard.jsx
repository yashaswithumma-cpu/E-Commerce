import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [tab, setTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [form, setForm] = useState({ name: '', description: '', price: '', discount: '0', category: '', brand: '', stock: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/products/my`, { headers: { Authorization: `Bearer ${user.token}` } }).then(({ data }) => setProducts(data));
    axios.get(`${API}/orders/seller`, { headers: { Authorization: `Bearer ${user.token}` } }).then(({ data }) => setOrders(data));
    axios.get(`${API}/orders/sales-report`, { headers: { Authorization: `Bearer ${user.token}` } }).then(({ data }) => setSalesReport(data)).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'seller') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, discount: Number(form.discount), price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        const { data } = await axios.put(`${API}/products/${editing}`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
        setProducts(products.map((p) => (p._id === editing ? data : p)));
      } else {
        const { data } = await axios.post(`${API}/products`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
        setProducts([...products, data]);
      }
      setForm({ name: '', description: '', price: '', discount: '0', category: '', brand: '', stock: '', image: '' });
      setEditing(null);
      setShowForm(false);
    } catch { alert('Failed to save product'); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, discount: p.discount || '0', category: p.category, brand: p.brand || '', stock: p.stock, image: p.image || '' });
    setEditing(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } }); setProducts(products.filter((p) => p._id !== id)); }
    catch { alert('Failed to delete'); }
  };

  const handleStatusChange = async (id, status) => {
    try { const { data } = await axios.put(`${API}/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${user.token}` } }); setOrders(orders.map((o) => o._id === id ? data : o)); }
    catch { alert('Failed to update status'); }
  };

  const handleDeliver = async (id) => {
    try { await axios.put(`${API}/orders/${id}/deliver`, {}, { headers: { Authorization: `Bearer ${user.token}` } }); setOrders(orders.map((o) => o._id === id ? { ...o, isDelivered: true, status: 'delivered' } : o)); }
    catch { alert('Failed to update'); }
  };

  const totalSales = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const deliveredOrders = orders.filter((o) => o.isDelivered);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter((o) => orderFilter === 'all' || o.status === orderFilter);

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      delivered: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return `px-2.5 py-1 rounded-lg text-xs font-semibold ${map[status] || map.pending}`;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">Seller Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', price: '', discount: '0', category: '', brand: '', stock: '', image: '' }); }} className="btn-primary !rounded-xl !text-sm !px-4 !py-2.5">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sales', value: `₹${totalSales.toFixed(2)}`, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Orders', value: orders.length, icon: '📦', color: 'from-brand-500 to-brand-600' },
          { label: 'Products', value: products.length, icon: '🏷️', color: 'from-blue-500 to-blue-600' },
          { label: 'Pending', value: pendingOrders.length, icon: '⏳', color: 'from-red-500 to-red-600' },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden card !p-5 !rounded-2xl">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-gradient-to-br ${s.color} opacity-10`} />
            <div className="relative">
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className="text-[28px] font-extrabold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {salesReport && salesReport.monthlySales?.length > 0 && (
        <div className="card !p-5 !rounded-2xl mb-8">
          <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Monthly Sales</h3>
          <div className="space-y-2">
            {salesReport.monthlySales.slice(-6).map((m) => {
              const max = Math.max(...salesReport.monthlySales.map((x) => x.sales), 1);
              const pct = (m.sales / max) * 100;
              return (
                <div key={m._id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-16 shrink-0">{m._id}</span>
                  <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-24 text-right">₹{m.sales.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {['products', 'orders'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all bg-none border-none cursor-pointer capitalize ${tab === t ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'products' && (
        <div>
          {showForm && (
            <div className="card !p-6 !rounded-2xl mb-6 border-l-4 border-l-brand-500 animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editing ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-none cursor-pointer text-sm">✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input type="text" placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <input type="number" placeholder="Price *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <input type="text" placeholder="Category *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <input type="number" placeholder="Stock *" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <input type="text" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <input type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  <div className="sm:col-span-2">
                    <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100 resize-y" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary !rounded-xl !text-sm !px-5 !py-2.5">{editing ? 'Update Product' : 'Add Product'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-none cursor-pointer transition-all">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <input type="text" placeholder="Search your products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none border-2 border-transparent focus:border-brand-500 dark:text-slate-100 transition-all" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 card !rounded-2xl">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-slate-500 dark:text-slate-400">No products found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((p) => {
                const discountedPrice = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
                return (
                  <div key={p._id} className="card !p-4 !rounded-2xl flex items-center gap-4 hover:shadow-md transition-all">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate">{p.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-brand-600 dark:text-brand-400">₹{discountedPrice.toFixed(2)}</span>
                        {p.discount > 0 && <span className="badge-deal !text-[10px]">{p.discount}% off</span>}
                        <span className={`text-xs ${p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                        <span className="text-xs text-slate-400">{p.category}{p.brand ? ` · ${p.brand}` : ''}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(p)} className="px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setOrderFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-none border-none cursor-pointer capitalize ${orderFilter === s ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{s}</button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 card !rounded-2xl">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500 dark:text-slate-400">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((o) => (
                <div key={o._id} className="card !p-5 !rounded-2xl">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Link to={`/orders/${o._id}`} className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-lg">#{o._id.slice(-8).toUpperCase()}</Link>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                    <span className={statusBadge(o.status)}>{o.status}</span>
                    <span className={`text-xs font-semibold ${o.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white ml-auto">₹{o.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span><strong>Customer:</strong> {o.user?.name || 'N/A'}</span>
                    <span><strong>Items:</strong> {o.items?.length || 0}</span>
                    {o.couponCode && <span><strong>Coupon:</strong> {o.couponCode}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {o.status === 'pending' && <button onClick={() => handleStatusChange(o._id, 'confirmed')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold border-none cursor-pointer transition-all">Confirm Order</button>}
                    {o.status === 'confirmed' && <button onClick={() => handleStatusChange(o._id, 'shipped')} className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold border-none cursor-pointer transition-all">Mark Shipped</button>}
                    {o.status === 'shipped' && <button onClick={() => handleDeliver(o._id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold border-none cursor-pointer transition-all">Mark Delivered</button>}
                    {o.status !== 'cancelled' && o.status !== 'delivered' && (
                      <button onClick={() => handleStatusChange(o._id, 'cancelled')} className="px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold bg-none cursor-pointer transition-all">Cancel</button>
                    )}
                    {o.returnRequest?.requested && o.returnRequest.status === 'pending' && (
                      <>
                        <button onClick={() => axios.put(`${API}/orders/${o._id}/return-handle`, { action: 'approve' }, { headers: { Authorization: `Bearer ${user.token}` } }).then(() => window.location.reload())}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold border-none cursor-pointer transition-all">Approve Return</button>
                        <button onClick={() => axios.put(`${API}/orders/${o._id}/return-handle`, { action: 'reject' }, { headers: { Authorization: `Bearer ${user.token}` } }).then(() => window.location.reload())}
                          className="px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold bg-none cursor-pointer transition-all">Reject Return</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
