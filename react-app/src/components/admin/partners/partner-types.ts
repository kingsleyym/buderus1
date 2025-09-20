// Temporäre Partner Types für Mock-Daten
export interface Partner {
  id: string;
  name: string;
  logo?: string;
  partnershipLevel: 'basic' | 'standard' | 'premium' | 'exclusive';
  contactInfo: {
    email: string;
    phone: string;
    representative: string;
  };
  discountRates: {
    standard: number;
    volume: number;
    seasonal: number;
  };
  establishedYear?: number;
  employees?: number;
  annualRevenue?: number;
  certifications?: string[];
  regions?: string[];
  specialties?: string[];
  contactHistory?: any[];
  performance?: any;
  contracts?: any[];
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
