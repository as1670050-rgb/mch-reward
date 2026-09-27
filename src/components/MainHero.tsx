import React from 'react';
import { HeartPulse, Award, ShieldCheck, ArrowRight, Dices, Users } from 'lucide-react';

interface MainHeroProps {
  onCheckUid: () => void;
  onViewMyCard: () => void;
  onViewWinnerList: () => void;
  isWinnerVerified: boolean;
  onGoToDice: () => void;
}

export const MainHero: React.FC<MainHeroProps> = ({
  onCheckUid,
  onViewMyCard,
  onViewWinnerList,
  isWinnerVerified,
  onGoToDice,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#F6FCFC] to-[#E8F8F8] border border-[#DDF4F4] p-6 sm:p-10 shadow-sm text-center">
      {/* Background soft ambient orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#167C84]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#0F6971]/5 blur-3xl pointer-events-none" />

      {/* Hospital Identity Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDF4F4] shadow-xs mb-5 text-[#0F6971] text-xs font-semibold">
        <HeartPulse className="w-4 h-4 text-[#167C84]" />
        <span>MCH Hospital · Post-Discharge Care & Reward</span>
      </div>

      {/* Section 2: Required Heading & Subtext */}
      <div className="max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
          “आपकी सेहत, हमारी खुशी”
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
          आपका discharge successfully complete हो गया है। MCH Hospital की तरफ़ से आपके लिए एक खास reward experience तैयार है।
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onViewMyCard}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-[#167C84]" />
          <span>My Patient ID Card</span>
        </button>

        <button
          type="button"
          onClick={onCheckUid}
          className="px-5 py-2.5 rounded-xl bg-[#167C84] hover:bg-[#0F6971] text-white text-sm font-semibold shadow-sm shadow-[#167C84]/25 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <span>Check Draw Result</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {isWinnerVerified ? (
          <button
            type="button"
            onClick={onGoToDice}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-2 animate-pulse"
          >
            <Dices className="w-4 h-4" />
            <span>Roll Winner Dice 🎲</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onViewWinnerList}
            className="px-4 py-2.5 rounded-xl bg-[#E8F8F8] hover:bg-[#DDF4F4] text-[#0F6971] text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>View Winner List</span>
          </button>
        )}
      </div>

      {/* Feature summary indicators */}
      <div className="mt-8 pt-6 border-t border-[#DDF4F4] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-slate-900 font-heading">Sequential UID</div>
          <div className="text-xs text-slate-500 font-medium">MCH-2026-XXX</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900 font-heading">Six-Month Cycle</div>
          <div className="text-xs text-slate-500 font-medium">Jan–Jun & Jul–Dec</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900 font-heading">2% to 12% OFF</div>
          <div className="text-xs text-slate-500 font-medium">Physical Two-Dice Roll</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900 font-heading">Total Privacy</div>
          <div className="text-xs text-slate-500 font-medium">No Public Medical Data</div>
        </div>
      </div>
    </div>
  );
};
