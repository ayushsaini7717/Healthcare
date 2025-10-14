import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Username and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        if (!user.isEmailVerified) {
          await fetch(`${process.env.BASEURL}/api/otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          throw new Error("OTP sent to your email. Please verify before logging in.");
        }

        return {
          id: user.id,
          username: user.email,
          email: user.email,
        };
      },
    }),
  ],
   session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: "/login", // optional
  },
   callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "github") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.login || "GitHub User",
              password: "", 
              role: "PATIENT", 
              isEmailVerified: true, 
            },
          });
        }
        if (existingUser) {
          user.id = existingUser.id;
          user.role = existingUser.role; 
          user.email = existingUser.email;
        }
      }
      return true;
    },
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // <-- CRUCIAL: Add role to JWT token
      } else if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { role: true },
        });
        if (dbUser) {
            token.role = dbUser.role;
        }
      }
      return token;
    },
    
    async session({ session, token }:any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as 'PATIENT' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN'; // <-- CRUCIAL: Expose role
      }
      return session;
    },
  },
}
