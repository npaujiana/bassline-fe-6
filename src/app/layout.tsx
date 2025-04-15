import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Bassline - Find Your Dream Location",
  description: "Location search application with futuristic interface",
  icons: [{ rel: "icon", url: "images/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white relative overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
