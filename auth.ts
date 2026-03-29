import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { JWT } from "next-auth/jwt"

import authConfig from "./auth.config"
import { db } from "./lib/db";
import { getUserById } from "./modules/auth/actions";

// ✅ Augment session type only (no JWT module augmentation needed)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
   accessToken?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email || !account) return false;

      try {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token ?? null,
                  access_token: account.access_token ?? null,
                  expires_at: account.expires_at ?? null,
                  token_type: account.token_type ?? null,
                  scope: account.scope ?? null,
                  id_token: account.id_token ?? null,
                  session_state: (account.session_state as string) ?? null,
                },
              },
            },
          });

          if (!newUser) return false;

        } else {
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? null,
                access_token: account.access_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: (account.session_state as string) ?? null,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    // ✅ Use explicit JWT type from next-auth/jwt
  async jwt({ token, user, account }) {
  // ✅ STORE GITHUB ACCESS TOKEN
  if (account?.access_token) {
    (token as JWT & { accessToken?: string }).accessToken =
      account.access_token;
  }

  if (!token.sub) return token;

  const existingUser = await getUserById(token.sub);
  if (!existingUser) return token;

  token.name = existingUser.name;
  token.email = existingUser.email;

  // role
  (token as JWT & { role: string }).role = existingUser.role;

  return token;
},


   async session({ session, token }) {
  if (token.sub && session.user) {
    session.user.id = token.sub;
    session.user.role = (token as JWT & { role: string }).role ?? "USER";
  }

  // ✅ ADD THIS
  (session as any).accessToken = (token as any).accessToken;

  return session;
}, 

async redirect({ url, baseUrl }) {
  // If it's a relative URL (like /auth/sign-in)
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // If same origin, allow it
  if (url.startsWith(baseUrl)) {
    return url;
  }

  // Default fallback
  return baseUrl;
}
  },

  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,


});