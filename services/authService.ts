
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, doc, getDoc, setDoc, serverTimestamp } from '../firebase.ts';
import { UserProfile, UserRole } from '../types.ts';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils.ts';

let authReadyPromise: Promise<User | null> | null = null;

const waitForAuth = (): Promise<User | null> => {
  if (authReadyPromise) return authReadyPromise;
  console.log('Initializing auth state listener...');
  authReadyPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state determined:', user ? user.email : 'No user');
      unsubscribe();
      resolve(user);
    });
  });
  return authReadyPromise;
};

export const authService = {
  login: async (email: string, password?: string) => {
    throw new Error('Please use Google Sign-In.');
  },
  signUp: async (email: string, password?: string) => {
    throw new Error('Please use Google Sign-In.');
  },
  signInWithGoogle: async (): Promise<UserProfile> => {
    console.log('Starting Google Sign-In...');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google Sign-In successful, user:', user.email, 'uid:', user.uid);
      
      // Check if profile exists
      let userDoc;
      try {
        console.log('Checking for existing user profile in Firestore...');
        userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('User profile fetch result - exists:', userDoc.exists());
      } catch (error) {
        console.error('Error fetching user profile from Firestore:', error);
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
      
      if (userDoc && userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        console.log('Existing user profile found:', profile);
        return profile;
      } else {
        console.log('No existing profile, creating new one...');
        // Create new profile
        // Default admin for the specified email
        const role: UserRole = user.email === 'chowdaryyeshwanth07@gmail.com' ? 'admin' : 'viewer';
        console.log('Assigning role:', role);
        
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          role: role,
          createdAt: serverTimestamp()
        };
        
        try {
          console.log('Saving new profile to Firestore:', newProfile);
          await setDoc(doc(db, 'users', user.uid), newProfile);
          console.log('New user profile created successfully');
        } catch (error) {
          console.error('Error creating user profile in Firestore:', error);
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        return newProfile;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('{"error":')) {
        throw error; // Already handled
      }
      console.error('Error in signInWithGoogle:', error);
      if (error instanceof Error && error.message.includes('popup-closed-by-user')) {
        throw new Error('Sign-in popup was closed before completion. Please try again.');
      }
      if (error instanceof Error && error.message.includes('popup-blocked')) {
        throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site or open the app in a new tab.');
      }
      throw error;
    }
  },
  logout: async () => {
    await signOut(auth);
  },
  isAuthenticated: async (): Promise<boolean> => {
    const user = await waitForAuth();
    return !!user;
  },
  getUser: async (): Promise<User | null> => {
    return await waitForAuth();
  },
  getUserProfile: async (): Promise<UserProfile | null> => {
    const user = await waitForAuth();
    if (!user) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    }
    return null;
  },
  isAdmin: async (): Promise<boolean> => {
    try {
      const profile = await authService.getUserProfile();
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
    });
  }
};
