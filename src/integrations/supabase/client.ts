// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sudviavdpsncezczmnos.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZHZpYXZkcHNuY2V6Y3ptbm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjEyODQsImV4cCI6MjA1MTM5NzI4NH0.tioVc6aO2jEra_F4o5U3AaMi7092nfaOC6ZFGXsaWUY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);