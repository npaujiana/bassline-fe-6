"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeString, setTimeString] = useState("");
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Update current time
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }));
    };

    window.addEventListener("scroll", handleScroll);
    
    // Set up time interval
    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-red-950/90 backdrop-blur-lg py-2 shadow-[0_2px_20px_rgba(255,0,0,0.4)]" 
        : "bg-red-900/80 backdrop-blur-md py-4"
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo with enhanced red/white design */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-700 to-red-500 rounded-full opacity-80 group-hover:opacity-100 blur-sm group-hover:animate-pulse transition-all duration-300"></div>
            <div className="relative bg-white/10 rounded-full p-1.5 border border-white/50">
              <img
                src="/images/favicon.ico"
                alt="BASSLINE"
                className="w-7 h-7 rounded-full transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-white font-bold text-xl tracking-wider relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 opacity-50 blur"></span>
            <span className="relative">BASSLINE</span>
            <span className="absolute top-full left-0 w-full h-0.5 bg-gradient-to-r from-white via-red-300 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </span>
        </Link>

        {/* Digital Clock with enhanced red/white theme */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bg-red-950/60 px-4 py-1 rounded-full backdrop-blur-sm border border-white/30 shadow-[0_0_10px_rgba(255,0,0,0.6)]">
          <span className="text-white font-mono text-sm tracking-widest">
            {timeString}
          </span>
        </div>

        {/* Desktop Menu with enhanced red/white theme */}
        <div className="hidden md:flex space-x-4">
          {[
            { label: "Home", path: "/" },
            { label: "Recommendations", path: "/recommendations" }
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`relative flex justify-center px-4 py-2 text-sm transition-all duration-300 overflow-hidden group ${
                isActive(item.path) 
                  ? "text-white font-medium" 
                  : "text-white/80 hover:text-white"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]"></span>
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-red-700/60 to-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          ))}
          
          {/* Conditionally render login button or logout button with enhanced red/white theme */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="relative w-20 ml-2 px-6 py-1.5 bg-gradient-to-r from-white to-white/90 text-red-700 font-medium rounded-full overflow-hidden group hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium tracking-wider z-10">
                Logout
              </span>
              <span className="absolute inset-0 scale-x-0 group-hover:scale-100 transition-transform duration-500 origin-left bg-gradient-to-r from-white/90 via-red-100 to-white/90"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent_80%)]"></span>
            </button>
          ) : (
            <Link 
              href="/login" 
              className="relative ml-2 px-6 py-1.5 bg-gradient-to-r from-white to-white/90 text-red-700 font-medium rounded-full overflow-hidden group hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium tracking-wider z-10">
                Login
              </span>
              <span className="absolute inset-0 scale-x-0 group-hover:scale-100 transition-transform duration-500 origin-left bg-gradient-to-r from-white/90 via-red-100 to-white/90"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent_80%)]"></span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button with enhanced red/white theme */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/30"
          aria-label="Toggle mobile menu"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 blur"></div>
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu - Futuristic Dropdown with enhanced red/white theme */}
      {isMobileMenuOpen && (
        <div className="md:hidden transform transition-all duration-300 ease-out mt-4">
          <div className="bg-gradient-to-b from-red-900/90 to-red-950/90 backdrop-blur-md border-t border-white/30 animate-slideDown shadow-[0_5px_20px_rgba(255,0,0,0.3)]">
            <div className="flex flex-col space-y-1 p-4">
              {[
                { label: "Home", path: "/" },
                { label: "Recommendations", path: "/recommendations" }
              ].map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path) 
                      ? "bg-white/20 text-white border-l-2 border-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="mt-3 px-4 py-3 bg-white text-red-700 rounded-lg font-medium text-center hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="mt-3 px-4 py-3 bg-white text-red-700 rounded-lg font-medium text-center hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decorative accent line at bottom of navbar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </nav>
  );
}
