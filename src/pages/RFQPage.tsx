import React, { useState } from 'react';
import { 
  Building, 
  FileText, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Download,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { ActivePage, RFQRequest } from '../types';

interface RFQPageProps {
  setActivePage: (page: ActivePage) => void;
  onAddRfq?: (rfq: RFQRequest) => void;
}

export const RFQPage: React.FC<RFQPageProps> = ({ setActivePage, onAddRfq }) => {
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    rcNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    deliveryLocation: 'Lagos Island / Victoria Island',
    procurementType: 'bulk_purchase',
    itemRequirements: '',
    urgency: 'urgent_48h'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `RFQ-${Math.floor(10000 + Math.random() * 90000)}`;
    setReferenceId(ref);
    setSubmitted(true);

    if (onAddRfq) {
      onAddRfq({
        id: `rfq-${Date.now()}`,
        referenceId: ref,
        companyName: formData.companyName,
        rcNumber: formData.rcNumber || undefined,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        deliveryLocation: formData.deliveryLocation,
        procurementType: formData.procurementType,
        itemRequirements: formData.itemRequirements,
        urgency: formData.urgency as any,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            Corporate Procurement & Wholesale Tenders
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Request an Official Corporate Quote (RFQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need toners, printers, or office equipment for your bank, multinational, law firm, school, or government agency? Receive a stamped Proforma Invoice with tiered bulk discount rates within 2 hours.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            RFQ Received Successfully!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your quote reference is <strong className="text-blue-600 font-mono text-sm">{referenceId}</strong>. Our B2B Corporate Accounts team at our Lagos Island headquarters is reviewing your requisition and will send a stamped Proforma Invoice to <strong>{formData.email}</strong>.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1">
            <p><strong>Organization:</strong> {formData.companyName}</p>
            <p><strong>Representative:</strong> {formData.contactPerson} ({formData.phone})</p>
            <p><strong>Expected Turnaround:</strong> Under 2 business hours</p>
          </div>

          {/* Fast-Track WhatsApp Quote */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto text-left space-y-2">
            <p className="text-[11px] font-semibold text-emerald-900">
              Need instant pricing for an ongoing procurement tender?
            </p>
            <a
              href={`https://wa.me/2348020923522?text=${encodeURIComponent(
                `Hello Ofixbaze Procurement Desk,\nI submitted an RFQ (${referenceId}):\nCompany: ${formData.companyName}\nContact: ${formData.contactPerson} (${formData.phone})\nRequirements: ${formData.itemRequirements}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Fast-Track Quote on WhatsApp (0802-092-3522)</span>
            </a>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setActivePage('shop')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
              Company & Requisition Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenith Bank Plc"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">RC Number / TIN (Optional for Tax Invoice)</label>
                  <input
                    type="text"
                    placeholder="e.g. RC-1948291"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Procurement Officer / Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bukola Adeleke"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Direct Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Office Location / Delivery City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Island, Lagos or Central Area, Abuja"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Type of Requisition</label>
                  <select
                    value={formData.procurementType}
                    onChange={(e) => setFormData({ ...formData, procurementType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="bulk_purchase">One-Off Bulk Equipment Purchase</option>
                    <option value="quarterly_toner">Quarterly Toner & Ink Replenishment Contract</option>
                    <option value="office_setup">Complete Office Branch Setup</option>
                    <option value="annual_tender">Annual Corporate Supply Tender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Delivery Timeline Needed</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="urgent_48h">Immediate / Within 24-48 Hours</option>
                    <option value="within_week">Within 1 Week</option>
                    <option value="end_of_month">By End of Month / Next Fiscal Cycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Required Items & Quantities Specification *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="e.g.&#10;- 20x Original HP 05A (CE505A) Toner Cartridges&#10;- 10x Original HP 85A (CE285A)&#10;- 2x Canon imageRUNNER 2625i Copiers&#10;- 4x Comix S350 Cross-Cut Shredders&#10;- 15x Double A 80gsm A4 Paper Boxes"
                  value={formData.itemRequirements}
                  onChange={(e) => setFormData({ ...formData, itemRequirements: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Corporate RFQ for Stamped Proforma Invoice</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                Why Procure with Ofixbaze B2B?
              </h3>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">100% Genuine OEM Warranty</strong>
                  <p className="text-slate-500 text-[11px]">Guaranteed authentic HP, Canon, Comix and APC systems.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Fast Proforma Turnaround</strong>
                  <p className="text-slate-500 text-[11px]">Stamped quotes generated within 2 hours during business days.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Corporate PO (Net 30) Terms</strong>
                  <p className="text-slate-500 text-[11px]">Credit lines available for verified institutional clients.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
              <h4 className="font-bold mb-1">Direct Procurement Desk:</h4>
              <p className="text-[11px] text-blue-800">
                You can also email your procurement spreadsheet or RFP tender directly to:
              </p>
              <a href="mailto:corporate@ofixbaze.com" className="font-bold text-blue-700 underline block mt-1">
                corporate@ofixbaze.com
              </a>
              <p className="text-[10px] text-blue-600 mt-1">
                Hotline: +234 803 123 4567 (Mon-Fri 8am-6pm)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
