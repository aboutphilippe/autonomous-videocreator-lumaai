"use server";

import { triggerWorkflow } from "@/app/actions/trigger";
import { createClient } from "@/utils/supabase/server";

const tokenCache = new Map();

export const persistGoogleToken = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  if (
    session?.data.session?.provider_token &&
    session?.data.session?.provider_refresh_token
  ) {
    const userId = session?.data.session.user.id;
    const googleAccessToken = session?.data.session.provider_token;
    const googleRefreshToken = session?.data.session.provider_refresh_token;

    const cacheKey = `${userId}-${googleAccessToken}-${googleRefreshToken}`;

    if (!tokenCache.has(cacheKey)) {
      const input = {
        userId,
        googleAccessToken,
        googleRefreshToken,
      };
      triggerWorkflow("updateGoogleToken", input);
      tokenCache.set(cacheKey, true);
    }
  }
};
