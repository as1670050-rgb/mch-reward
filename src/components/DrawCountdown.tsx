import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DrawCountdownProps {
  targetDateStr?: string;
  periodName?: string;
}

export const DrawCountdown: React.FC<DrawCountdownProps> = ({
  targetDateStr = '2026-12-31T23:59:59Z',
  periodName = 'July – December 2026',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div className="bg-white rounded-2xl border border-[#DDF4F4] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F8F8] flex items-center justify-center text-[#167C84]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Next MCH Reward Draw
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Six-Month Cycle: {periodName}
            </p>
          </div>
        </div>
        <div className="text-xs text-[#0F6971] bg-[#E8F8F8] px-2.5 py-1 rounded-md font-medium self-start sm:self-auto">
          Automatic Six-Month Schedule
        </div>
      </div>

      {/* Countdown Grid with Tabular Numerals */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
        <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl py-2 px-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#0F6971] tabular-nums font-heading">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
            Days
          </div>
        </div>

        <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl py-2 px-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#0F6971] tabular-nums font-heading">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
            Hours
          </div>
        </div>

        <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl py-2 px-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#0F6971] tabular-nums font-heading">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
            Minutes
          </div>
        </div>

        <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl py-2 px-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#167C84] tabular-nums font-heading">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
};
