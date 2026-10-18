import React from 'react';
import { X, Info, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  maskedMobile: string;
  onReset: () => void;
}

export const DemoNoticeModal: React.FC<DemoNoticeModalProps> = ({
  isOpen,
  onClose,
  maskedMobile,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#153B68] to-[#0788F5] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Info className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 id="demo-dialog-title" className="text-lg font-bold">ডেমো ইন্টারফেস বিজ্ঞপ্তি</h3>
              <p className="text-xs text-sky-100">PaySure UI Demonstration</p>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900">ইনপুট সফলভাবে ভ্যালিডেট হয়েছে</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                মোবাইল নম্বর: <strong>{maskedMobile}</strong> | পিন: <strong>••••• (নিরাপদ)</strong>
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#153B68] font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#0788F5]" />
              <span>নিরাপত্তা ও ডেমো ডিসক্লেইমার</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              এটি PaySure ব্রান্ডের একটি অফিসিয়াল ফ্রন্টএন্ড UI ডেমো। ব্যবহারকারীর সুরক্ষার স্বার্থে কোনো ব্যাকএন্ড সংযোগ ছাড়াই এটি ডিজাইন করা হয়েছে। আপনার কোনো তথ্য (নম্বর বা পিন) বাহ্যিক সার্ভারে পাঠানো হয়নি বা কোথাও সংরক্ষণ করা হয়নি।
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              ইনপুট রিসেট
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-[#0788F5] hover:bg-[#0677D8] text-white font-semibold text-sm rounded-2xl transition-colors shadow-sm"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoNoticeModal;
