import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/auth`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleRoleChange = async (userId, role) => {
    try { await axios.put(`${API}/auth/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${user.token}` } }); setUsers(users.map((u) => u._id === userId ? { ...u, role } : u)); }
    catch { alert('Failed to update role'); }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try { await axios.delete(`${API}/auth/${userId}`, { headers: { Authorization: `Bearer ${user.token}` } }); setUsers(users.filter((u) => u._id !== userId)); }
    catch { alert('Failed to delete user'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', seller: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', buyer: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' };
    return `px-2.5 py-1 rounded-lg text-xs font-semibold ${map[role] || map.buyer}`;
  };

  if (loading) return <div className="text-center py-16"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} total users</p>
        </div>
        <div className="relative max-w-xs w-full">
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-brand-500 rounded-xl text-sm outline-none dark:text-slate-100 transition-all" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-slate-500 dark:text-slate-400">No users found</p>
        </div>
      ) : (
        <div className="card !rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">User</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Email</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Role</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Joined</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={roleBadge(u.role)}>{u.role}</span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none dark:text-slate-100">
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={() => handleDelete(u._id)} disabled={u._id === user._id}
                          className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg bg-none border-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed">Delete</button>
                      </div>
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

export default AdminUsers;
