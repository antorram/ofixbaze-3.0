import React, { useState, useEffect } from 'react';
import { ActivePage, Currency, Product, CartItem, Order, RFQRequest, StoreSettings, SiteCustomizerConfig, Category, NavMenuItem, SiteSEOConfig, CMSPage } from './types';
import { PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { DEFAULT_NAV_MENU } from './data/defaultMenu';
import { INITIAL_SEO_CONFIG } from './data/defaultSEO';
import { 
  INITIAL_ORDERS, 
  INITIAL_RFQS, 
  INITIAL_STORE_SETTINGS, 
  INITIAL_SLIDES_CONFIG, 
  SlideConfig 
} from './data/adminData';
import { DEFAULT_CUSTOMIZER_CONFIG } from './data/defaultCustomizer';
import { INITIAL_CMS_PAGES } from './data/cmsInitialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthenticityModal } from './components/AuthenticityModal';
import { CMSPageRenderer } from './components/CMSPageRenderer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { RFQPage } from './pages/RFQPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminPage } from './pages/AdminPage';

// Helper to determine the initial active page from URL pathname, hash, or query
function parseUrlRoute(): { page: ActivePage; productId?: string } {
  if (typeof window === 'undefined') return { page: 'home' };

  // 1. Check pathname (e.g. /admin, /shop, /checkout, etc.)
  const rawPath = window.location.pathname.toLowerCase();
  const cleanPath = rawPath.replace(/\/+$/, '') || '/';

  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    return { page: 'admin' };
  }
  if (cleanPath === '/shop' || cleanPath.startsWith('/shop/')) {
    return { page: 'shop' };
  }
  if (cleanPath === '/checkout' || cleanPath === '/cart') {
    return { page: 'checkout' };
  }
  if (cleanPath === '/rfq' || cleanPath === '/quote') {
    return { page: 'rfq' };
  }
  if (cleanPath === '/about' || cleanPath === '/about-us') {
    return { page: 'about' };
  }
  if (cleanPath === '/contact' || cleanPath === '/contact-us') {
    return { page: 'contact' };
  }
  if (cleanPath === '/track-order' || cleanPath === '/track') {
    return { page: 'track-order' };
  }
  if (cleanPath === '/wishlist') {
    return { page: 'wishlist' };
  }
  if (cleanPath.startsWith('/product/')) {
    const pId = cleanPath.replace('/product/', '');
    return { page: 'product-detail', productId: pId };
  }

  // 2. Check hash (e.g. #/admin, #admin, #admin/)
  const rawHash = window.location.hash.toLowerCase().replace(/^#[/]?/, '').replace(/\/+$/, '');
  if (rawHash === 'admin' || rawHash.startsWith('admin')) {
    return { page: 'admin' };
  }
  if (rawHash === 'shop') return { page: 'shop' };
  if (rawHash === 'checkout' || rawHash === 'cart') return { page: 'checkout' };
  if (rawHash === 'rfq' || rawHash === 'quote') return { page: 'rfq' };
  if (rawHash === 'about') return { page: 'about' };
  if (rawHash === 'contact') return { page: 'contact' };
  if (rawHash === 'track-order' || rawHash === 'track') return { page: 'track-order' };
  if (rawHash === 'wishlist') return { page: 'wishlist' };

  // 3. Check query param: ?admin or ?page=admin
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) return { page: 'admin' };
    const pageParam = params.get('page')?.toLowerCase();
    if (pageParam === 'admin') return { page: 'admin' };
    if (pageParam === 'shop') return { page: 'shop' };
    if (pageParam === 'checkout') return { page: 'checkout' };
    if (pageParam === 'rfq') return { page: 'rfq' };
    if (pageParam === 'about') return { page: 'about' };
    if (pageParam === 'contact') return { page: 'contact' };
    if (pageParam === 'track-order') return { page: 'track-order' };
    if (pageParam === 'wishlist') return { page: 'wishlist' };
  } catch {
    // ignore
  }

  return { page: 'home' };
}

