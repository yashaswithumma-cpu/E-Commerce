import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      await axios.post(`${API}/contact`, form);
      setMsg('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-white">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800 dark:text-white">Get in Touch</h2>
          {msg && <p className="text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-4 text-sm">{msg}</p>}
          {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full p-3 min-h-[48px] bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 transition-all" />
            <input type="email" placeholder="Your Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full p-3 min-h-[48px] bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 transition-all" />
            <input type="text" placeholder="Subject" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })} required
              className="w-full p-3 min-h-[48px] bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 transition-all" />
            <textarea placeholder="Your Message" value={form.message} rows="5"
              onChange={(e) => setForm({ ...form, message: e.target.value })} required
              className="w-full p-3 min-h-[48px] border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-y bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 transition-all" />
            <button type="submit" disabled={loading}
              className="w-full min-h-[48px] rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60 active:scale-[0.98] transition-all">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800 dark:text-white">Contact Information</h2>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div><strong className="block text-slate-800 dark:text-slate-200">Email</strong>support@shopez.com</div>
              <div><strong className="block text-slate-800 dark:text-slate-200">Phone</strong>+1 (555) 123-4567</div>
              <div><strong className="block text-slate-800 dark:text-slate-200">Address</strong>123 ShopEZ Street, New York, NY 10001</div>
              <div><strong className="block text-slate-800 dark:text-slate-200">Hours</strong>Mon - Fri: 9:00 AM - 6:00 PM</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800 dark:text-white">FAQ</h2>
            <div className="space-y-3 text-sm">
              {[
                { q: 'How do I track my order?', a: 'Go to Order History in your profile to track all your orders.' },
                { q: 'What is your return policy?', a: 'You can request a return within 7 days of delivery.' },
                { q: 'How do I apply a coupon?', a: 'Enter your coupon code at checkout before placing the order.' },
              ].map((faq, i) => (
                <details key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <summary className="font-medium cursor-pointer text-slate-800 dark:text-slate-200">{faq.q}</summary>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
