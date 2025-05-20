export type PaginationRequest = {
  offset?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};