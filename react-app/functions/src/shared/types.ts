// ===================================
// SHARED TYPES FOR NEWSLETTER SYSTEM
// ===================================

// Subscriber Interface
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
  subscriptionId: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
  source: 'website' | 'manual' | 'import' | 'api';
  ipAddress: string;
  userAgent: string;
  language: string;
  tags: string[];
  customFields: { [key: string]: any };
  lastActivityAt?: Date;
  engagementScore: number;
  unsubscribedAt?: Date;
}

// SubscriberData für Firestore (mit any für Timestamps)
export interface SubscriberData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  subscriptionId: string;
  confirmationToken?: string | null;
  confirmed: boolean;
  marketingConsent: boolean;
  privacyConsent: boolean;
  createdAt: any; // FirebaseFieldValue
  confirmedAt?: any; // FirebaseFieldValue
  source: string;
  ipAddress: string;
  userAgent: string;
  language: string;
}

// Newsletter Subscription Request
export interface NewsletterSubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  privacy: boolean;
  marketing?: boolean;
  userAgent?: string;
  language?: string;
}

// Consent Record für DSGVO
export interface ConsentRecord {
  email: string;
  subscriptionId: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  consentType: 'subscription' | 'manual' | 'import';
  source: string;
}

// Newsletter Interface
export interface Newsletter {
  id: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  templateId?: string;
  recipientCount: number;
  sentAt?: Date;
  sentBy: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
  campaignId?: string;
  segmentFilters?: SegmentFilter[];
  trackingEnabled: boolean;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
}

// Campaign Interface
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'newsletter' | 'drip' | 'trigger' | 'ab-test';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Campaign Configuration
  triggerConfig?: TriggerConfig;
  segmentFilters?: SegmentFilter[];
  
  // Steps for multi-step campaigns
  steps: CampaignStep[];
  
  // Analytics
  analytics: CampaignAnalytics;
}

export interface CampaignStep {
  id: string;
  name: string;
  type: 'email' | 'wait' | 'condition';
  order: number;
  
  // Email Step Configuration
  emailConfig?: {
    templateId?: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    fromName: string;
    fromEmail: string;
  };
  
  // Wait Step Configuration
  waitConfig?: {
    duration: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
  
  // Condition Step Configuration
  conditionConfig?: {
    type: 'opened' | 'clicked' | 'not_opened' | 'not_clicked' | 'tag' | 'custom';
    value?: string;
    trueBranch: string; // Next step ID
    falseBranch: string; // Next step ID
  };
}

export interface TriggerConfig {
  type: 'subscriber_added' | 'tag_added' | 'custom_event' | 'date' | 'behavior';
  conditions: TriggerCondition[];
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

// Template Interface
export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'signature' | 'newsletter' | 'campaign' | 'transactional';
  htmlContent: string;
  textContent?: string;
  thumbnailUrl?: string;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Template Variables
  variables: TemplateVariable[];
  
  // Template Sections (for signature templates)
  sections?: TemplateSection[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'image' | 'link' | 'boolean';
  defaultValue?: any;
  required: boolean;
  description?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'content' | 'footer' | 'banner' | 'button';
  editable: boolean;
  defaultContent?: string;
}

// Tracking Interfaces
export interface TrackingEvent {
  id: string;
  type: 'open' | 'click' | 'bounce' | 'spam' | 'unsubscribe';
  newsletterId: string;
  subscriberId: string;
  campaignId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  
  // Click-specific data
  clickedUrl?: string;
  linkId?: string;
  
  // Open-specific data
  pixelId?: string;
  
  // Bounce-specific data
  bounceType?: 'hard' | 'soft';
  bounceReason?: string;
}

export interface TrackingPixel {
  id: string;
  newsletterId: string;
  subscriberId: string;
  createdAt: Date;
}

export interface TrackingLink {
  id: string;
  originalUrl: string;
  trackingUrl: string;
  newsletterId: string;
  clickCount: number;
  createdAt: Date;
}

// Analytics Interfaces
export interface CampaignAnalytics {
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  spamCount: number;
  
  // Calculated rates
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  
  // Time-based analytics
  lastCalculatedAt: Date;
  
  // Step-specific analytics for campaigns
  stepAnalytics?: { [stepId: string]: StepAnalytics };
}

export interface StepAnalytics {
  stepId: string;
  enteredCount: number;
  completedCount: number;
  conversionRate: number;
  avgTimeInStep: number; // in minutes
}

// Segmentation
export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  subscriberCount: number;
  lastCalculatedAt: Date;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

// SMTP Configuration
export interface SMTPConfig {
  id: string;
  name: string;
  provider: 'hetzner' | 'jonas' | 'sendgrid' | 'mailgun' | 'custom';
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Constants
export const NEWSLETTER_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled', 
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed'
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export const TRACKING_EVENTS = {
  OPEN: 'open',
  CLICK: 'click',
  BOUNCE: 'bounce',
  SPAM: 'spam',
  UNSUBSCRIBE: 'unsubscribe'
} as const;

export const SUBSCRIBER_SOURCES = {
  WEBSITE: 'website',
  MANUAL: 'manual',
  IMPORT: 'import',
  API: 'api'
} as const;
