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
