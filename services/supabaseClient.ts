
import { createClient } from '@supabase/supabase-js';

// Credentials provided by the user
const supabaseUrl = 'https://eudmbutiuszsuyflhthc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZG1idXRpdXN6c3V5ZmxodGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTQ3NjksImV4cCI6MjA4MTY3MDc2OX0.JoKfOBjIV-4nQW26h1rIojH5HGR-QPMCAkwhI8dPsWg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// It's no longer a placeholder since we have real credentials
export const isPlaceholder = false;
