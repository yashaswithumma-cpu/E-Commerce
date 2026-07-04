import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCoupons = () => {
    if (user?.role === 'admin') axios.get(`${API}/coupons`, { headers: { Authorization: `Bearer ${user.token}` } }).then(({ data }) => setCoupons(data));
  };
  useEffect(() => { fetchCoupons(); }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), minOrderValue: Number(form.minOrderValue), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit) };
      if (editing) await axios.put(`${API}/coupons/${editing}`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
      else await axios.post(`${API}/coupons`, payload, { headers: { Authorization: `Bearer ${user.token}` } });
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '' });
      setEditing(null); setMsg('Coupon saved'); fetchCoupons();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await axios.delete(`${API}/coupons/${id}`, { headers: { Authorization: `Bearer ${user.token}` } }); fetchCoupons(); }
    catch { alert('Failed'); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Coupons</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage discount coupons</p>

      {msg && <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm mb-4">{msg}</div>}

      <div className="card !p-6 !rounded-2xl mb-6 max-w-lg">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100 uppercase" />
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
            <input type="number" placeholder="Value *" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
            <input type="number" placeholder="Min Order" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
            <input type="number" placeholder="Max Discount" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
            <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
          </div>
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required min={today}
            className="w-full p-3 mt-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn-primary !rounded-xl !text-sm !px-5 !py-2.5">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '0', usageLimit: '100', expiresAt: '' }); }}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-none cursor-pointer transition-all">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card !rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Code</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Discount</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Min Order</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Used</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Expires</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {coupons.map((c) => {
                const isExpired = !c.isActive || new Date(c.expiresAt) <= new Date();
                return (
                  <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="p-4 font-bold text-slate-800 dark:text-white">{c.code}</td>
                    <td className="p-4 text-slate-800 dark:text-white">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">₹{c.minOrderValue}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{c.usedCount}/{c.usageLimit}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(c.expiresAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${isExpired ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(c._id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
