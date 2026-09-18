import { Order, RFQRequest, StoreSettings } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'OFX-78421',
    trackingNumber: 'TRK-NG-889124',
    date: '07 Sep 2026, 09:15 AM',
    items: [
      {
        productId: 'hp-05a-black-original-laserjet-toner-cartridge-ce505a',
        productName: 'Original HP 05A Black LaserJet Toner (CE505A)',
        quantity: 4,
        price: 68500,
        image: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg'
      },
      {
        productId: 'ergonomics-chair-soft-leather-swivel-chair',
        productName: 'Ergonomics Soft Leather Swivel Chair',
        quantity: 1,
        price: 185000,
        image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png'
      }
    ],
    subtotal: 459000,
    shipping: 0,
    discount: 15000,
    total: 444000,
    currency: 'NGN',
    status: 'Out for Delivery',
    customer: {
      fullName: 'Chief Babatunde Adeleke',
      companyName: 'Apex Capital Partners Ltd',
      email: 'b.adeleke@apexcapital.ng',
      phone: '+234 803 555 9821',
      address: 'Plot 14, Broad Street, Marina',
      city: 'Lagos Island',
      state: 'Lagos State',
      country: 'Nigeria'
    },
    paymentMethod: 'Corporate Bank Transfer'
  },
  {
    id: 'OFX-92314',
    trackingNumber: 'TRK-NG-192834',
    date: '06 Sep 2026, 03:30 PM',
    items: [
      {
        productId: 'hp-85a-black-original-laserjet-toner-cartridge-ce285a',
        productName: 'Original HP 85A Black LaserJet Toner (CE285A)',
        quantity: 10,
        price: 49500,
        image: 'https://ofixbaze.com/wp-content/uploads/2020/04/85a.jpg'
      }
    ],
    subtotal: 495000,
    shipping: 5000,
    discount: 25000,
    total: 475000,
    currency: 'NGN',
    status: 'Delivered',
    customer: {
      fullName: 'Barrister Nneka Okafor',
      companyName: 'Prime Chambers & Legal Services',
      email: 'procurement@primechambers.com',
      phone: '+234 802 334 1190',
      address: 'Suite 402, Churchgate Towers, Victoria Island',
      city: 'Victoria Island',
      state: 'Lagos State',
      country: 'Nigeria'
    },
    paymentMethod: 'Corporate Purchase Order (PO)'
  },
  {
    id: 'OFX-10492',
    trackingNumber: 'TRK-NG-340912',
    date: '07 Sep 2026, 11:45 AM',
    items: [
      {
        productId: 'baze-920-bank-grade-cash-counter-heavy-duty',
        productName: 'Baze 920 Bank Grade Cash Counter Machine',
        quantity: 2,
        price: 320000,
        image: 'https://ofixbaze.com/wp-content/uploads/2020/04/baze-920-money-counting-machine.jpg'
      }
    ],
    subtotal: 640000,
    shipping: 0,
    discount: 0,
    total: 640000,
    currency: 'NGN',
    status: 'Processing',
    customer: {
      fullName: 'Alhaji Ibrahim Danladi',
      companyName: 'Danladi Financial Services Bureau',
      email: 'ibrahim@danladifinance.com',
      phone: '+234 809 111 8722',
      address: '22 Airport Road, Ikeja',
      city: 'Ikeja',
      state: 'Lagos State',
      country: 'Nigeria'
    },
    paymentMethod: 'Direct Debit / Card'
  },
  {
    id: 'OFX-88401',
    trackingNumber: 'TRK-NG-552093',
    date: '05 Sep 2026, 04:10 PM',
    items: [
      {
        productId: 'hp-laserjet-pro-mfp-4103fdw-multifunction-printer',
        productName: 'HP LaserJet Pro MFP 4103fdw Printer',
        quantity: 1,
        price: 580000,
        image: 'https://ofixbaze.com/wp-content/uploads/2020/04/hp-4103fdw.jpg'
      }
    ],
    subtotal: 580000,
    shipping: 8000,
    discount: 10000,
    total: 578000,
    currency: 'NGN',
    status: 'Shipped',
    customer: {
      fullName: 'Engr. Kenneth Emeka',
      companyName: 'Nexus Infrastructure Engineering',
      email: 'k.emeka@nexus-ng.com',
      phone: '+234 814 990 4421',
      address: 'Plot 77 Central Business District',
      city: 'Abuja',
      state: 'Abuja FCT',
      country: 'Nigeria'
    },
    paymentMethod: 'Corporate Bank Transfer'
  }
];

