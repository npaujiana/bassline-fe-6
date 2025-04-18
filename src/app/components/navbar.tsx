"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeString, setTimeString] = useState("");
  const pathname = usePathname();

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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-black/50 backdrop-blur-lg py-2 shadow-[0_0_15px_rgba(255,59,59,0.3)]" 
        : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo with futuristic design */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:animate-pulse transition-all duration-300"></div>
            <div className="relative bg-black rounded-full p-1.5">
              <img
                src="/images/favicon.ico"
                alt="BASSLINE"
                className="w-7 h-7 rounded-full transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-white font-bold text-xl tracking-wider relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-300 opacity-50 blur"></span>
            <span className="relative">BASSLINE</span>
            <span className="absolute top-full left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-transparent to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </span>
        </Link>

        {/* Digital Clock */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-red-500/20 shadow-[0_0_5px_rgba(255,59,59,0.5)]">
          <span className="text-red-400 font-mono text-sm tracking-widest">
            {timeString}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Map", path: "/map" },
            { label: "Recommendations", path: "/recommendations" }
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`relative px-4 py-2 text-sm transition-all duration-300 overflow-hidden group ${
                isActive(item.path) 
                  ? "text-red-400" 
                  : "text-white hover:text-red-300"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-red-800/40 to-red-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          ))}
          
          {/* Login/Register button with futuristic design */}
          <Link 
            href="/login" 
            className="relative ml-2 px-6 py-1.5 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-full overflow-hidden group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium tracking-wider z-10">
              Login
            </span>
            <span className="absolute inset-0 scale-x-0 group-hover:scale-100 transition-transform duration-500 origin-left bg-gradient-to-r from-red-600/80 via-red-500/80 to-red-400/80"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_120%,rgba(255,69,58,0.5),transparent_80%)]"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative bg-black/30 p-2 rounded-full backdrop-blur-sm"
          aria-label="Toggle mobile menu"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-400/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 blur"></div>
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400"
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
              className="h-5 w-5 text-red-400"
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

      {/* Mobile Menu - Futuristic Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden transform transition-all duration-300 ease-out">
          <div className="bg-black/70 backdrop-blur-md border-t border-red-500/20 animate-slideDown shadow-[0_5px_15px_rgba(255,59,59,0.2)]">
            <div className="flex flex-col space-y-1 p-4">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "Map", path: "/map" },
                { label: "Recommendations", path: "/recommendations" }
              ].map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-red-800/40 to-red-600/40 text-red-400 border-l-2 border-red-500" 
                      : "text-white hover:bg-white/5 hover:text-red-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/login"
                className="mt-2 px-4 py-3 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-lg font-medium text-center"
              >
                Login / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
