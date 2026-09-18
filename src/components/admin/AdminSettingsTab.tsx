import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck,
  Bell,
  Lock,
  Key
} from 'lucide-react';
import { StoreSettings } from '../../types';

interface AdminSettingsTabProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onResetToDefaults: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onResetToDefaults
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState(() => {
    try {
      const stored = localStorage.getItem('ofixbaze_custom_admin_creds');
      if (stored) {
        return JSON.parse(stored)?.email || 'admin@ofixbaze.com';
      }
    } catch {}
    return 'admin@ofixbaze.com';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      const stored = localStorage.getItem('ofixbaze_custom_admin_creds');
      if (stored) {
        return JSON.parse(stored)?.password || 'admin123';
      }
    } catch {}
    return 'admin123';
  });

  const [credsSaved, setCredsSaved] = useState(false);

  const handleSaveCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) return;
    try {
      localStorage.setItem('ofixbaze_custom_admin_creds', JSON.stringify({
        email: adminEmail.trim(),
        password: adminPassword.trim()
      }));
      setCredsSaved(true);
      setTimeout(() => setCredsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store configurations successfully saved and synchronized across the entire website!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Announcement Ticker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Top Announcement Marquee Bar</h4>
                <p className="text-slate-500 text-[11px]">Notice banner visible to all visitors at the top of the store</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.showAnnouncement}
                onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="font-bold text-slate-800 text-xs">Active Ticker</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Announcement Message Text</label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="e.g. ⚡ Special Corporate Discount on Executive Furniture | Call +234..."
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Corporate Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Store Profile & Official Identity</h4>
              <p className="text-slate-500 text-[11px]">Corporate legal name, customer service lines, and warehouse address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company / Store Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tagline Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Hotline</label>
              <input
                type="text"
                required
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Secondary Hotline</label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-emerald-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Showroom & Warehouse Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Official Business Operating Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Shipping Configurations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Delivery & Freight Parameters</h4>
              <p className="text-slate-500 text-[11px]">Free delivery thresholds and flat logistics fees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Free Shipping Minimum Threshold (₦ NGN)</label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThresholdNGN}
                onChange={(e) => setFormData({ ...formData, freeShippingThresholdNGN: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Orders above this amount receive free white-glove delivery in Lagos</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Standard Flat Shipping Fee (₦ NGN)</label>
              <input
                type="number"
                min="0"
                value={formData.standardShippingFeeNGN}
                onChange={(e) => setFormData({ ...formData, standardShippingFeeNGN: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Standard dispatch cost applied to orders below free shipping mark</span>
            </div>
          </div>
        </div>

        {/* Admin Security & Password Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Super Admin Authentication & Security</h4>
                <p className="text-slate-500 text-[11px]">Customize login email and password for accessing this admin control panel</p>
              </div>
            </div>
            {credsSaved && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                ✓ Password Updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admin Login Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@ofixbaze.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: admin@ofixbaze.com</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admin Password</label>
              <input
                type="text"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter new admin password"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: admin123</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveCreds}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Update Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Store Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Reset Store Catalog & Data?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  This will restore the original factory catalog of genuine HP toners, executive chairs, and sample corporate orders.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetToDefaults();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
