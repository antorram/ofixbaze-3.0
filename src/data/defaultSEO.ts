import { SiteSEOConfig } from '../types';

export const INITIAL_SEO_CONFIG: SiteSEOConfig = {
  siteTitle: 'Ofixbaze Nigeria Limited',
  titleSeparator: '|',
  defaultMetaDescription: 'Ofixbaze is Nigeria’s trusted corporate supplier of 100% genuine HP LaserJet toners, commercial paper shredders, banknote counters, and luxury executive office furniture with nationwide delivery.',
  defaultKeywords: 'office supplies Lagos, genuine HP toner Nigeria, buy laserjet cartridges Lagos, ergonomic chairs Nigeria, banknote counting machine, paper shredders Ikeja, corporate procurement Lagos',
  canonicalDomain: 'https://ofixbaze.com',
  defaultOgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  twitterHandle: '@OfixbazeNG',
  googleSiteVerification: 'google-site-verification=ofx_ng_enterprise_verified_token_2026',
  bingVerification: 'BING_VERIFICATION_OFIXBAZE_NG_2026',
  ga4MeasurementId: 'G-OFX889124NG',
  facebookPixelId: 'FB-PIXEL-7829104829',
  sitemapEnabled: true,
  autoGenerateProductSchema: true,
  robotsTxtContent: `# Robots.txt for Ofixbaze Nigeria Limited
User-agent: *
Allow: /
Allow: /shop
Allow: /about
Allow: /contact
Allow: /rfq
Allow: /track-order
Disallow: /admin
Disallow: /checkout
Disallow: /api/

# Sitemaps
Sitemap: https://ofixbaze.com/sitemap.xml
`,
  pages: {
    home: {
      pageId: 'home',
      pageName: 'Home Page',
      urlPath: '/',
      metaTitle: 'Ofixbaze Nigeria | Genuine HP Toner, Office Printers & Luxury Furniture Lagos',
      metaDescription: 'Shop authorized commercial office technology in Nigeria. Factory-sealed HP toner cartridges, high-capacity shredders, currency counters, and ergonomic seating.',
      focusKeywords: 'HP toner Lagos, office furniture Nigeria, currency counting machines, Comix paper shredders, genuine office supplies',
      canonicalUrl: 'https://ofixbaze.com/',
      ogImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-10'
    },
    shop: {
      pageId: 'shop',
      pageName: 'Shop Catalog',
      urlPath: '/shop',
      metaTitle: 'Buy Commercial Office Equipment & Genuine Supplies | Ofixbaze Nigeria',
      metaDescription: 'Explore our complete catalog of certified office machines, printer cartridges, cash counters, and executive desk sets with official warranties and fast delivery.',
      focusKeywords: 'buy office supplies Nigeria, genuine toners, office desks Lagos, money counters Ikeja, wholesale stationery',
      canonicalUrl: 'https://ofixbaze.com/shop',
      ogImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-12'
    },
    rfq: {
      pageId: 'rfq',
      pageName: 'Corporate RFQ & Tenders',
      urlPath: '/rfq',
      metaTitle: 'Request Corporate Proforma Invoice & RFQ Tenders | Ofixbaze Nigeria',
      metaDescription: 'Submit corporate procurement tenders and get guaranteed proforma invoices with verified OEM certificates within 2 business hours across Nigeria.',
      focusKeywords: 'corporate procurement Lagos, RFQ Nigeria, office supplies tender, proforma invoice, bulk toner supply',
      canonicalUrl: 'https://ofixbaze.com/rfq',
      ogImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-08'
    },
    about: {
      pageId: 'about',
      pageName: 'About Us',
      urlPath: '/about',
      metaTitle: 'About Ofixbaze Nigeria Limited | Official Corporate Procurement Partners',
      metaDescription: 'Learn about Ofixbaze Nigeria Limited, headquartered in Lagos, supplying commercial banks, multinational enterprises, and government agencies since 2018.',
      focusKeywords: 'about Ofixbaze, office technology company Lagos, OEM distributor Nigeria, commercial office supplies',
      canonicalUrl: 'https://ofixbaze.com/about',
      ogImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-01'
    },
    contact: {
      pageId: 'contact',
      pageName: 'Contact & Showroom',
      urlPath: '/contact',
      metaTitle: 'Contact Ofixbaze Lagos Showroom & Technical Service Center',
      metaDescription: 'Reach our corporate sales team at 14 Broad Street Marina Lagos Island and Ikeja Service Hub. Call +234 803 555 9821 for express delivery.',
      focusKeywords: 'Ofixbaze contact, Lagos office showroom, Marina Lagos Island office supplies, toner repair Lagos',
      canonicalUrl: 'https://ofixbaze.com/contact',
      ogImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-05'
    },
    'track-order': {
      pageId: 'track-order',
      pageName: 'Track Order',
      urlPath: '/track-order',
      metaTitle: 'Track Nationwide Corporate Order Delivery Status | Ofixbaze Nigeria',
      metaDescription: 'Real-time consignment tracking for all corporate orders and dispatch vans operating across Lagos, Abuja, Port Harcourt, and all 36 states.',
      focusKeywords: 'track Ofixbaze order, delivery tracking Nigeria, logistics dispatch status, corporate invoice tracker',
      canonicalUrl: 'https://ofixbaze.com/track-order',
      ogImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      robotsDirective: 'index, follow',
      lastUpdated: '2026-09-07'
    }
  }
};
