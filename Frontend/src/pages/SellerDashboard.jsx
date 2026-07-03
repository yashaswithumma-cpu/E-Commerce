import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState({
    name: '', description: '', price: '', discount: '0',
    category: '', brand: '', stock: '', image: '',
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/products/my`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setProducts(data));

    axios.get(`${API}/orders/seller`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setOrders(data));

    axios.get(`${API}/orders/sales-report`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setSalesReport(data)).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'seller') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, discount: Number(form.discount), price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        const { data } = await axios.put(`${API}/products/${editing}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(products.map((p) => (p._id === editing ? data : p)));
      } else {
        const { data } = await axios.post(`${API}/products`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts([...products, data]);
      }
      setForm({ name: '', description: '', price: '', discount: '0', category: '', brand: '', stock: '', image: '' });
      setEditing(null);
    } catch { alert('Failed to save product'); }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price, discount: p.discount || '0',
      category: p.category, brand: p.brand || '', stock: p.stock, image: p.image || '',
    });
    setEditing(p._id);
    setTab('products');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch { alert('Failed to delete'); }
  };

  const handleDeliver = async (id) => {
    try {
      await axios.put(`${API}/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.map((o) => o._id === id ? { ...o, isDelivered: true, deliveredAt: Date.now(), status: 'delivered' } : o));
    } catch { alert('Failed to update'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await axios.put(`${API}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.map((o) => o._id === id ? data : o));
    } catch { alert('Failed to update status'); }
  };

  const totalSales = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const deliveredOrders = orders.filter((o) => o.isDelivered);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-[28px] font-bold text-indigo-600 dark:text-indigo-400">₹{totalSales.toFixed(2)}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Sales</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-[28px] font-bold text-indigo-600 dark:text-indigo-400">{orders.length}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Orders</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-[28px] font-bold text-indigo-600 dark:text-indigo-400">{products.length}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Products</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-[28px] font-bold text-indigo-600 dark:text-indigo-400">{deliveredOrders.length}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Delivered</p>
        </div>
      </div>

      {salesReport && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm mb-6">
          <h3 className="font-semibold mb-3">Sales Report</h3>
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div><span className="text-slate-500 dark:text-slate-400">Avg Order Value:</span> <strong>₹{salesReport.avgOrderValue?.toFixed(2) || '0.00'}</strong></div>
          </div>
          {salesReport.monthlySales?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Monthly Sales</p>
              <div className="space-y-1 text-sm">
                {salesReport.monthlySales.map((m) => (
                  <div key={m._id} className="flex justify-between">
                    <span>{m._id}</span>
                    <span className="font-medium">₹{m.sales.toFixed(2)} ({m.count} orders)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex mb-6">
        <button className={`px-6 py-3 border border-slate-200 dark:border-slate-700 text-sm font-medium cursor-pointer rounded-l-lg ${tab === 'products' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
          onClick={() => setTab('products')}>My Products</button>
        <button className={`px-6 py-3 border border-slate-200 dark:border-slate-700 border-l-0 text-sm font-medium cursor-pointer rounded-r-lg ${tab === 'orders' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
          onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <div>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h3>
            <input type="text" placeholder="Product Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
            <textarea placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} required
              className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[80px] resize-y" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="number" placeholder="Price" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
              <input type="number" placeholder="Discount %" value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
              <input type="text" placeholder="Category" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} required
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
              <input type="text" placeholder="Brand" value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
              <input type="number" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} required
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
              <input type="text" placeholder="Image URL" value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98]">
                {editing ? 'Update Product' : 'Add Product'}
              </button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', discount: '0', category: '', brand: '', stock: '', image: '' }); }}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Cancel</button>}
            </div>
          </form>

          <div className="mt-6">
            <h3 className="font-semibold mb-4">Your Products ({products.length})</h3>
            {products.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-center py-8">No products yet. Add your first product above!</p>
            ) : (
              <div className="space-y-2">
                {products.map((p) => (
                  <div key={p._id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 px-4 rounded-lg shadow-sm">
                    <img src={p.image} alt={p.name} className="w-[50px] h-[50px] object-contain rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{p.name}</h4>
                      <p className="text-[13px] text-slate-500 dark:text-slate-400">₹{p.price} | Stock: {p.stock} | {p.category}{p.brand ? ` | ${p.brand}` : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:underline bg-none border-none cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 dark:text-red-400 text-xs font-medium hover:underline bg-none border-none cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h3 className="font-semibold mb-4">All Orders ({orders.length})</h3>
          {orders.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <div className="flex flex-wrap gap-4 items-center text-sm mb-3">
                    <Link to={`/orders/${o._id}`} className="font-mono text-xs text-indigo-600 dark:text-indigo-400 hover:underline">#{o._id.slice(-8).toUpperCase()}</Link>
                    <span><strong>Customer:</strong> {o.user?.name || 'N/A'}</span>
                    <span><strong>Total:</strong> ₹{o.totalPrice.toFixed(2)}</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${o.isPaid ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'}`}>
                      {o.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${
      o.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
      o.status === 'shipped' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
      o.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
      o.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                    }`}>{o.status}</span>
                  </div>
                  <div className="flex gap-2">
                    {o.status === 'pending' && (
                      <button onClick={() => handleStatusChange(o._id, 'confirmed')}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600">Confirm Order</button>
                    )}
                    {o.status === 'confirmed' && (
                      <button onClick={() => handleStatusChange(o._id, 'shipped')}
                        className="px-3 py-1.5 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600">Mark Shipped</button>
                    )}
                    {o.status === 'shipped' && (
                      <button onClick={() => handleDeliver(o._id)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600">Mark Delivered</button>
                    )}
                    {o.status !== 'cancelled' && o.status !== 'delivered' && (
                      <button onClick={() => handleStatusChange(o._id, 'cancelled')}
                        className="px-3 py-1.5 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded text-xs font-medium hover:bg-red-500 hover:text-white">Cancel</button>
                    )}
                    {o.returnRequest?.requested && o.returnRequest.status === 'pending' && (
                      <>
                        <button onClick={() => axios.put(`${API}/orders/${o._id}/return-handle`, { action: 'approve' }, { headers: { Authorization: `Bearer ${user.token}` } }).then(() => window.location.reload())}
                          className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium">Approve Return</button>
                        <button onClick={() => axios.put(`${API}/orders/${o._id}/return-handle`, { action: 'reject' }, { headers: { Authorization: `Bearer ${user.token}` } }).then(() => window.location.reload())}
                          className="px-3 py-1.5 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded text-xs font-medium">Reject Return</button>
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
