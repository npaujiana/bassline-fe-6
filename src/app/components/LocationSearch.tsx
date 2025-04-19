"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";

// Component to update map position
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  // Not needed with Google Maps as we'll control the map directly
  return null;
}

// Props type for LocationSearch
interface LocationSearchProps {
  initialQuery?: string;
}

// Type for search results
interface PlaceResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  category?: string;
  address?: Record<string, string>;
  image_url?: string;
}

// Default map center (San Francisco, USA)
const defaultCenter: [number, number] = [37.7749, -122.4194];

// Filter categories data
const categories = [
  { id: "location_proximity", name: "Location & Proximity", icon: "📍" },
  { id: "closing_time", name: "Closing Time", icon: "⏰" },
  { id: "venue_type", name: "Venue Type", icon: "🏢" },
  { id: "music_genre", name: "Music Genre", icon: "🎵" },
  { id: "ambiance_crowd", name: "Ambiance & Crowd Density", icon: "🎉" },
  { id: "price_range", name: "Price Range", icon: "💲" },
  { id: "dress_code", name: "Dress Code / Vibe", icon: "👗" },
  { id: "crowd_social", name: "Crowd & Social Scene", icon: "🧑‍🤝‍🧑" },
  { id: "real_time", name: "Real-Time Data & Practical Filters", icon: "⏳" },
];

// Define dropdown options for each category with more specific values
const dropdownOptions = {
  location_proximity: [
    "Distance from current location",
    "Walkability between spots",
    "Neighborhood-based recommendations",
  ],
  closing_time: [
    "Open now",
    "Open past 2 AM",
    "24-hour spots",
    "Last entry time",
  ],
  venue_type: [
    "Bar",
    "Club",
    "Lounge",
    "After-hours spot",
    "Late-night restaurant",
  ],
  music_genre: [
    "Hip-hop / R&B",
    "House / Techno",
    "Jazz / Blues",
    "Live Music / Bands",
    "Mixed / Open format",
  ],
  ambiance_crowd: [
    "Chill / Low-key",
    "Lively but not packed",
    "High-energy / Party vibes",
    "Exclusive / VIP",
  ],
  price_range: ["$ (Budget-friendly)", "$$", "$$$"],
  dress_code: ["Casual", "Smart Casual", "Dressy / Fancy"],
  crowd_social: [
    "LGBTQ+ friendly",
    "College crowd",
    "Trendy / Influencer spots",
    "Industry / Music scene",
  ],
  real_time: [
    "Live crowd updates (empty / moderate / packed)",
    "Queue wait times",
    "Reservations required or walk-in friendly",
  ],
};

// Sample bar data
const barData = [
  {
    id: 1,
    name: "Bart Part Time",
    address: "496 14th St, San Francisco, CA 94103, Amerika Serikat",
    lat: 37.7679863,
    lon: -122.4246939,
    type: "venue",
    venueType: "Bar",
    genre: "Jazz",
    musicGenre: "Jazz",
    rating: "4.5",
    reviews: "173",
    openTime: "5:00 PM",
    closeTime: "00:00 AM",
    phone: "+16693339463",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipMoS60Pk6Mx8r52E0_S2a44U6hHsXsbUOhbmWuQ=w408-h306-k-no",
    promos: ["Happy Hour", "Live Music"],
  },
  {
    id: 2,
    name: "Rooftop Lounge",
    address: "456 Broadway",
    lat: 40.7232,
    lon: -73.9982,
    type: "venue",
    venueType: "Lounge",
    genre: "EDM",
    musicGenre: "EDM",
    rating: "4.8",
    reviews: "200",
    openTime: "6:00 PM",
    closeTime: "3:00 AM",
    phone: "555-5678",
    image: "https://via.placeholder.com/400x300?text=Rooftop+Lounge",
    promos: ["VIP Tables", "Guest DJs"],
  },
];

