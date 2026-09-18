import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  X,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { Currency, Order, RFQRequest } from '../../types';

export interface CustomerProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  cacNumber?: string;
  status: 'active' | 'vip' | 'pending';
  totalSpent: number;
  totalOrders: number;
  totalRFQs: number;
  joinedDate: string;
  shippingAddress: string;
}

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Adebayo Ogunlesi',
    companyName: 'Access Holdings PLC',
    email: 'adebayo.o@accessbankplc.com',
    phone: '+234 803 123 4567',
    cacNumber: 'RC-125489',
    status: 'vip',
    totalSpent: 4850000,
    totalOrders: 14,
    totalRFQs: 6,
    joinedDate: 'Jan 15, 2024',
    shippingAddress: 'Plot 999c, Danmole Street, Victoria Island, Lagos'
  },
  {
    id: 'cust-2',
    name: 'Chioma Nwosu',
    companyName: 'Dangote Industries Limited',
    email: 'c.nwosu@dangote.com',
    phone: '+234 802 987 6543',
    cacNumber: 'RC-445890',
    status: 'vip',
    totalSpent: 9240000,
    totalOrders: 28,
    totalRFQs: 12,
    joinedDate: 'Nov 04, 2023',
    shippingAddress: '1 Alfred Rewane Road, Ikoyi, Lagos'
  },
  {
    id: 'cust-3',
    name: 'Engr. Babatunde Fashola',
    companyName: 'Lekki Free Zone Development Co.',
    email: 'procurement@lfzdc.org',
    phone: '+234 809 555 1212',
    status: 'active',
    totalSpent: 1650000,
    totalOrders: 5,
    totalRFQs: 4,
    joinedDate: 'Mar 22, 2024',
    shippingAddress: 'Lekki Coastal Road, Ibeju-Lekki, Lagos'
  },
  {
    id: 'cust-4',
    name: 'Fatima Sanusi',
    companyName: 'Stanbic IBTC Bank Head Office',
    email: 'f.sanusi@stanbicibtc.com',
    phone: '+234 814 333 8899',
    cacNumber: 'RC-778901',
    status: 'active',
    totalSpent: 2450000,
    totalOrders: 8,
    totalRFQs: 3,
    joinedDate: 'Feb 10, 2024',
    shippingAddress: 'Walter Carrington Crescent, Victoria Island, Lagos'
  },
  {
    id: 'cust-5',
    name: 'Emeka Eze',
    companyName: 'Zenith Securities Ltd',
    email: 'e.eze@zenithbank.com',
    phone: '+234 805 777 4422',
    status: 'pending',
    totalSpent: 0,
    totalOrders: 0,
    totalRFQs: 1,
    joinedDate: 'Yesterday',
    shippingAddress: 'Plot 84, Ajose Adeogun, Victoria Island, Lagos'
  }
];

interface AdminCustomersTabProps {
  currency: Currency;
  orders?: Order[];
  rfqs?: RFQRequest[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  currency,
  orders = [],
  rfqs = []
}) => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'active' | 'pending'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New customer form
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCAC, setNewCAC] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'vip' | 'pending'>('active');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim() || !newEmail.trim()) return;

    const newCust: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      companyName: newCompany.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      cacNumber: newCAC.trim() || undefined,
      status: newStatus,
      totalSpent: 0,
      totalOrders: 0,
      totalRFQs: 0,
      joinedDate: 'Today',
      shippingAddress: newAddress.trim() || 'Lagos, Nigeria'
    };

    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewCAC('');
    setNewAddress('');
  };

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'CAC', 'Status', 'Total Spent (NGN)', 'Orders', 'Joined'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.companyName}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.cacNumber || ''}"`,
      c.status,
      c.totalSpent,
      c.totalOrders,
      `"${c.joinedDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ofixbaze-corporate-customers-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Corporate Customers & Accounts</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {customers.length} Accounts
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Procurement officers, financial institutions, and multinational enterprise client records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Corporate Client</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total B2B Spend</span>
            <strong className="text-xl font-black text-white mt-1 block">₦{totalSpentAll.toLocaleString()}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">VIP Tier Accounts</span>
            <strong className="text-xl font-black text-white mt-1 block">
              {customers.filter(c => c.status === 'vip').length} Enterprise Clients
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Procurement Officers</span>
            <strong className="text-xl font-black text-white mt-1 block">
              {customers.filter(c => c.status !== 'pending').length} Verified Buyers
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, procurement contact, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
          {(['all', 'vip', 'active', 'pending'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition uppercase text-[10px] ${
                statusFilter === tab ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Company & Contact</th>
              <th className="p-3.5">Email & Phone</th>
              <th className="p-3.5">CAC Reg</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Total Spend</th>
              <th className="p-3.5">Orders</th>
              <th className="p-3.5 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredCustomers.map(cust => (
              <tr
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <td className="p-3.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-orange-400 transition flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {cust.companyName}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{cust.name}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="flex flex-col text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {cust.email}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {cust.phone}
                    </span>
                  </div>
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-400">
                  {cust.cacNumber ? (
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      {cust.cacNumber}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    cust.status === 'vip'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : cust.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {cust.status === 'vip' ? <ShieldCheck className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    <span>{cust.status}</span>
                  </span>
                </td>
                <td className="p-3.5 font-bold text-white">
                  ₦{cust.totalSpent.toLocaleString()}
                </td>
                <td className="p-3.5 text-slate-300">
                  {cust.totalOrders} orders ({cust.totalRFQs} RFQs)
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(cust);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedCustomer.companyName}</h3>
                  <span className="text-[11px] text-slate-400">Account ID: {selectedCustomer.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Primary Contact</span>
                  <p className="font-semibold text-white mt-0.5">{selectedCustomer.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Account Tier</span>
                  <span className="font-bold text-amber-400 uppercase mt-0.5 inline-block">{selectedCustomer.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Email Address</span>
                  <p className="text-slate-300 mt-0.5 truncate">{selectedCustomer.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Phone</span>
                  <p className="text-slate-300 mt-0.5">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Corporate Delivery Address</span>
                <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedCustomer.shippingAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total Lifetime Spend</span>
                  <strong className="text-base font-black text-white block mt-1">₦{selectedCustomer.totalSpent.toLocaleString()}</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Orders & RFQs</span>
                  <strong className="text-base font-black text-white block mt-1">{selectedCustomer.totalOrders} Orders / {selectedCustomer.totalRFQs} RFQs</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Add New Corporate Account</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Zenith Bank PLC"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Procurement Officer Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Olumide Johnson"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="o.johnson@zenithbank.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CAC Registration (Optional)</label>
                <input
                  type="text"
                  value={newCAC}
                  onChange={(e) => setNewCAC(e.target.value)}
                  placeholder="RC-123456"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Delivery / Corporate Address</label>
                <textarea
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Street, City, State"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow"
                >
                  Save Corporate Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
