import { 
  CMSPage, 
  CMSBrand, 
  CMSMediaItem, 
  CMSBlogPost, 
  CMSForm, 
  CMSFormSubmission, 
  CMSTestimonial, 
  CMSTemplate, 
  CMSUser, 
  CMSCustomer,
  CMSSection
} from '../types';

export const INITIAL_CMS_MEDIA: CMSMediaItem[] = [
  {
    id: 'media-1',
    url: '/public/executive-tables-banner.jpg',
    filename: 'executive-tables-banner.jpg',
    fileSize: '482 KB',
    fileType: 'image',
    uploadedAt: '05 Sep 2026',
    altText: 'Executive Tables & Desks Lagos Showcase',
    dimensions: '1920x800'
  },
  {
    id: 'media-2',
    url: '/public/ceo-chairs-banner.jpg',
    filename: 'ceo-chairs-banner.jpg',
    fileSize: '512 KB',
    fileType: 'image',
    uploadedAt: '05 Sep 2026',
    altText: 'Executive CEO Chairs Lineup',
    dimensions: '1920x800'
  },
  {
    id: 'media-3',
    url: '/public/visitor-chairs-banner.jpg',
    filename: 'visitor-chairs-banner.jpg',
    fileSize: '460 KB',
    fileType: 'image',
    uploadedAt: '05 Sep 2026',
    altText: 'Visitor and Conference Chairs',
    dimensions: '1920x800'
  },
  {
    id: 'media-4',
    url: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg',
    filename: 'hp-05a-toner.jpg',
    fileSize: '124 KB',
    fileType: 'image',
    uploadedAt: '06 Sep 2026',
    altText: 'HP 05A Original LaserJet Toner Cartridge CE505A',
    dimensions: '600x600'
  },
  {
    id: 'media-5',
    url: 'https://ofixbaze.com/wp-content/uploads/2020/04/85a.jpg',
    filename: 'hp-85a-toner.jpg',
    fileSize: '118 KB',
    fileType: 'image',
    uploadedAt: '06 Sep 2026',
    altText: 'HP 85A Black Original LaserJet Toner Cartridge CE285A',
    dimensions: '600x600'
  },
  {
    id: 'media-6',
    url: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png',
    filename: 'ergonomic-executive-chair.png',
    fileSize: '340 KB',
    fileType: 'image',
    uploadedAt: '07 Sep 2026',
    altText: 'Ergonomic Executive Chair High Back',
    dimensions: '800x800'
  },
  {
    id: 'media-7',
    url: 'https://ofixbaze.com/wp-content/uploads/2020/04/baze-920-money-counting-machine.jpg',
    filename: 'baze-920-cash-counter.jpg',
    fileSize: '195 KB',
    fileType: 'image',
    uploadedAt: '07 Sep 2026',
    altText: 'Baze 920 Bank Grade Cash Counter',
    dimensions: '600x600'
  },
  {
    id: 'media-8',
    url: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg',
    filename: 'hp-authorized-dealer-logo.jpg',
    fileSize: '45 KB',
    fileType: 'image',
    uploadedAt: '01 Sep 2026',
    altText: 'HP Authorized Partner Logo',
    dimensions: '300x150'
  },
  {
    id: 'media-9',
    url: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg',
    filename: 'sharp-copiers-logo.jpg',
    fileSize: '52 KB',
    fileType: 'image',
    uploadedAt: '01 Sep 2026',
    altText: 'Sharp Copiers & Solutions Lagos Logo',
    dimensions: '300x150'
  }
];

