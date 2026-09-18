import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Eye,
  ArrowRight
} from 'lucide-react';
import { Product, Order, RFQRequest, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardTabProps {
  products: Product[];
  orders: Order[];
  rfqs: RFQRequest[];
  currency: Currency;
  setCurrentTab: (tab: AdminTab) => void;
  onOpenAddProductModal: () => void;
  onQuickRestock: (productId: string, amount: number) => void;
  onViewOrderDetails: (order: Order) => void;
  onViewRfqDetails: (rfq: RFQRequest) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  products,
  orders,
  rfqs,
  currency,
  setCurrentTab,
  onOpenAddProductModal,
  onQuickRestock,
  onViewOrderDetails,
  onViewRfqDetails,
  onUpdateOrderStatus
}) => {
  // Calculations
  const totalRevenueNGN = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const lowStockProducts = products.filter(p => p.stockCount <= 5);
  const outOfStockProducts = products.filter(p => !p.inStock || p.stockCount === 0);
  const pendingRfqs = rfqs.filter(r => r.status === 'Pending');
  const totalRfqPipelineValue = rfqs.reduce((sum, r) => sum + (r.quoteAmountNGN || 0), 0);

  // Category counts
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* WordPress Authentic Top Notice Banner */}
      <div className="bg-white border-l-4 border-l-[#00a32a] border border-slate-200 p-4 rounded-r-lg shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#2271b1] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                WordPress 6.7 Site Editor
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Full Website Customizer & Homepage Sections Builder Ready
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Customize your entire site: brand primary & secondary colors, typography, header announcement, and add or remove homepage sections with one click.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('customizer')}
              className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <span>Customize Site & Colors</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(totalRevenueNGN, currency)}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orders & Dispatch</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">{orders.length}</h3>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                {activeOrdersCount} in progress
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {orders.filter(o => o.status === 'Delivered').length} fulfilled & delivered
            </p>
          </div>
        </div>

        {/* Catalog Items */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Inventory</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
              {lowStockProducts.length > 0 && (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {lowStockProducts.length} low stock
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {products.filter(p => p.isOriginalOEM).length} 100% OEM Certified items
            </p>
          </div>
        </div>

        {/* Corporate RFQ */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate RFQ Tenders</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">{rfqs.length}</h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {pendingRfqs.length} awaiting quote
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pipeline: {formatPrice(totalRfqPipelineValue, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/60 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Low Inventory Alert: {lowStockProducts.length} product(s) below safety stock threshold
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Restock these fast-moving HP toners & executive chairs to prevent corporate order backorders.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('products')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
          >
            Review Stock in Catalog
          </button>
        </div>
      )}

      {/* Grid: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Col Span 2 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order stream with real-time status controls</p>
            </div>
            <button
              onClick={() => setCurrentTab('orders')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {orders.slice(0, 5).map((order) => {
                  const getStatusBadge = (status: Order['status']) => {
                    switch (status) {
                      case 'Delivered':
                        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                      case 'Out for Delivery':
                        return 'bg-blue-100 text-blue-800 border-blue-200';
                      case 'Shipped':
                        return 'bg-purple-100 text-purple-800 border-purple-200';
                      case 'Cancelled':
                        return 'bg-rose-100 text-rose-800 border-rose-200';
                      default:
                        return 'bg-amber-100 text-amber-800 border-amber-200';
                    }
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <div>{order.id}</div>
                        <div className="text-[11px] font-normal text-slate-400">{order.date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.customer.fullName}</div>
                        {order.customer.companyName && (
                          <div className="text-[11px] text-slate-500">{order.customer.companyName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} unit(s)
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatPrice(order.total, currency)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewOrderDetails(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate RFQ & Fast Actions - Col Span 1 */}
        <div className="space-y-6">
          {/* Recent RFQs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Latest Corporate RFQs</h4>
                <p className="text-[11px] text-slate-500">Corporate bulk quotes needing review</p>
              </div>
              <button
                onClick={() => setCurrentTab('rfq')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {rfqs.slice(0, 3).map((rfq) => (
                <div 
                  key={rfq.id}
                  onClick={() => onViewRfqDetails(rfq)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">{rfq.companyName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rfq.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      rfq.status === 'Quotation Sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {rfq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {rfq.itemRequirements}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Ref: {rfq.referenceId}</span>
                    <span className="font-semibold text-slate-700">
                      {rfq.quoteAmountNGN ? formatPrice(rfq.quoteAmountNGN, currency) : 'TBD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Super Admin Fast Tools</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenAddProductModal}
                className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product to Store</span>
              </button>
              <button
                onClick={() => setCurrentTab('banners')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-600 transition cursor-pointer"
              >
                <span>Manage Homepage Hero Sliders</span>
              </button>
              <button
                onClick={() => setCurrentTab('settings')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-600 transition cursor-pointer"
              >
                <span>Edit Top Announcement Ticker</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
