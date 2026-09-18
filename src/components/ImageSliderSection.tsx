import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { HomepageSectionItem, ActivePage, BannerSlideItem } from '../types';

interface ImageSliderSectionProps {
  section: HomepageSectionItem;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

const DEFAULT_SLIDES: BannerSlideItem[] = [
  {
    id: 's1',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1920&q=80',
    title: 'High-Performance LaserJet & Smart MFP Printers',
    subtitle: 'Authorized dealer warranty with direct doorstep delivery across Nigeria.',
    buttonText: 'Shop Printers',
    buttonLink: 'shop'
  },
  {
    id: 's2',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80',
    title: '100% Genuine OEM Toners & Laser Supplies',
    subtitle: 'Zero streak guarantee, verified manufacturer anti-counterfeit security seals.',
    buttonText: 'Order Genuine Toners',
    buttonLink: 'shop'
  },
  {
    id: 's3',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    title: 'Executive Office Furniture & High-Tech Workspaces',
    subtitle: 'Ergonomic boss chairs, walnut meeting tables, and corporate safes.',
    buttonText: 'Explore Furniture',
    buttonLink: 'shop'
  }
];

export const ImageSliderSection: React.FC<ImageSliderSectionProps> = ({
  section,
  setActivePage,
  onSelectCategory
}) => {
  const data = section.customData;
  const slides = (data?.slides && data.slides.length > 0) ? data.slides : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalSeconds = (data?.intervalSeconds || 5) * 1000;
  const height = data?.bannerHeight || 'medium';

  const heightClasses = {
    compact: 'h-48 sm:h-64 md:h-72',
    medium: 'h-64 sm:h-80 md:h-[380px]',
    large: 'h-80 sm:h-[440px] md:h-[500px]',
    auto: 'min-h-[220px] sm:min-h-[320px]'
  }[height] || 'h-64 sm:h-80 md:h-[380px]';

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % slides.length);
    }, intervalSeconds);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, intervalSeconds]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(prev => (prev + 1) % slides.length);
  };

  const handleSlideClick = (slide: BannerSlideItem) => {
    const link = (slide.buttonLink || 'shop').toLowerCase();
    if (link.includes('http://') || link.includes('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }
    if (link.includes('rfq') || link.includes('quote')) {
      setActivePage('rfq');
    } else if (link.includes('contact')) {
      setActivePage('contact');
    } else if (link.includes('about')) {
      setActivePage('about');
    } else if (link.includes('track')) {
      setActivePage('track-order');
    } else if (link.includes('cat-') || link.includes('printer') || link.includes('toner') || link.includes('chair') || link.includes('table')) {
      const slug = link.replace('cat-', '');
      onSelectCategory(slug);
      setActivePage('shop');
    } else {
      onSelectCategory('all');
      setActivePage('shop');
    }
  };

  return (
    <section className="w-full px-2 sm:px-4 md:px-6 lg:px-8 my-4 sm:my-6">
      <div 
        className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 ${heightClasses} bg-slate-900 select-none group`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide Items */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={slide.id || idx}
              onClick={() => handleSlideClick(slide)}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Photo */}
              <img
                src={slide.imageUrl}
                alt={slide.title || `Slide ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';
                }}
              />

              {/* Gradient & Caption (if slide has title/subtitle) */}
              {(slide.title || slide.subtitle || slide.buttonText) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
                  <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-center max-w-2xl text-white space-y-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white w-fit shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured Banner
                    </span>
                    {slide.title && (
                      <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow-md">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.buttonText && (
                      <div className="pt-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition shadow-md cursor-pointer"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-md border border-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-md border border-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(dotIdx);
                  }}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentIdx ? 'w-6 bg-white shadow-xs' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
