/**
 * SAMPLE DATA for the dashboard layout.
 * Every figure here is made up. Replace `DASHBOARD_SAMPLE` with data from the API
 * (same shape) when the dashboard is connected to real numbers.
 */

export interface MonthFlow {
  month: string;      // short label, e.g. 'Apr'
  receipts: number;
  payments: number;
}

export interface AccountBalance {
  name: string;
  type: 'Cash' | 'Bank' | 'Fixed Deposit' | 'QR Code Collection';
  balance: number;
}

export interface EventGroupResult {
  name: string;
  income: number;
  expense: number;
}

export interface CategorySpend {
  name: string;
  amount: number;
}

export interface TopDonor {
  name: string;
  amount: number;
  receipts: number;
}

export interface RecentTransaction {
  kind: 'Receipt' | 'Payment' | 'Transfer';
  number: string;
  party: string;
  date: string;       // ISO date
  amount: number;
  mode: string;
}

export interface AttentionItem {
  icon: string;
  title: string;
  detail: string;
  route: string;
}

export interface DashboardData {
  financialYear: string;
  /** Same period last year, for the "vs last year" comparison on the tiles. */
  lastYear: { receipts: number; payments: number };
  months: MonthFlow[];
  accounts: AccountBalance[];
  eventGroups: EventGroupResult[];
  categories: CategorySpend[];
  donors: TopDonor[];
  recent: RecentTransaction[];
  attention: AttentionItem[];
}

export const DASHBOARD_SAMPLE: DashboardData = {
  financialYear: '2026/27',
  lastYear: { receipts: 1153400, payments: 902600 },
  months: [
    { month: 'Apr', receipts: 182000, payments: 64500 },
    { month: 'May', receipts: 96500, payments: 118200 },
    { month: 'Jun', receipts: 74200, payments: 52300 },
    { month: 'Jul', receipts: 128400, payments: 96700 },
    { month: 'Aug', receipts: 265300, payments: 184900 },
    { month: 'Sep', receipts: 148900, payments: 132100 },
    { month: 'Oct', receipts: 312600, payments: 241800 },
    { month: 'Nov', receipts: 88400, payments: 57600 }
  ],
  accounts: [
    { name: 'Canara Bank – Udyavar (SB)', type: 'Bank', balance: 579348 },
    { name: 'Fixed Deposit – Canara Bank', type: 'Fixed Deposit', balance: 500000 },
    { name: 'Bafagabettu Credit Co-op Society', type: 'Bank', balance: 245000 },
    { name: 'Cash in Hand', type: 'Cash', balance: 102311 },
    { name: 'QR Code Collection', type: 'QR Code Collection', balance: 18450 }
  ],
  eventGroups: [
    { name: 'Annual Day 2026', income: 412000, expense: 286500 },
    { name: 'Library Fund', income: 120000, expense: 15400 },
    { name: 'Youth Fest', income: 96500, expense: 71200 },
    { name: 'Mahila Day', income: 54000, expense: 38900 },
    { name: 'Music Workshop', income: 42000, expense: 58600 },
    { name: 'Konkani Natak', income: 185000, expense: 214300 }
  ],
  categories: [
    { name: 'Food & Catering', amount: 238400 },
    { name: 'Hall Rent', amount: 186000 },
    { name: 'Decoration', amount: 142500 },
    { name: 'Sound & Lights', amount: 121800 },
    { name: 'Printing', amount: 48200 },
    { name: 'Travel', amount: 36900 },
    { name: 'Others', amount: 174300 }
  ],
  donors: [
    { name: "Anita D'Souza", amount: 75000, receipts: 3 },
    { name: 'St. Mary Trust', amount: 60000, receipts: 1 },
    { name: 'Ramesh Kamath', amount: 45000, receipts: 4 },
    { name: 'Prakash Shetty', amount: 32500, receipts: 2 },
    { name: 'Lavina Pinto', amount: 21000, receipts: 5 }
  ],
  recent: [
    { kind: 'Receipt', number: 'REC-2026-084', party: 'Ramesh Kamath', date: '2026-11-10', amount: 15000, mode: 'Bank' },
    { kind: 'Payment', number: '2026/27-112', party: 'Shetty Decorators', date: '2026-11-09', amount: 22400, mode: 'Bank' },
    { kind: 'Receipt', number: 'REC-2026-083', party: 'Lavina Pinto', date: '2026-11-08', amount: 2500, mode: 'Cash' },
    { kind: 'Transfer', number: 'TRF-0041', party: 'Cash → Canara Bank', date: '2026-11-07', amount: 40000, mode: 'Cash Deposit' },
    { kind: 'Payment', number: '2026/27-111', party: 'Kamath Caterers', date: '2026-11-06', amount: 18750, mode: 'Cash' },
    { kind: 'Receipt', number: 'REC-2026-082', party: 'St. Mary Trust', date: '2026-11-05', amount: 60000, mode: 'Bank' }
  ],
  attention: [
    { icon: 'pending_actions', title: '3 reimbursements pending', detail: 'Member expenses waiting to be paid', route: '/transactions/reimbursements' },
    { icon: 'receipt_long', title: '5 payments without bills', detail: 'Upload or record the bill details', route: '/transactions/payments' },
    { icon: 'badge', title: '2 receipts missing PAN', detail: 'Donations above ₹2,000 need PAN', route: '/transactions/receipts' },
    { icon: 'event_upcoming', title: 'FD matures on 15 Dec 2026', detail: 'Fixed Deposit – Canara Bank · ₹5,00,000', route: '/transactions/bank-transfers' }
  ]
};
