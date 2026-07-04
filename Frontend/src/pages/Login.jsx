import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      navigate(data.role === 'seller' ? '/seller-dashboard' : '/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center px-5 py-[60px]">
      <div className="w-full max-w-[400px] bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-slate-800 dark:text-white">Login to ShopEZ</h2>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
          <button type="submit"
            className="w-full min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] transition-all">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-500">
          Don&apos;t have an account? <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
