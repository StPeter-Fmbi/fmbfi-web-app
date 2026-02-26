import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "@/lib/db";

// Shared function to get user from DB by email
async function getUserByEmail(email: string) {
  const usersResult = await sql`SELECT * FROM tblusers WHERE email = ${email} LIMIT 1`;
  const user = usersResult[0];
  if (!user) return null;

  return {
    id: user.scholardid,
    name: user.username,
    email: user.email,
    role: user.role,
  };
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user) return null;

        // Verify password (plain text here, consider hashing in production)
        const usersResult = await sql`SELECT password FROM tblusers WHERE email = ${email} LIMIT 1`;
        const dbPassword = usersResult[0]?.password;
        if (!dbPassword || dbPassword !== password) return null;

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user.email) return false;

      // For Google, fetch user from DB to attach role, id, and name
      if (account?.provider === "google") {
        const dbUser = await getUserByEmail(user.email);
        if (!dbUser) return false; // triggers OAuthSignin error

        user.id = dbUser.id;
        user.name = dbUser.name;
        user.role = dbUser.role;
      }

      return true;
    },

    jwt: async ({ token, user }) => {
      if (user) token.role = user.role;
      token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
      return token;
    },

    session: async ({ session, token }) => {
      if (token) session.user = { ...session.user, role: token.role as string };
      return session;
    },

    redirect: async ({ baseUrl }) => baseUrl,
  },
};

export default NextAuth(authOptions);
