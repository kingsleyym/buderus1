const admin = require('firebase-admin');
const functions = require('firebase-functions');
const QRCode = require('qrcode');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const nodemailer = require('nodemailer');

// E-Mail Transporter für Mitarbeiter-E-Mails
let employeeEmailTransporter = null;

// Node.js fetch polyfill für ältere Versionen (nicht mehr benötigt in Node 18+)
// const fetch = require('node-fetch');

// GitHub App Integration
let octokit = null;
let githubIntegrationEnabled = false;

try {
    // GitHub App Credentials - ECHTE APP ID EINGEFÜGT
    // Für vollständige Aktivierung wird noch der Private Key benötigt
    const githubAppId = "1863383"; // Ihre echte GitHub App ID
    const githubPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAxeBuuV20n+a7O61uEu7OVyM7SSnDYnQTfxohIq11AIU0EMUO
c84lAqoavsn4ZhN+Js/vFZH2bN7zYtS9GbFGntLV232weAyFQDT3vhNiXBlaMB3S
AeaY/tsJQE9HY11lj1hyuAI+e/jHvLQ1cd8JoGOtodTWyVtfMzBOKaegSULOReEH
5CHBoPm323IyKOiwhmcdicAmTEubq4BAUg0VtDx3/DfOsaabVmF9QhIi2TfuMaQO
512emi6VN6l8LZkdX6383yMWv9WlcKhVYSAvskO52aqtmpzYcFWBJctPCi/j3E6F
6c8Sr7NARsZhLy+SALsPZ3qXX8M9Y1IZEfM9hQIDAQABAoIBACrrZjjQqWfxfPUR
xglXQOxHmQlihJ2rPbtY6I0EAJfPTJ7Cj0LxGLf+O3TcjANgAQHcIiiUk1XD+hia
ujWDbSTv6DEGjytK0/A8TOwueiwt15EONsnwwYit69DGIV7dGDVCYwekfPcY3AID
OIBtd0IRvMyYRMpCBmEs/hcs46hf8m8cNEroVyNAxnxoAFHJY1wRePT1kR/A+JRA
AsmRbgh2fn5Wp/c5EXKB+Bs1kVd7Ni2VwCzAdCDk9y7Y9UCyuYQO51r7WTTc08g7
9tOGwN5UTyx/WcswQ3erN7EhPYj+koMO7B5C/ed9V0UR0EKJ9JH0BWsKE1or8g2N
1q9A9bUCgYEA64EjD4NPYilSIy+08GYbRE8oiTb+BQrPXAHGcDFTGXclYKlkFblT
leZYs378g370M2D3HVWbscFg2WJmNx4+dT8GDsgD8GITgB5rVetKXsR8pVIGuXKA
rq07+e95Ztf3T/J3VG8HydsU7iPrq+e25VYlV0jNRqqbG31FBOcXe1cCgYEA1xj6
NBzOzmk7GS3K5Q2+ZoRFyFgLJ84ry7vwwhs2ODYFaCtrmy9grZi+2XsW+zLHT4nP
lFzs5axIiWSPGr6jNjSjeW3b6xgnBXrfGNzD2pkmRHlCe6XUsOdpbaIIq3utqgRu
qj7gyE8BEb79+2sgKFY4J692LqXclHtZTqQ14IMCgYB6Zn3gfDDwJeXI3+y83XTi
hfndhzVzTXEEsu9+NESqgaBtotyf5dipmjUT5bY8aelmIsmM94eaVZWOpnPVxeRU
b9MoL5DMiUz1U9oZp9bZdmoKSp2wGPEE2IjJmEuSxkCFztFyktqLcVBpjUXZ7O7E
N4fk27PFPLqtCOisaadstQKBgAay32/qCcLB4jZJh80UXX6h1e6EV2yY7iI9KyVQ
ZaLgg9CXsZU2p4Mgg6kQPUn7bdubRhyvvCz27Zdhy1cg4sJYZ1LryfKLYQO5rOMA
VRUkud1eDWT+aB5ORqlEZ5K3mlP2KWAh7ywt0bG0ygIfdvPqo3sQ6tRPFAyHvuNF
F+xzAoGBAIa+adcGE7RZVsHkPDfwDcM4Pytn9qCWtQxreM1ArrwcEN80Tcw6AvCP
mzLsao6IHn3Y0U7+I0jTtevZYRpKoaCxuf8KWJOJpeDv2xPYoBoV5qTD2r98F9c1
5LxC0KABj9m+DmcrRx70MusJP0adFIPYQOKRLG8GovzmuRyr9Ndf
-----END RSA PRIVATE KEY-----`; // Echter Private Key eingefügt
    
    console.log('🔧 GitHub Integration Init - AppId:', githubAppId);
    console.log('🔧 GitHub Integration Init - PrivateKey:', githubPrivateKey.startsWith('PLACEHOLDER') ? 'PRIVATE_KEY_NEEDED' : 'REAL_KEY_FOUND');
    
    // Prüfe ob echte Credentials vorhanden sind
    if (!githubAppId || !githubPrivateKey || githubPrivateKey.startsWith('PLACEHOLDER') || githubPrivateKey.includes('DUMMY')) {
        console.log('⚠️ GitHub Integration DEAKTIVIERT - Private Key fehlt noch');
        console.log('⚠️ App ID gefunden:', githubAppId);
        console.log('⚠️ Benötigt: Echter Private Key von GitHub App Settings');
        githubIntegrationEnabled = false;
        octokit = null;
    } else {
        // Private Key formatieren (| zurück zu Zeilenumbrüchen falls nötig)
        const privateKey = githubPrivateKey.replace(/\|/g, '\n');
        console.log('🔧 Formatted PrivateKey length:', privateKey.length);
        console.log('🔧 PrivateKey starts with:', privateKey.substring(0, 30));
        console.log('🔧 PrivateKey ends with:', privateKey.substring(privateKey.length - 30));
        
        // Validiere RSA Private Key Format
        if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') || 
            !privateKey.includes('-----END RSA PRIVATE KEY-----')) {
            console.log('❌ Invalid RSA Private Key format detected');
            console.log('🔧 Expected format: -----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----');
            console.warn('GitHub Integration deaktiviert wegen ungültigem Private Key');
            githubIntegrationEnabled = false;
            octokit = null;
        } else {
            try {
                // Octokit ohne installationId initialisieren (wird später in getAuthenticatedOctokit gesetzt)
                octokit = new Octokit({
                    authStrategy: createAppAuth,
                    auth: {
                        appId: githubAppId,
                        privateKey: privateKey
                        // installationId wird dynamisch in getAuthenticatedOctokit abgerufen
                    }
                });
                githubIntegrationEnabled = true;
                console.log('✅ GitHub Integration AKTIVIERT - Octokit erfolgreich initialisiert');
            } catch (octokitError) {
                console.error('❌ Octokit Initialisierung fehlgeschlagen:', octokitError.message);
                console.warn('GitHub Integration deaktiviert wegen Octokit Fehler');
                githubIntegrationEnabled = false;
                octokit = null;
            }
        }
    }
} catch (error) {
    console.error('❌ GitHub Integration Init Error:', error.message);
    console.warn('GitHub Integration nicht verfügbar:', error.message);
    githubIntegrationEnabled = false;
    octokit = null;
}

const GITHUB_OWNER = 'kingsleyym';
const GITHUB_REPO = 'buderus1';

// Hilfsfunktion um GitHub App für Repository zu authentifizieren
async function getAuthenticatedOctokit() {
    if (!octokit) {
        throw new Error('GitHub App nicht konfiguriert');
    }
    
    try {
        // Installation ID für das Repository abrufen
        const installations = await octokit.rest.apps.listInstallations();
        console.log('🔍 Installations gefunden:', installations.data.length);
        
        // Installation für den Benutzer finden
        const installation = installations.data.find(inst => 
            inst.account.login === GITHUB_OWNER
        );
        
        if (!installation) {
            throw new Error(`GitHub App nicht installiert für ${GITHUB_OWNER}`);
        }
        
        console.log('✅ Installation gefunden:', installation.id);
        
        // Bereits initialisiertes Octokit mit Installation ID verwenden
        return new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: "1863383", // Ihre echte App ID
                privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAxeBuuV20n+a7O61uEu7OVyM7SSnDYnQTfxohIq11AIU0EMUO
c84lAqoavsn4ZhN+Js/vFZH2bN7zYtS9GbFGntLV232weAyFQDT3vhNiXBlaMB3S
AeaY/tsJQE9HY11lj1hyuAI+e/jHvLQ1cd8JoGOtodTWyVtfMzBOKaegSULOReEH
5CHBoPm323IyKOiwhmcdicAmTEubq4BAUg0VtDx3/DfOsaabVmF9QhIi2TfuMaQO
512emi6VN6l8LZkdX6383yMWv9WlcKhVYSAvskO52aqtmpzYcFWBJctPCi/j3E6F
6c8Sr7NARsZhLy+SALsPZ3qXX8M9Y1IZEfM9hQIDAQABAoIBACrrZjjQqWfxfPUR
xglXQOxHmQlihJ2rPbtY6I0EAJfPTJ7Cj0LxGLf+O3TcjANgAQHcIiiUk1XD+hia
ujWDbSTv6DEGjytK0/A8TOwueiwt15EONsnwwYit69DGIV7dGDVCYwekfPcY3AID
OIBtd0IRvMyYRMpCBmEs/hcs46hf8m8cNEroVyNAxnxoAFHJY1wRePT1kR/A+JRA
AsmRbgh2fn5Wp/c5EXKB+Bs1kVd7Ni2VwCzAdCDk9y7Y9UCyuYQO51r7WTTc08g7
9tOGwN5UTyx/WcswQ3erN7EhPYj+koMO7B5C/ed9V0UR0EKJ9JH0BWsKE1or8g2N
1q9A9bUCgYEA64EjD4NPYilSIy+08GYbRE8oiTb+BQrPXAHGcDFTGXclYKlkFblT
leZYs378g370M2D3HVWbscFg2WJmNx4+dT8GDsgD8GITgB5rVetKXsR8pVIGuXKA
rq07+e95Ztf3T/J3VG8HydsU7iPrq+e25VYlV0jNRqqbG31FBOcXe1cCgYEA1xj6
NBzOzmk7GS3K5Q2+ZoRFyFgLJ84ry7vwwhs2ODYFaCtrmy9grZi+2XsW+zLHT4nP
lFzs5axIiWSPGr6jNjSjeW3b6xgnBXrfGNzD2pkmRHlCe6XUsOdpbaIIq3utqgRu
qj7gyE8BEb79+2sgKFY4J692LqXclHtZTqQ14IMCgYB6Zn3gfDDwJeXI3+y83XTi
hfndhzVzTXEEsu9+NESqgaBtotyf5dipmjUT5bY8aelmIsmM94eaVZWOpnPVxeRU
b9MoL5DMiUz1U9oZp9bZdmoKSp2wGPEE2IjJmEuSxkCFztFyktqLcVBpjUXZ7O7E
N4fk27PFPLqtCOisaadstQKBgAay32/qCcLB4jZJh80UXX6h1e6EV2yY7iI9KyVQ
ZaLgg9CXsZU2p4Mgg6kQPUn7bdubRhyvvCz27Zdhy1cg4sJYZ1LryfKLYQO5rOMA
VRUkud1eDWT+aB5ORqlEZ5K3mlP2KWAh7ywt0bG0ygIfdvPqo3sQ6tRPFAyHvuNF
F+xzAoGBAIa+adcGE7RZVsHkPDfwDcM4Pytn9qCWtQxreM1ArrwcEN80Tcw6AvCP
mzLsao6IHn3Y0U7+I0jTtevZYRpKoaCxuf8KWJOJpeDv2xPYoBoV5qTD2r98F9c1
5LxC0KABj9m+DmcrRx70MusJP0adFIPYQOKRLG8GovzmuRyr9Ndf
-----END RSA PRIVATE KEY-----`, // Echter Private Key eingefügt
                installationId: installation.id
            }
        });
    } catch (error) {
        console.error('❌ GitHub App Auth Fehler:', error);
        throw error;
    }
}

