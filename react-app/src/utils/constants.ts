// App Constants und Konfiguration
// Zentrale Definitionen für die gesamte Anwendung

// Routes Definition
export const ROUTES = {
  // Public Routes
  HOME: '/',
  TEAM: '/team',
  EMPLOYEE_PROFILE: '/team/:employeeName',
  NEWSLETTER: '/newsletter',
  NEWSLETTER_CONFIRM: '/newsletter/confirm',
  LEADS: '/leads',
  
  // Employee Routes
  EMPLOYEE_ROOT: '/employee',
  EMPLOYEE_LOGIN: '/employee/login',
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  EMPLOYEE_PROFILE_EDIT: '/employee/profile',
  EMPLOYEE_CARD: '/employee/card',
  
  // Admin Routes
  ADMIN_ROOT: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_QR_CODES: '/admin/qr-codes',
  ADMIN_NEWSLETTER: '/admin/newsletter',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_CAMPAIGNS: '/admin/campaigns',
  ADMIN_SUBSCRIBERS: '/admin/subscribers',
  ADMIN_REWARDS: '/admin/rewards'
} as const;

// User Roles
export enum UserRole {
  PUBLIC = 'public',
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

// Firebase Collections
export const COLLECTIONS = {
  EMPLOYEES: 'employees',
  SUBSCRIBERS: 'subscribers',
  NEWSLETTERS: 'newsletters',
  QR_CODES: 'qr-codes',
  ANALYTICS: 'analytics',
  REWARDS: 'rewards'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ROLE: 'helios_user_role',
  EMPLOYEE_ID: 'helios_employee_id',
  THEME: 'helios_theme',
  LANGUAGE: 'helios_language'
} as const;

// API Endpoints (Firebase Functions)
export const API_ENDPOINTS = {
  // Employee Functions
  REGISTER_EMPLOYEE: 'registerEmployee',
  UPDATE_EMPLOYEE: 'updateEmployee',
  GET_EMPLOYEE: 'getEmployee',
  RENDER_TEAM_LIST: 'renderTeamList',
  RENDER_EMPLOYEE: 'renderEmployee',
  GENERATE_VCARD: 'generateVCard',
  GET_EMPLOYEE_AVATAR: 'getEmployeeAvatar',
  
  // Newsletter Functions
  SUBSCRIBE_NEWSLETTER: 'subscribeNewsletter',
  CONFIRM_SUBSCRIPTION: 'confirmSubscription',
  SEND_NEWSLETTER: 'sendNewsletter',
  GET_SUBSCRIBERS: 'getSubscribers',
  
  // QR Code Functions
  GENERATE_QR: 'generateQR',
  SAVE_QR_CODE: 'saveQRCode',
  GET_QR_CODES: 'getQRCodes',
  
  // Admin Functions
  GET_DASHBOARD_STATS: 'getDashboardStats',
  GET_ANALYTICS: 'getAnalytics',
  MANAGE_REWARDS: 'manageRewards'
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{8,20}$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_COMPANY_LENGTH: 100
} as const;

// UI Constants
export const UI = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1200,
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 70
} as const;

// Toast/Notification Types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Form Field Types
export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  PHONE = 'tel',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE = 'file'
}

// Employee Status
export enum EmployeeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

// Newsletter Status
export enum NewsletterStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  FAILED = 'failed'
}

// QR Code Types
export enum QRCodeType {
  VCARD = 'vcard',
  URL = 'url',
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone'
}

export default {
  ROUTES,
  UserRole,
  COLLECTIONS,
  STORAGE_KEYS,
  API_ENDPOINTS,
  VALIDATION,
  UI,
  ToastType,
  FieldType,
  EmployeeStatus,
  NewsletterStatus,
  QRCodeType
};
