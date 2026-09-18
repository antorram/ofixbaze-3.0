import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { 
  Product, 
  Order, 
  RFQRequest, 
  StoreSettings, 
  Currency, 
  ActivePage,
  SiteCustomizerConfig,
  Category,
  NavMenuItem,
  CMSPage,
  CMSMediaItem,
  Brand,
  Customer,
  BlogPost,
  CMSForm,
  CMSTestimonial,
  CMSTemplate
} from '../types';
import { SlideConfig } from '../data/adminData';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminCustomizerTab } from '../components/admin/AdminCustomizerTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminMenuTab } from '../components/admin/AdminMenuTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminRFQTab } from '../components/admin/AdminRFQTab';
import { AdminBannersTab } from '../components/admin/AdminBannersTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminSEOTab } from '../components/admin/AdminSEOTab';
import { AdminPagesTab } from '../components/admin/AdminPagesTab';
import { AdminPageBuilderTab } from '../components/admin/AdminPageBuilderTab';
import { AdminMediaTab } from '../components/admin/AdminMediaTab';
import { AdminBrandsTab } from '../components/admin/AdminBrandsTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminBlogTab } from '../components/admin/AdminBlogTab';
import { AdminFormsTab } from '../components/admin/AdminFormsTab';
import { AdminTestimonialsTab } from '../components/admin/AdminTestimonialsTab';
import { AdminTemplatesTab } from '../components/admin/AdminTemplatesTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { SiteSEOConfig } from '../types';
import { INITIAL_SEO_CONFIG } from '../data/defaultSEO';
import {
  INITIAL_CMS_PAGES,
  INITIAL_CMS_MEDIA,
  INITIAL_CMS_BRANDS,
  INITIAL_CMS_CUSTOMERS,
  INITIAL_CMS_BLOG_POSTS,
  INITIAL_CMS_FORMS,
  INITIAL_CMS_TESTIMONIALS
} from '../data/cmsInitialData';

