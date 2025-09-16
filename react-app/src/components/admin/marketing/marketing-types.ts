// ===================================
// MARKETING SYSTEM TYPES
// Based on Firebase Collections
// ===================================

// Subscriber Interface (from subscriber collection)
export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  confirmed: boolean;
  confirmedAt?: Date;
  createdAt: Date;
  confirmationToken?: string | null;
  ipAddress: string;
  language: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
  source: string;
  subscriptionId: string;
  userAgent: string;
}

// Newsletter Interface (from newsletter collection)
export interface Newsletter {
  id: string;
  subject: string;
  content: string;
  recipientCount: number;
  sentAt?: Date;
  sentBy: string;
  status: 'draft' | 'sent' | 'scheduled' | 'sending';
  createdAt?: Date;
  scheduledFor?: Date;
}

// Consent Interface (from consent collection)
export interface Consent {
  id: string;
  consentId: string;
  email: string;
  ipAddress: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
  subscriptionId: string;
  timestamp: Date;
  userAgent: string;
}

// Campaign Interface (planned)
export interface Campaign {
  id: string;
  name: string;
  type: 'newsletter' | 'email-sequence' | 'automated';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: {
    segmentType: 'all' | 'confirmed' | 'new' | 'custom';
    customFilters?: CampaignFilter[];
  };
  content: {
    subject: string;
    body: string;
    template?: string;
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    sendDate?: Date;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
    };
  };
  analytics: {
    sentCount: number;
    openedCount: number;
    clickedCount: number;
    bouncedCount: number;
    unsubscribedCount: number;
  };
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

// Campaign Filter for targeting
export interface CampaignFilter {
  field: 'email' | 'firstName' | 'lastName' | 'company' | 'source' | 'createdAt';
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'before' | 'after';
  value: string | Date;
}

// Email Template Interface
export interface EmailTemplate {
  id: string;
  name: string;
  type: 'newsletter' | 'welcome' | 'notification' | 'campaign';
  content: string;
  thumbnail?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Reward/Loyalty Interface (from rewards collection)
export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'freebie' | 'points' | 'exclusive';
  value: number;
  conditions: {
    minSubscriptionDays?: number;
    requiresConfirmation?: boolean;
    maxUses?: number;
    validUntil?: Date;
  };
  status: 'active' | 'inactive' | 'expired';
  usageCount: number;
  createdAt: Date;
  createdBy: string;
}

// Newsletter Analytics Interface
export interface NewsletterAnalytics {
  newsletterId: string;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  opens: AnalyticsEvent[];
  clicks: AnalyticsEvent[];
  bounces: AnalyticsEvent[];
  unsubscribes: AnalyticsEvent[];
}

export interface AnalyticsEvent {
  subscriberId: string;
  newsletterId: string;
  eventType: 'open' | 'click' | 'bounce' | 'unsubscribe';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  clickedUrl?: string; // For click events
  pixelId?: string; // For open tracking
}

// E-Mail Tracking Configuration
export interface EmailTrackingConfig {
  trackOpens: boolean;
  trackClicks: boolean;
  trackingDomain: string; // z.B. "track.buderus-systeme.de"
  pixelEndpoint: string; // z.B. "/track/open"
  clickEndpoint: string; // z.B. "/track/click"
}

// SMTP Configuration (flexibel für Server-Wechsel)
export interface SMTPConfig {
  provider: 'jonas' | 'hetzner' | 'custom';
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

// E-Mail mit Tracking-URLs
export interface TrackableEmail {
  id: string;
  subscriberId: string;
  newsletterId: string;
  toEmail: string;
  subject: string;
  htmlContent: string; // Mit Tracking-Pixel und Click-URLs
  textContent: string;
  trackingPixelUrl: string;
  clickTrackingUrls: { [originalUrl: string]: string };
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
}

// Newsletter Editor State
export interface NewsletterEditorState {
  subject: string;
  content: string;
  template: string;
  recipients: {
    type: 'all' | 'confirmed' | 'segment';
    count: number;
    segmentFilters?: CampaignFilter[];
  };
  schedule: {
    type: 'immediate' | 'scheduled';
    sendDate?: Date;
  };
  testEmails: string[];
}

// Marketing Dashboard Stats
export interface MarketingStats {
  totalSubscribers: number;
  confirmedSubscribers: number;
  pendingSubscribers: number;
  unsubscribedToday: number;
  newSubscribersToday: number;
  newSubscribersThisWeek: number;
  newSubscribersThisMonth: number;
  averageOpenRate: number;
  averageClickRate: number;
  lastNewsletterSent?: Date;
  nextScheduledNewsletter?: Date;
}

// Form States
export interface SubscriberFormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
}

export interface CampaignFormData {
  name: string;
  type: Campaign['type'];
  targetAudience: Campaign['targetAudience'];
  content: Campaign['content'];
  schedule: Campaign['schedule'];
}

// API Response Types
export interface SubscriberResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsletterResponse {
  newsletters: Newsletter[];
  total: number;
  page: number;
  limit: number;
}

// Filter and Search Types
export interface SubscriberFilters {
  status: 'all' | 'confirmed' | 'pending' | 'unsubscribed';
  source: 'all' | 'website' | 'manual' | 'import';
  dateRange: {
    start?: Date;
    end?: Date;
  };
  search: string;
}

// Constants
export const NEWSLETTER_TEMPLATES = {
  BASIC: 'basic',
  MODERN: 'modern',
  CORPORATE: 'corporate',
  MINIMAL: 'minimal'
} as const;

export const CAMPAIGN_TYPES = {
  NEWSLETTER: 'newsletter',
  EMAIL_SEQUENCE: 'email-sequence',
  AUTOMATED: 'automated'
} as const;

export const SUBSCRIBER_SOURCES = {
  WEBSITE: 'website',
  MANUAL: 'manual',
  IMPORT: 'import',
  API: 'api'
} as const;
