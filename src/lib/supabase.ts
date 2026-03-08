import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://merqyvrpmjymyftgfcmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcnF5dnJwbWp5bXlmdGdmY21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTQzNjgsImV4cCI6MjA4NjU5MDM2OH0.yC0YABZ0WWHTr-JlXbXOoB_dnlwF_G4YW1mF_t9Cp0Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
