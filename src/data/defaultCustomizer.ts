import { SiteCustomizerConfig } from '../types';
import { DEFAULT_NAV_MENU } from './defaultMenu';

export const DEFAULT_CUSTOMIZER_CONFIG: SiteCustomizerConfig = {
  theme: {
    primaryColor: '#ea580c', // Classic Ofixbaze Orange
    secondaryColor: '#2563eb', // Royal Corporate Blue
    headerBg: '#ffffff',
    topBarBg: '#0f172a', // Slate 900
    topBarTextColor: '#ffffff',
    footerBg: '#020617', // Slate 950
    fontFamily: 'Inter',
    borderRadius: 'rounded-xl',
  },
  sections: [
    {
      id: 'hero',
      name: 'Hero Slider & Procurement Banner',
      description: 'Main promotional carousel showcasing top equipment, fast dispatch, and instant tender RFQ button.',
      enabled: true,
      order: 1,
      sectionTitle: 'Office Supplies & Corporate Procurement',
      sectionSubtitle: '100% Genuine HP Toners, Ergonomic Seating & Executive Furniture',
      sectionBadge: 'Official OEM Distributor',
      buttonText: 'Request Corporate Proforma',
      buttonLink: 'rfq'
    },
    {
      id: 'trust_badges',
      name: 'Value Proposition & Trust Badges',
      description: '4-point security grid: OEM guarantee, same-day delivery, 24/7 procurement support, and VAT invoices.',
      enabled: true,
      order: 2,
      sectionTitle: 'Our Corporate Guarantee',
      sectionSubtitle: 'Why Nigerian multinationals & banks trust Ofixbaze for office supplies',
      sectionBadge: 'Enterprise Procurement Standards'
    },
    {
      id: 'categories',
      name: 'Department Categories Grid',
      description: 'Quick-access grid showcasing Executive CEO Chairs, Ergonomic Seating, Tables, Toners, and Office Equipment.',
      enabled: true,
      order: 3,
      sectionTitle: 'Shop by Department',
      sectionSubtitle: 'Explore our complete selection of commercial office equipment & furniture',
      sectionBadge: 'Product Departments',
      buttonText: 'View All Departments',
      buttonLink: 'shop'
    },
    {
      id: 'hp_bento_showcase',
      name: 'HP Equipment & Consumables Bento Grid',
      description: '4-tile promotional showcase with HP LaserJet Printers, Toners, Inks and Instant Quote request.',
      enabled: true,
      order: 4,
    },
    {
      id: 'hp_compatibility_banner',
      name: 'HP Printer Toner Compatibility Finder',
      description: 'Quick filter banner with HP 59A, 17A, 26A, 85A compatibility chips.',
      enabled: true,
      order: 5,
    },
    {
      id: 'popular_categories_showcase',
      name: 'Popular Categories & Quote Showcase',
      description: 'Tabbed equipment categories with RFQ quote card, 5-column HP 651A product grid and pagination.',
      enabled: true,
      order: 6,
    },
    {
      id: 'hp_efficiency_strip',
      name: 'HP Toner Efficiency & Reliability Strip',
      description: 'High-energy gradient banner highlighting genuine HP printing efficiency.',
      enabled: true,
      order: 7,
    },
    {
      id: 'flash_deals',
      name: 'Urgent Clearance & Flash Deals',
      description: 'Live countdown timer and discounted corporate clearance items with discount percentages.',
      enabled: true,
      order: 8,
      sectionTitle: 'Hot Office Supplies Deals of the Week',
      sectionSubtitle: 'Special bulk discount pricing on original HP cartridges, copiers and shredders.',
      sectionBadge: 'Limited Corporate Deals',
      buttonText: 'View All Clearance Items',
      buttonLink: 'shop'
    },
    {
      id: 'featured_tabs',
      name: 'Corporate Catalog Tabs',
      description: 'Tabbed browsing for Featured, Toners & Inks, Printers & Copiers, and Office Machines.',
      enabled: true,
      order: 9,
      sectionTitle: 'Featured Office Equipment & Toners',
      sectionSubtitle: 'Hand-picked certified products ready for immediate dispatch',
      sectionBadge: 'Verified Stock',
      buttonText: 'Browse Complete Product Catalog (120+ Products)',
      buttonLink: 'shop'
    },
    {
      id: 'toner_slider',
      name: 'Hot Toner Deals Carousel Slider',
      description: 'Sliding carousel of genuine HP & compatible laserjet toners with live countdown timer.',
      enabled: true,
      order: 10,
      sectionTitle: 'Hot Genuine HP Toner Deals of the Week',
      sectionSubtitle: 'Special bulk discount pricing on original HP LaserJet cartridges with verified security holograms.',
      sectionBadge: 'Limited Corporate Toner Deals'
    },
    {
      id: 'anti_counterfeit',
      name: 'Anti-Counterfeit Protection Banner',
      description: 'Security hologram verification guide and genuine OEM badge information.',
      enabled: true,
      order: 11,
      sectionTitle: "Don't Ruin Your Printer with Counterfeit Toners",
      sectionSubtitle: 'Every HP toner sold by Ofixbaze carries an original factory security label and verified serial code.',
      sectionBadge: 'Protect Your Office Equipment',
      buttonText: 'Launch Hologram Verification Guide',
      buttonLink: 'modal',
      bgColor: '#064e3b',
      textColor: '#ffffff'
    },
    {
      id: 'quote_banner',
      name: 'Bulk RFQ Tender Callout Banner',
      description: 'High-contrast corporate call-to-action banner for tenders, bank orders, and proforma invoices.',
      enabled: true,
      order: 12,
      sectionTitle: 'Ordering for a Company, Bank, or Government Agency?',
      sectionSubtitle: 'We provide official proforma invoices, flexible Corporate Purchase Order (PO) terms, tax invoices, and quarterly replenishment contracts.',
      sectionBadge: 'B2B Wholesale & Tenders',
      buttonText: 'Request Corporate Proforma (RFQ)',
      buttonLink: 'rfq',
      bgColor: '#f1f5f9',
      textColor: '#0f172a'
    },
    {
      id: 'brand_partners',
      name: 'Authorized Brand Partners',
      description: 'Official manufacturer showcase (HP, Sharp, Canon, Epson, Comix, APC) with OEM dealer accreditation.',
      enabled: true,
      order: 13,
      sectionTitle: 'Authorized Brands & Official Manufacturers',
      sectionSubtitle: 'Direct relationships with world-class office technology manufacturers',
      sectionBadge: 'Direct OEM Supply Chain'
    },
    {
      id: 'clients',
      name: 'Corporate Clients & Conglomerates',
      description: 'Client proof banner displaying Dangote Group, Nigerian Gas Company, Opes Manus, and top financial banks.',
      enabled: false,
      order: 14,
      sectionTitle: 'Serving Multinational Corporates, Energy Firms & Financial Institutions',
      sectionSubtitle: 'Trusted by over 500+ top organizations across Nigeria',
      sectionBadge: 'Proven Track Record'
    },
    {
      id: 'testimonials',
      name: 'Procurement Reviews & Testimonials',
      description: 'Customer ratings and feedback from leading corporate procurement managers.',
      enabled: true,
      order: 15,
      sectionTitle: 'Trusted by Procurement Managers',
      sectionSubtitle: 'Read feedback from corporate clients who procure their office equipment from our Lagos showroom.',
      sectionBadge: 'Verified Customer Reviews'
    }
  ],
  navMenu: DEFAULT_NAV_MENU,
  announcement: {
    enabled: true,
    text: '⚡ Free Nationwide Delivery on Corporate Bulk Orders Over ₦2,000,000 | 100% Genuine OEM Warranty Guaranteed',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
  },
  header: {
    showHotline: true,
    hotlineText: '+234 802 222 6323',
    showRfqButton: true,
    siteTitle: 'OFIXBAZE NIGERIA LIMITED',
    logoUrl: '',
  },
  footer: {
    copyrightText: '© 2026 OFIXBAZE NIGERIA LIMITED (RC: 1548231). All Rights Reserved.',
    aboutText: 'Nigeria\'s premier corporate procurement portal for 100% authentic HP toners, ergonomic office furniture, heavy-duty paper shredders, and enterprise power solutions.',
    showNewsletter: true,
  }
};
