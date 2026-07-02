import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '',
  });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCoupons = () => {
    if (user?.role === 'admin') {
      axios.get(`${API}/coupons`, { headers: { Authorization: `Bearer ${user.token}` } })
        .then(({ data }) => setCoupons(data));
    }
  };

  useEffect(() => { fetchCoupons(); }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), minOrderValue: Number(form.minOrderValue), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit) };
      if (editing) {
        await axios.put(`${API}/coupons/${editing}`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
      } else {
        await axios.post(`${API}/coupons`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
      }
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '' });
      setEditing(null);
      setMsg(editing ? 'Coupon updated' : 'Coupon created');
      fetchCoupons();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`${API}/coupons/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchCoupons();
    } catch { alert('Failed'); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Coupon Management</h2>
      {msg && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{msg}</p>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6 max-w-lg">
        <h3 className="font-semibold mb-4">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Coupon Code" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} required
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm uppercase" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed ($)</option>
          </select>
          <input type="number" placeholder="Discount Value" value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
          <input type="number" placeholder="Min Order Value" value={form.minOrderValue}
            onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
          <input type="number" placeholder="Max Discount" value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
          <input type="number" placeholder="Usage Limit" value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        </div>
        <input type="date" placeholder="Expiry Date" value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required min={today}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '' }); }}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Cancel</button>}
        </div>
      </form>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b">
            <tr><th className="text-left p-3 font-medium">Code</th><th className="text-left p-3 font-medium">Discount</th><th className="text-left p-3 font-medium">Min Order</th><th className="text-left p-3 font-medium">Used</th><th className="text-left p-3 font-medium">Expires</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3 font-medium">{c.code}</td>
                <td className="p-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="p-3">₹{c.minOrderValue}</td>
                <td className="p-3">{c.usedCount}/{c.usageLimit}</td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${c.isActive && new Date(c.expiresAt) > new Date() ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{c.isActive && new Date(c.expiresAt) > new Date() ? 'Active' : 'Expired'}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCoupons;
