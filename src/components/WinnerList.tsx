import React, { useState } from 'react';
import { Trophy, Search, CheckCircle, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import type { CheckUIDResult } from '../types/index.ts';

interface WinnerListProps {
  currentDrawWinners: string[];
  currentPeriodName: string;
  previousDraws: Array<{
    id: string;
    periodName: string;
    winners: string[];
    closedAt?: string;
  }>;
  onCheckUid: (uid: string) => Promise<CheckUIDResult | null>;
  onSelectWinnerForDice: (result: CheckUIDResult) => void;
}

export const WinnerList: React.FC<WinnerListProps> = ({
  currentDrawWinners,
  currentPeriodName,
  previousDraws,
  onCheckUid,
  onSelectWinnerForDice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'previous' | 'check'>('current');
  const [inputUid, setInputUid] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckUIDResult | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUid.trim()) return;

    setIsChecking(true);
    setCheckResult(null);
    try {
      const res = await onCheckUid(inputUid.trim());
      setCheckResult(res);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#167C84] bg-[#E8F8F8] px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          Official Six-Month Draw Results
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          🏆 MCH Winner List
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Winners selected automatically every six months. For patient privacy, only official MCH UIDs are displayed publicly.
        </p>
      </div>

      {/* Tabs: Current Winners | Previous Winners | Check My UID */}
      <div className="flex items-center justify-center p-1 bg-white border border-[#DDF4F4] rounded-xl shadow-sm max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('current')}
          className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'current'
              ? 'bg-[#167C84] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Current Winners
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('previous')}
          className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'previous'
              ? 'bg-[#167C84] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Previous Winners
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('check')}
          className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'check'
              ? 'bg-[#167C84] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Check My UID
        </button>
      </div>

      {/* TAB 1: CURRENT WINNERS */}
      {activeSubTab === 'current' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">Period: {currentPeriodName}</span>
            <span>{currentDrawWinners.length} Selected Winner UIDs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentDrawWinners.map((uid, index) => (
              <div
                key={uid}
                className="bg-white rounded-2xl border border-[#DDF4F4] p-4.5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F8F8] text-[#0F6971] flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Winner UID
                    </div>
                    <div className="text-base sm:text-lg font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>{uid}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const res = await onCheckUid(uid);
                    if (res) onSelectWinnerForDice(res);
                  }}
                  className="text-xs font-semibold text-[#167C84] hover:text-[#0F6971] px-2.5 py-1.5 rounded-lg hover:bg-[#E8F8F8] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Verify & Roll →
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-2xl p-4 text-xs text-slate-500 text-center">
            🔒 Patient medical records and diagnosis are strictly private and never published.
          </div>
        </div>
      )}

      {/* TAB 2: PREVIOUS WINNERS */}
      {activeSubTab === 'previous' && (
        <div className="space-y-4">
          {previousDraws.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No completed previous draws recorded yet.
            </div>
          ) : (
            previousDraws.map(draw => (
              <div
                key={draw.id}
                className="bg-white rounded-2xl border border-[#DDF4F4] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#167C84]" />
                    <span className="font-bold text-slate-900 text-sm">
                      {draw.periodName}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Completed Cycle
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {draw.winners.map(uid => (
                    <div
                      key={uid}
                      className="bg-[#F6FCFC] border border-[#E8F8F8] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono font-bold text-slate-800">
                        🏆 {uid}
                      </span>
                      <span className="text-slate-400 font-medium">Draw Winner</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: CHECK MY UID (Section 8) */}
      {activeSubTab === 'check' && (
        <div className="bg-white rounded-2xl border border-[#DDF4F4] p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Check If Your UID is Selected
            </h3>
            <p className="text-xs text-slate-500">
              Enter your official MCH UID printed on your Discharge Card.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={inputUid}
              onChange={e => setInputUid(e.target.value)}
              placeholder="e.g. MCH-2026-001"
              className="flex-1 px-4 py-2.5 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
            />
            <button
              type="submit"
              disabled={isChecking || !inputUid.trim()}
              className="px-6 py-2.5 bg-[#167C84] hover:bg-[#0F6971] text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : 'Check Result'}
            </button>
          </form>

          {/* Result Output (Section 8) */}
          {checkResult && (
            <div
              className={`p-4 rounded-xl border text-sm transition-all ${
                checkResult.isWinner
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold text-base mb-1">
                {checkResult.message}
              </div>

              {checkResult.isWinner ? (
                <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-emerald-800">
                    Your Winner Dice Reward is ready to roll.
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectWinnerForDice(checkResult)}
                    className="px-4 py-1.5 bg-[#167C84] hover:bg-[#0F6971] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Winner Dice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Thank you for placing your trust in MCH Hospital. Your UID remains registered for future cycles.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
