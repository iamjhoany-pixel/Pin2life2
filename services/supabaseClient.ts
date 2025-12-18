
import { createClient } from '@supabase/supabase-js';

// Nota: En un entorno real, estas variables vendrían de process.env
// Para esta demo, asumimos que están disponibles en el contexto.
const supabaseUrl = (process.env.SUPABASE_URL as string) || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY as string) || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
