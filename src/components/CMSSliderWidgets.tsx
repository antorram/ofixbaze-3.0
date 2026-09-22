import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { CMSWidget, Product, Category, Currency, ActivePage } from '../types';
import { ProductCard } from './ProductCard';
import { isProductInCategory } from '../utils/categoryMatcher';

// ============================================================================
// 1. LOGO / BRAND SLIDER WIDGET
// ============================================================================

export interface LogoItem {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  link?: string;
}

const DEFAULT_BRAND_LOGOS: LogoItem[] = [
  {
    id: 'hp',
    title: 'HP Authorized Partner',
    image: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg',
    link: '/shop?brand=hp'
  },
  {
    id: 'sharp',
    title: 'Sharp Enterprise Copiers',
    image: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg',
    link: '/shop?brand=sharp'
  },
  {
    id: 'canon',
    title: 'Canon Imaging Solutions',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=canon'
  },
  {
    id: 'epson',
    title: 'Epson Precision Core',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=epson'
  },
  {
    id: 'comix',
    title: 'Comix Stationery & Shredders',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=comix'
  },
  {
    id: 'apc',
    title: 'APC Schneider Electric UPS',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=apc'
  },
  {
    id: 'cisco',
    title: 'Cisco Enterprise Networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=cisco'
  },
  {
    id: 'dell',
    title: 'Dell Technologies',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80',
    link: '/shop?brand=dell'
  },
  {
    id: 'ngc',
    title: 'Nigerian Gas Company',
    image: 'https://ofixbaze.com/wp-content/uploads/2020/05/NIGERIAN-GAS-COMPANY-LOGO.jpg',
    link: '#'
  }
];

interface CMSLogoSliderWidgetProps {
  widget: CMSWidget;
  isBuilderMode?: boolean;
}