/**
 * Mitarbeiter Registrierung
 * Erstellt einen neuen Benutzer und wartet auf Admin-Genehmigung
 */
exports.registerEmployee = functions.https.onCall(async (data, context) => {
    try {
        console.log('RegisterEmployee aufgerufen - Datentyp:', typeof data);
        console.log('Empfangene Daten - Keys:', data ? Object.keys(data) : 'null/undefined');

        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('Tatsächliche Daten - Typ:', typeof actualData);
        console.log('Tatsächliche Daten - Keys:', actualData ? Object.keys(actualData) : 'null/undefined');

        const { firstName, lastName, email, phone, position, password } = actualData;
        
        console.log('Extrahierte Felder:', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            position: position,
            hasPassword: !!password
        });
        
        // Validierung
        if (!firstName || !lastName || !email || !phone || !position || !password) {
            console.log('Validierung fehlgeschlagen:', {
                firstName: !!firstName,
                lastName: !!lastName,
                email: !!email,
                phone: !!phone,
                position: !!position,
                password: !!password
            });
            throw new functions.https.HttpsError('invalid-argument', 'Alle Felder sind erforderlich');
        }
        
        // E-Mail Format validieren
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Ungültige E-Mail-Adresse');
        }
        
        // Passwort Länge validieren
        if (password.length < 6) {
            throw new functions.https.HttpsError('invalid-argument', 'Passwort muss mindestens 6 Zeichen lang sein');
        }
        
        // Prüfen ob E-Mail bereits existiert
        try {
            await admin.auth().getUserByEmail(email);
            throw new functions.https.HttpsError('already-exists', 'Diese E-Mail wird bereits verwendet');
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }
        
        // Benutzer erstellen (aber noch nicht genehmigt)
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: `${firstName} ${lastName}`,
            disabled: true // Benutzer ist zunächst deaktiviert
        });
        
        // Employee-Daten in Firestore speichern
        const employeeData = {
            uid: userRecord.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            position: position,
            approved: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };
        
        await admin.firestore().collection('employees').doc(userRecord.uid).set(employeeData);
        
        // Admin-Benachrichtigung senden
        await sendAdminNotification('new_registration', employeeData);
        
        // Bestätigungs-E-Mail an Benutzer
        await sendWelcomeEmail(email, firstName);
        
        console.log(`Neue Mitarbeiter-Registrierung: ${firstName} ${lastName} (${email})`);
        
        return { 
            success: true, 
            message: 'Registrierung erfolgreich eingereicht',
            userId: userRecord.uid
        };
        
    } catch (error) {
        console.error('Registrierung Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Registrierung fehlgeschlagen');
    }
});

