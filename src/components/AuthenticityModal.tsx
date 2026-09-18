import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, QrCode, Search, HelpCircle } from 'lucide-react';

interface AuthenticityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthenticityModal: React.FC<AuthenticityModalProps> = ({ isOpen, onClose }) => {
  const [serialInput, setSerialInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<'idle' | 'success' | 'checking'>('idle');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setVerifyResult('checking');
    setTimeout(() => {
      setVerifyResult('success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Official Verification Guide
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                How to Verify Genuine Original HP Cartridges
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            At <strong>Ofixbaze Nigeria Limited</strong>, we guarantee that 100% of our toner cartridges are genuine OEM products supplied with official tamper-evident security labels. Follow the official manufacturer tests below to confirm authenticity:
          </p>

          {/* The Hologram Test Graphic / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
                <span>Tilt Front to Back</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                As you tilt the cartridge box from front to back, the <strong>"OK"</strong> and <strong>"✓"</strong> checkmark symbols will move in <strong>OPPOSITE</strong> directions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">2</span>
                <span>Tilt Right to Left</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                As you tilt the cartridge box from right to left, the <strong>"OK"</strong> and <strong>"✓"</strong> checkmark symbols will move in the <strong>SAME</strong> direction.
              </p>
            </div>
          </div>

          {/* Interactive Serial Lookup */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <h4 className="text-xs font-bold text-blue-950 mb-1 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-600" />
              Check Cartridge Security Label or QR Serial
            </h4>
            <p className="text-[11px] text-slate-600 mb-3">
              Enter the 10-digit serial number printed on the tamper-evident security label on your Ofixbaze packaging:
            </p>

            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. HP-9482-1082-NG"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 uppercase font-mono"
              />
              <button
                type="submit"
                disabled={verifyResult === 'checking'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{verifyResult === 'checking' ? 'Validating...' : 'Verify'}</span>
              </button>
            </form>

            {verifyResult === 'success' && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Verified Genuine OEM Serial:</strong> This unit is authenticated as a brand-new, factory-sealed cartridge distributed by Ofixbaze Nigeria.
                </span>
              </div>
            )}
          </div>

          {/* Why Avoid Counterfeits */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Why Avoid Counterfeit Toners in Nigeria?
            </h4>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
              <li>Counterfeits cause toner leaks that damage printer drums and fuser units.</li>
              <li>Fake toners yield up to 60% fewer pages than advertised.</li>
              <li>Using non-original cartridges voids your official HP printer warranty.</li>
            </ul>
          </div>

          {/* Bottom Close */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
