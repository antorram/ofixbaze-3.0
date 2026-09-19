import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { ActivePage } from '../../types';

interface PromoBannerProps {
  setActivePage: (page: ActivePage) => void;
  onOpenAuthenticityModal: () => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  setActivePage,
  onOpenAuthenticityModal,
  onSelectCategory,
}) => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-700/50 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            Official Corporate Office Supplies Partner
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white">
            100% Genuine HP &amp; Canon Toners with Guaranteed Page Yield
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Eliminate print streaks, toxic powder spills, and costly fuser breakdowns. Every toner supplied by Ofixbaze Nigeria carries verified factory security holograms, anti-tamper seals, and manufacturer serial numbers.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3.5 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tilt-to-verify Security Holograms
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Corporate PO &amp; VAT Proforma Invoices
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Same-Day Lagos Express Dispatch
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenAuthenticityModal}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Verify Genuine Hologram</span>
          </button>
          <button
            onClick={() => {
              onSelectCategory('toners');
              setActivePage('shop');
            }}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition border border-orange-500 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Browse Certified Toners</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
