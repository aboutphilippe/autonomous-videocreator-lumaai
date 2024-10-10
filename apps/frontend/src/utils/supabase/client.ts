import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { persistGoogleToken } from "./actions";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

createClient().auth.onAuthStateChange((event, session) => {
  if (session?.provider_refresh_token && session?.provider_token) {
    persistGoogleToken();
  }
});
