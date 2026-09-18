import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Users, 
  Award, 
  MapPin, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { ActivePage } from '../types';

interface AboutPageProps {
  setActivePage: (page: ActivePage) => void;
  onOpenAuthenticityModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActivePage, onOpenAuthenticityModal }) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-10">
      
      {/* Hero Intro */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            About Ofixbaze Nigeria Limited
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Nigeria's Foremost Corporate Hub for Genuine Office Supplies &amp; IT Equipment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Ofixbaze Nigeria Limited was established in Nigeria with an ideal mind of being the most reliable and trusted company providing efficient and effective service deliveries in terms of supply and distribution of genuine IT products, HP toners, and executive office furniture.
          </p>
        </div>
      </div>

      {/* Story & Evolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Serving Customers as Kings
          </h2>
          <p>
            At <strong>OBNL (Ofixbaze Nigeria Limited)</strong>, Client Satisfaction is our primary priority. <em>"Customer is Number 1"</em> is our major core value with a vision of serving them as <strong>Kings</strong> as well as maintaining our trusted name in all industry segments.
          </p>
          <p>
            We are major dealers and suppliers of Ink Cartridges, black and colour toner Cartridges, Scanners, UPS, Projectors, Paper Shredders, Executive Tables, and Office Chairs. Our long-running partnerships with industry-leading partners gives us the opportunity to satisfy our clients' needs at all times as well as offering at affordable prices.
          </p>
          <p>
            By our dedicated teamwork and well-defined strategies, we earn continuous patronage from multinational firms, financial institutions, gas conglomerates, and leading corporations across Nigeria.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuthenticityModal}
              className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer border border-blue-200"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>How We Verify Original HP Security Seals</span>
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
          <img
            src="https://ofixbaze.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-23-2026-10_57_51-AM.png"
            alt="Ofixbaze Executive Showroom"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
            <div className="text-white text-xs">
              <p className="font-bold text-sm">Ofixbaze Corporate Office &amp; Showroom</p>
              <p className="text-slate-300">20/22, Bamgbose Street, Off Tinubu Square, Lagos Nigeria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-sm space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-800/60 px-2.5 py-1 rounded">
            Our Mission
          </span>
          <h3 className="text-lg font-black text-white">
            Excellence &amp; Efficiency
          </h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            "To be the foremost corporate firm providing excellent services that enhances efficient and effective use of IT products for customers satisfaction."
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-sm space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-800/60 px-2.5 py-1 rounded">
            Our Vision
          </span>
          <h3 className="text-lg font-black text-white">
            The Most Reliable &amp; Trusted Partner
          </h3>
          <p className="text-xs text-indigo-100 leading-relaxed">
            "To be the most reliable firm trusted by clients for the supply of genuine I.T products, OEM toners, and premium office equipment."
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-black text-slate-900">Our 5 Core Values</h3>
          <p className="text-xs text-slate-500 mt-1">The foundational pillars that guide every delivery and corporate relationship</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-black text-sm">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">Customer is #1</h4>
            <p className="text-[11px] text-slate-500">Treating every client as a king with prompt, respectful service.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-black text-sm">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">Honesty</h4>
            <p className="text-[11px] text-slate-500">100% truthful OEM representations and zero counterfeit sales.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-sm">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">Mutual Understanding</h4>
            <p className="text-[11px] text-slate-500">Listening closely to align with every company's procurement needs.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto font-black text-sm">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-900">Consistency</h4>
            <p className="text-[11px] text-slate-500">Maintaining high stock levels and uninterrupted supply continuity.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto font-black text-sm">
              5
            </div>
            <h4 className="text-xs font-bold text-slate-900">Good Humour</h4>
            <p className="text-[11px] text-slate-500">Courteous, energetic, and dedicated support teams at all times.</p>
          </div>
        </div>
      </div>

      {/* Real Corporate Client References from ofixbaze.com */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Trusted by Nigerian Industry Leaders
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            Corporate Clients &amp; Authorized Partners
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center h-20">
            <img
              src="https://ofixbaze.com/wp-content/uploads/2020/06/dangote-logo.jpg"
              alt="Dangote Group"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center h-20">
            <img
              src="https://ofixbaze.com/wp-content/uploads/2020/05/NIGERIAN-GAS-COMPANY-LOGO.jpg"
              alt="Nigerian Gas Company"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center h-20">
            <img
              src="https://ofixbaze.com/wp-content/uploads/2020/06/opes-manus-logo.jpg"
              alt="Opes Manus"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center h-20">
            <img
              src="https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg"
              alt="HP Official Partner"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center h-20">
            <img
              src="https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg"
              alt="Sharp Lagos"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Milestones & Stats */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-600">2018</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Established in Lagos</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">100%</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Authentic OEM Stock</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">1,200+</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Corporate Clients</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">Same-Day</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Lagos Island Dispatch</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-slate-900">
          Ready to procure genuine supplies for your organization?
        </h3>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActivePage('shop')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Explore Product Catalog
          </button>
          <button
            onClick={() => setActivePage('rfq')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Request Corporate RFQ
          </button>
        </div>
      </div>
    </div>
  );
};
