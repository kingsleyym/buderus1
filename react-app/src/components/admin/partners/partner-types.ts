// Manufacturer/Partner Management System
import { Manufacturer } from '../../../types/Product';

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  partnershipLevel: 'premium' | 'standard' | 'basic';
  contactInfo: {
    email: string;
    phone: string;
    representative?: string;
  };
  discountRates: {
    standard: number; // Prozent
    volume: number;   // Ab bestimmter Menge
    seasonal?: number; // Saisonale Rabatte
  };
  establishedYear: number;
  employees: number;
  annualRevenue?: number;
  certifications: string[];
  regions: string[];
  specialties: string[];
  contactHistory: PartnerContactEntry[];
  performance: PartnerPerformance;
  contracts: PartnerContract[];
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerContactEntry {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'contract' | 'complaint';
  subject: string;
  description: string;
  contactPerson: string;
  date: Date;
  outcome?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PartnerPerformance {
  orderVolume: {
    lastMonth: number;
    lastQuarter: number;
    lastYear: number;
  };
  paymentTerms: {
    averageDays: number;
    overdueCount: number;
  };
  qualityRating: number; // 1-5
  responseTime: number; // hours
  supportTickets: {
    open: number;
    resolved: number;
    avgResolutionTime: number;
  };
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
