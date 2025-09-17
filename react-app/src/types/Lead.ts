// Shared Lead Types und Interfaces für das gesamte CRM-System

export interface LeadSource {
  type: 'salesperson' | 'purchased' | 'company-owned' | 'advertising' | 'registration' | 'affiliate';
  sourceId?: string; // ID des Verkäufers/Affiliates
  sourceName?: string; // Name der Quelle
  cost?: number; // Kosten für den Lead (bei gekauften Leads)
  affiliateCode?: string; // Affiliate Code
  campaignId?: string; // Kampagnen-ID
}

export interface Commission {
  salespersonId?: string; // Zugewiesener Verkäufer
  salespersonRate?: number; // Verkäufer-Provision in %
  affiliateId?: string; // Affiliate Partner
  affiliateRate?: number; // Affiliate-Provision in %
  leadCost?: number; // Lead-Kosten
  totalCommissionDue?: number; // Gesamte geschuldete Provision
  commissionPaid?: boolean; // Provision bereits ausgezahlt
  paymentDate?: Date; // Auszahlungsdatum
}

export interface LeadHistoryEntry {
  id: string;
  timestamp: Date;
  action: 'created' | 'contacted' | 'email_sent' | 'meeting_scheduled' | 'proposal_sent' | 
          'contract_signed' | 'payment_received' | 'follow_up' | 'not_reachable' | 
          'referral_sent' | 'complaint' | 'cancelled' | 'status_changed' | 'note_added' |
          'installation_scheduled' | 'negotiation_started' | 'discount_applied';
  description: string;
  performedBy: string; // Mitarbeiter ID
  previousStatus?: string;
  newStatus?: string;
  details?: {
    emailId?: string;
    appointmentId?: string;
    proposalId?: string;
    invoiceId?: string;
    referralCode?: string;
    [key: string]: any;
  };
}

export interface LeadProduct {
  id: string;
  name: string;
  category: 'heat_pump' | 'solar' | 'heating_system' | 'maintenance' | 'consultation';
  type?: string; // z.B. "Luft-Wasser", "Sole-Wasser"
  estimatedValue: number;
  finalValue?: number;
  specifications?: {
    heatingArea?: number;
    propertyType?: string;
    installationType?: string;
    efficiency?: string;
    warranty?: string;
    [key: string]: any;
  };
}

export interface LeadStatus {
  current: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 
           'contract_signed' | 'installation_scheduled' | 'completed' | 'closed_won' | 
           'closed_lost' | 'not_reachable' | 'follow_up_later' | 'referral_sent';
  lastChanged: Date;
  changedBy: string;
  reason?: string; // Grund für Status-Änderung
}

export interface Lead {
  id: string;
  
  // Basis-Informationen
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city: string;
    postalCode?: string;
    state?: string;
    country?: string;
  };
  
  // Quelle und Provision
  source: LeadSource;
  commission: Commission;
  
  // Status und Priorität
  status: LeadStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Produkte und Werte
  products: LeadProduct[];
  totalEstimatedValue: number;
  totalFinalValue?: number;
  
  // Zeitstempel
  createdAt: Date;
  updatedAt: Date;
  lastContact: Date | null;
  nextFollowUp?: Date;
  conversionDate?: Date;
  
  // Historie und Notizen
  history: LeadHistoryEntry[];
  notes: string[];
  tags: string[];
  
  // Tracking und Analytics
  campaignId?: string;
  referralSource?: string;
  customerLifetimeValue?: number;
  
  // Beziehungen zu anderen Modulen
  appointments: string[]; // IDs von Terminen
  proposals: string[]; // IDs von Angeboten
  invoices: string[]; // IDs von Rechnungen
  emails: string[]; // IDs von E-Mails
  
  // Zusätzliche Felder
  customFields?: { [key: string]: any };
}

// Utility Functions
export const getStatusDisplayName = (status: string): string => {
  const statusNames: { [key: string]: string } = {
    'new': 'Neu',
    'contacted': 'Kontaktiert',
    'qualified': 'Qualifiziert',
    'proposal_sent': 'Angebot versendet',
    'negotiation': 'Verhandlung',
    'contract_signed': 'Vertrag unterschrieben',
    'installation_scheduled': 'Installation geplant',
    'completed': 'Abgeschlossen',
    'closed_won': 'Gewonnen',
    'closed_lost': 'Verloren',
    'not_reachable': 'Nicht erreichbar',
    'follow_up_later': 'Nachfassen später',
    'referral_sent': 'Empfehlung versendet'
  };
  return statusNames[status] || status;
};

export const getSourceDisplayName = (source: LeadSource): string => {
  const sourceTypes: { [key: string]: string } = {
    'salesperson': 'Verkäufer',
    'purchased': 'Gekauft',
    'company-owned': 'Firmeneigen',
    'advertising': 'Werbung',
    'registration': 'Anmeldung',
    'affiliate': 'Affiliate'
  };
  
  const type = sourceTypes[source.type] || source.type;
  const name = source.sourceName ? ` (${source.sourceName})` : '';
  return `${type}${name}`;
};

export const calculateCommission = (lead: Lead): { 
  salesCommission: number; 
  affiliateCommission: number; 
  totalCommission: number;
  netRevenue: number;
} => {
  const value = lead.totalFinalValue || lead.totalEstimatedValue;
  const leadCost = lead.commission.leadCost || 0;
  
  const salesCommission = lead.commission.salespersonRate 
    ? (value * lead.commission.salespersonRate) / 100 
    : 0;
    
  const affiliateCommission = lead.commission.affiliateRate 
    ? (value * lead.commission.affiliateRate) / 100 
    : 0;
    
  const totalCommission = salesCommission + affiliateCommission;
  const netRevenue = value - totalCommission - leadCost;
  
  return {
    salesCommission,
    affiliateCommission,
    totalCommission,
    netRevenue
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const addLeadHistoryEntry = (
  lead: Lead, 
  action: LeadHistoryEntry['action'], 
  description: string,
  performedBy: string,
  details?: LeadHistoryEntry['details']
): Lead => {
  const historyEntry: LeadHistoryEntry = {
    id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    action,
    description,
    performedBy,
    details
  };
  
  if (action === 'status_changed') {
    historyEntry.previousStatus = lead.status.current;
  }
  
  return {
    ...lead,
    history: [...lead.history, historyEntry],
    updatedAt: new Date()
  };
};
