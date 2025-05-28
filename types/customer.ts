export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  citizenId: string;
  phone: string;
  address: string;
  createDate: string;
  customerType: string;
  role: string;
}

export interface CustomerPageProps {
  searchParams?: {
    page?: string;
    keyword?: string;
    location?: string;
    sortBy?: string;
    sortDirection?: string;
  };
}