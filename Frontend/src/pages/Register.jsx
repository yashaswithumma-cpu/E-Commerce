import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      navigate(data.role === 'seller' ? '/seller-dashboard' : '/');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex justify-center px-5 py-[60px]">
      <div className="w-full max-w-[400px] bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-slate-800 dark:text-white">Create Account</h2>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button type="submit"
            className="w-full min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] transition-all">
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
