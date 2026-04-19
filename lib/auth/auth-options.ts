import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import { getNextAuthSecret } from "@/lib/auth/constants";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoFindUserByEmail, demoUpsertGoogleUser } from "@/lib/demo/local-store";
import { User } from "@/models/User";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

const providers: NextAuthOptions["providers"] = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      if (isDemoMode()) {
        const existingUser = await demoFindUserByEmail(parsed.data.email);
        if (!existingUser?.password) {
          return null;
        }

        const isPasswordValid = await compare(parsed.data.password, existingUser.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(existingUser._id),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
          role: existingUser.role,
        };
      }

      await connectToDatabase();
      const existingUser = await User.findOne({ email: parsed.data.email }).lean();

      if (!existingUser?.password) {
        return null;
      }

      const isPasswordValid = await compare(parsed.data.password, existingUser.password);

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: String(existingUser._id),
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
        role: existingUser.role,
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: getNextAuthSecret(),
  pages: {
    signIn: "/sign-in",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      if (isDemoMode()) {
        await demoUpsertGoogleUser({
          name: user.name ?? "Traveler",
          email: user.email,
          image: user.image ?? null,
        });
        return true;
      }

      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name ?? "Traveler",
          email: user.email,
          image: user.image ?? null,
          role: "user",
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "user" | "admin") ?? "user";
      }
      return session;
    },
  },
};