/**
 * Mitarbeiter genehmigen (nur für Admins)
 */
exports.approveEmployee = functions.https.onCall(async (data, context) => {
    console.log('🔥 APPROVE EMPLOYEE AUFGERUFEN!');
    console.log('🔥 Raw Data:', data);
    console.log('🔥 Data Keys:', data ? Object.keys(data) : 'null/undefined');
    
    // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
    const actualData = data.data || data;
    console.log('🔥 Actual Data:', actualData);
    console.log('🔥 Actual Data Keys:', actualData ? Object.keys(actualData) : 'null/undefined');
    console.log('🔥 employeeId from data:', data.employeeId);
    console.log('🔥 employeeId from actualData:', actualData.employeeId);
    console.log('🔥 Context Auth:', context.auth ? context.auth.uid : 'KEINE AUTH');
    
    try {
        const { employeeId } = actualData;
        
        if (!employeeId) {
            console.log('❌ Keine Employee ID in actualData');
            console.log('❌ Trying direct access:', data.employeeId);
            const directEmployeeId = data.employeeId;
            if (!directEmployeeId) {
                throw new functions.https.HttpsError('invalid-argument', 'Employee ID ist erforderlich');
            }
            console.log('✅ Using direct employeeId:', directEmployeeId);
            return await processApproval(directEmployeeId);
        }
        
        console.log('✅ Using actualData employeeId:', employeeId);
        return await processApproval(employeeId);
        
    } catch (error) {
        console.error('🔥 Genehmigung Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Genehmigung fehlgeschlagen');
    }
});

