import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Building, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X, 
  Send,
  DollarSign
} from 'lucide-react';
import { RFQRequest, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';

interface AdminRFQTabProps {
  rfqs: RFQRequest[];
  currency: Currency;
  onUpdateRfq: (updatedRfq: RFQRequest) => void;
}

export const AdminRFQTab: React.FC<AdminRFQTabProps> = ({
  rfqs,
  currency,
  onUpdateRfq
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RFQRequest['status']>('All');
  const [selectedRfq, setSelectedRfq] = useState<RFQRequest | null>(null);
  
  // Quotation form state inside modal
  const [quoteAmount, setQuoteAmount] = useState<number | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<RFQRequest['status']>('Pending');

  const filteredRfqs = rfqs.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      r.referenceId.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q) ||
      r.contactPerson.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.itemRequirements.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenRfq = (rfq: RFQRequest) => {
    setSelectedRfq(rfq);
    setQuoteAmount(rfq.quoteAmountNGN || '');
    setAdminNotes(rfq.adminNotes || '');
    setQuoteStatus(rfq.status);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;

    const updated: RFQRequest = {
      ...selectedRfq,
      status: quoteStatus,
      quoteAmountNGN: quoteAmount ? Number(quoteAmount) : undefined,
      adminNotes: adminNotes.trim() || undefined
    };

    onUpdateRfq(updated);
    setSelectedRfq(updated);
  };

  const getStatusBadge = (status: RFQRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Quotation Sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reviewing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Search & Status Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company, reference ID, email, procurement items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Pending', 'Reviewing', 'Quotation Sent', 'Approved', 'Declined'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st}
                {st === 'All' ? ` (${rfqs.length})` : ` (${rfqs.filter(r => r.status === st).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredRfqs.length}</strong> of {rfqs.length} corporate procurement tenders
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ref & Date</th>
                <th className="py-3 px-4">Company & Officer</th>
                <th className="py-3 px-4">Requirements Overview</th>
                <th className="py-3 px-4">Location & Urgency</th>
                <th className="py-3 px-4">Quote Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No corporate RFQ requests found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{rfq.referenceId}</div>
                      <div className="text-[11px] text-slate-400">{rfq.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rfq.companyName}</div>
                      <div className="text-[11px] text-slate-500">{rfq.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{rfq.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="line-clamp-2 text-slate-700">
                        {rfq.itemRequirements}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Type: {rfq.procurementType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{rfq.deliveryLocation}</div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {rfq.urgency.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {rfq.quoteAmountNGN ? formatPrice(rfq.quoteAmountNGN, currency) : (
                        <span className="text-slate-400 font-normal italic">Pending Quote</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(rfq.status)}`}>
                        {rfq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenRfq(rfq)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFQ Detail & Quotation Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black">CORPORATE TENDER: {selectedRfq.referenceId}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(selectedRfq.status)}`}>
                    {selectedRfq.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Submitted on {selectedRfq.date}</p>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Organization Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Corporate Entity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <p className="text-slate-400 text-[11px]">Organization:</p>
                    <p className="font-bold text-sm text-slate-900">{selectedRfq.companyName}</p>
                    {selectedRfq.rcNumber && (
                      <p className="text-[11px] text-slate-500 font-mono">RC: {selectedRfq.rcNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Procurement Officer:</p>
                    <p className="font-semibold text-slate-900">{selectedRfq.contactPerson}</p>
                    <p className="text-slate-600">{selectedRfq.email} • {selectedRfq.phone}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span>Delivery Destination: <strong>{selectedRfq.deliveryLocation}</strong></span>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Procurement Requirements</h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedRfq.itemRequirements}
                </div>
              </div>

              {/* Super Admin Quote Builder Form */}
              <form onSubmit={handleSaveQuote} className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span>Admin Proforma Quotation & Approval</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Quote Total Amount (₦ NGN)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500000"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tender Status</label>
                    <select
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Reviewing">Under Review / Sourcing</option>
                      <option value="Quotation Sent">Quotation Sent to Client</option>
                      <option value="Approved">Approved / Contract Won</option>
                      <option value="Declined">Declined / Lost</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Admin Notes / Terms</label>
                  <textarea
                    rows={2}
                    placeholder="Enter internal pricing notes, discounts given, or warranty clauses..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save & Send Quote Response</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedRfq(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
