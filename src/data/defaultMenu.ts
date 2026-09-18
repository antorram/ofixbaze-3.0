import { NavMenuItem } from '../types';

export const DEFAULT_NAV_MENU: NavMenuItem[] = [
  { 
    id: 'nav-home', 
    label: 'HOME', 
    type: 'page', 
    target: 'home', 
    order: 1, 
    enabled: true 
  },
  { 
    id: 'nav-products', 
    label: 'Products', 
    type: 'page', 
    target: 'shop', 
    categorySlug: 'all', 
    order: 2, 
    enabled: true,
    children: [
      {
        id: 'nav-printer',
        label: 'PRINTER',
        type: 'category',
        target: 'shop',
        categorySlug: 'printer',
        order: 1,
        enabled: true,
        children: [
          { id: 'nav-p-hp-color', label: 'HP Color Printer', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'HP Color Printer', order: 1, enabled: true },
          { id: 'nav-p-hp-color-mfp', label: 'HP Color MFP', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'HP Color MFP', order: 2, enabled: true },
          { id: 'nav-p-hp-black', label: 'HP Black Printer', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'HP Black Printer', order: 3, enabled: true },
          { id: 'nav-p-hp-black-mfp', label: 'HP Black MFP', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'HP Black MFP', order: 4, enabled: true },
          { id: 'nav-p-hp-deskjet', label: 'HP DeskJet Printer', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'DeskJet', order: 5, enabled: true },
          { id: 'nav-p-hp-officejet', label: 'HP OfficeJet', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'OfficeJet', order: 6, enabled: true },
          { id: 'nav-p-hp-smarttank', label: 'HP Smart Tank', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'Smart Tank', order: 7, enabled: true },
          { id: 'nav-p-mobile-printer', label: 'Mobile Printer', type: 'category', target: 'shop', categorySlug: 'printer', searchKeyword: 'Mobile Printer', order: 8, enabled: true }
        ]
      },
      {
        id: 'nav-toners',
        label: 'TONERS',
        type: 'category',
        target: 'shop',
        categorySlug: 'toners',
        order: 2,
        enabled: true,
        children: [
          { id: 'nav-t-hp-black', label: 'HP Black Toner', type: 'category', target: 'shop', categorySlug: 'toners', searchKeyword: 'HP Black Toner', order: 1, enabled: true },
          { id: 'nav-t-hp-color', label: 'HP Color Toner', type: 'category', target: 'shop', categorySlug: 'toners', searchKeyword: 'HP Color Toner', order: 2, enabled: true },
          { id: 'nav-t-sharp', label: 'Sharp Toner', type: 'category', target: 'shop', categorySlug: 'toners', searchKeyword: 'Sharp Toner', order: 3, enabled: true },
          { id: 'nav-t-canon', label: 'Canon Toner', type: 'category', target: 'shop', categorySlug: 'toners', searchKeyword: 'Canon Toner', order: 4, enabled: true },
          { id: 'nav-t-samsung', label: 'Samsung Toner', type: 'category', target: 'shop', categorySlug: 'toners', searchKeyword: 'Samsung Toner', order: 5, enabled: true }
        ]
      },
      {
        id: 'nav-inks',
        label: 'INKS',
        type: 'category',
        target: 'shop',
        categorySlug: 'inks',
        order: 3,
        enabled: true,
        children: [
          { id: 'nav-i-hp-ink', label: 'HP Ink', type: 'category', target: 'shop', categorySlug: 'inks', searchKeyword: 'HP Ink', order: 1, enabled: true },
          { id: 'nav-i-hp-printhead', label: 'HP Printhead', type: 'category', target: 'shop', categorySlug: 'inks', searchKeyword: 'Printhead', order: 2, enabled: true },
          { id: 'nav-i-canon-ink', label: 'Canon Ink', type: 'category', target: 'shop', categorySlug: 'inks', searchKeyword: 'Canon Ink', order: 3, enabled: true }
        ]
      },
      {
        id: 'nav-ups',
        label: 'UPS',
        type: 'category',
        target: 'shop',
        categorySlug: 'ups',
        order: 4,
        enabled: true,
        children: [
          { id: 'nav-u-apc', label: 'APC UPS', type: 'category', target: 'shop', categorySlug: 'ups', searchKeyword: 'APC', order: 1, enabled: true },
          { id: 'nav-u-bluegate', label: 'BLUE GATE UPS', type: 'category', target: 'shop', categorySlug: 'ups', searchKeyword: 'BLUE GATE', order: 2, enabled: true }
        ]
      },
      {
        id: 'nav-kits',
        label: 'KITS',
        type: 'category',
        target: 'shop',
        categorySlug: 'kits',
        order: 5,
        enabled: true,
        children: [
          { id: 'nav-k-transfer', label: 'HP IMAGE TRANSFER KIT', type: 'category', target: 'shop', categorySlug: 'kits', searchKeyword: 'TRANSFER KIT', order: 1, enabled: true }
        ]
      },
      {
        id: 'nav-accessories',
        label: 'ACCESSORIES',
        type: 'category',
        target: 'shop',
        categorySlug: 'accessories',
        order: 6,
        enabled: true,
        children: [
          { id: 'nav-a-accessories', label: 'Accessories', type: 'category', target: 'shop', categorySlug: 'accessories', order: 1, enabled: true }
        ]
      }
    ]
  },
  { 
    id: 'nav-office-furniture', 
    label: 'Office Furniture', 
    type: 'page', 
    target: 'shop', 
    categorySlug: 'office-furniture', 
    order: 3, 
    enabled: true,
    children: [
      {
        id: 'nav-f-chairs',
        label: 'Office Chairs',
        type: 'category',
        target: 'shop',
        categorySlug: 'office-chairs',
        order: 1,
        enabled: true,
        children: [
          { id: 'nav-c-ceo', label: 'Executive ceo chairs', type: 'category', target: 'shop', categorySlug: 'executive-ceo-chairs', searchKeyword: 'CEO', order: 1, enabled: true },
          { id: 'nav-c-ergo', label: 'Ergonomic Chairs', type: 'category', target: 'shop', categorySlug: 'ergonomic-chairs', searchKeyword: 'Ergonomic', order: 2, enabled: true },
          { id: 'nav-c-vis', label: 'Visitors Chair', type: 'category', target: 'shop', categorySlug: 'visitors-chairs', searchKeyword: 'Visitor', order: 3, enabled: true }
        ]
      },
      {
        id: 'nav-f-tables',
        label: 'Executive Tables',
        type: 'category',
        target: 'shop',
        categorySlug: 'executive-tables',
        order: 2,
        enabled: true
      }
    ]
  },
  { 
    id: 'nav-rfq', 
    label: 'Request Quote', 
    type: 'page', 
    target: 'rfq', 
    badge: 'RFQ',
    order: 4, 
    enabled: true 
  },
  { 
    id: 'nav-about', 
    label: 'About Us', 
    type: 'page', 
    target: 'about', 
    order: 5, 
    enabled: true 
  },
  { 
    id: 'nav-contact', 
    label: 'Contact Us', 
    type: 'page', 
    target: 'contact', 
    order: 6, 
    enabled: true 
  },
  {
    id: 'nav-track-order',
    label: 'Track Order',
    type: 'page',
    target: 'track-order',
    order: 7,
    enabled: true
  }
];
