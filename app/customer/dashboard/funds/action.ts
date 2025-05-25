"use server";
import { getCheckingAccount } from "@/api/account";
import { depositMoney, withdrawMoney } from "@/api/transaction";
import { DepositOrWithdrawRequest } from "@/types/transaction";

export async function getCheckingAccountByCustomerId() {
  try {
    const response = await getCheckingAccount();
    return response;
  } catch (error) {
    console.error("Error getting checking account:", error);
    return null;
  }
}

export async function depositMoneyForCustomer(
  depositData: DepositOrWithdrawRequest
) {
  try {
    const response = await depositMoney(depositData);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error depositing money:", error);
    return {
      success: false,
      error: "Failed to deposit money. Please try again.",
    };
  }
}

export async function withdrawMoneyForCustomer(
  withdrawData: DepositOrWithdrawRequest
) {
  try {
    const response = await withdrawMoney(withdrawData);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error withdrawing money:", error);
    return {
      success: false,
      error: "Failed to withdraw money. Please try again.",
    };
  }
}
