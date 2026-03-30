
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, doc, getDoc, setDoc, serverTimestamp } from '../firebase.ts';
import { UserProfile, UserRole } from '../types.ts';

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
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
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
        
        await setDoc(doc(db, 'users', user.uid), newProfile);
        return newProfile;
      }
    } catch (error) {
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
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  },
  isAdmin: async (): Promise<boolean> => {
    const profile = await authService.getUserProfile();
    return profile?.role === 'admin';
  },
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
    });
  }
};
