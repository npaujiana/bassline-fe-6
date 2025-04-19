"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance, { registerUser } from "../utils/api";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi form
    if (!username || !email || !password) {
      setError("Username, Email, dan Password harus diisi");
      return;
    }

    setIsLoading(true);

      try {
      // Panggil API register dengan fungsi khusus yang menggunakan header spesifik
      const response = await registerUser({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      if (response.status === 201 || response.status === 200) {
        // Registrasi berhasil, arahkan ke halaman login
        router.push('/login?registered=true');
      } else {
        setError("Registrasi gagal. Silahkan coba lagi.");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response) {
        try {
          const data = typeof error.response.data === 'string' ? JSON.parse(error.response.data) : error.response.data;
          if (data?.username) {
            setError(`Username: ${data.username.join(', ')}`);
          } else if (data?.email) {
            setError(`Email: ${data.email.join(', ')}`);
          } else if (data?.password) {
            setError(`Password: ${data.password.join(', ')}`);
          } else if (data?.message) {
            setError(data.message);
          } else if (data?.error) {
            setError(data.error);
          } else {
            setError('Terjadi kesalahan saat registrasi');
          }
        } catch (parseError) {
          setError('Terjadi kesalahan saat registrasi');
        }
      } else {
        setError('Terjadi kesalahan jaringan. Silahkan coba lagi nanti.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-700 via-red-500 to-red-800 p-4">
      <div className="w-full max-w-md transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
        <div className="relative space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
          {/* Optional: Add some decorative elements */}
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-red-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-24 h-24 bg-white/20 rounded-full filter blur-2xl opacity-50 animate-pulse delay-1000"></div>

          <div className="text-center relative z-10">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Join BASSLINE today
            </p>
          </div>

          {error && (
            <div className="relative z-10 rounded-md bg-red-600/80 p-4 border border-red-400/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Error Icon */}
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.293a1 1 0 001.414 0L12 12.414l1.293-1.293a1 1 0 10-1.414-1.414L10.586 11 9.293 9.707a1 1 0 00-1.414 1.414L9.172 12l-1.179 1.179a1 1 0 000 1.414z" clipRule="evenodd" /></svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-px">
            <div className="pt-4">
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="relative block w-full appearance-none rounded-md border border-white/30 bg-white px-3 py-2.5 text-black placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="relative block w-full appearance-none rounded-md border border-white/30 bg-white px-3 py-2.5 text-black placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full appearance-none rounded-md border border-white/30 bg-white px-3 py-2.5 text-black placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-white/30 bg-white px-3 py-2.5 text-black placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-white/30 bg-white px-3 py-2.5 text-black placeholder-gray-400 focus:z-10 focus:border-red-400 focus:outline-none focus:ring-red-400 sm:text-sm transition duration-300 ease-in-out"
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
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </div>
             <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-red-300 hover:text-red-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
