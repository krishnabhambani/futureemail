import { supabase } from './supabase';
import { toast } from 'sonner';

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Provide user-friendly error messages
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    toast.error(error.message);
    return { 
      data: null, 
      error: error.message
    };
  }
}

export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast.success('Account created successfully! Please check your email to verify your account.');
    return { data, error: null };
  } catch (error) {
    toast.error(error.message);
    return { 
      data: null, 
      error: error.message
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
}