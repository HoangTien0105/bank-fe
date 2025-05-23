export type PaginationRequest = {
  offset?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | 'ASC' | 'DESC';
};