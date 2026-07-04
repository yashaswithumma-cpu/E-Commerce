import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function VisualSearch() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef();
  const [cameraMode, setCameraMode] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products/categories`).then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.value);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileSelect = (e) => processFile(e.target.files[0]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraMode(true);
    } catch { alert('Camera access denied or not available'); }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera_photo.jpg', { type: 'image/jpeg' });
      processFile(file);
      stopCamera();
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraMode(false);
  };

  const handleSearch = async () => {
    if (!image) return;
    setLoading(true);
    setSearched(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const uploadRes = await axios.post(`${API}/upload`, formData);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (description) params.set('search', description);
      if (!description && !category) params.set('sort', 'rating');
      params.set('limit', '20');
      const { data } = await axios.get(`${API}/products?${params}`);
      setResults(data.products || data);
    } catch {
      const { data } = await axios.get(`${API}/products?limit=12&sort=rating`);
      setResults(data.products || data);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setImage(null);
    setPreview(null);
    setResults([]);
    setSearched(false);
    setCategory('');
    setDescription('');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">Visual Search</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload or take a photo to find similar products</p>
      </div>

      {cameraMode && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-lg mx-5">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={capturePhoto} className="btn-primary !px-8 !py-3 !rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Capture
              </button>
              <button onClick={stopCamera} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold border-none cursor-pointer transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {!searched ? (
        <div className="max-w-xl mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 md:p-12 text-center cursor-pointer transition-all touch-manipulation ${
              dragOver ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            } ${preview ? '!border-solid' : ''}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Preview" className="max-h-[250px] sm:max-h-[300px] rounded-xl mx-auto shadow-lg" />
                <button onClick={(e) => { e.stopPropagation(); resetSearch(); }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer shadow-lg hover:bg-red-600 transition-all text-sm">✕</button>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1 text-sm sm:text-base">Drop an image here or click to browse</p>
                <p className="text-xs text-slate-400">Supports JPG, PNG, GIF, WEBP (max 5MB)</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => fileInputRef.current?.click()}
              className="btn-outline !rounded-xl !text-xs sm:!text-sm !px-3 sm:!px-4 !py-2.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload from Gallery
            </button>
            <button onClick={openCamera}
              className="btn-outline !rounded-xl !text-xs sm:!text-sm !px-3 sm:!px-4 !py-2.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Take Photo
            </button>
          </div>

          {preview && (
            <div className="card !p-4 md:!p-6 !rounded-2xl mt-6 animate-slide-up">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-sm sm:text-base">Refine Your Search</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 block">Category (optional)</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 min-h-[48px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100">
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 block">Description (optional)</label>
                  <input type="text" placeholder="e.g. blue dress, wireless headphones..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-3 min-h-[48px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 dark:text-slate-100" />
                </div>
                <button onClick={handleSearch} disabled={loading}
                  className="btn-primary !w-full !py-3 !rounded-xl !text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Find Similar Products
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            {preview && <img src={preview} alt="Search" className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl shadow-sm" />}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Search Results</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
            </div>
            <button onClick={resetSearch} className="btn-outline !rounded-xl !text-xs !px-3 sm:!px-4 !py-2 min-h-[44px]">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              New Search
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6">
              {[1,2,3,4,5,6].map((s) => (
                <div key={s} className="card !rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-[160px] sm:h-[200px] bg-slate-200 dark:bg-slate-700" />
                  <div className="p-3 sm:p-4 space-y-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" /><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" /><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" /></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 card !rounded-2xl">
              <div className="text-5xl sm:text-6xl mb-4">🔍</div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">No similar products found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Try a different image or refine your search</p>
              <button onClick={resetSearch} className="btn-primary">Try Again</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6">
                {results.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
              <div className="text-center mt-8">
                <Link to="/products" className="btn-outline !rounded-xl !text-xs sm:!text-sm !px-4 sm:!px-6 !py-2.5">Browse All Products</Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VisualSearch;
