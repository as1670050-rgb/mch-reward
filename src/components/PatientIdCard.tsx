import React, { useState } from 'react';
import { ShieldCheck, HeartPulse, Check, UserCheck, AlertCircle } from 'lucide-react';
import type { Patient, ParticipationStatus } from '../types/index.ts';

interface PatientIdCardProps {
  patient: Patient;
  onUpdateParticipation: (status: ParticipationStatus) => Promise<void>;
  onCheckThisUid?: (uid: string) => void;
}

export const PatientIdCard: React.FC<PatientIdCardProps> = ({
  patient,
  onUpdateParticipation,
  onCheckThisUid,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isIncluded = patient.participationStatus === 'Included';

  const handleToggle = async () => {
    setIsUpdating(true);
    const newStatus: ParticipationStatus = isIncluded ? 'Not Included' : 'Included';
    try {
      await onUpdateParticipation(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Premium Digital MCH Patient ID Card */}
      <div className="relative rounded-2xl bg-white border border-[#DDF4F4] shadow-md shadow-[#0C2730]/5 overflow-hidden transition-all hover:shadow-lg">
        {/* Card Top Brand Strip */}
        <div className="bg-gradient-to-r from-[#0F6971] via-[#167C84] to-[#0F6971] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center font-bold text-white text-sm">
              MCH
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#DDF4F4]">
                MCH Hospital
              </div>
              <div className="text-sm font-bold tracking-tight text-white">
                Patient ID Card
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DDF4F4]" />
            <span className="font-medium">Verified Card</span>
          </div>
        </div>

        {/* Card Body - ONLY Displays: Patient Name, UID, Discharge Date, Participation Status */}
        <div className="p-6 space-y-4">
          {/* Patient Name */}
          <div className="border-b border-[#E8F8F8] pb-3">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Patient Name
            </div>
            <div className="text-xl font-bold text-slate-900 font-heading">
              {patient.name}
            </div>
          </div>

          {/* UID */}
          <div className="border-b border-[#E8F8F8] pb-3">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              UID
            </div>
            <div className="text-lg font-mono font-bold text-[#0F6971] tracking-wide select-all">
              {patient.uid}
            </div>
          </div>

          {/* Discharge Date */}
          <div className="border-b border-[#E8F8F8] pb-3">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Discharge Date
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {patient.dischargeDate}
            </div>
          </div>

          {/* Participation Status */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Participation Status
            </div>
            <div className="flex items-center gap-2">
              {isIncluded ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Included ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  Not Included
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="bg-[#F6FCFC] px-6 py-2.5 border-t border-[#E8F8F8] flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Hospital Issued Digital Record</span>
          <span className="font-mono">SEC-MCH-2026</span>
        </div>
      </div>

      {/* Participation Toggle Control (Section 5) */}
      <div className="mt-4 bg-white rounded-xl border border-[#DDF4F4] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <label
              htmlFor={`participate-toggle-${patient.uid}`}
              className="text-sm font-semibold text-slate-900 cursor-pointer flex items-center gap-2"
            >
              <span>Include My UID in MCH Reward Draw</span>
            </label>
            <p className="text-xs text-slate-500">
              Allows your UID to enter the automatic six-month MCH winner selection. One UID enters once per cycle.
            </p>
          </div>

          <button
            id={`participate-toggle-${patient.uid}`}
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isIncluded ? 'bg-[#167C84]' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={isIncluded}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isIncluded ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {onCheckThisUid && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => onCheckThisUid(patient.uid)}
              className="text-xs font-semibold text-[#167C84] hover:text-[#0F6971] flex items-center gap-1 cursor-pointer"
            >
              Check Draw Result for this UID →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
