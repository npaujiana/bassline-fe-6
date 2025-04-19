"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loading from "../components/Loading";

// Import LocationSearch component with CSR
const LocationSearch = dynamic(() => import("../components/LocationSearch"), { ssr: false });

// Loading component for suspense fallback
function SearchLoading() {
  return <Loading text="Loading location search..." />;
}

// Component that uses useSearchParams()
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const showMap = searchParams.get("showMap") === "true";
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

  // Show map even when query is empty if showMap parameter is true
  if (!query && !showMap) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center relative bg-white">
          <div className="text-center z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl w-full max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">No search keyword</h1>
            <p className="mb-6 text-sm sm:text-base text-red-500">Please return to the home page to search for a location</p>
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
                Back to Search
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
        <div className="">
         
          
          <div className="bg-white shadow-md sm:mb-8">
            {isLoading ? (
              <Loading text="Loading location search..." />
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