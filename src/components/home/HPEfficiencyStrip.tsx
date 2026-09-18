import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ActivePage } from '../../types';

interface HPEfficiencyStripProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

export const HPEfficiencyStrip: React.FC<HPEfficiencyStripProps> = ({
  setActivePage,
  onSelectCategory,
}) => {
  const handleClick = () => {
    onSelectCategory('toners-cartridges');
    setActivePage('shop');
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" aria-label="HP Toner Efficiency and Reliability Banner">
      <div 
        onClick={handleClick}
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#ff2f28] via-[#ff4d22] to-[#ff7438] text-white p-6 sm:p-8 md:px-12 md:py-9 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
      >
        {/* Subtle light sweep reflection */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Left Side: Bold High-Contrast Text */}
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
            Find genuine HP Toner Cartridge designed to deliver high-quality printing with efficiency and reliability.
          </h3>
        </div>

        {/* Center / Right Visual: Dual Modern Laptop Displays with Neon Waves + Action Button */}
        <div className="relative z-10 flex items-center justify-end gap-6 shrink-0 w-full md:w-auto">
          {/* Stylized Dual Device Screen Mockups */}
          <div className="hidden lg:flex items-center -space-x-8 opacity-90 group-hover:scale-105 transition-transform duration-300">
            {/* Primary Modern Laptop Display */}
            <div className="w-36 h-24 rounded-lg bg-slate-950 p-1 border border-white/20 shadow-2xl overflow-hidden relative">
              <div className="w-full h-full rounded bg-gradient-to-tr from-indigo-950 via-purple-900 to-cyan-800 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400/80 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute w-10 h-10 rounded-full border border-pink-500/80" />
              </div>
            </div>
            {/* Secondary Front Tablet Display */}
            <div className="w-28 h-20 rounded-md bg-slate-900 p-1 border border-white/30 shadow-2xl relative translate-y-3">
              <div className="w-full h-full rounded bg-gradient-to-br from-cyan-900 via-blue-950 to-pink-900 flex items-center justify-center overflow-hidden">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-300/60" />
              </div>
            </div>
          </div>

          {/* Action Link Button matching screenshot */}
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black tracking-wider uppercase text-white bg-white/10 hover:bg-white hover:text-[#ff3826] px-5 py-3 rounded-full border border-white/40 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <span>BROWSE PRODUCTS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
