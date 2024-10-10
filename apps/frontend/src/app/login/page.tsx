"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const signIn = async () => {
    const supabase = createClient(); // This should be imported from /supabase/client
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
        queryParams: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
        },
      },
    });
  };

  return <button onClick={signIn}>Sign In with Google</button>;
}
