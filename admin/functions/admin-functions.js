const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Firebase Admin wird bereits in newsletter-core.js initialisiert
const db = admin.firestore();

// E-Mail Transporter 
let transporter = null;

/**
 * ==============================================
 * ADMIN FUNCTIONS - NUR Admin-Dashboard!
 * ==============================================
 * Diese Datei enthält NUR die Admin-Dashboard-Funktionalitäten:
 * - Admin Authentication & Setup
 * - Subscriber Management
 * - Newsletter Versendung (Mass Mailing)
 * - Analytics & Reporting
 * - Manual Email Input (für Losboxen/Physische Anmeldungen)
 * 
 * KEINE Newsletter-Core-Funktionen hier!
 */

/**
 * E-Mail-Validierung (Helper)
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmedEmail);
}

/**
 * ==============================================
 * ADMIN AUTHENTICATION & SETUP
 * ==============================================
 */

/**
 * Admin Setup - Erstellt den ersten Admin-User
 * ACHTUNG: Diese Function sollte nach dem ersten Setup deaktiviert werden!
 */
exports.setupAdmin = functions.https.onCall(async (data, context) => {
  try {
    const { email, setupKey } = data;
    
    // Setup-Schlüssel prüfen (für Sicherheit)
    if (setupKey !== 'BuderusAdmin2025Setup') {
      throw new functions.https.HttpsError('permission-denied', 'Ungültiger Setup-Schlüssel');
    }
    
    if (!email || !isValidEmail(email)) {
      throw new functions.https.HttpsError('invalid-argument', 'Gültige E-Mail erforderlich');
    }
    
    // Prüfen ob bereits Admins existieren
    const existingAdmins = await db.collection('users')
      .where('role', '==', 'admin')
      .limit(1)
      .get();
    
    if (!existingAdmins.empty) {
      throw new functions.https.HttpsError('already-exists', 'Admin bereits vorhanden');
    }
    
    // Temporäres Passwort generieren
    const tempPassword = crypto.randomBytes(8).toString('hex');
    
    // User in Firebase Auth erstellen
    const userRecord = await admin.auth().createUser({
      email: email,
      password: tempPassword,
      emailVerified: true
    });
    
    // Admin-Rolle in Firestore setzen
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      lastLogin: null
    });
    
    // Admin-Benachrichtigung per E-Mail senden
    await sendAdminSetupEmail(email, tempPassword);
    
    return {
      success: true,
      message: 'Admin-Account erstellt',
      email: email,
      tempPassword: tempPassword
    };
    
  } catch (error) {
    console.error('Admin Setup Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Admin Setup fehlgeschlagen');
  }
});

/**
 * ==============================================
 * SUBSCRIBER MANAGEMENT
 * ==============================================
 */

/**
 * Admin: Alle Abonnenten abrufen
 */
exports.getSubscribers = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    if (!context.auth || !await isAdmin(context.auth.uid)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { limit = 100, offset = 0, filter = 'all' } = data;
    
    let query = db.collection('subscribers');
    
    // Filter anwenden
    if (filter === 'confirmed') {
      query = query.where('confirmed', '==', true);
    } else if (filter === 'unconfirmed') {
      query = query.where('confirmed', '==', false);
    }
    
    query = query.orderBy('createdAt', 'desc').limit(limit);
    
    if (offset > 0) {
      query = query.offset(offset);
    }
    
    const snapshot = await query.get();
    const subscribers = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        confirmed: data.confirmed,
        createdAt: data.createdAt?.toDate(),
        confirmedAt: data.confirmedAt?.toDate(),
        source: data.source,
        marketingConsent: data.marketingConsent
      });
    });
    
    return {
      success: true,
      subscribers,
      total: subscribers.length
    };
    
  } catch (error) {
    console.error('Get Subscribers Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Abrufen der Abonnenten');
  }
});

/**
 * Admin: Manuell E-Mail hinzufügen (für Losboxen/Physische Anmeldungen)
 */
