import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminContact() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/contact`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(({ data }) => setMessages(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const markAsRead = async (id) => {
    try { await axios.put(`${API}/contact/${id}/read`, {}, { headers: { Authorization: `Bearer ${user.token}` } }); setMessages(messages.map((m) => m._id === id ? { ...m, isRead: true } : m)); }
    catch {}
  };

  if (loading) return <div className="text-center py-16"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{messages.length} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">{unreadCount} unread</span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 card !rounded-2xl">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-slate-500 dark:text-slate-400">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m._id} className={`card !p-5 !rounded-2xl transition-all ${!m.isRead ? 'border-l-4 border-l-brand-500 bg-brand-50/30 dark:bg-brand-900/10' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${!m.isRead ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{m.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.email} · {new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {!m.isRead && (
                  <button onClick={() => markAsRead(m._id)}
                    className="px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg bg-none border-none cursor-pointer transition-all whitespace-nowrap">Mark Read</button>
                )}
              </div>
              <div className="ml-13">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{m.subject}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{m.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContact;
