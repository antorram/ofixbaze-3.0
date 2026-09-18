import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-printer',
    name: 'PRINTER',
    slug: 'printer',
    iconName: 'Printer',
    itemCount: 8,
    description: 'Commercial & office laser printers, Color MFP, DeskJet, OfficeJet, Smart Tank, and Mobile Printers.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'HP Color Printer',
      'HP Color MFP',
      'HP Black Printer',
      'HP Black MFP',
      'HP DeskJet Printer',
      'HP OfficeJet',
      'HP Smart Tank',
      'Mobile Printer'
    ]
  },
  {
    id: 'cat-toners',
    name: 'TONERS',
    slug: 'toners',
    iconName: 'Droplets',
    itemCount: 15,
    description: '100% Genuine OEM laser toner cartridges with verifiable manufacturer security hologram seals.',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/07/hp-85a-toner-1.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'HP Black Toner',
      'HP Color Toner',
      'Sharp Toner',
      'Canon Toner',
      'Samsung Toner'
    ]
  },
  {
    id: 'cat-inks',
    name: 'INKS',
    slug: 'inks',
    iconName: 'Pipette',
    itemCount: 6,
    description: 'Original ink bottles, ink cartridges, and precision replacement printheads for continuous color printing.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'HP Ink',
      'HP Printhead',
      'Canon Ink'
    ]
  },
  {
    id: 'cat-ups',
    name: 'UPS',
    slug: 'ups',
    iconName: 'Zap',
    itemCount: 4,
    description: 'Enterprise pure sine wave online and line-interactive UPS solutions for uninterrupted clean power backup.',
    image: 'https://ofixbaze.com/wp-content/uploads/2018/07/ups.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'APC UPS',
      'BLUE GATE UPS'
    ]
  },
  {
    id: 'cat-kits',
    name: 'KITS',
    slug: 'kits',
    iconName: 'Layers',
    itemCount: 2,
    description: 'Original HP image transfer kits, roller maintenance kits, and fuser replacement kits.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'HP IMAGE TRANSFER KIT'
    ]
  },
  {
    id: 'cat-accessories',
    name: 'ACCESSORIES',
    slug: 'accessories',
    iconName: 'Package',
    itemCount: 3,
    description: 'Original printer accessories, expansion trays, power adapters, and connectivity cables.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'Accessories'
    ]
  },
  {
    id: 'cat-office-chairs',
    name: 'Office Chairs',
    slug: 'office-chairs',
    iconName: 'Crown',
    itemCount: 34,
    description: 'High-back leather boss chairs, ergonomic breathable mesh chairs, and cantilever visitor reception seating.',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png',
    bannerImage: 'https://images.unsplash.com/photo-1580481077195-c328ad0c4600?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'Executive ceo chairs',
      'Ergonomic Chairs',
      'Visitors Chair'
    ]
  },
  {
    id: 'cat-executive-tables',
    name: 'Executive Tables',
    slug: 'executive-tables',
    iconName: 'LayoutGrid',
    itemCount: 6,
    description: 'Executive conference tables, luxury L-shaped walnut workstations, and modern illuminated office desks.',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-23-2026-10_57_51-AM.png',
    bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    showBannerImageOnly: false,
    bannerHeight: 'medium',
    subcategories: [
      'Executive Tables'
    ]
  }
];
