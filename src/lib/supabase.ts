import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://merqyvrpmjymyftgfcmg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eakbhfg1jcC42FxHEXyU7Q_LvY2kozR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
