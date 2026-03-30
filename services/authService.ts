
import { supabase } from '../supabase.ts';

export const authService = {
  login: async (email: string, password?: string) => {
    // For demo purposes, we'll use a simple login if password is not provided
    // but in a real app, you'd use supabase.auth.signInWithPassword
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Fallback for simple email-only login (OTP or just mock)
      const { data, error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      return data;
    }
  },
  signUp: async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    }
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
