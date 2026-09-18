import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { ActivePage } from '../../types';

interface HPCompatibilityBannerProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

export const HPCompatibilityBanner: React.FC<HPCompatibilityBannerProps> = ({
  setActivePage,
  onSelectCategory,
}) => {
  const quickPills = [
    { label: 'HP 59A TONER CARTRIDGE', query: '59A' },
    { label: 'HP 17A TONER CARTRIDGE', query: '17A' },
    { label: 'HP 26A TONER CARTRIDGE', query: '26A' },
    { label: 'HP 85A TONER CARTRIDGE', query: '85A' },
    { label: 'HP 651A TONER CARTRIDGE', query: '651A' },
  ];

  const handlePillClick = () => {
    onSelectCategory('toners-cartridges');
    setActivePage('shop');
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" aria-label="HP Compatibility Finder">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl min-h-[200px] sm:min-h-[230px] flex items-center">
        {/* Background photo of cozy workspace with laptop and HP presence */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1800&q=80')`
          }}
        >
          {/* Rich Dark Film Overlay for high-contrast white text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full px-6 py-8 sm:px-12 sm:py-10 flex flex-col justify-between gap-5">
          
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                onSelectCategory('toners-cartridges');
                setActivePage('shop');
              }}
              className="px-4 py-1.5 rounded-full bg-[#061b40] hover:bg-[#0c2e6b] text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition cursor-pointer border border-blue-950"
            >
              TONER CARTRIDGES
            </button>
            <button
              onClick={() => {
                onSelectCategory('toners-cartridges');
                setActivePage('shop');
              }}
              className="px-4 py-1.5 rounded-full bg-[#991b1b] hover:bg-[#b91c1c] text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition cursor-pointer border border-red-950"
            >
              INK CARTRIDGES
            </button>
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Find Original HP toner cartridges compatible with your HP printer.
            </h2>
          </div>

          {/* Checked Sub-items Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={handlePillClick}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/95 hover:text-amber-300 transition cursor-pointer group"
              >
                <Check className="w-4 h-4 text-white group-hover:text-amber-300 stroke-[3]" />
                <span className="underline decoration-white/30 group-hover:decoration-amber-300 underline-offset-4">
                  {pill.label}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
