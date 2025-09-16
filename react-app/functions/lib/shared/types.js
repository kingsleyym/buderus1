"use strict";
// ===================================
// SHARED TYPES FOR NEWSLETTER SYSTEM
// ===================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIBER_SOURCES = exports.TRACKING_EVENTS = exports.CAMPAIGN_STATUS = exports.NEWSLETTER_STATUS = void 0;
// Constants
exports.NEWSLETTER_STATUS = {
    DRAFT: 'draft',
    SCHEDULED: 'scheduled',
    SENDING: 'sending',
    SENT: 'sent',
    FAILED: 'failed'
};
exports.CAMPAIGN_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
};
exports.TRACKING_EVENTS = {
    OPEN: 'open',
    CLICK: 'click',
    BOUNCE: 'bounce',
    SPAM: 'spam',
    UNSUBSCRIBE: 'unsubscribe'
};
exports.SUBSCRIBER_SOURCES = {
    WEBSITE: 'website',
    MANUAL: 'manual',
    IMPORT: 'import',
    API: 'api'
};
//# sourceMappingURL=types.js.map