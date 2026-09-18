import React from 'react';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { HomepageSectionItem, ActivePage } from '../types';

interface ImageBannerSectionProps {
  section: HomepageSectionItem;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

export const ImageBannerSection: React.FC<ImageBannerSectionProps> = ({
  section,
  setActivePage,
  onSelectCategory
}) => {
  const data = section.customData;
  const imageUrl = data?.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';
  const showOverlay = data?.showOverlayText ?? false;
  const height = data?.bannerHeight || 'medium';

  const heightClasses = {
    compact: 'h-36 sm:h-48 md:h-56',
    medium: 'h-52 sm:h-72 md:h-80',
    large: 'h-72 sm:h-96 md:h-[420px]',
    auto: 'min-h-[160px] sm:min-h-[260px]'
  }[height] || 'h-52 sm:h-72 md:h-80';

  const handleClick = () => {
    const link = (data?.buttonLink || data?.linkUrl || 'shop').toLowerCase();
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
        onClick={handleClick}
        className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group cursor-pointer border border-slate-200/80 ${heightClasses} flex items-center bg-slate-900`}
      >
        {/* Banner Graphic / Photo */}
        <img
          src={imageUrl}
          alt={data?.title || section.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';
          }}
        />

        {/* Text Overlay if enabled */}
        {showOverlay ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent z-1" />
            <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl text-white space-y-3">
              {data?.badge && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-xs shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  {data.badge}
                </span>
              )}
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow-md">
                {data?.title || section.name}
              </h2>
              {data?.subtitle && (
                <p className="text-xs sm:text-base text-slate-200 font-medium leading-relaxed drop-shadow-sm max-w-lg">
                  {data.subtitle}
                </p>
              )}
              {data?.buttonText && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition shadow-md">
                    <span>{data.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Subtle hover indicator for pure image banner */
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-end justify-end p-4 z-1">
            <span className="opacity-0 group-hover:opacity-100 transition bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span>View Offers</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