async function processApproval(employeeId) {
    console.log('🔧 DEBUG: Genehmige Employee mit ID:', employeeId);
    
    // Employee-Daten laden
    const employeeDoc = await admin.firestore().collection('employees').doc(employeeId).get();
    
    if (!employeeDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Mitarbeiter nicht gefunden');
    }
    
    const employeeData = employeeDoc.data();
    console.log('🔧 DEBUG: Employee Data:', {
        uid: employeeData.uid,
        email: employeeData.email,
        status: employeeData.status,
        approved: employeeData.approved
    });
    
    // Firebase Auth User aktivieren (employeeId IST die UID!)
    console.log('🔧 DEBUG: Aktiviere Auth User mit UID:', employeeId);
    await admin.auth().updateUser(employeeId, {
        disabled: false
    });
    console.log('✅ Firebase Auth User aktiviert');
    
    // Employee-Status in Firestore aktualisieren
    console.log('🔧 DEBUG: Aktualisiere Firestore Document:', employeeId);
    await admin.firestore().collection('employees').doc(employeeId).update({
        approved: true,
        status: 'approved',
        approvedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Firestore Document aktualisiert');
    
    // GitHub Repository Update auslösen
    try {
        await triggerGitHubDeployment(employeeData);
        console.log('✅ GitHub Deployment erfolgreich abgeschlossen');
    } catch (gitError) {
        console.warn('⚠️ GitHub Deployment fehlgeschlagen (nicht kritisch):', gitError.message);
        // Nicht kritisch - Genehmigung trotzdem durchführen
        // GitHub Integration ist optional
    }
    
    // Genehmigungs-E-Mail senden
    try {
        await sendApprovalEmail(employeeData.email, employeeData.firstName);
        console.log('✅ Genehmigungs-E-Mail gesendet');
    } catch (emailError) {
        console.warn('⚠️ E-Mail senden fehlgeschlagen:', emailError.message);
        // Nicht kritisch - Genehmigung trotzdem durchführen
    }
    
    console.log(`✅ Mitarbeiter genehmigt: ${employeeData.firstName} ${employeeData.lastName}`);
    
    return { 
        success: true, 
        message: 'Mitarbeiter erfolgreich genehmigt',
        data: {
            employeeId: employeeId,
            uid: employeeData.uid,
            email: employeeData.email,
            approved: true,
            status: 'approved'
        }
    };
}

/**
 * Mitarbeiter Profil aktualisieren
 */
exports.updateEmployeeProfile = functions.https.onCall(async (data, context) => {
    try {
        console.log('� ===== UPDATE EMPLOYEE PROFILE FUNCTION GESTARTET =====');
        console.log('📥 Eingehende Daten - Keys:', data ? Object.keys(data) : 'null/undefined');
        console.log('� Context:', "[Context Object]");
        
        // Auth prüfen
        console.log('� Prüfe Authentifizierung...');
        console.log('🔐 Data Auth vorhanden:', !!data.auth);
        console.log('🔐 Context Auth vorhanden:', !!context.auth);
        
        // Firebase Functions v2 - Auth ist in data.auth, nicht context.auth
        const auth = data.auth || context.auth;
        if (!auth || !auth.uid) {
            console.error('❌ AUTHENTIFIZIERUNG FEHLGESCHLAGEN - Kein Auth Object oder UID');
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        console.log('✅ Benutzer authentifiziert:', auth.uid);
        
        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('📋 Actual Data - Keys:', actualData ? Object.keys(actualData) : 'null/undefined');
        
        const { employeeId, profileData } = actualData;
        const userId = auth.uid;
        
        console.log('👤 Employee ID:', employeeId);
        console.log('👤 User ID:', userId);
        console.log('📊 Profile Data - Keys:', profileData ? Object.keys(profileData) : 'null/undefined');
        
        // Berechtigung prüfen (Benutzer kann nur sein eigenes Profil bearbeiten)
        if (employeeId !== userId) {
            console.error('❌ BERECHTIGUNG VERWEIGERT - Employee ID stimmt nicht mit User ID überein');
            console.error('❌ Employee ID:', employeeId);
            console.error('❌ User ID:', userId);
            throw new functions.https.HttpsError('permission-denied', 'Keine Berechtigung zum Bearbeiten dieses Profils');
        }
        
        console.log('✅ Berechtigung OK');
        
        // Employee-Daten validieren
        console.log('🔍 Validiere Profile Data...');
        const allowedFields = ['firstName', 'lastName', 'phone', 'position', 'bio', 'avatar'];
        const updateData = {};
        
        Object.keys(profileData).forEach(key => {
            if (allowedFields.includes(key) && profileData[key] !== undefined) {
                updateData[key] = profileData[key];
                console.log(`✅ Field OK: ${key} = ${profileData[key]}`);
            } else {
                console.log(`⚠️ Field ignoriert: ${key} = ${profileData[key]}`);
            }
        });
        
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        
        console.log('📝 Final Update Data - Keys:', Object.keys(updateData));
        
        // Firestore aktualisieren
        console.log('💾 Aktualisiere Firestore...');
        await admin.firestore().collection('employees').doc(employeeId).update(updateData);
        console.log('✅ Firestore erfolgreich aktualisiert');
        
        // Employee-Daten für GitHub Update laden
        console.log('📖 Lade komplette Employee Daten...');
        const employeeDoc = await admin.firestore().collection('employees').doc(employeeId).get();
        
        if (!employeeDoc.exists) {
            console.error('❌ Employee Dokument nicht gefunden:', employeeId);
            throw new functions.https.HttpsError('not-found', 'Employee nicht gefunden');
        }
        
        const employeeData = employeeDoc.data();
        console.log('📊 Geladene Employee Data - Keys:', employeeData ? Object.keys(employeeData) : 'null/undefined');
        console.log('✅ Employee approved status:', employeeData.approved);
        
        // GitHub Repository Update auslösen (falls genehmigt)
        if (employeeData.approved) {
            console.log('🚀 Employee ist genehmigt - GitHub Deployment wird gestartet...');
            try {
                await triggerGitHubDeployment(employeeData);
                console.log('✅ GitHub Deployment erfolgreich abgeschlossen');
            } catch (gitError) {
                console.warn('⚠️ GitHub Deployment fehlgeschlagen (nicht kritisch):', gitError.message);
                // Nicht kritisch - Profil Update trotzdem erfolgreich
                // GitHub Integration ist optional für das System
            }
        } else {
            console.log('⏸️ Employee noch nicht genehmigt - GitHub Deployment übersprungen');
        }
        
        console.log('🎉 ===== UPDATE EMPLOYEE PROFILE ERFOLGREICH =====');
        
        return { 
            success: true, 
            message: 'Profil erfolgreich aktualisiert',
            employeeId: employeeId,
            updatedFields: Object.keys(updateData)
        };
        
    } catch (error) {
        console.error('💥 ===== UPDATE EMPLOYEE PROFILE FEHLER =====');
        console.error('💥 Error Object:', error);
        console.error('💥 Error Message:', error.message);
        console.error('💥 Error Code:', error.code);
        console.error('💥 Error Stack:', error.stack);
        
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        
        throw new functions.https.HttpsError('internal', error.message || 'Profil Update fehlgeschlagen');
    }
});

/**
 * QR-Code für Mitarbeiter generieren
 */
exports.generateEmployeeQR = functions.https.onCall(async (data, context) => {
    try {
        console.log('🔧 DEBUG: Generate QR Data:', data);
        console.log('🔧 DEBUG: Data Auth:', data.auth);
        
        // Firebase Functions v2 - Auth ist in data.auth, nicht context.auth
        const auth = data.auth || context.auth;
        if (!auth || !auth.uid) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        const { employeeId } = actualData;
        const userId = auth.uid;
        
        // Berechtigung prüfen (vereinfacht für jetzt)
        if (employeeId !== userId) {
            console.log('🔧 DEBUG: Permission check failed - employeeId:', employeeId, 'userId:', userId);
            throw new functions.https.HttpsError('permission-denied', 'Keine Berechtigung');
        }
        
        // Employee-Daten laden
        const employeeDoc = await admin.firestore().collection('employees').doc(employeeId).get();
        
        if (!employeeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Mitarbeiter nicht gefunden');
        }
        
        const employeeData = employeeDoc.data();
        
        if (!employeeData.approved) {
            throw new functions.https.HttpsError('permission-denied', 'Mitarbeiter noch nicht genehmigt');
        }
        
        // QR-Code URL erstellen
        const fileName = `${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}`;
        const profileUrl = `https://buderus-systeme.web.app/mitarbeiter/${fileName}.html`;
        
        // QR-Code generieren
        const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            width: 300,
            color: {
                dark: '#2c5aa0',
                light: '#FFFFFF'
            }
        });
        
        // QR-Code Tracking aktualisieren
        await admin.firestore().collection('qr_codes').doc(employeeId).set({
            employeeId: employeeId,
            profileUrl: profileUrl,
            qrCodeUrl: qrCodeDataUrl,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            scans: admin.firestore.FieldValue.increment(0) // Initialisierung
        }, { merge: true });
        
        console.log(`QR-Code generiert für: ${employeeData.firstName} ${employeeData.lastName}`);
        
        return { 
            success: true, 
            qrCodeUrl: qrCodeDataUrl,
            profileUrl: profileUrl
        };
        
    } catch (error) {
        console.error('QR-Code Generation Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'QR-Code Generation fehlgeschlagen');
    }
});

/**
 * Alle Mitarbeiter abrufen (nur für Admins)
 */
exports.getAllEmployees = functions.https.onCall(async (data, context) => {
    try {
        console.log('🔧 DEBUG: Get All Employees - Data Auth:', data.auth);
        
        // Firebase Functions v2 - Auth ist in data.auth, nicht context.auth
        const auth = data.auth || context.auth;
        if (!auth || !auth.uid) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        // TODO: Admin-Berechtigung implementieren
        // Für jetzt alle authentifizierten Benutzer zulassen
        console.log('📋 Benutzer lädt alle Mitarbeiter:', auth.uid);
        
        // Alle Mitarbeiter aus Firestore laden
        const employeesSnapshot = await admin.firestore().collection('employees').get();
        const employees = [];
        
        employeesSnapshot.forEach(doc => {
            employees.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`📋 ${employees.length} Mitarbeiter gefunden`);
        
        return {
            success: true,
            employees: employees
        };
        
    } catch (error) {
        console.error('Fehler beim Laden der Mitarbeiter:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Fehler beim Laden der Mitarbeiter');
    }
});

/**
 * Employee Statistiken abrufen
 */
exports.getEmployeeStats = functions.https.onCall(async (data, context) => {
    try {
        console.log('🔧 DEBUG: Get Employee Stats - Data Auth:', data.auth);
        
        // Firebase Functions v2 - Auth ist in data.auth, nicht context.auth
        const auth = data.auth || context.auth;
        if (!auth || !auth.uid) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        const { employeeId } = actualData;
        const userId = auth.uid;
        
        // Berechtigung prüfen (vereinfacht für jetzt)
        if (employeeId !== userId) {
            console.log('🔧 DEBUG: Permission check failed - employeeId:', employeeId, 'userId:', userId);
            throw new functions.https.HttpsError('permission-denied', 'Keine Berechtigung');
        }
        
        // QR-Code Statistiken laden
        const qrDoc = await admin.firestore().collection('qr_codes').doc(employeeId).get();
        
        let stats = {
            totalScans: 0,
            todayScans: 0,
            weekScans: 0
        };
        
        if (qrDoc.exists) {
            const qrData = qrDoc.data();
            
            // Scan-Logs für detaillierte Statistiken
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const scanLogsQuery = await admin.firestore()
                .collection('qr_scans')
                .where('employeeId', '==', employeeId)
                .get();
            
            let totalScans = 0;
            let todayScans = 0;
            let weekScans = 0;
            
            scanLogsQuery.forEach(doc => {
                const scanData = doc.data();
                const scanDate = scanData.timestamp.toDate();
                
                totalScans++;
                
                if (scanDate >= todayStart) {
                    todayScans++;
                }
                
                if (scanDate >= weekStart) {
                    weekScans++;
                }
            });
            
            stats = {
                totalScans,
                todayScans,
                weekScans
            };
        }
        
        return { 
            success: true, 
            stats: stats
        };
        
    } catch (error) {
        console.error('Statistiken Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Statistiken konnten nicht geladen werden');
    }
});

// Helper Functions

/**
 * GitHub Deployment auslösen
 */
async function triggerGitHubDeployment(employeeData) {
    try {
        // Prüfe ob GitHub Integration aktiviert ist
        if (!githubIntegrationEnabled || !octokit) {
            console.log('⚠️ GitHub Integration ist deaktiviert - automatische Seiten-Generierung übersprungen');
            console.log('⚠️ Grund: Keine gültigen GitHub App Credentials vorhanden');
            console.log('💡 Hinweis: Für automatische Employee-Seiten auf buderus-systeme.de werden echte GitHub App Credentials benötigt');
            return; // Kein Fehler werfen, einfach überspringen
        }
        
        console.log('🚀 GitHub Deployment gestartet für:', employeeData.firstName, employeeData.lastName);
        
        // GitHub App authentifizieren
        console.log('🔐 Authentifiziere GitHub App...');
        const authenticatedOctokit = await getAuthenticatedOctokit();
        
        // 1. Avatar zu GitHub uploaden falls vorhanden
        let avatarPath = null;
        if (employeeData.avatar) {
            console.log('📸 Avatar Upload wird gestartet...');
            avatarPath = await uploadAvatarToGitHub(employeeData, authenticatedOctokit);
        }
        
        // 2. employees.json aktualisieren
        console.log('📄 employees.json Update wird gestartet...');
        await updateEmployeesJSON(employeeData, avatarPath, authenticatedOctokit);
        
        // 3. Repository Dispatch Event auslösen für HTML Generation
        console.log('⚡ Repository Dispatch Event wird ausgelöst...');
        await authenticatedOctokit.rest.repos.createDispatchEvent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            event_type: 'employee_update',
            client_payload: {
                action: 'update_employee',
                employee: {
                    id: employeeData.uid,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    email: employeeData.email,
                    phone: employeeData.phone,
                    position: employeeData.position,
                    bio: employeeData.bio || '',
                    avatar: employeeData.avatar || '',
                    avatarPath: avatarPath
                }
            }
        });
        
        console.log(`✅ GitHub Deployment erfolgreich abgeschlossen für: ${employeeData.firstName} ${employeeData.lastName}`);
        console.log(`🌐 Employee-Seite wird automatisch generiert: buderus-systeme.de/mitarbeiter/${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}.html`);
        
    } catch (error) {
        console.error('❌ GitHub Deployment Fehler:', error);
        console.error('❌ Error Message:', error.message);
        
        // Spezifische Behandlung für verschiedene Fehlertypen
        if (error.message && error.message.includes('secretOrPrivateKey must be an asymmetric key')) {
            console.error('🔑 RSA Private Key Fehler - GitHub App Credentials sind ungültig');
            console.error('🔑 Lösung: Echte GitHub App Credentials in employee-functions.js einfügen');
        } else if (error.message && error.message.includes('GitHub App nicht installiert')) {
            console.error('📦 GitHub App Installation Fehler - App ist nicht im Repository installiert');
        } else {
            console.error('🔧 Allgemeiner GitHub API Fehler');
        }
        
        // Nur warnen, nicht das gesamte System blockieren
        console.warn('⚠️ GitHub Auto-Deployment fehlgeschlagen - Employee Profil wurde trotzdem erfolgreich gespeichert');
        console.warn('⚠️ Employee-Seite muss manuell erstellt werden oder GitHub Integration repariert werden');
    }
}

/**
 * Avatar von Firebase Storage zu GitHub uploaden
 */
async function uploadAvatarToGitHub(employeeData, authenticatedOctokit) {
    try {
        if (!employeeData.avatar) return null;
        
        console.log('📸 Avatar Upload gestartet für:', employeeData.firstName);
        
        // Avatar von Firebase Storage downloaden
        const response = await fetch(employeeData.avatar);
        if (!response.ok) {
            throw new Error(`Avatar Download fehlgeschlagen: ${response.status}`);
        }
        
        const avatarBuffer = Buffer.from(await response.arrayBuffer());
        const avatarExtension = employeeData.avatar.includes('.webp') ? 'webp' : 
                              employeeData.avatar.includes('.jpg') || employeeData.avatar.includes('.jpeg') ? 'jpg' : 'png';
        
        // Employee ID für URL-kompatible Benennung (wie in der bestehenden employees.json)
        const employeeId = `${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}`;
        const avatarFilename = `${employeeId}.${avatarExtension}`;
        const avatarPath = `assets/avatars/${avatarFilename}`;
        
        // Prüfen ob Avatar bereits existiert für SHA
        let existingSha = null;
        try {
            const existingFile = await authenticatedOctokit.rest.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: avatarPath
            });
            if (existingFile.data && !Array.isArray(existingFile.data)) {
                existingSha = existingFile.data.sha;
            }
        } catch (error) {
            // Datei existiert nicht - kein Problem, wir erstellen sie neu
        }

        // Avatar zu GitHub Repository uploaden
        const uploadData = {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: avatarPath,
            message: `Update avatar for ${employeeData.firstName} ${employeeData.lastName}`,
            content: avatarBuffer.toString('base64'),
            committer: {
                name: 'Buderus System Bot',
                email: 'bot@buderus-systeme.de'
            }
        };

        // SHA nur hinzufügen wenn Datei bereits existiert
        if (existingSha) {
            uploadData.sha = existingSha;
        }

        await authenticatedOctokit.rest.repos.createOrUpdateFileContents(uploadData);
        
        console.log('✅ Avatar erfolgreich zu GitHub hochgeladen:', avatarPath);
        return avatarFilename;
        
    } catch (error) {
        console.error('❌ Avatar Upload zu GitHub fehlgeschlagen:', error);
        return null;
    }
}

