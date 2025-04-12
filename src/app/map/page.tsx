"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
// import Navbar from "../components/navbar";

// Importar MapView de forma dinámica con SSR desactivado
// const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

export default function MapPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
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
              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white/5 backdrop-blur-md flex items-center justify-center rounded-xl border border-white/20 shadow-xl">
                <div className="text-center">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full animate-ping"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-base sm:text-xl text-red-600">{isEnglish ? "Loading map and location data..." : "Memuat peta dan informasi lokasi..."}</p>
                </div>
              </div>
            ) : (
              // <MapView searchQuery={decodedQuery} />
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
