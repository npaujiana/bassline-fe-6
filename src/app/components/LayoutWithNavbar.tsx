"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { useAuth } from "../contexts/AuthContext";

export default function LayoutWithNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Check for pages that don't need navbar
  const isLoginPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage = pathname.startsWith("/dashboard");
  
  // Show navbar only if not on login/register pages and not on dashboard pages
  const showNavbar = !isLoginPage && !isDashboardPage;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}