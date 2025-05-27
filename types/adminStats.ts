export interface AdminStatsData {
  date: string;
  totalTransactions: number;
  maxTransactionAmount: number | null;
  avgTransactionAmount: number | null;
  minTransactionAmount: number | null;
  totalCustomers: number;
}

export interface AdminTotalStats {
  totalTransactions: number;
  totalAlerts: number;
  totalUsers: number;
}
