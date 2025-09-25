// Firestore User-Profil für lucakingsley@gmail.com erstellen
// Dieses Script kann in der Browser-Console auf einer Firebase-Seite ausgeführt werden

import { doc, setDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const createUserProfile = async () => {
  const userProfile = {
    uid: 'YpY1sei7vmN5JzrOdQHIf59e7s02',
    email: 'lucakingsley@gmail.com',
    role: 'admin',
    name: 'Luca Schweiger',
    department: 'Management',
    createdAt: new Date('2025-09-15T14:20:13+02:00'),
    lastLogin: new Date(),
    isActive: true
  };

  try {
    await setDoc(doc(db, 'users', userProfile.uid), userProfile);
    console.log('✅ User profile created successfully!');
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
  }
};

// Ausführen
createUserProfile();