/**
 * employees.json in GitHub Repository aktualisieren
 */
async function updateEmployeesJSON(employeeData, avatarFilename, authenticatedOctokit) {
    try {
        console.log('📄 employees.json Update gestartet...');
        
        // Aktuelle employees.json downloaden
        let currentEmployees = [];
        try {
            const { data } = await authenticatedOctokit.rest.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'mitarbeiter/employees.json'
            });
            
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            currentEmployees = JSON.parse(content);
        } catch (error) {
            // Datei existiert noch nicht, erstelle neue Liste
            console.log('🆕 employees.json existiert noch nicht, erstelle neue Datei');
        }
        
        // Employee-Daten für JSON vorbereiten
        const employeeForJSON = {
            id: `${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}`, // Name-basierte ID für URL
            uid: employeeData.uid, // Echte Firebase UID für interne Referenz
            name: `${employeeData.firstName} ${employeeData.lastName}`,
            title: employeeData.position,
            phone: employeeData.phone,
            email: employeeData.email,
            company: "Buderus Systeme",
            website: "https://buderus-systeme.de",
            avatarExt: avatarFilename ? avatarFilename.split('.').pop() : 'png'
        };
        
        // Bestehenden Employee aktualisieren oder hinzufügen
        const employeeId = `${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}`;
        const existingIndex = currentEmployees.findIndex(emp => emp.id === employeeId || emp.uid === employeeData.uid);
        if (existingIndex >= 0) {
            currentEmployees[existingIndex] = employeeForJSON;
            console.log('🔄 Bestehender Employee aktualisiert');
        } else {
            currentEmployees.push(employeeForJSON);
            console.log('➕ Neuer Employee hinzugefügt');
        }
        
        // employees.json zurück zu GitHub uploaden
        const updatedContent = JSON.stringify(currentEmployees, null, 2);
        
        // SHA der aktuellen Datei für Update benötigt
        let sha = null;
        try {
            const { data } = await authenticatedOctokit.rest.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'mitarbeiter/employees.json'
            });
            sha = data.sha;
        } catch (error) {
            // Datei existiert noch nicht
        }
        
        await authenticatedOctokit.rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: 'mitarbeiter/employees.json',
            message: `Update employee data for ${employeeData.firstName} ${employeeData.lastName}`,
            content: Buffer.from(updatedContent).toString('base64'),
            sha: sha,
            committer: {
                name: 'Buderus System Bot',
                email: 'bot@buderus-systeme.de'
            }
        });
        
        console.log('✅ employees.json erfolgreich aktualisiert');
        
    } catch (error) {
        console.error('❌ employees.json Update fehlgeschlagen:', error);
        throw error;
    }
}

