import React from 'react';
import { X, ShieldCheck, Lock, Smartphone, AlertTriangle, PhoneCall } from 'lucide-react';

interface SecurityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityInfoModal: React.FC<SecurityInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9E0047] via-[#C20E5C] to-[#E2136E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <h3 id="security-dialog-title" className="text-lg font-bold">নিরাপত্তা নীতিমালা</h3>
              <p className="text-xs text-pink-100">আপনার সুরক্ষায় আমরা সর্বদা প্রতিশ্রুতিবদ্ধ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-start gap-3 p-3.5 bg-pink-50/70 border border-pink-100 rounded-2xl">
            <Lock className="w-5 h-5 text-[#E2136E] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#231F20]">পিন ও ওটিপি গোপনীয়তা</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                আপনার ৫ সংখ্যার গোপন পিন বা কোনো ভেরিফিকেশন কোড (OTP) কখনো কাউকে জানাবেন না। কোনো অবস্থাতেই কোনো প্রতিনিধি আপনার কাছে পিন চাইবে না।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <Smartphone className="w-5 h-5 text-[#E2136E] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#231F20]">ডিভাইস সিকিউরিটি</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                অননুমোদিত ডিভাইসে আপনার অ্যাকাউন্ট লগইন হওয়া প্রতিহত করতে সর্বাধুনিক এন্ড-টু-এন্ড এনক্রিপশন প্রযুক্তি ব্যবহার করা হয়।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">প্রতারণা থেকে সাবধান</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                লটারির পুরস্কার, ক্যাশব্যাক অফার বা ভুল করে টাকা পাঠানোর অজুহাতে কেউ টাকা চাইলে আগে যাচাই করুন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
            <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-900">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                যেকোনো অনাকাঙ্ক্ষিত লেনদেন বা সন্দেহের ক্ষেত্রে তাৎক্ষণিকভাবে আমাদের হেল্পলাইন <strong>১৬২৪৭</strong> এ কল করুন।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-[#E2136E] hover:bg-[#C20E5C] text-white font-semibold py-3 rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfoModal;
