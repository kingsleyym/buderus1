const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { Octokit } = require('@octokit/rest');
const QRCode = require('qrcode');

// GitHub Integration für automatische Deployment
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const GITHUB_OWNER = 'kingsleyym';
const GITHUB_REPO = 'buderus1';

/**
 * Mitarbeiter Registrierung
 * Erstellt einen neuen Benutzer und wartet auf Admin-Genehmigung
 */
exports.registerEmployee = functions.https.onCall(async (data, context) => {
    try {
        const { firstName, lastName, email, phone, position, password } = data;
        
        // Validierung
        if (!firstName || !lastName || !email || !phone || !position || !password) {
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
    try {
        // Admin-Berechtigung prüfen
        if (!context.auth || !context.auth.token.admin) {
            throw new functions.https.HttpsError('permission-denied', 'Nur Administratoren können Mitarbeiter genehmigen');
        }
        
        const { employeeId } = data;
        
        if (!employeeId) {
            throw new functions.https.HttpsError('invalid-argument', 'Employee ID ist erforderlich');
        }
        
        // Employee-Daten laden
        const employeeDoc = await admin.firestore().collection('employees').doc(employeeId).get();
        
        if (!employeeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Mitarbeiter nicht gefunden');
        }
        
        const employeeData = employeeDoc.data();
        
        // Benutzer aktivieren
        await admin.auth().updateUser(employeeId, {
            disabled: false
        });
        
        // Employee-Status aktualisieren
        await admin.firestore().collection('employees').doc(employeeId).update({
            approved: true,
            status: 'active',
            approvedAt: admin.firestore.FieldValue.serverTimestamp(),
            approvedBy: context.auth.uid
        });
        
        // GitHub Repository Update auslösen
        await triggerGitHubDeployment(employeeData);
        
        // Genehmigungs-E-Mail senden
        await sendApprovalEmail(employeeData.email, employeeData.firstName);
        
        console.log(`Mitarbeiter genehmigt: ${employeeData.firstName} ${employeeData.lastName}`);
        
        return { 
            success: true, 
            message: 'Mitarbeiter erfolgreich genehmigt'
        };
        
    } catch (error) {
        console.error('Genehmigung Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Genehmigung fehlgeschlagen');
    }
});

/**
 * Mitarbeiter Profil aktualisieren
 */
exports.updateEmployeeProfile = functions.https.onCall(async (data, context) => {
    try {
        // Benutzer-Authentifizierung prüfen
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        const { employeeId, profileData } = data;
        const userId = context.auth.uid;
        
        // Berechtigung prüfen (Benutzer kann nur sein eigenes Profil bearbeiten oder Admin)
        if (employeeId !== userId && !context.auth.token.admin) {
            throw new functions.https.HttpsError('permission-denied', 'Keine Berechtigung zum Bearbeiten dieses Profils');
        }
        
        // Employee-Daten validieren
        const allowedFields = ['firstName', 'lastName', 'phone', 'position', 'bio', 'avatar'];
        const updateData = {};
        
        Object.keys(profileData).forEach(key => {
            if (allowedFields.includes(key) && profileData[key] !== undefined) {
                updateData[key] = profileData[key];
            }
        });
        
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        
        // Firestore aktualisieren
        await admin.firestore().collection('employees').doc(employeeId).update(updateData);
        
        // Employee-Daten für GitHub Update laden
        const employeeDoc = await admin.firestore().collection('employees').doc(employeeId).get();
        const employeeData = employeeDoc.data();
        
        // GitHub Repository Update auslösen (falls genehmigt)
        if (employeeData.approved) {
            await triggerGitHubDeployment(employeeData);
        }
        
        console.log(`Profil aktualisiert: ${employeeId}`);
        
        return { 
            success: true, 
            message: 'Profil erfolgreich aktualisiert'
        };
        
    } catch (error) {
        console.error('Profil Update Fehler:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Profil Update fehlgeschlagen');
    }
});

/**
 * QR-Code für Mitarbeiter generieren
 */
exports.generateEmployeeQR = functions.https.onCall(async (data, context) => {
    try {
        // Benutzer-Authentifizierung prüfen
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        const { employeeId } = data;
        const userId = context.auth.uid;
        
        // Berechtigung prüfen
        if (employeeId !== userId && !context.auth.token.admin) {
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
 * Employee Statistiken abrufen
 */
exports.getEmployeeStats = functions.https.onCall(async (data, context) => {
    try {
        // Benutzer-Authentifizierung prüfen
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer nicht authentifiziert');
        }
        
        const { employeeId } = data;
        const userId = context.auth.uid;
        
        // Berechtigung prüfen
        if (employeeId !== userId && !context.auth.token.admin) {
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
        if (!process.env.GITHUB_TOKEN) {
            console.warn('GitHub Token nicht konfiguriert - GitHub Integration übersprungen');
            return;
        }
        
        // Repository Dispatch Event auslösen
        await octokit.repos.createDispatchEvent({
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
                    avatar: employeeData.avatar || ''
                }
            }
        });
        
        console.log(`GitHub Deployment ausgelöst für: ${employeeData.firstName} ${employeeData.lastName}`);
        
    } catch (error) {
        console.error('GitHub Deployment Fehler:', error);
        // GitHub Fehler sollten nicht das gesamte System blockieren
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

/**
 * Bestellung verarbeiten
 * Speichert Bestellungen in Firestore für Admin-Verwaltung
 */
exports.submitOrder = functions.https.onCall(async (data, context) => {
    try {
        // Authentifizierung prüfen
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
        }
        
        const { orderId, items, employee, summary } = data;
        
        // Validierung
        if (!orderId || !items || !employee || !summary) {
            throw new functions.https.HttpsError('invalid-argument', 'Bestelldaten unvollständig');
        }
        
        if (!Array.isArray(items) || items.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Bestellung muss mindestens einen Artikel enthalten');
        }
        
        // Sicherstellen, dass der Benutzer seine eigene Bestellung abgibt
        if (context.auth.uid !== employee.uid) {
            throw new functions.https.HttpsError('permission-denied', 'Berechtigung verweigert');
        }
        
        // Bestelldaten für Admin-Dashboard strukturieren
        const orderData = {
            orderId: orderId,
            status: 'pending',
            priority: 'normal',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdDate: new Date().toLocaleDateString('de-DE'),
            orderMonth: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit' }),
            orderYear: new Date().getFullYear(),
            
            // Mitarbeiterdaten für Sortierung und Zuordnung
            employee: {
                uid: employee.uid,
                firstName: employee.firstName,
                lastName: employee.lastName,
                fullName: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
                position: employee.position,
                department: employee.department || 'Unbekannt'
            },
            
            // Bestellte Artikel mit Details
            items: items.map(item => ({
                id: item.id,
                type: item.type,
                name: item.name,
                quantity: item.quantity,
                details: item.details,
                unitType: item.type === 'cards' ? 'Stück' : 'Anzahl',
                ...(item.size && { size: item.size }),
                ...(item.format && { format: item.format })
            })),
            
            // Zusammenfassung für Admin-Übersicht
            summary: {
                totalItems: summary.totalItems,
                itemTypes: summary.itemTypes,
                itemCount: summary.itemCount,
                hasShirts: summary.hasShirts || false,
                hasCards: summary.hasCards || false,
                categories: summary.itemTypes.join(', ')
            },
            
            // Admin-Felder
            adminNotes: '',
            processedBy: null,
            processedAt: null,
            estimatedCompletion: null,
            notificationsSent: {
                orderReceived: false,
                processing: false,
                completed: false
            }
        };
        
        // In Firestore speichern
        const db = admin.firestore();
        await db.collection('orders').doc(orderId).set(orderData);
        
        // Optional: Benachrichtigung an Admin senden
        await sendOrderNotificationToAdmin(orderData);
        
        console.log(`✅ Bestellung ${orderId} erfolgreich gespeichert für ${employee.fullName}`);
        
        return {
            success: true,
            orderId: orderId,
            message: 'Bestellung erfolgreich übermittelt'
        };
        
    } catch (error) {
        console.error('❌ Fehler beim Verarbeiten der Bestellung:', error);
        
        // Spezifische Fehlerbehandlung
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        
        throw new functions.https.HttpsError('internal', 'Fehler beim Verarbeiten der Bestellung');
    }
});

/**
 * Bestellstatus aktualisieren (nur für Admins)
 */
exports.updateOrderStatus = functions.https.onCall(async (data, context) => {
    try {
        // Authentifizierung prüfen
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Admin-Berechtigung erforderlich');
        }
        
        // Admin-Berechtigung prüfen
        const userDoc = await admin.firestore().collection('employees').doc(context.auth.uid).get();
        if (!userDoc.exists || userDoc.data().role !== 'admin') {
            throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
        }
        
        const { orderId, status, adminNotes } = data;
        
        if (!orderId || !status) {
            throw new functions.https.HttpsError('invalid-argument', 'Bestell-ID und Status erforderlich');
        }
        
        const updateData = {
            status: status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            processedBy: context.auth.uid,
            processedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        if (adminNotes) {
            updateData.adminNotes = adminNotes;
        }
        
        await admin.firestore().collection('orders').doc(orderId).update(updateData);
        
        console.log(`✅ Bestellstatus aktualisiert: ${orderId} -> ${status}`);
        
        return {
            success: true,
            message: 'Bestellstatus erfolgreich aktualisiert'
        };
        
    } catch (error) {
        console.error('❌ Fehler beim Aktualisieren des Bestellstatus:', error);
        throw new functions.https.HttpsError('internal', 'Fehler beim Aktualisieren des Status');
    }
});

/**
 * Bestellbenachrichtigung an Admin senden
 */
async function sendOrderNotificationToAdmin(orderData) {
    try {
        // Hier könnte eine E-Mail an den Admin gesendet werden
        console.log(`📧 Neue Bestellung für Admin: ${orderData.orderId} von ${orderData.employee.fullName}`);
        
        // Optional: Push-Benachrichtigung oder E-Mail implementieren
        
    } catch (error) {
        console.error('Fehler beim Senden der Admin-Benachrichtigung:', error);
    }
}
