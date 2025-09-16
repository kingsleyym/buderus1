// ===================================
// BUDERUS SYSTEME - FIREBASE FUNCTIONS
// Professional Newsletter & Admin System v2.0
// ===================================

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export Newsletter Functions (PUBLIC - kein Auth required)
export * from './newsletter/newsletter-functions';

// Export Email Service utilities
export * from './email/email-service';

// Export Template Functions (wird später für Admin erweitert)  
export { getTemplate } from './templates/template-functions';

// Health Check Function
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: [
      'newsletter-subscription',
      'newsletter-confirmation', 
      'newsletter-unsubscribe',
      'email-service',
      'template-system'
    ]
  });
});
