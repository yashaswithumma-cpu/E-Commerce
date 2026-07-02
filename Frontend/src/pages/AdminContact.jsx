import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminContact() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/contact`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setMessages(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <div className="text-center py-20">Loading...</div>;

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(messages.map((m) => m._id === id ? { ...m, isRead: true } : m));
    } catch {}
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Contact Messages ({messages.length})</h2>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m._id} className={`bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border-l-4 ${m.isRead ? 'border-slate-300' : 'border-indigo-500'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.email} &middot; {new Date(m.createdAt).toLocaleString()}</p>
              </div>
              {!m.isRead && (
                <button onClick={() => markAsRead(m._id)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Mark as Read</button>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{m.subject}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-slate-400 text-center py-10">No messages yet.</p>}
      </div>
    </div>
  );
}

export default AdminContact;
