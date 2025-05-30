export type PaginationRequest = {
  offset?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  type?: string;
  balanceType?: string;
  accountType?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc" | "ASC" | "DESC";
};
