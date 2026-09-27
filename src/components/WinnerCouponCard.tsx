import React, { useState } from 'react';
import { Award, Share2, Check, Clock, CheckCircle2, Copy } from 'lucide-react';
import type { DiceReward } from '../types/index.ts';

interface WinnerCouponCardProps {
  reward: DiceReward;
  onRedeem?: (couponCode: string) => Promise<void>;
  isAdmin?: boolean;
}

export const WinnerCouponCard: React.FC<WinnerCouponCardProps> = ({
  reward,
  onRedeem,
  isAdmin = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const isRedeemed = reward.couponStatus === 'REDEEMED';
  const isExpired = reward.couponStatus === 'EXPIRED';

  // Format dates
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Section 17: Normal WhatsApp share (no API keys, manual send)
  // Text: "My MCH Winner UID is MCH-226-UID-043 and I received a 9% MCH Winner Reward."
  const shareOnWhatsApp = () => {
    const text = `My MCH Winner UID is ${reward.uid} and I received a ${reward.discountPercentage}% MCH Winner Reward.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRedeem = async () => {
    if (!onRedeem || isRedeemed) return;
    setIsRedeeming(true);
    try {
      await onRedeem(reward.couponCode);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Coupon Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white to-[#F6FCFC] border border-[#DDF4F4] shadow-lg shadow-[#0C2730]/10 overflow-hidden transition-all">
        {/* Top Header Badge */}
        <div className="bg-[#0F6971] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#DDF4F4]" />
            <span className="font-bold text-sm tracking-wide uppercase">
              MCH Winner Reward
            </span>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isRedeemed
                ? 'bg-emerald-800 text-emerald-200'
                : isExpired
                ? 'bg-rose-800 text-rose-200'
                : 'bg-white/20 text-[#DDF4F4]'
            }`}
          >
            {reward.couponStatus}
          </span>
        </div>

        {/* Coupon Content */}
        <div className="p-6 space-y-4">
          {/* Big Discount Value Display */}
          <div className="text-center py-2 bg-[#E8F8F8] rounded-xl border border-[#DDF4F4]">
            <div className="text-xs uppercase tracking-wider text-[#0F6971] font-semibold mb-0.5">
              Verified Discount
            </div>
            <div className="text-4xl font-extrabold text-[#0F6971] font-heading">
              {reward.discountPercentage}% OFF
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              Dice: {reward.dice1} + {reward.dice2}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-sm pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                UID
              </span>
              <span className="font-mono font-bold text-slate-900">
                {reward.uid}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                Dice Outcome
              </span>
              <span className="font-semibold text-slate-800">
                {reward.dice1} + {reward.dice2}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                Discount
              </span>
              <span className="font-bold text-[#167C84]">
                {reward.discountPercentage}%
              </span>
            </div>

            {/* Coupon Code with Copy button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                Coupon Code
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-900 border border-slate-200">
                  {reward.couponCode}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1 text-slate-500 hover:text-[#167C84] transition-colors cursor-pointer"
                  title="Copy Coupon Code"
                  aria-label="Copy Coupon Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
              <span className="text-slate-500 font-medium">Issue Date</span>
              <span className="font-medium text-slate-700">
                {formatDate(reward.rollDate)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Expiry Date</span>
              <span className="font-medium text-slate-700">
                {formatDate(reward.expiryDate)}
              </span>
            </div>
          </div>

          {/* Section 23: Status Banner */}
          {isRedeemed ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2.5 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div>✅ Reward Redeemed</div>
                <div className="text-xs font-normal text-emerald-700">
                  Redeemed on {formatDate(reward.redeemedAt || reward.rollDate)} at MCH Hospital
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {/* WhatsApp Share Button (Section 17) */}
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share on WhatsApp
              </button>

              {/* Admin or Cashier Redeem Button */}
              {onRedeem && (
                <button
                  type="button"
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {isRedeeming ? 'Redeeming...' : 'Mark as Redeemed at Hospital Counter'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
