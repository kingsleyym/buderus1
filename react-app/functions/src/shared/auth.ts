// ===================================
// AUTHENTICATION & AUTHORIZATION HELPERS
// ===================================

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(context: functions.https.CallableContext): Promise<string> {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentifizierung erforderlich');
  }
  return context.auth.uid;
}

/**
 * Check if user is admin
 */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('permission-denied', 'Benutzer nicht gefunden');
    }
    
    const userData = userDoc.data();
    if (!userData?.isAdmin) {
      throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
    
    return true;
  } catch (error) {
    console.error('Admin check error:', error);
    throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
  }
}

/**
 * Check if user can access resource
 */
export async function canAccessResource(uid: string, resourceType: string, resourceId?: string): Promise<boolean> {
  // Basic implementation - can be extended
  const userDoc = await db.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    return false;
  }
  
  const userData = userDoc.data();
  
  // Admins can access everything
  if (userData?.isAdmin) {
    return true;
  }
  
  // Add more specific permission logic here
  return false;
}
