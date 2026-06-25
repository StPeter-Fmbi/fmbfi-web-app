import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

    import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

// Shared function to get user from DB by email
async function getUserByEmail(email: string) {
  const usersResult =
    await sql`SELECT * FROM tblusers WHERE email = ${email} LIMIT 1`;

  const user = usersResult[0];
  if (!user) return null;

  return {
    id: user.scholardid,
    name: user.username,
    email: user.email,
    role: user.role,
    isPasswordChanged: Boolean(user.isPasswordChanged),
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

    if (!email || !password) {
      return null;
    }

    const usersResult = await sql`
      SELECT *
      FROM tblusers
      WHERE email = ${email}
      LIMIT 1
    `;

    const user = usersResult[0];

    if (!user) {
      return null;
    }

    let isValidPassword = false;

    // Legacy accounts (plaintext password)
    if (
      user.isPasswordChanged === 0 ||
      user.isPasswordChanged === false ||
      user.isPasswordChanged === null
    ) {
      isValidPassword = user.password === password;
    }
    // Updated accounts (bcrypt password)
    else {
      isValidPassword = await bcrypt.compare(
        password,
        user.password
      );
    }

    if (!isValidPassword) {
      return null;
    }

    return {
      id: String(user.scholarid),
      name: user.username,
      email: user.email,
      role: user.role || "User",
      isPasswordChanged: Boolean(user.isPasswordChanged),
    };
  },
}),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user.email) return false;

      // For Google, fetch user from DB to attach role, id, and name
      if (account?.provider === "google") {
        const dbUser = await getUserByEmail(user.email);
        if (!dbUser) throw new Error("AccessDenied");

        user.id = dbUser.id;
        user.name = dbUser.name;
        user.role = dbUser.role;
      }

      return true;
    },

    jwt: async ({ token, user }) => {
    if (user) {
      token.role = user.role;
      token.isPasswordChanged = user.isPasswordChanged;
    }

    console.log("JWT Token:", token);

    return token;
  },

    session: async ({ session, token }) => {
  if (token) {
    session.user = {
      ...session.user,
      role: token.role as string,
      isPasswordChanged: token.isPasswordChanged as boolean,
    };
  }

  return session;
},

    redirect: async ({ baseUrl }) => baseUrl,
  },
};

export default NextAuth(authOptions);
