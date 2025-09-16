// Shared Types für das Marketing System

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
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  recipientCount: number;
  sentAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  thumbnail?: string;
  category: 'welcome' | 'promotional' | 'newsletter' | 'maintenance' | 'custom';
  createdAt: Date;
  updatedAt: Date;
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

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  recipientCount: number;
  sentAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  thumbnail?: string;
  category: 'welcome' | 'promotional' | 'newsletter' | 'maintenance' | 'custom';
  createdAt: Date;
  updatedAt: Date;
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


export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html_content: string;
  variables: string[];
  category: 'newsletter' | 'confirmation' | 'welcome' | 'promo';
  created_at: Date;
  updated_at: Date;
}

export type FilterStatus = 'all' | 'confirmed' | 'unconfirmed';
export type FilterSource = 'all' | 'website' | 'manual' | 'import';
