// Firebase Configuration für Helios Energy
// Zentrale Config - ersetzt 9 duplizierte Configs aus Admin-Dateien

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase Config (aus admin/dashboard.html extrahiert)
const firebaseConfig = {
  apiKey: "AIzaSyAp4fAQr-t2VbTTD2AJ_TLzTxeMnIDSt5o",
  authDomain: "helios-energy.firebaseapp.com",
  projectId: "helios-energy",
  storageBucket: "helios-energy.firebasestorage.app", 
  messagingSenderId: "446328459321",
  appId: "1:446328459321:web:dbf5621e8c4ec2a9af7de8"
};

// Firebase App initialisieren
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Firebase Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const functions: Functions = getFunctions(app);

// Default Export für einfache Imports
export default {
  app,
  auth,
  db,
  functions,
  config: firebaseConfig
};

// Debug Helper
console.log('🔥 Firebase initialisiert:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  app: app.name
});
