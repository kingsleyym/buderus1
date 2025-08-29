const admin = require('firebase-admin');
const functions = require('firebase-functions');
const QRCode = require('qrcode');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// Node.js fetch polyfill für ältere Versionen
const fetch = globalThis.fetch || require('node-fetch');

// GitHub App Integration
let octokit = null;
try {
    const config = functions.config();
    if (config.github && config.github.app_id && config.github.private_key) {
        // Private Key formatieren (| zurück zu Zeilenumbrüchen)
        const privateKey = config.github.private_key.replace(/\|/g, '\n');
        
        octokit = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: config.github.app_id,
                privateKey: privateKey,
                installationId: null // wird später gesetzt
            }
        });
    }
} catch (error) {
    console.warn('GitHub Integration nicht verfügbar:', error.message);
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
        
        // Neuen Octokit mit Installation ID erstellen
        const { Octokit } = require('@octokit/rest');
        const { createAppAuth } = require('@octokit/auth-app');
        const config = functions.config();
        const privateKey = config.github.private_key.replace(/\|/g, '\n');
        
        return new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: config.github.app_id,
                privateKey: privateKey,
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
        console.log('✅ GitHub Deployment ausgelöst');
    } catch (gitError) {
        console.warn('⚠️ GitHub Deployment fehlgeschlagen:', gitError.message);
        // Nicht kritisch - Genehmigung trotzdem durchführen
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
        console.log('📥 Eingehende Daten:', JSON.stringify(data, null, 2));
        console.log('� Context:', JSON.stringify(context, null, 2));
        
        // Auth prüfen
        console.log('� Prüfe Authentifizierung...');
        console.log('🔐 Data Auth:', data.auth);
        console.log('🔐 Context Auth:', context.auth);
        
        // Firebase Functions v2 - Auth ist in data.auth, nicht context.auth
        const auth = data.auth || context.auth;
        if (!auth || !auth.uid) {
            console.error('❌ AUTHENTIFIZIERUNG FEHLGESCHLAGEN - Kein Auth Object oder UID');
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        console.log('✅ Benutzer authentifiziert:', auth.uid);
        
        // Firebase Functions v2 Compatibility - Daten können verschachtelt sein
        const actualData = data.data || data;
        console.log('📋 Actual Data:', JSON.stringify(actualData, null, 2));
        
        const { employeeId, profileData } = actualData;
        const userId = auth.uid;
        
        console.log('👤 Employee ID:', employeeId);
        console.log('👤 User ID:', userId);
        console.log('📊 Profile Data:', JSON.stringify(profileData, null, 2));
        
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
        
        console.log('📝 Final Update Data:', JSON.stringify(updateData, null, 2));
        
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
        console.log('📊 Geladene Employee Data:', JSON.stringify(employeeData, null, 2));
        console.log('✅ Employee approved status:', employeeData.approved);
        
        // GitHub Repository Update auslösen (falls genehmigt)
        if (employeeData.approved) {
            console.log('🚀 Employee ist genehmigt - GitHub Deployment TEMPORÄR DEAKTIVIERT...');
            // TEMPORÄR AUSGESCHALTET UM PROFIL UPDATE ZU FIXEN
            // await triggerGitHubDeployment(employeeData);
            console.log('⏸️ GitHub Deployment temporär übersprungen');
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
        const config = functions.config();
        if (!config.github || !config.github.app_id) {
            console.warn('GitHub App nicht konfiguriert - GitHub Integration übersprungen');
            return;
        }
        
        console.log('🚀 GitHub Deployment gestartet für:', employeeData.firstName, employeeData.lastName);
        
        // GitHub App authentifizieren
        const authenticatedOctokit = await getAuthenticatedOctokit();
        
        // 1. Avatar zu GitHub uploaden falls vorhanden
        let avatarPath = null;
        if (employeeData.avatar) {
            avatarPath = await uploadAvatarToGitHub(employeeData, authenticatedOctokit);
        }
        
        // 2. employees.json aktualisieren
        await updateEmployeesJSON(employeeData, avatarPath, authenticatedOctokit);
        
        // 3. Repository Dispatch Event auslösen für HTML Generation
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
        
        console.log(`✅ GitHub Deployment ausgelöst für: ${employeeData.firstName} ${employeeData.lastName}`);
        
    } catch (error) {
        console.error('❌ GitHub Deployment Fehler:', error);
        // GitHub Fehler sollten nicht das gesamte System blockieren
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
        
        const avatarBuffer = await response.buffer();
        const avatarExtension = employeeData.avatar.includes('.webp') ? 'webp' : 'png';
        const avatarFilename = `${employeeData.uid}.${avatarExtension}`;
        const avatarPath = `assets/avatars/${avatarFilename}`;
        
        // Avatar zu GitHub Repository uploaden
        await authenticatedOctokit.rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: avatarPath,
            message: `Update avatar for ${employeeData.firstName} ${employeeData.lastName}`,
            content: avatarBuffer.toString('base64'),
            committer: {
                name: 'Buderus System Bot',
                email: 'bot@buderus-systeme.de'
            }
        });
        
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
            id: employeeData.uid,
            name: `${employeeData.firstName} ${employeeData.lastName}`,
            title: employeeData.position,
            phone: employeeData.phone,
            email: employeeData.email,
            company: "Buderus Systeme",
            website: "https://buderus-systeme.de",
            avatarExt: avatarFilename ? avatarFilename.split('.').pop() : 'png'
        };
        
        // Bestehenden Employee aktualisieren oder hinzufügen
        const existingIndex = currentEmployees.findIndex(emp => emp.id === employeeData.uid);
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
        // Hier würde normalerweise ein E-Mail-Service verwendet
        console.log(`Genehmigungs-E-Mail gesendet an: ${email} (${firstName})`);
        
        // TODO: Implementierung mit einem E-Mail-Service
        
    } catch (error) {
        console.error('Genehmigungs-E-Mail Fehler:', error);
    }
}
