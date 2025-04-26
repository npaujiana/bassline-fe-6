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
        ? "bg-tertiary py-2 shadow-md" 
        : "bg-tertiary py-4"
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo with updated design */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="relative">
            <div className="relative bg-secondary/10 rounded-full p-1.5 border border-secondary/50">
              <img
                src="/images/favicon.ico"
                alt="BASSLINE"
                className="w-7 h-7 rounded-full transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-secondary font-bold text-xl tracking-wider relative">
            <span className="relative">BASSLINE</span>
            <span className="absolute top-full left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </span>
        </Link>

        {/* Digital Clock with updated design */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bg-tertiary px-4 py-1 rounded-full border border-secondary/30 shadow-md">
          <span className="text-secondary font-mono text-sm tracking-widest">
            {timeString}
          </span>
        </div>

        {/* Desktop Menu with updated design */}
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
                  ? "text-secondary font-medium" 
                  : "text-secondary/80 hover:text-secondary"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-0"></span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          ))}
          
          {/* Conditionally render login button or logout button */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="relative ml-2 px-6 py-1.5 bg-secondary text-primary font-medium rounded-full overflow-hidden group hover:bg-primary hover:text-secondary transition-all duration-300"
            >
              <span className="text-sm font-medium tracking-wider">
                Logout
              </span>
            </button>
          ) : (
            <Link 
              href="/login" 
              className="relative ml-2 px-6 py-1.5 bg-secondary text-primary font-medium rounded-full overflow-hidden group hover:bg-primary hover:text-secondary transition-all duration-300"
            >
              <span className="text-sm font-medium tracking-wider">
                Login
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative bg-secondary/10 p-2 rounded-full border border-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-secondary"
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
              className="h-5 w-5 text-secondary"
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

      {/* Mobile Menu - Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden transform transition-all duration-300 ease-out mt-4">
          <div className="bg-tertiary backdrop-blur-md border-t border-secondary/30 animate-slideDown shadow-md">
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
                      ? "bg-primary/20 text-secondary border-l-2 border-primary" 
                      : "text-secondary/80 hover:bg-primary/10 hover:text-secondary hover:border-l-2 hover:border-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="mt-3 px-4 py-3 bg-secondary text-primary rounded-lg font-medium text-center hover:bg-primary hover:text-secondary transition-all duration-300 shadow-md"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="mt-3 px-4 py-3 bg-secondary text-primary rounded-lg font-medium text-center hover:bg-primary hover:text-secondary transition-all duration-300 shadow-md"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decorative accent line at bottom of navbar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-secondary/30"></div>
    </nav>
  );
}
