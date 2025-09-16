"use strict";
// ===================================
// AUTHENTICATION & AUTHORIZATION HELPERS
// ===================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
exports.isAdmin = isAdmin;
exports.canAccessResource = canAccessResource;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Check if user is authenticated
 */
async function isAuthenticated(context) {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentifizierung erforderlich');
    }
    return context.auth.uid;
}
/**
 * Check if user is admin
 */
async function isAdmin(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('permission-denied', 'Benutzer nicht gefunden');
        }
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.isAdmin)) {
            throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
        }
        return true;
    }
    catch (error) {
        console.error('Admin check error:', error);
        throw new functions.https.HttpsError('permission-denied', 'Admin-Berechtigung erforderlich');
    }
}
/**
 * Check if user can access resource
 */
async function canAccessResource(uid, resourceType, resourceId) {
    // Basic implementation - can be extended
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return false;
    }
    const userData = userDoc.data();
    // Admins can access everything
    if (userData === null || userData === void 0 ? void 0 : userData.isAdmin) {
        return true;
    }
    // Add more specific permission logic here
    return false;
}
//# sourceMappingURL=auth.js.map