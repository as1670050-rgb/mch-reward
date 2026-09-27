import React from 'react';
import { Shield, Award, HeartPulse, CheckCircle2, Lock, Sparkles, Clock, HelpCircle } from 'lucide-react';

export const AboutMCH: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C84] bg-[#E8F8F8] px-3.5 py-1 rounded-full uppercase tracking-wider">
          <HeartPulse className="w-3.5 h-3.5" />
          Patient-First Healthcare
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          About MCH Hospital & Patient Reward Program
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Honoring patient recovery with medical excellence, dedicated care, and transparent reward recognition.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#DDF4F4] p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F8] flex items-center justify-center text-[#167C84]">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-heading">
            आपकी सेहत, हमारी खुशी
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our mission goes beyond treatment. Every successfully discharged patient receives personalized recognition and care support.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDF4F4] p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F8] flex items-center justify-center text-[#167C84]">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Six-Month Draw System
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Two cycles every year: January – June and July – December. The automated MCH Reward Bot selects verified winning UIDs fairly.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDF4F4] p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F8] flex items-center justify-center text-[#167C84]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Strict Medical Privacy
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your diagnosis, bills, prescriptions, and medical details are never displayed or stored in public draw records. Only your short UID is shown.
          </p>
        </div>
      </div>

      {/* Reward Program Rules & Journey */}
      <div className="bg-white rounded-3xl border border-[#DDF4F4] p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Award className="w-5 h-5 text-[#167C84]" />
          <span>How the MCH Reward Process Works</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#167C84] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Discharge & Sequential UID</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Upon successful discharge, patients receive a clean digital MCH Patient ID Card with a sequential UID (e.g., <code className="text-[#0F6971] font-bold">MCH-2026-001</code>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#167C84] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Draw Participation</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Patients choose whether their UID is included in the current six-month reward cycle. Once included, status shows <code className="text-emerald-700 font-semibold">Included ✓</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#167C84] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Automatic Six-Month Selection</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                At the conclusion of each period (June 30 and December 31), the automated MCH Reward Bot closes participation, removes duplicate entries, and randomly selects winner UIDs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#167C84] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Strict Winner-Only Physical Dice Throw</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Only verified winner UIDs can unlock and throw the two physical 3D dice. The sum of both dice (1+1=2% up to 6+6=12%) determines your hospital discount percentage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#167C84] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              5
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">One Roll Guarantee & Official Coupon</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Each winner UID throws the dice exactly once. The outcome is securely saved server-side, creating a unique coupon code (e.g., <code className="text-[#0F6971] font-bold">MCH-WIN-9P-X72K</code>) redeemable at MCH Hospital counters or shareable via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-[#DDF4F4] p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#167C84]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 divide-y divide-slate-100">
          <div className="pt-2">
            <div className="font-bold text-slate-800 mb-1">
              Can I roll the dice more than once?
            </div>
            <p>
              No. By strict hospital policy, each winning UID receives exactly one roll per draw cycle. If you return to the app, your saved discount and coupon code are retrieved.
            </p>
          </div>

          <div className="pt-3">
            <div className="font-bold text-slate-800 mb-1">
              Where can I redeem my MCH Winner Coupon?
            </div>
            <p>
              Coupons can be redeemed towards pharmacy purchases, follow-up consultation fees, or diagnostic tests at the MCH Hospital Cashier Counter.
            </p>
          </div>

          <div className="pt-3">
            <div className="font-bold text-slate-800 mb-1">
              Is my medical history shown on the winner list?
            </div>
            <p>
              Never. MCH adheres strictly to patient confidentiality regulations. Only your short UID code is ever visible in public draw results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