interface AdminPageProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onQuickRestock: (productId: string, amount: number) => void;
  onToggleStockStatus: (productId: string) => void;
  onToggleFeatured: (productId: string) => void;
  onImportProducts?: (importedProducts: Product[]) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateTrackingNumber: (orderId: string, trackingNumber: string) => void;
  rfqs: RFQRequest[];
  onUpdateRfq: (updatedRfq: RFQRequest) => void;
  slides: SlideConfig[];
  onUpdateSlides: (newSlides: SlideConfig[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onResetToDefaults: () => void;
  customizerConfig: SiteCustomizerConfig;
  onUpdateCustomizerConfig: (newConfig: SiteCustomizerConfig) => void;
  onResetCustomizerDefaults: () => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetDefaultCategories: () => void;
  onSelectCategory: (slug: string) => void;
  navMenu?: NavMenuItem[];
  onUpdateNavMenu?: (newMenu: NavMenuItem[]) => void;
  onResetDefaultMenu?: () => void;
  currency: Currency;
  setActivePage: (page: ActivePage) => void;
  seoConfig?: SiteSEOConfig;
  onUpdateSEOConfig?: (newConfig: SiteSEOConfig) => void;
  cmsPages?: CMSPage[];
  onUpdateCmsPages?: (newPages: CMSPage[]) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickRestock,
  onToggleStockStatus,
  onToggleFeatured,
  onImportProducts,
  orders,
  onUpdateOrderStatus,
  onUpdateTrackingNumber,
  rfqs,
  onUpdateRfq,
  slides,
  onUpdateSlides,
  settings,
  onUpdateSettings,
  onResetToDefaults,
  customizerConfig,
  onUpdateCustomizerConfig,
  onResetCustomizerDefaults,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetDefaultCategories,
  onSelectCategory,
  navMenu,
  onUpdateNavMenu,
  onResetDefaultMenu,
  currency,
  setActivePage,
  seoConfig,
  onUpdateSEOConfig,
  cmsPages: externalCmsPages,
  onUpdateCmsPages
}) => {
  // Local state fallback for SEO config
  const [localSeoConfig, setLocalSeoConfig] = useState<SiteSEOConfig>(() => {
    if (seoConfig) return seoConfig;
    try {
      const saved = localStorage.getItem('ofixbaze_seo_config');
      return saved ? JSON.parse(saved) : INITIAL_SEO_CONFIG;
    } catch {
      return INITIAL_SEO_CONFIG;
    }
  });

  const activeSeoConfig = seoConfig || localSeoConfig;
  const handleUpdateSEO = (newConfig: SiteSEOConfig) => {
    if (onUpdateSEOConfig) {
      onUpdateSEOConfig(newConfig);
    }
    setLocalSeoConfig(newConfig);
    try {
      localStorage.setItem('ofixbaze_seo_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };
  // Authentication state (persisted to session/storage, defaults to false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ofixbaze_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tabs & Navigation
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeBuilderPageId, setActiveBuilderPageId] = useState<string>('page-home');

  // CMS Persistent States
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(() => {
    if (externalCmsPages && externalCmsPages.length > 0) return externalCmsPages;
    try {
      const saved = localStorage.getItem('ofixbaze_cms_pages');
      return saved ? JSON.parse(saved) : INITIAL_CMS_PAGES;
    } catch {
      return INITIAL_CMS_PAGES;
    }
  });

  const effectiveCmsPages = externalCmsPages || cmsPages;

  // Sync if externalCmsPages updates
  useEffect(() => {
    if (externalCmsPages) {
      setCmsPages(externalCmsPages);
    }
  }, [externalCmsPages]);

  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_media');
      return saved ? JSON.parse(saved) : INITIAL_CMS_MEDIA;
    } catch {
      return INITIAL_CMS_MEDIA;
    }
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_brands');
      return saved ? JSON.parse(saved) : INITIAL_CMS_BRANDS;
    } catch {
      return INITIAL_CMS_BRANDS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_customers');
      return saved ? JSON.parse(saved) : INITIAL_CMS_CUSTOMERS;
    } catch {
      return INITIAL_CMS_CUSTOMERS;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_blog');
      return saved ? JSON.parse(saved) : INITIAL_CMS_BLOG_POSTS;
    } catch {
      return INITIAL_CMS_BLOG_POSTS;
    }
  });

  const [forms, setForms] = useState<CMSForm[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_forms');
      return saved ? JSON.parse(saved) : INITIAL_CMS_FORMS;
    } catch {
      return INITIAL_CMS_FORMS;
    }
  });

  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_testimonials');
      return saved ? JSON.parse(saved) : INITIAL_CMS_TESTIMONIALS;
    } catch {
      return INITIAL_CMS_TESTIMONIALS;
    }
  });

  // CMS Handlers
  const handleAddPage = (page: CMSPage) => {
    const updated = [...effectiveCmsPages, page];
    setCmsPages(updated);
    if (onUpdateCmsPages) onUpdateCmsPages(updated);
    try { localStorage.setItem('ofixbaze_cms_pages', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdatePage = (page: CMSPage) => {
    const updated = effectiveCmsPages.map(p => p.id === page.id ? page : p);
    setCmsPages(updated);
    if (onUpdateCmsPages) onUpdateCmsPages(updated);
    try { localStorage.setItem('ofixbaze_cms_pages', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeletePage = (pageId: string) => {
    const updated = effectiveCmsPages.filter(p => p.id !== pageId);
    setCmsPages(updated);
    if (onUpdateCmsPages) onUpdateCmsPages(updated);
    try { localStorage.setItem('ofixbaze_cms_pages', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDuplicatePage = (page: CMSPage) => {
    const duplicated: CMSPage = {
      ...page,
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleAddPage(duplicated);
  };

  const handleAddMedia = (media: CMSMediaItem) => {
    const updated = [media, ...mediaItems];
    setMediaItems(updated);
    try { localStorage.setItem('ofixbaze_cms_media', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeleteMedia = (mediaId: string) => {
    const updated = mediaItems.filter(m => m.id !== mediaId);
    setMediaItems(updated);
    try { localStorage.setItem('ofixbaze_cms_media', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateMediaAlt = (id: string, altText: string) => {
    const updated = mediaItems.map(m => m.id === id ? { ...m, altText } : m);
    setMediaItems(updated);
    try { localStorage.setItem('ofixbaze_cms_media', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleAddBrand = (brand: Brand) => {
    const updated = [...brands, brand];
    setBrands(updated);
    try { localStorage.setItem('ofixbaze_cms_brands', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateBrand = (brand: Brand) => {
    const updated = brands.map(b => b.id === brand.id ? brand : b);
    setBrands(updated);
    try { localStorage.setItem('ofixbaze_cms_brands', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeleteBrand = (brandId: string) => {
    const updated = brands.filter(b => b.id !== brandId);
    setBrands(updated);
    try { localStorage.setItem('ofixbaze_cms_brands', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleAddCustomer = (customer: Customer) => {
    const updated = [customer, ...customers];
    setCustomers(updated);
    try { localStorage.setItem('ofixbaze_cms_customers', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateCustomer = (customer: Customer) => {
    const updated = customers.map(c => c.id === customer.id ? customer : c);
    setCustomers(updated);
    try { localStorage.setItem('ofixbaze_cms_customers', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeleteCustomer = (customerId: string) => {
    const updated = customers.filter(c => c.id !== customerId);
    setCustomers(updated);
    try { localStorage.setItem('ofixbaze_cms_customers', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleAddBlogPost = (post: BlogPost) => {
    const updated = [post, ...blogPosts];
    setBlogPosts(updated);
    try { localStorage.setItem('ofixbaze_cms_blog', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateBlogPost = (post: BlogPost) => {
    const updated = blogPosts.map(p => p.id === post.id ? post : p);
    setBlogPosts(updated);
    try { localStorage.setItem('ofixbaze_cms_blog', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeleteBlogPost = (postId: string) => {
    const updated = blogPosts.filter(p => p.id !== postId);
    setBlogPosts(updated);
    try { localStorage.setItem('ofixbaze_cms_blog', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateForm = (form: CMSForm) => {
    const updated = forms.map(f => f.id === form.id ? form : f);
    setForms(updated);
    try { localStorage.setItem('ofixbaze_cms_forms', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleAddTestimonial = (testimonial: CMSTestimonial) => {
    const updated = [...testimonials, testimonial];
    setTestimonials(updated);
    try { localStorage.setItem('ofixbaze_cms_testimonials', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleUpdateTestimonial = (testimonial: CMSTestimonial) => {
    const updated = testimonials.map(t => t.id === testimonial.id ? testimonial : t);
    setTestimonials(updated);
    try { localStorage.setItem('ofixbaze_cms_testimonials', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    try { localStorage.setItem('ofixbaze_cms_testimonials', JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const lowStockCount = products.filter(p => p.stockCount <= 5).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Processing').length;
  const pendingRfqCount = rfqs.filter(r => r.status === 'Pending').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLoginError('Please enter both admin email and password.');
      return;
    }

    let valid = false;
    try {
      const stored = localStorage.getItem('ofixbaze_custom_admin_creds');
      if (stored) {
        const customCreds = JSON.parse(stored);
        if (customCreds?.email && customCreds?.password) {
          if (cleanEmail === customCreds.email.toLowerCase() && cleanPassword === customCreds.password) {
            valid = true;
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }

    // Default fallback credentials
    if (!valid && cleanEmail === 'admin@ofixbaze.com' && cleanPassword === 'admin123') {
      valid = true;
    }

    if (valid) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('ofixbaze_admin_auth', 'true');
        localStorage.setItem('ofixbaze_current_admin_email', cleanEmail);
      } catch (e) {
        console.error(e);
      }
      setLoginError(null);
    } else {
      setLoginError('Invalid email or password. Default is admin@ofixbaze.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminEmail('');
    setPassword('');
    try {
      localStorage.removeItem('ofixbaze_admin_auth');
    } catch (e) {
      console.error(e);
    }
  };

  // If not authenticated, render the secure Super Admin Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 text-white animate-in fade-in duration-200">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-orange-950">
              O
            </div>
            <h2 className="text-xl font-black tracking-wider text-white">
              OFIXBAZE SUPER ADMIN
            </h2>
            <p className="text-xs text-slate-400">
              Authorized Personnel Only. Please sign in with your credentials.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form - No auto-fill, strictly blank inputs */}
          <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Admin Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-orange-500 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-orange-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-950 transition cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In to Super Admin</span>
            </button>
          </form>

          {/* Quick Demo Access Help */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Default Credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@ofixbaze.com');
                  setPassword('admin123');
                }}
                className="text-orange-400 hover:text-orange-300 hover:underline cursor-pointer font-bold text-[10px]"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between">
              <span>admin@ofixbaze.com</span>
              <span>Pass: admin123</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              You can change this email and password in the Admin Settings tab anytime.
            </p>
          </div>

          {/* Return button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('home')}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer underline"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If in Visual Page Builder mode, render dedicated Elementor-style full-screen environment
  if (currentTab === 'builder') {
    return (
      <div className="min-h-screen bg-[#101418] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        <AdminPageBuilderTab
          pages={effectiveCmsPages}
          initialPageId={activeBuilderPageId}
          onSavePage={handleUpdatePage}
          products={products}
          categories={categories}
          currency={currency}
          mediaItems={mediaItems}
          onUploadMedia={handleAddMedia}
          setActivePage={setActivePage}
          onExitBuilder={() => setCurrentTab('pages')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <div className="flex flex-1 min-h-screen flex-col md:flex-row">
        {/* Sidebar Desktop */}
        <div className="hidden md:flex">
          <AdminSidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            setActivePage={setActivePage}
            productsCount={products.length}
            lowStockCount={lowStockCount}
            ordersCount={orders.length}
            pendingOrdersCount={pendingOrdersCount}
            pendingRfqCount={pendingRfqCount}
            onLogout={handleLogout}
            adminEmail={adminEmail}
          />
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full flex flex-col">
              <AdminSidebar
                currentTab={currentTab}
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                setActivePage={setActivePage}
                productsCount={products.length}
                lowStockCount={lowStockCount}
                ordersCount={orders.length}
                pendingOrdersCount={pendingOrdersCount}
                pendingRfqCount={pendingRfqCount}
                onLogout={handleLogout}
                adminEmail={adminEmail}
              />
            </div>
          </div>
        )}

        {/* Main Admin Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Header */}
          <AdminHeader
            currentTab={currentTab}
            setActivePage={setActivePage}
            onOpenAddProductModal={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            lowStockCount={lowStockCount}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Tab Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full overflow-y-auto">
            {currentTab === 'dashboard' && (
              <AdminDashboardTab
                products={products}
                orders={orders}
                rfqs={rfqs}
                currency={currency}
                setCurrentTab={setCurrentTab}
                onOpenAddProductModal={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
                onQuickRestock={onQuickRestock}
                onViewOrderDetails={() => setCurrentTab('orders')}
                onViewRfqDetails={() => setCurrentTab('rfq')}
                onUpdateOrderStatus={onUpdateOrderStatus}
              />
            )}

            {currentTab === 'customizer' && (
              <AdminCustomizerTab
                config={customizerConfig}
                onUpdateConfig={onUpdateCustomizerConfig}
                onResetDefaults={onResetCustomizerDefaults}
                setActivePage={setActivePage}
                slides={slides}
                onUpdateSlides={onUpdateSlides}
                onSwitchToBannersTab={() => setCurrentTab('banners')}
              />
            )}

            {currentTab === 'categories' && (
              <AdminCategoriesTab
                categories={categories}
                products={products}
                onAddCategory={onAddCategory}
                onUpdateCategory={onUpdateCategory}
                onDeleteCategory={onDeleteCategory}
                onResetDefaultCategories={onResetDefaultCategories}
                setActivePage={setActivePage}
                onSelectCategory={onSelectCategory}
              />
            )}

            {currentTab === 'menus' && navMenu && onUpdateNavMenu && onResetDefaultMenu && (
              <AdminMenuTab
                navMenu={navMenu}
                categories={categories}
                onUpdateNavMenu={onUpdateNavMenu}
                onResetDefaultMenu={onResetDefaultMenu}
                setActivePage={setActivePage}
              />
            )}

          {currentTab === 'products' && (
            <AdminProductsTab
              products={products}
              currency={currency}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              onQuickRestock={onQuickRestock}
              onToggleStockStatus={onToggleStockStatus}
              onToggleFeatured={onToggleFeatured}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              onOpenEditModal={(prod) => {
                setProductToEdit(prod);
                setIsProductModalOpen(true);
              }}
              onImportProducts={onImportProducts}
            />
          )}

          {currentTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              currency={currency}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdateTrackingNumber={onUpdateTrackingNumber}
            />
          )}

          {currentTab === 'rfq' && (
            <AdminRFQTab
              rfqs={rfqs}
              currency={currency}
              onUpdateRfq={onUpdateRfq}
            />
          )}

          {currentTab === 'banners' && (
            <AdminBannersTab
              slides={slides}
              onUpdateSlides={onUpdateSlides}
            />
          )}

          {currentTab === 'pages' && (
            <AdminPagesTab
              pages={effectiveCmsPages}
              onAddPage={handleAddPage}
              onUpdatePage={handleUpdatePage}
              onDeletePage={handleDeletePage}
              onDuplicatePage={handleDuplicatePage}
              onOpenPageBuilder={(pageId) => {
                setActiveBuilderPageId(pageId);
                setCurrentTab('builder');
              }}
              setActivePage={setActivePage}
            />
          )}

          {currentTab === 'brands' && (
            <AdminBrandsTab
              brands={brands}
              onAddBrand={handleAddBrand}
              onUpdateBrand={handleUpdateBrand}
              onDeleteBrand={handleDeleteBrand}
              mediaItems={mediaItems}
              onUploadMedia={handleAddMedia}
            />
          )}

          {currentTab === 'customers' && (
            <AdminCustomersTab
              currency={currency}
              orders={orders}
              rfqs={rfqs}
            />
          )}

          {currentTab === 'media' && (
            <AdminMediaTab
              mediaItems={mediaItems}
              onUploadMedia={handleAddMedia}
              onDeleteMedia={handleDeleteMedia}
              onUpdateMediaAlt={handleUpdateMediaAlt}
            />
          )}

          {currentTab === 'blog' && (
            <AdminBlogTab
              posts={blogPosts}
              onAddPost={handleAddBlogPost}
              onUpdatePost={handleUpdateBlogPost}
              onDeletePost={handleDeleteBlogPost}
              mediaItems={mediaItems}
              onUploadMedia={handleAddMedia}
            />
          )}

          {currentTab === 'forms' && (
            <AdminFormsTab
              forms={forms}
              onUpdateForm={handleUpdateForm}
            />
          )}

          {currentTab === 'testimonials' && (
            <AdminTestimonialsTab
              testimonials={testimonials}
              onAddTestimonial={handleAddTestimonial}
              onUpdateTestimonial={handleUpdateTestimonial}
              onDeleteTestimonial={handleDeleteTestimonial}
              mediaItems={mediaItems}
              onUploadMedia={handleAddMedia}
            />
          )}

          {currentTab === 'templates' && (
            <AdminTemplatesTab
              onOpenPageBuilder={(pageId) => {
                setActiveBuilderPageId(pageId);
                setCurrentTab('builder');
              }}
            />
          )}

          {currentTab === 'users' && (
            <AdminUsersTab />
          )}

          {currentTab === 'seo' && (
            <AdminSEOTab
              seoConfig={activeSeoConfig}
              onUpdateSEOConfig={handleUpdateSEO}
              products={products}
              onUpdateProduct={onUpdateProduct}
              categories={categories}
            />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onResetToDefaults={onResetToDefaults}
            />
          )}
        </main>
      </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={(savedProduct) => {
          if (productToEdit) {
            onUpdateProduct(savedProduct);
          } else {
            onAddProduct(savedProduct);
          }
        }}
      />
    </div>
  );
};