export const CMSLogoSliderWidget: React.FC<CMSLogoSliderWidgetProps> = ({
  widget,
  isBuilderMode
}) => {
  const settings = widget.settings || {};
  const content = widget.content || {};

  const mode = settings.logoSliderMode || 'marquee'; // 'marquee' | 'carousel'
  const isGrayscale = settings.logoSliderGrayscale ?? true;
  const speedSeconds = settings.logoSliderSpeed || 32;
  const showArrows = settings.logoSliderShowArrows ?? true;
  const showDots = settings.logoSliderShowDots ?? false;
  const pauseOnHover = settings.logoSliderPauseOnHover ?? true;
  const cardBorderRadius = settings.logoSliderBorderRadius ?? 10;
  const cardBgColor = settings.logoSliderBgColor || '#ffffff';

  // Get logo items from widget content or default
  const logoItems: LogoItem[] = (content.items && content.items.length > 0)
    ? content.items.map((item, idx) => ({
        id: item.id || `logo-${idx}`,
        title: item.title || `Brand ${idx + 1}`,
        image: item.image || item.imageUrl || '',
        link: item.link || item.buttonUrl || '#'
      }))
    : DEFAULT_BRAND_LOGOS;

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = Math.max(2, Math.min(6, settings.logoSliderItemsToShow || 5));
  const maxPages = Math.max(1, Math.ceil(logoItems.length / itemsPerPage));

  // Autoplay for carousel mode
  useEffect(() => {
    if (mode !== 'carousel') return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % maxPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [mode, maxPages]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCarouselIndex((prev) => (prev - 1 + maxPages) % maxPages);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCarouselIndex((prev) => (prev + 1) % maxPages);
  };

  const textAlign = settings.textAlign || 'center';

  return (
    <div className="w-full space-y-4 select-none">
      {/* Header if provided */}
      {(content.text || content.badge || content.subtext) && (
        <div className={`space-y-1 mb-3 ${
          textAlign === 'left' ? 'text-left' :
          textAlign === 'right' ? 'text-right ml-auto max-w-2xl' :
          'text-center max-w-2xl mx-auto'
        }`}>
          {content.badge && (
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block">
              {content.badge}
            </span>
          )}
          {content.text && (
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {content.text}
            </h3>
          )}
          {content.subtext && (
            <p className={`text-xs text-slate-500 max-w-lg ${textAlign === 'center' ? 'mx-auto' : ''}`}>
              {content.subtext}
            </p>
          )}
        </div>
      )}

      {/* MODE 1: CONTINUOUS SMOOTH MARQUEE */}
      {mode === 'marquee' && (
        <div className="relative w-full overflow-hidden py-2 group/marquee">
          {/* Subtle gradient edge masks for smooth fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div
            className="animate-ofix-marquee flex items-center gap-4 sm:gap-6"
            style={{
              ['--marquee-duration' as any]: `${speedSeconds}s`,
              animationPlayState: pauseOnHover ? undefined : 'running'
            }}
          >
            {/* Double the list so marquee loops infinitely without blank gaps */}
            {[...logoItems, ...logoItems].map((logo, idx) => {
              const hasImage = Boolean(logo.image);
              return (
                <div
                  key={`${logo.id}-${idx}`}
                  style={{
                    backgroundColor: cardBgColor,
                    borderRadius: `${cardBorderRadius}px`
                  }}
                  className={`h-14 sm:h-16 px-4 sm:px-6 min-w-[130px] sm:min-w-[170px] max-w-[200px] flex items-center justify-center border border-slate-200/80 shadow-xs transition-all duration-300 hover:shadow-md hover:border-orange-500/40 shrink-0 ${
                    isGrayscale ? 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100' : ''
                  }`}
                >
                  {hasImage ? (
                    <img
                      src={logo.image}
                      alt={logo.title}
                      className="max-h-9 sm:max-h-10 max-w-[120px] sm:max-w-[150px] w-auto object-contain pointer-events-none"
                      onError={(e) => {
                        // Fallback text if image fails to load
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent && !parent.querySelector('.fallback-title')) {
                          const span = document.createElement('span');
                          span.className = 'fallback-title font-black text-xs text-slate-700 uppercase tracking-tight text-center';
                          span.innerText = logo.title;
                          parent.appendChild(span);
                        }
                      }}
                    />
                  ) : (
                    <span className="font-black text-xs text-slate-800 uppercase tracking-tight text-center">
                      {logo.title}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE SLIDER / CAROUSEL WITH ARROWS */}
      {mode === 'carousel' && (
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${carouselIndex * 100}%)`
              }}
            >
              {Array.from({ length: maxPages }).map((_, pageIdx) => {
                const pageItems = logoItems.slice(
                  pageIdx * itemsPerPage,
                  pageIdx * itemsPerPage + itemsPerPage
                );
                return (
                  <div
                    key={pageIdx}
                    className="w-full shrink-0 grid gap-3 sm:gap-4 px-1"
                    style={{
                      gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`
                    }}
                  >
                    {pageItems.map((logo) => {
                      const hasImage = Boolean(logo.image);
                      return (
                        <div
                          key={logo.id}
                          style={{
                            backgroundColor: cardBgColor,
                            borderRadius: `${cardBorderRadius}px`
                          }}
                          className={`h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-center border border-slate-200 shadow-xs transition-all duration-300 hover:shadow-md hover:border-orange-500/40 ${
                            isGrayscale ? 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100' : ''
                          }`}
                        >
                          {hasImage ? (
                            <img
                              src={logo.image}
                              alt={logo.title}
                              className="max-h-8 sm:max-h-9 max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const parent = (e.target as HTMLElement).parentElement;
                                if (parent && !parent.querySelector('.fallback-title')) {
                                  const span = document.createElement('span');
                                  span.className = 'fallback-title font-black text-xs text-slate-700 uppercase tracking-tight text-center';
                                  span.innerText = logo.title;
                                  parent.appendChild(span);
                                }
                              }}
                            />
                          ) : (
                            <span className="font-black text-xs text-slate-800 uppercase tracking-tight text-center">
                              {logo.title}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showArrows && maxPages > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500 flex items-center justify-center transition cursor-pointer z-10"
                aria-label="Previous logos"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500 flex items-center justify-center transition cursor-pointer z-10"
                aria-label="Next logos"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {showDots && maxPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 pt-3">
              {Array.from({ length: maxPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    carouselIndex === idx
                      ? 'w-5 h-1.5 bg-orange-600'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. PRODUCT SLIDER / CAROUSEL WIDGET
// ============================================================================

interface CMSProductSliderWidgetProps {
  widget: CMSWidget;
  products: Product[];
  categories: Category[];
  currency: Currency;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory?: (slug: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
  onQuickView?: (product: Product) => void;
  isBuilderMode?: boolean;
}

export const CMSProductSliderWidget: React.FC<CMSProductSliderWidgetProps> = ({
  widget,
  products,
  currency,
  setActivePage,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onQuickView,
  isBuilderMode
}) => {
  const settings = widget.settings || {};
  const content = widget.content || {};

  // Filter products
  let displayProds = [...products];
  if (settings.productCategory && settings.productCategory !== 'all') {
    displayProds = displayProds.filter((p) => isProductInCategory(p, settings.productCategory!));
  }
  if (settings.onlyFeatured || widget.type === 'featured_products') {
    displayProds = displayProds.filter((p) => p.isFeatured);
  }
  if (settings.onlySale) {
    displayProds = displayProds.filter((p) => p.originalPriceNGN && p.originalPriceNGN > p.priceNGN);
  }
  if (settings.productBrand) {
    const brandKeyword = settings.productBrand.toLowerCase();
    displayProds = displayProds.filter(
      (p) => (p.brand || '').toLowerCase().includes(brandKeyword) || p.name.toLowerCase().includes(brandKeyword)
    );
  }

  const limit = settings.productsLimit || 12;
  const filteredProducts = displayProds.slice(0, limit);

  // Responsive items count
  const itemsDesktop = settings.productSliderItemsToShow || 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = filteredProducts.length;
  const maxScrollIndex = Math.max(0, totalItems - itemsDesktop);

  // Autoplay rotation
  const autoplay = settings.productSliderAutoplay !== false;
  const intervalTime = settings.productSliderInterval || 5000;

  useEffect(() => {
    if (!autoplay || totalItems <= itemsDesktop) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxScrollIndex ? 0 : prev + 1));
    }, intervalTime);
    return () => clearInterval(timer);
  }, [autoplay, totalItems, itemsDesktop, intervalTime, maxScrollIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev <= 0 ? maxScrollIndex : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev >= maxScrollIndex ? 0 : prev + 1));
  };

  // Touch and mouse drag swipe support
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
    setIsDragging(false);
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
        No products found in category "{settings.productCategory || 'All'}". Total products available: {products.length}.
      </div>
    );
  }

  // Header content detection & alignment
  const textAlign = settings.textAlign || 'left';
  const hasBadge = Boolean(content.badge && content.badge.trim());
  const hasText = Boolean(content.text && content.text.trim());
  const hasSubtext = Boolean(content.subtext && content.subtext.trim());
  const hasHeaderContent = hasBadge || hasText || hasSubtext;

  return (
    <div className="w-full space-y-4">
      {/* Top Header Row with Title and View All & Slider Controls */}
      {hasHeaderContent ? (
        <div
          className={`w-full pb-3 border-b border-slate-200/80 ${
            textAlign === 'center'
              ? 'flex flex-col items-center text-center gap-3'
              : textAlign === 'right'
              ? 'flex flex-col sm:flex-row-reverse sm:items-end justify-between gap-3 text-right'
              : 'flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left'
          }`}
        >
          <div className={textAlign === 'center' ? 'max-w-2xl mx-auto' : textAlign === 'right' ? 'ml-auto max-w-xl' : 'max-w-xl'}>
            {hasBadge && (
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                {content.badge}
              </span>
            )}
            {hasText && (
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {content.text}
              </h3>
            )}
            {hasSubtext && (
              <p
                className={`text-xs sm:text-sm text-slate-500 mt-1 max-w-xl ${
                  textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''
                }`}
              >
                {content.subtext}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto">
            {/* View All Button */}
            {!isBuilderMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (settings.productCategory && onSelectCategory) {
                    onSelectCategory(settings.productCategory);
                  }
                  setActivePage('shop');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Slider Prev / Next Arrows */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition cursor-pointer bg-white text-slate-700 border-slate-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 shadow-xs active:scale-95"
                aria-label="Previous products"
                title="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition cursor-pointer bg-white text-slate-700 border-slate-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 shadow-xs active:scale-95"
                aria-label="Next products"
                title="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* When all text is removed, render a clean compact controls bar if multiple items */
        totalItems > itemsDesktop && (
          <div className="flex justify-end items-center gap-2 pb-1">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-white hover:text-orange-600 transition cursor-pointer shadow-2xs"
                title="Previous products"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-slate-500 px-1">
                {currentIndex + 1} / {maxScrollIndex + 1}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-white hover:text-orange-600 transition cursor-pointer shadow-2xs"
                title="Next products"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      )}

      {/* Product Sliding Track */}
      <div
        className="relative overflow-hidden py-1 group select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsDesktop}%)`
          }}
        >
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="shrink-0 px-2"
              style={{
                width: `${100 / itemsDesktop}%`
              }}
            >
              <ProductCard
                product={prod}
                currency={currency}
                onAddToCart={onAddToCart || (() => {})}
                onToggleWishlist={onToggleWishlist || (() => {})}
                isWishlisted={wishlistIds.includes(prod.id)}
                onQuickView={onQuickView || (() => {})}
                onSelectProduct={onSelectProduct || (() => {})}
              />
            </div>
          ))}
        </div>

        {/* Floating Side Arrows on Hover for direct clicking */}
        {totalItems > itemsDesktop && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-slate-200 text-slate-700 shadow-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
              aria-label="Previous products"
              title="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-slate-200 text-slate-700 shadow-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
              aria-label="Next products"
              title="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {totalItems > itemsDesktop && (
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {Array.from({ length: maxScrollIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-1.5 bg-orange-600'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Slide to index ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. IMAGE SLIDER / GALLERY CAROUSEL WIDGET
// ============================================================================

export interface ImageSlideItem {
  id: string;
  title?: string;
  description?: string;
  badge?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  link?: string;
}

const DEFAULT_IMAGE_SLIDES: ImageSlideItem[] = [
  {
    id: 'img-1',
    title: 'Executive Boardroom Desks',
    description: 'Precision Italian veneer and integrated wire management for visionary executives.',
    badge: 'FLAGSHIP SERIES',
    image: '/executive-tables-banner.jpg',
    buttonText: 'EXPLORE TABLES',
    buttonUrl: '/shop?category=executive-tables'
  },
  {
    id: 'img-2',
    title: 'Ergonomic CEO Leather Chairs',
    description: 'High-back lumbar support engineered for 12+ hour corporate focus.',
    badge: 'OFFICIAL OEM',
    image: '/ceo-chairs-banner.jpg',
    buttonText: 'DISCOVER SEATING',
    buttonUrl: '/shop?category=executive-chairs'
  },
  {
    id: 'img-3',
    title: 'Prestige Visitor Seating',
    description: 'Commanding client comfort for Lagos corporate reception & executive guest lobbies.',
    badge: 'BESTSELLER',
    image: '/visitor-chairs-banner.jpg',
    buttonText: 'VIEW COLLECTION',
    buttonUrl: '/shop?category=visitor-conference-chairs'
  }
];

interface CMSImageSliderWidgetProps {
  widget: CMSWidget;
  setActivePage: (page: ActivePage) => void;
  isBuilderMode?: boolean;
}

export const CMSImageSliderWidget: React.FC<CMSImageSliderWidgetProps> = ({
  widget,
  setActivePage,
  isBuilderMode
}) => {
  const settings = widget.settings || {};
  const content = widget.content || {};

  const slides: ImageSlideItem[] = (content.items && content.items.length > 0)
    ? content.items.map((item, idx) => ({
        id: item.id || `img-slide-${idx}`,
        title: item.title,
        description: item.description || item.subtext,
        badge: item.badge,
        image: item.image || item.imageUrl || '/executive-tables-banner.jpg',
        buttonText: item.buttonText,
        buttonUrl: item.buttonUrl || item.link || '/shop'
      }))
    : DEFAULT_IMAGE_SLIDES;

  const [activeSlide, setActiveSlide] = useState(0);
  const autoplay = settings.imageSliderAutoplay !== false;
  const intervalTime = settings.imageSliderInterval || 6000;
  const sliderHeight = settings.imageSliderHeight || '440px';
  const mobileSliderHeight = settings.imageSliderHeightMobile || settings.mobileImageSliderHeight || '220px';
  const borderRadius = settings.imageSliderBorderRadius ?? 16;
  const showArrows = settings.imageSliderShowArrows !== false;
  const showDots = settings.imageSliderShowDots !== false;
  const objectFit = settings.imageSliderObjectFit || 'cover';

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [autoplay, slides.length, intervalTime]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const textAlign = settings.textAlign || 'center';

  return (
    <div className="w-full space-y-3">
      {/* Optional Top Header */}
      {(content.text || content.badge || content.subtext) && (
        <div className={`space-y-1 mb-2 ${
          textAlign === 'left' ? 'text-left' :
          textAlign === 'right' ? 'text-right ml-auto max-w-2xl' :
          'text-center max-w-2xl mx-auto'
        }`}>
          {content.badge && (
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block">
              {content.badge}
            </span>
          )}
          {content.text && (
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {content.text}
            </h3>
          )}
          {content.subtext && (
            <p className={`text-xs text-slate-500 ${textAlign === 'center' ? 'mx-auto' : ''}`}>
              {content.subtext}
            </p>
          )}
        </div>
      )}

      {/* Main Slide Stage */}
      <div
        className="relative w-full overflow-hidden shadow-lg group/img-slider max-sm:!h-[220px] max-md:!min-h-0"
        style={{
          height: sliderHeight,
          borderRadius: `${borderRadius}px`
        }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title || `Slide ${idx + 1}`}
                className="w-full h-full"
                style={{ objectFit }}
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Text & Action Overlay (if title or button provided) */}
              {(slide.title || slide.description || slide.buttonText) && (
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20 max-w-2xl">
                  {slide.badge && (
                    <span className="inline-block px-2.5 py-1 rounded bg-orange-600 text-white font-bold text-[10px] tracking-wider uppercase mb-2 self-start shadow-xs">
                      {slide.badge}
                    </span>
                  )}
                  {slide.title && (
                    <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                      {slide.title}
                    </h4>
                  )}
                  {slide.description && (
                    <p className="text-xs sm:text-sm text-slate-200 mt-1.5 drop-shadow line-clamp-2">
                      {slide.description}
                    </p>
                  )}
                  {slide.buttonText && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (slide.buttonUrl?.startsWith('/')) {
                            const page = slide.buttonUrl.replace('/', '') as ActivePage;
                            setActivePage(page || 'shop');
                          } else if (slide.buttonUrl) {
                            window.location.href = slide.buttonUrl;
                          }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition shadow-md hover:shadow-lg cursor-pointer"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-orange-600 text-white backdrop-blur-md flex items-center justify-center transition opacity-0 group-hover/img-slider:opacity-100 cursor-pointer z-30 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-orange-600 text-white backdrop-blur-md flex items-center justify-center transition opacity-0 group-hover/img-slider:opacity-100 cursor-pointer z-30 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 h-2 bg-orange-500'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
