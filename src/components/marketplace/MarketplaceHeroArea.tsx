import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Crown, 
  Printer, 
  Droplets, 
  Zap, 
  Package, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { ActivePage, Category } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface MarketplaceHeroAreaProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenAuthenticityModal: () => void;
  categories?: Category[];
}

export const MarketplaceHeroArea: React.FC<MarketplaceHeroAreaProps> = ({
  setActivePage,
  onSelectCategory,
  onOpenAuthenticityModal,
  categories,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  const slides = [
    {
      id: 'slide-hp-toners',
      badge: '100% Genuine OEM Toners',
      title: 'Original HP LaserJet Cartridges',
      subtitle: 'Official Manufacturer Security Holograms',
      description: 'Protect your enterprise printers from drum damage and leaks with certified OEM toners. Same-day Lagos delivery & corporate proforma invoices available.',
      primaryBtnText: 'Shop Genuine Toners',
      primaryAction: () => {
        onSelectCategory('toners');
        setActivePage('shop');
      },
      secondaryBtnText: 'Verify Hologram',
      secondaryAction: () => onOpenAuthenticityModal(),
      bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
      accentColor: 'text-orange-400',
      tagline: 'HP • SHARP • CANON • EPSON',
      image: 'https://ofixbaze.com/wp-content/uploads/2026/07/hp-85a-toner-1.jpg',
      tag: 'FAST LAGOS DISPATCH',
    },
    {
      id: 'slide-executive-furniture',
      badge: 'Luxury Executive Suite',
      title: 'Premium CEO & Ergonomic Chairs',
      subtitle: 'Engineered for Supreme Posture & Comfort',
      description: 'Transform executive offices with genuine Italian-leather CEO chairs, height-adjustable mesh seating, and expansive walnut conference tables.',
      primaryBtnText: 'Explore Furniture',
      primaryAction: () => {
        onSelectCategory('office-chairs');
        setActivePage('shop');
      },
      secondaryBtnText: 'Request Bulk Quote',
      secondaryAction: () => setActivePage('rfq'),
      bgGradient: 'from-slate-950 via-neutral-900 to-amber-950',
      accentColor: 'text-amber-400',
      tagline: 'CHAIRS • TABLES • WORKSTATIONS',
      image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png',
      tag: 'CORPORATE DISCOUNTS',
    },
    {
      id: 'slide-printers-copiers',
      badge: 'Enterprise Document Machines',
      title: 'High-Volume Office Printers & Copiers',
      subtitle: 'Color Multi-Function & Heavy Duty Workhorses',
      description: 'Reliable HP LaserJet Enterprise, Sharp Copiers and EcoTank business printers with manufacturer warranty and continuous replenishment supply.',
      primaryBtnText: 'View Printers',
      primaryAction: () => {
        onSelectCategory('printer');
        setActivePage('shop');
      },
      secondaryBtnText: 'Download Specs',
      secondaryAction: () => setActivePage('rfq'),
      bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
      accentColor: 'text-blue-400',
      tagline: 'HEAVY DUTY • LOW COST PER PAGE',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
      tag: 'OFFICIAL WARRANTY',
    },
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  // Category Icon mapper helper
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('printer')) return <Printer className="w-4 h-4 text-orange-600" />;
    if (slug.includes('toner')) return <Droplets className="w-4 h-4 text-blue-600" />;
    if (slug.includes('chair') || slug.includes('table')) return <Crown className="w-4 h-4 text-amber-600" />;
    if (slug.includes('ups') || slug.includes('power')) return <Zap className="w-4 h-4 text-emerald-600" />;
    return <Package className="w-4 h-4 text-slate-600" />;
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        
        {/* COLUMN 1: Department Sidebar Menu (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Departments
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {displayCategories.length} Categories
            </span>
          </div>

          <div className="divide-y divide-slate-100 py-1 flex-1 overflow-y-auto max-h-[380px]">
            {displayCategories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  setActivePage('shop');
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/70 group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-slate-100">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                    {cat.name}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => {
                onSelectCategory('all');
                setActivePage('shop');
              }}
              className="w-full py-2 px-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
            >
              <span>View All Departments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUMN 2: Large Promotional Hero Banner Slider */}
        <div className="lg:col-span-6 xl:col-span-6 relative rounded-2xl overflow-hidden shadow-md flex flex-col justify-between min-h-[360px] sm:min-h-[400px]">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.bgGradient} transition-all duration-700`} />

          {/* Subtle Decorative Backdrop Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full text-white">
            
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-bold border border-white/15 text-orange-300">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                {activeSlide.badge}
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300/80 uppercase">
                {activeSlide.tag}
              </span>
            </div>

            {/* Main Headline & Description */}
            <div className="my-auto py-4 max-w-lg">
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-300 block mb-1">
                {activeSlide.subtitle}
              </span>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white mb-2.5">
                {activeSlide.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                {activeSlide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={activeSlide.primaryAction}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{activeSlide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={activeSlide.secondaryAction}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeSlide.secondaryBtnText}</span>
                </button>
              </div>
            </div>

            {/* Bottom Slider Navigation & Trust indicators */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-6 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Right Stacked Promotional Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-3 xl:col-span-3 gap-4 lg:gap-3 flex flex-col justify-between">
          
          {/* Card 1: Corporate RFQ Procurement */}
          <div 
            onClick={() => setActivePage('rfq')}
            className="group relative bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-2xl p-4 sm:p-5 border border-amber-200/80 transition-all duration-200 cursor-pointer shadow-xs flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                B2B Bulk Discount
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
                Corporate Tender &amp; Proforma RFQ
              </h3>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Need quotation for your bank, government agency, or multinational? Upload your BOM list for stamped pricing.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
              <span>Request Instant Quote</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 100% Genuine OEM Hologram Guarantee */}
          <div 
            onClick={onOpenAuthenticityModal}
            className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 transition-all duration-200 cursor-pointer shadow-xs flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                Zero Counterfeit
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                Security Hologram Verification
              </h3>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Don't ruin your printer with fake toner cartridges. Verify authentic HP tilt holograms &amp; factory serial seals.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-900">
              <span>View Verification Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
