import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aszxnzbrbhqxzxvtjqyn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dISx2SJiLJ9-YUgCi0lMOw_v-KKDayh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);