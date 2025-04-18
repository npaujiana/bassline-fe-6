"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loading from "../components/Loading";
// import Navbar from "../components/navbar";

// Import MapView dynamically with SSR disabled
const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

function MapContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q");
  const [isLoading, setIsLoading] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);

  // Decode the search query
  const decodedQuery = query ? decodeURIComponent(query) : "";

  useEffect(() => {
    // Simulate loading time for the map and location data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!query) {
    return (
      <>
        {/* <Navbar /> */}
       
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-white">
        <div className="container mx-auto ">
          
          <div className="">
            {isLoading ? (
              <Loading text={isEnglish ? "Loading map and location data..." : "Memuat peta dan informasi lokasi..."} />
            ) : (
              <div>
                <MapView searchQuery={decodedQuery} />
              </div>
            )}
          </div>
          
          <div className="text-center mt-6 sm:mt-8 pb-6">
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              className="px-4 sm:px-6 py-2 bg-white text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors duration-300 text-xs sm:text-sm font-medium"
            >
              {isEnglish ? "Bahasa Indonesia 🇮🇩" : "English 🇬🇧"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// Loading fallback for Suspense
function MapLoading() {
  return <Loading text="Loading map page..." />;
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapLoading />}>
      <MapContent />
    </Suspense>
  );
}
