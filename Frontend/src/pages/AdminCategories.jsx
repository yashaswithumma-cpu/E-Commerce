import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCategories = () => {
    axios.get(`${API}/categories`).then(({ data }) => setCategories(data));
  };

  useEffect(() => { if (user?.role === 'admin') fetchCategories(); }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      if (editing) {
        await axios.put(`${API}/categories/${editing}`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axios.post(`${API}/categories`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setForm({ name: '', description: '', image: '' });
      setEditing(null);
      setMsg(editing ? 'Category updated' : 'Category created');
      fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description, image: cat.image });
    setEditing(cat._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      {msg && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{msg}</p>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6 max-w-lg">
        <h3 className="font-semibold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h3>
        <input type="text" placeholder="Category Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        <input type="text" placeholder="Description (optional)" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        <input type="text" placeholder="Image URL (optional)" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full p-2.5 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', image: '' }); }}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Cancel</button>}
        </div>
      </form>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b">
            <tr><th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">Description</th><th className="text-left p-3 font-medium">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{c.description || '-'}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-xs font-medium">Edit</button>
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

export default AdminCategories;
