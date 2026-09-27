import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Patient, DrawCycle, DiceReward, CheckUIDResult, SystemStatus } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'mch_store.json');

interface MchStore {
  patients: Patient[];
  draws: DrawCycle[];
  rewards: DiceReward[];
  lastUidSequence: number;
}

// Initial seed data with sequential UIDs strictly matching MCH-2026-XXX
const initialSeed: MchStore = {
  lastUidSequence: 21,
  patients: [
    { id: 'p1', name: 'Rahul Kumar', uid: 'MCH-2026-001', dischargeDate: '26 September 2026', participationStatus: 'Included', createdAt: '2026-09-26T10:00:00Z' },
    { id: 'p2', name: 'Priya Sharma', uid: 'MCH-2026-002', dischargeDate: '26 September 2026', participationStatus: 'Included', createdAt: '2026-09-26T11:15:00Z' },
    { id: 'p3', name: 'Amit Patel', uid: 'MCH-2026-003', dischargeDate: '25 September 2026', participationStatus: 'Included', createdAt: '2026-09-25T14:20:00Z' },
    { id: 'p4', name: 'Sunita Devi', uid: 'MCH-2026-004', dischargeDate: '25 September 2026', participationStatus: 'Included', createdAt: '2026-09-25T16:00:00Z' },
    { id: 'p5', name: 'Vikram Singh', uid: 'MCH-2026-005', dischargeDate: '24 September 2026', participationStatus: 'Not Included', createdAt: '2026-09-24T09:30:00Z' },
    { id: 'p6', name: 'Rajesh Verma', uid: 'MCH-2026-006', dischargeDate: '24 September 2026', participationStatus: 'Included', createdAt: '2026-09-24T12:00:00Z' },
    { id: 'p7', name: 'Ananya Gupta', uid: 'MCH-2026-007', dischargeDate: '23 September 2026', participationStatus: 'Included', createdAt: '2026-09-23T15:45:00Z' },
    { id: 'p8', name: 'Suresh Mehta', uid: 'MCH-2026-008', dischargeDate: '23 September 2026', participationStatus: 'Included', createdAt: '2026-09-23T17:10:00Z' },
    { id: 'p9', name: 'Kavita Joshi', uid: 'MCH-2026-009', dischargeDate: '22 September 2026', participationStatus: 'Included', createdAt: '2026-09-22T08:50:00Z' },
    { id: 'p10', name: 'Manoj Tiwari', uid: 'MCH-2026-010', dischargeDate: '22 September 2026', participationStatus: 'Included', createdAt: '2026-09-22T14:30:00Z' },
    { id: 'p11', name: 'Pooja Mishra', uid: 'MCH-2026-011', dischargeDate: '21 September 2026', participationStatus: 'Included', createdAt: '2026-09-21T11:00:00Z' },
    { id: 'p12', name: 'Deepak Yadav', uid: 'MCH-2026-012', dischargeDate: '21 September 2026', participationStatus: 'Included', createdAt: '2026-09-21T16:20:00Z' },
    { id: 'p13', name: 'Neha Chauhan', uid: 'MCH-2026-013', dischargeDate: '20 September 2026', participationStatus: 'Included', createdAt: '2026-09-20T10:15:00Z' },
    { id: 'p14', name: 'Sanjay Saxena', uid: 'MCH-2026-014', dischargeDate: '20 September 2026', participationStatus: 'Not Included', createdAt: '2026-09-20T13:40:00Z' },
    { id: 'p15', name: 'Geeta Rao', uid: 'MCH-2026-015', dischargeDate: '19 September 2026', participationStatus: 'Included', createdAt: '2026-09-19T09:00:00Z' },
    { id: 'p16', name: 'Harish Nair', uid: 'MCH-2026-016', dischargeDate: '19 September 2026', participationStatus: 'Included', createdAt: '2026-09-19T14:00:00Z' },
    { id: 'p17', name: 'Meenakshi Sen', uid: 'MCH-2026-017', dischargeDate: '18 September 2026', participationStatus: 'Included', createdAt: '2026-09-18T10:30:00Z' },
    { id: 'p18', name: 'Arvind Das', uid: 'MCH-2026-018', dischargeDate: '18 September 2026', participationStatus: 'Included', createdAt: '2026-09-18T15:20:00Z' },
    { id: 'p19', name: 'Shalini Reddy', uid: 'MCH-2026-019', dischargeDate: '17 September 2026', participationStatus: 'Included', createdAt: '2026-09-17T11:45:00Z' },
    { id: 'p20', name: 'Rohit Malhotra', uid: 'MCH-2026-020', dischargeDate: '17 September 2026', participationStatus: 'Included', createdAt: '2026-09-17T16:00:00Z' },
    { id: 'p21', name: 'Aakash Verma', uid: 'MCH-2026-021', dischargeDate: '27 September 2026', participationStatus: 'Included', createdAt: '2026-09-27T09:00:00Z' },
  ],
  draws: [
    {
      id: '2026-H1',
      periodName: 'January – June 2026',
      year: 2026,
      half: 1,
      status: 'completed',
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-06-30T23:59:59Z',
      winnerCount: 3,
      winners: ['MCH-2026-003', 'MCH-2026-008', 'MCH-2026-015'],
      totalParticipants: 18,
      closedAt: '2026-06-30T23:59:59Z',
    },
    {
      id: '2026-H2',
      periodName: 'July – December 2026',
      year: 2026,
      half: 2,
      status: 'active',
      startDate: '2026-07-01T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
      winnerCount: 4,
      winners: ['MCH-2026-001', 'MCH-2026-007', 'MCH-2026-012', 'MCH-2026-017'],
      totalParticipants: 19,
    },
  ],
  rewards: [
    {
      uid: 'MCH-2026-017',
      drawId: '2026-H2',
      dice1: 4,
      dice2: 5,
      discountPercentage: 9,
      rollDate: '2026-09-25T14:30:00Z',
      couponCode: 'MCH-WIN-9P-X72K',
      couponStatus: 'ACTIVE',
      expiryDate: '2026-12-25T23:59:59Z',
    },
    {
      uid: 'MCH-2026-003',
      drawId: '2026-H1',
      dice1: 3,
      dice2: 5,
      discountPercentage: 8,
      rollDate: '2026-06-28T10:15:00Z',
      couponCode: 'MCH-WIN-8P-H19B',
      couponStatus: 'REDEEMED',
      expiryDate: '2026-09-28T23:59:59Z',
      redeemedAt: '2026-07-10T12:00:00Z',
    },
  ],
};

