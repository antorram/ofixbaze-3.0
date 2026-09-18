import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Send, 
  CheckCircle,
  ExternalLink,
  CreditCard,
  Building,
  HelpCircle,
  Lock
} from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
  onOpenAuthenticityModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActivePage,
  onSelectCategory,
  onOpenAuthenticityModal
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        
        {/* Brand Top Assurance Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-900/40 text-blue-400 border border-blue-800/60 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine OEM Toners</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct factory-sealed HP, Canon & Epson cartridges with tamper-evident security labels.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/60 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Lagos & Nationwide Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Same-day dispatch across Lagos Island, Victoria Island, Ikeja and express delivery nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-900/40 text-amber-400 border border-amber-800/60 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Corporate Procurement (B2B)</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Proforma invoices, bulk enterprise discount tiers, and quarterly toner supply contracts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-purple-900/40 text-purple-400 border border-purple-800/60 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Multi-Payment</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct corporate bank transfer, Card payments, and Corporate Purchase Orders (PO).
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Col 1: About Ofixbaze */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <div className="bg-white p-1.5 rounded-md inline-block">
                <img 
                  src="https://ofixbaze.com/wp-content/uploads/2020/04/LOGO.jpg" 
                  alt="OFIXBAZE Nigeria Limited" 
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Ofixbaze Nigeria Limited was established with an ideal mind of being the most reliable and trusted company providing efficient service deliveries in IT products, genuine HP toners, and executive office furniture across Nigeria.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>20/22, Bamgbose Street, Off Tinubu Square, Lagos Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0906-942-5822 / 0802-092-3522 / 0806-765-5771</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@ofixbaze.com / ofixbaze@yahoo.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Mon - Fri: 8:00 AM – 6:00 PM | Sat: 9:00 AM – 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 2: Top Departments */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Equipment & Supplies
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => { onSelectCategory('toners-cartridges'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Original HP Toners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('printers-copiers'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  LaserJet & Copiers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('office-machines'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Heavy Paper Shredders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('office-machines'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Currency Counter Machines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('furniture-safes'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Fireproof Safes & Chairs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('power-ups'); setActivePage('shop'); }}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  APC Smart-UPS & Power
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Corporate */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Corporate & Help
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setActivePage('rfq')}
                  className="hover:text-amber-400 font-semibold transition cursor-pointer text-amber-300 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Request Corporate Quote (RFQ)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('track-order')}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuthenticityModal}
                  className="hover:text-emerald-400 transition cursor-pointer text-slate-400 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  HP Hologram Verification Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('about')}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  About Our Lagos Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('contact')}
                  className="hover:text-blue-400 transition cursor-pointer text-slate-400"
                >
                  Contact & Showroom Directions
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => setActivePage('admin')}
                  className="hover:text-amber-400 text-slate-400 font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Staff / Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Verification */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Corporate Newsletter
            </h5>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe for monthly corporate price sheets, bulk discounts, and new toner arrival notifications.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter company email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="bg-slate-900 border border-slate-700 text-white px-3 py-2 text-xs rounded-l-md w-full focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition flex items-center justify-center cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Subscribed! Price updates will be sent to your inbox.</span>
                </div>
              )}
            </form>

            <div className="mt-5 p-3 rounded bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anti-Counterfeit Commitment
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                We strictly reject refilled, cloned or fake cartridges. Every HP toner sold is 100% factory original with manufacturer serial numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ofixbaze Nigeria Limited. All rights reserved. RC: 1489201.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Payment by: Direct Bank Transfer • Paystack • POS on Delivery • PO Terms</span>
            <span>•</span>
            <button
              onClick={() => setActivePage('admin')}
              className="text-slate-500 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer font-medium"
              title="Staff & Admin Portal"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
