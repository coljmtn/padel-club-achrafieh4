
import { createClient } from '@supabase/supabase-js';

/**
 * ⚠️ ERREUR DÉTECTÉE : Vous utilisiez une clé Stripe (sb_publishable).
 * 
 * Pour que l'enregistrement fonctionne, vous devez :
 * 1. Aller sur https://supabase.com -> Votre Projet -> Settings -> API.
 * 2. Copier la clé "anon" (public).
 * 3. Elle DOIT commencer par "eyJ...".
 */

// Votre URL est correcte
const SUPABASE_URL = https://ryagsmqnmdpmtphkenjy.supabase.co;

// REMPLACEZ CETTE VALEUR par la clé qui commence par "eyJ..."
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWdzbXFubWRwbXRwaGtlbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjI2MDAsImV4cCI6MjA4NDEzODYwMH0.LcVhWerN5mx8lTMII3lqJS1GzzitGQj5Y5sm3WwuqAYT_PAR_eyJ;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
