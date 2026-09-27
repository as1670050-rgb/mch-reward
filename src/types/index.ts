export type ParticipationStatus = 'Included' | 'Not Included';
export type CouponStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
export type DrawStatus = 'active' | 'completed' | 'upcoming';

export interface Patient {
  id: string;
  name: string;
  uid: string; // e.g. MCH-226-UID-001
  dischargeDate: string; // e.g. 28 September 2026
  participationStatus: ParticipationStatus;
  createdAt: string;
}

export interface DrawCycle {
  id: string; // e.g. "2026-H2"
  periodName: string; // e.g. "July – December 2026"
  year: number;
  half: 1 | 2;
  status: DrawStatus;
  startDate: string;
  endDate: string;
  winnerCount: number;
  winners: string[]; // List of UIDs
  totalParticipants: number;
  closedAt?: string;
}

export interface DiceReward {
  uid: string;
  drawId: string;
  dice1: number;
  dice2: number;
  discountPercentage: number;
  rollDate: string;
  couponCode: string; // e.g. MCH-WIN-9P-X72K
  couponStatus: CouponStatus;
  expiryDate: string;
  redeemedAt?: string;
}

export interface CheckUIDResult {
  uid: string;
  found: boolean;
  patientName?: string;
  dischargeDate?: string;
  participationStatus: ParticipationStatus;
  isWinner: boolean;
  currentDrawId: string;
  currentPeriodName: string;
  diceRolled: boolean;
  reward?: DiceReward;
  message: string;
}

export interface SystemStatus {
  currentDraw: DrawCycle;
  nextDrawDate: string;
  botStatus: {
    status: 'ONLINE' | 'ACTIVE';
    lastRunAt: string;
    nextScheduledRun: string;
    monitoredCycle: string;
    totalMonitoredUIDs: number;
  };
  totalPatients: number;
  participatingCount: number;
  totalWinners: number;
  totalCouponsRedeemed: number;
}
