import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocationFinder - Temukan Lokasi Impian Anda",
  description: "Aplikasi pencarian lokasi dengan tampilan futuristik",
  icons: [{ rel: "icon", url: "images/favicon.ico" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white relative overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
