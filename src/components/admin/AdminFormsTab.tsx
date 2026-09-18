import React, { useState } from 'react';
import { 
  FileCheck, 
  Inbox, 
  Plus, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  ChevronRight, 
  X,
  Sliders
} from 'lucide-react';
import { CMSForm } from '../../types';

interface SubmissionRecord {
  id: string;
  formId: string;
  formTitle: string;
  senderName: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-1',
    formId: 'form-rfq',
    formTitle: 'Corporate RFQ Form',
    senderName: 'Tunde Adeleke',
    companyName: 'First Bank Nigeria PLC',
    email: 't.adeleke@firstbanknigeria.com',
    phone: '+234 802 111 2233',
    subject: 'Request for Quote: 50x HP 85A Toners + 10 Executive Chairs',
    message: 'We are requesting formal VAT proforma invoice for 50 units HP CE285A toner cartridges and 10 executive ergonomic mesh chairs for our Marina head office.',
    submittedAt: 'Today at 10:14 AM',
    status: 'new'
  },
  {
    id: 'sub-2',
    formId: 'form-contact',
    formTitle: 'General Contact & Advisory',
    senderName: 'Grace Okon',
    companyName: 'PwC Nigeria',
    email: 'grace.okon@pwc.com',
    phone: '+234 813 444 5566',
    subject: 'Heavy-Duty Office Shredder Recommendation',
    message: 'Could you recommend a high-security micro-cut shredder that can shred up to 25 sheets at once for our audit division?',
    submittedAt: 'Yesterday at 3:45 PM',
    status: 'reviewed'
  },
  {
    id: 'sub-3',
    formId: 'form-rfq',
    formTitle: 'Corporate RFQ Form',
    senderName: 'Engr. Farouk Bello',
    companyName: 'TotalEnergies Exploration',
    email: 'f.bello@totalenergies.com',
    phone: '+234 809 777 8899',
    subject: 'Annual Office Equipment Supply Contract Tender',
    message: 'Please send vendor registration documents and company profile for our 2026 procurement vendor listing.',
    submittedAt: 'Sep 14, 2026',
    status: 'resolved'
  }
];

interface AdminFormsTabProps {
  forms: CMSForm[];
  onUpdateForm: (form: CMSForm) => void;
}

export const AdminFormsTab: React.FC<AdminFormsTabProps> = ({
  forms,
  onUpdateForm
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'forms'>('inbox');
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(INITIAL_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateSubmissionStatus = (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status } : s));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(submissions.filter(s => s.id !== id));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Form', 'Sender', 'Company', 'Email', 'Phone', 'Subject', 'Status', 'Date'];
    const rows = submissions.map(s => [
      `"${s.formTitle}"`,
      `"${s.senderName}"`,
      `"${s.companyName}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.subject.replace(/"/g, '""')}"`,
      s.status,
      `"${s.submittedAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ofixbaze-inquiries-export-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Forms & Inquiries Inbox</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {submissions.filter(s => s.status === 'new').length} New Messages
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage website contact forms, tender quote requests, and customer submissions
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
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('inbox')}
          className={`px-4 py-2.5 font-bold cursor-pointer transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'inbox'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Customer Submissions ({submissions.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('forms')}
          className={`px-4 py-2.5 font-bold cursor-pointer transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'forms'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Form Schemas ({forms.length})</span>
        </button>
      </div>

      {/* INBOX VIEW */}
      {activeSubTab === 'inbox' && (
        <div className="space-y-4">
          {/* Toolbar & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by sender, company, subject..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
              {(['all', 'new', 'reviewed', 'resolved'] as const).map(tab => (
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

          {/* Submissions List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Client & Company</th>
                  <th className="p-3.5">Form Source</th>
                  <th className="p-3.5">Subject / Requirement</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubmissions.map(sub => (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-orange-400 transition">
                          {sub.senderName}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          {sub.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[11px]">
                        {sub.formTitle}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white truncate">{sub.subject}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sub.message}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {sub.submittedAt}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                        sub.status === 'new'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : sub.status === 'reviewed'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {sub.status === 'new' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{sub.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubmission(sub);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORMS CONFIGURATION VIEW */}
      {activeSubTab === 'forms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map(form => (
            <div key={form.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{form.title || form.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">ID: {form.id}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fields In Schema:</span>
                <div className="space-y-1">
                  {form.fields.map(f => (
                    <div key={f.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{f.label}</strong>
                        {f.required && <span className="text-rose-400 ml-1 font-bold">*</span>}
                        <span className="text-[10px] text-slate-500 ml-2 font-mono">({f.type})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{f.placeholder || 'No placeholder'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-slate-400 text-[11px]">
                Button Label: <strong className="text-white">{form.submitButtonText}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Inquiry Details</h3>
                  <span className="text-[10px] text-slate-400">{selectedSubmission.submittedAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">From Client:</span>
                  <strong className="text-white text-xs">{selectedSubmission.senderName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Company / Entity:</span>
                  <strong className="text-orange-400 text-xs">{selectedSubmission.companyName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Email:</span>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-blue-400 hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Phone:</span>
                  <span className="text-slate-300">{selectedSubmission.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Subject:</span>
                <p className="font-bold text-white bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedSubmission.subject}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Detailed Message / RFQ Requirements:</span>
                <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.message}
                </p>
              </div>

              {/* Status Update */}
              <div className="pt-2">
                <span className="text-slate-400 font-semibold block mb-1.5">Update Submission Processing Status:</span>
                <div className="flex gap-2">
                  {(['new', 'reviewed', 'resolved'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateSubmissionStatus(selectedSubmission.id, st)}
                      className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] transition cursor-pointer border ${
                        selectedSubmission.status === st
                          ? 'bg-orange-600 border-orange-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between gap-2">
              <button
                onClick={() => deleteSubmission(selectedSubmission.id)}
                className="px-3 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-lg font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
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
