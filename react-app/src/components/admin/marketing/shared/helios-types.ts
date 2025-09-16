// Shared Types für das Helios Energy Marketing System

export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  confirmed: boolean;
  createdAt: Date;
  confirmedAt?: Date | null;
  source: 'website' | 'manual' | 'import' | 'api';
  tags: string[];
  lastActivity?: Date | null;
}

export interface SubscriberStats {
  total: number;
  confirmed: number;
  unconfirmed: number;
  thisMonth: number;
  website: number;
  manual: number;
  import: number;
}

export interface Newsletter {
  id: string;
  subject: string;
  content: string; // Bereits mit personalisierten Daten ausgefüllt
  templateId?: string; // Referenz zum verwendeten Template
  status: 'draft' | 'sent' | 'scheduled';
  recipientCount: number;
  sentAt?: Date;
  scheduledAt?: Date;
  sentToSubscribers: string[]; // IDs der Subscriber, die den Newsletter erhalten haben
  openTracking: boolean;
  clickTracking: boolean;
  createdAt: Date;
  updatedAt: Date;
  analytics: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

// Marketing Newsletter Template (für bearbeitbare Marketing-Inhalte)
export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: 'welcome' | 'newsletter' | 'promotion' | 'promotional' | 'announcement' | 'marketing' | 'custom';
  variables: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// System Templates (automatisch versendet, nicht editierbar)
export interface SystemTemplate {
  id: 'welcome' | 'confirmation';
  name: string;
  content: string;
  variables: string[];
  // Diese werden automatisch versendet und sind nicht in der Newsletter-Template-Liste
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'newsletter' | 'automation' | 'follow-up';
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  targetAudience: string[];
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

export interface MarketingStats {
  totalSubscribers: number;
  confirmedSubscribers: number;
  pendingSubscribers: number;
  unsubscribedToday: number;
  newSubscribersToday: number;
  newSubscribersThisWeek: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'subscribe' | 'unsubscribe' | 'newsletter_sent' | 'campaign_created';
  description: string;
  timestamp: Date;
  details?: any;
}

// Helios Energy Firmen-Daten für automatische Personalisierung
export interface CompanyData {
  name: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  brandColor: string;
}

export const HELIOS_COMPANY_DATA: CompanyData = {
  name: 'Helios Energy',
  tagline: 'Nachhaltige Energielösungen für die Zukunft',
  address: 'Sonnenstraße 123',
  city: '80331 München',
  country: 'Deutschland',
  phone: '+49 89 123456789',
  email: 'info@helios-energy.de',
  website: 'https://helios-energy.de',
  logo: '/assets/helios-energy-logo.png',
  brandColor: '#FF6B35' // Helios Orange
};
