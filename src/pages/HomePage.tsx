import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  Star,
  Quote,
  Flame,
  Award,
  BadgeCheck,
  Layers
} from 'lucide-react';
import { Product, Currency, ActivePage, SiteCustomizerConfig, HomepageSectionItem, Category, CMSPage } from '../types';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { isProductInCategory } from '../utils/categoryMatcher';
import { DEFAULT_CUSTOMIZER_CONFIG } from '../data/defaultCustomizer';
import { HPBentoShowcase } from '../components/home/HPBentoShowcase';
import { HPCompatibilityBanner } from '../components/home/HPCompatibilityBanner';
import { HPEfficiencyStrip } from '../components/home/HPEfficiencyStrip';
import { PopularCategoriesShowcase } from '../components/home/PopularCategoriesShowcase';
import { TonerSliderSection } from '../components/home/TonerSliderSection';
import { SlideConfig } from '../data/adminData';
import { ImageBannerSection } from '../components/ImageBannerSection';
import { ImageSliderSection } from '../components/ImageSliderSection';
import { CMSSectionRenderer } from '../components/CMSSectionRenderer';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (slug: string) => void;
  onOpenAuthenticityModal: () => void;
  products?: Product[];
  categories?: Category[];
  customizerConfig?: SiteCustomizerConfig;
  slides?: SlideConfig[];
  cmsPage?: CMSPage;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  currency,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  onSelectCategory,
  onOpenAuthenticityModal,
  products = PRODUCTS,
  categories,
  customizerConfig,
  slides,
  cmsPage
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'toners' | 'printers' | 'machines'>('featured');
  
  // Countdown timer for Flash Deal
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

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
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeTab === 'toners') return p.category === 'toners-cartridges';
    if (activeTab === 'printers') return p.category === 'printers-copiers';
    if (activeTab === 'machines') return p.category === 'office-machines';
    return p.isFeatured;
  }).slice(0, 8);

  const hotDeals = products.filter(p => p.isHotDeal || (p.originalPriceNGN && p.originalPriceNGN > p.priceNGN)).slice(0, 4);

  const brandPartners = [
    { name: 'HP', desc: 'Authorized OEM Toner & LaserJet Dealer', logo: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg', color: 'bg-blue-600 text-white' },
    { name: 'Sharp', desc: 'Authorized Copiers & Laser Printers', logo: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg', color: 'bg-red-600 text-white' },
    { name: 'Canon', desc: 'Official Copier & Printer Solutions', color: 'bg-red-700 text-white' },
    { name: 'Epson', desc: 'EcoTank Business Ink Solutions', color: 'bg-indigo-700 text-white' },
    { name: 'Comix', desc: 'Heavy Duty Office Machines', color: 'bg-slate-800 text-white' },
    { name: 'APC', desc: 'Enterprise Power & UPS Systems', color: 'bg-emerald-600 text-white' },
  ];

  // Section rendering modules
  const renderHero = () => (
    <HeroSlider
      setActivePage={setActivePage}
      onSelectCategory={onSelectCategory}
      onOpenAuthenticityModal={onOpenAuthenticityModal}
      customSlides={slides}
    />
  );

  const renderTrustBadges = () => (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine Guarantee</h4>
            <p className="text-[11px] text-slate-500">Official OEM security hologram on all toners</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Same-Day Lagos Dispatch</h4>
            <p className="text-[11px] text-slate-500">Fast delivery to Island, Ikeja & Nationwide</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Corporate Invoicing (RFQ)</h4>
            <p className="text-[11px] text-slate-500">Proforma invoice, PO terms & bulk discounts</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Official Manufacturer Warranty</h4>
            <p className="text-[11px] text-slate-500">HP & OEM service replacement backing</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = (section?: HomepageSectionItem) => {
    const sectionBadge = section?.sectionBadge || 'Product Departments';
    const sectionTitle = section?.sectionTitle || 'Shop by Department';
    const sectionSubtitle = section?.sectionSubtitle;
    const buttonText = section?.buttonText || 'View All Departments';
    const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;

    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {sectionBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-xs text-slate-500 mt-1">{sectionSubtitle}</p>
            )}
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              setActivePage('shop');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{buttonText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3">
          {displayCategories.map(category => {
            const count = products.filter(p => isProductInCategory(p, category.slug)).length;
            return (
              <div
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.slug);
                  setActivePage('shop');
                }}
                className="group relative bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md p-3 transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 p-1.5 mb-2.5 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                  {category.name}
                </h3>
                <span className="text-[10px] font-medium text-slate-500 mt-1">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderFlashDeals = (section?: HomepageSectionItem) => {
    const sectionBadge = section?.sectionBadge || 'Limited Corporate Deals';
    const sectionTitle = section?.sectionTitle || 'Hot Office Supplies Deals of the Week';
    const sectionSubtitle = section?.sectionSubtitle || 'Special bulk discount pricing on original HP cartridges, copiers and shredders.';

    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div 
          className="rounded-2xl p-6 sm:p-8 text-white shadow-xl transition-all"
          style={section?.bgColor ? { backgroundColor: section.bgColor, color: section.textColor } : { background: 'linear-gradient(to right, #0f172a, #1e293b, #0f172a)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                {sectionBadge}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {sectionTitle}
              </h2>
              {sectionSubtitle && (
                <p className="text-xs text-slate-300 mt-0.5">
                  {sectionSubtitle}
                </p>
              )}
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Ends in:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <div className="bg-white/10 px-2 py-1.5 rounded border border-white/15 min-w-[36px] text-center">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </div>
                <span>:</span>
                <div className="bg-white/10 px-2 py-1.5 rounded border border-white/15 min-w-[36px] text-center">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </div>
                <span>:</span>
                <div className="bg-white/10 px-2 py-1.5 rounded border border-white/15 min-w-[36px] text-center text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {hotDeals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderFeaturedTabs = (section?: HomepageSectionItem) => {
    const sectionBadge = section?.sectionBadge || 'Verified Stock';
    const sectionTitle = section?.sectionTitle || 'Featured Office Equipment & Toners';
    const sectionSubtitle = section?.sectionSubtitle;
    const buttonText = section?.buttonText || 'Browse Complete Product Catalog (120+ Products)';

    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {sectionBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-xs text-slate-500 mt-1">{sectionSubtitle}</p>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'featured' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setActiveTab('toners')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'toners' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Original Toners
            </button>
            <button
              onClick={() => setActiveTab('printers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'printers' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Printers & Copiers
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'machines' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Office Machines
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              onSelectCategory('all');
              setActivePage('shop');
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  };

  const renderTonerSlider = () => (
    <TonerSliderSection
      products={products}
      currency={currency}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      wishlistIds={wishlistIds}
      onQuickView={onQuickView}
      onSelectProduct={onSelectProduct}
      setActivePage={setActivePage}
      onSelectCategory={onSelectCategory}
    />
  );

  const renderAntiCounterfeitBanner = () => (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-800/50">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-700/50">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            Protect Your Office Equipment
          </div>
          <h3 className="text-xl sm:text-3xl font-black leading-tight">
            Don't Ruin Your Printer with Counterfeit Toners
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Counterfeit cartridges leak toxic powder, ruin fuser drums, and cause expensive office downtime. Every HP toner sold by Ofixbaze carries an original factory security label and verified serial code.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs font-medium text-emerald-200">
            <span className="flex items-center gap-1">✓ Anti-tamper seal</span>
            <span className="flex items-center gap-1">✓ Tilt-to-view hologram</span>
            <span className="flex items-center gap-1">✓ Full page yield guarantee</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenAuthenticityModal}
            className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-emerald-50 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Launch Hologram Verification Guide</span>
          </button>
          <button
            onClick={() => {
              onSelectCategory('toners-cartridges');
              setActivePage('shop');
            }}
            className="px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-xs transition border border-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Shop Verified HP Toners</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );

  const renderQuoteBanner = () => (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Ordering for a Company, Bank, or Government Agency?
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              We provide official proforma invoices, flexible Corporate Purchase Order (PO) terms, tax invoices, and quarterly replenishment contracts for corporate clients across Nigeria.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('rfq')}
          className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Request Corporate Proforma (RFQ)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );

  const renderBrandPartners = () => (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
          Direct OEM Supply Chain
        </span>
        <h3 className="text-lg font-bold text-slate-900 mt-1">
          Authorized Brands &amp; Official Manufacturers
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {brandPartners.map((brand, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-xs transition group min-h-[110px]"
          >
            {brand.logo ? (
              <div className="h-10 flex items-center justify-center mb-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-8 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="h-10 flex items-center justify-center mb-2">
                <span className={`text-sm font-black px-2.5 py-0.5 rounded-md ${brand.color}`}>
                  {brand.name}
                </span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 leading-tight">
              {brand.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          Verified Customer Reviews
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Trusted by Procurement Managers
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Read feedback from corporate clients who procure their office equipment from our Lagos showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "Our bank had major issues with counterfeit HP toners blowing up drums in our LaserJet printers. Since switching our quarterly supply contract to Ofixbaze Nigeria, our print quality has been 100% flawless."
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              OA
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Oluwaseun Adeyemi</h4>
              <p className="text-[10px] text-slate-500">Procurement Officer, Commercial Bank, Lagos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "We bought two Comix heavy duty shredders and a currency counter for our accounting firm on Lagos Island. They delivered within 3 hours on the same day and set everything up for our staff."
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
              CN
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Chidinma Nwosu</h4>
              <p className="text-[10px] text-slate-500">Managing Partner, Audit & Advisory Services</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "The corporate RFQ feature is fantastic. We uploaded our annual consumables sheet and received a competitive proforma invoice within 30 minutes with official HP warranty clauses."
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
              IB
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Ibrahim Bello</h4>
              <p className="text-[10px] text-slate-500">Head of IT Infrastructure, Telecomm Firm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCustomSection = (section: HomepageSectionItem) => {
    const data = section.customData || {
      title: section.name,
      subtitle: section.description,
      content: '',
      type: 'banner' as const,
      badge: 'Special Announcement',
      bgColor: '#1e293b',
      textColor: '#ffffff',
      buttonText: 'Explore Collection',
      buttonLink: '/shop',
      imageUrl: ''
    };

    const handleButtonClick = () => {
      const link = (data.buttonLink || '').toLowerCase();
      if (link.includes('shop')) {
        onSelectCategory('all');
        setActivePage('shop');
      } else if (link.includes('rfq') || link.includes('quote')) {
        setActivePage('rfq');
      } else if (link.includes('contact')) {
        setActivePage('contact');
      } else if (link.includes('about')) {
        setActivePage('about');
      } else {
        setActivePage('shop');
      }
    };

    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div 
          className="rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 transition-all"
          style={{ 
            backgroundColor: data.bgColor || '#1e293b',
            color: data.textColor || '#ffffff'
          }}
        >
          <div className="space-y-3 max-w-2xl">
            {data.badge && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-white/10 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                {data.badge}
              </span>
            )}
            <h3 className="text-xl sm:text-3xl font-black leading-tight">
              {data.title || section.name}
            </h3>
            {data.subtitle && (
              <p className="text-sm font-semibold opacity-90">
                {data.subtitle}
              </p>
            )}
            {data.content && (
              <p className="text-xs sm:text-sm leading-relaxed opacity-80 pt-1">
                {data.content}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            {data.imageUrl ? (
              <img 
                src={data.imageUrl} 
                alt={data.title} 
                className="max-h-28 w-auto rounded-lg object-contain bg-white/10 p-2"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : null}
            {data.buttonText && (
              <button
                onClick={handleButtonClick}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
              >
                <span>{data.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    );
  };

  // If a published CMS Page exists from the Page Builder with enabled sections, render dynamically
  if (cmsPage && cmsPage.sections && cmsPage.sections.length > 0 && cmsPage.status === 'published') {
    return (
      <div className="space-y-0 pb-16">
        {cmsPage.sections
          .filter(s => s.enabled)
          .map((section) => (
            <CMSSectionRenderer
              key={section.id}
              section={section}
              products={products}
              categories={categories || CATEGORIES}
              currency={currency}
              setActivePage={setActivePage}
              onSelectCategory={onSelectCategory}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={onQuickView}
              onOpenAuthenticityModal={onOpenAuthenticityModal}
            />
          ))}
      </div>
    );
  }

  const configuredSections = customizerConfig?.sections || DEFAULT_CUSTOMIZER_CONFIG.sections;
  const activeSections = [...configuredSections]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 pb-16">
      {activeSections.map((section) => {
        if (section.isCustom) {
          if (section.customData?.type === 'image_banner') {
            return (
              <React.Fragment key={section.id}>
                <ImageBannerSection
                  section={section}
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                />
              </React.Fragment>
            );
          }
          if (section.customData?.type === 'image_slider') {
            return (
              <React.Fragment key={section.id}>
                <ImageSliderSection
                  section={section}
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                />
              </React.Fragment>
            );
          }
          return <React.Fragment key={section.id}>{renderCustomSection(section)}</React.Fragment>;
        }
        switch (section.id) {
          case 'hero':
            return <React.Fragment key={section.id}>{renderHero()}</React.Fragment>;
          case 'trust_badges':
            return <React.Fragment key={section.id}>{renderTrustBadges()}</React.Fragment>;
          case 'categories':
            return <React.Fragment key={section.id}>{renderCategories(section)}</React.Fragment>;
          case 'hp_bento_showcase':
            return (
              <React.Fragment key={section.id}>
                <HPBentoShowcase
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                />
              </React.Fragment>
            );
          case 'hp_compatibility_banner':
            return (
              <React.Fragment key={section.id}>
                <HPCompatibilityBanner
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                />
              </React.Fragment>
            );
          case 'popular_categories_showcase':
            return (
              <React.Fragment key={section.id}>
                <PopularCategoriesShowcase
                  products={products}
                  currency={currency}
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              </React.Fragment>
            );
          case 'hp_efficiency_strip':
            return (
              <React.Fragment key={section.id}>
                <HPEfficiencyStrip
                  setActivePage={setActivePage}
                  onSelectCategory={onSelectCategory}
                />
              </React.Fragment>
            );
          case 'flash_deals':
            return <React.Fragment key={section.id}>{renderFlashDeals(section)}</React.Fragment>;
          case 'featured_tabs':
            return <React.Fragment key={section.id}>{renderFeaturedTabs(section)}</React.Fragment>;
          case 'toner_slider':
            return <React.Fragment key={section.id}>{renderTonerSlider()}</React.Fragment>;
          case 'anti_counterfeit':
            return (
              <React.Fragment key={section.id}>
                {!activeSections.some(s => s.id === 'toner_slider') && renderTonerSlider()}
                {renderAntiCounterfeitBanner()}
              </React.Fragment>
            );
          case 'quote_banner':
            return (
              <React.Fragment key={section.id}>
                {!activeSections.some(s => s.id === 'toner_slider') && !activeSections.some(s => s.id === 'anti_counterfeit') && renderTonerSlider()}
                {!activeSections.some(s => s.id === 'anti_counterfeit') && renderAntiCounterfeitBanner()}
                {renderQuoteBanner()}
              </React.Fragment>
            );
          case 'brand_partners':
            return <React.Fragment key={section.id}>{renderBrandPartners()}</React.Fragment>;
          case 'clients':
            return null;
          case 'testimonials':
            return <React.Fragment key={section.id}>{renderTestimonials()}</React.Fragment>;
          default:
            return null;
        }
      })}
    </div>
  );
};
