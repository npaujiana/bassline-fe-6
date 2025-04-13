"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import Navbar from "./components/navbar";

// Tipe untuk hasil pencarian
interface PlaceResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle perubahan input pencarian
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      setIsSearching(true);
      void searchPlaces(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Search places dengan Nominatim API (OpenStreetMap)
  const searchPlaces = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=id`,
      );
      const data = (await response.json()) as PlaceResult[];

      if (data && data.length > 0) {
        setSearchResults(data);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
      setIsSearching(false);
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  // Handle klik pada hasil pencarian
  const handleSelectPlace = (place: PlaceResult) => {
    setSearchQuery(place.display_name.split(",")[0] ?? "");
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(place.display_name)}`);
  };

  const handleMapClick = () => {
    router.push('/search?q=map');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative h-50 w-50 sm:h-50 sm:w-50 md:h-50 md:w-50">
                <Image
                  src="/images/favicon.ico"
                  alt="BASSLINE Logo"
                  fill
                  sizes="(max-width: 640px) 10rem, (max-width: 768px) 6rem, 8rem"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="animate-glow mb-2 text-2xl sm:text-3xl font-bold text-red-600 md:text-4xl">
              BASSLINE
            </h1>
            <p className="mb-4 text-sm sm:text-base text-red-500">
              The City Never Sleeps, Neither Should You.
            </p>
            <p className="mb-3 text-sm sm:text-base text-red-500 font-medium">
              WHAT ARE YOU FEELING TONIGHT?
            </p>

            <div
              ref={searchRef}
              className="relative mx-auto max-w-xs sm:max-w-md md:max-w-lg"
            >
              <form
                onSubmit={handleSearch}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search location name..."
                    className="w-full rounded-full border border-red-200 bg-white px-4 py-2 sm:px-5 sm:py-3 pr-10 sm:pr-12 text-red-600 shadow-md focus:ring-2 focus:ring-red-500 focus:outline-none text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-red-500 p-1.5 sm:p-2 text-white transition-colors duration-300 hover:bg-red-600"
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </form>

              {/* Search results dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-[1001] mt-2 max-h-[50vh] w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl">
                  {searchResults.map((place, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-start border-b border-gray-200 p-3 hover:bg-red-50"
                      onClick={() => handleSelectPlace(place)}
                    >
                      <div className="mt-1 mr-3 text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {place.display_name.split(",")[0]}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {place.display_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-red-400">
                {
                  "Try searching for: Monas Jakarta, Pantai Kuta Bali, Malioboro Yogyakarta, Borobudur"
                }
              </div>
            </div>
            <p className="mt-4 text-sm sm:text-base text-red-500 font-medium">
              OR GO STRAIGHT TO OUR <span onClick={handleMapClick} className="underline cursor-pointer">MAP</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
