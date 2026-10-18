import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Share2, Smartphone, Monitor, Apple, ExternalLink } from 'lucide-react';

interface ShareDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDeviceModal: React.FC<ShareDeviceModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setCanShare(!!navigator.share);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && currentUrl) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && currentUrl) {
      try {
        await navigator.share({
          title: 'bKash - নিরাপদ মোবাইল ব্যাংকিং',
          text: 'যেকোনো মোবাইল বা ডিভাইস থেকে bKash পেইজে প্রবেশ করুন:',
          url: currentUrl,
        });
      } catch {
        // Ignored if user dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const qrImageUrl = currentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&margin=10&color=23-31-32&bgcolor=255-255-255`
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-device-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9E0047] via-[#C20E5C] to-[#E2136E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Smartphone className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 id="share-device-title" className="text-lg font-bold">অন্যান্য ডিভাইসে ওপেন করুন</h3>
              <p className="text-xs text-pink-100">যেকোনো মোবাইল, ট্যাবলেট বা পিসিতে ব্যবহার করুন</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* QR Code Section for instant Mobile Scanning */}
          <div className="bg-gradient-to-b from-pink-50/70 to-white p-4 rounded-2xl border border-pink-100 text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-[#231F20] mb-2 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#E2136E]" />
              মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন
            </span>

            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-pink-100 inline-block my-1">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="QR Code to open on mobile"
                  width={180}
                  height={180}
                  className="rounded-lg block mx-auto"
                  loading="lazy"
                />
              ) : (
                <div className="w-44 h-44 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  QR লোড হচ্ছে...
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-2 max-w-xs">
              আপনার যেকোনো স্মার্টফোনের ক্যামেরা ওপেন করে এই কোডটি স্ক্যান করলেই সরাসরি এই পেইজ ওপেন হয়ে যাবে।
            </p>
          </div>

          {/* Copy Link Row */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              সরাসরি পেইজ লিংক
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 font-mono truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 bg-[#E2136E] hover:bg-[#C20E5C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          {/* Native Share button if available */}
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3 bg-pink-50 hover:bg-pink-100/70 border border-pink-200 text-[#E2136E] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>অন্যদের সাথে শেয়ার করুন (WhatsApp, Messenger)</span>
            </button>
          )}

          {/* Device specific hints */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              যেকোনো ডিভাইসে ইনস্টল করার নিয়ম:
            </span>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-[#231F20] mb-1">
                  <Apple className="w-3.5 h-3.5 text-slate-700" />
                  <span>iPhone / iPad</span>
                </div>
                <span>Safari-তে ওপেন করে <strong>Share</strong> চাপুন, তারপর <strong>Add to Home Screen</strong> এ ক্লিক করুন।</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-[#231F20] mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Android ফোন</span>
                </div>
                <span>Chrome ব্রাউজারে ৩ ডট (⋮) মেনু চেপে <strong>Install App</strong> বা <strong>Add to Home screen</strong> করুন।</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDeviceModal;