exports.addManualSubscriber = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    if (!context.auth || !await isAdmin(context.auth.uid)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { email, firstName, lastName, company, source = 'manual', notes } = data;
    
    if (!email || !isValidEmail(email)) {
      throw new functions.https.HttpsError('invalid-argument', 'Gültige E-Mail-Adresse erforderlich');
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Prüfe ob E-Mail bereits existiert
    const existingSubscriber = await db.collection('subscribers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();
    
    if (!existingSubscriber.empty) {
      throw new functions.https.HttpsError('already-exists', 'Diese E-Mail ist bereits im System');
    }
    
    // Subscriber ID generieren
    const subscriptionId = 'manual_' + Date.now() + '_' + crypto.randomBytes(6).toString('hex');
    
    const subscriberData = {
      email: normalizedEmail,
      firstName: firstName || '',
      lastName: lastName || '',
      company: company || '',
      subscriptionId,
      confirmationToken: null,
      confirmed: true, // Manuelle Einträge sind direkt bestätigt
      marketingConsent: true, // Bei manueller Eingabe wird Consent angenommen
      privacyConsent: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: source, // 'manual', 'losbox', 'event', etc.
      addedBy: context.auth.uid,
      notes: notes || '',
      ipAddress: 'admin_manual',
      userAgent: 'admin_dashboard',
      language: 'de'
    };
    
    // Subscriber speichern
    await db.collection('subscribers').doc(subscriptionId).set(subscriberData);
    
    // DSGVO Consent Record für manuelle Eingabe
    await createManualConsentRecord(normalizedEmail, {
      subscriptionId,
      addedBy: context.auth.uid,
      source: source,
      notes: notes || '',
      timestamp: new Date().toISOString()
    });
    
    // Analytics Event
    await logAnalyticsEvent('manual_subscriber_added', {
      source: source,
      added_by: context.auth.uid,
      has_name: !!(firstName || lastName),
      has_company: !!company
    });
    
    return {
      success: true,
      message: 'Abonnent erfolgreich hinzugefügt',
      subscriptionId,
      subscriber: {
        email: normalizedEmail,
        firstName,
        lastName,
        company,
        source
      }
    };
    
  } catch (error) {
    console.error('Add Manual Subscriber Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Hinzufügen des Abonnenten');
  }
});

/**
 * ==============================================
 * NEWSLETTER VERSENDUNG (MASS MAILING)
 * ==============================================
 */

/**
 * Admin: Newsletter senden
 */
exports.sendNewsletter = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    if (!context.auth || !await isAdmin(context.auth.uid)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { subject, content, recipientFilter = 'confirmed', testMode = false } = data;
    
    if (!subject || !content) {
      throw new functions.https.HttpsError('invalid-argument', 'Betreff und Inhalt sind erforderlich');
    }
    
    // Empfänger abrufen
    let query = db.collection('subscribers');
    
    if (recipientFilter === 'confirmed') {
      query = query.where('confirmed', '==', true);
    } else if (recipientFilter === 'all') {
      // Alle Abonnenten
    }
    
    const snapshot = await query.get();
    const recipients = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        recipients.push({
          email: data.email,
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        });
      }
    });
    
    if (testMode) {
      // Test-Modus: Nur an Admin senden
      const adminUser = await admin.auth().getUser(context.auth.uid);
      const testRecipients = [{ email: adminUser.email, firstName: 'Test', lastName: 'Admin' }];
      
      await sendBulkNewsletter(subject, content, testRecipients);
      
      return {
        success: true,
        message: `Test-Newsletter an ${adminUser.email} gesendet`,
        recipientCount: 1
      };
    } else {
      // Kampagne in DB speichern
      const campaignId = 'campaign_' + Date.now();
      await db.collection('newsletters').doc(campaignId).set({
        subject,
        content,
        recipientCount: recipients.length,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        sentBy: context.auth.uid,
        status: 'sending'
      });
      
      // E-Mails senden
      await sendBulkNewsletter(subject, content, recipients);
      
      // Status aktualisieren
      await db.collection('newsletters').doc(campaignId).update({
        status: 'sent'
      });
      
      return {
        success: true,
        message: `Newsletter erfolgreich an ${recipients.length} Empfänger gesendet`,
        recipientCount: recipients.length,
        campaignId
      };
    }
    
  } catch (error) {
    console.error('Send Newsletter Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Senden des Newsletters');
  }
});

