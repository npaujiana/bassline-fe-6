"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";

// Admin Layout with responsive sidebar
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { logout } = useAuth();

  // Menu items for the sidebar
  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      href: "/dashboard",
    },
    {
      name: "Venues",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8V7a1 1 0 00-1-1H6a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1z" clipRule="evenodd" />
        </svg>
      ),
      href: "/dashboard/venues",
    },
    {
      name: "Amenities",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      href: "/dashboard/amenities",
    },
    {
      name: "Tags",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      href: "/dashboard/tags",
    },
    {
      name: "Genres",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      ),
      href: "/dashboard/genres",
    },
    {
      name: "Ambiances",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      ),
      href: "/dashboard/ambiances",
    },
    {
      name: "Crowd Types",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      href: "/dashboard/crowd-types",
    },
    {
      name: "Articles",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
      ),
      href: "/dashboard/articles",
    },
    {
      name: "User Management",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      href: "/dashboard/users",
    },
  ];

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle resize events to manage mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation effect for menu items
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentMenuItem = menuItems.find(item => pathname === item.href);
      if (currentMenuItem) {
        setActiveMenu(currentMenuItem.name);
      } else {
        // Check if we're in a submenu
        const parentMenu = menuItems.find(item => pathname.startsWith(item.href + '/'));
        if (parentMenu) {
          setActiveMenu(parentMenu.name);
        }
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col w-64 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-xl transition-all duration-300 z-30`}>
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-white/10">
          <div className="px-4 py-6">
            <div className="text-2xl font-bold text-white flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                <img
                  src="/images/favicon.ico"
                  alt="BASSLINE"
                  className="w-10 h-10"
                />
              </div>
              Bassline
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <Link 
                  href={item.href}
                  key={item.name}
                  className={`flex items-center px-4 py-3 transition-all duration-200 ease-in-out rounded-lg group ${
                    isActive 
                      ? 'bg-white text-red-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`mr-3 transition-all ${isActive ? 'text-red-600' : 'text-white/70 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-white/70">admin@bassline.com</p>
            </div>
            <div className="ml-auto">
              <button className="p-1 text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Overlay) */}
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-xl transition-transform duration-300 ease-in-out transform z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        {/* Mobile Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-white/10">
          <div className="px-4 py-6">
            <div className="text-2xl font-bold text-white flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                <img
                  src="/images/favicon.ico"
                  alt="BASSLINE"
                  className="w-10 h-10"
                />
              </div>
              Bassline
            </div>
          </div>
        </div>
        
        {/* Mobile Menu items */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <Link 
                  href={item.href}
                  key={item.name}
                  className={`flex items-center px-4 py-3 transition-all duration-200 ease-in-out rounded-lg group ${
                    isActive 
                      ? 'bg-white text-red-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`mr-3 transition-all ${isActive ? 'text-red-600' : 'text-white/70 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile User profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-white/70">admin@bassline.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm z-20">
          <div className="px-4 py-3 flex justify-between items-center">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Page title - derived from active menu */}
            <div className="text-lg font-semibold text-gray-800 lg:ml-4">
              {activeMenu || "Dashboard"}
            </div>
            
            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Notification */}
              <button className="text-gray-500 hover:text-gray-700 relative focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Help */}
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
              
              {/* Mobile profile - only visible on smaller screens */}
              <div className="lg:hidden">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
      
      {/* Futuristic Decorative Elements - absolute positioned elements for aesthetics */}
      <div className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-tr from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white z-30 cursor-pointer hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    </div>
  );
}