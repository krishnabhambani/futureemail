'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { Database } from '@/types/supabase';

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => 
    createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}