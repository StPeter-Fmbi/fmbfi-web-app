import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          // Call the custom login API
          const res = await fetch(`${process.env.API_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          console.log("Credentials:", { email, password });
          console.log("API URL:", `${process.env.API_URL}/api/login`);

          if (!res.ok) {
            throw new Error("Invalid email or password");
          }

          const user = await res.json();

          // Return the user object with role
          if (user) {
            return {
              id: user.id, // Using email as ID for simplicity
              email: user.email,
              role: user.role,
            };
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Login error:", error.message);
          } else {
            console.error("Login error:", error);
          }
          throw new Error("Invalid email or password");
        }

        // Return null if user data is not available
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Token expires in 24 hours
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          role: token.role as string,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
