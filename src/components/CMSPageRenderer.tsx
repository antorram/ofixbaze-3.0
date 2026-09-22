import React from 'react';
import { CMSPage, Product, Category, Currency, ActivePage } from '../types';
import { SlideConfig } from '../data/adminData';
import { CMSSectionRenderer } from './CMSSectionRenderer';

interface CMSPageRendererProps {
  page: CMSPage;
  products: Product[];
  categories: Category[];
  currency: Currency;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory?: (slug: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
  onQuickView?: (product: Product) => void;
  onOpenAuthenticityModal?: () => void;
  slides?: SlideConfig[];
}

export const CMSPageRenderer: React.FC<CMSPageRendererProps> = ({
  page,
  products,
  categories,
  currency,
  setActivePage,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onQuickView,
  onOpenAuthenticityModal,
  slides
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      {page.sections && page.sections.length > 0 ? (
        page.sections
          .filter(section => section.enabled)
          .map(section => (
            <CMSSectionRenderer
              key={section.id}
              section={section}
              products={products}
              categories={categories}
              currency={currency}
              setActivePage={setActivePage}
              onSelectCategory={onSelectCategory}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={onQuickView}
              onOpenAuthenticityModal={onOpenAuthenticityModal}
              slides={slides}
            />
          ))
      ) : (
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">{page.title}</h1>
          <p className="text-slate-500">This page has no sections configured yet.</p>
        </div>
      )}
    </div>
  );
};