export const INITIAL_CMS_BRANDS: CMSBrand[] = [
  {
    id: 'brand-hp',
    name: 'HP (Hewlett-Packard)',
    slug: 'hp',
    logo: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg',
    description: 'World leader in precision laser printing, genuine toner cartridges, and enterprise workstation security.',
    website: 'https://www.hp.com',
    isFeatured: true,
    productCount: 42,
    badge: 'Direct Authorized Partner'
  },
  {
    id: 'brand-sharp',
    name: 'Sharp Corporation',
    slug: 'sharp',
    logo: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg',
    description: 'Premier heavy-duty multifunction digital photocopiers and high-volume departmental print stations.',
    website: 'https://global.sharp',
    isFeatured: true,
    productCount: 16,
    badge: 'Tier 1 Dealer'
  },
  {
    id: 'brand-canon',
    name: 'Canon Business Solutions',
    slug: 'canon',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
    description: 'Renowned imageCLASS laser printers, imageRUNNER heavy copiers, and photographic inks.',
    website: 'https://www.canon.com',
    isFeatured: true,
    productCount: 24,
    badge: 'Authorized Stockist'
  },
  {
    id: 'brand-epson',
    name: 'Epson EcoTank',
    slug: 'epson',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
    description: 'Heat-Free precision core continuous ink tank printers and industrial wide format plotters.',
    website: 'https://www.epson.com',
    isFeatured: true,
    productCount: 19,
    badge: 'Certified Partner'
  },
  {
    id: 'brand-comix',
    name: 'Comix Heavy Industry',
    slug: 'comix',
    logo: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=300&auto=format&fit=crop&q=80',
    description: 'Foremost manufacturer of DIN Level 4 security paper shredders, binding machines, and laminators.',
    website: 'https://www.comix.com',
    isFeatured: true,
    productCount: 28,
    badge: 'Exclusive Importer'
  },
  {
    id: 'brand-apc',
    name: 'APC by Schneider Electric',
    slug: 'apc',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    description: 'Smart-UPS uninterruptible power supplies, voltage regulators, and data center surge protection.',
    website: 'https://www.apc.com',
    isFeatured: true,
    productCount: 15,
    badge: 'Official Distributor'
  }
];

export const INITIAL_CMS_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: 'test-1',
    name: 'Chief Babatunde Adeleke',
    company: 'Apex Capital Partners Ltd',
    role: 'Managing Partner & CEO',
    rating: 5,
    content: 'Ofixbaze outfitted our 3-floor Marina corporate headquarters with executive walnut boardroom tables and genuine HP laserjet cartridges. Outstanding delivery speed and genuine OEM peace of mind.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true,
    order: 1
  },
  {
    id: 'test-2',
    name: 'Barrister Nneka Okafor',
    company: 'Prime Chambers Legal Services',
    role: 'Head of Administration',
    rating: 5,
    content: 'The authenticity verification QR codes on their HP toners saved us from counterfeit market hazards. When you have strict court filing deadlines, you cannot risk toner smudges. Ofixbaze delivers every single time.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    active: true,
    order: 2
  },
  {
    id: 'test-3',
    name: 'Engr. Kenneth Emeka',
    company: 'Nexus Infrastructure Engineering',
    role: 'Director of Procurement',
    rating: 5,
    content: 'From Abuja we ordered 16 ergonomic executive mesh chairs and a Sharp high-speed digital copier. Assembled white-glove arrival right in our Central Business District office without any damage.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    active: true,
    order: 3
  },
  {
    id: 'test-4',
    name: 'Folake Adeyemi',
    company: 'Zenith Microfinance Bank',
    role: 'Facilities & Procurement Lead',
    rating: 5,
    content: 'The RFQ proforma portal made corporate audit reconciliation effortless. We received formal TIN/VAT stamped documents within 2 hours. A true corporate supply partner.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    active: true,
    order: 4
  }
];

