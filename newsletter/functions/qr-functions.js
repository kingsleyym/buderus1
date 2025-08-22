const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Firebase Admin wird bereits in index.js initialisiert
const db = admin.firestore();

/**
 * ==============================================
 * QR CODE TRACKING & REDIRECT FUNCTIONS
 * ==============================================
 */

/**
 * QR-Code Redirect und Tracking
 * Wird aufgerufen wenn jemand /q/{qrId} besucht
 */
exports.qrRedirect = functions.https.onRequest(async (req, res) => {
  try {
    // CORS Headers setzen
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }
    
    const qrId = req.path.split('/').pop(); // Extract ID from path
    
    if (!qrId) {
      res.status(400).send('QR-Code ID fehlt');
      return;
    }
    
    console.log('QR-Code Scan:', qrId);
    
    // QR-Code aus Firestore laden (korrekte Collection 'qr-codes')
    const qrRef = db.collection('qr-codes').doc(qrId);
    const qrDoc = await qrRef.get();
    
    if (!qrDoc.exists) {
      res.status(404).send(`
        <html>
          <head>
            <title>QR-Code nicht gefunden</title>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 2rem;">
            <h1>🔍 QR-Code nicht gefunden</h1>
            <p>Dieser QR-Code existiert nicht oder wurde gelöscht.</p>
            <a href="https://buderus-systeme.de" style="color: #007bff;">Zurück zur Hauptseite</a>
          </body>
        </html>
      `);
      return;
    }
    
    const qrData = qrDoc.data();
    
    // Prüfen ob QR-Code aktiv ist
    if (qrData.status !== 'active') {
      res.status(403).send(`
        <html>
          <head>
            <title>QR-Code deaktiviert</title>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 2rem;">
            <h1>⏸️ QR-Code deaktiviert</h1>
            <p>Dieser QR-Code wurde temporär deaktiviert.</p>
            <a href="https://buderus-systeme.de" style="color: #007bff;">Zurück zur Hauptseite</a>
          </body>
        </html>
      `);
      return;
    }
    
    // Scan-Count erhöhen und Last-Scan-Timestamp setzen
    const updateData = {
      scanCount: admin.firestore.FieldValue.increment(1),
      lastScannedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await qrRef.update(updateData);
    
    // Analytics Event loggen
    await logQRScanEvent(qrId, {
      userAgent: req.headers['user-agent'] || '',
      referer: req.headers.referer || '',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
      timestamp: new Date().toISOString()
    });
    
    console.log('QR-Code Scan erfolgreich:', qrId, 'Ziel:', qrData.targetUrl);
    
    // Redirect zur Ziel-URL
    res.redirect(302, qrData.targetUrl);
    
  } catch (error) {
    console.error('QR-Code Redirect Fehler:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Fehler</title>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 2rem;">
          <h1>⚠️ Fehler</h1>
          <p>Ein Fehler ist beim Verarbeiten des QR-Codes aufgetreten.</p>
          <a href="https://buderus-systeme.de" style="color: #007bff;">Zurück zur Hauptseite</a>
        </body>
      </html>
    `);
  }
});

/**
 * QR-Code Analytics abrufen (Admin-Function)
 */
exports.getQRAnalytics = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    const authUID = data?.auth?.uid || context?.auth?.uid;
    if (!authUID || !await isAdmin(authUID)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { qrId, dateRange = 30 } = data.data || data;
    
    if (!qrId) {
      throw new functions.https.HttpsError('invalid-argument', 'QR-Code ID erforderlich');
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    // QR-Code Scan Events abrufen
    const analyticsRef = db.collection('qr-analytics');
    const scansQuery = analyticsRef
      .where('qrId', '==', qrId)
      .where('timestamp', '>=', startDate.toISOString())
      .orderBy('timestamp', 'desc');
    
    const scansSnapshot = await scansQuery.get();
    const scans = [];
    
    scansSnapshot.forEach(doc => {
      scans.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Tägliche Aufschlüsselung
    const dailyScans = {};
    scans.forEach(scan => {
      const date = scan.timestamp.split('T')[0];
      dailyScans[date] = (dailyScans[date] || 0) + 1;
    });
    
    // Browser/Device Analytics
    const browsers = {};
    const devices = {};
    
    scans.forEach(scan => {
      const userAgent = scan.userAgent || '';
      
      // Simple browser detection
      let browser = 'Unknown';
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      // Simple device detection
      let device = 'Desktop';
      if (userAgent.includes('Mobile')) device = 'Mobile';
      else if (userAgent.includes('Tablet')) device = 'Tablet';
      
      browsers[browser] = (browsers[browser] || 0) + 1;
      devices[device] = (devices[device] || 0) + 1;
    });
    
    return {
      success: true,
      analytics: {
        totalScans: scans.length,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days: dateRange
        },
        dailyScans,
        browsers,
        devices,
        recentScans: scans.slice(0, 10) // Letzten 10 Scans
      }
    };
    
  } catch (error) {
    console.error('QR Analytics Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Abrufen der QR-Code Analytics');
  }
});

/**
 * QR-Code Bulk Export (Admin-Function)
 */
exports.exportQRCodes = functions.https.onCall(async (data, context) => {
  try {
    // Admin-Berechtigung prüfen
    const authUID = data?.auth?.uid || context?.auth?.uid;
    if (!authUID || !await isAdmin(authUID)) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    const { format = 'csv', qrIds = [] } = data.data || data;
    
    // Alle oder spezifische QR-Codes abrufen
    let qrQuery = db.collection('qr-codes');
    
    if (qrIds.length > 0) {
      qrQuery = qrQuery.where(admin.firestore.FieldPath.documentId(), 'in', qrIds);
    }
    
    const qrSnapshot = await qrQuery.get();
    const qrCodes = [];
    
    qrSnapshot.forEach(doc => {
      const data = doc.data();
      qrCodes.push({
        id: doc.id,
        name: data.name,
        targetUrl: data.targetUrl,
        shortUrl: `https://buderus-systeme.web.app/q/${doc.id}`,
        status: data.status,
        scanCount: data.scanCount || 0,
        createdAt: data.createdAt?.toDate().toISOString() || '',
        lastScannedAt: data.lastScannedAt?.toDate().toISOString() || ''
      });
    });
    
    if (format === 'csv') {
      // CSV Export
      const csvHeader = 'ID,Name,Target URL,Short URL,Status,Scan Count,Created At,Last Scanned At\n';
      const csvRows = qrCodes.map(qr => 
        `"${qr.id}","${qr.name}","${qr.targetUrl}","${qr.shortUrl}","${qr.status}",${qr.scanCount},"${qr.createdAt}","${qr.lastScannedAt}"`
      ).join('\n');
      
      const csvData = csvHeader + csvRows;
      
      return {
        success: true,
        format: 'csv',
        data: csvData,
        filename: `qr-codes-export-${new Date().toISOString().split('T')[0]}.csv`
      };
    } else {
      // JSON Export
      return {
        success: true,
        format: 'json',
        data: JSON.stringify(qrCodes, null, 2),
        filename: `qr-codes-export-${new Date().toISOString().split('T')[0]}.json`
      };
    }
    
  } catch (error) {
    console.error('QR Export Fehler:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Fehler beim Exportieren der QR-Codes');
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
    return userDoc.exists && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Admin Check Fehler:', error);
    return false;
  }
}

async function logQRScanEvent(qrId, scanData) {
  try {
    await db.collection('qr-analytics').add({
      qrId,
      ...scanData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('QR Analytics Logging Fehler:', error);
  }
}