/**
 * Admin: Test E-Mail senden
 */
exports.sendTestNewsletter = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    if (!context.auth || !await isAdmin(context.auth.uid)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { email } = data;
    const adminUser = await admin.auth().getUser(context.auth.uid);
    const testEmail = email || adminUser.email;
    
    // Test-Newsletter senden
    await sendTestEmail(testEmail);
    
    return {
      success: true,
      message: `Test-E-Mail an ${testEmail} gesendet`
    };
    
  } catch (error) {
    console.error('Send Test Newsletter Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Senden der Test-E-Mail');
  }
});

/**
 * ==============================================
 * ANALYTICS & REPORTING
 * ==============================================
 */

/**
 * Admin: Analytics abrufen
 */
exports.getAnalytics = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    if (!context.auth || !await isAdmin(context.auth.uid)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { dateRange = 30 } = data; // Letzten 30 Tage
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    // Abonnenten-Statistiken
    const subscribersRef = db.collection('subscribers');
    const totalSubscribers = await subscribersRef.where('confirmed', '==', true).get();
    const recentSubscribers = await subscribersRef
      .where('confirmed', '==', true)
      .where('confirmedAt', '>=', startDate)
      .get();
    
    // Newsletter-Statistiken
    const newslettersRef = db.collection('newsletters');
    const totalNewsletters = await newslettersRef.get();
    const recentNewsletters = await newslettersRef
      .where('sentAt', '>=', startDate)
      .get();
    
    // Reward Codes Statistiken
    const rewardsRef = db.collection('rewards');
    const totalRewards = await rewardsRef.get();
    const claimedRewards = await rewardsRef.where('claimed', '==', true).get();
    
    // Analytics-Events
    const analyticsRef = db.collection('analytics');
    const analyticsSnapshot = await analyticsRef
      .where('timestamp', '>=', startDate.toISOString())
      .get();
    
    let totalEvents = 0;
    const eventBreakdown = {};
    
    analyticsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.events) {
        Object.entries(data.events).forEach(([event, count]) => {
          totalEvents += count;
          eventBreakdown[event] = (eventBreakdown[event] || 0) + count;
        });
      }
    });
    
    return {
      success: true,
      analytics: {
        subscribers: {
          total: totalSubscribers.size,
          recent: recentSubscribers.size,
          growth: recentSubscribers.size > 0 ? 
            ((recentSubscribers.size / Math.max(totalSubscribers.size - recentSubscribers.size, 1)) * 100).toFixed(1) : '0'
        },
        newsletters: {
          total: totalNewsletters.size,
          recent: recentNewsletters.size
        },
        rewards: {
          total: totalRewards.size,
          claimed: claimedRewards.size,
          unclaimed: totalRewards.size - claimedRewards.size
        },
        events: {
          total: totalEvents,
          breakdown: eventBreakdown
        },
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days: dateRange
        }
      }
    };
    
  } catch (error) {
    console.error('Get Analytics Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Abrufen der Analytics');
  }
});

/**
 * ==============================================
 * HELPER FUNCTIONS
 * ==============================================
 */

async function isAdmin(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Admin Check Fehler:', error);
    return false;
  }
}

