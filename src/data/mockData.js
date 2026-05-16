// ─── MOCK API PLACEHOLDERS ─────────────────────────────────────────────────
// Replace these with real API calls when backend is ready

export const MONTHLY_TREND = [
  { month: 'Dec', balance: 14_200_000, savings: 1_800_000 },
  { month: 'Jan', balance: 15_100_000, savings: 1_900_000 },
  { month: 'Feb', balance: 15_800_000, savings: 2_100_000 },
  { month: 'Mar', balance: 16_500_000, savings: 2_000_000 },
  { month: 'Apr', balance: 17_200_000, savings: 2_400_000 },
  { month: 'May', balance: 18_500_000, savings: 2_300_000 },
]

export const PENDING_TRANSACTIONS = [
  {
    id: 'txn_001',
    description: 'Kopi Kenangan',
    amount: 45000,
    categoryLabel: 'makanan',
  },
  {
    id: 'txn_002',
    description: 'Tokopedia · Nike Air',
    amount: 1350000,
    categoryLabel: 'belanja',
  },
  {
    id: 'txn_003',
    description: 'Netflix Indonesia',
    amount: 186000,
    categoryLabel: 'hiburan',
  },
  {
    id: 'txn_004',
    description: 'GoPay · GoFood',
    amount: 89000,
    categoryLabel: 'makanan',
  },
  {
    id: 'txn_005',
    description: 'BCA Transfer · Ibu',
    amount: 500000,
    categoryLabel: 'lainnya',
  },
]
export const WHATIF_PRESETS = [
  { label: 'New Laptop', price: 18_000_000, icon: '💻' },
  { label: 'Vacation Bali', price: 5_500_000, icon: '🏖️' },
  { label: 'Used Car', price: 120_000_000, icon: '🚗' },
  { label: 'Invest in Stocks', price: 10_000_000, icon: '📈' },
]

export const AI_INSIGHTS = [
  {
    id: 'ins_001',
    type: 'warning',
    icon: '⚡',
    title: 'Lifestyle Inflation Detected',
    message:
      'Your discretionary spending increased 18% this month. At this rate, savings rate drops to 19% by June.',
    action: 'Simulate impact',
  },
  {
    id: 'ins_002',
    type: 'success',
    icon: '🎯',
    title: 'Savings Goal On Track',
    message:
      "You're 3 days ahead of your monthly savings target. Keep current habits to hit Rp 2.5M this month.",
    action: 'View projection',
  },
  {
    id: 'ins_003',
    type: 'info',
    icon: '🔮',
    title: 'Investment Opportunity',
    message:
      'Your emergency fund now covers 6 months. AI recommends redirecting Rp 500K/month to index funds.',
    action: 'Run simulation',
  },
]
