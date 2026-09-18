import React from 'react';
import { 
  Plus, 
  ExternalLink, 
  Bell, 
  Search, 
  Sparkles, 
  RefreshCw,
  Menu,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { ActivePage } from '../../types';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  setActivePage: (page: ActivePage) => void;
  onOpenAddProductModal: () => void;
  onRefreshData?: () => void;
  lowStockCount: number;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  setActivePage,
  onOpenAddProductModal,
  onRefreshData,
  lowStockCount,
  onToggleMobileMenu
}) => {
  const getTabDetails = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Store Performance & Executive Overview',
          description: 'Real-time sales analytics, catalog inventory status, and corporate quotation pipeline.'
        };
      case 'products':
        return {
          title: 'Product Catalog & Inventory Management',
          description: 'Add new items, adjust stock counts, update prices, and configure OEM badges.'
        };
      case 'orders':
        return {
          title: 'Order Processing & Dispatch Tracking',
          description: 'Manage customer orders, issue tracking numbers, update dispatch steps, and print proformas.'
        };
      case 'rfq':
        return {
          title: 'Corporate RFQ & Wholesale Tenders',
          description: 'Review corporate quotes from banks, multinationals, and government organizations.'
        };
      case 'customizer':
        return {
          title: 'Theme & Layout Customizer',
          description: 'Reorder or hide sections, fully edit section titles & content, change brand colors, and configure site layout.'
        };
      case 'categories':
        return {
          title: 'Product Categories & Departments',
          description: 'Create, modify, and reorganize store departments, subcategories, and storefront taxonomy.'
        };
      case 'menus':
        return {
          title: 'Site Navigation & Header Menus',
          description: 'Manage main navigation links, target URLs, category filters, and promotional badge highlights.'
        };
      case 'banners':
        return {
          title: 'Homepage Hero Sliders & Promotions',
          description: 'Customize headline copies, buttons, delivery badges, and visual promotional banners.'
        };
      case 'builder':
        return {
          title: 'Elementor-Style Visual Page Builder',
          description: 'Live drag-and-drop section builder with real-time responsive previews, widgets, and layout tree.'
        };
      case 'pages':
        return {
          title: 'Website Pages & CMS Architecture',
          description: 'Manage homepage, corporate about, RFQ tenders, B2B procurement guides, and custom landing pages.'
        };
      case 'brands':
        return {
          title: 'OEM Partner Brands & Authorizations',
          description: 'Manage official manufacturer partnerships, warranty authorizations, and brand showcase tiers.'
        };
      case 'customers':
        return {
          title: 'Corporate Accounts & CRM Directory',
          description: 'Commercial client ledger, credit ratings, procurement managers, and corporate transaction history.'
        };
      case 'media':
        return {
          title: 'Central Media Library & Asset Manager',
          description: 'Upload, manage, organize, and copy CDN URLs for banners, logos, and high-res product photos.'
        };
      case 'blog':
        return {
          title: 'Articles, News & Procurement Guides',
          description: 'Publish executive buyer guides, equipment maintenance tips, and enterprise office insights.'
        };
      case 'forms':
        return {
          title: 'Custom Forms & Corporate Inquiries Inbox',
          description: 'Review incoming customer requests, tender inquiries, and configure custom input form schemas.'
        };
      case 'testimonials':
        return {
          title: 'Client Testimonials & Corporate Trust',
          description: 'Executive reviews, corporate buyer endorsements, and verified client satisfaction ratings.'
        };
      case 'templates':
        return {
          title: 'Elementor & Section Template Library',
          description: 'Pre-designed conversion sections, hero headers, trust blocks, and importable page layouts.'
        };
      case 'seo':
        return {
          title: 'SEO & Schema Markup Suite',
          description: 'Meta titles, OpenGraph social cards, JSON-LD structured data, and search engine previews.'
        };
      case 'users':
        return {
          title: 'Admin Staff & Permission Access Matrix',
          description: 'Manage administrator team accounts, assign operational roles, and configure granular permissions.'
        };
      case 'settings':
        return {
          title: 'Global Store Settings & Configurations',
          description: 'Store contact details, announcement ticker text, and corporate shipping rules.'
        };
      default:
        return {
          title: 'Super Admin Portal',
          description: 'Enterprise website management system.'
        };
    }
  };

  const { title, description } = getTabDetails(currentTab);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Low stock alert badge */}
        {lowStockCount > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{lowStockCount} items need restock</span>
          </div>
        )}

        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddProductModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>

        {/* View Storefront Button */}
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
          title="Open live customer view"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </button>
      </div>
    </header>
  );
};
