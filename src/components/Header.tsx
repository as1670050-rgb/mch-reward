import React, { useState } from 'react';
import { Sparkles, Shield, Menu, X, Play } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isWinnerVerified: boolean;
  onOpenCheckUid: () => void;
  onReplayIntro: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isWinnerVerified,
  onOpenCheckUid,
  onReplayIntro,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'my-uid', label: 'My UID' },
    { id: 'winner-list', label: 'Winner List' },
    {
      id: 'winner-dice',
      label: isWinnerVerified ? 'Winner Dice 🎲' : 'Winner Dice 🔒',
      isHighlight: isWinnerVerified,
    },
    { id: 'my-reward', label: 'My Reward' },
    { id: 'about-mch', label: 'About MCH' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDF4F4] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#167C84] flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-[#167C84]/20 group-hover:bg-[#0F6971] transition-colors">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              MCH Hospital
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#167C84] font-semibold">
              Reward & Draw
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#0F6971] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                } ${link.isHighlight ? 'text-[#167C84] font-semibold' : ''}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#167C84] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onReplayIntro}
            title="Replay Cinematic Intro"
            className="p-2 text-slate-500 hover:text-[#167C84] hover:bg-[#E8F8F8] rounded-lg transition-colors cursor-pointer"
            aria-label="Replay Intro"
          >
            <Play className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenCheckUid}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#167C84] hover:bg-[#0F6971] rounded-lg shadow-sm shadow-[#167C84]/25 transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            Check UID
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            title="Admin Portal"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DDF4F4] px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#E8F8F8] text-[#0F6971] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isHighlight && (
                    <span className="text-xs bg-[#167C84] text-white px-2 py-0.5 rounded-full font-semibold">
                      Unlocked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