export const INITIAL_RFQS: RFQRequest[] = [
  {
    id: 'rfq-001',
    referenceId: 'RFQ-84920',
    date: '07 Sep 2026, 10:20 AM',
    companyName: 'Zenith Microfinance Bank PLC',
    rcNumber: 'RC-1049281',
    contactPerson: 'Mrs. Folake Adeyemi (Head of Procurement)',
    email: 'procurement@zenithmfb.ng',
    phone: '+234 803 762 9910',
    deliveryLocation: 'Victoria Island & Lekki Phase 1 Branches',
    procurementType: 'Annual Corporate Tender',
    itemRequirements: 'Need 50 units Original HP 05A toner, 30 units HP 85A toner, and 8 units Comix S350 Heavy Duty Shredders for 4 branches. Stamped proforma invoice required with TIN & VAT breakdown.',
    urgency: 'urgent_24h',
    status: 'Pending',
    quoteAmountNGN: 4850000,
    adminNotes: 'High priority corporate client. Prepared 12% bulk discount tier for toners.'
  },
  {
    id: 'rfq-002',
    referenceId: 'RFQ-73194',
    date: '06 Sep 2026, 02:40 PM',
    companyName: 'KPMG West Africa Headquarters',
    rcNumber: 'RC-998412',
    contactPerson: 'David Alabi (Facilities Lead)',
    email: 'd.alabi@kpmg-procure.ng',
    phone: '+234 802 541 2289',
    deliveryLocation: 'Ikoyi, Lagos',
    procurementType: 'Office Setup / Bulk Furniture',
    itemRequirements: 'Executive boardroom renovation: 16 units Ergonomic Soft Leather Swivel Chairs, 2 Executive CEO Tables, and 6 Fireproof Document Safes.',
    urgency: 'standard_48h',
    status: 'Quotation Sent',
    quoteAmountNGN: 6420000,
    adminNotes: 'Formal proforma sent to David via email with 2-year manufacturer warranty certificate.'
  },
  {
    id: 'rfq-003',
    referenceId: 'RFQ-61205',
    date: '05 Sep 2026, 11:15 AM',
    companyName: 'Federal Inland Revenue Service (FIRS) Annex',
    rcNumber: 'GOV-FIRS-891',
    contactPerson: 'Mallam Sani Garba',
    email: 'sani.garba@firs.gov.ng',
    phone: '+234 806 889 0041',
    deliveryLocation: 'Central Business District, Abuja',
    procurementType: 'Government Supply Contract',
    itemRequirements: '100 units of heavy duty currency counting machines with ultraviolet fake note detection (Baze 920 model).',
    urgency: 'standard_48h',
    status: 'Approved',
    quoteAmountNGN: 29500000,
    adminNotes: 'Contract awarded. LPO received. Ready for batch 1 delivery to Abuja hub.'
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Ofixbaze Nigeria Limited',
  tagline: 'Nigeria\'s Trusted Hub for Genuine HP Toners & Executive Office Furniture',
  announcementText: '⚡ Nationwide Delivery: Same-Day Delivery in Lagos & 24-48h Delivery to Abuja, Port Harcourt & Ibadan! Call: 0906-942-5822',
  showAnnouncement: true,
  phone1: '0906-942-5822',
  phone2: '0802-092-3522',
  whatsapp: '+2348020923522',
  email: 'info@ofixbaze.com',
  address: '20/22 Bamgbose Street, Off Tinubu Square, Lagos Island, Lagos State, Nigeria',
  businessHours: 'Mon - Fri: 8:00 AM – 6:00 PM | Sat: 9:00 AM – 4:00 PM',
  freeShippingThresholdNGN: 500000,
  standardShippingFeeNGN: 5000
};

export interface SlideConfig {
  id: string;
  enabled: boolean;
  highlightTitle: string;
  mainTitle: string;
  subtitle: string;
  tagline: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  deliveryText: string;
  image: string;
}

export const INITIAL_SLIDES_CONFIG: SlideConfig[] = [
  {
    id: 'executive-tables',
    enabled: true,
    highlightTitle: 'PREMIUM',
    mainTitle: 'EXECUTIVE TABLES',
    subtitle: 'SUPERIOR CRAFTSMANSHIP. UNCOMPROMISED ELEGANCE.',
    tagline: 'THE ULTIMATE WORKSPACE FOR LEADERS & VISIONARIES.',
    primaryBtnText: 'REQUEST EXECUTIVE QUOTE',
    secondaryBtnText: 'EXPLORE ALL DESKS & TABLES',
    deliveryText: 'Same-Day Lagos White-Glove Assembled Delivery Available',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png'
  },
  {
    id: 'executive-chairs',
    enabled: true,
    highlightTitle: 'PREMIUM',
    mainTitle: 'EXECUTIVE CEO CHAIRS',
    subtitle: 'LUXURY ERGONOMIC LEATHER. UNCOMPROMISED COMFORT.',
    tagline: 'DESIGNED FOR BOARDROOM LEADERS & TIRELESS EXECUTIVES.',
    primaryBtnText: 'REQUEST CORPORATE QUOTE',
    secondaryBtnText: 'EXPLORE EXECUTIVE SEATING',
    deliveryText: 'Ready for Immediate Dispatch — Stamped OEM Certificate Included',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png'
  },
  {
    id: 'visitor-chairs',
    enabled: true,
    highlightTitle: 'PREMIUM',
    mainTitle: 'VISITOR & CONFERENCE CHAIRS',
    subtitle: 'PRESTIGE GUEST COMFORT FOR BOARDROOMS & RECEPTIONS.',
    tagline: 'COMMAND RESPECT FROM THE FIRST MOMENT CLIENTS ENTER.',
    primaryBtnText: 'REQUEST BULK QUOTE',
    secondaryBtnText: 'BROWSE VISITOR COLLECTION',
    deliveryText: 'Bulk Quantity In Stock — Guaranteed Next-Day Lagos Setup',
    image: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png'
  }
];
