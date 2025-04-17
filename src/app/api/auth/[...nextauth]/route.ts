import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axiosInstance from "../../../utils/api";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await axiosInstance.post('/api/login/', {
            username: credentials.username,
            password: credentials.password
          });

          console.log("Login response:", response);

          if (response.status === 200 && response) {
            // Simpan token jika login berhasil
            const user = response;
            return user;
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === 'google') {
        // Jika login dengan Google, kirim token ke backend untuk verifikasi
        try {
          console.log("Google auth account:", account);
          
          // Gunakan GET request ke /login/google-outh2/ dengan parameter query
          const response = await axiosInstance.get('/login/google-outh2/', {
            params: {
              access_token: account.access_token,
              id_token: account.id_token,
              provider: "google",
              email: token.email
            }
          });
          
          console.log("Google auth backend response:", response);
          
          if (response.status === 200 && response.data) {
            // Simpan token dari backend
            token.accessToken = response.data.accessToken;
            token.id = response.data.id;
          }
        } catch (error) {
          console.error("Google auth backend verification error:", error);
        }
      } else if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };