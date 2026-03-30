
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '../firebase.ts';

export const authService = {
  login: async (email: string, password?: string) => {
    // Firebase doesn't support simple email login without password easily in this context
    // We'll focus on Google Sign-In as requested
    throw new Error('Please use Google Sign-In or provide a password for Firebase Auth.');
  },
  signUp: async (email: string, password?: string) => {
    throw new Error('Please use Google Sign-In.');
  },
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
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
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
    });
  }
};
