export interface Transaction {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  fee: any;
  location: string;
  description: string;
  createDate: string;
}