export default function App() {
  const [activePage, setActivePageState] = useState<ActivePage>(() => parseUrlRoute().page);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);

  // Synchronized page navigation that updates URL address bar safely
  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    try {
      const targetPath = page === 'home' ? '/' : `/#${page}`;
      window.history.pushState({ page }, '', targetPath);
    } catch {
      try {
        window.location.hash = page === 'home' ? '' : `#${page}`;
      } catch {
        // ignore
      }
    }
  };

  // Persistent products state (managed by admin, with auto-migration from legacy categories)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Initialize map with default products
          const productMap = new Map<string, Product>();
          PRODUCTS.forEach(p => productMap.set(p.sku || p.id, p));

          // Merge parsed, migrating any legacy categories
          parsed.forEach((p: Product) => {
            let cat = p.category;
            let sub = p.subCategory;
            if (cat === 'furniture-safes') {
              const name = (p.name || '').toLowerCase();
              if (name.includes('table') || name.includes('desk')) {
                cat = 'executive-tables';
                sub = 'Executive Tables & Desks';
              } else if (name.includes('visitor') || name.includes('seater') || name.includes('cantilever')) {
                cat = 'visitors-chairs';
                sub = 'Visitors & Reception Chairs';
              } else if (name.includes('mesh') || name.includes('ergonomic') || name.includes('orthopedic')) {
                cat = 'ergonomic-chairs';
                sub = 'Ergonomic Chairs';
              } else {
                cat = 'executive-ceo-chairs';
                sub = 'Executive CEO Chairs';
              }
            }
            productMap.set(p.sku || p.id, { ...p, category: cat, subCategory: sub });
          });

          const reconciled = Array.from(productMap.values());
          try {
            localStorage.setItem('ofixbaze_admin_products', JSON.stringify(reconciled));
          } catch {
            // ignore
          }
          return reconciled;
        }
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Persistent orders state (managed by admin and customer checkout)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Persistent RFQs state (managed by admin and customer RFQ form)
  const [rfqs, setRfqs] = useState<RFQRequest[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_rfqs');
      return saved ? JSON.parse(saved) : INITIAL_RFQS;
    } catch {
      return INITIAL_RFQS;
    }
  });

  // Persistent hero banner slides state
  const [slides, setSlides] = useState<SlideConfig[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_slides');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES_CONFIG;
    } catch {
      return INITIAL_SLIDES_CONFIG;
    }
  });

  // Persistent store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // WordPress-style Customizer Configuration state (sections, theme color scheme, brand identity)
  const [customizerConfig, setCustomizerConfig] = useState<SiteCustomizerConfig>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_customizer_config');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZER_CONFIG;
    } catch {
      return DEFAULT_CUSTOMIZER_CONFIG;
    }
  });

  // Persistent categories state (managed by admin)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.slug === 'printer')) {
          return parsed;
        }
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Persistent navigation menu state (managed by admin)
  const [navMenu, setNavMenu] = useState<NavMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_admin_nav_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(i => i.label === 'Products' && i.children && i.children.length > 0)) {
          return parsed;
        }
      }
      return DEFAULT_NAV_MENU;
    } catch {
      return DEFAULT_NAV_MENU;
    }
  });

  // Persistent SEO state (managed by admin)
  const [seoConfig, setSeoConfig] = useState<SiteSEOConfig>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_seo_config');
      return saved ? JSON.parse(saved) : INITIAL_SEO_CONFIG;
    } catch {
      return INITIAL_SEO_CONFIG;
    }
  });

  // Persistent CMS Pages (managed by Page Builder & Pages CMS)
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_pages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: CMSPage) => (p.slug === 'home' && p.status === 'published' && (!p.updatedAt || p.updatedAt === '07 Sep 2026') ? { ...p, status: 'draft' } : p));
        }
      }
      return INITIAL_CMS_PAGES;
    } catch {
      return INITIAL_CMS_PAGES;
    }
  });

  const handleUpdateCmsPages = (newPages: CMSPage[]) => {
    setCmsPages(newPages);
    try {
      localStorage.setItem('ofixbaze_cms_pages', JSON.stringify(newPages));
    } catch (e) {
      console.error(e);
    }
  };

  const [shopSearchKeyword, setShopSearchKeyword] = useState<string>('');

  const handleSelectCategoryAndKeyword = (catSlug: string, keyword: string = '') => {
    setSelectedCategory(catSlug);
    setShopSearchKeyword(keyword);
    setActivePage('shop');
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[1], quantity: 2 }, // sample HP 05A toner in cart
      ];
    } catch {
      return [{ product: PRODUCTS[1], quantity: 2 }];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[0].id, PRODUCTS[4].id];
    } catch {
      return [PRODUCTS[0].id, PRODUCTS[4].id];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthenticityModalOpen, setIsAuthenticityModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_rfqs', JSON.stringify(rfqs));
    } catch (e) {
      console.error(e);
    }
  }, [rfqs]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_slides', JSON.stringify(slides));
    } catch (e) {
      console.error(e);
    }
  }, [slides]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_customizer_config', JSON.stringify(customizerConfig));
    } catch (e) {
      console.error(e);
    }
  }, [customizerConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_admin_nav_menu', JSON.stringify(navMenu));
    } catch (e) {
      console.error(e);
    }
  }, [navMenu]);

  useEffect(() => {
    try {
      localStorage.setItem('ofixbaze_seo_config', JSON.stringify(seoConfig));
    } catch (e) {
      console.error(e);
    }
  }, [seoConfig]);

  // Synchronize document title and meta description tags dynamically
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let targetTitle = seoConfig.siteTitle;
    let targetDescription = seoConfig.defaultMetaDescription;

    if (activePage === 'product-detail' && selectedProduct) {
      targetTitle = selectedProduct.metaTitle || `${selectedProduct.name} | Ofixbaze Nigeria`;
      targetDescription = selectedProduct.metaDescription || selectedProduct.shortDescription || targetDescription;
    } else {
      const pageInfo = seoConfig.pages[activePage];
      if (pageInfo) {
        targetTitle = pageInfo.metaTitle || `${pageInfo.pageName} | ${seoConfig.siteTitle}`;
        targetDescription = pageInfo.metaDescription || targetDescription;
      } else if (activePage === 'admin') {
        targetTitle = `Admin Control Center | ${seoConfig.siteTitle}`;
      }
    }

    document.title = targetTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', targetDescription);

    if (seoConfig.googleSiteVerification) {
      let metaGsv = document.querySelector('meta[name="google-site-verification"]');
      if (!metaGsv) {
        metaGsv = document.createElement('meta');
        metaGsv.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaGsv);
      }
      metaGsv.setAttribute('content', seoConfig.googleSiteVerification);
    }
  }, [activePage, selectedProduct, seoConfig]);

  // Apply customizer theme color variables to HTML document
  useEffect(() => {
    if (customizerConfig?.theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', customizerConfig.theme.primaryColor);
      root.style.setProperty('--color-secondary', customizerConfig.theme.secondaryColor);
      root.style.setProperty('--header-bg', customizerConfig.theme.headerBg);
      root.style.setProperty('--topbar-bg', customizerConfig.theme.topBarBg);
      root.style.setProperty('--footer-bg', customizerConfig.theme.footerBg);
    }
  }, [customizerConfig]);

  // Listen for browser URL changes (back/forward buttons, manual url navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseUrlRoute();
      setActivePageState(route.page);
      if (route.productId) {
        const found = products.find(p => p.id === route.productId);
        if (found) setSelectedProduct(found);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [products]);

  // Scroll to top on page navigation
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // Ignore if scroll is restricted
    }
  }, [activePage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Product CRUD actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added successfully`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
    showToast(`Product "${updatedProduct.name}" updated`);
  };

  const handleDeleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(i => i.product.id !== productId));
    showToast(`Product "${target?.name || productId}" deleted`);
  };

  const handleQuickRestock = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newCount = (p.stockCount || 0) + amount;
        return { ...p, stockCount: newCount, inStock: true };
      }
      return p;
    }));
    showToast(`Restocked +${amount} units`);
  };

  const handleToggleStockStatus = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const toggled = !p.inStock;
        return { ...p, inStock: toggled, stockCount: toggled ? (p.stockCount || 10) : 0 };
      }
      return p;
    }));
    showToast('Stock status toggled');
  };

  const handleToggleFeatured = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    }));
    showToast('Featured status updated');
  };

  const handleImportProducts = (importedProducts: Product[]) => {
    setProducts(prev => {
      const map = new Map<string, Product>();
      prev.forEach(p => map.set(p.sku || p.id, p));
      importedProducts.forEach(p => map.set(p.sku || p.id, p));
      const updated = Array.from(map.values());
      try {
        localStorage.setItem('ofixbaze_admin_products', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast(`Successfully imported ${importedProducts.length} products!`);
  };

  // Orders & RFQs actions
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} marked as ${status}`);
  };

  const handleUpdateTrackingNumber = (orderId: string, trackingNumber: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber } : o));
    showToast(`Tracking number for ${orderId} updated`);
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    showToast(`Order ${newOrder.id} successfully recorded`);
  };

  const handleUpdateRfq = (updatedRfq: RFQRequest) => {
    setRfqs(prev => prev.map(r => r.id === updatedRfq.id ? updatedRfq : r));
    showToast(`RFQ ${updatedRfq.referenceId} updated`);
  };

  const handleAddRfq = (newRfq: RFQRequest) => {
    setRfqs(prev => [newRfq, ...prev]);
    showToast(`RFQ ${newRfq.referenceId} submitted to Super Admin!`);
  };

  const handleUpdateSlides = (newSlides: SlideConfig[]) => {
    setSlides(newSlides);
    showToast('Homepage hero slides updated');
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('Store settings saved successfully');
  };

  const handleResetToDefaults = () => {
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setRfqs(INITIAL_RFQS);
    setSlides(INITIAL_SLIDES_CONFIG);
    setSettings(INITIAL_STORE_SETTINGS);
    try {
      localStorage.removeItem('ofixbaze_admin_products');
      localStorage.removeItem('ofixbaze_admin_orders');
      localStorage.removeItem('ofixbaze_admin_rfqs');
      localStorage.removeItem('ofixbaze_admin_slides');
      localStorage.removeItem('ofixbaze_admin_settings');
    } catch {
      // ignore
    }
    showToast('Admin data reset to system defaults');
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevCart, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from wishlist');
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
  };

  const handleUpdateCustomizerConfig = (newConfig: SiteCustomizerConfig) => {
    setCustomizerConfig(newConfig);
    showToast('Theme customizer changes saved successfully!');
  };

  const handleResetCustomizerDefaults = () => {
    setCustomizerConfig(DEFAULT_CUSTOMIZER_CONFIG);
    showToast('Reset homepage sections and colors to default');
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully`);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
    showToast(`Category "${updatedCat.name}" updated successfully`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast('Category removed successfully');
  };

  const handleResetDefaultCategories = () => {
    setCategories(CATEGORIES);
    showToast('Categories reset to defaults');
  };

  const handleUpdateNavMenu = (newMenu: NavMenuItem[]) => {
    setNavMenu(newMenu);
    showToast('Navigation menu updated successfully');
  };

  const handleResetDefaultMenu = () => {
    setNavMenu(DEFAULT_NAV_MENU);
    showToast('Navigation menu reset to defaults');
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotalNGN = cart.reduce(
    (acc, i) => acc + i.product.priceNGN * i.quantity,
    0
  );

  // If Admin Page is active, render the dedicated Super Admin Management Console
  if (activePage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        <AdminPage
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onQuickRestock={handleQuickRestock}
          onToggleStockStatus={handleToggleStockStatus}
          onToggleFeatured={handleToggleFeatured}
          onImportProducts={handleImportProducts}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateTrackingNumber={handleUpdateTrackingNumber}
          rfqs={rfqs}
          onUpdateRfq={handleUpdateRfq}
          slides={slides}
          onUpdateSlides={handleUpdateSlides}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetToDefaults={handleResetToDefaults}
          customizerConfig={customizerConfig}
          onUpdateCustomizerConfig={handleUpdateCustomizerConfig}
          onResetCustomizerDefaults={handleResetCustomizerDefaults}
          categories={categories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetDefaultCategories={handleResetDefaultCategories}
          onSelectCategory={setSelectedCategory}
          navMenu={navMenu}
          onUpdateNavMenu={handleUpdateNavMenu}
          onResetDefaultMenu={handleResetDefaultMenu}
          currency={currency}
          setActivePage={setActivePage}
          seoConfig={seoConfig}
          onUpdateSEOConfig={setSeoConfig}
          cmsPages={cmsPages}
          onUpdateCmsPages={handleUpdateCmsPages}
        />
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        cartTotalNGN={cartTotalNGN}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
        onSelectProduct={handleSelectProduct}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectCategoryAndKeyword={handleSelectCategoryAndKeyword}
        products={products}
        categories={categories}
        navMenu={navMenu}
        settings={settings}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            currency={currency}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(slug) => handleSelectCategoryAndKeyword(slug, '')}
            onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
            products={products}
            categories={categories}
            customizerConfig={customizerConfig}
            slides={slides}
            cmsPage={cmsPages.find(p => p.slug === 'home')}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            currency={currency}
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setShopSearchKeyword('');
            }}
            searchKeyword={shopSearchKeyword}
            onSearchKeywordChange={setShopSearchKeyword}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
            products={products}
            categories={categories}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            currency={currency}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={setSelectedCategory}
            setActivePage={setActivePage}
            onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
            onQuickView={(p) => setQuickViewProduct(p)}
            wishlistIds={wishlistIds}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            items={cart}
            currency={currency}
            onClearCart={handleClearCart}
            setActivePage={setActivePage}
            onAddOrder={handleAddOrder}
          />
        )}

        {activePage === 'rfq' && (
          <RFQPage 
            setActivePage={setActivePage} 
            onAddRfq={handleAddRfq} 
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            setActivePage={setActivePage}
            onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'track-order' && (
          <TrackOrderPage 
            setActivePage={setActivePage} 
            orders={orders}
          />
        )}

        {activePage === 'wishlist' && (
          <WishlistPage
            wishlistIds={wishlistIds}
            currency={currency}
            onAddToCart={handleAddToCart}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onClearWishlist={handleClearWishlist}
            onSelectProduct={handleSelectProduct}
            setActivePage={setActivePage}
          />
        )}

        {/* Dynamic CMS Page Renderer for custom pages created in Page Builder */}
        {(() => {
          const builtinPages = ['home', 'shop', 'product-detail', 'checkout', 'rfq', 'about', 'contact', 'track-order', 'wishlist', 'admin'];
          if (!builtinPages.includes(activePage)) {
            const matchedCmsPage = cmsPages.find(p => p.slug === activePage);
            if (matchedCmsPage) {
              return (
                <CMSPageRenderer
                  page={matchedCmsPage}
                  products={products}
                  categories={categories}
                  currency={currency}
                  setActivePage={setActivePage}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onSelectProduct={handleSelectProduct}
                  onSelectCategory={(slug) => handleSelectCategoryAndKeyword(slug, '')}
                  onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
                />
              );
            }
          }
          return null;
        })()}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        onSelectCategory={setSelectedCategory}
        onOpenAuthenticityModal={() => setIsAuthenticityModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        setActivePage={setActivePage}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onSelectProduct={handleSelectProduct}
      />

      {/* HP Authenticity Modal */}
      <AuthenticityModal
        isOpen={isAuthenticityModalOpen}
        onClose={() => setIsAuthenticityModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
