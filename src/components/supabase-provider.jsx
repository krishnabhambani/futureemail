import { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const [session, setSession] = useState(null);

  return (
    <SupabaseContext.Provider value={{ supabase, session, setSession }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};