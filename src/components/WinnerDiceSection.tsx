import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Dices, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DiceReward, CheckUIDResult } from '../types/index.ts';
import { WinnerCouponCard } from './WinnerCouponCard.tsx';

interface WinnerDiceSectionProps {
  verifiedWinnerResult: CheckUIDResult | null;
  onOpenCheckUid: () => void;
  onRollComplete: (reward: DiceReward) => void;
  onRedeemCoupon: (couponCode: string) => Promise<void>;
}

// Helper to render pips on dice face
const renderPips = (count: number) => {
  return (
    <div className={`dice-face face-${count} pip-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="pip" />
      ))}
    </div>
  );
};

export const WinnerDiceSection: React.FC<WinnerDiceSectionProps> = ({
  verifiedWinnerResult,
  onOpenCheckUid,
  onRollComplete,
  onRedeemCoupon,
}) => {
  const isWinner = verifiedWinnerResult?.isWinner ?? false;
  const winnerUid = verifiedWinnerResult?.uid || '';
  const initialReward = verifiedWinnerResult?.reward || null;

  const [reward, setReward] = useState<DiceReward | null>(initialReward);
  const [isRolling, setIsRolling] = useState(false);
  const [dice1Value, setDice1Value] = useState<number>(initialReward?.dice1 || 4);
  const [dice2Value, setDice2Value] = useState<number>(initialReward?.dice2 || 5);
  const [rollStep, setRollStep] = useState<'idle' | 'rolling' | 'revealed'>(
    initialReward ? 'revealed' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (verifiedWinnerResult?.reward) {
      setReward(verifiedWinnerResult.reward);
      setDice1Value(verifiedWinnerResult.reward.dice1);
      setDice2Value(verifiedWinnerResult.reward.dice2);
      setRollStep('revealed');
    } else {
      setReward(null);
      setRollStep('idle');
    }
  }, [verifiedWinnerResult]);

  // Roll execution
  const handleRollDice = async () => {
    if (isRolling || !isWinner || !winnerUid || reward) return;

    setIsRolling(true);
    setErrorMessage(null);
    setRollStep('rolling');

    try {
      const res = await fetch('/api/roll-dice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: winnerUid }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.alreadyRolled && data.reward) {
          setReward(data.reward);
          setDice1Value(data.reward.dice1);
          setDice2Value(data.reward.dice2);
          setRollStep('revealed');
        } else {
          setErrorMessage(data.error || 'Failed to roll dice. Please try again.');
          setRollStep('idle');
        }
        setIsRolling(false);
        return;
      }

      const newReward: DiceReward = data.reward;

      // Allow physical rolling visual animation for 1.8 seconds before settling
      setTimeout(() => {
        setDice1Value(newReward.dice1);
        setDice2Value(newReward.dice2);
      }, 300);

      setTimeout(() => {
        setIsRolling(false);
        setReward(newReward);
        setRollStep('revealed');
        onRollComplete(newReward);

        // Elegant celebratory confetti
        try {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#167C84', '#0F6971', '#DDF4F4', '#FFD700', '#F6FCFC'],
          });
        } catch {
          // ignore if canvas-confetti is not available
        }
      }, 1900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while rolling dice');
      setIsRolling(false);
      setRollStep('idle');
    }
  };

  // CASE 1: NOT A VERIFIED WINNER (Section 9: STRICT WINNER-ONLY DICE RULE)
  if (!isWinner) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center">
        <div className="bg-white rounded-3xl border border-[#DDF4F4] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle lock background glow */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6 shadow-inner">
            <Lock className="w-10 h-10 text-slate-500" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 font-heading">
            🔒 Winner Dice Locked
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
            Dice Reward is available only for selected MCH Winner UIDs.
          </p>

          <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-2xl p-4 mb-6 text-left text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800">Why is this locked?</div>
            <div>• Only patients selected in the Six-Month MCH Reward Draw can roll the Winner Dice.</div>
            <div>• Each selected winner receives a verified 2% to 12% hospital discount based on their physical dice roll.</div>
            <div>• If your UID was entered in this cycle, verify your status below.</div>
          </div>

          <button
            type="button"
            onClick={onOpenCheckUid}
            className="w-full sm:w-auto px-6 py-3 bg-[#167C84] hover:bg-[#0F6971] text-white font-semibold text-sm rounded-xl shadow-md shadow-[#167C84]/20 transition-all cursor-pointer active:scale-95"
          >
            Check My UID Status
          </button>
        </div>
      </div>
    );
  }

  // CASE 2: VERIFIED WINNER
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner: Winner Reward Unlocked */}
      <div className="bg-gradient-to-r from-[#0F6971] via-[#167C84] to-[#0F6971] rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
            <Unlock className="w-5 h-5 text-[#DDF4F4]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#DDF4F4] font-semibold">
              Verified Winner: {winnerUid}
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              🎉 Winner Reward Unlocked
            </h2>
          </div>
        </div>
        <div className="hidden sm:block text-xs bg-white/20 px-3 py-1 rounded-full font-medium text-white">
          Active Draw Winner
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Dice Arena */}
      <div className="bg-white rounded-3xl border border-[#DDF4F4] p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#167C84] bg-[#E8F8F8] px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Physical 3D Hospital Dice
          </div>
          <p className="text-slate-600 text-sm">
            {reward
              ? 'Your MCH Winner Bonus has been recorded.'
              : 'Your MCH Winner Bonus is waiting! Touch the dice or tap throw.'}
          </p>
        </div>

        {/* TWO ANIMATED 3D PHYSICAL DICE (Section 11) */}
        <div
          onClick={!reward && !isRolling ? handleRollDice : undefined}
          className={`py-8 flex items-center justify-center gap-6 sm:gap-10 dice-scene ${
            !reward && !isRolling ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
          } transition-transform`}
          title={!reward ? 'Touch the dice to roll' : 'Saved Dice Outcome'}
        >
          {/* DICE 1 */}
          <div
            className={`dice-cube ${
              isRolling
                ? 'animate-spin'
                : `show-${dice1Value}`
            }`}
            style={{
              animationDuration: isRolling ? '0.45s' : undefined,
              animationIterationCount: isRolling ? 'infinite' : undefined,
            }}
          >
            {renderPips(1)}
            {renderPips(2)}
            {renderPips(3)}
            {renderPips(4)}
            {renderPips(5)}
            {renderPips(6)}
          </div>

          {/* DICE 2 */}
          <div
            className={`dice-cube ${
              isRolling
                ? 'animate-spin'
                : `show-${dice2Value}`
            }`}
            style={{
              animationDuration: isRolling ? '0.55s' : undefined,
              animationIterationCount: isRolling ? 'infinite' : undefined,
              animationDirection: isRolling ? 'reverse' : undefined,
            }}
          >
            {renderPips(1)}
            {renderPips(2)}
            {renderPips(3)}
            {renderPips(4)}
            {renderPips(5)}
            {renderPips(6)}
          </div>
        </div>

        {/* Dice Calculation Breakdown (Section 12) */}
        {rollStep === 'revealed' && reward && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
            <div className="flex items-center justify-center gap-3 text-sm sm:text-base font-semibold text-slate-700 mb-2">
              <span className="bg-[#F6FCFC] border border-[#DDF4F4] px-3 py-1 rounded-lg">
                🎲 Dice 1: <strong className="text-slate-900">{reward.dice1}</strong>
              </span>
              <span className="text-slate-400 font-bold">+</span>
              <span className="bg-[#F6FCFC] border border-[#DDF4F4] px-3 py-1 rounded-lg">
                🎲 Dice 2: <strong className="text-slate-900">{reward.dice2}</strong>
              </span>
              <span className="text-slate-400 font-bold">=</span>
              <span className="bg-[#E8F8F8] text-[#0F6971] border border-[#DDF4F4] px-3 py-1 rounded-lg font-bold">
                {reward.discountPercentage}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-extrabold text-[#0F6971] font-heading mt-2">
              🎉 You Unlocked {reward.discountPercentage}% Discount
            </div>

            <div className="text-xs text-slate-500 mt-1 font-medium">
              Strict Rule: One Winner UID → One Dice Throw → Saved Result ({reward.uid})
            </div>
          </div>
        )}

        {/* Throw Dice Action Button (Section 10 & 13) */}
        {!reward && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleRollDice}
              disabled={isRolling}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#167C84] to-[#0F6971] hover:from-[#0F6971] hover:to-[#09474D] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#167C84]/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2.5 mx-auto"
            >
              <Dices className="w-5 h-5" />
              <span>{isRolling ? 'Rolling Dice...' : '🎲 Throw Dice'}</span>
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Tap the button or directly touch the dice to roll.
            </p>
          </div>
        )}
      </div>

      {/* WINNER COUPON DISPLAY (Section 15 & 16) */}
      {reward && (
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Your MCH Winner Reward Coupon
            </h3>
            <p className="text-xs text-slate-500">
              Present this coupon at the MCH Hospital Cashier or Pharmacy desk.
            </p>
          </div>

          <WinnerCouponCard
            reward={reward}
            onRedeem={onRedeemCoupon}
            isAdmin={false}
          />
        </div>
      )}
    </div>
  );
};
