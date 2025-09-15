const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Firebase Admin initialisieren (nur einmal für alle Functions)
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Team-Functions importieren (GitHub Pages Ersatz)
const teamFunctions = require('./team-functions');

// Team Functions als Top-Level Exports
Object.assign(exports, teamFunctions);

// E-Mail Transporter (wird später konfiguriert)
let transporter = null;

/**
 * Tolerante E-Mail-Validierung
 */
function isValidEmail(email) {
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
 * Newsletter Anmeldung - Double Opt-In
 */
exports.subscribeNewsletter = functions.https.onCall(async (data, context) => {
    try {
        console.log('Empfangene Daten - Typ:', typeof data);
        console.log('Empfangene Daten - Keys:', data ? Object.keys(data) : 'null/undefined');

        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('Tatsächliche Daten - Typ:', typeof actualData);
        console.log('Tatsächliche Daten - Keys:', actualData ? Object.keys(actualData) : 'null/undefined');

        // Sichere Darstellung der Daten ohne zirkuläre Referenzen
        const safeData = {
            email: actualData?.email,
            firstName: actualData?.firstName,
            lastName: actualData?.lastName,
            company: actualData?.company,
            privacy: actualData?.privacy,
            marketing: actualData?.marketing
        };
        console.log('Sichere Daten:', JSON.stringify(safeData, null, 2));

        // Input Validation
        const { email, firstName, lastName, company, privacy, marketing } = actualData;

        console.log('Extrahierte E-Mail:', email);
        console.log('Typ der E-Mail:', typeof email);

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
                await sendConfirmationEmail(normalizedEmail, existing.confirmationToken, {
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
            context.rawRequest.headers['x-forwarded-for'] ||
            context.rawRequest.connection.remoteAddress :
            'unknown';

        const subscriberData = {
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
        try {
            await db.collection('subscribers').doc(subscriptionId).set(subscriberData);
            console.log('Subscriber erfolgreich gespeichert:', subscriptionId);
        } catch (firestoreError) {
            console.error('Firestore Fehler beim Speichern:', firestoreError);
            throw firestoreError;
        }

        // DSGVO Consent Record
        console.log('Erstelle DSGVO Consent Record für:', normalizedEmail);
        try {
            await createConsentRecord(normalizedEmail, {
                subscriptionId,
                privacyConsent: true,
                marketingConsent: marketing || false,
                ipAddress: clientIP,
                userAgent: data.userAgent || '',
                timestamp: new Date().toISOString()
            });
            console.log('DSGVO Consent Record erstellt für:', normalizedEmail);
        } catch (consentError) {
            console.error('Consent Record Fehler:', consentError);
            // Consent Fehler soll Anmeldung nicht stoppen
        }

        // Bestätigungs-E-Mail senden
        console.log('Versuche Bestätigungs-E-Mail zu senden an:', normalizedEmail);
        try {
            await sendConfirmationEmail(normalizedEmail, confirmationToken, {
                firstName: firstName || '',
                lastName: lastName || ''
            });
            console.log('Bestätigungs-E-Mail erfolgreich gesendet an:', normalizedEmail);
        } catch (emailError) {
            console.error('Fehler beim Senden der Bestätigungs-E-Mail:', emailError);
            // E-Mail Fehler soll die Anmeldung nicht komplett stoppen
        }

        // Analytics Event
        try {
            await logAnalyticsEvent('newsletter_subscription_started', {
                email_domain: normalizedEmail.split('@')[1],
                marketing_consent: marketing || false,
                has_name: !!(firstName || lastName),
                has_company: !!company
            });
            console.log('Analytics Event gespeichert für:', normalizedEmail);
        } catch (analyticsError) {
            console.error('Analytics Fehler:', analyticsError);
        }

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

        throw new functions.https.HttpsError('internal', 'Anmeldung fehlgeschlagen');
    }
});

/**
 * Newsletter Bestätigung - Double Opt-In
 */
exports.confirmNewsletter = functions.https.onCall(async (data, context) => {
    try {
        console.log('ConfirmNewsletter aufgerufen - Datentyp:', typeof data);
        console.log('Empfangene Daten:', data);

        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('Tatsächliche Daten:', actualData);

        const { token, email } = actualData;

        console.log('Extrahierter Token:', token);
        console.log('Extrahierte Email:', email);

        if (!token) {
            console.log('Token-Validierung fehlgeschlagen - Token:', token);
            throw new functions.https.HttpsError('invalid-argument', 'Bestätigungstoken erforderlich');
        }

        // Subscriber mit Token finden
        let subscriberQuery = db.collection('subscribers')
            .where('confirmationToken', '==', token)
            .limit(1);

        if (email) {
            subscriberQuery = subscriberQuery.where('email', '==', email.toLowerCase().trim());
        }

        const subscriberDocs = await subscriberQuery.get();

        if (subscriberDocs.empty) {
            throw new functions.https.HttpsError('not-found', 'Ungültiger oder abgelaufener Bestätigungslink');
        }

        const subscriberDoc = subscriberDocs.docs[0];
        const subscriberData = subscriberDoc.data();

        if (subscriberData.confirmed) {
            throw new functions.https.HttpsError('already-exists', 'already confirmed');
        }

        // Bestätigung durchführen
        await subscriberDoc.ref.update({
            confirmed: true,
            confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
            confirmationToken: null // Token invalidieren
        });

        // Welcome E-Mail senden
        await sendWelcomeEmail(subscriberData.email, {
            firstName: subscriberData.firstName,
            lastName: subscriberData.lastName
        });

        // Analytics Event
        await logAnalyticsEvent('newsletter_subscription_confirmed', {
            email_domain: subscriberData.email.split('@')[1],
            days_to_confirm: Math.floor((new Date() - subscriberData.createdAt.toDate()) / (1000 * 60 * 60 * 24))
        });

        return {
            success: true,
            message: 'Newsletter Anmeldung bestätigt'
        };

    } catch (error) {
        console.error('Newsletter Bestätigung Fehler:', error);

        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        throw new functions.https.HttpsError('internal', 'Bestätigung fehlgeschlagen');
    }
});

/**
 * Newsletter Abmeldung
 */
exports.unsubscribeNewsletter = functions.https.onCall(async (data, context) => {
    try {
        console.log('UnsubscribeNewsletter aufgerufen - Datentyp:', typeof data);
        console.log('Empfangene Daten:', data);

        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('Tatsächliche Daten:', actualData);

        const { email, token } = actualData;

        console.log('Extrahierte Email:', email);
        console.log('Extrahierter Token:', token);

        if (!email && !token) {
            console.log('Validierung fehlgeschlagen - Email:', email, 'Token:', token);
            throw new functions.https.HttpsError('invalid-argument', 'E-Mail oder Abmelde-Token erforderlich');
        }

        let subscriberQuery;

        if (token) {
            // Abmeldung via Token
            subscriberQuery = db.collection('subscribers')
                .where('subscriptionId', '==', token)
                .limit(1);
        } else {
            // Abmeldung via E-Mail
            subscriberQuery = db.collection('subscribers')
                .where('email', '==', email.toLowerCase().trim())
                .where('confirmed', '==', true)
                .limit(1);
        }

        const subscriberDocs = await subscriberQuery.get();

        if (subscriberDocs.empty) {
            throw new functions.https.HttpsError('not-found', 'Newsletter Anmeldung nicht gefunden');
        }

        const subscriberDoc = subscriberDocs.docs[0];
        const subscriberData = subscriberDoc.data();

        // Abmeldung durchführen (DSGVO konforme Löschung)
        await subscriberDoc.ref.delete();

        // Consent Record für Abmeldung
        await createConsentRecord(subscriberData.email, {
            subscriptionId: subscriberData.subscriptionId,
            action: 'unsubscribe',
            timestamp: new Date().toISOString(),
            ipAddress: context.rawRequest ?
                context.rawRequest.headers['x-forwarded-for'] ||
                context.rawRequest.connection.remoteAddress :
                'unknown'
        });

        // Analytics Event
        await logAnalyticsEvent('newsletter_unsubscribe', {
            email_domain: subscriberData.email.split('@')[1],
            days_subscribed: subscriberData.confirmedAt ?
                Math.floor((new Date() - subscriberData.confirmedAt.toDate()) / (1000 * 60 * 60 * 24)) : 0
        });

        return {
            success: true,
            message: 'Newsletter Abmeldung erfolgreich'
        };

    } catch (error) {
        console.error('Newsletter Abmeldung Fehler:', error);

        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        throw new functions.https.HttpsError('internal', 'Abmeldung fehlgeschlagen');
    }
});

/**
 * Helper Functions
 */

function generateSubscriptionId() {
    return 'sub_' + Date.now() + '_' + crypto.randomBytes(8).toString('hex');
}

function generateConfirmationToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function createConsentRecord(email, data) {
    const consentId = crypto.createHash('sha256').update(email + Date.now()).digest('hex');

    return db.collection('consent').doc(consentId).set({
        email,
        consentId,
        ...data,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}

async function sendConfirmationEmail(email, token, userData) {
    console.log('SendConfirmationEmail aufgerufen für:', email);
    
    if (!transporter) {
        console.log('Erstelle E-Mail Transporter...');
        // E-Mail Transporter konfigurieren mit IONOS SMTP
        const emailPassword = `Buderus1234!`;
        transporter = nodemailer.createTransport({
            host: 'smtp.ionos.de',
            port: 587,
            secure: false,
            auth: {
                user: 'newsletter@buderus-systeme.de',
                pass: emailPassword
            }
        });
        console.log('E-Mail Transporter erstellt');
    }

    const confirmUrl = `https://helios-energy.web.app/newsletter/confirm.html?token=${token}&email=${encodeURIComponent(email)}`;
    const name = userData.firstName ? ` ${userData.firstName}` : '';
    
    console.log('Bestätigungs-URL erstellt:', confirmUrl);

    const mailOptions = {
        from: '"Buderus Systeme" <newsletter@buderus-systeme.de>',
        to: email,
        subject: 'Newsletter Anmeldung bestätigen - Buderus Systeme',
        html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0;">Buderus Systeme</h1>
          <p style="color: white; margin: 0.5rem 0 0 0;">Think intelligent. Think blue.</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333;">Hallo${name}!</h2>
          
          <p>vielen Dank für Ihr Interesse an unserem Newsletter. Um Ihre Anmeldung abzuschließen, klicken Sie bitte auf den folgenden Link:</p>
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${confirmUrl}" style="background: #007bff; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Newsletter Anmeldung bestätigen
            </a>
          </div>
          
          <p>Falls der Button nicht funktioniert, können Sie auch diesen Link kopieren:</p>
          <p style="word-break: break-all; color: #666; font-size: 0.9rem;">${confirmUrl}</p>
          
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 0.9rem; color: #666;">
            Diese E-Mail wurde gesendet, weil Sie sich für unseren Newsletter angemeldet haben. 
            Falls Sie dies nicht getan haben, können Sie diese E-Mail ignorieren.
          </p>
          
          <p style="font-size: 0.9rem; color: #666;">
            <strong>Buderus Systeme</strong><br>
            [Ihre Adresse]<br>
            [PLZ Ort]<br>
            Deutschland
          </p>
        </div>
      </div>
    `
    };

    console.log('Sende E-Mail mit Optionen:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
    });

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('E-Mail erfolgreich gesendet:', result.messageId);
        return result;
    } catch (error) {
        console.error('E-Mail Versand Fehler:', error);
        throw error;
    }
}

async function sendWelcomeEmail(email, userData) {
    if (!transporter) return; // Transporter Setup erforderlich

    const name = userData.firstName ? ` ${userData.firstName}` : '';
    const unsubscribeUrl = `https://helios-energy.web.app/newsletter/unsubscribe.html?email=${encodeURIComponent(email)}`;

    const mailOptions = {
        from: '"Buderus Systeme" <newsletter@buderus-systeme.de>',
        to: email,
        subject: 'Willkommen beim Buderus Systeme Newsletter!',
        html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0;">Willkommen${name}!</h1>
          <p style="color: white; margin: 0.5rem 0 0 0;">Sie sind jetzt für unseren Newsletter angemeldet</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <p>Vielen Dank für Ihre Bestätigung! Sie erhalten ab sofort unseren Newsletter mit:</p>
          
          <ul style="color: #333; line-height: 1.6;">
            <li>Neueste Produkt-Updates</li>
            <li>Technische Tipps und Tricks</li>
            <li>Exklusive Angebote</li>
            <li>Branchen-Nachrichten</li>
          </ul>
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="https://helios-energy.web.app" style="background: #007bff; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Unsere Website besuchen
            </a>
          </div>
          
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 0.9rem; color: #666;">
            Sie können sich jederzeit <a href="${unsubscribeUrl}">hier abmelden</a>.
          </p>
        </div>
      </div>
    `
    };

    await transporter.sendMail(mailOptions);
}

async function logAnalyticsEvent(eventName, data) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const analyticsRef = db.collection('analytics').doc(today);

        await analyticsRef.set({
            [`events.${eventName}`]: admin.firestore.FieldValue.increment(1),
            [`eventData.${eventName}`]: admin.firestore.FieldValue.arrayUnion({
                timestamp: new Date().toISOString(),
                data
            })
        }, { merge: true });

    } catch (error) {
        console.error('Analytics Logging Fehler:', error);
    }
}

/**
 * ==============================================
 * ADMIN FUNCTIONS INTEGRATION
 * ==============================================
 */

// Admin Functions importieren und exportieren
const adminFunctions = require('./admin-functions');

// Admin Functions exportieren
exports.setupAdmin = adminFunctions.setupAdmin;
exports.getSubscribers = adminFunctions.getSubscribers;
exports.addManualSubscriber = adminFunctions.addManualSubscriber;
exports.sendNewsletter = adminFunctions.sendNewsletter;
exports.sendTestNewsletter = adminFunctions.sendTestNewsletter;
exports.getAnalytics = adminFunctions.getAnalytics;

// QR Code Functions importieren und exportieren
const qrFunctions = require('./qr-functions');
exports.qrRedirect = qrFunctions.qrRedirect;
exports.getQRAnalytics = qrFunctions.getQRAnalytics;
exports.exportQRCodes = qrFunctions.exportQRCodes;

// Employee Functions importieren und exportieren
const employeeFunctions = require('./employee-functions');

// Employee Functions exportieren
exports.registerEmployee = employeeFunctions.registerEmployee;
exports.approveEmployee = employeeFunctions.approveEmployee;
exports.updateEmployeeProfile = employeeFunctions.updateEmployeeProfile;
exports.generateEmployeeQR = employeeFunctions.generateEmployeeQR;
exports.getEmployeeStats = employeeFunctions.getEmployeeStats;
exports.getAllEmployees = employeeFunctions.getAllEmployees;
exports.sendOrderConfirmationEmail = employeeFunctions.sendOrderConfirmationEmail;