function ensureDataFile(): MchStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
    return initialSeed;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Check if migration is needed from old MCH-226-UID to MCH-2026
    if (parsed.patients && parsed.patients.some((p: any) => p.uid.includes('MCH-226-UID'))) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    return parsed;
  } catch {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
    return initialSeed;
  }
}

function saveData(data: MchStore) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ashish@@##1122';

function isValidAdminPassword(pwd?: string | null): boolean {
  if (!pwd) return false;
  const p = pwd.trim();
  return p === 'Ashish@@##1122' || p === ADMIN_PASSWORD;
}

// Generate sequential UID e.g. MCH-2026-022
function generateNextUid(store: MchStore): string {
  store.lastUidSequence += 1;
  const seqStr = String(store.lastUidSequence).padStart(3, '0');
  return `MCH-2026-${seqStr}`;
}

// Helper to generate coupon code e.g. MCH-WIN-9P-X72K
function generateCouponCode(discount: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MCH-WIN-${discount}P-${token}`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // GET /api/status - current system, draw & bot status
  app.get('/api/status', (req, res) => {
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];
    const participating = store.patients.filter(p => p.participationStatus === 'Included');
    const redeemedCount = store.rewards.filter(r => r.couponStatus === 'REDEEMED').length;

    const status: SystemStatus = {
      currentDraw,
      nextDrawDate: currentDraw.endDate,
      botStatus: {
        status: 'ACTIVE',
        lastRunAt: '2026-09-27T00:00:00Z',
        nextScheduledRun: currentDraw.endDate,
        monitoredCycle: currentDraw.periodName,
        totalMonitoredUIDs: participating.length,
      },
      totalPatients: store.patients.length,
      participatingCount: participating.length,
      totalWinners: currentDraw.winners.length,
      totalCouponsRedeemed: redeemedCount,
    };

    res.json(status);
  });

  // GET /api/draws - all draws
  app.get('/api/draws', (req, res) => {
    const store = ensureDataFile();
    res.json(store.draws);
  });

  // GET /api/winners - winner UIDs only for public display (Strict privacy: no patient names)
  app.get('/api/winners', (req, res) => {
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];
    const previousDraws = store.draws.filter(d => d.status === 'completed');

    res.json({
      currentDraw: {
        id: currentDraw.id,
        periodName: currentDraw.periodName,
        winners: currentDraw.winners,
      },
      previousDraws: previousDraws.map(d => ({
        id: d.id,
        periodName: d.periodName,
        winners: d.winners,
        closedAt: d.closedAt,
      })),
    });
  });

  // POST /api/check-uid - Checks result for a specific UID
  app.post('/api/check-uid', (req, res) => {
    const { uid } = req.body;
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'UID is required' });
    }

    const cleanUid = uid.trim().toUpperCase();
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];
    const patient = store.patients.find(p => p.uid.toUpperCase() === cleanUid);

    if (!patient) {
      return res.json({
        uid: cleanUid,
        found: false,
        isWinner: false,
        participationStatus: 'Not Included',
        currentDrawId: currentDraw.id,
        currentPeriodName: currentDraw.periodName,
        diceRolled: false,
        message: 'UID not found in MCH Hospital records. Please check the UID on your Discharge ID Card.',
      } as CheckUIDResult);
    }

    const isWinner = currentDraw.winners.map(w => w.toUpperCase()).includes(cleanUid);
    const existingReward = store.rewards.find(
      r => r.uid.toUpperCase() === cleanUid && r.drawId === currentDraw.id
    );

    let message = '';
    if (isWinner) {
      message = `🎉 Congratulations! ${patient.uid} is a Winner in the ${currentDraw.periodName} MCH Reward Draw.`;
    } else {
      message = 'Your UID was not selected in this draw. Best wishes for the next MCH Reward Draw.';
    }

    const result: CheckUIDResult = {
      uid: patient.uid,
      found: true,
      patientName: patient.name,
      dischargeDate: patient.dischargeDate,
      participationStatus: patient.participationStatus,
      isWinner,
      currentDrawId: currentDraw.id,
      currentPeriodName: currentDraw.periodName,
      diceRolled: !!existingReward,
      reward: existingReward,
      message,
    };

    res.json(result);
  });

  // POST /api/roll-dice - Server-authoritative dice roll (Strict winner-only rule)
  app.post('/api/roll-dice', (req, res) => {
    const { uid } = req.body;
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'UID is required' });
    }

    const cleanUid = uid.trim().toUpperCase();
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];
    const patient = store.patients.find(p => p.uid.toUpperCase() === cleanUid);

    if (!patient) {
      return res.status(404).json({ error: 'UID not found in patient registry' });
    }

    // STRICT RULE: UID must be in winner list
    const isWinner = currentDraw.winners.map(w => w.toUpperCase()).includes(cleanUid);
    if (!isWinner) {
      return res.status(403).json({
        error: 'Dice Reward is available only for selected MCH Winner UIDs.',
        locked: true,
      });
    }

    // STRICT RULE: One Winner UID -> One Dice Throw -> One Saved Discount
    const existingReward = store.rewards.find(
      r => r.uid.toUpperCase() === cleanUid && r.drawId === currentDraw.id
    );

    if (existingReward) {
      return res.status(400).json({
        error: 'Dice has already been rolled for this winner UID. Returning saved result.',
        reward: existingReward,
        alreadyRolled: true,
      });
    }

    // Generate physical dice outcomes on backend
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const discountPercentage = dice1 + dice2; // 2% to 12%

    const couponCode = generateCouponCode(discountPercentage);
    const now = new Date();
    const rollDate = now.toISOString();

    // Expiry date set to 90 days from roll
    const expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expiryDate = expiry.toISOString();

    const newReward: DiceReward = {
      uid: patient.uid,
      drawId: currentDraw.id,
      dice1,
      dice2,
      discountPercentage,
      rollDate,
      couponCode,
      couponStatus: 'ACTIVE',
      expiryDate,
    };

    store.rewards.push(newReward);
    saveData(store);

    res.json({
      success: true,
      reward: newReward,
    });
  });

  // POST /api/redeem-coupon - Redeems an active coupon
  app.post('/api/redeem-coupon', (req, res) => {
    const { couponCode, uid } = req.body;
    const store = ensureDataFile();

    const reward = store.rewards.find(r => 
      (couponCode && r.couponCode.toUpperCase() === couponCode.trim().toUpperCase()) ||
      (uid && r.uid.toUpperCase() === uid.trim().toUpperCase())
    );

    if (!reward) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    if (reward.couponStatus === 'REDEEMED') {
      return res.status(400).json({ error: 'Coupon has already been redeemed', reward });
    }

    reward.couponStatus = 'REDEEMED';
    reward.redeemedAt = new Date().toISOString();
    saveData(store);

    res.json({ success: true, reward });
  });

  // POST /api/participation - Patient toggles their participation
  app.post('/api/participation', (req, res) => {
    const { uid, status } = req.body;
    if (!uid || !status) {
      return res.status(400).json({ error: 'UID and status are required' });
    }

    const cleanUid = uid.trim().toUpperCase();
    const store = ensureDataFile();
    const patient = store.patients.find(p => p.uid.toUpperCase() === cleanUid);

    if (!patient) {
      return res.status(404).json({ error: 'Patient UID not found' });
    }

    patient.participationStatus = status === 'Included' ? 'Included' : 'Not Included';
    saveData(store);

    res.json({ success: true, patient });
  });

  // GET /api/patient/:uid - Patient ID card info (no private medical info)
  app.get('/api/patient/:uid', (req, res) => {
    const { uid } = req.params;
    const cleanUid = uid.trim().toUpperCase();
    const store = ensureDataFile();
    const patient = store.patients.find(p => p.uid.toUpperCase() === cleanUid);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      name: patient.name,
      uid: patient.uid,
      dischargeDate: patient.dischargeDate,
      participationStatus: patient.participationStatus,
    });
  });

  // ADMIN ENDPOINTS

  // GET /api/admin/patients - Search and list patients
  app.get('/api/admin/patients', (req, res) => {
    const store = ensureDataFile();
    const q = (req.query.q as string || '').toLowerCase().trim();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];

    let list = store.patients;
    if (q) {
      list = list.filter(p => p.uid.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    }

    const enhanced = list.map(p => {
      const isWinner = currentDraw.winners.includes(p.uid);
      const reward = store.rewards.find(r => r.uid === p.uid && r.drawId === currentDraw.id);
      return {
        ...p,
        isWinner,
        diceRolled: !!reward,
        reward,
      };
    });

    res.json(enhanced);
  });

  // POST /api/admin/patients - Add Patient with sequential UID auto-generation
  app.post('/api/admin/patients', (req, res) => {
    const { name, dischargeDate, participationStatus } = req.body;
    if (!name || !dischargeDate) {
      return res.status(400).json({ error: 'Patient Name and Discharge Date are required' });
    }

    const store = ensureDataFile();
    const generatedUid = generateNextUid(store);

    const newPatient: Patient = {
      id: 'p_' + Date.now(),
      name: name.trim(),
      uid: generatedUid,
      dischargeDate: dischargeDate.trim(),
      participationStatus: participationStatus === 'Not Included' ? 'Not Included' : 'Included',
      createdAt: new Date().toISOString(),
    };

    store.patients.unshift(newPatient);
    saveData(store);

    res.json({ success: true, patient: newPatient });
  });

  // POST /api/admin/verify-password - Verify admin password
  app.post('/api/admin/verify-password', (req, res) => {
    const { password } = req.body;
    if (!isValidAdminPassword(password)) {
      return res.status(401).json({ error: 'गलत पासवर्ड / Invalid Admin Password. Please try again.' });
    }
    res.json({ success: true, token: 'mch-auth-session-valid' });
  });

  // POST /api/admin/winners/add - Password protected winner UID addition
  app.post('/api/admin/winners/add', (req, res) => {
    const { uid, password, drawId } = req.body;
    const authHeader = req.headers['x-admin-password'] as string;

    if (!isValidAdminPassword(password) && !isValidAdminPassword(authHeader)) {
      return res.status(401).json({ error: 'Winner UID add karne ke liye sahi Admin Password enter karna zaroori hai.' });
    }

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Winner UID enter karna zaroori hai.' });
    }

    const cleanUid = uid.trim().toUpperCase();
    const store = ensureDataFile();
    const targetDraw = store.draws.find(d => d.id === (drawId || '2026-H2')) || store.draws.find(d => d.status === 'active');

    if (!targetDraw) {
      return res.status(404).json({ error: 'Active Draw nahi mila.' });
    }

    if (targetDraw.winners.map(w => w.toUpperCase()).includes(cleanUid)) {
      return res.status(400).json({ error: `UID ${cleanUid} already Winner list me maujood hai.` });
    }

    // Check if patient exists or add directly
    const patientExists = store.patients.find(p => p.uid.toUpperCase() === cleanUid);

    targetDraw.winners.unshift(cleanUid);
    targetDraw.winnerCount = targetDraw.winners.length;
    saveData(store);

    res.json({
      success: true,
      message: `🎉 Winner UID ${cleanUid} safaltapoorvak add ho gaya hai!`,
      uid: cleanUid,
      patientName: patientExists ? patientExists.name : undefined,
      winners: targetDraw.winners,
    });
  });

  // POST /api/admin/winners/toggle - Mark/unmark UID as winner (Password protected)
  app.post('/api/admin/winners/toggle', (req, res) => {
    const { uid, drawId, password } = req.body;
    const authHeader = req.headers['x-admin-password'] as string;

    if (!isValidAdminPassword(password) && !isValidAdminPassword(authHeader)) {
      return res.status(401).json({ error: 'Winner UID status change karne ke liye Admin Password zaroori hai.' });
    }

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    const store = ensureDataFile();
    const targetDraw = store.draws.find(d => d.id === (drawId || '2026-H2')) || store.draws.find(d => d.status === 'active');
    if (!targetDraw) {
      return res.status(404).json({ error: 'Draw not found' });
    }

    const cleanUid = uid.trim().toUpperCase();
    const idx = targetDraw.winners.findIndex(w => w.toUpperCase() === cleanUid);

    let isNowWinner = false;
    if (idx >= 0) {
      // Remove from winners
      targetDraw.winners.splice(idx, 1);
      isNowWinner = false;
    } else {
      // Add to winners
      targetDraw.winners.push(cleanUid);
      isNowWinner = true;
    }

    targetDraw.winnerCount = targetDraw.winners.length;
    saveData(store);

    res.json({ success: true, isWinner: isNowWinner, winners: targetDraw.winners });
  });

  // POST /api/admin/bot/execute-draw - MCH Reward Bot automatic process
  // 1. Close current UID participation list
  // 2. Remove duplicates
  // 3. Select configured winners randomly
  // 4. Save winning UIDs
  // 5. Unlock Dice Reward for winning UIDs
  app.post('/api/admin/bot/execute-draw', (req, res) => {
    const { count = 4 } = req.body;
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active');

    if (!currentDraw) {
      return res.status(400).json({ error: 'No active draw found' });
    }

    // Get eligible participating UIDs (deduplicated)
    const participatingUids = Array.from(
      new Set(
        store.patients
          .filter(p => p.participationStatus === 'Included')
          .map(p => p.uid)
      )
    );

    if (participatingUids.length === 0) {
      return res.status(400).json({ error: 'No participating UIDs found to select from' });
    }

    // Random shuffle & select
    const shuffled = [...participatingUids].sort(() => 0.5 - Math.random());
    const winnerCount = Math.min(count, shuffled.length);
    const selectedWinners = shuffled.slice(0, winnerCount);

    currentDraw.winners = selectedWinners;
    currentDraw.winnerCount = selectedWinners.length;
    currentDraw.totalParticipants = participatingUids.length;

    saveData(store);

    res.json({
      success: true,
      message: `MCH Reward Bot selected ${selectedWinners.length} winners successfully.`,
      winners: selectedWinners,
      draw: currentDraw,
    });
  });

  // GET /api/admin/export-current-winners - Export current draw's winner list as CSV
  app.get('/api/admin/export-current-winners', (req, res) => {
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];

    const rows: string[] = [
      'Winner UID,Patient Name,Discharge Date,Draw Period,Dice 1,Dice 2,Discount %,Coupon Code,Coupon Status,Roll Date',
    ];

    for (const winnerUid of currentDraw.winners) {
      const patient = store.patients.find(p => p.uid.toUpperCase() === winnerUid.toUpperCase());
      const reward = store.rewards.find(r => r.uid.toUpperCase() === winnerUid.toUpperCase() && r.drawId === currentDraw.id);
      const name = patient ? patient.name : 'Unknown';
      const dischargeDate = patient ? patient.dischargeDate : 'Unknown';
      const dice1 = reward ? reward.dice1 : 'Unrolled';
      const dice2 = reward ? reward.dice2 : 'Unrolled';
      const discount = reward ? `${reward.discountPercentage}%` : 'Pending';
      const coupon = reward ? reward.couponCode : 'Pending';
      const status = reward ? reward.couponStatus : 'LOCKED/UNROLLED';
      const rollDate = reward ? reward.rollDate : '';

      rows.push(`"${winnerUid}","${name}","${dischargeDate}","${currentDraw.periodName}","${dice1}","${dice2}","${discount}","${coupon}","${status}","${rollDate}"`);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="mch_current_draw_winners.csv"');
    res.send(rows.join('\n'));
  });

  // GET /api/admin/export - Export winner records as CSV
  app.get('/api/admin/export', (req, res) => {
    const store = ensureDataFile();
    const currentDraw = store.draws.find(d => d.status === 'active') || store.draws[0];

    const rows: string[] = [
      'Draw ID,Period,Winner UID,Dice 1,Dice 2,Discount %,Coupon Code,Coupon Status,Roll Date',
    ];

    for (const draw of store.draws) {
      for (const winnerUid of draw.winners) {
        const reward = store.rewards.find(r => r.uid === winnerUid && r.drawId === draw.id);
        const dice1 = reward ? reward.dice1 : 'Unrolled';
        const dice2 = reward ? reward.dice2 : 'Unrolled';
        const discount = reward ? `${reward.discountPercentage}%` : 'Pending';
        const coupon = reward ? reward.couponCode : 'Pending';
        const status = reward ? reward.couponStatus : 'LOCKED/UNROLLED';
        const rollDate = reward ? reward.rollDate : '';

        rows.push(`"${draw.id}","${draw.periodName}","${winnerUid}","${dice1}","${dice2}","${discount}","${coupon}","${status}","${rollDate}"`);
      }
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="mch_winner_records.csv"');
    res.send(rows.join('\n'));
  });

  // In development, hook into Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MCH Hospital Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
