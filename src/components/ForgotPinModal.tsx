import React, { useState } from 'react';
import { X, Lock, Phone, KeyRound, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase, formatE164Phone, translateSupabaseError, isSupabaseConfigured } from '../lib/supabase';

interface ForgotPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMobile?: string;
  onOpenConfig?: () => void;
}

export const ForgotPinModal: React.FC<ForgotPinModalProps> = ({
  isOpen,
  onClose,
  defaultMobile = '',
  onOpenConfig,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mobile, setMobile] = useState(defaultMobile || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন');
      return;
    }

    if (!isConfigured) {
      setError('Supabase কনফিগারেশন প্রয়োজন। দয়া করে প্রথমে .env ফাইল কনফিগার করুন।');
      return;
    }

    const e164Phone = formatE164Phone(mobile);
    setIsSubmitting(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: e164Phone,
      });

      if (otpError) {
        setError(translateSupabaseError(otpError));
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError(translateSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('৬ সংখ্যার ভেরিফিকেশন কোড লিখুন');
      return;
    }

    const e164Phone = formatE164Phone(mobile);
    setIsSubmitting(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: e164Phone,
        token: otpCode,
        type: 'sms',
      });

      if (verifyError) {
        setError(translateSupabaseError(verifyError));
      } else {
        setStep(3);
      }
    } catch (err: any) {
      setError(translateSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPin.length !== 5) {
      setError('নতুন পিন অবশ্যই ৫ সংখ্যার হতে হবে');
      return;
    }
    if (newPin !== confirmPin) {
      setError('উভয় পিন নম্বর মিলছে না');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPin,
      });

      if (updateError) {
        setError(translateSupabaseError(updateError));
      } else {
        setStep(4);
      }
    } catch (err: any) {
      setError(translateSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setMobile(defaultMobile || '');
    setOtp(['', '', '', '', '', '']);
    setNewPin('');
    setConfirmPin('');
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-pin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9E0047] via-[#C20E5C] to-[#E2136E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <KeyRound className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 id="forgot-pin-title" className="text-lg font-bold">পিন পুনরুদ্ধার</h3>
              <p className="text-xs text-pink-100">নিরাপদ ভেরিফিকেশন</p>
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

        {/* Step Indicator */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-[#E2136E] font-semibold' : ''}>১. নম্বর</span>
            <span className={step >= 2 ? 'text-[#E2136E] font-semibold' : ''}>২. SMS কোড</span>
            <span className={step >= 3 ? 'text-[#E2136E] font-semibold' : ''}>৩. নতুন পিন</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E2136E] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Body content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <p className="text-sm text-slate-600">
                আপনার নিবন্ধিত মোবাইল নম্বর দিন। আপনার ফোনে একটি যাচাইকরণ ওটিপি পাঠানো হবে।
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  মোবাইল নম্বর
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20">
                  <Phone className="w-5 h-5 text-slate-600 shrink-0 mr-2" />
                  <span className="text-slate-700 font-semibold text-sm mr-2">+880</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="1712 345678"
                    className="w-full text-slate-800 text-base font-medium focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'যাচাই হচ্ছে...' : 'ওটিপি কোড পাঠান'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-slate-700">
                  +880 {mobile} নম্বরে ওটিপি পাঠানো হয়েছে
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার মোবাইল এসএমএস থেকে ৬ সংখ্যার কোডটি লিখুন
                </p>
              </div>

              <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`forgot-otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-10 h-12 text-center text-xl font-bold border border-slate-300 rounded-xl focus:border-[#E2136E] focus:ring-2 focus:ring-[#E2136E]/20 focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'কোড যাচাই হচ্ছে...' : 'যাচাই করুন'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <p className="text-sm text-slate-600">
                আপনার অ্যাকাউন্টের জন্য নতুন ৫ সংখ্যার গোপন পিন সেট করুন।
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  নতুন ৫ সংখ্যার পিন
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20">
                  <Lock className="w-5 h-5 text-slate-600 mr-2" />
                  <input
                    type="password"
                    maxLength={5}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="৫ ডিজিটের পিন"
                    className="w-full text-slate-800 text-base font-medium tracking-widest focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  নতুন পিন নিশ্চিত করুন
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 focus-within:border-[#E2136E] focus-within:ring-2 focus-within:ring-[#E2136E]/20">
                  <Lock className="w-5 h-5 text-slate-600 mr-2" />
                  <input
                    type="password"
                    maxLength={5}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="পুনরায় পিন লিখুন"
                    className="w-full text-slate-800 text-base font-medium tracking-widest focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'পিন পরিবর্তন সম্পন্ন করুন'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">পিন সফলভাবে পরিবর্তন হয়েছে!</h4>
              <p className="text-sm text-slate-600">
                আপনার নতুন পিনটি সক্রিয় হয়েছে। এখন এই পিন দিয়ে লগইন করুন।
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer"
              >
                লগইন স্ক্রিনে ফিরে যান
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPinModal;
