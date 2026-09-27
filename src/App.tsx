/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  UserCheck,
  Trophy,
  Dices,
  Award,
  Info,
  Shield,
  HeartPulse,
} from 'lucide-react';
import type { Patient, DrawCycle, DiceReward, SystemStatus, CheckUIDResult, ParticipationStatus } from './types/index.ts';
import { CinematicIntro } from './components/CinematicIntro.tsx';
import { Header } from './components/Header.tsx';
import { MainHero } from './components/MainHero.tsx';
import { DrawCountdown } from './components/DrawCountdown.tsx';
import { PatientIdCard } from './components/PatientIdCard.tsx';
import { WinnerList } from './components/WinnerList.tsx';
import { WinnerDiceSection } from './components/WinnerDiceSection.tsx';
import { WinnerCouponCard } from './components/WinnerCouponCard.tsx';
import { AboutMCH } from './components/AboutMCH.tsx';
import { CheckUIDModal } from './components/CheckUIDModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { SolarSystemBackground } from './components/SolarSystemBackground.tsx';

export default function App() {
  const [showCinematicIntro, setShowCinematicIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [verifiedWinnerResult, setVerifiedWinnerResult] = useState<CheckUIDResult | null>(null);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [previousDraws, setPreviousDraws] = useState<any[]>([]);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [statusRes, winnersRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/winners'),
      ]);

      if (statusRes.ok) {
        const sData: SystemStatus = await statusRes.json();
        setSystemStatus(sData);
      }

      if (winnersRes.ok) {
        const wData = await winnersRes.json();
        setCurrentWinners(wData.currentDraw.winners || []);
        setPreviousDraws(wData.previousDraws || []);
      }
    } catch (err) {
      console.error('Error fetching MCH data:', err);
    }
  };

  // Load default patient record (e.g. MCH-226-UID-001)
  const loadPatient = async (uid: string) => {
    try {
      const res = await fetch(`/api/patient/${encodeURIComponent(uid)}`);
      if (res.ok) {
        const pData: Patient = await res.json();
        setCurrentPatient(pData);
      }
    } catch (err) {
      console.error('Error loading patient:', err);
    }
  };

  useEffect(() => {
    fetchData();
    loadPatient('MCH-2026-001');
  }, []);

  // Update participation status
  const handleUpdateParticipation = async (status: ParticipationStatus) => {
    if (!currentPatient) return;
    try {
      const res = await fetch('/api/participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentPatient.uid, status }),
      });
      if (res.ok) {
        setCurrentPatient({
          ...currentPatient,
          participationStatus: status,
        });
        await fetchData();
      }
    } catch (err) {
      console.error('Error updating participation:', err);
    }
  };

  // Check UID handler
  const handleCheckUid = async (uid: string): Promise<CheckUIDResult | null> => {
    try {
      const res = await fetch('/api/check-uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
      const data: CheckUIDResult = await res.json();
      if (data.isWinner) {
        setVerifiedWinnerResult(data);
      }
      return data;
    } catch (err) {
      console.error('Error checking UID:', err);
      return null;
    }
  };

  // When a verified winner proceeds to Dice
  const handleSelectWinnerForDice = (result: CheckUIDResult) => {
    setVerifiedWinnerResult(result);
    setActiveTab('winner-dice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When dice roll completes
  const handleRollComplete = (newReward: DiceReward) => {
    if (verifiedWinnerResult) {
      setVerifiedWinnerResult({
        ...verifiedWinnerResult,
        diceRolled: true,
        reward: newReward,
      });
    }
    fetchData();
  };

  // Redeem coupon handler
  const handleRedeemCoupon = async (couponCode: string) => {
    try {
      const res = await fetch('/api/redeem-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode }),
      });
      if (res.ok) {
        if (verifiedWinnerResult?.reward) {
          setVerifiedWinnerResult({
            ...verifiedWinnerResult,
            reward: {
              ...verifiedWinnerResult.reward,
              couponStatus: 'REDEEMED',
              redeemedAt: new Date().toISOString(),
            },
          });
        }
        await fetchData();
      }
    } catch (err) {
      console.error('Error redeeming coupon:', err);
    }
  };

  const isWinnerVerified = verifiedWinnerResult?.isWinner ?? false;

  return (
    <div className="min-h-screen bg-[#F6FCFC]/90 text-slate-800 flex flex-col font-sans selection:bg-[#167C84] selection:text-white pb-20 lg:pb-0 relative overflow-x-hidden">
      {/* Subtle, Majestic Background Solar System Animation ("dhire dhire") */}
      <SolarSystemBackground />

      {/* 1. Cinematic MCH Intro Overlay */}
      {showCinematicIntro && (
        <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />
      )}

      {/* Header */}
      <div className="relative z-20">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isWinnerVerified={isWinnerVerified}
          onOpenCheckUid={() => setIsCheckModalOpen(true)}
          onReplayIntro={() => setShowCinematicIntro(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <MainHero
              onCheckUid={() => setIsCheckModalOpen(true)}
              onViewMyCard={() => {
                setActiveTab('my-uid');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewWinnerList={() => {
                setActiveTab('winner-list');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isWinnerVerified={isWinnerVerified}
              onGoToDice={() => {
                setActiveTab('winner-dice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Countdown Component */}
              <DrawCountdown
                targetDateStr={systemStatus?.nextDrawDate}
                periodName={systemStatus?.currentDraw.periodName}
              />

              {/* Patient ID Card Preview */}
              {currentPatient && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Your Digital ID Card
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-uid')}
                      className="text-xs font-semibold text-[#167C84] hover:text-[#0F6971] cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                  <PatientIdCard
                    patient={currentPatient}
                    onUpdateParticipation={handleUpdateParticipation}
                    onCheckThisUid={async uid => {
                      const res = await handleCheckUid(uid);
                      if (res) handleSelectWinnerForDice(res);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quick Winner Preview Banner */}
            <div className="bg-white rounded-2xl border border-[#DDF4F4] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#167C84]" />
                  <span>Current Draw Winners ({systemStatus?.currentDraw.periodName})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentWinners.length} winning UIDs unlocked for 2%–12% hospital discount dice rolls.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('winner-list')}
                  className="px-4 py-2 bg-[#E8F8F8] hover:bg-[#DDF4F4] text-[#0F6971] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  View All Winners
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckModalOpen(true)}
                  className="px-4 py-2 bg-[#167C84] hover:bg-[#0F6971] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Check My UID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY UID & ID CARD */}
        {activeTab === 'my-uid' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                MCH Patient ID Card
              </h2>
              <p className="text-xs text-slate-500">
                Official verified patient discharge record with sequential MCH UID.
              </p>
            </div>

            {currentPatient && (
              <PatientIdCard
                patient={currentPatient}
                onUpdateParticipation={handleUpdateParticipation}
                onCheckThisUid={async uid => {
                  const res = await handleCheckUid(uid);
                  if (res) handleSelectWinnerForDice(res);
                }}
              />
            )}
          </div>
        )}

        {/* TAB 3: WINNER LIST */}
        {activeTab === 'winner-list' && (
          <WinnerList
            currentDrawWinners={currentWinners}
            currentPeriodName={systemStatus?.currentDraw.periodName || 'July – December 2026'}
            previousDraws={previousDraws}
            onCheckUid={handleCheckUid}
            onSelectWinnerForDice={handleSelectWinnerForDice}
          />
        )}

        {/* TAB 4: WINNER DICE (Strict winner rule enforced) */}
        {activeTab === 'winner-dice' && (
          <WinnerDiceSection
            verifiedWinnerResult={verifiedWinnerResult}
            onOpenCheckUid={() => setIsCheckModalOpen(true)}
            onRollComplete={handleRollComplete}
            onRedeemCoupon={handleRedeemCoupon}
          />
        )}

        {/* TAB 5: MY REWARD */}
        {activeTab === 'my-reward' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                My MCH Reward Coupon
              </h2>
              <p className="text-xs text-slate-500">
                Official digital coupon from your verified MCH Winner Dice throw.
              </p>
            </div>

            {verifiedWinnerResult?.reward ? (
              <WinnerCouponCard
                reward={verifiedWinnerResult.reward}
                onRedeem={handleRedeemCoupon}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#DDF4F4] p-8 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E8F8F8] flex items-center justify-center text-[#167C84]">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  No Active Reward Coupon Yet
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reward coupons are issued when a selected winner UID rolls the two physical hospital dice in the Winner Dice section.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCheckModalOpen(true)}
                  className="px-5 py-2.5 bg-[#167C84] hover:bg-[#0F6971] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Check UID for Winner Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ABOUT MCH */}
        {activeTab === 'about-mch' && <AboutMCH />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#DDF4F4] bg-white py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800">
          <HeartPulse className="w-4 h-4 text-[#167C84]" />
          <span>MCH Hospital · Dedicated Patient Care & Reward Platform</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
          Honoring successful recovery with transparent six-month draws and physical dice rewards. Medical data is never stored or displayed publicly.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setShowCinematicIntro(true)}
            className="hover:text-[#167C84] cursor-pointer"
          >
            Replay Intro
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#167C84] cursor-pointer"
          >
            Hospital Admin
          </button>
        </div>
      </footer>

      {/* Mobile-First Fixed Bottom Navigation Bar (Section 29) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDF4F4] px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 items-center h-14">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
              activeTab === 'home' ? 'text-[#0F6971]' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-uid')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
              activeTab === 'my-uid' ? 'text-[#0F6971]' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">My UID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('winner-list')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
              activeTab === 'winner-list' ? 'text-[#0F6971]' : 'text-slate-500'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Winners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('winner-dice')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
              activeTab === 'winner-dice' ? 'text-[#0F6971]' : 'text-slate-500'
            }`}
          >
            <Dices className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              {isWinnerVerified ? 'Dice 🎲' : 'Dice 🔒'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-reward')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
              activeTab === 'my-reward' ? 'text-[#0F6971]' : 'text-slate-500'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Reward</span>
          </button>
        </div>
      </nav>

      {/* Check UID Modal */}
      <CheckUIDModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        onCheckUid={handleCheckUid}
        onSelectWinnerForDice={handleSelectWinnerForDice}
      />

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          systemStatus={systemStatus}
          onRefreshData={fetchData}
        />
      )}
    </div>
  );
}
