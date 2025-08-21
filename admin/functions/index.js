/**
 * TEMPORÄRE ADMIN SETUP FUNCTION
 * Diese Function erstellt den ersten Admin-Account
 * Einfach über HTTP aufrufbar - kein Firebase Login erforderlich
 */

const { https } = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');

// Firebase Admin initialisieren
const app = initializeApp();
const auth = getAuth(app);
const db = getFirestore(app);

// E-Mail-Validierung
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// HTTP Function für Admin Setup
exports.createFirstAdmin = https.onRequest(async (req, res) => {
  try {
    // CORS Headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Nur POST erlaubt' });
    }

    const { email, setupKey } = req.body;

    // Setup-Schlüssel prüfen
    if (setupKey !== 'BuderusAdmin2025Setup') {
      return res.status(403).json({ error: 'Ungültiger Setup-Schlüssel' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Gültige E-Mail erforderlich' });
    }

    // Prüfen ob bereits Admins existieren
    const existingAdmins = await db.collection('users')
      .where('role', '==', 'admin')
      .limit(1)
      .get();

    if (!existingAdmins.empty) {
      return res.status(409).json({ error: 'Admin bereits vorhanden' });
    }

    // Temporäres Passwort generieren
    const tempPassword = crypto.randomBytes(8).toString('hex');

    // User in Firebase Auth erstellen
    const userRecord = await auth.createUser({
      email: email,
      password: tempPassword,
      emailVerified: true
    });

    // Admin-Rolle in Firestore setzen
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      createdAt: new Date(),
      isActive: true,
      lastLogin: null
    });

    res.status(200).json({
      success: true,
      message: 'Admin-Account erstellt',
      email: email,
      tempPassword: tempPassword,
      uid: userRecord.uid
    });

  } catch (error) {
    console.error('Admin Setup Fehler:', error);
    res.status(500).json({ 
      error: 'Admin Setup fehlgeschlagen',
      details: error.message 
    });
  }
});
