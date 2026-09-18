import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Printer, 
  Download, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  ShieldCheck,
  X
} from 'lucide-react';
import { Order, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';

interface AdminOrdersTabProps {
  orders: Order[];
  currency: Currency;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateTrackingNumber: (orderId: string, trackingNumber: string) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  currency,
  onUpdateOrderStatus,
  onUpdateTrackingNumber
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [editingTrackingNumber, setEditingTrackingNumber] = useState('');

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      o.id.toLowerCase().includes(q) || 
      o.trackingNumber.toLowerCase().includes(q) || 
      o.customer.fullName.toLowerCase().includes(q) || 
      o.customer.email.toLowerCase().includes(q) || 
      (o.customer.companyName && o.customer.companyName.toLowerCase().includes(q)) || 
      o.customer.phone.includes(q);

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: Order['status']) => {
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

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setEditingTrackingNumber(order.trackingNumber);
  };

  const handleSaveTracking = () => {
    if (selectedOrder && editingTrackingNumber.trim()) {
      onUpdateTrackingNumber(selectedOrder.id, editingTrackingNumber.trim());
      setSelectedOrder({ ...selectedOrder, trackingNumber: editingTrackingNumber.trim() });
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, tracking number, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map((st) => (
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
                {st === 'All' ? ` (${orders.length})` : ` (${orders.filter(o => o.status === st).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredOrders.length}</strong> of {orders.length} corporate orders
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order / Date</th>
                <th className="py-3 px-4">Customer & Organization</th>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders found matching your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{order.id}</div>
                      <div className="text-[11px] text-slate-400">{order.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.customer.fullName}</div>
                      {order.customer.companyName && (
                        <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{order.customer.companyName}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">{order.customer.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {order.trackingNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">
                        {formatPrice(order.total, currency)}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {order.paymentMethod}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(order.status)}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenOrderDetails(order)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black tracking-wider">ORDER DETAILS: {selectedOrder.id}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Customer Information</h4>
                  <div className="space-y-1 text-slate-700">
                    <p className="font-semibold text-sm text-slate-900">{selectedOrder.customer.fullName}</p>
                    {selectedOrder.customer.companyName && (
                      <p className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {selectedOrder.customer.companyName}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedOrder.customer.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Delivery Destination</h4>
                  <div className="space-y-1 text-slate-700">
                    <p className="flex items-start gap-1.5 text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state}</span>
                    </p>
                    <p className="text-slate-500 pt-1">Payment Method: <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong></p>
                  </div>
                </div>
              </div>

              {/* Tracking & Status updater */}
              <div className="p-4 rounded-xl border border-slate-200 bg-orange-50/40 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Logistics & Tracking Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Waybill / Tracking Number</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingTrackingNumber}
                        onChange={(e) => setEditingTrackingNumber(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveTracking}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Update Shipment Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as Order['status'];
                        onUpdateOrderStatus(selectedOrder.id, newStatus);
                        setSelectedOrder({ ...selectedOrder, status: newStatus });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ordered Products</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                        <th className="p-3">Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-10 rounded object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0"
                            />
                            <span className="font-semibold text-slate-900">{item.productName}</span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">{item.quantity}</td>
                          <td className="p-3 text-right text-slate-600">{formatPrice(item.price, currency)}</td>
                          <td className="p-3 text-right font-bold text-slate-900">{formatPrice(item.price * item.quantity, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Summary */}
                <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.subtotal, currency)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Corporate Discount:</span>
                      <span className="font-semibold">-{formatPrice(selectedOrder.discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping & Handling:</span>
                    <span className="font-semibold">
                      {selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping, currency)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-orange-600">{formatPrice(selectedOrder.total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
