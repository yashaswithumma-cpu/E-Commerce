import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(data.products || []);
    } catch { setWishlistItems([]); }
    setLoading(false);
  };

  const addToWishlist = async (productId, token) => {
    try {
      const { data } = await axios.post(`${API}/wishlist`, { productId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(data.products || []);
      return true;
    } catch { return false; }
  };

  const removeFromWishlist = async (productId, token) => {
    try {
      const { data } = await axios.delete(`${API}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(data.products || []);
      return true;
    } catch { return false; }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems, loading, fetchWishlist,
      addToWishlist, removeFromWishlist, isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