export const INITIAL_CMS_BLOG_POSTS: CMSBlogPost[] = [
  {
    id: 'post-1',
    title: '5 Crucial Ways to Spot Fake vs Genuine HP Toner Cartridges in Nigeria',
    slug: '5-ways-to-spot-fake-hp-toner-lagos',
    excerpt: 'Counterfeit cartridges damage expensive drum units and print faint, streaky invoices. Learn how to verify official HP security holograms and QR verification seal codes.',
    content: `Counterfeiting in the Nigerian print supplies market remains a rampant risk for corporate organizations and accounting departments. In this guide, our certified print engineering team breaks down the definitive checkpoints to ensure you never pay OEM prices for refilled counterfeit cartridges:

1. **The Dynamic Hologram Test**: Tilt the box left to right. The 'OK' and checkmark should move in OPPOSITE directions to the tilt.
2. **HP SureSupply QR Code**: Scan the unique 2D matrix code using the official HP SureSupply mobile verification app before unsealing.
3. **Pristine Vacuum Pull-Tab**: Genuine HP 05A, 85A, 26A, and 59A toners always feature a seamless pull-tab ribbon that releases cleanly with no glue residue.
4. **Serial Number Registration**: Ensure the external box serial matches the embossed injection stamp on the cartridge casing.
5. **Authorized Corporate Invoices**: Purchase exclusively from authorized distributors like Ofixbaze Nigeria Limited who guarantee 100% replacement warranty.`,
    featuredImage: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg',
    category: 'Print Supplies & Toners',
    tags: ['HP Toner', 'Authenticity', 'Lagos Office Supplies', 'OEM Cartridges'],
    author: 'Engr. Damilola Ojo',
    publishedAt: '04 Sep 2026',
    status: 'published',
    seoTitle: 'How to Spot Fake HP Toner in Nigeria | Ofixbaze OEM Guide',
    seoDescription: 'Protect your office printers: 5 foolproof checks to verify genuine HP toner cartridges in Lagos and across Nigeria.',
    readTimeMinutes: 4
  },
  {
    id: 'post-2',
    title: 'Ergonomics for CEOs: Preventing Lumbar Strain in 10-Hour Executive Days',
    slug: 'ergonomics-for-ceos-preventing-lumbar-strain',
    excerpt: 'Sitting in poor chairs costs Nigerian corporate leaders thousands in health care and lost focus. Here is why orthopedic lumbar support matters.',
    content: `Modern leadership requires long hours of strategic deliberations, financial reviews, and client negotiations. Standard budget office chairs compress the sciatic nerve and force the lumbar spine into an unnatural curvature.

Investing in an Italian-grade executive leather swivel chair with synchronized tilt mechanism, waterfall seat edge, and adaptive lumbar cushions ensures:
- **Optimal Spinal Alignment**: Neutralizing lower back pressure points.
- **Micro-climate Breathability**: Premium perforated leather prevents heat buildup during power outages.
- **Reinforced BIFMA Class 4 Gas Lift**: Guaranteed stability for leaders of all heights and body types.`,
    featuredImage: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png',
    category: 'Executive Furniture',
    tags: ['Ergonomic Chairs', 'Office Health', 'Executive Tables', 'Boardroom Setup'],
    author: 'Chidinma Nwachukwu (Physiotherapy Consultant)',
    publishedAt: '01 Sep 2026',
    status: 'published',
    seoTitle: 'Ergonomic Office Chairs Lagos Nigeria | Executive Seating Guide',
    seoDescription: 'Discover why orthopedic executive seating increases corporate stamina and lumbar comfort for Nigerian leaders.',
    readTimeMinutes: 5
  },
  {
    id: 'post-3',
    title: 'NDPR Compliance & Data Security: Why Level 4 Cross-Cut Shredders are Mandatory',
    slug: 'ndpr-compliance-data-security-cross-cut-shredders',
    excerpt: 'Under the Nigeria Data Protection Regulation (NDPR), throwing intact bank slips, customer IDs, and payroll records in trash bins invites massive legal liabilities.',
    content: `Financial institutions, law chambers, and corporate consultancies handle sensitive personal information daily. Strip-cut shredders that cut papers into long ribbons can easily be pieced back together by bad actors.

A German DIN P-4 cross-cut or micro-cut shredder (such as the Comix S350) renders A4 sheets into over 400 unreadable confetti particles, ensuring absolute compliance with NDPR and international ISO 27001 data protection standards.`,
    featuredImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&auto=format&fit=crop&q=80',
    category: 'Office Security & Machines',
    tags: ['Paper Shredders', 'NDPR Compliance', 'Data Security', 'Comix'],
    author: 'Ofixbaze Corporate Compliance Team',
    publishedAt: '28 Aug 2026',
    status: 'published',
    seoTitle: 'NDPR Compliant Paper Shredders Lagos | Data Protection Machines',
    seoDescription: 'Ensure legal data destruction for your Nigerian business with heavy-duty DIN P-4 cross-cut paper shredders.',
    readTimeMinutes: 6
  }
];

