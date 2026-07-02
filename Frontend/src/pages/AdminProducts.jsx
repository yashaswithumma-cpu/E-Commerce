import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://ecommerce-backend-0ir6.onrender.com/api';

function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    axios.get(`${API}/products`).then(({ data }) => {
      setProducts(data.products || data);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <div className="text-center py-20">Loading...</div>;

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch { alert('Failed to delete'); }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Product Management ({products.length})</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Product</th>
              <th className="text-left p-3 font-medium">Seller</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Stock</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.image} alt="" className="w-10 h-10 object-contain" />
                  <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{p.seller?.name || 'N/A'}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3"><span className={p.stock > 0 ? 'text-green-600' : 'text-red-600'}>{p.stock}</span></td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{p.category}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
