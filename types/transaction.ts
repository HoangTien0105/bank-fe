export interface Transaction {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  location: string;
  description: string;
  fromAccountId: string;
  toAccountId: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  location: string;
  description: string;
  amount: number;
}

export interface DepositOrWithdrawRequest {
  accountId: string;
  location: string;
  amount: number;
}
