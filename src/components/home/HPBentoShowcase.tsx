import React from 'react';
import { ArrowRight, Sparkles, Printer, FileText, Smartphone } from 'lucide-react';
import { ActivePage } from '../../types';

interface HPBentoShowcaseProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

export const HPBentoShowcase: React.FC<HPBentoShowcaseProps> = ({
  setActivePage,
  onSelectCategory,
}) => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" aria-label="HP Official Equipment and Consumables Showcase">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Big Column (Span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
          
          {/* Card 1: HP Printers + Smartphone Smart App (Large top card) */}
          <div 
            onClick={() => {
              onSelectCategory('printers-copiers');
              setActivePage('shop');
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#072b32] via-[#041d22] to-[#021013] border border-teal-900/40 p-6 sm:p-8 min-h-[340px] sm:min-h-[380px] flex flex-col justify-between text-white shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-teal-700/60"
          >
            {/* Background High-Tech Glow / Wave Circles */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
              <div className="absolute left-1/3 top-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-2xl" />
              {/* Circuit Grid Rings */}
              <svg className="absolute right-0 bottom-0 w-full h-full opacity-25" viewBox="0 0 600 400" fill="none">
                <circle cx="380" cy="280" r="140" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="380" cy="280" r="190" stroke="#14b8a6" strokeWidth="1" />
                <circle cx="380" cy="280" r="240" stroke="#0d9488" strokeWidth="0.7" strokeDasharray="8 8" />
              </svg>
            </div>

            {/* Visual Compositing: Printers & Smartphone */}
            <div className="absolute right-0 bottom-0 top-0 w-full sm:w-3/4 flex items-end justify-end pointer-events-none pr-3 pb-3">
              <div className="relative w-full h-full max-h-[340px] flex items-end justify-end">
                {/* Enterprise Multi-function LaserJet */}
                <img
                  src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80"
                  alt="HP LaserJet Enterprise MFP"
                  className="w-48 sm:w-64 h-auto object-contain drop-shadow-2xl rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Secondary Desktop Compact Printer */}
                <div className="hidden sm:block absolute right-2 bottom-4 w-32 h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 shadow-lg">
                  <div className="flex items-center justify-between text-[10px] text-teal-200">
                    <span className="font-bold">HP LaserJet Pro</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] font-mono text-white mt-1">Ready • Ready 100%</div>
                  <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full w-4/5 rounded-full" />
                  </div>
                </div>
                {/* Smartphone Floating HP Smart Mockup */}
                <div className="absolute left-8 sm:left-24 bottom-6 w-28 sm:w-32 bg-slate-950 rounded-2xl p-2 border-2 border-slate-700 shadow-2xl group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-2 text-center text-white">
                    <div className="text-[9px] text-teal-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      <Smartphone className="w-2.5 h-2.5" /> HP Smart
                    </div>
                    <div className="my-2 relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 border-t-teal-400 flex items-center justify-center">
                        <span className="text-[10px] font-black text-teal-300">55%</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-300 font-semibold leading-tight">LaserJet Pro</div>
                    <div className="text-[8px] text-emerald-400 font-mono">Toner OK</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content & Pill Button */}
            <div className="relative z-10 max-w-xs sm:max-w-sm space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-700/60">
                Authorized HP Workstation Dealer
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Enterprise &amp; Office HP LaserJet Printers
              </h3>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                High-volume duplex printing with wireless HP Smart App integration and tamper-proof security chips.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs shadow-lg shadow-red-900/30 transition duration-200 cursor-pointer group-hover:gap-3"
              >
                <span>Browse HP Printers Here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: HP Toner Cartridge (Bottom wide card) */}
          <div 
            onClick={() => {
              onSelectCategory('toners-cartridges');
              setActivePage('shop');
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-white border border-slate-200/80 p-5 sm:p-6 min-h-[170px] sm:min-h-[190px] flex flex-col justify-between shadow-xs cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-300"
          >
            {/* Visual of HP LaserJet Toner boxes lined up */}
            <div className="absolute right-2 sm:right-6 bottom-0 top-0 w-1/2 sm:w-3/5 flex items-center justify-end pointer-events-none">
              <div className="flex items-end gap-2 pr-2">
                {/* 414A Black Box */}
                <div className="w-20 sm:w-28 bg-white border border-slate-300 rounded-lg p-2 shadow-md group-hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-[8px] font-black text-blue-800">HP LASERJET</span>
                    <span className="text-[9px] font-black text-slate-900">414A</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-black" />
                    <span className="text-[7px] text-slate-600 font-bold">Black Toner</span>
                  </div>
                  <div className="mt-1 text-[7px] text-emerald-700 font-semibold">JetIntelligence</div>
                </div>

                {/* 414A Cyan Box */}
                <div className="hidden sm:block w-24 bg-white border border-slate-300 rounded-lg p-2 shadow-md group-hover:-translate-y-2 transition duration-300 delay-75">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-[8px] font-black text-blue-800">HP LASERJET</span>
                    <span className="text-[9px] font-black text-cyan-600">414A</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-[7px] text-slate-600 font-bold">Cyan Toner</span>
                  </div>
                  <div className="mt-1 text-[7px] text-emerald-700 font-semibold">High-Yield</div>
                </div>

                {/* 414A Yellow Box */}
                <div className="w-20 sm:w-24 bg-white border border-slate-300 rounded-lg p-2 shadow-md group-hover:-translate-y-1 transition duration-300 delay-100">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-[8px] font-black text-blue-800">HP LASERJET</span>
                    <span className="text-[9px] font-black text-amber-500">414A</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[7px] text-slate-600 font-bold">Yellow</span>
                  </div>
                  <div className="mt-1 text-[7px] text-emerald-700 font-semibold">Genuine OEM</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 max-w-[240px] sm:max-w-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Original Consumables</span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Original HP LaserJet Toners
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Guaranteed crisp lines, high page yields and verified security holograms.
              </p>
            </div>

            <div className="relative z-10 pt-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white font-bold text-xs shadow-sm transition duration-200 cursor-pointer group-hover:gap-2.5"
              >
                <span>Find HP Toner Cartridge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
          
          {/* Card 3: HP Ink Cartridges (Top right card) */}
          <div 
            onClick={() => {
              onSelectCategory('toners-cartridges');
              setActivePage('shop');
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border border-slate-200/80 p-6 min-h-[260px] sm:min-h-[290px] flex flex-col justify-between shadow-xs cursor-pointer hover:shadow-md hover:border-purple-300 transition-all duration-300"
          >
            {/* Background Tropical Leaf Accent */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 opacity-30 pointer-events-none overflow-hidden">
              <svg className="w-full h-full text-emerald-600/30" viewBox="0 0 200 200" fill="currentColor">
                <path d="M45,-76.3C58.3,-69.5,69.1,-57.4,76.5,-43.5C83.9,-29.6,87.9,-14.8,86.6,-0.8C85.2,13.3,78.5,26.5,70.1,38.2C61.7,49.8,51.6,59.8,39.6,67.6C27.5,75.4,13.8,81,-0.8,82.4C-15.4,83.8,-30.7,81.1,-43.3,73.5C-55.9,65.9,-65.7,53.4,-73.4,39.7C-81.1,26,-86.7,11,-85.9,-3.6C-85.1,-18.2,-78,-32.4,-68.4,-44.5C-58.8,-56.6,-46.8,-66.6,-33.5,-73.5C-20.2,-80.3,-10.1,-84.1,2.5,-88.4C15.1,-92.7,31.7,-83.1,45,-76.3Z" transform="translate(100 100)" />
              </svg>
            </div>

            {/* Visual of HP 937 Ink Cartridges Pack */}
            <div className="absolute right-2 bottom-3 w-44 sm:w-56 flex items-end justify-end pointer-events-none">
              <div className="relative">
                {/* HP 937 Ink Box */}
                <div className="w-28 sm:w-32 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl border border-slate-700 transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="text-[9px] font-black text-cyan-400">hp</span>
                    <span className="text-[7px] text-slate-400">Original Ink</span>
                  </div>
                  <div className="my-1.5 flex items-center justify-between">
                    <span className="text-xl font-black text-white">937</span>
                    <div className="flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="text-[8px] text-slate-300">DeskJet &amp; OfficeJet Pro</div>
                </div>

                {/* Companion Ink Tank Box */}
                <div className="absolute -left-6 bottom-0 w-24 bg-white border border-slate-300 rounded-lg p-2 shadow-lg -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <span className="text-[7px] font-bold text-blue-700">HP GT53</span>
                  <div className="text-[9px] font-black text-slate-900">Black Ink Bottle</div>
                  <div className="text-[7px] text-emerald-600 font-bold">6,000 Pages</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 max-w-[220px] sm:max-w-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                DeskJet &amp; OfficeJet
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Authentic HP Ink Cartridges &amp; Refills
              </h4>
              <p className="text-[11px] text-slate-600">
                Fade-resistant pigment inks and high-yield combo packs.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5b45b2] hover:bg-[#4d389e] text-white font-bold text-xs shadow-md shadow-purple-900/20 transition duration-200 cursor-pointer group-hover:gap-2.5"
              >
                <span>Search For HP Ink Cartridge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Request Free No-Obligation Quote (Bottom right card) */}
          <div 
            onClick={() => setActivePage('rfq')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563eb] via-[#4338ca] to-[#3b82f6] text-white p-6 min-h-[240px] sm:min-h-[260px] flex flex-col justify-between shadow-lg cursor-pointer hover:shadow-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all duration-300"
          >
            {/* Visual background elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pointer-events-none pr-4">
              {/* Smartwatch / Fast Communication Device visual */}
              <div className="w-28 sm:w-32 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <div className="text-[9px] font-bold text-sky-300 flex items-center justify-between">
                  <span>Procurement Desk</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-xs font-bold text-white leading-tight">
                  Instant Official Proforma
                </div>
                <div className="mt-1 text-[9px] text-slate-300">
                  WhatsApp &amp; Email Delivery in &lt; 30 mins
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-sky-200">
                  <span>Lagos Showroom</span>
                  <span className="font-bold">Verified</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 max-w-[230px] sm:max-w-xs space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-sky-200 bg-white/15 px-2 py-0.5 rounded border border-white/20">
                <FileText className="w-3 h-3" />
                Corporate RFQ &amp; Tenders
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                Request Free No-Obligation Quote
              </h3>
              <p className="text-xs text-sky-100/90 leading-relaxed">
                Send your supply specifications for instant volume tier pricing and company PO terms.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-sky-950/30 transition duration-200 cursor-pointer group-hover:gap-2.5"
              >
                <span>Click To Contact Us Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
