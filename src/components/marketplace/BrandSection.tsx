import React from 'react';
import { Award, ShieldCheck, ChevronRight } from 'lucide-react';
import { ActivePage, Product } from '../../types';

interface BrandSectionProps {
  products: Product[];
  setActivePage: (page: ActivePage) => void;
  onSelectCategoryAndKeyword?: (categorySlug: string, keyword: string) => void;
}

export const BrandSection: React.FC<BrandSectionProps> = ({
  products,
  setActivePage,
  onSelectCategoryAndKeyword,
}) => {
  // Extract real unique brands from products
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));

  const brandLogos: Record<string, string> = {
    HP: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg',
    Sharp: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg',
  };

  const handleBrandClick = (brandName: string) => {
    if (onSelectCategoryAndKeyword) {
      onSelectCategoryAndKeyword('all', brandName);
    } else {
      setActivePage('shop');
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Direct Manufacturer Supply
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              Authorized Brands &amp; OEM Partners
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            100% Genuine Factory Warranted Equipment
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {uniqueBrands.slice(0, 6).map((brand, i) => {
            const productCount = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase()).length;
            const logo = brandLogos[brand];

            return (
              <div
                key={i}
                onClick={() => handleBrandClick(brand)}
                className="group p-3.5 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center min-h-[95px]"
              >
                {logo ? (
                  <div className="h-9 flex items-center justify-center mb-1.5">
                    <img
                      src={logo}
                      alt={brand}
                      className="max-h-7 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition duration-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-9 flex items-center justify-center mb-1.5">
                    <span className="text-sm font-black text-slate-800 group-hover:text-orange-600 transition">
                      {brand}
                    </span>
                  </div>
                )}
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-orange-600 transition">
                  {brand}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {productCount} Verified Items
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
