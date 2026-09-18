import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Palette,
  Layers,
  Sparkles,
  Sliders,
  Store,
  RefreshCw,
  FolderOpen,
  Menu as MenuIcon,
  Globe,
  Search,
  Wand2
} from 'lucide-react';
import { ActivePage } from '../../types';

export type AdminTab = 
  | 'dashboard' 
  | 'builder'
  | 'pages'
  | 'products' 
  | 'categories'
  | 'brands'
  | 'orders' 
  | 'customers'
  | 'rfq' 
  | 'media'
  | 'blog'
  | 'forms'
  | 'testimonials'
  | 'templates'
  | 'customizer'
  | 'menus'
  | 'banners' 
  | 'seo'
  | 'users'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  setActivePage: (page: ActivePage) => void;
  productsCount: number;
  categoriesCount?: number;
  lowStockCount: number;
  ordersCount: number;
  pendingOrdersCount: number;
  pendingRfqCount: number;
  onLogout: () => void;
  adminEmail: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  setActivePage,
  productsCount,
  categoriesCount = 9,
  lowStockCount,
  ordersCount,
  pendingOrdersCount,
  pendingRfqCount,
  onLogout,
  adminEmail
}) => {
  const [navSearch, setNavSearch] = React.useState('');

  const menuItems = [
    // Core
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Core', badge: 'Overview' },
    { id: 'builder', label: 'Visual Page Builder', icon: Wand2, category: 'Core', badge: 'Live Builder', isPro: true },
    { id: 'pages', label: 'Pages & Layouts', icon: FileText, category: 'Core', badge: 'CMS' },

    // Ecommerce
    { id: 'products', label: 'Products Catalog', icon: Package, category: 'E-Commerce', badge: lowStockCount > 0 ? `${lowStockCount} low` : `${productsCount}` },
    { id: 'categories', label: 'Product Categories', icon: FolderOpen, category: 'E-Commerce', count: categoriesCount },
    { id: 'brands', label: 'OEM Partner Brands', icon: Sparkles, category: 'E-Commerce', badge: 'HP/Sharp' },
    { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag, category: 'E-Commerce', alertCount: pendingOrdersCount, count: ordersCount },
    { id: 'customers', label: 'Corporate Accounts', icon: Store, category: 'E-Commerce', badge: 'B2B' },
    { id: 'rfq', label: 'Corporate RFQ Tenders', icon: FileText, category: 'E-Commerce', alertCount: pendingRfqCount },

    // Content & CMS
    { id: 'media', label: 'Media Library', icon: ImageIcon, category: 'Content & CMS', badge: 'Assets' },
    { id: 'blog', label: 'Articles & Guides', icon: Layers, category: 'Content & CMS', badge: 'Blog' },
    { id: 'forms', label: 'Forms & Inbox', icon: Sliders, category: 'Content & CMS', badge: 'Inquiries' },
    { id: 'testimonials', label: 'Client Testimonials', icon: ShieldCheck, category: 'Content & CMS' },
    { id: 'templates', label: 'Elementor Templates', icon: FolderOpen, category: 'Content & CMS', isPro: true },

    // Appearance & System
    { id: 'customizer', label: 'Theme Customizer', icon: Palette, category: 'Appearance & System', isPro: true },
    { id: 'menus', label: 'Navigation Menus', icon: MenuIcon, category: 'Appearance & System' },
    { id: 'banners', label: 'Sliders & Banners', icon: ImageIcon, category: 'Appearance & System' },
    { id: 'seo', label: 'SEO & Schema Suite', icon: Globe, category: 'Appearance & System', isPro: true },
    { id: 'users', label: 'Staff Roles & Matrix', icon: ShieldCheck, category: 'Appearance & System' },
    { id: 'settings', label: 'Store Settings', icon: Settings, category: 'Appearance & System' }
  ];

  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(navSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(navSearch.toLowerCase())
  );

  const categories = Array.from(new Set(filteredItems.map(i => i.category)));

  return (
    <aside className="w-64 bg-[#1d2327] border-r border-[#2c3338] flex flex-col shrink-0 text-[#f0f0f1] select-none text-xs font-sans">
      {/* Super Admin Brand Header */}
      <div className="p-3.5 border-b border-[#2c3338] bg-[#191e23]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#ea580c] flex items-center justify-center text-white font-black shadow-xs text-sm">
            OFX
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white tracking-wide text-xs">OFIXBAZE CMS</span>
              <span className="text-[9px] bg-[#00a32a] text-white px-1.5 py-0.2 rounded font-semibold">ENTERPRISE</span>
            </div>
            <p className="text-[10px] text-[#a7aaad] truncate">Executive Office Suite 7.0</p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-2.5 relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search tabs..."
            className="w-full pl-7 pr-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Navigation List grouped by Category */}
      <div className="flex-1 py-2 overflow-y-auto space-y-3">
        {categories.map(cat => {
          const items = filteredItems.filter(i => i.category === cat);
          return (
            <div key={cat} className="space-y-0.5">
              <div className="px-3.5 pt-1 pb-1 text-[10px] font-bold text-[#8c8f94] uppercase tracking-wider">
                {cat}
              </div>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id as AdminTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-[#2271b1] text-white font-bold'
                        : 'text-[#c3c4c7] hover:bg-[#13171a] hover:text-[#72aee6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.alertCount !== undefined && item.alertCount > 0 ? (
                        <span className="bg-[#d63638] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                          {item.alertCount}
                        </span>
                      ) : item.badge ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          item.isPro 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'bg-[#2c3338] text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      ) : item.count !== undefined ? (
                        <span className="text-[#8c8f94] text-[10px]">{item.count}</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer / Storefront link */}
      <div className="p-3 border-t border-[#2c3338] bg-[#191e23] space-y-2">
        <button
          onClick={() => setActivePage('home')}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-[#2c3338] hover:bg-[#2271b1] text-[#f0f0f1] hover:text-white rounded text-xs font-semibold transition cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Front Website</span>
        </button>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#a7aaad]">
          <span className="truncate max-w-[140px] font-mono text-[10px]">{adminEmail}</span>
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-bold"
            title="Log out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