export default function LocationSearch({
  initialQuery = "",
}: LocationSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q");

  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [locationPhotos, setLocationPhotos] = useState<string[]>([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const cardHeight = "29vh"; // Reduced height
  const cardZIndex = 1000;

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState("location_proximity");
  const [poiMarkers, setPoiMarkers] = useState(barData.filter((bar) => bar.type === "venue"));
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    location_proximity: [],
    closing_time: [],
    venue_type: [],
    music_genre: [],
    ambiance_crowd: [],
    price_range: [],
    dress_code: [],
    crowd_social: [],
    real_time: [],
  });
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["marker"]  // Add marker library to use AdvancedMarkerElement
  });

  const customIcon = useMemo(() => {
    if (!isLoaded || typeof google === "undefined") return null;

    return {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23EA4335' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3'%3E%3C/circle%3E%3C/svg%3E",
    };
  }, [isLoaded]);

  const validCenter = selectedLocation || defaultCenter;

  const handleCategoryFilter = (categoryId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const dropdownPosition = {
      top: buttonRect.bottom + window.scrollY + 8, // Add spacing of 8px
      left: buttonRect.left + window.scrollX,
    };

    if (selectedCategory === categoryId) {
      setShowDropdown(showDropdown === categoryId ? null : categoryId);
    } else {
      setSelectedCategory(categoryId);
      setShowDropdown(categoryId);
    }

    setDropdownPosition(dropdownPosition);
  };

  const handleFilterOptionSelect = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentOptions = prev[category] || [];

      let newOptions;
      if (currentOptions.includes(option)) {
        newOptions = currentOptions.filter((item) => item !== option);
      } else {
        newOptions = [...currentOptions, option];
      }

      const updatedFilters = {
        ...prev,
        [category]: newOptions,
      };

      applyFilters(updatedFilters);

      return updatedFilters;
    });
  };

  const applyFilters = useCallback((filters: Record<string, string[]>) => {
    let filteredData = [...barData];

    if (filters.venue && filters.venue.length > 0) {
      filteredData = filteredData.filter((bar) =>
        filters.venue?.includes(bar.venueType),
      );
    }

    if (filters.time && filters.time.length > 0) {
      filteredData = filteredData.filter((bar) =>
        filters.time?.includes(bar.openTime),
      );
    }

    if (filters.genre && filters.genre.length > 0) {
      filteredData = filteredData.filter((bar) =>
        filters.genre?.includes(bar.musicGenre),
      );
    }

    setPoiMarkers(filteredData);
  }, []);

  useEffect(() => {
    applyFilters(selectedFilters);
  }, [applyFilters, selectedFilters]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchPlaces(query);
    }
  }, [query]);

  const handleSelectPlace = useCallback((place: PlaceResult) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setSelectedLocation([lat, lon]);
    setSelectedPlace(place);
    setMapZoom(17);
    setShowInfoWindow(true);
    setShowBottomCard(true);

    const bar = barData.find((b) => b.id.toString() === place.place_id);
    if (place.image_url) {
      setLocationPhotos([place.image_url]);
    } else if (bar?.image) {
      setLocationPhotos([bar.image]);
    } else {
      setLocationPhotos([
        "https://via.placeholder.com/400x300?text=No+Image+Available",
      ]);
    }
  }, []);

  const searchPlaces = useCallback(
    async (query: string) => {
      if (!query || query.trim() === "") return;

      try {
        const api = (await import("src/app/utils/api")).default;
        const response = await api.get("/api/google-maps/places/search/", {
          params: {
            query: query,
          },
        });
        const data = response.data;

        if (data && data.results && data.results.length > 0) {
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
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching places:", error);
        setSearchResults([]);
      }
    },
    []
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length >= 3) {
      fetchAutocompleteSuggestions(value);
    } else {
      setSearchResults([]);
      setShowAutocomplete(false);
    }
  };

  const fetchAutocompleteSuggestions = async (input: string) => {
    try {
      const api = (await import("src/app/utils/api")).default;
      const response = await api.get("/api/google-maps/places/autocomplete", {
        params: {
          input: input,
        },
      });

      const data = response.data;

      if (data && data.predictions) {
        const suggestions: PlaceResult[] = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          lat: prediction.lat || "0",
          lon: prediction.lng || "0",
          display_name: prediction.description,
          type: prediction.types?.[0] || "establishment",
        }));

        setSearchResults(suggestions);
        setShowAutocomplete(suggestions.length > 0);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      setSearchResults([]);
      setShowAutocomplete(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchPlaces(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAutocompleteSelect = async (place: PlaceResult) => {
    setSearchQuery(place.display_name?.split(",")[0] ?? "");
    setShowAutocomplete(false);

    try {
      const api = (await import("src/app/utils/api")).default;
      const response = await api.get("/api/google-maps/place-details/", {
        params: {
          place_id: place.place_id,
        },
      });

      const data = response.data;

      if (data) {
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);

        // Update map center and selected location
        setSelectedLocation([lat, lon]);
        setMapZoom(17);
        setShowInfoWindow(true);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handlePoiClick = (poi: typeof barData[0]) => {
    setSelectedLocation([poi.lat, poi.lon]);
    setSelectedPlace({
      place_id: poi.id.toString(),
      lat: poi.lat.toString(),
      lon: poi.lon.toString(),
      display_name: poi.name + ", " + poi.address,
      type: poi.type,
      category: poi.genre,
      address: {
        road: poi.address,
        phone: poi.phone,
        name: poi.name,
        genre: poi.genre,
      },
    });
    setMapZoom(17);
    setShowInfoWindow(true);
    setShowBottomCard(true);
    setLocationPhotos([poi.image]);
  };

  const handleMarkerClick = () => {
    setShowInfoWindow(true);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const openInMaps = () => {
    if (selectedLocation) {
      const [lat, lon] = selectedLocation;
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`;
      window.open(url, "_blank");
    }
  };

  // Function to get user's current location and update selectedLocation state
  const handleMyLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation([latitude, longitude]);
        setMapZoom(17);
        setShowInfoWindow(false);
        setShowBottomCard(false);
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
      }
    );
  };

  const renderAdvancedMarker = useCallback((lat: number, lng: number, onClick: () => void) => {
    if (!isLoaded || typeof google === "undefined" || !google.maps.marker) {
      return null;
    }

    // Create a marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'marker-element';
    markerElement.style.backgroundImage = `url(${customIcon?.url})`;
    markerElement.style.width = '36px';
    markerElement.style.height = '36px';
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.cursor = 'pointer';
    markerElement.addEventListener('click', onClick);

    // Create and return an AdvancedMarkerElement
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      content: markerElement,
    });

    // Attach the marker to the map
    if (mapRef.current) {
      marker.map = mapRef.current;
    }

    return marker;
  }, [isLoaded, customIcon]);

  useEffect(() => {
    // Clear existing markers when component unmounts
    return () => {
      // Clean up markers if needed
    };
  }, []);

  // Set up markers when map and POI data are available
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !google?.maps?.marker) {
      return;
    }
    
    // Clear any existing markers

    // Create POI markers
    poiMarkers.forEach((poi) => {
      renderAdvancedMarker(poi.lat, poi.lon, () => handlePoiClick(poi));
    });

    // Create selected location marker
    if (selectedPlace && selectedLocation) {
      renderAdvancedMarker(selectedLocation[0], selectedLocation[1], () => setShowInfoWindow(true));
    }
  }, [isLoaded, poiMarkers, selectedPlace, selectedLocation, renderAdvancedMarker, handlePoiClick]);

  return (
    <div className="relative w-full">
      {/* Search bar at the top */}
      <div className="sticky top-0 z-[999] h-[11vh] bg-white shadow-md mb">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center h-full px-4"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for bars, pubs...."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pr-12 pl-4 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-red-600 p-2 text-white"
              style={{ right: "1rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
        {/* My Location Button */}
        <button
          onClick={handleMyLocationClick}
          aria-label="My Location"
          className="fixed bottom-6 right-6 z-[9999] bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
          title="Go to My Location"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showAutocomplete && searchResults.length > 0 && (
        <div className="absolute right-0 left-0 z-10 mx-auto max-w-3xl rounded-lg bg-white py-2 shadow-lg">
          {searchResults.map((result) => (
            <button
              key={result.place_id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleAutocompleteSelect(result)}
            >
              <div className="font-medium">
                {result.display_name.split(",")[0]}
              </div>
              <div className="truncate text-xs text-gray-500">
                {result.display_name.split(",").slice(1).join(",")}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Google Map */}
      <div className="h-[50vh] w-full">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}  
            zoom={mapZoom}
            center={{ lat: validCenter[0], lng: validCenter[1] }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* Note: We're not using the <Marker> component anymore
                Our markers are now created programmatically using
                AdvancedMarkerElement in the useEffect */}
                
            {/* Info Window */}
            {selectedPlace && showInfoWindow && selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation[0],
                  lng: selectedLocation[1],
                }}
                onCloseClick={() => setShowInfoWindow(false)}
              >
                <div className="max-w-[200px]">
                  <h3 className="font-bold">
                    {selectedPlace.address?.name ||
                      selectedPlace.display_name.split(",")[0]}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedPlace.display_name}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
        {/* Category Filter */}
        <div className="mx-4 mt-3 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            {categories.map((category) => (
              <div key={category.id} className="flex-shrink-0">
                <button
                  onClick={(e) => handleCategoryFilter(category.id, e)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                    selectedCategory === category.id
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <span className="flex items-center">
                    <span className="mr-1">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showDropdown === category.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-[9999] mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
                    style={{
                      top: dropdownPosition?.top || 0,
                      left: dropdownPosition?.left || 0,
                      maxHeight: "150px",
                      overflowY: "auto",
                      width: "200px",
                      position: "absolute",
                    }}
                  >
                    {dropdownOptions[
                      category.id as keyof typeof dropdownOptions
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="mr-2 h-3 w-3 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          checked={
                            (
                              selectedFilters[
                                category.id as keyof typeof selectedFilters
                              ] || []
                            ).includes(option)
                          }
                          onChange={() =>
                            handleFilterOptionSelect(category.id, option)
                          }
                        />
                        <span className="text-xs">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Card - Location Info */}
      {showBottomCard && selectedPlace && (
        <div
          className="fixed right-0 bottom-0 left-0 transform overflow-y-auto rounded-t-3xl bg-gradient-to-r from-red-600 to-red-800 px-5 pt-5 pb-3 shadow-lg transition-all duration-300 ease-in-out"
          style={{
            height: cardHeight, // Adjusted height
            transform: showBottomCard ? "translateY(0)" : "translateY(100%)",
            opacity: showBottomCard ? 1 : 0,
            zIndex: cardZIndex, // Use dynamic zIndex
          }}
        >
          <div className="mx-auto mb-2 h-1 w-12 cursor-pointer rounded-full bg-white" />
          <div className="flex h-full flex-col">
            <div className="flex gap-4">
              {/* Image on the left */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={
                    locationPhotos[0] ??
                    "https://via.placeholder.com/400x300?text=No+Image+Available"
                  }
                  alt={selectedPlace.display_name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Text content on the right */}
              <div className="flex-grow">
                <h2 className="mb-1 text-lg font-bold text-white">
                  {selectedPlace.address?.name ||
                    selectedPlace.display_name.split(",")[0]}
                </h2>
                <p className="mb-3 text-xs text-white/80">
                  {selectedPlace.type ?? "Venue"}:{" "}
                  {selectedPlace.address?.name ??
                    selectedPlace.display_name.split(",")[0]}
                  {selectedPlace.address?.genre &&
                    ` | Genre: ${selectedPlace.address.genre}`}
                </p>

                <div className="mb-2 flex flex-wrap gap-1">
                  {selectedPlace.category && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90">
                      {selectedPlace.category
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                    </span>
                  )}

                  {/* Show promos from barData */}
                  {selectedPlace.place_id &&
                    barData
                      .find((b) => b.id.toString() === selectedPlace.place_id)
                      ?.promos?.map((promo: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90"
                        >
                          {promo.toLowerCase()}
                        </span>
                      ))}
                </div>

                {/* Additional info */}
                <p className="mb-1 text-[10px] text-white/70">
                  {selectedPlace.address?.phone &&
                    `Phone: ${selectedPlace.address.phone}`}
                  {selectedPlace.place_id &&
                    barData.find(
                      (b) => b.id.toString() === selectedPlace.place_id,
                    )?.closeTime &&
                    ` | Closes: ${
                      barData.find((b) => b.id.toString() === selectedPlace.place_id)?.closeTime
                    }`}
                </p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-4">
              <h3 className="text-md font-semibold text-white">Details</h3>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                <li>
                  <strong>Address:</strong>{" "}
                  {selectedPlace.address?.road || "N/A"}
                </li>
                <li>
                  <strong>Rating:</strong>{" "}
                  {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.rating || "N/A"}
                </li>
                <li>
                  <strong>Reviews:</strong>{" "}
                  {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.reviews || "N/A"}
                </li>
                <li>
                  <strong>Open Time:</strong>{" "}
                  {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.openTime || "N/A"}
                </li>
                <li>
                  <strong>Close Time:</strong>{" "}
                  {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.closeTime || "N/A"}
                </li>
              </ul>
            </div>

            {/* Carousel Placeholder */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-white">
                Nearby Locations
              </h3>
              <div className="mt-2 flex gap-4 overflow-x-auto">
                {barData.map((bar) => (
                  <div
                    key={bar.id}
                    className="min-w-[200px] flex-shrink-0 rounded-lg bg-white p-3 shadow-md"
                  >
                    <img
                      src={bar.image}
                      alt={bar.name}
                      className="h-32 w-full rounded-md object-cover"
                    />
                    <h4 className="mt-2 text-sm font-bold text-gray-800">
                      {bar.name}
                    </h4>
                    <p className="text-xs text-gray-600">{bar.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
