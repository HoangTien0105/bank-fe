"use server";
import {
  calculateInterestRate,
  createSavingAccountApi,
  getCheckingAccount,
  getSavingTermsApi,
} from "@/api/account";
import { searchCustomer } from "@/api/customer";
import { depositMoney, transferMoney, withdrawMoney } from "@/api/transaction";
import { CreateSavingAccountRequest } from "@/types/accounts";
import { DepositOrWithdrawRequest, TransferRequest } from "@/types/transaction";

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

export async function getSavingTerm() {
  try {
    const response = await getSavingTermsApi();
    return response;
  } catch (error) {
    console.error("Error getting saving terms:", error);
    return [];
  }
}

export async function calculateExpectedInterest(params: {
  principal: number;
  months: number;
  annualRate: number;
  monthlyDeposit: number;
}) {
  try {
    const response = await calculateInterestRate(params);

    return response.response;
  } catch (error) {
    console.error("Error calculating interest:", error);
    return {
      success: false,
      error: "Failed to calculate interest. Please try again.",
    };
  }
}

export async function createSavingAccountAction(
  data: CreateSavingAccountRequest
) {
  try {
    const response = await createSavingAccountApi(data);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error creating saving account:", error);
    return {
      success: false,
      error: "Failed to create saving account. Please try again.",
    };
  }
}
