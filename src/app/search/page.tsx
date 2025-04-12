"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import komponen LocationSearch dengan CSR
const LocationSearch = dynamic(() => import("../components/LocationSearch"), { ssr: false });

// Loading component for suspense fallback
function SearchLoading() {
  return (
    <div className="h-[500px] bg-white/5 backdrop-blur-md flex items-center justify-center rounded-xl border border-white/20 shadow-xl">
      <div className="text-center">
        <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-base sm:text-xl text-red-600">Memuat pencarian lokasi...</p>
      </div>
    </div>
  );
}

// Component that uses useSearchParams()
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [isLoading, setIsLoading] = useState(true);

  // Decode the search query
  const decodedQuery = query ? decodeURIComponent(query) : "";

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!query) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center relative bg-white">
          <div className="text-center z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl w-full max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">Tidak ada kata kunci pencarian</h1>
            <p className="mb-6 text-sm sm:text-base text-red-500">Silakan kembali ke halaman utama untuk mencari lokasi</p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300 transform group-hover:translate-y-full"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 to-red-900 transition-all duration-300 transform -translate-y-full group-hover:translate-y-0"></span>
              <span className="relative flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Kembali ke Pencarian
              </span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="container">
         
          
          <div className="bg-white shadow-md sm:mb-8">
            {isLoading ? (
              <div className="h-[500px] bg-white/5 backdrop-blur-md flex items-center justify-center rounded-xl border border-white/20 shadow-xl">
                <div className="text-center">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full animate-ping"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-base sm:text-xl text-red-600">Memuat pencarian lokasi...</p>
                </div>
              </div>
            ) : (
              <LocationSearch initialQuery={decodedQuery} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Main page component with suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}