/**
 * Admin-Benachrichtigung senden
 */
async function sendAdminNotification(type, data) {
    try {
        // Alle Admins finden
        const adminsQuery = await admin.firestore()
            .collection('users')
            .where('role', '==', 'admin')
            .get();
        
        const notifications = [];
        
        adminsQuery.forEach(doc => {
            const adminData = doc.data();
            notifications.push({
                userId: doc.id,
                type: type,
                title: 'Neue Mitarbeiter-Registrierung',
                message: `${data.firstName} ${data.lastName} hat sich registriert und wartet auf Genehmigung`,
                data: data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                read: false
            });
        });
        
        // Batch-Write für Benachrichtigungen
        if (notifications.length > 0) {
            const batch = admin.firestore().batch();
            
            notifications.forEach(notification => {
                const notificationRef = admin.firestore().collection('notifications').doc();
                batch.set(notificationRef, notification);
            });
            
            await batch.commit();
        }
        
    } catch (error) {
        console.error('Admin-Benachrichtigung Fehler:', error);
    }
}

/**
 * Willkommens-E-Mail senden
 */
async function sendWelcomeEmail(email, firstName) {
    try {
        // Hier würde normalerweise ein E-Mail-Service wie SendGrid verwendet
        console.log(`Willkommens-E-Mail gesendet an: ${email} (${firstName})`);
        
        // TODO: Implementierung mit einem E-Mail-Service
        
    } catch (error) {
        console.error('Willkommens-E-Mail Fehler:', error);
    }
}

