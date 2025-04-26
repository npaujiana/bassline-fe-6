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
  category?: string;
  rating?: number;
  open_hours?: string;
  image_url?: string;
  description?: string;
}



export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Handle form submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      await searchPlaces(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle perubahan input pencarian
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 1) {
      setIsSearching(true);
      void searchAutocomplete(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Search autocomplete using Swagger API
  const searchAutocomplete = async (query: string) => {
    try {
      const api = (await import('src/app/utils/api')).default;
      const response = await api.get('/api/google-maps/places/autocomplete', {
        params: {
          input: query,
        },
      });
      const data = response.data;

      if (data && data.predictions && data.predictions.length > 0) {
        // Transform API results to PlaceResult format
        const enhancedData: PlaceResult[] = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          lat: "", // lat/lon not provided in autocomplete response, can be fetched separately if needed
          lon: "",
          display_name: prediction.description,
          category: prediction.types?.[0] || "establishment",
          rating: 4.0,
          open_hours: "Varies",
          description: `Location in ${prediction.description.split(',').slice(-2)[0] || 'Indonesia'}`
        }));
        setSearchResults(enhancedData);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
      setIsSearching(false);
    } catch (error) {
      console.error("Error searching autocomplete:", error);
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  // Search places using Swagger API
  const searchPlaces = async (query: string) => {
    try {
      const api = (await import('src/app/utils/api')).default;
      const response = await api.get('/api/google-maps/places/search/', {
        params: {
          query: query,
        },
      });
      const data = response.data;

      if (data && data.results && data.results.length > 0) {
        // Transform API results to PlaceResult format
        const enhancedData: PlaceResult[] = data.results.map((item: any) => ({
          place_id: item.id.toString(),
          lat: item.latitude.toString(),
          lon: item.longitude.toString(),
          display_name: item.name,
          category: item.category,
          rating: item.rating,
          open_hours: item.open_hours,
          image_url: item.image_url,
          description: item.description,
        }));
        setSearchResults(enhancedData);
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
    // Pass more complete information via URL params
    const locationData = {
      name: place.display_name,
      lat: place.lat,
      lon: place.lon,
      category: place.category,
      rating: place.rating
    };
    router.push(`/search?q=${encodeURIComponent(place.display_name)}&data=${encodeURIComponent(JSON.stringify(locationData))}`);
  };

  const handleMapClick = () => {
    router.push('/search?q=&showMap=true');
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
    <main className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative w-[15rem] h-[15rem]">
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

            <h1 className="animate-glow mb-2 text-2xl sm:text-3xl font-bold text-primary md:text-4xl">
              BASSLINE
            </h1>
            <p className="mb-4 text-sm sm:text-base text-tertiary">
              The City Never Sleeps, Neither Should You.
            </p>
            <p className="mb-3 text-sm sm:text-base text-tertiary font-medium">
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
                    className="w-full rounded-full border border-accent-200 bg-secondary px-4 py-2 sm:px-5 sm:py-3 pr-10 sm:pr-12 text-tertiary shadow-md focus:ring-2 focus:ring-primary focus:outline-none text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-primary p-1.5 sm:p-2 text-secondary transition-colors duration-300 hover:bg-primary-800"
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="absolute z-[1001] mt-2 max-h-[50vh] w-full overflow-y-auto rounded-md border border-accent-200 bg-secondary shadow-xl">
                  {searchResults.map((place, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-start border-b border-accent-200 p-3 hover:bg-accent-50"
                      onClick={() => handleSelectPlace(place)}
                    >
                      <div className="mt-1 mr-3 text-primary">
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
                        <p className="font-medium text-tertiary">
                          {place.display_name.split(",")[0]}
                        </p>
                        <p className="mt-1 text-sm text-accent-600">
                          {place.display_name}
                        </p>
                        {place.category && (
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-primary-100 text-primary px-2 py-0.5 rounded">
                              {place.category}
                            </span>
                            {place.rating && (
                              <span className="ml-2 text-xs flex items-center text-accent-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {place.rating}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-tertiary">
                {
                  "Try searching for: Monas Jakarta, Pantai Kuta Bali, Malioboro Yogyakarta, Borobudur"
                }
              </div>
            </div>
            <p onClick={handleMapClick} className="mt-4 text-sm sm:text-base text-primary font-medium underline cursor-pointer">
              OR GO STRAIGHT TO OUR MAP
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

