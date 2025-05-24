export interface Accounts {
  id: string;
  accountType: string;
  balance: number;
  balanceType: string;
  transactionLimit: number;
  openDate: string;
  interestRate: number;
  maturiryDate: string;
  sourceAccount: string;
  savingScheduleDay: number;
  monthlyDepositAmount: number
}
