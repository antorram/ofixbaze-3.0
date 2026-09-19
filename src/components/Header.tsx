import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Minus,
  FileText, 
  Truck, 
  Check, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer,
  Droplets,
  Zap,
  Layers,
  Package,
  Armchair,
  Building2,
  PhoneCall
} from 'lucide-react';
import { ActivePage, Currency, Product, StoreSettings, Category, NavMenuItem } from '../types';
import { formatPrice } from '../utils/currency';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { DEFAULT_NAV_MENU } from '../data/defaultMenu';
import { isProductInCategory } from '../utils/categoryMatcher';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cartCount: number;
  wishlistCount: number;
  cartTotalNGN: number;
  onOpenCart: () => void;
  onOpenAuthenticityModal: () => void;
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onSelectCategoryAndKeyword?: (categorySlug: string, keyword?: string) => void;
  products?: Product[];
  categories?: Category[];
  navMenu?: NavMenuItem[];
  settings?: StoreSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  currency,
  setCurrency,
  cartCount,
  wishlistCount,
  cartTotalNGN,
  onOpenCart,
  onOpenAuthenticityModal,
  onSelectProduct,
  selectedCategory,
  onSelectCategory,
  onSelectCategoryAndKeyword,
  products = PRODUCTS,
  categories,
  navMenu = DEFAULT_NAV_MENU,
  settings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [activeDropdownMenuId, setActiveDropdownMenuId] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    'nav-products': true,
    'nav-office-furniture': true
  });
  const [logoError, setLogoError] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);

  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  const displayNavMenu = navMenu && navMenu.length > 0 ? navMenu : DEFAULT_NAV_MENU;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (navBarRef.current && !navBarRef.current.contains(event.target as Node)) {
        setActiveDropdownMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length > 1 
    ? products.filter(p => {
        const matchesCategory = searchCategory === 'all' || isProductInCategory(p, searchCategory);
        const matchesText = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesText;
      }).slice(0, 5)
    : [];

  const handleSearchResultClick = (product: Product) => {
    onSelectProduct(product);
    setActivePage('product-detail');
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleNavigate = (categorySlug?: string, searchKeyword?: string) => {
    if (onSelectCategoryAndKeyword) {
      onSelectCategoryAndKeyword(categorySlug || 'all', searchKeyword || '');
    } else {
      onSelectCategory(categorySlug || 'all');
      setActivePage('shop');
    }
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setActiveDropdownMenuId(null);
  };

  const toggleMobileExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* LEVEL 1: Corporate Utility Bar */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800/90 text-[11px] py-1.5 select-none">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between gap-3">
          {/* Left: Value Props */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1.5 shrink-0 text-slate-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine OEM Products</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 shrink-0 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Same-Day Lagos Delivery • Nationwide Dispatch</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 shrink-0 text-amber-400 font-medium">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Corporate Procurement Desk (RFQ)</span>
            </span>
          </div>

          {/* Right: Quick Links, Support & Currency */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium text-slate-400">
            <button
              onClick={() => setActivePage('track-order')}
              className={`hover:text-white transition flex items-center gap-1 text-[11px] cursor-pointer ${
                activePage === 'track-order' ? 'text-blue-400 font-bold' : ''
              }`}
            >
              <Truck className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Track Order</span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <button
              onClick={() => setActivePage('rfq')}
              className="hover:text-amber-300 transition flex items-center gap-1 text-[11px] text-amber-400/90 cursor-pointer font-bold"
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>Corporate RFQ</span>
            </button>
            <span className="hidden md:inline text-slate-700">|</span>
            <a
              href="tel:09069425822"
              className="hidden md:flex items-center gap-1 hover:text-white transition text-[11px] text-slate-300"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>0906-942-5822</span>
            </a>
            {/* Currency Selector */}
            <div className="flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              <span className="text-slate-400 text-[10px] font-bold">CUR:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                <option value="NGN" className="bg-slate-900 text-white">NGN (₦)</option>
                <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                <option value="BDT" className="bg-slate-900 text-white">BDT (৳)</option>
                <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 2: Main Header Row */}
      <div className="w-full py-3">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center cursor-pointer select-none group shrink-0"
          >
            <div className="flex flex-col">
              <div className="relative h-11 flex items-center">
                {!logoError ? (
                  <img 
                    src="https://ofixbaze.com/wp-content/uploads/2020/04/LOGO.jpg" 
                    alt="OFIXBAZE Nigeria Limited" 
                    className="h-10 w-auto object-contain max-w-[170px] transition-transform group-hover:scale-102"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                    OFIXBAZE
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 -mt-1 hidden sm:block">
                RC: 1489201 • B2B Procurement
              </span>
            </div>
          </div>

          {/* Search Bar with Live Results (Visually Prominent) */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl xl:max-w-3xl hidden md:block">
            <div className="flex items-center border-2 border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 rounded-xl overflow-hidden transition-all bg-white shadow-2xs">
              {/* Category Dropdown inside Search */}
              <select
                id="header-search-category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                aria-label="Filter search by category"
                className="bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 px-3 border-r border-slate-200 focus:outline-none cursor-pointer max-w-[145px] truncate"
              >
                <option value="all">All Departments</option>
                {displayCategories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>

              <input
                id="header-search-input"
                type="text"
                placeholder="Search genuine toners, printers, UPS, office furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button 
                id="header-search-submit-btn"
                onClick={() => {
                  handleNavigate(searchCategory, searchQuery);
                  setIsSearchFocused(false);
                }}
                className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 text-orange-400 group-hover:text-white" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>

            {/* Live Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-100">
                <div className="p-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span>Matching OEM Products ({searchResults.length})</span>
                  <span className="text-orange-600 font-semibold cursor-pointer" onClick={() => handleNavigate(searchCategory, searchQuery)}>View all results →</span>
                </div>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product)}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-contain bg-slate-100/70 p-1 rounded-lg shrink-0 border border-slate-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate hover:text-orange-600 transition-colors">{product.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> OEM Genuine
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">
                        {formatPrice(product.priceNGN, currency)}
                      </div>
                      {product.originalPriceNGN && product.originalPriceNGN > product.priceNGN && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatPrice(product.originalPriceNGN, currency)}
                        </div>
                      )}
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct RFQ Button */}
            <button
              id="header-rfq-button"
              onClick={() => setActivePage('rfq')}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-extrabold text-orange-900 bg-orange-100/80 hover:bg-orange-200/90 border border-orange-300 rounded-xl transition cursor-pointer shadow-2xs group"
            >
              <FileText className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
              <span>Request Corporate Quote</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-button"
              onClick={() => setActivePage('wishlist')}
              className={`p-2.5 relative rounded-xl transition cursor-pointer border ${
                activePage === 'wishlist' 
                  ? 'text-rose-600 bg-rose-50 border-rose-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3 sm:px-3.5 py-2 bg-slate-900 hover:bg-orange-600 text-white rounded-xl transition shadow-xs cursor-pointer border border-slate-800 group"
              aria-label={`Shopping cart with ${cartCount} items`}
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-up">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-orange-100">Cart</span>
                <span className="text-xs font-black text-white">
                  {cartTotalNGN > 0 ? formatPrice(cartTotalNGN, currency) : '₦0'}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer border border-slate-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* LEVEL 3: Primary Navigation Bar */}
      <nav ref={navBarRef} className="bg-slate-900 text-white border-t border-slate-800 relative z-30">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between">
          
          <div className="flex items-center">
            {/* All Departments Dropdown Toggle Button */}
            <div className="relative">
              <button
                id="nav-all-categories-btn"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setActiveDropdownMenuId(null);
                }}
                className="flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 transition cursor-pointer select-none"
              >
                <Menu className="w-4 h-4" />
                <span>All Departments</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* All Departments Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-2xl rounded-b-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {displayCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigate(cat.slug)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center justify-between group transition cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-4 pb-1">
                    <button
                      onClick={() => handleNavigate('all')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Browse Entire Catalog →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="flex items-center text-xs font-medium pl-2">
              {displayNavMenu.filter(item => item.enabled).map(item => {
                const hasChildren = item.children && item.children.length > 0;
                const isDropdownOpen = activeDropdownMenuId === item.id;
                const isItemActive = 
                  (item.target === 'home' && activePage === 'home') ||
                  (item.target === 'shop' && activePage === 'shop' && (!item.categorySlug || selectedCategory === item.categorySlug)) ||
                  (item.target === 'about' && activePage === 'about') ||
                  (item.target === 'contact' && activePage === 'contact') ||
                  (item.target === 'rfq' && activePage === 'rfq');

                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => {
                      if (hasChildren) setActiveDropdownMenuId(item.id);
                    }}
                  >
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          setActiveDropdownMenuId(isDropdownOpen ? null : item.id);
                        } else if (item.target === 'home') {
                          setActivePage('home');
                        } else if (item.target === 'shop') {
                          handleNavigate(item.categorySlug || 'all');
                        } else if (item.target === 'rfq') {
                          setActivePage('rfq');
                        } else if (item.target === 'about') {
                          setActivePage('about');
                        } else if (item.target === 'contact') {
                          setActivePage('contact');
                        }
                      }}
                      className={`py-3.5 px-3.5 transition cursor-pointer hover:text-blue-400 relative flex items-center gap-1.5 ${
                        isItemActive || isDropdownOpen
                          ? 'text-blue-400 font-semibold' 
                          : 'text-slate-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasChildren && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-orange-500 text-white leading-none">
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Rich Dropdown / Mega Menu for Products */}
                    {hasChildren && isDropdownOpen && item.label === 'Products' && (
                      <div 
                        onMouseLeave={() => setActiveDropdownMenuId(null)}
                        className="absolute top-full left-0 w-[850px] bg-white text-slate-800 shadow-2xl rounded-b-2xl border border-slate-200 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
                              Products Catalog
                            </span>
                            <span className="text-xs text-slate-500">
                              Genuine Office Technology & Supplies
                            </span>
                          </div>
                          <button
                            onClick={() => handleNavigate('all')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>View All Products</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 4-Column Grid for Products Hierarchy */}
                        <div className="grid grid-cols-4 gap-6">
                          {item.children?.map(subGroup => (
                            <div key={subGroup.id} className="space-y-2">
                              {/* SubGroup Title (e.g. PRINTER, TONERS, etc.) */}
                              <button
                                onClick={() => handleNavigate(subGroup.categorySlug || 'all')}
                                className="w-full text-left font-black text-xs text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-200 hover:text-blue-600 transition flex items-center justify-between group cursor-pointer"
                              >
                                <span>{subGroup.label}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                              </button>

                              {/* Nested Subcategories / Items */}
                              <div className="space-y-1">
                                {subGroup.children?.map(child => (
                                  <button
                                    key={child.id}
                                    onClick={() => handleNavigate(child.categorySlug || subGroup.categorySlug, child.searchKeyword || child.label)}
                                    className="w-full text-left py-1 px-1.5 rounded text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                    <span className="truncate">{child.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mega Menu Footer Banner */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-slate-800">100% Original OEM Guarantee</span>
                            <span>— All items come with manufacturer security seals & Lagos warranty.</span>
                          </div>
                          <button
                            onClick={() => { setActivePage('rfq'); setActiveDropdownMenuId(null); }}
                            className="text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
                          >
                            Corporate Tender? Request Quote →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rich Dropdown for Office Furniture */}
                    {hasChildren && isDropdownOpen && item.label === 'Office Furniture' && (
                      <div 
                        onMouseLeave={() => setActiveDropdownMenuId(null)}
                        className="absolute top-full left-0 w-[420px] bg-white text-slate-800 shadow-2xl rounded-b-2xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                          <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                            Office Furniture
                          </span>
                          <button
                            onClick={() => handleNavigate('office-furniture')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            All Furniture →
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {item.children?.map(subGroup => (
                            <div key={subGroup.id} className="space-y-2">
                              <button
                                onClick={() => handleNavigate(subGroup.categorySlug || 'office-furniture')}
                                className="w-full text-left font-black text-xs text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 hover:text-blue-600 transition flex items-center justify-between group cursor-pointer"
                              >
                                <span>{subGroup.label}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                              </button>

                              <div className="space-y-1">
                                {subGroup.children && subGroup.children.length > 0 ? (
                                  subGroup.children.map(child => (
                                    <button
                                      key={child.id}
                                      onClick={() => handleNavigate(child.categorySlug || subGroup.categorySlug, child.searchKeyword || child.label)}
                                      className="w-full text-left py-1 px-1.5 rounded text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                      <span className="truncate">{child.label}</span>
                                    </button>
                                  ))
                                ) : (
                                  <button
                                    onClick={() => handleNavigate(subGroup.categorySlug || 'executive-tables')}
                                    className="w-full text-left py-1 px-1.5 rounded text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    View Executive Desks & Tables
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generic Dropdown for Any Other Menu with Sub-Categories */}
                    {hasChildren && isDropdownOpen && item.label !== 'Products' && item.label !== 'Office Furniture' && (
                      <div 
                        onMouseLeave={() => setActiveDropdownMenuId(null)}
                        className="absolute top-full left-0 min-w-[280px] max-w-[420px] bg-white text-slate-800 shadow-2xl rounded-b-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                          <span className="font-bold text-xs text-slate-900">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{item.children?.length} sub-categories</span>
                        </div>
                        <div className="space-y-1 max-h-[380px] overflow-y-auto">
                          {item.children?.filter(c => c.enabled !== false).map(child => (
                            <div key={child.id} className="space-y-0.5">
                              <button
                                onClick={() => handleNavigate(child.categorySlug || 'all', child.searchKeyword || child.label)}
                                className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition flex items-center justify-between group cursor-pointer"
                              >
                                <span className="truncate">{child.label}</span>
                                {child.badge && (
                                  <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                    {child.badge}
                                  </span>
                                )}
                              </button>
                              {child.children && child.children.length > 0 && (
                                <div className="pl-4 space-y-0.5 border-l-2 border-slate-100 ml-2">
                                  {child.children.filter(cc => cc.enabled !== false).map(subChild => (
                                    <button
                                      key={subChild.id}
                                      onClick={() => handleNavigate(subChild.categorySlug || child.categorySlug || 'all', subChild.searchKeyword || subChild.label)}
                                      className="w-full text-left py-1 px-2 rounded text-[11px] text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                      <span className="truncate">{subChild.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Header Navigation Extras */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <button
              onClick={() => setActivePage('track-order')}
              className={`inline-flex items-center gap-1 transition cursor-pointer hover:text-white ${
                activePage === 'track-order' ? 'text-blue-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Quick Search on Mobile */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate('all', searchQuery);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={() => handleNavigate('all', searchQuery)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="border-b border-slate-100 pb-3 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation Tree</div>

            {/* HOME */}
            <button
              onClick={() => { setActivePage('home'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 px-2 rounded-lg text-sm font-semibold cursor-pointer ${
                activePage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              HOME
            </button>

            {/* Products (Accordion) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div 
                onClick={() => setMobileExpanded(prev => ({ ...prev, 'nav-products': !prev['nav-products'] }))}
                className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer font-bold text-sm text-slate-900"
              >
                <span>Products</span>
                <span className="p-1 rounded bg-white text-slate-500 shadow-2xs">
                  {mobileExpanded['nav-products'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </div>

              {mobileExpanded['nav-products'] && (
                <div className="p-3 bg-white space-y-3 border-t border-slate-100">
                  {/* PRINTER */}
                  <div className="space-y-1 pl-1">
                    <div 
                      onClick={(e) => toggleMobileExpand('m-printer', e)}
                      className="flex items-center justify-between py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer"
                    >
                      <span onClick={() => handleNavigate('printer')}>PRINTER</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${mobileExpanded['m-printer'] ? 'rotate-180' : ''}`} />
                    </div>
                    {mobileExpanded['m-printer'] && (
                      <div className="pl-3 space-y-1 border-l-2 border-blue-200">
                        {['HP Color Printer', 'HP Color MFP', 'HP Black Printer', 'HP Black MFP', 'HP DeskJet Printer', 'HP OfficeJet', 'HP Smart Tank', 'Mobile Printer'].map(item => (
                          <button
                            key={item}
                            onClick={() => handleNavigate('printer', item)}
                            className="block w-full text-left py-1 text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* TONERS */}
                  <div className="space-y-1 pl-1">
                    <div 
                      onClick={(e) => toggleMobileExpand('m-toners', e)}
                      className="flex items-center justify-between py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer"
                    >
                      <span onClick={() => handleNavigate('toners')}>TONERS</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${mobileExpanded['m-toners'] ? 'rotate-180' : ''}`} />
                    </div>
                    {mobileExpanded['m-toners'] && (
                      <div className="pl-3 space-y-1 border-l-2 border-blue-200">
                        {['HP Black Toner', 'HP Color Toner', 'Sharp Toner', 'Canon Toner', 'Samsung Toner'].map(item => (
                          <button
                            key={item}
                            onClick={() => handleNavigate('toners', item)}
                            className="block w-full text-left py-1 text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* INKS */}
                  <div className="space-y-1 pl-1">
                    <div 
                      onClick={(e) => toggleMobileExpand('m-inks', e)}
                      className="flex items-center justify-between py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer"
                    >
                      <span onClick={() => handleNavigate('inks')}>INKS</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${mobileExpanded['m-inks'] ? 'rotate-180' : ''}`} />
                    </div>
                    {mobileExpanded['m-inks'] && (
                      <div className="pl-3 space-y-1 border-l-2 border-blue-200">
                        {['HP Ink', 'HP Printhead', 'Canon Ink'].map(item => (
                          <button
                            key={item}
                            onClick={() => handleNavigate('inks', item)}
                            className="block w-full text-left py-1 text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* UPS */}
                  <div className="space-y-1 pl-1">
                    <div 
                      onClick={(e) => toggleMobileExpand('m-ups', e)}
                      className="flex items-center justify-between py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer"
                    >
                      <span onClick={() => handleNavigate('ups')}>UPS</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${mobileExpanded['m-ups'] ? 'rotate-180' : ''}`} />
                    </div>
                    {mobileExpanded['m-ups'] && (
                      <div className="pl-3 space-y-1 border-l-2 border-blue-200">
                        {['APC UPS', 'BLUE GATE UPS'].map(item => (
                          <button
                            key={item}
                            onClick={() => handleNavigate('ups', item)}
                            className="block w-full text-left py-1 text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* KITS */}
                  <div className="space-y-1 pl-1">
                    <button
                      onClick={() => handleNavigate('kits', 'HP IMAGE TRANSFER KIT')}
                      className="block w-full text-left py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer hover:text-blue-600"
                    >
                      KITS — HP IMAGE TRANSFER KIT
                    </button>
                  </div>

                  {/* ACCESSORIES */}
                  <div className="space-y-1 pl-1">
                    <button
                      onClick={() => handleNavigate('accessories')}
                      className="block w-full text-left py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer hover:text-blue-600"
                    >
                      ACCESSORIES
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Office Furniture (Accordion) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div 
                onClick={() => setMobileExpanded(prev => ({ ...prev, 'nav-office-furniture': !prev['nav-office-furniture'] }))}
                className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer font-bold text-sm text-slate-900"
              >
                <span>Office Furniture</span>
                <span className="p-1 rounded bg-white text-slate-500 shadow-2xs">
                  {mobileExpanded['nav-office-furniture'] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </div>

              {mobileExpanded['nav-office-furniture'] && (
                <div className="p-3 bg-white space-y-3 border-t border-slate-100">
                  {/* Office Chairs */}
                  <div className="space-y-1 pl-1">
                    <div className="text-xs font-bold text-slate-900 uppercase">Office Chairs</div>
                    <div className="pl-3 space-y-1 border-l-2 border-amber-200">
                      {['Executive ceo chairs', 'Ergonomic Chairs', 'Visitors Chair'].map(item => (
                        <button
                          key={item}
                          onClick={() => handleNavigate('office-chairs', item)}
                          className="block w-full text-left py-1 text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Executive Tables */}
                  <div className="space-y-1 pl-1">
                    <button
                      onClick={() => handleNavigate('executive-tables')}
                      className="block w-full text-left py-1 text-xs font-bold text-slate-900 uppercase cursor-pointer hover:text-blue-600"
                    >
                      Executive Tables
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Request Quote */}
            <button
              onClick={() => { setActivePage('rfq'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 px-2 rounded-lg text-sm font-bold cursor-pointer ${
                activePage === 'rfq' ? 'bg-amber-50 text-amber-700' : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              Request Quote (RFQ)
            </button>

            {/* About Us */}
            <button
              onClick={() => { setActivePage('about'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 px-2 rounded-lg text-sm font-semibold cursor-pointer ${
                activePage === 'about' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Contact Us */}
            <button
              onClick={() => { setActivePage('contact'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 px-2 rounded-lg text-sm font-semibold cursor-pointer ${
                activePage === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
