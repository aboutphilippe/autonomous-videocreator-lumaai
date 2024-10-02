import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: Date | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.refreshToken = token.refreshToken;
      // @ts-ignore
      session.expiresAt = token.expiresAt;
      return session;
    },
    jwt({ token, trigger, session, account }) {
      // console.log("jwt token", token);
      // console.log("jwt account", account);
      if (account?.provider === "google") {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        };
      }
      return token;
    },
  },
});
