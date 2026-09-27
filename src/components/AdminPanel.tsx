import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserPlus,
  Search,
  Trophy,
  Download,
  CheckCircle,
  XCircle,
  Bot,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Award,
  Calendar,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
} from 'lucide-react';
import type { Patient, DrawCycle, DiceReward, SystemStatus, ParticipationStatus } from '../types/index.ts';

interface AdminPanelProps {
  onClose: () => void;
  systemStatus: SystemStatus | null;
  onRefreshData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  systemStatus,
  onRefreshData,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mch_admin_authenticated') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return sessionStorage.getItem('mch_admin_pwd') || '';
  });
  const [inputPassword, setInputPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Panel state
  const [activeTab, setActiveTab] = useState<'winners' | 'patients' | 'add' | 'bot'>('winners');
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectPatient, setInspectPatient] = useState<any | null>(null);

  // Winner direct add form fields (Password protected)
  const [winnerUidInput, setWinnerUidInput] = useState('');
  const [winnerAddMsg, setWinnerAddMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAddingWinner, setIsAddingWinner] = useState(false);

  // New patient form fields
  const [newName, setNewName] = useState('');
  const [newDischargeDate, setNewDischargeDate] = useState('28 September 2026');
  const [newParticipation, setNewParticipation] = useState<ParticipationStatus>('Included');
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bot trigger state
  const [botRunning, setBotRunning] = useState(false);
  const [botMessage, setBotMessage] = useState<string | null>(null);

  // Password verification handler
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) {
      setLoginError('Kripya admin password enter karein.');
      return;
    }

    setIsVerifying(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'गलत पासवर्ड! Kripya sahi admin password dalein.');
        setIsVerifying(false);
        return;
      }

      // Success
      setIsAuthenticated(true);
      setAdminPassword(inputPassword.trim());
      sessionStorage.setItem('mch_admin_authenticated', 'true');
      sessionStorage.setItem('mch_admin_pwd', inputPassword.trim());
      setInputPassword('');
      await fetchPatients(searchQuery);
    } catch (err: any) {
      setLoginError(err.message || 'Network error verifying password');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    sessionStorage.removeItem('mch_admin_authenticated');
    sessionStorage.removeItem('mch_admin_pwd');
  };

  // Fetch admin patient records
  const fetchPatients = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/patients?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching admin patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPatients(searchQuery);
    }
  }, [searchQuery, isAuthenticated]);

  // Handle Direct Winner UID Add with Password (Requested Feature)
  const handleAddWinnerUidDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerUidInput.trim()) return;

    setIsAddingWinner(true);
    setWinnerAddMsg(null);

    try {
      const res = await fetch('/api/admin/winners/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          uid: winnerUidInput.trim(),
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setWinnerAddMsg({ type: 'error', text: data.error || 'Failed to add winner UID.' });
      } else {
        setWinnerAddMsg({ type: 'success', text: data.message || `Winner UID ${winnerUidInput.toUpperCase()} added successfully!` });
        setWinnerUidInput('');
        await fetchPatients(searchQuery);
        await onRefreshData();
      }
    } catch (err: any) {
      setWinnerAddMsg({ type: 'error', text: err.message || 'Network error adding winner UID' });
    } finally {
      setIsAddingWinner(false);
    }
  };

  // Toggle Winner Status (Password protected)
  const handleToggleWinner = async (uid: string) => {
    try {
      const res = await fetch('/api/admin/winners/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          uid,
          password: adminPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchPatients(searchQuery);
        await onRefreshData();
      } else {
        alert(data.error || 'Error updating winner status');
      }
    } catch (err: any) {
      alert('Error updating winner status: ' + err.message);
    }
  };

  // Handle Add Patient Form (Section 19)
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDischargeDate.trim()) return;

    setIsSubmitting(true);
    setAddSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          dischargeDate: newDischargeDate.trim(),
          participationStatus: newParticipation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddSuccessMsg(`Patient created successfully with sequential UID: ${data.patient.uid}`);
        setNewName('');
        await fetchPatients(searchQuery);
        await onRefreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Error creating patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark Coupon Redeemed (Section 18 & 23)
  const handleMarkRedeemed = async (couponCode: string) => {
    try {
      const res = await fetch('/api/redeem-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchPatients(searchQuery);
        await onRefreshData();
        if (inspectPatient) {
          setInspectPatient((prev: any) => ({
            ...prev,
            reward: {
              ...prev.reward,
              couponStatus: 'REDEEMED',
            },
          }));
        }
      }
    } catch (err: any) {
      alert('Error redeeming coupon: ' + err.message);
    }
  };

  // Trigger Automatic Six-Month Selection (MCH Reward Bot)
  const handleRunBotDraw = async () => {
    if (!window.confirm('Run the automated MCH Reward Bot draw? This will close the period, deduplicate participating UIDs, and select 4 random winners.')) {
      return;
    }

    setBotRunning(true);
    setBotMessage(null);
    try {
      const res = await fetch('/api/admin/bot/execute-draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ count: 4, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setBotMessage(data.message);
        await fetchPatients(searchQuery);
        await onRefreshData();
      } else {
        setBotMessage(data.error || 'Failed to run bot draw');
      }
    } catch (err: any) {
      setBotMessage(err.message || 'Error executing bot draw');
    } finally {
      setBotRunning(false);
    }
  };

  // Export Current Draw's Winner Data as CSV
  const handleExportWinnerData = () => {
    window.location.href = '/api/admin/export-current-winners';
  };

  // Export all CSV
  const handleExportAllCsv = () => {
    window.location.href = '/api/admin/export';
  };

  // 1. PASSWORD GATE SCREEN (If user is not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
        <div className="bg-white rounded-3xl border border-[#DDF4F4] shadow-2xl w-full max-w-md overflow-hidden relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0C2730] to-[#0F6971] text-white px-6 py-5 text-center relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-300 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              Close ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#167C84] mx-auto flex items-center justify-center text-white mb-2.5 shadow-md shadow-[#167C84]/40">
              <KeyRound className="w-6 h-6 text-[#DDF4F4]" />
            </div>
            <h2 className="text-lg font-bold font-heading">
              Admin Password Verification
            </h2>
            <p className="text-xs text-[#DDF4F4]/80 mt-1 font-medium">
              Winner UID add karne aur manage karne ke liye password enter karein.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={inputPassword}
                    onChange={e => setInputPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-2.5 pr-10 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || !inputPassword.trim()}
                className="w-full py-2.5 bg-[#167C84] hover:bg-[#0F6971] text-white font-bold text-sm rounded-xl shadow-md shadow-[#167C84]/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying...' : 'Unlock Admin Panel'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN PANEL
  const currentWinners = systemStatus?.currentDraw.winners || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-[#DDF4F4] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0C2730] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#167C84] flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#DDF4F4] font-semibold">
                  MCH Hospital Administration
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Password Verified
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading">
                Patient Reward & Winner UID Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              title="Lock Admin Panel"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-900/40 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F6FCFC] border-b border-[#DDF4F4] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('winners')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'winners'
                  ? 'bg-[#167C84] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Add & Manage Winners 🏆</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('patients')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'patients'
                  ? 'bg-[#167C84] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Patient Registry & Search
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'add'
                  ? 'bg-[#167C84] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              + Add Patient (Auto UID)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bot')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'bot'
                  ? 'bg-[#167C84] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>MCH Reward Bot</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportWinnerData}
              title="Download current draw winner list as CSV"
              className="px-3.5 py-1.5 bg-[#167C84] hover:bg-[#0F6971] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Winner Data</span>
            </button>

            <button
              type="button"
              onClick={handleExportAllCsv}
              title="Download all past and current draws CSV"
              className="hidden sm:flex px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All Records</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 0: ADD & MANAGE WINNERS (PASSWORD PROTECTED) */}
          {activeTab === 'winners' && (
            <div className="space-y-6">
              {/* Direct Add Winner Form */}
              <div className="bg-gradient-to-r from-[#F6FCFC] via-white to-[#E8F8F8] border border-[#DDF4F4] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#167C84] text-white flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Add Winner UID (Password Authorized)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Enter any MCH UID to directly add to the current Six-Month Winner List. Winner Dice will unlock instantly for this UID.
                    </p>
                  </div>
                </div>

                {winnerAddMsg && (
                  <div
                    className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                      winnerAddMsg.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {winnerAddMsg.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{winnerAddMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleAddWinnerUidDirect} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="direct-winner-uid-input"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
                      >
                        Enter Patient UID to Mark as Winner
                      </label>
                      <input
                        id="direct-winner-uid-input"
                        type="text"
                        value={winnerUidInput}
                        onChange={e => setWinnerUidInput(e.target.value)}
                        placeholder="e.g. MCH-2026-005"
                        className="w-full px-4 py-2.5 bg-white border border-[#DDF4F4] rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167C84]/40 uppercase"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isAddingWinner || !winnerUidInput.trim()}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#167C84] to-[#0F6971] hover:from-[#0F6971] hover:to-[#09474D] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <span>{isAddingWinner ? 'Adding...' : '+ Add as Winner'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Authorized under admin session. Validated server-side.</span>
                  </div>
                </form>
              </div>

              {/* Current Winners List in Active Draw */}
              <div className="bg-white border border-[#DDF4F4] rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#167C84]" />
                      <span>Current Draw Winners ({systemStatus?.currentDraw.periodName})</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Total {currentWinners.length} verified winner UIDs in this cycle.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentWinners.map((uid, idx) => {
                    const patient = patients.find(p => p.uid === uid);
                    const reward = patient?.reward;
                    return (
                      <div
                        key={uid}
                        className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl p-3.5 flex items-center justify-between group hover:border-[#167C84] transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#167C84]">#{idx + 1}</span>
                            <span className="font-mono font-bold text-sm text-slate-900">
                              🏆 {uid}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {patient ? patient.name : 'Registered Patient'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {reward
                              ? `Dice: ${reward.dice1}+${reward.dice2} (${reward.discountPercentage}% OFF - ${reward.couponCode})`
                              : 'Dice Unlocked / Pending Roll'}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleWinner(uid)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PATIENTS & SEARCH */}
          {activeTab === 'patients' && (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by UID or Patient Name..."
                    className="w-full pl-9 pr-4 py-2 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167C84]/30"
                  />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Showing {patients.length} patient records
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-[#DDF4F4] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F6FCFC] text-slate-600 border-b border-[#DDF4F4] font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">UID</th>
                        <th className="py-3 px-4">Patient Name</th>
                        <th className="py-3 px-4">Discharge Date</th>
                        <th className="py-3 px-4">Participation</th>
                        <th className="py-3 px-4">Winner Status</th>
                        <th className="py-3 px-4">Dice & Coupon</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patients.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No matching patient records found.
                          </td>
                        </tr>
                      ) : (
                        patients.map(p => (
                          <tr key={p.id} className="hover:bg-[#F6FCFC]/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#0F6971]">
                              {p.uid}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              {p.name}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {p.dischargeDate}
                            </td>
                            <td className="py-3 px-4">
                              {p.participationStatus === 'Included' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                                  Included ✓
                                </span>
                              ) : (
                                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  Not Included
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {p.isWinner ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                                  🏆 Winner
                                </span>
                              ) : (
                                <span className="text-slate-400">Standard</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {p.reward ? (
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800">
                                    {p.reward.dice1} + {p.reward.dice2} ({p.reward.discountPercentage}%)
                                  </div>
                                  <div className="font-mono text-[10px] text-slate-500">
                                    {p.reward.couponCode} ({p.reward.couponStatus})
                                  </div>
                                </div>
                              ) : p.isWinner ? (
                                <span className="text-amber-600 font-medium">Unlocked / Ready to Roll</span>
                              ) : (
                                <span className="text-slate-400">Locked 🔒</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => setInspectPatient(p)}
                                className="p-1 text-slate-500 hover:text-[#167C84] rounded transition-colors cursor-pointer"
                                title="Inspect Record"
                              >
                                <Eye className="w-4 h-4 inline" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleWinner(p.uid)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                                  p.isWinner
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {p.isWinner ? 'Remove Winner' : 'Mark Winner'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD PATIENT FORM */}
          {activeTab === 'add' && (
            <div className="max-w-lg mx-auto bg-white border border-[#DDF4F4] rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Register Discharged Patient
                </h3>
                <p className="text-xs text-slate-500">
                  The system will automatically generate a sequential MCH UID in the format <code className="text-[#0F6971] font-bold">MCH-2026-XXX</code>.
                </p>
              </div>

              {addSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{addSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddPatient} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="admin-patient-name" className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Patient Name
                  </label>
                  <input
                    id="admin-patient-name"
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
                  />
                </div>

                <div>
                  <label htmlFor="admin-discharge-date" className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Discharge Date
                  </label>
                  <input
                    id="admin-discharge-date"
                    type="text"
                    value={newDischargeDate}
                    onChange={e => setNewDischargeDate(e.target.value)}
                    placeholder="e.g. 28 September 2026"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
                  />
                </div>

                <div>
                  <label htmlFor="admin-participation-status" className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Participation Status
                  </label>
                  <select
                    id="admin-participation-status"
                    value={newParticipation}
                    onChange={e => setNewParticipation(e.target.value as ParticipationStatus)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FCFC] border border-[#DDF4F4] rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#167C84]/40"
                  >
                    <option value="Included">Included ✓</option>
                    <option value="Not Included">Not Included</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#167C84] hover:bg-[#0F6971] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Patient & Auto-Generate UID'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MCH REWARD BOT */}
          {activeTab === 'bot' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#F6FCFC] border border-[#DDF4F4] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#167C84] text-white flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      MCH Reward Bot
                    </h3>
                    <p className="text-xs text-slate-500">
                      Automatic background daemon managing the six-month draw process.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200/80 pt-4">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">Monitored Cycle:</span>
                    <span className="font-mono text-slate-900">{systemStatus?.currentDraw.periodName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">Participating UIDs:</span>
                    <span className="font-bold text-[#0F6971]">{systemStatus?.participatingCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">Selected Winners:</span>
                    <span className="font-bold text-[#167C84]">{systemStatus?.currentDraw.winners.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">Next Automatic Trigger:</span>
                    <span className="font-mono text-slate-700">{systemStatus?.currentDraw.endDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-700">Bot Operational State:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      ACTIVE & MONITORING
                    </span>
                  </div>
                </div>

                {botMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{botMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunBotDraw}
                    disabled={botRunning}
                    className="w-full py-3 bg-[#0F6971] hover:bg-[#09474D] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${botRunning ? 'animate-spin' : ''}`} />
                    <span>{botRunning ? 'Running Bot Draw...' : 'Execute Six-Month Selection Now (Bot Run)'}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Closes the period, removes duplicates, randomly picks winners, and unlocks Dice Rewards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 20: ADMIN UID SEARCH & INSPECT MODAL */}
        {inspectPatient && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#DDF4F4] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
              <div className="bg-[#167C84] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="font-bold text-sm font-heading">
                  Patient & Reward Details ({inspectPatient.uid})
                </div>
                <button
                  type="button"
                  onClick={() => setInspectPatient(null)}
                  className="text-white hover:text-slate-200 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">Name:</span>
                  <span className="font-bold text-slate-900">{inspectPatient.name}</span>
                </div>

                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">UID:</span>
                  <span className="font-mono font-bold text-[#0F6971]">{inspectPatient.uid}</span>
                </div>

                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">Discharge Date:</span>
                  <span>{inspectPatient.dischargeDate}</span>
                </div>

                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">Participation Status:</span>
                  <span className="font-bold">{inspectPatient.participationStatus}</span>
                </div>

                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">Winner Status:</span>
                  <span className={inspectPatient.isWinner ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                    {inspectPatient.isWinner ? 'Selected Winner 🏆' : 'Not Selected'}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-slate-500">Dice Status:</span>
                  <span className="font-bold">
                    {inspectPatient.reward ? 'Rolled' : inspectPatient.isWinner ? 'Unlocked / Ready' : 'Locked 🔒'}
                  </span>
                </div>

                {inspectPatient.reward ? (
                  <>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="font-semibold text-slate-500">Dice Result:</span>
                      <span className="font-bold">
                        🎲 {inspectPatient.reward.dice1} + 🎲 {inspectPatient.reward.dice2}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-1.5">
                      <span className="font-semibold text-slate-500">Discount:</span>
                      <span className="font-bold text-[#167C84]">
                        {inspectPatient.reward.discountPercentage}%
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-1.5">
                      <span className="font-semibold text-slate-500">Coupon:</span>
                      <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {inspectPatient.reward.couponCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold text-slate-500">Coupon Status:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          inspectPatient.reward.couponStatus === 'REDEEMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inspectPatient.reward.couponStatus}
                      </span>
                    </div>

                    {inspectPatient.reward.couponStatus === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleMarkRedeemed(inspectPatient.reward.couponCode)}
                        className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                      >
                        Mark Coupon as Redeemed
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-slate-400 italic text-center py-2">
                    No dice roll has taken place yet for this patient.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
