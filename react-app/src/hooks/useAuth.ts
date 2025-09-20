// Custom Hook für Firebase Authentication
import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// User Role Types
export type UserRole = 'admin' | 'employee' | 'partner';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  department?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Load user profile from Firestore
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as UserProfile;
            
            // Update last login
            await setDoc(doc(db, 'users', user.uid), {
              ...profileData,
              lastLogin: new Date()
            }, { merge: true });
            
            setAuthState({
              user,
              profile: profileData,
              loading: false,
              error: null
            });
          } else {
            // Profile doesn't exist - should not happen for valid users
            setAuthState({
              user: null,
              profile: null,
              loading: false,
              error: 'Benutzerprofil nicht gefunden'
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            error: 'Fehler beim Laden des Benutzerprofils'
          });
        }
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null
        });
      }
    });

    return unsubscribe;
  }, []);

  // Login Function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Profile wird automatisch durch onAuthStateChanged geladen
      
    } catch (error: any) {
      let errorMessage = 'Anmeldung fehlgeschlagen';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Benutzer nicht gefunden';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Falsches Passwort';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Ungültige E-Mail-Adresse';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.';
          break;
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Logout Function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Password Reset Function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      let errorMessage = 'Fehler beim Senden der E-Mail';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Benutzer nicht gefunden';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Ungültige E-Mail-Adresse';
          break;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Create User Function (for admin use)
  const createUser = async (
    email: string, 
    password: string, 
    role: UserRole,
    name?: string,
    department?: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        role: role,
        name: name,
        department: department,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
    } catch (error: any) {
      let errorMessage = 'Fehler beim Erstellen des Benutzers';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'E-Mail-Adresse wird bereits verwendet';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Ungültige E-Mail-Adresse';
          break;
        case 'auth/weak-password':
          errorMessage = 'Passwort ist zu schwach';
          break;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Helper Functions
  const isAuthenticated = (): boolean => {
    return authState.user !== null && authState.profile !== null;
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    return authState.profile?.role === requiredRole;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isEmployee = (): boolean => {
    return hasRole('employee');
  };

  return {
    // State
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    error: authState.error,
    
    // Functions
    login,
    logout,
    resetPassword,
    createUser,
    
    // Helpers
    isAuthenticated,
    hasRole,
    isAdmin,
    isEmployee
  };
};