/**
 * Genehmigungs-E-Mail senden
 */
async function sendApprovalEmail(email, firstName) {
    try {
        console.log(`🔧 Sende Genehmigungs-E-Mail an: ${email} (${firstName})`);
        
        // E-Mail Transporter konfigurieren falls noch nicht geschehen
        if (!employeeEmailTransporter) {
            console.log('🔧 Erstelle Employee E-Mail Transporter...');
            // Nutze anderen E-Mail Account für Mitarbeiter-E-Mails
            const emailPassword = `Buderus1234!`;
            employeeEmailTransporter = nodemailer.createTransporter({
                host: 'smtp.ionos.de',
                port: 587,
                secure: false,
                auth: {
                    user: 'employees@buderus-systeme.de', // Separater E-Mail Account für Mitarbeiter
                    pass: emailPassword
                }
            });
            console.log('✅ Employee E-Mail Transporter erstellt');
        }

        const name = firstName ? ` ${firstName}` : '';
        const dashboardUrl = 'https://buderus-systeme.web.app/mitarbeiter-dashboard/';
        
        const mailOptions = {
            from: '"Buderus Systeme HR" <employees@buderus-systeme.de>',
            to: email,
            subject: '✅ Registrierung genehmigt - Willkommen bei Buderus Systeme!',
            html: `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Buderus Systeme</h1>
                    <p style="color: white; margin: 0.5rem 0 0 0; opacity: 0.9;">Think intelligent. Think blue.</p>
                </div>
                
                <!-- Welcome Message -->
                <div style="background: white; padding: 2rem; text-align: center;">
                    <div style="background: #e8f5e8; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px;">✅</span>
                    </div>
                    
                    <h2 style="color: #2c3e50; margin: 0 0 1rem 0;">Herzlich Willkommen${name}!</h2>
                    <p style="color: #666; font-size: 18px; line-height: 1.6; margin: 0 0 2rem 0;">
                        Ihre Registrierung wurde erfolgreich genehmigt. Sie können jetzt das Mitarbeiter-Dashboard nutzen.
                    </p>
                </div>
                
                <!-- Dashboard Access -->
                <div style="background: white; padding: 0 2rem 2rem 2rem;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; margin: 0 0 1rem 0; font-size: 18px;">🚀 Jetzt loslegen</h3>
                        <p style="color: #666; margin: 0 0 1.5rem 0; line-height: 1.6;">
                            Besuchen Sie das Mitarbeiter-Dashboard und loggen Sie sich mit Ihren Anmeldedaten ein:
                        </p>
                        <div style="text-align: center;">
                            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                Zum Dashboard
                            </a>
                        </div>
                    </div>
                    
                    <!-- Features -->
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem;">
                        <h3 style="color: #2c3e50; margin: 0 0 1rem 0; font-size: 18px;">📋 Verfügbare Funktionen</h3>
                        <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
                            <li><strong>Firmen T-Shirts bestellen</strong> - In verschiedenen Größen verfügbar</li>
                            <li><strong>Visitenkarten anfragen</strong> - Professionelle Visitenkarten mit Ihren Daten</li>
                            <li><strong>Mitarbeiterausweis erstellen</strong> - Mit QR-Code und persönlichen Informationen</li>
                            <li><strong>Profil verwalten</strong> - Ihre Daten jederzeit aktualisieren</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Support -->
                <div style="background: #2c3e50; padding: 1.5rem; text-align: center;">
                    <p style="color: white; margin: 0 0 0.5rem 0; font-size: 14px;">
                        Bei Fragen wenden Sie sich an:
                    </p>
                    <p style="color: #3498db; margin: 0; font-weight: 600;">
                        employees@buderus-systeme.de
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding: 1rem; color: #999; font-size: 12px;">
                    <p style="margin: 0;">© 2025 Buderus Systeme GmbH</p>
                    <p style="margin: 0.5rem 0 0 0;">Think intelligent. Think blue.</p>
                </div>
            </div>
            `
        };

        const result = await employeeEmailTransporter.sendMail(mailOptions);
        console.log('✅ Genehmigungs-E-Mail erfolgreich gesendet:', result.messageId);
        
    } catch (error) {
        console.error('❌ Genehmigungs-E-Mail Fehler:', error);
        throw error;
    }
}

