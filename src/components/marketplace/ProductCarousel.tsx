import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product, Currency, ActivePage } from '../../types';
import { MarketplaceProductCard } from '../MarketplaceProductCard';

interface ProductCarouselProps {
  title: string;
  badge?: string;
  subtitle?: string;
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onViewAll?: () => void;
  viewAllText?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  badge,
  subtitle,
  products,
  currency,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  onViewAll,
  viewAllText = 'View All',
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth * 0.75 : carouselRef.current.offsetWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        
        {/* Carousel Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            {badge && (
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {badge}
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track: 6 on desktop, 4 on tablet, 2 on mobile */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-13px)] shrink-0 flex"
            >
              <MarketplaceProductCard
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
                compact
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