async function createManualConsentRecord(email, data) {
  const consentId = crypto.createHash('sha256').update(email + Date.now()).digest('hex');
  
  return db.collection('consent').doc(consentId).set({
    email,
    consentId,
    type: 'manual_admin_entry',
    ...data,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
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
 * EMAIL FUNCTIONS
 * ==============================================
 */

async function sendBulkNewsletter(subject, content, recipients) {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: 'smtp.ionos.de',
      port: 587,
      secure: false,
      auth: {
        user: 'newsletter@buderus-systeme.de',
        pass: 'Buderus1234!'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // E-Mails in Batches senden um Rate Limits zu vermeiden
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(recipient => {
      const name = recipient.firstName ? ` ${recipient.firstName}` : '';
      const personalizedContent = content.replace('{{name}}', name);
      
      const mailOptions = {
        from: '"Buderus Systeme" <newsletter@buderus-systeme.de>',
        to: recipient.email,
        subject: subject,
        html: personalizedContent
      };
      
      return transporter.sendMail(mailOptions);
    });
    
    await Promise.all(promises);
    
    // Kurze Pause zwischen Batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function sendTestEmail(email) {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: 'smtp.ionos.de',
      port: 587,
      secure: false,
      auth: {
        user: 'newsletter@buderus-systeme.de',
        pass: 'Buderus1234!'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  const mailOptions = {
    from: '"Buderus Systeme" <newsletter@buderus-systeme.de>',
    to: email,
    subject: 'Test Newsletter - Buderus Systeme',
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0;">Test Newsletter</h1>
          <p style="color: white; margin: 0.5rem 0 0 0;">Buderus Systeme</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333;">Dies ist ein Test-Newsletter</h2>
          
          <p>Diese E-Mail wurde vom Admin-Dashboard versendet, um die Newsletter-Funktionalität zu testen.</p>
          
          <p><strong>Funktionen:</strong></p>
          <ul>
            <li>E-Mail-Versendung funktioniert</li>
            <li>HTML-Formatierung wird korrekt dargestellt</li>
            <li>Corporate Design wird angewendet</li>
          </ul>
          
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 0.9rem; color: #666;">
            Diese Test-E-Mail wurde am ${new Date().toLocaleDateString('de-DE')} versendet.
          </p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendAdminSetupEmail(email, tempPassword) {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: 'smtp.ionos.de',
      port: 587,
      secure: false,
      auth: {
        user: 'newsletter@buderus-systeme.de',
        pass: 'Buderus1234!'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  const mailOptions = {
    from: '"Buderus Systeme" <newsletter@buderus-systeme.de>',
    to: email,
    subject: '🔐 Admin-Zugang erstellt - Buderus Systeme',
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0;">🔐 Admin-Zugang</h1>
          <p style="color: white; margin: 0.5rem 0 0 0;">Buderus Systeme Dashboard</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333;">Ihr Admin-Account wurde erstellt</h2>
          
          <p>Ihr Admin-Zugang für das Newsletter-Dashboard wurde erfolgreich eingerichtet.</p>
          
          <div style="background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 1.5rem; margin: 2rem 0;">
            <h3 style="color: #007bff; margin: 0 0 1rem 0;">Anmeldedaten:</h3>
            <p style="margin: 0.5rem 0;"><strong>E-Mail:</strong> ${email}</p>
            <p style="margin: 0.5rem 0;"><strong>Temporäres Passwort:</strong> <code style="background: #e9ecef; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
          </div>
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="https://buderus-systeme.web.app/admin/" style="background: #007bff; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              🚀 Zum Admin-Dashboard
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 1.5rem; margin: 2rem 0;">
            <h4 style="color: #856404; margin: 0 0 1rem 0;">🔒 Sicherheitshinweise:</h4>
            <ul style="color: #856404; margin: 0; padding-left: 1.5rem;">
              <li>Ändern Sie Ihr Passwort nach der ersten Anmeldung</li>
              <li>Teilen Sie Ihre Anmeldedaten niemals mit anderen</li>
              <li>Melden Sie sich nach der Nutzung immer ab</li>
              <li>Diese E-Mail sollte gelöscht werden</li>
            </ul>
          </div>
          
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 0.9rem; color: #666;">
            <strong>Buderus Systeme</strong><br>
            Admin-System automatisch generiert am ${new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}
