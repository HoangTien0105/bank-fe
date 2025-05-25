"use server";
import { getCheckingAccount } from "@/api/account";
import { searchCustomer } from "@/api/customer";
import { transferMoney } from "@/api/transaction";
import { TransferRequest } from "@/types/transaction";

export async function searchCustomerInfo(search: string) {
  try {
    // Gọi API search customer
    const response = await searchCustomer(search);
    return {
      success: true,
      results: response,
    };
  } catch (error) {
    console.error("Error searching for customer:", error);
    return {
      success: false,
      results: [],
    };
  }
}

export async function getCheckingAccountByCustomerId() {
  try {
    const response = await getCheckingAccount();
    return response;
  } catch (error) {
    console.error("Error getting checking account:", error);
    return null;
  }
}

export async function transferMoneyForCustomer(transferData: TransferRequest) {
  try {
    const response = await transferMoney(transferData);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error transferring money:", error);
    return {
      success: false,
      error: "Failed to transfer money. Please try again.",
    };
  }
}
