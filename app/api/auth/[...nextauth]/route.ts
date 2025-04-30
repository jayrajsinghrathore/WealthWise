// export { handler as GET, handler as POST }
// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import GitHubProvider from "next-auth/providers/github"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"
// import type { NextAuthOptions } from "next-auth"
// import bcrypt from "bcryptjs" // Required for credential auth password check

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         })

//         if (!user || !user.password) {
//           throw new Error("Invalid email or password")
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password)
//         if (!isValid) {
//           throw new Error("Invalid email or password")
//         }

//         return user
//       },
//     }),
//   ],
//   session: {
//     strategy: "database", // ✅ Use database sessions
//   },
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//     error: "/login",
//     newUser: "/signup",
//   },
//   callbacks: {
//     async session({ session, user }) {
//       // With DB sessions, `user` is available directly
//       if (session.user) {
//         session.user.id = user.id
//       }
//       return session
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development",
// }

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // If no user was found or the user doesn't have a password
        if (!user || !user.password) {
          throw new Error("No user found with this email or password not set")
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
    newUser: "/signup", // New users will be directed here on first sign in
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Add access_token to the token right after sign-in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        }
      }
      return token
    },
    async session({ session, token }) {
      // Add properties to session, like an access_token and userId
      if (session.user) {
        session.user.id = token.userId as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  session: {
    strategy: "database", // Using database strategy
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

