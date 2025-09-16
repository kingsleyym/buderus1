// ===================================
// PUBLIC NEWSLETTER FUNCTIONS
// Für öffentliche Newsletter-Anmeldung
// ===================================

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { EmailService } from '../email/email-service';
import { 
  SubscriberData, 
  ConsentRecord 
} from '../shared/types';

const db = admin.firestore();
const emailService = new EmailService();

/**
 * E-Mail-Validierung (tolerant aber sicher)
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Grundlegende Checks
  if (trimmedEmail.length === 0) return false;
  if (!trimmedEmail.includes('@')) return false;

  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;

  // Lokaler Teil darf nicht leer sein
  if (localPart.length === 0) return false;

  // Domain muss einen Punkt enthalten und mindestens 3 Zeichen haben
  if (!domain.includes('.') || domain.length < 3) return false;

  // Erweiterte Regex für gültige E-Mail-Formate
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmedEmail);
}

/**
 * Subscription ID generieren
 */
function generateSubscriptionId(): string {
  return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Confirmation Token generieren
 */
function generateConfirmationToken(): string {
  return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

/**
 * DSGVO Consent Record erstellen
 */
async function createConsentRecord(email: string, data: any): Promise<void> {
  try {
    const consentRecord: ConsentRecord = {
      email,
      subscriptionId: data.subscriptionId,
      privacyConsent: data.privacyConsent,
      marketingConsent: data.marketingConsent,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      timestamp: data.timestamp,
      consentType: 'subscription',
      source: data.source || 'website'
    };

    await db.collection('consents').add(consentRecord);
  } catch (error) {
    console.error('Fehler beim Erstellen des Consent Records:', error);
    throw error;
  }
}

/**
 * Analytics Event loggen
 */
async function logAnalyticsEvent(eventName: string, data: any): Promise<void> {
  try {
    await db.collection('analytics').add({
      event: eventName,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics Fehler:', error);
    // Analytics Fehler sollen den Hauptprozess nicht stoppen
  }
}

// ===================================
// PUBLIC FUNCTIONS - KEINE AUTH REQUIRED!
// ===================================

/**
 * Newsletter Anmeldung - Double Opt-In
 * PUBLIC FUNCTION - Jeder kann sich anmelden!
 */
export const subscribeNewsletter = functions.https.onCall(async (data, context) => {
  try {
    console.log('Newsletter Anmeldung gestartet');
    console.log('Empfangene Daten:', JSON.stringify(data, null, 2));

    // Firebase Functions v2 Compatibility
    const actualData = data.data || data;
    const { email, firstName, lastName, company, privacy, marketing } = actualData;

    // Input Validation
    if (!email || !isValidEmail(email)) {
      console.log('E-Mail-Validierung fehlgeschlagen für:', email);
      throw new functions.https.HttpsError('invalid-argument', 'Gültige E-Mail-Adresse erforderlich');
    }

    if (!privacy) {
      throw new functions.https.HttpsError('invalid-argument', 'Datenschutzerklärung muss akzeptiert werden');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prüfe ob E-Mail bereits existiert
    const existingSubscriber = await db.collection('subscribers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existingSubscriber.empty) {
      const existing = existingSubscriber.docs[0].data();
      if (existing.confirmed) {
        throw new functions.https.HttpsError('already-exists', 'Diese E-Mail ist bereits für den Newsletter angemeldet');
      } else {
        // Unbestätigte Anmeldung - sende erneut Bestätigungs-E-Mail
        await emailService.sendConfirmationEmail(normalizedEmail, existing.confirmationToken, {
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName
        });

        return {
          success: true,
          message: 'Bestätigungs-E-Mail erneut gesendet',
          subscriptionId: existing.subscriptionId
        };
      }
    }

    // Neue Anmeldung erstellen
    const subscriptionId = generateSubscriptionId();
    const confirmationToken = generateConfirmationToken();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Client IP für DSGVO Nachweis
    const clientIP = context.rawRequest ?
      (context.rawRequest.headers['x-forwarded-for'] ||
      context.rawRequest.connection.remoteAddress) as string :
      'unknown';

    const subscriberData: SubscriberData = {
      email: normalizedEmail,
      firstName: firstName || '',
      lastName: lastName || '',
      company: company || '',
      subscriptionId,
      confirmationToken,
      confirmed: false,
      marketingConsent: marketing || false,
      privacyConsent: true,
      createdAt: timestamp,
      confirmedAt: null,
      source: 'website',
      ipAddress: clientIP,
      userAgent: data.userAgent || '',
      language: data.language || 'de'
    };

    // Subscriber speichern
    console.log('Speichere Subscriber in Firestore:', normalizedEmail);
    await db.collection('subscribers').doc(subscriptionId).set(subscriberData);

    // DSGVO Consent Record
    await createConsentRecord(normalizedEmail, {
      subscriptionId,
      privacyConsent: true,
      marketingConsent: marketing || false,
      ipAddress: clientIP,
      userAgent: data.userAgent || '',
      timestamp: new Date().toISOString(),
      source: 'website'
    });

    // Bestätigungs-E-Mail senden
    await emailService.sendConfirmationEmail(normalizedEmail, confirmationToken, {
      firstName: firstName || '',
      lastName: lastName || ''
    });

    // Analytics Event
    await logAnalyticsEvent('newsletter_subscription_started', {
      email_domain: normalizedEmail.split('@')[1],
      marketing_consent: marketing || false,
      has_name: !!(firstName || lastName),
      has_company: !!company
    });

    console.log('Newsletter Anmeldung erfolgreich abgeschlossen für:', normalizedEmail);
    return {
      success: true,
      message: 'Bestätigungs-E-Mail gesendet',
      subscriptionId
    };

  } catch (error) {
    console.error('Newsletter Anmeldung Fehler:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Newsletter Anmeldung fehlgeschlagen');
  }
});

/**
 * Newsletter Bestätigung - E-Mail bestätigen
 * PUBLIC FUNCTION - Über Link in E-Mail aufrufbar!
 */
export const confirmNewsletter = functions.https.onCall(async (data, context) => {
  try {
    const { token } = data;

    if (!token) {
      throw new functions.https.HttpsError('invalid-argument', 'Bestätigungstoken erforderlich');
    }

    // Subscriber mit diesem Token finden
    const subscriberQuery = await db.collection('subscribers')
      .where('confirmationToken', '==', token)
      .where('confirmed', '==', false)
      .limit(1)
      .get();

    if (subscriberQuery.empty) {
      throw new functions.https.HttpsError('not-found', 'Ungültiger oder bereits verwendeter Bestätigungstoken');
    }

    const subscriberDoc = subscriberQuery.docs[0];
    const subscriberData = subscriberDoc.data();

    // Subscriber als bestätigt markieren
    await subscriberDoc.ref.update({
      confirmed: true,
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmationToken: null // Token nach Verwendung löschen
    });

    // Willkommens-E-Mail senden
    await emailService.sendWelcomeEmail(subscriberData.email, {
      firstName: subscriberData.firstName,
      lastName: subscriberData.lastName
    });

    // Analytics Event
    await logAnalyticsEvent('newsletter_subscription_confirmed', {
      subscriptionId: subscriberData.subscriptionId,
      email_domain: subscriberData.email.split('@')[1]
    });

    console.log('Newsletter Bestätigung erfolgreich für:', subscriberData.email);
    return {
      success: true,
      message: 'Newsletter-Anmeldung erfolgreich bestätigt',
      email: subscriberData.email
    };

  } catch (error) {
    console.error('Newsletter Bestätigung Fehler:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Newsletter Bestätigung fehlgeschlagen');
  }
});

/**
 * Newsletter Abmeldung
 * PUBLIC FUNCTION - Über Link in E-Mail aufrufbar!
 */
export const unsubscribeNewsletter = functions.https.onCall(async (data, context) => {
  try {
    const { email, subscriptionId } = data;

    if (!email && !subscriptionId) {
      throw new functions.https.HttpsError('invalid-argument', 'E-Mail oder Abonnement-ID erforderlich');
    }

    let subscriberQuery;
    
    if (subscriptionId) {
      subscriberQuery = await db.collection('subscribers').doc(subscriptionId).get();
    } else {
      const normalizedEmail = email.toLowerCase().trim();
      const querySnapshot = await db.collection('subscribers')
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) {
        throw new functions.https.HttpsError('not-found', 'E-Mail nicht im Newsletter-System gefunden');
      }
      
      subscriberQuery = querySnapshot.docs[0];
    }

    if (!subscriberQuery.exists) {
      throw new functions.https.HttpsError('not-found', 'Abonnement nicht gefunden');
    }

    const subscriberData = subscriberQuery.data();

    // Subscriber löschen (DSGVO konform)
    await subscriberQuery.ref.delete();

    // Unsubscribe Event für Analytics
    await logAnalyticsEvent('newsletter_unsubscribed', {
      subscriptionId: subscriberData?.subscriptionId,
      email_domain: subscriberData?.email?.split('@')[1],
      was_confirmed: subscriberData?.confirmed
    });

    console.log('Newsletter Abmeldung erfolgreich für:', subscriberData?.email);
    return {
      success: true,
      message: 'Newsletter-Abmeldung erfolgreich'
    };

  } catch (error) {
    console.error('Newsletter Abmeldung Fehler:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Newsletter Abmeldung fehlgeschlagen');
  }
});
