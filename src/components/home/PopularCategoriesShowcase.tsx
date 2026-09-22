import React, { useState } from 'react';
import { ArrowRight, Monitor, Tv, Wrench, Printer, ChevronRight, Check } from 'lucide-react';
import { Product, Currency, ActivePage } from '../../types';

interface PopularCategoriesShowcaseProps {
  products: Product[];
  currency: Currency;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const PopularCategoriesShowcase: React.FC<PopularCategoriesShowcaseProps> = ({
  products,
  currency,
  setActivePage,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'fuser' | 'transfer' | 'maintenance' | 'printers'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { id: 'all', label: 'ALL PRODUCTS', icon: null },
    { id: 'fuser', label: 'FUSER KIT', icon: Monitor },
    { id: 'transfer', label: 'TRANSFER KIT', icon: Tv },
    { id: 'maintenance', label: 'MAINTENANCE KIT', icon: Wrench },
    { id: 'printers', label: 'PRINTERS', icon: Printer },
  ];

  // Specific HP 651A / Enterprise Toner products matching screenshot
  const hp651AProducts = products.filter(p => 
    p.id.includes('651a') || 
    p.name.includes('651A') ||
    p.id.includes('59a') ||
    p.id.includes('85a')
  );

  // Fallback if less than 5 items
  const displayProducts = hp651AProducts.length >= 5 
    ? hp651AProducts.slice(0, 5) 
    : [...hp651AProducts, ...products.filter(p => p.category === 'toners-cartridges')].slice(0, 5);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" aria-label="Popular Categories & Corporate Consumables">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Categories
            </h3>
          </div>

          {/* Middle Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: All Categories Button */}
          <button
            onClick={() => {
              onSelectCategory('all');
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-xs font-bold transition cursor-pointer self-start lg:self-center shrink-0 shadow-xs"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body: Left Quote Card + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Special Card (Span 3) - Beige / Warm Sand Theme */}
          <div className="lg:col-span-3 bg-[#ede2d8] rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#ded1c5] min-h-[380px]">
            <div className="space-y-4">
              {/* Product Visual */}
              <div className="w-full h-44 rounded-xl overflow-hidden bg-white/40 flex items-center justify-center p-2">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
                  alt="Enterprise Office Gear"
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  Request A No-Obligation Free Quote
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  If you have questions on product prices and Stock Availability, Please dont hesitate to contact us.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setActivePage('rfq')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#522319] hover:bg-[#3d170f] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Request Free Quote</span>
              </button>
            </div>
          </div>

          {/* Right Product Grid (Span 9) - 5 Product Columns */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-stretch">
            {displayProducts.map((product) => {
              const colorSpec = product.features.find(f => f.toUpperCase().includes('COLOR:')) || 
                               (product.specs && product.specs['Color'] ? `COLOR: ${product.specs['Color'].toUpperCase()}` : 'COLOR: BLACK');
              const yieldSpec = product.features.find(f => f.toUpperCase().includes('YIELD:')) || 
                               (product.yieldPages ? `YIELD: ${product.yieldPages}` : 'YIELD: 16,000 PAGES.');
              const printerSpec = product.features.find(f => f.toUpperCase().includes('PRINTER:')) || 
                                 'PRINTER: WORKS WITH HP LASERJET ENTERPRISE M775DN';

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer"
                >
                  <div>
                    {/* Product Image Square */}
                    <div className="w-full aspect-square rounded-lg bg-slate-50 p-2 mb-3 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-102 transition-transform">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Title */}
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                      {product.name}
                    </h5>

                    {/* Price Status */}
                    <div className="text-xs font-black text-orange-600 uppercase tracking-tight mb-1">
                      Price on Request
                    </div>

                    {/* Stock status */}
                    <div className="text-[11px] font-bold text-emerald-600 mb-3">
                      IN STOCK
                    </div>

                    {/* Bullet Specs matching image styling */}
                    <div className="space-y-1.5 text-[9px] text-slate-600 font-medium border-t border-slate-100 pt-2.5 leading-tight">
                      <div className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold shrink-0">✓✓</span>
                        <span className="line-clamp-2">{colorSpec.replace('COLOR:', 'COLOR: ')}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold shrink-0">✓✓</span>
                        <span className="line-clamp-2">{yieldSpec.replace('YIELD:', 'YIELD: ')}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold shrink-0">✓✓</span>
                        <span className="line-clamp-3">{printerSpec.replace('PRINTER:', 'PRINTER: ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add To Cart Quick Action on hover or mobile */}
                  <div className="pt-3 mt-2 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="w-full py-1.5 px-2 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold rounded-lg transition shadow-xs cursor-pointer text-center"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Pagination matching screenshot */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-700">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                currentPage === page
                  ? 'bg-[#bae6fd] text-[#0369a1] font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 text-slate-400">...</span>

          {[36, 37, 38].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                currentPage === page
                  ? 'bg-[#bae6fd] text-[#0369a1] font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 38))}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer text-slate-700"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