export const INITIAL_CMS_FORMS: CMSForm[] = [
  {
    id: 'form-rfq',
    name: 'Corporate Request for Quotation (RFQ)',
    slug: 'corporate-rfq',
    description: 'Collects formal corporate tenders, branch requirements, and LPO documentation details.',
    submitButtonText: 'Generate Stamped Proforma Quote',
    successMessage: 'Thank you! Your corporate RFQ reference ID has been assigned. Our B2B desk will email your proforma within 2-4 hours.',
    submissionsCount: 24,
    createdAt: '01 Sep 2026',
    fields: [
      { id: 'f-1', label: 'Company / Organization Name', name: 'companyName', type: 'text', placeholder: 'e.g. Zenith Bank PLC', required: true },
      { id: 'f-2', label: 'CAC RC Number (Optional)', name: 'rcNumber', type: 'text', placeholder: 'RC-XXXXXX', required: false },
      { id: 'f-3', label: 'Contact Person & Title', name: 'contactPerson', type: 'text', placeholder: 'e.g. Mrs. Folake Adeyemi (Procurement)', required: true },
      { id: 'f-4', label: 'Official Corporate Email', name: 'email', type: 'email', placeholder: 'procurement@company.ng', required: true },
      { id: 'f-5', label: 'Phone / WhatsApp Number', name: 'phone', type: 'phone', placeholder: '+234 800 000 0000', required: true },
      { id: 'f-6', label: 'Delivery Location & Address', name: 'location', type: 'text', placeholder: 'e.g. Victoria Island, Lagos & CBD Abuja', required: true },
      { id: 'f-7', label: 'Item Quantities & Specific Requirements', name: 'requirements', type: 'textarea', placeholder: 'Specify toner model numbers, chair units, shredders, or desks required...', required: true }
    ]
  },
  {
    id: 'form-contact',
    name: 'General Contact & Showroom Visit',
    slug: 'contact-showroom',
    description: 'Inquiries regarding showroom inspections, warranties, and warehouse collections.',
    submitButtonText: 'Send Message to Ofixbaze',
    successMessage: 'Your message has been received. A customer support representative will contact you shortly.',
    submissionsCount: 18,
    createdAt: '01 Sep 2026',
    fields: [
      { id: 'fc-1', label: 'Your Full Name', name: 'fullName', type: 'text', placeholder: 'e.g. Kolawole Balogun', required: true },
      { id: 'fc-2', label: 'Email Address', name: 'email', type: 'email', placeholder: 'kola@email.com', required: true },
      { id: 'fc-3', label: 'Phone Number', name: 'phone', type: 'phone', placeholder: '0802 123 4567', required: true },
      { id: 'fc-4', label: 'Subject / Department', name: 'subject', type: 'select', options: ['Product Inquiry', 'Showroom Inspection', 'Warranty Support', 'Bulk Corporate Order', 'Delivery Tracking'], required: true },
      { id: 'fc-5', label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can we help your office today?', required: true }
    ]
  },
  {
    id: 'form-newsletter',
    name: 'Corporate Newsletter & OEM Alerts',
    slug: 'newsletter',
    description: 'Weekly price updates on HP toners, FX rate adjustments, and furniture arrivals.',
    submitButtonText: 'Subscribe for Price Alerts',
    successMessage: 'Successfully subscribed to Ofixbaze weekly corporate supplies bulletin!',
    submissionsCount: 142,
    createdAt: '01 Sep 2026',
    fields: [
      { id: 'fn-1', label: 'Work Email', name: 'email', type: 'email', placeholder: 'you@company.com', required: true }
    ]
  }
];

export const INITIAL_CMS_SUBMISSIONS: CMSFormSubmission[] = [
  {
    id: 'sub-1',
    formId: 'form-rfq',
    formName: 'Corporate Request for Quotation (RFQ)',
    submittedAt: '07 Sep 2026, 11:20 AM',
    data: {
      companyName: 'TotalEnergies Marketing Nigeria PLC',
      contactPerson: 'Engr. Taiwo Adebayo (Facilities Lead)',
      email: 'taiwo.adebayo@totalenergies.com',
      phone: '+234 803 220 9182',
      location: 'Victoria Island Headquarters & Apapa Depot',
      requirements: 'Need urgent quote for 40 units HP 26A (CF226A) and 20 units HP 59A (CF259A) toners plus 4 heavy-duty Comix S350 shredders.'
    },
    status: 'New'
  },
  {
    id: 'sub-2',
    formId: 'form-contact',
    formName: 'General Contact & Showroom Visit',
    submittedAt: '06 Sep 2026, 04:15 PM',
    data: {
      fullName: 'Dr. Stella Briggs',
      email: 's.briggs@lagosmed.ng',
      phone: '+234 802 881 3340',
      subject: 'Showroom Inspection',
      message: 'Can our hospital management committee visit your Bamgbose Street showroom on Thursday to test the leather executive chairs in person?'
    },
    status: 'Read'
  },
  {
    id: 'sub-3',
    formId: 'form-rfq',
    formName: 'Corporate Request for Quotation (RFQ)',
    submittedAt: '05 Sep 2026, 09:40 AM',
    data: {
      companyName: 'Access Bank Retail Banking Division',
      contactPerson: 'Ifeanyi Okonkwo',
      email: 'i.okonkwo@accessbankplc.com',
      phone: '+234 814 559 1204',
      location: 'Lekki Admiralty Way Branch',
      requirements: 'Quote for 8 units Baze 920 Cash Counting Machines with Ultraviolet & Magnetic Counterfeit Detection.'
    },
    status: 'Replied'
  }
];

export const INITIAL_CMS_USERS: CMSUser[] = [
  {
    id: 'user-1',
    name: 'OFIXBAZE Admin Lead',
    email: 'admin@ofixbaze.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today, 10:45 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-2',
    name: 'Chinedu Eze',
    email: 'chinedu@ofixbaze.com',
    role: 'Product Manager',
    status: 'Active',
    lastLogin: 'Yesterday, 03:20 PM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-3',
    name: 'Amina Yusuf',
    email: 'orders@ofixbaze.com',
    role: 'Order Manager',
    status: 'Active',
    lastLogin: '05 Sep 2026, 11:15 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-4',
    name: 'Tunde Bakare',
    email: 'editor@ofixbaze.com',
    role: 'Content Manager',
    status: 'Active',
    lastLogin: '04 Sep 2026, 02:00 PM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CMS_CUSTOMERS: CMSCustomer[] = [
  {
    id: 'cust-1',
    fullName: 'Chief Babatunde Adeleke',
    companyName: 'Apex Capital Partners Ltd',
    email: 'b.adeleke@apexcapital.ng',
    phone: '+234 803 555 9821',
    city: 'Lagos Island',
    state: 'Lagos State',
    totalOrders: 6,
    totalSpentNGN: 4890000,
    quoteRequestsCount: 3,
    status: 'VIP',
    lastActive: '07 Sep 2026'
  },
  {
    id: 'cust-2',
    fullName: 'Barrister Nneka Okafor',
    companyName: 'Prime Chambers & Legal Services',
    email: 'procurement@primechambers.com',
    phone: '+234 802 334 1190',
    city: 'Victoria Island',
    state: 'Lagos State',
    totalOrders: 4,
    totalSpentNGN: 2450000,
    quoteRequestsCount: 2,
    status: 'VIP',
    lastActive: '06 Sep 2026'
  },
  {
    id: 'cust-3',
    fullName: 'Alhaji Ibrahim Danladi',
    companyName: 'Danladi Financial Services Bureau',
    email: 'ibrahim@danladifinance.com',
    phone: '+234 809 111 8722',
    city: 'Ikeja',
    state: 'Lagos State',
    totalOrders: 2,
    totalSpentNGN: 960000,
    quoteRequestsCount: 1,
    status: 'Active',
    lastActive: '07 Sep 2026'
  },
  {
    id: 'cust-4',
    fullName: 'Engr. Kenneth Emeka',
    companyName: 'Nexus Infrastructure Engineering',
    email: 'k.emeka@nexus-ng.com',
    phone: '+234 814 990 4421',
    city: 'Central Business District',
    state: 'Abuja FCT',
    totalOrders: 5,
    totalSpentNGN: 7200000,
    quoteRequestsCount: 4,
    status: 'VIP',
    lastActive: '05 Sep 2026'
  },
  {
    id: 'cust-5',
    fullName: 'Folake Adeyemi',
    companyName: 'Zenith Microfinance Bank PLC',
    email: 'procurement@zenithmfb.ng',
    phone: '+234 803 762 9910',
    city: 'Lekki Phase 1',
    state: 'Lagos State',
    totalOrders: 8,
    totalSpentNGN: 14600000,
    quoteRequestsCount: 6,
    status: 'VIP',
    lastActive: '07 Sep 2026'
  }
];

export const INITIAL_CMS_SECTIONS_HOMEPAGE: CMSSection[] = [
  {
    id: 'sec-hero',
    name: 'Executive Hero Slider',
    enabled: true,
    settings: {
      layout: 'full-width',
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: '480px'
    },
    widgets: [
      {
        id: 'w-hero-slider',
        type: 'hero_banner',
        title: 'Executive Hero Banner Carousel',
        content: {
          badge: "NIGERIA'S TRUSTED CORPORATE PROCUREMENT PARTNER",
          text: 'PREMIUM OFFICE EQUIPMENT. BUILT FOR BUSINESS.',
          subtext: 'Supply your workplace with genuine OEM toners, executive furniture, printers, and document machines with official warranty and fast Lagos delivery.',
          buttonText: 'REQUEST CORPORATE QUOTE',
          buttonUrl: '/rfq',
          secondaryBtnText: 'EXPLORE CATALOGUE',
          secondaryBtnUrl: '/shop',
          imageUrl: '/public/executive-tables-banner.jpg'
        },
        settings: {
          textColor: '#ffffff',
          bgColor: '#0f172a',
          paddingTop: 48,
          paddingBottom: 48,
          animation: 'fade'
        }
      }
    ]
  },
  {
    id: 'sec-trust',
    name: 'Trust Badges & Corporate Guarantees',
    enabled: true,
    settings: {
      layout: 'boxed',
      paddingTop: 24,
      paddingBottom: 24,
      bgColor: '#ffffff'
    },
    widgets: [
      {
        id: 'w-trust-badges',
        type: 'trust_badges',
        title: 'Corporate Value Pillars',
        content: {
          items: [
            { id: 'tb-1', title: '100% Genuine Guarantee', description: 'Original OEM hologram & tamper-proof seal on all toners', icon: 'ShieldCheck' },
            { id: 'tb-2', title: 'Same-Day Lagos Dispatch', description: 'Express delivery to Island, Ikeja, Lekki & Nationwide', icon: 'Truck' },
            { id: 'tb-3', title: 'Corporate Tender & RFQ', description: 'Formal stamped proforma invoices with TIN & VAT breakdown', icon: 'FileText' },
            { id: 'tb-4', title: 'Dedicated B2B Support', description: 'Direct account manager for corporate supply contracts', icon: 'Headphones' }
          ]
        },
        settings: {
          columnsCount: 4,
          animation: 'fade-up'
        }
      }
    ]
  },
  {
    id: 'sec-featured-cats',
    name: 'Popular Departments Showcase',
    enabled: true,
    settings: {
      layout: 'boxed',
      paddingTop: 32,
      paddingBottom: 32
    },
    widgets: [
      {
        id: 'w-cats-grid',
        type: 'category_grid',
        title: 'Explore Office Departments',
        content: {
          badge: 'TOP CATEGORIES',
          text: 'Explore Corporate Office Categories',
          subtext: 'Equip your workspace with certified office equipment and luxurious executive seating'
        },
        settings: {
          columnsCount: 6,
          animation: 'fade-up'
        }
      }
    ]
  },
  {
    id: 'sec-featured-prods',
    name: 'Featured Executive Products',
    enabled: true,
    settings: {
      layout: 'boxed',
      paddingTop: 32,
      paddingBottom: 32
    },
    widgets: [
      {
        id: 'w-featured-prods',
        type: 'product_grid',
        title: 'Featured Products Grid',
        content: {
          badge: 'CURATED ESSENTIALS',
          text: 'High-Demand Corporate Supplies',
          subtext: 'Bestselling HP toner cartridges and orthopedic executive chairs trusted by top Nigerian corporations'
        },
        settings: {
          columnsCount: 4,
          productsLimit: 8,
          animation: 'fade-up'
        }
      }
    ]
  },
  {
    id: 'sec-cta-quote',
    name: 'Corporate RFQ Procurement Banner',
    enabled: true,
    settings: {
      layout: 'boxed',
      paddingTop: 40,
      paddingBottom: 40,
      bgColor: '#1e293b',
      borderRadius: 16
    },
    widgets: [
      {
        id: 'w-quote-cta',
        type: 'cta_banner',
        title: 'Corporate Procurement Call-to-Action',
        content: {
          badge: 'CORPORATE TENDERS & ANNUAL CONTRACTS',
          text: 'Need Bulk Pricing with Stamped Proforma Invoices?',
          subtext: 'Submit your departmental requirements or LPO bill of quantities. Our corporate desk delivers detailed quotations within 2 hours.',
          buttonText: 'SUBMIT CORPORATE RFQ NOW',
          buttonUrl: '/rfq',
          secondaryBtnText: 'CALL DIRECT: 0906-942-5822',
          secondaryBtnUrl: 'tel:09069425822'
        },
        settings: {
          textColor: '#ffffff',
          textAlign: 'center',
          animation: 'zoom'
        }
      }
    ]
  },
  {
    id: 'sec-testimonials',
    name: 'Client Endorsements & Reviews',
    enabled: true,
    settings: {
      layout: 'boxed',
      paddingTop: 36,
      paddingBottom: 36
    },
    widgets: [
      {
        id: 'w-testimonials',
        type: 'testimonials',
        title: 'Trusted by Leaders',
        content: {
          badge: 'TESTIMONIALS',
          text: 'What Corporate Clients Say About Ofixbaze',
          subtext: 'Over 500+ Nigerian enterprises rely on our genuine supplies and executive office furniture.'
        },
        settings: {
          columnsCount: 3,
          animation: 'fade-up'
        }
      }
    ]
  }
];

export const INITIAL_CMS_PAGES: CMSPage[] = [
  {
    id: 'page-home',
    title: 'Homepage',
    slug: 'home',
    status: 'published',
    author: 'Super Admin',
    createdAt: '01 Sep 2026',
    updatedAt: '07 Sep 2026',
    template: 'default',
    seoTitle: 'OFIXBAZE | Office Furniture, HP Toner, Ink, UPS & Shredders Lagos Nigeria',
    seoDescription: 'Ofixbaze Nigeria Limited - Foremost corporate distributor of genuine HP toner cartridges, inks, executive office furniture, paper shredders, copiers and UPS in Lagos.',
    sections: INITIAL_CMS_SECTIONS_HOMEPAGE
  },
  {
    id: 'page-about',
    title: 'About Ofixbaze',
    slug: 'about',
    status: 'published',
    author: 'Super Admin',
    createdAt: '01 Sep 2026',
    updatedAt: '05 Sep 2026',
    template: 'default',
    seoTitle: 'About Us | Ofixbaze Nigeria Limited Corporate Furniture & Equipment',
    seoDescription: 'Learn about Ofixbaze Nigeria Limited, our Bamgbose Street showroom, corporate values, and official dealership with HP, Sharp, and Comix.',
    sections: [
      {
        id: 'sec-about-hero',
        name: 'About Us Hero',
        enabled: true,
        settings: {
          layout: 'full-width',
          bgColor: '#0f172a',
          textColor: '#ffffff',
          paddingTop: 60,
          paddingBottom: 60
        },
        widgets: [
          {
            id: 'w-about-title',
            type: 'heading',
            title: 'About Header',
            content: {
              badge: 'OUR COMPANY STORY',
              text: 'Nigeria’s Trusted Corporate Workplace Partner',
              subtext: 'Supplying top financial institutions, multinational consultancies, and government agencies with genuine print supplies and prestige executive furniture.'
            },
            settings: {
              textAlign: 'center',
              textColor: '#ffffff'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'page-rfq',
    title: 'Request Corporate Quote (RFQ)',
    slug: 'rfq',
    status: 'published',
    author: 'Super Admin',
    createdAt: '01 Sep 2026',
    updatedAt: '06 Sep 2026',
    template: 'default',
    seoTitle: 'Request Corporate Quotation | Ofixbaze B2B Tender Portal',
    seoDescription: 'Submit corporate supply requirements for proforma quotes with VAT and TIN breakdown. Express same-day turnaround for Nigerian companies.',
    sections: [
      {
        id: 'sec-rfq-banner',
        name: 'RFQ Intro Section',
        enabled: true,
        settings: {
          layout: 'boxed',
          paddingTop: 40,
          paddingBottom: 40
        },
        widgets: [
          {
            id: 'w-rfq-heading',
            type: 'heading',
            title: 'RFQ Title',
            content: {
              badge: 'OFFICIAL CORPORATE TENDERS',
              text: 'Request Instant Stamped Proforma Invoices',
              subtext: 'Designed specifically for Nigerian procurement departments, audit committees, and administrative officers.'
            },
            settings: {
              textAlign: 'center'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'page-contact',
    title: 'Contact & Showroom',
    slug: 'contact',
    status: 'published',
    author: 'Super Admin',
    createdAt: '01 Sep 2026',
    updatedAt: '05 Sep 2026',
    template: 'default',
    seoTitle: 'Contact Ofixbaze Lagos | Bamgbose Street Showroom & Warehouse',
    seoDescription: 'Visit our Lagos Island showroom at 20/22 Bamgbose Street, off Tinubu Square. Call 0906-942-5822 for inquiries.',
    sections: []
  },
  {
    id: 'page-executive-furniture',
    title: 'Executive Boardroom Furniture Collection',
    slug: 'executive-boardroom-furniture',
    status: 'draft',
    author: 'Chinedu Eze',
    createdAt: '06 Sep 2026',
    updatedAt: '07 Sep 2026',
    template: 'full-width',
    seoTitle: 'Luxury Executive Boardroom Tables & CEO Chairs Lagos',
    seoDescription: 'High-end ergonomic leather swivel chairs, solid mahogany executive desks, and conference suites.',
    sections: []
  }
];

export const INITIAL_CMS_TEMPLATES: CMSTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Executive CEO Chairs & Tables Showcase',
    description: 'High-impact dark luxury aesthetic with gold accents, perfect for leadership seating and executive boardroom suites.',
    category: 'section',
    thumbnail: '/public/executive-tables-banner.jpg',
    sectionData: {
      id: 'sec-tpl-exec',
      name: 'Executive Luxury Suite',
      enabled: true,
      settings: {
        layout: 'boxed',
        bgColor: '#0f172a',
        textColor: '#ffffff',
        paddingTop: 48,
        paddingBottom: 48,
        borderRadius: 16
      },
      widgets: [
        {
          id: 'w-tpl-hero',
          type: 'heading',
          title: 'Executive Showcase',
          content: {
            badge: 'PREMIER CORPORATE SEATING',
            text: 'Crafted for Visionary Leaders',
            subtext: 'Top-grain Italian leather, synchronous recline, and orthopedic lumbar support.'
          },
          settings: {
            textAlign: 'center',
            textColor: '#ffffff'
          }
        }
      ]
    }
  },
  {
    id: 'tpl-2',
    title: 'Genuine HP Toner Bestsellers Ribbon',
    description: 'High conversion toner grid with authenticity hologram guarantee badge and instant Add to Cart buttons.',
    category: 'section',
    thumbnail: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg',
    sectionData: {
      id: 'sec-tpl-toner',
      name: 'HP Toner OEM Ribbon',
      enabled: true,
      settings: {
        layout: 'boxed',
        paddingTop: 36,
        paddingBottom: 36
      },
      widgets: [
        {
          id: 'w-tpl-toners',
          type: 'product_grid',
          title: 'HP OEM Toners',
          content: {
            badge: '100% ORIGINAL OEM CARTRIDGES',
            text: 'Popular HP LaserJet Toner Cartridges',
            subtext: 'Avoid counterfeit hazards. All cartridges backed by manufacturer seal and scan verification.'
          },
          settings: {
            columnsCount: 4,
            productsLimit: 4
          }
        }
      ]
    }
  },
  {
    id: 'tpl-3',
    title: 'Corporate B2B RFQ Proforma CTA Strip',
    description: 'Direct call-to-action with proforma invoice reference generator, hotline numbers, and tender button.',
    category: 'section',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    sectionData: {
      id: 'sec-tpl-rfq',
      name: 'Corporate RFQ Banner',
      enabled: true,
      settings: {
        layout: 'boxed',
        bgColor: '#ea580c',
        textColor: '#ffffff',
        paddingTop: 40,
        paddingBottom: 40,
        borderRadius: 16
      },
      widgets: [
        {
          id: 'w-tpl-rfq-cta',
          type: 'cta_banner',
          title: 'RFQ Strip',
          content: {
            badge: 'ANNUAL CORPORATE TENDERS',
            text: 'Need Bulk Pricing with Stamped Proforma Invoices?',
            subtext: 'Submit your procurement list today. Official quotations delivered within 2 hours.',
            buttonText: 'REQUEST CORPORATE QUOTE',
            buttonUrl: '/rfq'
          },
          settings: {
            textColor: '#ffffff',
            textAlign: 'center'
          }
        }
      ]
    }
  }
];
