import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Search, 
  Check, 
  X, 
  Lock, 
  Key, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'RFQ Specialist' | 'Content Editor';
  status: 'active' | 'suspended';
  lastActive: string;
  avatar: string;
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Super Administrator',
    email: 'admin@ofixbaze.com',
    role: 'Super Admin',
    status: 'active',
    lastActive: 'Active now',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-2',
    name: 'Olumide Fashola',
    email: 'olumide.f@ofixbaze.com',
    role: 'Store Manager',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-3',
    name: 'Kemi Adeleke',
    email: 'kemi.a@ofixbaze.com',
    role: 'RFQ Specialist',
    status: 'active',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-4',
    name: 'Chinedu Okonkwo',
    email: 'chinedu.o@ofixbaze.com',
    role: 'Content Editor',
    status: 'active',
    lastActive: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  }
];

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('Store Manager');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'active',
      lastActive: 'Never',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    };

    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
  };

  const deleteUser = (id: string) => {
    if (id === 'user-1') return; // protect super admin
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Admin Users & Access Control</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {users.length} Team Members
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage corporate permissions, staff roles, and administrative security credentials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin Staff</span>
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 font-bold cursor-pointer transition border-b-2 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Accounts ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 font-bold cursor-pointer transition border-b-2 flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Permissions Matrix</span>
        </button>
      </div>

      {/* STAFF ACCOUNTS LIST */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer" />
                      <span className="font-bold text-white text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{u.email}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-slate-300 font-semibold text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">{u.lastActive}</td>
                  <td className="p-3.5 text-right">
                    {u.id !== 'user-1' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition"
                        title="Remove User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Module Capability</th>
                <th className="p-3.5 text-center">Super Admin</th>
                <th className="p-3.5 text-center">Store Manager</th>
                <th className="p-3.5 text-center">RFQ Specialist</th>
                <th className="p-3.5 text-center">Content Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { name: 'Products: Create, Edit & Delete Catalog', sa: true, sm: true, rfq: false, ce: false },
                { name: 'Products: Price & Cost Margin Override', sa: true, sm: true, rfq: false, ce: false },
                { name: 'Orders: View, Print Invoices & Status', sa: true, sm: true, rfq: true, ce: false },
                { name: 'Corporate RFQ: Tender Quotes & Pricing', sa: true, sm: true, rfq: true, ce: false },
                { name: 'Visual Page Builder & CMS Layouts', sa: true, sm: false, rfq: false, ce: true },
                { name: 'Media Library: Upload & Delete Assets', sa: true, sm: true, rfq: false, ce: true },
                { name: 'Blog & Procurement Guides Management', sa: true, sm: true, rfq: false, ce: true },
                { name: 'Global Customizer, Theme & Colors', sa: true, sm: false, rfq: false, ce: false },
                { name: 'Database Backup & Restore JSON', sa: true, sm: false, rfq: false, ce: false },
                { name: 'Staff Users & Role Matrix Administration', sa: true, sm: false, rfq: false, ce: false }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium text-slate-200">{row.name}</td>
                  <td className="p-3.5 text-center">
                    <span className="inline-block p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                      <Check className="w-4 h-4 mx-auto" />
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {row.sm ? (
                      <span className="inline-block p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check className="w-4 h-4 mx-auto" />
                      </span>
                    ) : (
                      <span className="inline-block p-1 bg-slate-800 text-slate-500 rounded-full">
                        <X className="w-4 h-4 mx-auto" />
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.rfq ? (
                      <span className="inline-block p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check className="w-4 h-4 mx-auto" />
                      </span>
                    ) : (
                      <span className="inline-block p-1 bg-slate-800 text-slate-500 rounded-full">
                        <X className="w-4 h-4 mx-auto" />
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.ce ? (
                      <span className="inline-block p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check className="w-4 h-4 mx-auto" />
                      </span>
                    ) : (
                      <span className="inline-block p-1 bg-slate-800 text-slate-500 rounded-full">
                        <X className="w-4 h-4 mx-auto" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Add Staff Team Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Babatunde Lawal"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Corporate Staff Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="babatunde@ofixbaze.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Store Manager">Store Manager (Products & Orders)</option>
                  <option value="RFQ Specialist">RFQ Specialist (Procurement & Quotes)</option>
                  <option value="Content Editor">Content Editor (CMS, Builder & Blog)</option>
                  <option value="Super Admin">Super Administrator (Full Unrestricted Access)</option>
                </select>
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
                  Invite Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
