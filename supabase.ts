
import { createClient } from '@supabase/supabase-js';

// L'URL et la clé doivent être entre guillemets
const SUPABASE_URL = 'https://ryagsmqnmdpmtphkenjy.supabase.co';

// J'ai ajouté les guillemets et retiré le "_PAR_eyJ" qui était une erreur de copier-coller
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWdzbXFubWRwbXRwaGtlbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjI2MDAsImV4cCI6MjA4NDEzODYwMH0.LcVhWerN5mx8lTMII3lqJS1GzzitGQj5Y5sm3WwuqAY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
