import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  Search,
  X,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { isProductInCategory } from '../utils/categoryMatcher';

interface ShopPageProps {
  currency: Currency;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
  categories?: Category[];
  searchKeyword?: string;
  onSearchKeywordChange?: (keyword: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  currency,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onSelectProduct,
  products = PRODUCTS,
  categories,
  searchKeyword: externalSearchKeyword,
  onSearchKeywordChange
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [oemOnly, setOemOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearchKeyword, setLocalSearchKeyword] = useState<string>(externalSearchKeyword || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync external search keyword if provided
  useEffect(() => {
    if (externalSearchKeyword !== undefined) {
      setLocalSearchKeyword(externalSearchKeyword);
    }
  }, [externalSearchKeyword]);

  const searchKeyword = externalSearchKeyword !== undefined ? externalSearchKeyword : localSearchKeyword;
  const setSearchKeyword = (kw: string) => {
    setLocalSearchKeyword(kw);
    if (onSearchKeywordChange) {
      onSearchKeywordChange(kw);
    }
  };

  // Derive unique brands
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(p => brandSet.add(p.brand));
    return Array.from(brandSet);
  }, [products]);

  // Calculate live dynamic counts for every category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    displayCategories.forEach(cat => {
      counts[cat.slug] = products.filter(p => isProductInCategory(p, cat.slug)).length;
    });
    return counts;
  }, [products, displayCategories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter (using robust matcher supporting legacy and aliases)
      if (selectedCategory !== 'all' && !isProductInCategory(p, selectedCategory)) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // OEM only filter
      if (oemOnly && !p.isOriginalOEM) {
        return false;
      }
      // Search keyword
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matches = p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.priceNGN - b.priceNGN;
      if (sortBy === 'price-desc') return b.priceNGN - a.priceNGN;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, inStockOnly, oemOnly, searchKeyword, sortBy]);

  const activeCategoryObj = displayCategories.find(c => c.slug === selectedCategory);

  const handleResetFilters = () => {
    onSelectCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setOemOnly(false);
    setSearchKeyword('');
    setSortBy('featured');
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <button onClick={() => onSelectCategory('all')} className="hover:text-blue-600 cursor-pointer">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-900">
          {activeCategoryObj ? activeCategoryObj.name : 'All Products & Departments'}
        </span>
      </nav>

      {/* Category Header Banner (Supports Image Banner or Image Banner Instead of Name) */}
      {(() => {
        const hasBanner = !!activeCategoryObj?.bannerImage;
        const isImageOnly = hasBanner && activeCategoryObj?.showBannerImageOnly;
        const bannerHeightClass = 
          activeCategoryObj?.bannerHeight === 'compact' ? 'h-36 sm:h-44' :
          activeCategoryObj?.bannerHeight === 'large' ? 'min-h-[260px] sm:min-h-[340px]' :
          'min-h-[190px] sm:min-h-[230px]';

        if (isImageOnly && activeCategoryObj?.bannerImage) {
          return (
            <div className="mb-8 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 bg-slate-900 group">
              <img
                src={activeCategoryObj.bannerImage}
                alt={activeCategoryObj.name}
                className="w-full object-cover max-h-[380px] min-h-[160px]"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 shadow-xs">
                {activeCategoryObj.name}
              </div>
            </div>
          );
        }

        if (hasBanner && activeCategoryObj?.bannerImage) {
          return (
            <div className={`text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-xl ${bannerHeightClass} flex items-center bg-slate-900`}>
              {/* Background Banner Image */}
              <img
                src={activeCategoryObj.bannerImage}
                alt={activeCategoryObj.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient Overlay for high readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent z-1" />

              <div className="relative z-10 max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-blue-700/50 shadow-xs">
                  Ofixbaze Catalog
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 drop-shadow-xs">
                  {activeCategoryObj.bannerTitle || activeCategoryObj.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed drop-shadow-xs max-w-xl">
                  {activeCategoryObj.bannerSubtitle || activeCategoryObj.description}
                </p>
              </div>
            </div>
          );
        }

        // Default standard dark banner when no bannerImage is specified
        return (
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-md">
            <div className="relative z-10 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                Ofixbaze Catalog
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white mt-2">
                {activeCategoryObj ? activeCategoryObj.name : 'Office Technology, Printers & Supplies'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {activeCategoryObj 
                  ? activeCategoryObj.description 
                  : 'Explore verified original HP cartridges, copiers, shredders, currency counters, and executive office equipment with official warranty.'}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Subcategories Filter Chips */}
      {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
        <div className="mb-6 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Explore {activeCategoryObj.name} Subcategories:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchKeyword('')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                !searchKeyword ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All {activeCategoryObj.name}
            </button>
            {activeCategoryObj.subcategories.map(sub => {
              const isSelected = searchKeyword.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => setSearchKeyword(isSelected ? '' : sub)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Filter Toggle & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </span>
        </div>

        {/* Controls: Search, Sort, Grid/List view */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* In-catalog Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter products..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 w-44"
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Product Name (A - Z)</option>
              <option value="name-desc">Product Name (Z - A)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block space-y-6 sticky top-24 bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              Filter Catalog
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">Departments</h4>
            <div className="space-y-1">
              <button
                onClick={() => onSelectCategory('all')}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  {products.length}
                </span>
              </button>

              {displayCategories.map(cat => {
                const count = categoryCounts[cat.slug] ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0 font-medium">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Brand</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === 'all'}
                  onChange={() => setSelectedBrand('all')}
                  className="text-blue-600"
                />
                <span>All Brands</span>
              </label>
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    className="text-blue-600"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Authenticity & Availability Toggles */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Availability & OEM</h4>
            
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={oemOnly}
                onChange={(e) => setOemOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Genuine OEM Only
              </span>
            </label>
          </div>
        </aside>

        {/* Products Grid / List */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching your specific combination of filters. Try clearing your filters or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 flex flex-col sm:flex-row items-center gap-5 cursor-pointer transition shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-28 h-28 object-contain rounded-lg p-2 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {product.brand}
                      </span>
                      {product.isOriginalOEM && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Genuine OEM
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                      <span className="font-semibold text-emerald-600">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span>•</span>
                      <span>Warranty: {product.warranty}</span>
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-slate-100 sm:pl-5 flex flex-col items-end justify-center shrink-0 w-full sm:w-auto">
                    <div className="text-right mb-3">
                      <span className="inline-block text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded border border-orange-200/60">
                        Price on Request
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, 1);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                      <span>Add to Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white p-5 shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Departments</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { onSelectCategory('all'); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {products.length}
                    </span>
                  </button>
                  {displayCategories.map(cat => {
                    const count = categoryCounts[cat.slug] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { onSelectCategory(cat.slug); setIsMobileFilterOpen(false); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat.slug
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0 font-medium">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
