const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { logger } = require('firebase-functions');

const db = getFirestore();

/**
 * Lead-Erstellung
 * Erstellt einen neuen Lead mit automatischer ID-Generierung
 */
exports.createLead = onCall(async (request) => {
  const { data, auth } = request;

  // Authentifizierung prüfen
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
  }

  // Admin-Rechte prüfen
  const userDoc = await db.collection('users').doc(auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Keine Berechtigung für diese Aktion');
  }

  try {
    // Lead-Daten validieren
    const {
      firstName,
      lastName,
      email,
      phone,
      source,
      estimatedValue,
      notes,
      address,
      heatPumpType,
      propertyType,
      heatingArea
    } = data;

    if (!firstName || !lastName || !email) {
      throw new HttpsError('invalid-argument', 'Vorname, Nachname und E-Mail sind erforderlich');
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpsError('invalid-argument', 'Ungültige E-Mail-Adresse');
    }

    // Prüfen ob Lead bereits existiert
    const existingLeadQuery = await db.collection('leads')
      .where('email', '==', email)
      .get();

    if (!existingLeadQuery.empty) {
      throw new HttpsError('already-exists', 'Ein Lead mit dieser E-Mail-Adresse existiert bereits');
    }

    // Lead erstellen
    const leadData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      source: source || 'Unbekannt',
      status: 'new',
      priority: 'medium',
      estimatedValue: estimatedValue || 0,
      notes: notes?.trim() || '',
      address: address?.trim() || '',
      heatPumpType: heatPumpType?.trim() || '',
      propertyType: propertyType?.trim() || '',
      heatingArea: heatingArea || 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastContact: null,
      assignedTo: null,
      createdBy: auth.uid
    };

    const leadRef = await db.collection('leads').add(leadData);

    logger.info(`Lead erstellt: ${leadRef.id} für ${email}`);

    return {
      success: true,
      leadId: leadRef.id,
      message: 'Lead erfolgreich erstellt'
    };

  } catch (error) {
    logger.error('Fehler beim Erstellen des Leads:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Fehler beim Erstellen des Leads');
  }
});

/**
 * Lead-Update
 * Aktualisiert einen existierenden Lead
 */
exports.updateLead = onCall(async (request) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
  }

  try {
    const { leadId, updates } = data;

    if (!leadId) {
      throw new HttpsError('invalid-argument', 'Lead-ID ist erforderlich');
    }

    // Lead existiert prüfen
    const leadDoc = await db.collection('leads').doc(leadId).get();
    if (!leadDoc.exists) {
      throw new HttpsError('not-found', 'Lead nicht gefunden');
    }

    // Berechtigung prüfen
    const userDoc = await db.collection('users').doc(auth.uid).get();
    const userData = userDoc.data();
    const leadData = leadDoc.data();

    const isAdmin = userData?.role === 'admin';
    const isAssigned = leadData.assignedTo === auth.uid;

    if (!isAdmin && !isAssigned) {
      throw new HttpsError('permission-denied', 'Keine Berechtigung für diesen Lead');
    }

    // Updates vorbereiten
    const updateData = {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: auth.uid
    };

    // Bestimmte Felder vor Updates schützen
    delete updateData.createdAt;
    delete updateData.createdBy;
    delete updateData.id;

    // E-Mail-Validierung falls geändert
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new HttpsError('invalid-argument', 'Ungültige E-Mail-Adresse');
      }
      updateData.email = updates.email.toLowerCase().trim();
    }

    // Status-Änderung protokollieren
    if (updates.status && updates.status !== leadData.status) {
      updateData.lastStatusChange = FieldValue.serverTimestamp();
      
      // Bei Kontakt automatisch lastContact setzen
      if (updates.status === 'contacted') {
        updateData.lastContact = FieldValue.serverTimestamp();
      }
    }

    await db.collection('leads').doc(leadId).update(updateData);

    logger.info(`Lead aktualisiert: ${leadId} von ${auth.uid}`);

    return {
      success: true,
      message: 'Lead erfolgreich aktualisiert'
    };

  } catch (error) {
    logger.error('Fehler beim Aktualisieren des Leads:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Fehler beim Aktualisieren des Leads');
  }
});

/**
 * Leads abrufen
 * Gibt eine gefilterte Liste von Leads zurück
 */
exports.getLeads = onCall(async (request) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
  }

  try {
    const userDoc = await db.collection('users').doc(auth.uid).get();
    const userData = userDoc.data();
    
    const {
      status,
      priority,
      source,
      assignedTo,
      limit = 50,
      offset = 0
    } = data || {};

    let query = db.collection('leads');

    // Berechtigung: Admin sieht alle, andere nur zugewiesene
    if (userData?.role !== 'admin') {
      query = query.where('assignedTo', '==', auth.uid);
    }

    // Filter anwenden
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (priority) {
      query = query.where('priority', '==', priority);
    }
    
    if (source) {
      query = query.where('source', '==', source);
    }
    
    if (assignedTo) {
      query = query.where('assignedTo', '==', assignedTo);
    }

    // Sortierung und Paginierung
    query = query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset);

    const snapshot = await query.get();
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      lastContact: doc.data().lastContact?.toDate(),
      lastStatusChange: doc.data().lastStatusChange?.toDate()
    }));

    return {
      success: true,
      leads,
      total: snapshot.size,
      hasMore: snapshot.size === limit
    };

  } catch (error) {
    logger.error('Fehler beim Abrufen der Leads:', error);
    throw new HttpsError('internal', 'Fehler beim Abrufen der Leads');
  }
});

