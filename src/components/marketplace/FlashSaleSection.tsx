import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap } from 'lucide-react';
import { Product, Currency, ActivePage } from '../../types';
import { MarketplaceProductCard } from '../MarketplaceProductCard';

interface FlashSaleSectionProps {
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  setActivePage: (page: ActivePage) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  currency,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  setActivePage,
}) => {
  // Live Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 24, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter real products with discounts or hot deals
  const flashSaleProducts = products
    .filter((p) => p.isHotDeal || (p.originalPriceNGN && p.originalPriceNGN > p.priceNGN))
    .slice(0, 6);

  if (flashSaleProducts.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3">
      <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-sm overflow-hidden">
        
        {/* Flash Sale Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-white text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">
                  FLASH SALE
                </h2>
                <span className="text-[10px] font-bold bg-white text-rose-700 px-2 py-0.5 rounded-full uppercase">
                  Limited Time
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Exclusive clearance pricing on genuine toners and office furniture
              </p>
            </div>
          </div>

          {/* Countdown Clock & View All Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black">
              <span className="text-[11px] font-bold text-white/80 uppercase mr-1">Ends In:</span>
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-white/20 text-center min-w-[34px]">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <span>:</span>
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-white/20 text-center min-w-[34px]">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <span>:</span>
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-white/20 text-center min-w-[34px] text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>

            <button
              onClick={() => setActivePage('shop')}
              className="hidden md:inline-flex items-center gap-1 px-3.5 py-1.5 bg-white text-slate-950 hover:bg-rose-50 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Product Grid */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {flashSaleProducts.map((product) => (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
                compact
              />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex md:hidden justify-center">
            <button
              onClick={() => setActivePage('shop')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All Flash Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
