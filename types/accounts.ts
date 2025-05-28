export interface Accounts {
  id: string;
  accountType: string;
  balance: number;
  balanceType: string;
  transactionLimit: number;
  openDate: string;
  interestRate: number;
  maturiryDate: string;
  status: string;
  sourceAccount: string;
  savingScheduleDay: number;
  monthlyDepositAmount: number
}

export interface CreateSavingAccountRequest {
  sourceAccountId: string;
  amount: number;
  termMonths: number;
  monthlyDepositAmount?: number ;
}

export interface AccountPageProps {
  searchParams?: {
    page?: string;
    keyword?: string;
    balanceType?: string;
    accountType?: string;
    sortBy?: string;
    sortDirection?: string;
  };
}