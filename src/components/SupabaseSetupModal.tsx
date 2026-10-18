import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Key,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  isConfiguredInEnv,
  testSupabaseDiagnostic,
  getRuntimeConfig,
} from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'env' | 'sql' | 'test'>('test');

  // Diagnostic state
  const [isTesting, setIsTesting] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    connected: boolean;
    tableExists: boolean;
    message: string;
  } | null>(null);

  // Input states for browser-based runtime test
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem('paysure_supabase_url') || '');
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('paysure_supabase_anon_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    try {
      const res = await testSupabaseDiagnostic();
      setDiagnosticResult(res);
    } catch (err: any) {
      setDiagnosticResult({
        connected: false,
        tableExists: false,
        message: err.message || 'কানেকশন টেস্ট ব্যর্থ হয়েছে',
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();
  const config = getRuntimeConfig();

  const sqlCode = `-- 1. Create table paysure_accounts with phone and pin
CREATE TABLE IF NOT EXISTS public.paysure_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  pin_hash TEXT,
  full_name TEXT DEFAULT 'bKash গ্রাহক',
  account_number TEXT UNIQUE,
  balance NUMERIC(12, 2) DEFAULT 25000.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Ensure pin column exists if previously created
ALTER TABLE public.paysure_accounts ADD COLUMN IF NOT EXISTS pin TEXT;
ALTER TABLE public.paysure_accounts ADD COLUMN IF NOT EXISTS pin_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_paysure_accounts_phone ON public.paysure_accounts(phone);
ALTER TABLE public.paysure_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for login verification" ON public.paysure_accounts;
CREATE POLICY "Allow public read for login verification"
  ON public.paysure_accounts FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert for account creation" ON public.paysure_accounts;
CREATE POLICY "Allow public insert for account creation"
  ON public.paysure_accounts FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on own account" ON public.paysure_accounts;
CREATE POLICY "Allow public update on own account"
  ON public.paysure_accounts FOR UPDATE TO public USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveRuntimeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim() && customKey.trim()) {
      localStorage.setItem('paysure_supabase_url', customUrl.trim());
      localStorage.setItem('paysure_supabase_anon_key', customKey.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onConfigUpdated();
        window.location.reload();
      }, 500);
    }
  };

  const handleClearRuntimeConfig = () => {
    localStorage.removeItem('paysure_supabase_url');
    localStorage.removeItem('paysure_supabase_anon_key');
    setCustomUrl('');
    setCustomKey('');
    onConfigUpdated();
    window.location.reload();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-setup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#153B68] to-[#0788F5] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Database className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 id="supabase-setup-title" className="text-lg font-bold">Supabase ডাটাবেস ও সেভ গাইড</h3>
              <p className="text-xs text-sky-100">মোবাইল নম্বর ও পিন সরাসরি Supabase এ সংরক্ষণের সমাধান</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-4 text-xs font-semibold bg-slate-50">
          <button
            onClick={() => setActiveTab('test')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'border-[#0788F5] text-[#0788F5]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>কেন সেভ হয়নি? (ডায়াগনস্টিক)</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-[#0788F5] text-[#0788F5]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL টেবিল স্ক্রিপ্ট</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'env'
                ? 'border-[#0788F5] text-[#0788F5]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>URL ও কী সেটআপ</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'test' && (
            <div className="space-y-4">
              {/* Diagnostic Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">কানেকশন ও টেবিল স্ট্যাটাস</span>
                  <button
                    onClick={runTest}
                    disabled={isTesting}
                    className="flex items-center gap-1 text-[11px] text-[#0788F5] hover:underline font-semibold"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>পুনরায় টেস্ট করুন</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isConfigured ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-slate-700">
                      <strong>১. Supabase URL ও Key:</strong>{' '}
                      {isConfigured ? (
                        <span className="text-emerald-700 font-semibold">
                          সংযুক্ত ({config.source === 'env' ? '.env' : 'ব্রাউজারে সেভকৃত'})
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          অনুপস্থিত (নিচে URL ও Key পেস্ট করুন)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {diagnosticResult?.tableExists ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-slate-700">
                      <strong>২. "paysure_accounts" টেবিল:</strong>{' '}
                      {diagnosticResult?.tableExists ? (
                        <span className="text-emerald-700 font-semibold">তৈরি আছে</span>
                      ) : (
                        <span className="text-red-700 font-semibold">
                          তৈরি করা হয়নি (SQL ট্যাবে যান)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {diagnosticResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      diagnosticResult.tableExists && diagnosticResult.connected
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {diagnosticResult.message}
                  </div>
                )}
              </div>

              {/* Step by step guide to fix */}
              <div className="space-y-2 text-slate-700 leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm">সেভ না হওয়ার প্রধান ২টি কারণ ও সমাধান:</h4>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Supabase-এ "paysure_accounts" টেবিল না থাকা:</strong> পাশের <strong>"SQL টেবিল স্ক্রিপ্ট"</strong> ট্যাবে গিয়ে কোডটি কপি করে আপনার Supabase Dashboard &rarr; SQL Editor এ পেস্ট করে <strong>Run</strong> করুন।
                  </li>
                  <li>
                    <strong>URL ও Anon Key না দেওয়া:</strong> <strong>"URL ও কী সেটআপ"</strong> ট্যাবে গিয়ে আপনার প্রজেক্টের URL এবং Anon Key দিন।
                  </li>
                </ol>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('sql')}
                  className="flex-1 py-2.5 bg-[#0788F5] hover:bg-[#0677D8] text-white font-semibold rounded-xl text-center"
                >
                  SQL স্ক্রিপ্ট কপি করুন &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('env')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-center"
                >
                  URL ও Key দিন &rarr;
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">paysure_accounts টেবিল তৈরির SQL</h4>
                  <p className="text-slate-500 text-[11px]">
                    Supabase ড্যাশবোর্ডের <strong>SQL Editor</strong> এ গিয়ে নিচের কোডটি রান করুন:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0788F5] text-white rounded-lg font-medium hover:bg-[#0677D8] transition-colors shrink-0 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'কপি হয়েছে!' : 'SQL কপি করুন'}</span>
                </button>
              </div>

              <pre className="p-3.5 bg-slate-950 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[250px] select-all">
                {sqlCode}
              </pre>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                💡 এই স্ক্রিপ্ট রান করার সাথে সাথে আপনার Supabase ড্যাশবোর্ডে <strong>Table Editor &rarr; paysure_accounts</strong> দেখতে পাবেন। তখন লগইন ফর্ম থেকে নম্বর ও পিন সেভ করলে সাথে সাথে টেবিলের নতুন রো তে যুক্ত হবে।
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveRuntimeConfig} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#0788F5]" />
                  <span className="font-bold text-slate-800 text-xs">সরাসরি এখানে URL ও Anon Key পেস্ট করুন:</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0788F5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0788F5]"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0788F5] hover:bg-[#0677D8] text-white py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : null}
                    <span>{savedSuccess ? 'সংরক্ষিত হয়েছে!' : 'সেভ ও সংযোগ করুন'}</span>
                  </button>
                  {localStorage.getItem('paysure_supabase_url') && (
                    <button
                      type="button"
                      onClick={handleClearRuntimeConfig}
                      className="px-3 py-2 border border-slate-300 hover:bg-slate-200 rounded-xl text-slate-700 font-medium cursor-pointer"
                    >
                      ক্লিয়ার
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#0788F5] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Supabase ড্যাশবোর্ড খুলুন</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#153B68] hover:bg-[#0f2c50] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetupModal;
