import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { ActivePage, Order } from '../types';

interface TrackOrderPageProps {
  setActivePage: (page: ActivePage) => void;
  orders?: Order[];
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ setActivePage, orders = [] }) => {
  const [query, setQuery] = useState('OFX-78421');
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<any | null>({
    id: 'OFX-78421',
    trackingNumber: 'TRK-NG-889124',
    date: 'Today, 9:15 AM',
    status: 'Out for Delivery',
    step: 4, // 1 to 5
    destination: 'Victoria Island, Lagos State',
    carrier: 'Ofixbaze Direct Corporate Express',
    driverPhone: '+234 803 555 9821',
    items: [
      { name: 'Original HP 05A Black Toner Cartridge (CE505A)', qty: 4 },
      { name: 'Comix S350 Heavy Duty Paper Shredder', qty: 1 }
    ]
  });

  const trackOrderById = (searchCode: string) => {
    const clean = searchCode.trim().toUpperCase();
    if (!clean) return;

    // 1. Check if matching order in live orders list
    const liveMatch = orders.find(
      o => o.id.toUpperCase() === clean || (o.trackingNumber && o.trackingNumber.toUpperCase() === clean)
    );

    if (liveMatch) {
      let step = 2;
      if (liveMatch.status === 'Processing') step = 2;
      else if (liveMatch.status === 'Shipped') step = 3;
      else if (liveMatch.status === 'Out for Delivery') step = 4;
      else if (liveMatch.status === 'Delivered') step = 5;
      else if (liveMatch.status === 'Cancelled') step = 1;

      setTrackedOrder({
        id: liveMatch.id,
        trackingNumber: liveMatch.trackingNumber || `TRK-NG-${liveMatch.id.replace(/[^0-9]/g, '') || '78912'}`,
        date: liveMatch.date,
        status: liveMatch.status,
        step,
        destination: `${liveMatch.customer.address}, ${liveMatch.customer.city}, ${liveMatch.customer.state}`,
        carrier: 'Ofixbaze Direct Corporate Express',
        driverPhone: '+234 803 555 9821',
        items: liveMatch.items.map(i => ({ name: i.productName, qty: i.quantity }))
      });
      setNotFoundCode(null);
      return;
    }

    // 2. Check sample demo orders
    if (clean === 'OFX-78421' || clean === 'TRK-NG-889124') {
      setTrackedOrder({
        id: 'OFX-78421',
        trackingNumber: 'TRK-NG-889124',
        date: 'Today, 9:15 AM',
        status: 'Out for Delivery',
        step: 4,
        destination: 'Victoria Island, Lagos State',
        carrier: 'Ofixbaze Direct Corporate Express',
        driverPhone: '+234 803 555 9821',
        items: [
          { name: 'Original HP 05A Black Toner Cartridge (CE505A)', qty: 4 },
          { name: 'Comix S350 Heavy Duty Paper Shredder', qty: 1 }
        ]
      });
      setNotFoundCode(null);
      return;
    }

    if (clean === 'OFX-92314' || clean === 'TRK-NG-92314') {
      setTrackedOrder({
        id: 'OFX-92314',
        trackingNumber: 'TRK-NG-92314',
        date: 'Yesterday, 2:40 PM',
        status: 'Delivered',
        step: 5,
        destination: 'Ikeja Commercial District, Lagos',
        carrier: 'Ofixbaze Express Freight',
        driverPhone: '+234 802 092 3522',
        items: [
          { name: 'HP LaserJet Pro M404dn Enterprise Printer', qty: 1 },
          { name: 'HP 76A Black Original LaserJet Toner Cartridge', qty: 2 }
        ]
      });
      setNotFoundCode(null);
      return;
    }

    // 3. Not found: do not generate fake tracking results
    setTrackedOrder(null);
    setNotFoundCode(clean);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrderById(query);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Live Shipment Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Track Your Office Equipment Delivery
        </h1>
        <p className="text-xs text-slate-500">
          Enter your Ofixbaze Order ID or Carrier Tracking Number to view real-time delivery status.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. OFX-78421 or OFX-92314"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Track
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span>Try sample orders:</span>
          <button
            type="button"
            onClick={() => { setQuery('OFX-78421'); trackOrderById('OFX-78421'); }}
            className="text-blue-600 font-mono font-semibold hover:underline cursor-pointer"
          >
            OFX-78421
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setQuery('OFX-92314'); trackOrderById('OFX-92314'); }}
            className="text-blue-600 font-mono font-semibold hover:underline cursor-pointer"
          >
            OFX-92314
          </button>
        </div>

        {orders.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Recent placed orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => { setQuery(o.id); trackOrderById(o.id); }}
                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold hover:bg-blue-100 cursor-pointer"
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order Not Found State */}
      {notFoundCode && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No Consignment Record Found</h3>
            <p className="text-xs text-slate-600 mt-1">
              We couldn't locate any active consignment matching code <strong className="font-mono text-slate-800 uppercase">"{notFoundCode}"</strong>.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-amber-100 text-left space-y-1">
            <p className="font-semibold text-slate-700">Possible reasons:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li>Orders placed within the last 30 minutes are being verified and queued for dispatch.</li>
              <li>Ensure the ID matches your invoice receipt (e.g. OFX-78421).</li>
              <li>Bank transfer payments are queued once audited by our accounts desk.</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/2348020923522?text=Hello%20Ofixbaze%2C%20I%20would%20like%20to%20track%20my%20order%20code%3A%20${encodeURIComponent(notFoundCode)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire via WhatsApp (+234 802 092 3522)</span>
            </a>
            <button
              onClick={() => { setQuery('OFX-78421'); trackOrderById('OFX-78421'); }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
            >
              Load Demo Order
            </button>
          </div>
        </div>
      )}

      {/* Shipment Tracker Card */}
      {trackedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {trackedOrder.status}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Order ID: {trackedOrder.id}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Tracking: {trackedOrder.trackingNumber} • Ordered on {trackedOrder.date}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-500 block">Destination:</span>
              <strong className="text-slate-900">{trackedOrder.destination}</strong>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 relative">
              {[
                { title: 'Order Placed', desc: 'Received at hub' },
                { title: 'Verified', desc: 'Genuine OEM inspect' },
                { title: 'Dispatched', desc: 'Lagos Island hub' },
                { title: 'Out for Delivery', desc: 'Courier en route' },
                { title: 'Delivered', desc: 'Signed by client' }
              ].map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= trackedOrder.step;
                const isCurrent = stepNum === trackedOrder.step;

                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition mb-2 z-10 ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                    >
                      {stepNum < trackedOrder.step ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Row */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Carrier Details:</h4>
              <p className="text-slate-700">{trackedOrder.carrier}</p>
              <p className="text-slate-500 mt-0.5">Driver Contact: {trackedOrder.driverPhone}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Consignment Items:</h4>
              <ul className="text-slate-600 space-y-0.5">
                {trackedOrder.items.map((it: any, i: number) => (
                  <li key={i}>• {it.qty}x {it.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
