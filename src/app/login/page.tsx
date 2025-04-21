"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the auth context
  const { login, isAuthenticated, user } = useAuth();

  // Check if user is already logged in and redirect appropriately
  useEffect(() => {
    // Check for access token in localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken || isAuthenticated) {
      // Get user info from localStorage to check admin status
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.isAdmin) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } catch (e) {
          // If there's an error parsing, default to homepage
          router.push("/");
        }
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, router]);

  // Menampilkan pesan sukses jika user berhasil register
  useEffect(() => {
    if (registered === "true") {
      setSuccess("Registrasi berhasil! Silakan login dengan akun baru Anda.");
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!username || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      // Use the login function from AuthContext
      const result = await login(username, password);
      
      if (!result.success) {
        setError(result.error || "Login gagal. Periksa email dan password Anda.");
      } else {
        // Check if the logged-in user is an admin
        const userInfoStr = localStorage.getItem("userInfo");
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo.isAdmin) {
              // Redirect admin users to dashboard
              router.push("/dashboard");
            } else {
              // Redirect regular users to homepage
              router.push("/");
            }
          } catch (e) {
            // Default to homepage if there's an error
            router.push("/");
          }
        } else {
          router.push("/");
        }
        
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // This would need to be implemented in the AuthContext if needed
      setError("Google sign-in belum diimplementasikan");
      setIsLoading(false);
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Terjadi kesalahan saat login dengan Google. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-700 via-red-500 to-red-800 p-4">
      <div className="w-full max-w-md transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
        <div className="relative space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-red-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-24 h-24 bg-white/20 rounded-full filter blur-2xl opacity-50 animate-pulse delay-1000"></div>

          <div className="text-center relative z-10">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Access your BASSLINE account
            </p>
          </div>

          {error && (
            <div className="relative z-10 rounded-md bg-red-600/80 p-4 border border-red-400/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.293a1 1 0 001.414 0L12 12.414l1.293-1.293a1 1 0 10-1.414-1.414L10.586 11 9.293 9.707a1 1 0 00-1.414 1.414L9.172 12l-1.179 1.179a1 1 0 000 1.414z" clipRule="evenodd" /></svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="relative z-10 rounded-md bg-green-600/80 p-4 border border-green-400/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">{success}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="relative block w-full appearance-none rounded-md border border-white/30 bg-white/20 px-3 py-2.5 text-white placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-white/30 bg-white/20 px-3 py-2.5 text-white placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out mt-4"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-red-500 to-red-700 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-400/30"></div>
              <span className="flex-shrink mx-4 text-gray-300 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-400/30"></div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center rounded-md border border-white/30 bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#FFFFFF"/>
                </svg>
                Google
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-300">
              No account?{' '}
              <Link
                href="/register"
                className="font-medium text-red-300 hover:text-red-200 hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
