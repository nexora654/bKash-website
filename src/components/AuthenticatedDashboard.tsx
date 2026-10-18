import React, { useState, useEffect } from 'react';
import {
  LogOut,
  ShieldCheck,
  User,
  Send,
  ArrowDownLeft,
  Smartphone,
  CreditCard,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { supabase, formatE164Phone } from '../lib/supabase';
import { OrigamiBird } from './OrigamiBird';

interface AuthenticatedDashboardProps {
  user: any;
  onSignOut: () => void;
}

interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  account_number: string;
  account_status: string;
  created_at: string;
}

export const AuthenticatedDashboard: React.FC<AuthenticatedDashboardProps> = ({
  user,
  onSignOut,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(25000.00);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const rawPhone = user?.phone || user?.user_metadata?.phone || '';
  const targetPhone = rawPhone.startsWith('+880') ? rawPhone : formatE164Phone(rawPhone);

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const { data } = await supabase
        .from('paysure_accounts')
        .select('*')
        .eq('phone', targetPhone)
        .maybeSingle();

      if (data) {
        const displayName = (!data.full_name || data.full_name.includes('PaySure')) ? 'bKash গ্রাহক' : data.full_name;
        setProfile({
          id: data.id,
          phone: data.phone,
          full_name: displayName,
          account_number: data.account_number || 'BK-123456789',
          account_status: data.status || 'active',
          created_at: data.created_at || new Date().toISOString(),
        });
        if (data.balance) {
          setBalance(Number(data.balance));
        }
        setNameInput(displayName);
        // Automatically update previous database records if needed
        if (data.full_name && data.full_name.includes('PaySure')) {
          supabase.from('paysure_accounts').update({ full_name: 'bKash গ্রাহক' }).eq('phone', targetPhone).then();
        }
      } else {
        const rawName = user?.user_metadata?.full_name;
        const displayName = (!rawName || rawName.includes('PaySure')) ? 'bKash গ্রাহক' : rawName;
        setProfile({
          id: user?.id || 'user-account',
          phone: targetPhone,
          full_name: displayName,
          account_number: 'BK-' + targetPhone.replace(/\D/g, '').slice(-8),
          account_status: 'active',
          created_at: new Date().toISOString(),
        });
        setNameInput(displayName);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetPhone]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsUpdatingName(true);
    try {
      await supabase
        .from('paysure_accounts')
        .update({ full_name: nameInput.trim() })
        .eq('phone', targetPhone);

      setProfile((prev) => (prev ? { ...prev, full_name: nameInput.trim() } : null));
      setIsEditingName(false);
      setStatusMessage('নাম সফলভাবে আপডেট করা হয়েছে');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      // ignore
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    onSignOut();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-pink-100 overflow-y-auto text-slate-800 flex flex-col min-h-[100dvh] sm:min-h-0 sm:max-h-[min(820px,calc(100dvh-1.5rem))] font-['Hind_Siliguri',sans-serif]">
      {/* Top Header in bKash pink gradient */}
      <div className="bg-gradient-to-r from-[#9E0047] via-[#C20E5C] to-[#E2136E] p-6 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              <span className="text-white">b</span>
              <span className="text-pink-100">Kash</span>
            </span>
            <OrigamiBird size={30} className="translate-y-[-1px]" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
            title="লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>

        {/* User identification */}
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold truncate">
                {profile?.full_name || 'bKash গ্রাহক'}
              </h2>
              <span className="px-1.5 py-0.5 bg-emerald-500/30 border border-emerald-300/40 text-[10px] text-emerald-100 rounded-md font-medium shrink-0">
                সক্রিয়
              </span>
            </div>
            <p className="text-xs text-pink-100 font-mono tracking-wide">
              {targetPhone}
            </p>
          </div>
        </div>

        {/* Balance Tap Widget */}
        <div className="mt-5 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-pink-100 block">বর্তমান ব্যালেন্স</span>
            <span className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              {showBalance ? `৳ ${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '৳ •••••••'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#E2136E] rounded-xl text-xs font-bold shadow-sm hover:bg-pink-50 transition-colors cursor-pointer"
          >
            {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showBalance ? 'লুকান' : 'ব্যালেন্স দেখুন'}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 flex-1 space-y-5">
        {statusMessage && (
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-[#E2136E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E2136E] shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Security Badge */}
        <div className="p-4 bg-pink-50/70 border border-pink-200/80 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#E2136E] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800">
            <span className="font-bold block text-[#231F20]">
              নিরাপদ এনক্রিপশন দ্বারা সুরক্ষিত
            </span>
            <p className="mt-0.5 text-slate-600 leading-relaxed">
              আপনার সকল লেনদেন ও অ্যাকাউন্ট বিবরণী নিরাপদ ও সংরক্ষিত।
            </p>
          </div>
        </div>

        {/* Quick Banking Actions Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            মোবাইল ব্যাংকিং সেবাসমূহ
          </h3>
          <div className="grid grid-cols-4 gap-2.5 text-center">
            <button type="button" className="p-3 bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#E2136E] group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">সেন্ড মানি</span>
            </button>

            <button type="button" className="p-3 bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#E2136E] group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">ক্যাশ আউট</span>
            </button>

            <button type="button" className="p-3 bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#E2136E] group-hover:scale-105 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">রিচার্জ</span>
            </button>

            <button type="button" className="p-3 bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#E2136E] group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">পেমেন্ট</span>
            </button>
          </div>
        </div>

        {/* Profile metadata card */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E2136E]" />
              <span>অ্যাকাউন্ট বিবরণী</span>
            </span>
            <button
              type="button"
              onClick={fetchProfile}
              className="text-[11px] text-[#E2136E] hover:underline flex items-center gap-1 cursor-pointer"
              title="রিফ্রেশ"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingProfile ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">গ্রাহকের নাম:</span>
              {isEditingName ? (
                <form onSubmit={handleUpdateName} className="flex gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs w-32 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingName}
                    className="px-2 py-0.5 bg-[#E2136E] text-white rounded text-[10px]"
                  >
                    সেভ
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">{profile?.full_name || 'নাম নেই'}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-[10px] text-[#E2136E] hover:underline cursor-pointer"
                  >
                    এডিট
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">অ্যাকাউন্ট নম্বর:</span>
              <span className="font-mono font-semibold text-slate-800">
                {profile?.account_number || 'BK-GENERATING'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">নিবন্ধিত মোবাইল:</span>
              <span className="font-mono font-semibold text-slate-800">{targetPhone}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">অ্যাকাউন্ট স্ট্যাটাস:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                সক্রিয় (Active)
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Security */}
        <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-center gap-2.5 text-slate-600 text-xs">
          <Clock className="w-4 h-4 text-[#E2136E] shrink-0" />
          <span>সর্বশেষ লগইন সময়: {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Footer sign out */}
      <div className="p-6 pt-0 mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট করুন</span>
        </button>
      </div>
    </div>
  );
};

export default AuthenticatedDashboard;
