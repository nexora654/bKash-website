import React, { useState } from 'react';
import { X, Phone, UserPlus, CheckCircle2, ArrowRight, ShieldCheck, Lock, User, AlertCircle, KeyRound } from 'lucide-react';
import { supabase, formatE164Phone, translateSupabaseError, isSupabaseConfigured } from '../lib/supabase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenConfig?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenConfig,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  // Helper to store in profiles table
  const createProfileRecord = async (userId?: string, phoneNum?: string, name?: string) => {
    try {
      if (!userId) return;
      await supabase.from('profiles').upsert({
        id: userId,
        phone: phoneNum,
        full_name: name,
        balance: 500,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Ignore if table not set up
    }
  };

  // Step 1: Submit Details & Request OTP / Sign up with Supabase Auth
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: ০১৭১২ ৩৪৫৬৭৮)');
      return;
    }
    if (!fullName.trim()) {
      setError('অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন');
      return;
    }
    if (pin.length !== 5) {
      setError('৫ সংখ্যার গোপন পিন নির্ধারণ করুন');
      return;
    }
    if (pin !== confirmPin) {
      setError('উভয় পিন নম্বর মিলছে না, আবার লিখুন');
      return;
    }

    if (!isConfigured) {
      setError('Supabase কনফিগারেশন অনুপস্থিত। দয়া করে প্রথমে আপনার Supabase প্রজেক্ট URL এবং কী সেট করুন।');
      return;
    }

    const e164Phone = formatE164Phone(mobile);
    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: e164Phone,
        password: pin,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: e164Phone,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes('already registered')) {
          setError('এই মোবাইল নম্বরটি ইতোমধ্যে একটি একাউন্টে নিবন্ধিত আছে। সরাসরি লগইন করুন।');
        } else {
          setError(translateSupabaseError(signUpError));
        }
        setIsSubmitting(false);
        return;
      }

      if (data?.session) {
        await createProfileRecord(data.user?.id, e164Phone, fullName.trim());
        setStep(4);
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError(translateSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.length < 6) {
      setError('অনুগ্রহ করে ৬ সংখ্যার ওটিপি কোডটি লিখুন');
      return;
    }

    const e164Phone = formatE164Phone(mobile);
    setIsSubmitting(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: e164Phone,
        token: otpCode.trim(),
        type: 'sms',
      });

      if (verifyError) {
        setError(translateSupabaseError(verifyError));
      } else {
        await createProfileRecord(data.user?.id, e164Phone, fullName.trim());
        setStep(4);
      }
    } catch (err: any) {
      setError(translateSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    const e164Phone = formatE164Phone(mobile);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'sms',
        phone: e164Phone,
      });
      if (resendError) setError(translateSupabaseError(resendError));
    } catch (err: any) {
      setError(translateSupabaseError(err));
    }
  };

  const handleClose = () => {
    setStep(1);
    setMobile('');
    setFullName('');
    setPin('');
    setConfirmPin('');
    setOtpCode('');
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9E0047] via-[#C20E5C] to-[#E2136E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <UserPlus className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 id="reg-title" className="text-lg font-bold">নতুন অ্যাকাউন্ট নিবন্ধন</h3>
              <p className="text-xs text-pink-100">সুরক্ষিত রেজিস্ট্রেশন</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-[#E2136E] font-bold' : ''}>১. তথ্য ও পিন</span>
            <span className={step >= 2 ? 'text-[#E2136E] font-bold' : ''}>২. SMS ওটিপি</span>
            <span className={step === 4 ? 'text-emerald-600 font-bold' : ''}>৩. সম্পন্ন</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E2136E] h-full transition-all duration-300 rounded-full"
              style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
            />
          </div>
        </div>

        {/* Missing config warning */}
        {!isConfigured && (
          <div className="mx-6 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>Supabase কনফিগারেশন প্রয়োজন। </span>
              {onOpenConfig && (
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="font-bold underline text-amber-800"
                >
                  কনফিগারেশন নির্দেশিকা দেখুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার সম্পূর্ণ নাম
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20">
                  <User className="w-4 h-4 text-slate-600 mr-2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full text-xs font-medium focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20">
                  <Phone className="w-4 h-4 text-slate-600 shrink-0 mr-2" />
                  <span className="text-slate-700 font-semibold text-xs mr-2">+880</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="1712 345678"
                    className="w-full text-slate-800 text-xs font-medium focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ৫ সংখ্যার পিন
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-[#E2136E]">
                    <Lock className="w-4 h-4 text-slate-600 mr-1.5 shrink-0" />
                    <input
                      type="password"
                      maxLength={5}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••••"
                      className="w-full text-center text-sm font-bold tracking-widest focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পিন নিশ্চিত করুন
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-[#E2136E]">
                    <Lock className="w-4 h-4 text-slate-600 mr-1.5 shrink-0" />
                    <input
                      type="password"
                      maxLength={5}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••••"
                      className="w-full text-center text-sm font-bold tracking-widest focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl text-[11px] text-[#231F20] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E2136E] shrink-0 mt-0.5" />
                <span>
                  আপনার মোবাইল নম্বরে ৬ সংখ্যার ভেরিফিকেশন ওটিপি পাঠানো হবে।
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'ওটিপি কোড পাঠান'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E2136E] flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  +880 {mobile} নম্বরে ওটিপি পাঠানো হয়েছে
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার মোবাইল এসএমএস থেকে ৬ সংখ্যার কোডটি প্রবেশ করান
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="৬ সংখ্যার OTP কোড"
                  className="w-full border-2 border-pink-200 focus:border-[#E2136E] rounded-2xl py-3 text-center text-2xl font-bold tracking-[0.4em] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                <span>কোড পাননি?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#E2136E] font-semibold hover:underline cursor-pointer"
                >
                  পুনরায় পাঠান
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'যাচাই করা হচ্ছে...' : 'ওটিপি নিশ্চিত করুন'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                অভিনন্দন, {fullName || 'গ্রাহক'}!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার অ্যাকাউন্ট সফলভাবে নিবন্ধিত হয়েছে।
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  if (onSuccess) onSuccess();
                }}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer"
              >
                ড্যাশবোর্ডে প্রবেশ করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
