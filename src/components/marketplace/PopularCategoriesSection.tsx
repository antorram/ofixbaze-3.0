import React from 'react';
import { ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { Category, Product, ActivePage } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { isProductInCategory } from '../../utils/categoryMatcher';

interface PopularCategoriesSectionProps {
  categories?: Category[];
  products: Product[];
  onSelectCategory: (categorySlug: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const PopularCategoriesSection: React.FC<PopularCategoriesSectionProps> = ({
  categories,
  products,
  onSelectCategory,
  setActivePage,
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  const majorCategories = displayCategories.slice(0, 6);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            Featured Collections
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Popular Categories
          </h2>
        </div>
        <button
          onClick={() => {
            onSelectCategory('all');
            setActivePage('shop');
          }}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>All Categories</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {majorCategories.map((category) => {
          const count = products.filter((p) => isProductInCategory(p, category.slug)).length;
          return (
            <div
              key={category.id}
              onClick={() => {
                onSelectCategory(category.slug);
                setActivePage('shop');
              }}
              className="group relative bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="relative pt-[70%] bg-slate-50 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {count > 0 ? `${count} Products` : 'Catalog items'}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700">
                  <span>View Products</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
