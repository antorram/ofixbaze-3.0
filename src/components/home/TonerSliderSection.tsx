import React, { useRef, useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, Currency, ActivePage } from '../../types';
import { ProductCard } from '../ProductCard';

interface TonerSliderSectionProps {
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  setActivePage?: (page: ActivePage) => void;
  onSelectCategory?: (slug: string) => void;
}

export const TonerSliderSection: React.FC<TonerSliderSectionProps> = ({
  products,
  currency,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  setActivePage,
  onSelectCategory
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Live countdown timer for the deals section
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 59, seconds: 36 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter toners and ink consumables
  const tonerProducts = products.filter(p => 
    p.category === 'toners-cartridges' ||
    p.subCategory?.toLowerCase().includes('toner') ||
    p.name.toLowerCase().includes('toner') ||
    p.name.toLowerCase().includes('laserjet') ||
    p.name.toLowerCase().includes('cartridge')
  );

  // Check scroll positions
  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const currentRef = sliderRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [tonerProducts]);

  // Auto-slide functionality (pauses when hovered)
  useEffect(() => {
    if (isHovered || !sliderRef.current || tonerProducts.length === 0) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const scrollStep = 310; // width of card + gap

      // If reached the end, smoothly loop back to start
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, tonerProducts.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = 320; // approximate width of card + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" aria-label="Original Toner Deals Slider">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-2xl p-6 sm:p-8 bg-white text-slate-900 shadow-sm border border-slate-200/90 transition-all"
      >
        
        {/* Header with Countdown & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/60 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              LIMITED CORPORATE TONER DEALS
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Hot Genuine HP Toner Deals of the Week
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Special bulk discount pricing on original HP LaserJet cartridges, drums and consumables with verified security holograms.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center shrink-0">
            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Ends in:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 min-w-[38px] text-center text-slate-900 shadow-xs">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </div>
                <span className="text-slate-400">:</span>
                <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 min-w-[38px] text-center text-slate-900 shadow-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </div>
                <span className="text-slate-400">:</span>
                <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 min-w-[38px] text-center text-orange-600 shadow-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous toners"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-300 shadow-xs'
                    : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next toners"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-300 shadow-xs'
                    : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Carousel Track with Auto-Slide */}
        <div className="relative mt-6">
          <div
            ref={sliderRef}
            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tonerProducts.map((product) => (
              <div
                key={product.id}
                className="w-[270px] sm:w-[290px] md:w-[310px] shrink-0 snap-start flex flex-col"
              >
                <div className="h-full">
                  <ProductCard
                    product={product}
                    currency={currency}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onQuickView={onQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Left subtle fade gradient */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent" />
          )}
          {/* Right subtle fade gradient */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent" />
          )}
        </div>

        {/* Footer info & View All Link */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All HP toners include tamper-proof holographic seals &amp; full manufacturer warranty.</span>
          </div>

          {setActivePage && onSelectCategory && (
            <button
              onClick={() => {
                onSelectCategory('toners-cartridges');
                setActivePage('shop');
              }}
              className="inline-flex items-center gap-1.5 font-bold text-orange-600 hover:text-orange-700 transition cursor-pointer"
            >
              <span>View All HP Toner Models ({tonerProducts.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
