import React, { useState } from 'react';
import { X, Search, CheckCircle, AlertCircle, ArrowRight, Dices } from 'lucide-react';
import type { CheckUIDResult } from '../types/index.ts';

interface CheckUIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckUid: (uid: string) => Promise<CheckUIDResult | null>;
  onSelectWinnerForDice: (result: CheckUIDResult) => void;
}

export const CheckUIDModal: React.FC<CheckUIDModalProps> = ({
  isOpen,
  onClose,
  onCheckUid,
  onSelectWinnerForDice,
}) => {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckUIDResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await onCheckUid(uid.trim());
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#DDF4F4] shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#0F6971] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#DDF4F4]" />
            <span className="font-bold text-base tracking-tight font-heading">
              Check MCH UID Result
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="modal-uid-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Enter Your UID
              </label>
              <input
                id="modal-uid-input"
                type="text"
                value={uid}
                onChange={e => setUid(e.target.value)}
                placeholder="e.g. MCH-2026-001"
                className="w-full px-4 py-2.5 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !uid.trim()}
              className="w-full py-2.5 bg-[#167C84] hover:bg-[#0F6971] text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {loading ? 'Checking Records...' : 'Check Result'}
            </button>
          </form>

          {/* Result view */}
          {result && (
            <div
              className={`p-4 rounded-xl border text-sm ${
                result.isWinner
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-bold text-sm mb-1 leading-snug">
                {result.message}
              </div>

              {result.isWinner ? (
                <div className="mt-3 pt-3 border-t border-emerald-200/80 space-y-2">
                  <div className="text-xs text-emerald-800">
                    UID: <span className="font-mono font-bold">{result.uid}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectWinnerForDice(result);
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-[#167C84] hover:bg-[#0F6971] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" />
                    <span>Proceed to Winner Dice Roll</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500 mt-1">
                  Participation Status: <span className="font-semibold">{result.participationStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
