import React from 'react';
import { ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { Category, Product, Currency, ActivePage } from '../../types';
import { MarketplaceProductCard } from '../MarketplaceProductCard';
import { isProductInCategory } from '../../utils/categoryMatcher';

interface CategoryProductSectionProps {
  category: Category;
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  setActivePage: (page: ActivePage) => void;
  maxItems?: number;
}

export const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  category,
  products,
  currency,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  onSelectCategory,
  setActivePage,
  maxItems = 6,
}) => {
  // Dynamically filter products belonging to this category
  const categoryProducts = products
    .filter((p) => isProductInCategory(p, category.slug))
    .slice(0, maxItems);

  if (categoryProducts.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3.5">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {category.name}
                </h2>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {categoryProducts.length}+ In Stock
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {category.description || `Browse original ${category.name} equipment and corporate supplies`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectCategory(category.slug);
              setActivePage('shop');
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <span>View All {category.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Grid: 6 columns on desktop, 4 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryProducts.map((product) => (
            <MarketplaceProductCard
              key={product.id}
              product={product}
              currency={currency}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
              compact
            />
          ))}
        </div>

      </div>
    </section>
  );
};
