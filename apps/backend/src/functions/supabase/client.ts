import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

export function supabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE!;

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  return supabase;
}
