import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/auth`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`${API}/auth/${userId}/role`, { role }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.map((u) => u._id === userId ? { ...u, role } : u));
    } catch { alert('Failed to update role'); }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/auth/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch { alert('Failed to delete user'); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">User Management ({users.length})</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Joined</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                <td className="p-3">
                  <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="p-1.5 bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded text-xs">
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 text-xs font-medium"
                    disabled={u._id === user._id}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
