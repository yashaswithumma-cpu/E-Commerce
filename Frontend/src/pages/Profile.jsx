import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    axios.get(`${API}/auth/profile`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => {
      setForm({
        name: data.name || '', email: data.email || '', phone: data.phone || '', password: '',
        address: data.address || { street: '', city: '', state: '', zip: '', country: '' },
      });
    }).catch(() => logout());
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await axios.put(`${API}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMsg('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 dark:text-white">My Profile</h2>
      {msg && <p className="text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-4 text-sm">{msg}</p>}
      {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Phone</label>
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">New Password (leave blank to keep current)</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
        </div>
        <fieldset className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <legend className="text-sm font-medium px-2 text-slate-700 dark:text-slate-300">Address</legend>
          <div className="space-y-3">
            <input type="text" placeholder="Street" value={form.address.street}
              onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
              className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="City" value={form.address.city}
                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
              <input type="text" placeholder="State" value={form.address.state}
                onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
              <input type="text" placeholder="ZIP Code" value={form.address.zip}
                onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })}
                className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
              <input type="text" placeholder="Country" value={form.address.country}
                onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                className="w-full p-2.5 min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
            </div>
          </div>
        </fieldset>
        <button type="submit" className="w-full min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] transition-all">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
