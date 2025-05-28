"use server";

import { exportAdminStatsExcel, getAdminStatsRange, getTotalStatsApi } from "@/api/adminStats";
import { AdminStatsData, AdminTotalStats } from "@/types/adminStats";
import { ApiResponse } from "../login/_types/auth";

export async function getAdminStatsAction(
  startDate: string,
  endDate: string
): Promise<ApiResponse<AdminStatsData[]>> {
  const result = await getAdminStatsRange(startDate, endDate);
  if (!result) {
    return {
      message: "Failed to fetch admin stats",
      statusCode: 404,
      success: false,
      response: [],
    };
  }
  return result;
}

export async function getTotalStats(): Promise<ApiResponse<AdminTotalStats>> {
  const result = await getTotalStatsApi();
  if (!result) {
    return {
      message: "Failed to fetch admin stats",
      statusCode: 404,
      success: false,
    };
  }
  return result;
}

export async function exportAdminStatsAction(
  startDate: string,
  endDate: string
): Promise<{ success: boolean; data?: Blob; message?: string }> {
  try {
    const result = await exportAdminStatsExcel(startDate, endDate);
    
    if (!result) {
      return {
        success: false,
        message: "Failed to export admin stats to Excel",
      };
    }
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in exportAdminStatsAction:", error);
    return {
      success: false,
      message: "An error occurred while exporting data",
    };
  }
}