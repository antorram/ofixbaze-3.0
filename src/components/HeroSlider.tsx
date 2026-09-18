import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Truck, 
  Star, 
  Layers, 
  Maximize2, 
  Crown,
  Armchair,
  Feather,
  Leaf,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Briefcase,
  Building2,
  Users,
  Award,
  UserCheck
} from 'lucide-react';
import { ActivePage } from '../types';
import { SlideConfig } from '../data/adminData';

interface HeroSliderProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (category: string) => void;
  onOpenAuthenticityModal: () => void;
  customSlides?: SlideConfig[];
}

interface SlideModel {
  code: string;
  desc: string;
  tag: string;
}

interface SlideItem {
  id: string;
  eyebrow?: string;
  highlightTitle: string;
  mainTitle: string;
  subtitle: string;
  tagline: string;
  primaryBtnText: string;
  primaryBtnIcon: 'quote' | 'cart';
  secondaryBtnText: string;
  secondaryActionType: 'shop' | 'rfq';
  deliveryText: string;
  image: string;
  imageAlt: string;
  sealStars: number;
  sealQuality: string;
  sealName: string;
  sealRibbon: string;
  features: Array<{ text: string; icon: React.ComponentType<{ className?: string }> }>;
  bottomStrip: Array<{ text: string; icon: React.ComponentType<{ className?: string }> }>;
  models?: SlideModel[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  setActivePage,
  onSelectCategory,
  customSlides
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const baseSlides: SlideItem[] = [
    // Slide 1: Enterprise Procurement & Premium Office Equipment
    {
      id: 'enterprise-hero',
      eyebrow: "NIGERIA'S TRUSTED CORPORATE PROCUREMENT PARTNER",
      highlightTitle: 'PREMIUM OFFICE EQUIPMENT.',
      mainTitle: 'BUILT FOR BUSINESS.',
      subtitle: 'SUPERIOR CRAFTSMANSHIP • GENUINE OEM TONERS • OFFICIAL WARRANTY',
      tagline: 'Supply your workplace with genuine OEM toners, executive furniture, printers, and document machines with official warranty and fast Lagos delivery.',
      primaryBtnText: 'REQUEST CORPORATE QUOTE',
      primaryBtnIcon: 'quote',
      secondaryBtnText: 'EXPLORE CATALOGUE',
      secondaryActionType: 'shop',
      deliveryText: 'Same-Day Lagos & Nationwide Dispatch',
      image: '/public/executive-tables-banner.jpg',
      imageAlt: 'Premium Office Equipment & Genuine Supplies',
      sealStars: 5,
      sealQuality: 'OFFICIAL OEM DEALER',
      sealName: 'CORPORATE SUITE',
      sealRibbon: 'TRUSTED EXCELLENCE',
      features: [
        { text: '100% GENUINE OEM WARRANTY', icon: ShieldCheck },
        { text: 'SAME-DAY LAGOS DISPATCH', icon: Truck },
        { text: 'STAMPED PROFORMA INVOICES', icon: FileText },
        { text: 'PREMIUM EXECUTIVE FINISH', icon: Crown }
      ],
      bottomStrip: [
        { text: 'ERGONOMIC COMFORT', icon: Armchair },
        { text: 'LUXURIOUS DESIGN', icon: Feather },
        { text: 'OFFICIAL HP DISTRIBUTOR', icon: ShieldCheck },
        { text: 'ENGINEERED FOR PERFORMANCE', icon: Settings }
      ]
    },

    // Slide 2: Premium Executive CEO Chairs
    {
      id: 'executive-ceo-chairs',
      highlightTitle: 'PREMIUM',
      mainTitle: 'EXECUTIVE CEO CHAIRS',
      subtitle: 'SUPERIOR ERGONOMICS. UNCOMPROMISED COMFORT.',
      tagline: 'THE ULTIMATE SUPPORT. FOR YOUR SUCCESS.',
      primaryBtnText: 'SHOP NOW',
      primaryBtnIcon: 'cart',
      secondaryBtnText: 'Request Quote',
      secondaryActionType: 'rfq',
      deliveryText: 'Across Nigeria',
      image: '/ceo-chairs-banner.jpg',
      imageAlt: 'Premium Executive CEO Chairs',
      sealStars: 3,
      sealQuality: 'PREMIUM QUALITY',
      sealName: 'CEO CHAIRS',
      sealRibbon: 'TRUSTED ERGONOMICS',
      features: [
        { text: 'GENUINE COMFORT LEATHER', icon: Layers },
        { text: 'MAXIMUM ERGONOMIC ADJUSTABILITY', icon: SlidersHorizontal },
        { text: 'PROFESSIONAL OFFICE STYLE', icon: Briefcase }
      ],
      bottomStrip: [
        { text: 'SHARP, CRISP POSTURE', icon: UserCheck },
        { text: 'RICH, DEEP COMFORT', icon: Armchair },
        { text: 'SUSTAINABLY DESIGNED', icon: Leaf },
        { text: 'ENGINEERED FOR EXECUTIVES', icon: Award }
      ],
      models: [
        { code: 'CEO 101L', desc: 'Full Leather', tag: 'EX-C200 ERGO-SUPPORT' },
        { code: 'CEO 202R', desc: 'Ribbed Comfort', tag: 'EX-M300 ERGO-SUPPORT' },
        { code: 'CEO 102A', desc: 'Diant Baad', tag: 'EX-M300 ERGO-SUPPORT' },
        { code: 'CEO 1025', desc: 'Mesh-Back', tag: 'EX-M300 ERGO-SUPPORT' }
      ]
    },

    // Slide 3: Premium Visitor Chairs
    {
      id: 'premium-visitor-chairs',
      highlightTitle: 'PREMIUM',
      mainTitle: 'VISITOR CHAIRS',
      subtitle: 'COMFORTABLE VISITS. LASTING IMPRESSIONS.',
      tagline: 'PERFECT COMFORT AND SUPPORT FOR EVERY GUEST.',
      primaryBtnText: 'SHOP NOW',
      primaryBtnIcon: 'cart',
      secondaryBtnText: 'Request Quote',
      secondaryActionType: 'rfq',
      deliveryText: 'Across Nigeria',
      image: '/visitor-chairs-banner.jpg',
      imageAlt: 'Premium Visitor Chairs',
      sealStars: 3,
      sealQuality: 'PREMIUM QUALITY',
      sealName: 'VISITOR CHAIRS',
      sealRibbon: 'TRUSTED COMFORT',
      features: [
        { text: 'PREMIUM QUALITY MATERIALS', icon: ShieldCheck },
        { text: 'ERGONOMIC COMFORT FOR GUESTS', icon: UserCheck },
        { text: 'STURDY & DURABLE CONSTRUCTION', icon: Layers },
        { text: 'PERFECT FOR OFFICES & LOBBIES', icon: Building2 }
      ],
      bottomStrip: [
        { text: 'ERGONOMIC SUPPORT', icon: UserCheck },
        { text: 'COMFORTABLE SEATING', icon: Armchair },
        { text: 'STRONG & DURABLE', icon: ShieldCheck },
        { text: 'RELIABLE QUALITY', icon: Award },
        { text: 'IDEAL FOR GUESTS', icon: Users }
      ],
      models: [
        { code: 'VC 101', desc: 'Full Leather', tag: 'Premium Leather Finish' },
        { code: 'VC 202', desc: 'Ribbed Comfort', tag: 'Ribbed Back Support' },
        { code: 'VC 303', desc: 'Diamond Stitch', tag: 'Diamond Stitch Detailing' },
        { code: 'VC 404', desc: 'Mesh Back', tag: 'Breathable Mesh Back' }
      ]
    }
  ];

  // Merge custom slides configured in Admin panel
  const activeSlides: SlideItem[] = customSlides && customSlides.length > 0
    ? customSlides
        .filter(s => s.enabled)
        .map(s => {
          const match = baseSlides.find(b => b.id === s.id);
          if (match) {
            return {
              ...match,
              highlightTitle: s.highlightTitle || match.highlightTitle,
              mainTitle: s.mainTitle || match.mainTitle,
              subtitle: s.subtitle || match.subtitle,
              tagline: s.tagline || match.tagline,
              primaryBtnText: s.primaryBtnText || match.primaryBtnText,
              secondaryBtnText: s.secondaryBtnText || match.secondaryBtnText,
              deliveryText: s.deliveryText || match.deliveryText,
              image: s.image || match.image,
              imageAlt: s.mainTitle || match.imageAlt
            };
          }
          return {
            id: s.id,
            highlightTitle: s.highlightTitle || 'PREMIUM',
            mainTitle: s.mainTitle,
            subtitle: s.subtitle,
            tagline: s.tagline,
            primaryBtnText: s.primaryBtnText || 'REQUEST QUOTE',
            primaryBtnIcon: 'quote' as const,
            secondaryBtnText: s.secondaryBtnText || 'Browse Catalog',
            secondaryActionType: 'shop' as const,
            deliveryText: s.deliveryText || 'Across All States in Nigeria',
            image: s.image || '/executive-tables-banner.jpg',
            imageAlt: s.mainTitle,
            sealStars: 5,
            sealQuality: 'PREMIUM QUALITY',
            sealName: s.mainTitle,
            sealRibbon: 'TRUSTED EXCELLENCE',
            features: baseSlides[0].features,
            bottomStrip: baseSlides[0].bottomStrip
          };
        })
    : baseSlides;

  const slides = activeSlides.length > 0 ? activeSlides : baseSlides;

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const slideIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const slide = slides[slideIndex];

  const handlePrimaryClick = () => {
    onSelectCategory('office-furniture');
    setActivePage('shop');
  };

  const handleSecondaryClick = () => {
    if (slide.secondaryActionType === 'rfq') {
      setActivePage('rfq');
    } else {
      onSelectCategory('office-furniture');
      setActivePage('shop');
    }
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-5">
        <div 
          className="relative overflow-hidden bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 group/slider w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
      {/* Premium Hero Slide Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/40 min-h-[480px] sm:min-h-[450px] flex flex-col justify-between">
        {/* Decorative geometric orange accent ribbons matching design */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-transparent transform -skew-x-12 blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-32 bg-orange-500/10 transform skew-y-6 pointer-events-none" />

        {/* Main Content Area */}
        <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-8 sm:pt-10 pb-6 md:pb-8 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center">
            
            {/* Left Column: Typography, CTAs & Delivery */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-3.5 sm:space-y-4">
              <div>
                {slide.eyebrow && (
                  <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                    <span>{slide.eyebrow}</span>
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
                  <span className="text-orange-600 block sm:inline">{slide.highlightTitle} </span>
                  <span className="text-slate-950 block sm:inline">{slide.mainTitle}</span>
                </h1>
                <p className="mt-3 text-xs sm:text-sm font-black text-slate-900 tracking-wide uppercase">
                  {slide.subtitle}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-tight">
                  {slide.tagline}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePrimaryClick}
                  className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-lg shadow-slate-900/20 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
                >
                  {slide.primaryBtnIcon === 'cart' ? (
                    <ShoppingCart className="w-4 h-4 text-orange-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-orange-400" />
                  )}
                  <span>{slide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </button>

                <button
                  onClick={handleSecondaryClick}
                  className="px-4 py-3 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 text-xs font-bold border border-orange-300 transition cursor-pointer"
                >
                  {slide.secondaryBtnText}
                </button>
              </div>

              {/* Fast Delivery Badge */}
              <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="text-emerald-700 uppercase tracking-wider block text-[10px]">FAST &amp; RELIABLE DELIVERY</span>
                  <span className="text-slate-900">{slide.deliveryText}</span>
                </div>
              </div>
            </div>

            {/* Center Column: Product Lineup Hero Image & Optional Model Legend */}
            <div className="lg:col-span-5 xl:col-span-5 relative flex flex-col items-center justify-center">
              <div className="relative w-full max-w-xl xl:max-w-2xl aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden shadow-md border border-slate-200/80 bg-white group">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  key={slide.id}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 animate-in fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Optional Model Specification Badges underneath lineup */}
              {slide.models && (
                <div className="w-full max-w-xl xl:max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5">
                  {slide.models.map((model, idx) => (
                    <div 
                      key={idx}
                      className="bg-white/80 backdrop-blur-xs border border-slate-200/90 rounded-lg p-1.5 text-center shadow-2xs"
                    >
                      <div className="text-[10px] font-black text-slate-900 leading-tight truncate">
                        {model.code}
                      </div>
                      <div className="text-[9px] font-semibold text-slate-600 leading-tight truncate">
                        {model.desc}
                      </div>
                      <div className="text-[8px] font-bold text-orange-600 uppercase tracking-tight truncate mt-0.5">
                        {model.tag}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Gold/Black Seal Badge & Key Feature Bullets */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start justify-between gap-5">
              
              {/* Gold/Black Shield Seal Badge */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-xl p-3 sm:p-4 text-center border-2 border-amber-400/80 shadow-md w-full max-w-[210px] mx-auto lg:mx-0">
                <div className="flex justify-center text-amber-400 gap-0.5 mb-1">
                  {[...Array(slide.sealStars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-amber-300">
                  {slide.sealQuality}
                </div>
                <div className="text-xs font-black uppercase text-white tracking-wide">
                  {slide.sealName}
                </div>
                <div className="mt-2 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white text-[9px] font-black uppercase py-0.5 px-2 rounded-full shadow-inner">
                  {slide.sealRibbon}
                </div>
              </div>

              {/* Feature Points with Orange Icons */}
              <div className="space-y-3 w-full">
                {slide.features.map((feature, fIdx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                      <div className="w-6 h-6 rounded-md border border-orange-500/50 bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Vibrant Orange Strip */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white px-4 sm:px-8 py-2.5 mt-auto">
          <div className={`grid grid-cols-2 sm:grid-cols-${slide.bottomStrip.length > 4 ? '5' : '4'} gap-2 text-center text-[10px] sm:text-xs font-extrabold uppercase tracking-wide`}>
            {slide.bottomStrip.map((item, idx) => {
              const StripIcon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-center gap-1.5 py-1">
                  <StripIcon className="w-4 h-4 shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

        {/* Side Navigation Arrows on Slider */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 transition opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 transition opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Change Dots Indicator - Bottom Middle */}
      <div className="flex justify-center items-center gap-3 mt-3.5">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all cursor-pointer shadow-2xs ${
                currentSlide === i ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    </div>
  );
};
