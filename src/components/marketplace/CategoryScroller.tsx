import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Category, Product, ActivePage } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { isProductInCategory } from '../../utils/categoryMatcher';

interface CategoryScrollerProps {
  categories?: Category[];
  products: Product[];
  onSelectCategory: (categorySlug: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  categories,
  products,
  onSelectCategory,
  setActivePage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs relative">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              Explore Departments
            </h3>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Scroller */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        >
          {displayCategories.map((category) => {
            const count = products.filter((p) => isProductInCategory(p, category.slug)).length;
            return (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.slug);
                  setActivePage('shop');
                }}
                className="group shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 hover:border-orange-400 bg-slate-50/70 hover:bg-orange-50/30 transition-all duration-150 cursor-pointer w-[100px] sm:w-[115px] text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1.5 shadow-2xs group-hover:scale-105 group-hover:shadow-sm transition-all duration-200 flex items-center justify-center overflow-hidden border border-slate-200/80 mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {category.name}
                </span>
                <span className="text-[9px] font-medium text-slate-400 mt-0.5">
                  {count > 0 ? `${count} items` : 'Browse'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
