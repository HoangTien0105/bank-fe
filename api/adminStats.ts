import { ApiResponse } from "@/app/login/_types/auth";
import axiosInstance from "@/config/axios";
import { AdminStatsData, AdminTotalStats } from "@/types/adminStats";

export const getAdminStatsRange = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<AdminStatsData[]> | null> => {
  try {
    const response = await axiosInstance.get(
      `/admin-stats/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
};

export const getTotalStatsApi =
  async (): Promise<ApiResponse<AdminTotalStats> | null> => {
    try {
      const response = await axiosInstance.get("admin-stats/total");
      return response.data;
    } catch (error) {
      console.error("Error fetching total stats:", error);
      return null;
    }
  };

export const exportAdminStatsExcel = async (
  startDate: string,
  endDate: string
): Promise<Blob | null> => {
  try {
    const response = await axiosInstance.get(
      `/admin-stats/export/daily?startDate=${startDate}&endDate=${endDate}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return blob;
  } catch (error) {
    console.error("Error exporting admin stats to Excel:", error);
    return null;
  }
};
