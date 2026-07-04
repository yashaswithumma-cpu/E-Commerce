import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCategories = () => { axios.get(`${API}/categories`).then(({ data }) => setCategories(data)); };
  useEffect(() => { if (user?.role === 'admin') fetchCategories(); }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      if (editing) { await axios.put(`${API}/categories/${editing}`, form, { headers: { Authorization: `Bearer ${user.token}` } }); }
      else { await axios.post(`${API}/categories`, form, { headers: { Authorization: `Bearer ${user.token}` } }); }
      setForm({ name: '', description: '', image: '' }); setEditing(null); setMsg('Category saved'); fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Categories</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage product categories</p>

      {msg && <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm mb-4">{msg}</div>}

      <div className="card !p-6 !rounded-2xl mb-6 max-w-lg">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">{editing ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Category Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full p-3 mb-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
          <input type="text" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 mb-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary !rounded-xl !text-sm !px-5 !py-2.5">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', image: '' }); }}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-none cursor-pointer transition-all">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card !rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Name</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Description</th>
                <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <td className="p-4 font-medium text-slate-800 dark:text-white">{c.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{c.description || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditing(c._id); setForm({ name: c.name, description: c.description, image: c.image }); }}
                        className="px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Edit</button>
                      <button onClick={async () => { if (!confirm('Delete this category?')) return; try { await axios.delete(`${API}/categories/${c._id}`, { headers: { Authorization: `Bearer ${user.token}` } }); fetchCategories(); } catch {} }}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg bg-none border-none cursor-pointer transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
