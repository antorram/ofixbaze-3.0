import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { Product, Currency, ActivePage, SiteCustomizerConfig, Category, CMSPage } from '../types';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { SlideConfig } from '../data/adminData';
import { CMSSectionRenderer } from '../components/CMSSectionRenderer';

// Modern Marketplace Components
import { MarketplaceHeroArea } from '../components/marketplace/MarketplaceHeroArea';
import { CategoryScroller } from '../components/marketplace/CategoryScroller';
import { FlashSaleSection } from '../components/marketplace/FlashSaleSection';
import { PopularCategoriesSection } from '../components/marketplace/PopularCategoriesSection';
import { ProductCarousel } from '../components/marketplace/ProductCarousel';
import { PromoBanner } from '../components/marketplace/PromoBanner';
import { CategoryProductSection } from '../components/marketplace/CategoryProductSection';
import { BrandSection } from '../components/marketplace/BrandSection';
import { MarketplaceProductCard } from '../components/MarketplaceProductCard';
import { isProductInCategory } from '../utils/categoryMatcher';

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
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  // Filter products for various sections dynamically
  const featuredProducts = useMemo(() => {
    const featured = products.filter(p => p.isFeatured);
    return featured.length > 0 ? featured : products.slice(0, 10);
  }, [products]);

  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.id.localeCompare(a.id)))
      .slice(0, 10);
  }, [products]);

  const bestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => ((b.rating || 4.8) - (a.rating || 4.8)))
      .slice(0, 10);
  }, [products]);

  const recommendedProducts = useMemo(() => {
    return products.slice(0, 12);
  }, [products]);

  // Major categories to feature in dedicated category product shelves
  const majorCategorySlugs = ['toners', 'printer', 'office-chairs', 'executive-tables', 'ups', 'inks'];
  const activeCategoryList = displayCategories.filter(cat => 
    majorCategorySlugs.includes(cat.slug) || 
    products.some(p => isProductInCategory(p, cat.slug))
  );

  // If a published CMS page with custom sections is explicitly activated
  if (cmsPage && cmsPage.status === 'published' && cmsPage.sections && cmsPage.sections.length > 0) {
    return (
      <div className="space-y-0 pb-16">
        {cmsPage.sections
          .filter(s => s.enabled)
          .map((section) => (
            <CMSSectionRenderer
              key={section.id}
              section={section}
              products={products}
              categories={displayCategories}
              currency={currency}
              setActivePage={setActivePage}
              onSelectCategory={onSelectCategory}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onOpenAuthenticityModal={onOpenAuthenticityModal}
              slides={slides}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-16 bg-slate-50/70">
      
      {/* 4. HERO / BANNER AREA */}
      {/* Left: Department navigation, Center: Large promo carousel, Right: Corporate RFQ & Authenticity Deal Cards */}
      <MarketplaceHeroArea
        setActivePage={setActivePage}
        onSelectCategory={onSelectCategory}
        onOpenAuthenticityModal={onOpenAuthenticityModal}
        categories={displayCategories}
      />

      {/* Trust & Guarantee Strip */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5 p-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Genuine OEM</h4>
              <p className="text-[10px] text-slate-500">Security hologram seal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Same-Day Dispatch</h4>
              <p className="text-[10px] text-slate-500">Fast delivery across Lagos</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Corporate RFQ Desk</h4>
              <p className="text-[10px] text-slate-500">VAT invoices &amp; PO terms</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Official Warranty</h4>
              <p className="text-[10px] text-slate-500">Factory replacement backing</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CATEGORY SHORTCUTS */}
      <CategoryScroller
        categories={displayCategories}
        products={products}
        onSelectCategory={onSelectCategory}
        setActivePage={setActivePage}
      />

      {/* 6. FLASH SALE */}
      <FlashSaleSection
        products={products}
        currency={currency}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        onQuickView={onQuickView}
        onSelectProduct={onSelectProduct}
        setActivePage={setActivePage}
      />

      {/* 7. POPULAR CATEGORIES */}
      <PopularCategoriesSection
        categories={displayCategories}
        products={products}
        onSelectCategory={onSelectCategory}
        setActivePage={setActivePage}
      />

      {/* 8. FEATURED PRODUCTS (Full-Width Responsive Product Carousel) */}
      <ProductCarousel
        title="Featured Products"
        badge="Editor's Selection"
        subtitle="Top-rated enterprise printers, OEM toners, and executive chairs"
        products={featuredProducts}
        currency={currency}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        onQuickView={onQuickView}
        onSelectProduct={onSelectProduct}
        onViewAll={() => {
          onSelectCategory('all');
          setActivePage('shop');
        }}
        viewAllText="View All Featured"
      />

      {/* 9. PROMOTIONAL BANNER */}
      <PromoBanner
        setActivePage={setActivePage}
        onOpenAuthenticityModal={onOpenAuthenticityModal}
        onSelectCategory={onSelectCategory}
      />

      {/* 10. CATEGORY PRODUCT SECTIONS (Printers, Toners, Office Chairs, Tables, etc.) */}
      {activeCategoryList.slice(0, 3).map((category) => (
        <CategoryProductSection
          key={category.id}
          category={category}
          products={products}
          currency={currency}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={onQuickView}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          setActivePage={setActivePage}
          maxItems={6}
        />
      ))}

      {/* 11. NEW ARRIVALS */}
      <ProductCarousel
        title="New Arrivals"
        badge="Fresh Stock"
        subtitle="Latest equipment arrivals fresh in our Lagos warehouse"
        products={newArrivals}
        currency={currency}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        onQuickView={onQuickView}
        onSelectProduct={onSelectProduct}
        onViewAll={() => {
          onSelectCategory('all');
          setActivePage('shop');
        }}
        viewAllText="Browse New In"
      />

      {/* 12. BEST SELLERS */}
      <ProductCarousel
        title="Best Sellers"
        badge="Highest Demand"
        subtitle="Most ordered supplies by Nigerian corporate procurement offices"
        products={bestSellers}
        currency={currency}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        onQuickView={onQuickView}
        onSelectProduct={onSelectProduct}
        onViewAll={() => {
          onSelectCategory('all');
          setActivePage('shop');
        }}
        viewAllText="Browse Best Sellers"
      />

      {/* 13. MORE CATEGORY COLLECTIONS (UPS, Inks, Accessories, Executive Tables) */}
      {activeCategoryList.slice(3, 6).map((category) => (
        <CategoryProductSection
          key={category.id}
          category={category}
          products={products}
          currency={currency}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={onQuickView}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          setActivePage={setActivePage}
          maxItems={6}
        />
      ))}

      {/* 14. BRANDS / COLLECTIONS */}
      <BrandSection
        products={products}
        setActivePage={setActivePage}
      />

      {/* 15. RECOMMENDED PRODUCTS (Dense 6-Column Grid) */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Personalized For You
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Recommended Products
              </h2>
            </div>
            <button
              onClick={() => {
                onSelectCategory('all');
                setActivePage('shop');
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {recommendedProducts.map((product) => (
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

    </div>
  );
};
