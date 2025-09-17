// Vereinfachte Partner Types
export interface Partner {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'service';
  logo?: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  contracts: PartnerContract[];
  contactHistory: PartnerContactEntry[];
  productIds: string[]; // Zugeordnete Produkte
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}

export interface PartnerContactEntry {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'contract' | 'complaint' | 'note';
  subject: string;
  description: string;
  contactPerson: string;
  date: Date;
  outcome?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PartnerContract {
  id: string;
  type: 'distribution' | 'exclusive' | 'service' | 'warranty';
  startDate: Date;
  endDate: Date;
  terms: string;
  discountLevel: number;
  minimumOrder?: number;
  isActive: boolean;
}
