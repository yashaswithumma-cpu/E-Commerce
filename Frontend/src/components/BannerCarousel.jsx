import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const BANNERS = [
  { id: 1, bg: 'from-violet-600 via-purple-600 to-indigo-600', icon: '🎉', title: 'Mega Summer Sale', subtitle: 'Up to 40% off on top brands', cta: 'Shop Sale', link: '/products?onSale=true' },
  { id: 2, bg: 'from-emerald-500 via-teal-500 to-cyan-600', icon: '🚚', title: 'Free Shipping', subtitle: 'On all orders over ₹499', cta: 'Start Shopping', link: '/products' },
  { id: 3, bg: 'from-rose-500 via-pink-500 to-orange-500', icon: '🔥', title: 'New Arrivals', subtitle: 'Check out the latest products', cta: 'Explore Now', link: '/products?sort=newest' },
  { id: 4, bg: 'from-amber-500 via-yellow-500 to-orange-500', icon: '🏷️', title: 'WELCOME10 Coupon', subtitle: 'Get 10% off your first order', cta: 'Get Discount', link: '/products' },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((i) => setCurrent((i + BANNERS.length) % BANNERS.length), []);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [isPaused, next]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setIsPaused(true); };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setIsPaused(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none"
      onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((b) => (
          <div key={b.id} className="min-w-full">
            <div className={`bg-gradient-to-br ${b.bg} p-5 sm:p-6 md:p-8`}>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <span className="text-3xl sm:text-4xl md:text-5xl shrink-0">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white mb-0.5 sm:mb-1">{b.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/80 mb-2 sm:mb-3">{b.subtitle}</p>
                  <Link to={b.link}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold no-underline backdrop-blur-sm transition-all active:scale-95">
                    {b.cta}
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prev} aria-label="Previous banner"
        className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-sm shadow-lg hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-90">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} aria-label="Next banner"
        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-sm shadow-lg hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-90">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-1.5">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to banner ${i + 1}`}
            className={`rounded-full border-none cursor-pointer transition-all p-1.5 sm:p-0 ${i === current ? 'bg-white w-6 sm:w-6 h-2' : 'bg-white/50 hover:bg-white/70 w-2 sm:w-2 h-2'}`} />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;