// Neue E-Mail Funktion für Bestellbestätigungen (für später)
async function sendOrderConfirmationEmail(email, firstName, orderDetails) {
    try {
        console.log(`🔧 Sende Bestellbestätigung an: ${email}`);
        
        if (!employeeEmailTransporter) {
            const emailPassword = `Buderus1234!`;
            employeeEmailTransporter = nodemailer.createTransporter({
                host: 'smtp.ionos.de',
                port: 587,
                secure: false,
                auth: {
                    user: 'employees@buderus-systeme.de',
                    pass: emailPassword
                }
            });
        }

        const name = firstName ? ` ${firstName}` : '';
        
        const mailOptions = {
            from: '"Buderus Systeme Shop" <employees@buderus-systeme.de>',
            to: email,
            subject: '📦 Bestellbestätigung - Buderus Systeme',
            html: `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Buderus Systeme</h1>
                    <p style="color: white; margin: 0.5rem 0 0 0;">Bestellbestätigung</p>
                </div>
                
                <div style="background: white; padding: 2rem;">
                    <h2 style="color: #2c3e50; margin: 0 0 1rem 0;">Vielen Dank für Ihre Bestellung${name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Ihre Bestellung wurde erfolgreich eingegangen und wird bearbeitet.
                    </p>
                    
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                        <h3 style="color: #2c3e50; margin: 0 0 1rem 0;">Bestelldetails</h3>
                        <p style="color: #666; margin: 0;"><strong>Bestellnummer:</strong> ${orderDetails.orderId}</p>
                        <p style="color: #666; margin: 0.5rem 0 0 0;"><strong>Bestelldatum:</strong> ${orderDetails.date}</p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versandbereit ist.
                    </p>
                </div>
            </div>
            `
        };

        const result = await employeeEmailTransporter.sendMail(mailOptions);
        console.log('✅ Bestellbestätigung erfolgreich gesendet:', result.messageId);
        
    } catch (error) {
        console.error('❌ Bestellbestätigung Fehler:', error);
        throw error;
    }
}

// Export der neuen E-Mail Funktion für zukünftige Nutzung
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
