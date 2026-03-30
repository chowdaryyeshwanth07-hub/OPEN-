
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, doc, getDoc, setDoc, serverTimestamp } from '../firebase.ts';
import { UserProfile, UserRole } from '../types.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const authService = {
  login: async (email: string, password?: string) => {
    throw new Error('Please use Google Sign-In.');
  },
  signUp: async (email: string, password?: string) => {
    throw new Error('Please use Google Sign-In.');
  },
  signInWithGoogle: async (): Promise<UserProfile> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if profile exists
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
      
      if (userDoc && userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        // Create new profile
        // Default admin for the specified email
        const role: UserRole = user.email === 'chowdaryyeshwanth07@gmail.com' ? 'admin' : 'viewer';
        
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          role: role,
          createdAt: serverTimestamp()
        };
        
        try {
          await setDoc(doc(db, 'users', user.uid), newProfile);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        return newProfile;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('{"error":')) {
        throw error; // Already handled
      }
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },
  logout: async () => {
    await signOut(auth);
  },
  isAuthenticated: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(!!user);
      });
    });
  },
  getUser: async (): Promise<User | null> => {
    return auth.currentUser;
  },
  getUserProfile: async (): Promise<UserProfile | null> => {
    const user = auth.currentUser;
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
