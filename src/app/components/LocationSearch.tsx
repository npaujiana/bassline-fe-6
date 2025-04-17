"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
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
}

// Default map center (New York City, USA)
const defaultCenter: [number, number] = [40.7128, -74.006];

// Style for map container - 60% height and full width
// const containerStyle = {
//   width: "100%",
//   height: "60vh",
// };

// Filter categories data
const categories = [
  { id: "venue", name: "Venue", icon: "🏢" },
  { id: "time", name: "Time", icon: "⏰" },
  { id: "genre", name: "Genre", icon: "🎵" },
];

// Define dropdown options for each category with more specific values
const dropdownOptions = {
  venue: [
    "Bar",
    "Pub",
    "Lounge",
    "Club",
    "Restaurant",
    "Cafe",
    "Rooftop Bar",
    "Hotel Bar",
    "Speakeasy",
  ],
  time: [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
    "12:00 AM",
  ],
  genre: [
    "Jazz",
    "Rock",
    "EDM",
    "Hip Hop",
    "Blues",
    "RnB",
    "Pop",
    "Live Music",
    "DJ",
    "Karaoke",
    "Country",
  ],
};

export default function LocationSearch({
  initialQuery = "",
}: LocationSearchProps) {
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [locationPhotos, setLocationPhotos] = useState<string[]>([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState("venue");
  // const [poiMarkers, setPoiMarkers] = useState(
  //   barData.filter((bar) => bar.type === "venue"),
  // );
  // Change initial state to null so no dropdown is visible on first load
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    venue: [],
    time: [],
    genre: [],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  // Add ref for dropdown (to handle clicks outside)
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use isLoaded from Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Custom icon for marker - only create if Google Maps is loaded
  const customIcon = useMemo(() => {
    if (!isLoaded || typeof google === "undefined") return null;

    return {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23EA4335' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3'%3E%3C/circle%3E%3C/svg%3E",
      size: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36),
      scaledSize: new google.maps.Size(36, 36),
    };
  }, [isLoaded]);

  // Ensure valid coordinates for GoogleMap center
  const validCenter = useMemo(() => {
    if (
      selectedLocation &&
      typeof selectedLocation[0] === "number" &&
      typeof selectedLocation[1] === "number"
    ) {
      return { lat: selectedLocation[0], lng: selectedLocation[1] };
    }
    return { lat: defaultCenter[0], lng: defaultCenter[1] };
  }, [selectedLocation]);

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    // If clicking on the already selected category, toggle dropdown visibility
    if (selectedCategory === categoryId) {
      // Toggle dropdown on/off for the same category
      setShowDropdown(showDropdown === categoryId ? null : categoryId);
    } else {
      // When switching to a new category, select it and show its dropdown
      setSelectedCategory(categoryId);
      setShowDropdown(categoryId);
    }
  };

  // Add a function to handle selecting options from dropdown
  const handleFilterOptionSelect = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      // Check if option is already selected
      const currentOptions = prev[category] || [];

      let newOptions;
      if (currentOptions.includes(option)) {
        // Remove option if already selected
        newOptions = currentOptions.filter((item) => item !== option);
      } else {
        // Add option if not selected
        newOptions = [...currentOptions, option];
      }

      // Create updated filters object
      const updatedFilters = {
        ...prev,
        [category]: newOptions,
      };

      // Apply filtering based on the updated filters
      applyFilters(updatedFilters);

      return updatedFilters;
    });
  };

  // Function to filter POI markers based on selected filters
  const applyFilters = useCallback((filters: Record<string, string[]>) => {
    // let filteredData = [...barData];

    // // Filter by venue type if any venue filters are selected
    // if (filters.venue && filters.venue.length > 0) {
    //   filteredData = filteredData.filter((bar) =>
    //     filters.venue?.includes(bar.venueType),
    //   );
    // }

    // // Filter by time if any time filters are selected
    // if (filters.time && filters.time.length > 0) {
    //   filteredData = filteredData.filter((bar) =>
    //     filters.time?.includes(bar.openTime),
    //   );
    // }

    // // Filter by genre if any genre filters are selected
    // if (filters.genre && filters.genre.length > 0) {
    //   filteredData = filteredData.filter((bar) =>
    //     filters.genre?.includes(bar.musicGenre),
    //   );
    // }

    // // Update markers
    // setPoiMarkers(filteredData);
  }, []);

  // Apply initial filtering
  useEffect(() => {
    applyFilters(selectedFilters);
  }, [applyFilters, selectedFilters]);

  // Handle place selection from dropdown
  const handleSelectPlace = useCallback((place: PlaceResult) => {
    // Set location
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setSelectedLocation([lat, lon]);

    // Set place info
    setSelectedPlace(place);

    // Set zoom level
    setMapZoom(17);

    // Show info window
    setShowInfoWindow(true);

    // Show bottom card
    setShowBottomCard(true);

    // Temukan gambar dari barData
    // const bar = barData.find((b) => b.id.toString() === place.place_id);
    // if (bar?.image) {
    //   setLocationPhotos([bar.image]);
    // } else {
    //   // Set default photo if none available
    //   setLocationPhotos([
    //     "https://via.placeholder.com/400x300?text=No+Image+Available",
    //   ]);
    // }
  }, []);

  // Search places with Google Maps Places API
  const searchPlaces = useCallback(
    async (query: string) => {
      if (!query || query.trim() === "") return;

      try {
        // Use Google Maps Places API endpoint
        const response = await fetch(`/api/google-maps/places/autocomplete/?input=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.predictions && data.predictions.length > 0) {
          // Transform Google API response to match our PlaceResult format
          const results: PlaceResult[] = data.predictions.map((prediction: any) => ({
            place_id: prediction.place_id,
            lat: prediction.lat || "0", // These might need to be populated with a separate API call
            lon: prediction.lng || "0", 
            display_name: prediction.description,
            type: prediction.types?.[0] || "establishment"
          }));

          setSearchResults(results);

          // Auto select first result from search if it exists
          if (results[0]) {
            handleSelectPlace(results[0]);
          }
        } else {
          // Fallback to local search if no results from API
          fallbackLocalSearch(query);
        }
      } catch (error) {
        console.error("Error during search:", error);
        // Fallback to local search if API fails
        fallbackLocalSearch(query);
      }
    },
    [handleSelectPlace]
  );

  // Fallback function to search in local data when API fails
  const fallbackLocalSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Filter barData based on name or address matching the query
    // const matchedBars = barData
    //   .filter(
    //     (bar) =>
    //       bar.name.toLowerCase().includes(lowerQuery) ||
    //       bar.address.toLowerCase().includes(lowerQuery) ||
    //       bar.genre.toLowerCase().includes(lowerQuery),
    //   )
    //   .slice(0, 5);

    // if (matchedBars.length > 0) {
    //   // Convert barData to PlaceResult format
    //   const results: PlaceResult[] = matchedBars.map((bar) => ({
    //     place_id: bar.id.toString(),
    //     lat: bar.lat.toString(),
    //     lon: bar.lon.toString(),
    //     display_name: `${bar.name}, ${bar.address}`,
    //     type: bar.type,
    //     category: bar.genre,
    //     address: {
    //       road: bar.address,
    //       phone: bar.phone,
    //       name: bar.name,
    //       genre: bar.genre,
    //     },
    //   }));

    //   setSearchResults(results);

    //   // Auto select first result
    //   if (results[0]) {
    //     handleSelectPlace(results[0]);
    //   }
    // } else {
    //   // No results
    //   setSearchResults([]);
    //   console.log("No search results for:", query);
    // }
  };

  // Handle search input
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Function to handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // When user types at least 3 characters, fetch autocomplete suggestions from API
    if (value.length >= 3) {
      // Call API for autocomplete suggestions
      fetchAutocompleteSuggestions(value);
    } else {
      setSearchResults([]);
      setShowAutocomplete(false);
    }
  };

  // Function to fetch autocomplete suggestions from API
  const fetchAutocompleteSuggestions = async (input: string) => {
    try {
      // Call Google Places API with only the input parameter
      const response = await fetch(`/api/google-maps/places/autocomplete/?input=${encodeURIComponent(input)}`);
      const data = await response.json();

      if (data && data.predictions) {
        // Transform API response to match our PlaceResult format
        const suggestions: PlaceResult[] = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          lat: prediction.lat ? String(prediction.lat) : "",
          lon: prediction.lng ? String(prediction.lng) : "",
          display_name: prediction.description,
          type: prediction.types?.[0] || "establishment",
        }));

        setSearchResults(suggestions);
        setShowAutocomplete(suggestions.length > 0);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      
      // Fallback to local search if API fails
      const lowerQuery = input.toLowerCase();
      // const suggestions = barData
      //   .filter(
      //     (bar) =>
      //       bar.name.toLowerCase().includes(lowerQuery) ||
      //       bar.address.toLowerCase().includes(lowerQuery) ||
      //       bar.genre.toLowerCase().includes(lowerQuery),
      //   )
      //   .slice(0, 5)
      //   .map((bar) => ({
      //     place_id: bar.id.toString(),
      //     lat: bar.lat.toString(),
      //     lon: bar.lon.toString(),
      //     display_name: `${bar.name}, ${bar.address}`,
      //   }));

      // setSearchResults(suggestions);
      // setShowAutocomplete(suggestions.length > 0);
    }
  };

  // Function to handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      void searchPlaces(searchQuery);
      setShowAutocomplete(false);
    }
  };

  // Function to handle selection from autocomplete
  const handleAutocompleteSelect = async (place: PlaceResult) => {
    setSearchQuery(place.display_name?.split(",")[0] ?? "");
    setShowAutocomplete(false);

    try {
      // Fetch place details by place_id
      const response = await fetch(`/api/google-maps/place-details/?place_id=${encodeURIComponent(place.place_id)}`);

      if (!response.ok) {
        console.error(`Error fetching place details: HTTP ${response.status}`);
        return;
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON from place details response:", parseError);
        return;
      }

      if (data && data.result && data.result.geometry && data.result.geometry.location) {
        const location = data.result.geometry.location;
        const lat = location.lat;
        const lng = location.lng;

        // Set map location and zoom
        setSelectedLocation([lat, lng]);
        setMapZoom(17);

        // Set selected place details
        setSelectedPlace({
          place_id: place.place_id,
          lat: String(lat),
          lon: String(lng),
          display_name: place.display_name,
          type: place.type,
          category: place.category,
          address: place.address,
        });

        // Show info window and bottom card
        setShowInfoWindow(true);
        setShowBottomCard(true);
      } else {
        console.error("Place details not found for place_id:", place.place_id);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Handle POI marker click
  // const handlePoiClick = (poi: (typeof barData)[0]) => {
  //   setSelectedLocation([poi.lat, poi.lon]);
  //   setSelectedPlace({
  //     place_id: poi.id.toString(),
  //     lat: poi.lat.toString(),
  //     lon: poi.lon.toString(),
  //     display_name: poi.name + ", " + poi.address,
  //     type: poi.type,
  //     category: poi.genre,
  //     address: {
  //       road: poi.address,
  //       phone: poi.phone,
  //       name: poi.name,
  //       genre: poi.genre,
  //     },
  //   });
  //   setMapZoom(17);
  //   setShowInfoWindow(true);
  //   setShowBottomCard(true);
  //   setLocationPhotos([poi.image]);
  // };

  // Handle marker click
  const handleMarkerClick = () => {
    setShowInfoWindow(true);
  };

  // Toggle detail view
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Open in OpenStreetMap/Maps
  const openInMaps = () => {
    if (selectedLocation) {
      const [lat, lon] = selectedLocation;
      // OpenStreetMap URL
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`;
      window.open(url, "_blank");
    }
  };

  // Initialize search when component loads (if initialQuery exists)
  useEffect(() => {
    if (initialQuery && initialQuery.length > 2) {
      setSearchQuery(initialQuery);
      void searchPlaces(initialQuery);
    }
  }, [initialQuery, searchPlaces]);

  // Add state to track card height
  const [cardHeight, setCardHeight] = useState("28vh");
  // Add zIndex state to dynamically adjust the z-index of the card
  const [cardZIndex, setCardZIndex] = useState(1000);

  // Update the zIndex of the card and add a class to blur the background when the card is expanded
  const handleCardDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const newHeight = Math.min(
      Math.max(window.innerHeight - e.clientY, 100), // Minimum height
      window.innerHeight * 0.9, // Maximum height (90% of screen)
    );
    setCardHeight(`${newHeight}px`);

    // Adjust zIndex and apply blur effect to background
    if (newHeight > window.innerHeight * 0.5) {
      setCardZIndex(2000); // Bring card to the front
      document.body.classList.add("blur-background"); // Add blur effect
    } else {
      setCardZIndex(1000); // Reset zIndex
      document.body.classList.remove("blur-background"); // Remove blur effect
    }
  };

  // Ensure blur effect is removed when dragging ends
  const handleCardDragEnd = () => {
    if (parseInt(cardHeight) > window.innerHeight * 0.5) {
      setCardHeight("90vh"); // Expand to 90% of screen height
    } else {
      setCardHeight("27vh"); // Reset to default height
      document.body.classList.remove("blur-background"); // Remove blur effect
    }
  };

  return (
    <div className="relative w-full">
      {/* Search bar at the top */}
      <div className="sticky top-0 z-[999] h-[11vh] bg-white shadow-md mb">
        <form
          onSubmit={handleSearchSubmit}
          className="relative mx-auto max-w-3xl p-4"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for bars, pubs, lounges..."
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
      </div>

      {/* Google Map */}
      <div className="h-[50vh] w-full">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={validCenter}
            zoom={mapZoom}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {/* POI Markers */}
            {/* {poiMarkers.map((poi) => (
              <Marker
                key={poi.id}
                position={{ lat: poi.lat, lng: poi.lon }}
                {...(customIcon && { icon: customIcon })}
                onClick={() => handlePoiClick(poi)}
              />
            ))} */}

            {/* Update map position when location changes */}
            {selectedLocation && (
              <MapUpdater center={selectedLocation} zoom={mapZoom} />
            )}
          </GoogleMap>
        )}
        {/* Category Filter */}
        <div className="mx-4 mt-3">
          <div className="flex items-center justify-between gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative flex w-1/3 ${
                  categories.indexOf(category) === 0
                    ? "justify-start"
                    : categories.indexOf(category) === 1
                      ? "justify-center"
                      : "justify-end"
                }`}
              >
                <button
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`flex w-max items-center justify-between rounded-lg border px-3 py-2 ${
                    selectedCategory === category.id
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
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

                {/* Only show dropdown when this specific category is selected AND showDropdown matches this category's ID */}
                {showDropdown === category.id && (
                  <div
                    className="absolute top-12 z-20 rounded-lg border border-gray-200 bg-white shadow-lg"
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      width: "140px",
                      left:
                        categories.indexOf(category) === 0
                          ? "0"
                          : categories.indexOf(category) === 1
                            ? "50%"
                            : "auto",
                      right: categories.indexOf(category) === 2 ? "0" : "auto",
                      transform:
                        categories.indexOf(category) === 1
                          ? "translateX(-50%)"
                          : "none",
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
                          checked={(
                            selectedFilters[
                              category.id as keyof typeof selectedFilters
                            ] || []
                          ).includes(option)}
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
            height: cardHeight,
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
                  {/* {selectedPlace.place_id &&
                    barData
                      .find((b) => b.id.toString() === selectedPlace.place_id)
                      ?.promos?.map((promo, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90"
                        >
                          {promo.toLowerCase()}
                        </span>
                      ))} */}
                </div>

                {/* Additional info */}
                {/* <p className="mb-1 text-[10px] text-white/70">
                  {selectedPlace.address?.phone &&
                    `Phone: ${selectedPlace.address.phone}`}
                  {selectedPlace.place_id &&
                    barData.find(
                      (b) => b.id.toString() === selectedPlace.place_id,
                    )?.closeTime &&
                    ` | Closes: ${barData.find((b) => b.id.toString() === selectedPlace.place_id)?.closeTime}`}
                </p> */}
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
                  {/* {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.rating || "N/A"} */}
                </li>
                <li>
                  <strong>Reviews:</strong>{" "}
                  {/* {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.reviews || "N/A"} */}
                </li>
                <li>
                  <strong>Open Time:</strong>{" "}
                  {/* {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.openTime || "N/A"} */}
                </li>
                <li>
                  <strong>Close Time:</strong>{" "}
                  {/* {barData.find(
                    (b) => b.id.toString() === selectedPlace.place_id,
                  )?.closeTime || "N/A"} */}
                </li>
              </ul>
            </div>

            {/* Carousel Placeholder */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-white">
                Nearby Locations
              </h3>
              <div className="mt-2 flex gap-4 overflow-x-auto">
                {/* {barData.map((bar) => (
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
                ))} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