/**
 * Lead zuweisen
 * Weist einen Lead einem Mitarbeiter zu
 */
exports.assignLead = onCall(async (request) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
  }

  // Nur Admins können Leads zuweisen
  const userDoc = await db.collection('users').doc(auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Keine Berechtigung für diese Aktion');
  }

  try {
    const { leadId, employeeId } = data;

    if (!leadId || !employeeId) {
      throw new HttpsError('invalid-argument', 'Lead-ID und Mitarbeiter-ID sind erforderlich');
    }

    // Mitarbeiter existiert prüfen
    const employeeDoc = await db.collection('employees').doc(employeeId).get();
    if (!employeeDoc.exists) {
      throw new HttpsError('not-found', 'Mitarbeiter nicht gefunden');
    }

    // Lead zuweisen
    await db.collection('leads').doc(leadId).update({
      assignedTo: employeeId,
      assignedAt: FieldValue.serverTimestamp(),
      assignedBy: auth.uid,
      updatedAt: FieldValue.serverTimestamp()
    });

    logger.info(`Lead ${leadId} zu Mitarbeiter ${employeeId} zugewiesen`);

    return {
      success: true,
      message: 'Lead erfolgreich zugewiesen'
    };

  } catch (error) {
    logger.error('Fehler beim Zuweisen des Leads:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Fehler beim Zuweisen des Leads');
  }
});

/**
 * Lead-Statistiken
 * Gibt Statistiken für das Dashboard zurück
 */
exports.getLeadStats = onCall(async (request) => {
  const { auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Benutzer muss angemeldet sein');
  }

  try {
    const userDoc = await db.collection('users').doc(auth.uid).get();
    const userData = userDoc.data();
    const isAdmin = userData?.role === 'admin';

    let baseQuery = db.collection('leads');
    
    // Nicht-Admins sehen nur ihre zugewiesenen Leads
    if (!isAdmin) {
      baseQuery = baseQuery.where('assignedTo', '==', auth.uid);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Parallel Queries für bessere Performance
    const [
      totalSnapshot,
      newThisMonthSnapshot,
      qualifiedSnapshot,
      closedWonSnapshot,
      closedWonThisMonthSnapshot
    ] = await Promise.all([
      baseQuery.get(),
      baseQuery.where('createdAt', '>=', startOfMonth).get(),
      baseQuery.where('status', '==', 'qualified').get(),
      baseQuery.where('status', '==', 'closed-won').get(),
      baseQuery
        .where('status', '==', 'closed-won')
        .where('updatedAt', '>=', startOfMonth)
        .get()
    ]);

    // Umsatz berechnen
    const monthlyRevenue = closedWonThisMonthSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().estimatedValue || 0);
    }, 0);

    const totalRevenue = closedWonSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().estimatedValue || 0);
    }, 0);

    // Conversion Rate berechnen
    const totalLeads = totalSnapshot.size;
    const wonLeads = closedWonSnapshot.size;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    const stats = {
      totalLeads,
      newThisMonth: newThisMonthSnapshot.size,
      qualified: qualifiedSnapshot.size,
      won: wonLeads,
      monthlyRevenue,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 10) / 10
    };

    return {
      success: true,
      stats
    };

  } catch (error) {
    logger.error('Fehler beim Abrufen der Lead-Statistiken:', error);
    throw new HttpsError('internal', 'Fehler beim Abrufen der Statistiken');
  }
});

/**
 * Trigger: Lead-Erstellung
 * Automatische Aktionen bei neuen Leads
 */
exports.onLeadCreated = onDocumentCreated('leads/{leadId}', async (event) => {
  const leadData = event.data.data();
  const leadId = event.params.leadId;

  try {
    logger.info(`Neuer Lead erstellt: ${leadId}`);

    // TODO: Benachrichtigungen senden
    // TODO: Automatische Lead-Bewertung
    // TODO: CRM-Integration

    // Lead-Counter aktualisieren
    const counterRef = db.collection('statistics').doc('leads');
    await counterRef.set({
      total: FieldValue.increment(1),
      newToday: FieldValue.increment(1),
      lastUpdated: FieldValue.serverTimestamp()
    }, { merge: true });

  } catch (error) {
    logger.error('Fehler beim Lead-Creation-Trigger:', error);
  }
});

/**
 * Trigger: Lead-Update
 * Automatische Aktionen bei Lead-Updates
 */
exports.onLeadUpdated = onDocumentUpdated('leads/{leadId}', async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  const leadId = event.params.leadId;

  try {
    // Status-Änderung erkennen
    if (beforeData.status !== afterData.status) {
      logger.info(`Lead-Status geändert: ${leadId} von ${beforeData.status} zu ${afterData.status}`);

      // Bei "closed-won" Umsatz-Statistik aktualisieren
      if (afterData.status === 'closed-won') {
        const revenueRef = db.collection('statistics').doc('revenue');
        await revenueRef.set({
          total: FieldValue.increment(afterData.estimatedValue || 0),
          deals: FieldValue.increment(1),
          lastUpdated: FieldValue.serverTimestamp()
        }, { merge: true });
      }

      // TODO: Status-spezifische Aktionen
      // TODO: Benachrichtigungen an Mitarbeiter
      // TODO: Workflow-Automation
    }

  } catch (error) {
    logger.error('Fehler beim Lead-Update-Trigger:', error);
  }
});
