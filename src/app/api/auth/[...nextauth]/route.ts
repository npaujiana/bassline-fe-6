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

          if (response.status === 200 && response.data) {
            // Transform the response data into a User object
            return {
              id: response.data.id || response.data._id || 'default-id',
              name: response.data.name || credentials.username,
              email: response.data.email || credentials.username,
              accessToken: response.data.accessToken || response.data.token
            };
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
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
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
    async session({ session, token }: { session: any; token: any }) {
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

// Type validation utility types
type Diff<T extends object> = {
  [K in keyof T]?: Function;
};

function checkFields<T extends object>(_fields: T): void {}

// Validate that exported handlers conform to expected HTTP method handlers
checkFields<Diff<{
  GET?: typeof handler;
  POST?: typeof handler;
  OPTIONS?: typeof handler;
}>>({ GET: handler, POST: handler, OPTIONS: handler });

export { handler as GET, handler as POST };
