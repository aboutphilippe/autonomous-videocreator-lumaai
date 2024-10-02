import { google } from "googleapis";
import { log } from "@restackio/restack-sdk-ts/function";

let globalAccessToken: string | null = null;
let globalRefreshToken: string | null = null;

export function getAuthClient(accessToken: string, refreshToken: string) {
  const tokens = {
    access_token: globalAccessToken || accessToken,
    refresh_token: globalRefreshToken || refreshToken,
  };

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  auth.setCredentials(tokens);

  auth.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      globalRefreshToken = tokens.refresh_token;
      log.info("New refresh token:", { refreshToken: tokens.refresh_token });
    }
    globalAccessToken = tokens.access_token ?? null;
    log.info("New access token:", { accessToken: tokens.access_token });
  });

  return auth;
}
