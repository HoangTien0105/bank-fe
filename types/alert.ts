export interface Alert {
  id: string;
  transaction: string;
  alertType: string;
  description: string;
  status: string;
  createDate: string;
  processedDate: string | null;
  processedBy: string | null;
  resolutionNotes: string | null;
}

export interface UpdateAlertStatusRequest {
  status: string;
  notes: string;
}

export interface AlertsResponse {
  offset: number;
  limit: number;
  results: Alert[];
  totalRows: number;
  totalPages: number;
}