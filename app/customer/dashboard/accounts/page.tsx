import { getAllTransactions } from "@/api/transaction";
import TransactionsList from "@/components/transactions/TransactionsList";

const AccountsPage = async () => {
  const transactionResposne = await getAllTransactions();
  const transactions = transactionResposne.success
    ? transactionResposne.response
    : null;

  return (
    <>
      <TransactionsList  />
    </>
  );
};

export default AccountsPage;
