"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Component to update map position
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

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

// Bar data for simulation (American bars)
const barData = [
  {
    id: 1,
    name: "The Dead Rabbit",
    lat: 40.7037,
    lon: -74.0122,
    rating: 4.8,
    reviews: 1255,
    type: "venue",
    open: true,
    closeTime: "02:00",
    promos: ["HAPPY HOUR", "FREE APPETIZER", "LIVE MUSIC"],
    address: "30 Water St, New York, NY 10004",
    phone: "+1-212-422-7906",
    genre: "Irish Pub",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 2,
    name: "Employees Only",
    lat: 40.7329,
    lon: -74.005,
    rating: 4.7,
    reviews: 890,
    type: "venue",
    open: true,
    closeTime: "04:00",
    promos: ["CRAFT COCKTAILS", "LATE NIGHT MENU"],
    address: "510 Hudson St, New York, NY 10014",
    phone: "+1-212-242-3021",
    genre: "Speakeasy",
    image:
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1029&q=80",
  },
  {
    id: 3,
    name: "Trick Dog",
    lat: 37.7593,
    lon: -122.4125,
    rating: 4.6,
    reviews: 750,
    type: "genre",
    open: true,
    closeTime: "02:00",
    promos: ["THEMED MENU", "CRAFT BEER"],
    address: "3010 20th St, San Francisco, CA 94110",
    phone: "+1-415-471-2999",
    genre: "Cocktail Bar",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 4,
    name: "The Aviary",
    lat: 41.8866,
    lon: -87.6525,
    rating: 4.9,
    reviews: 605,
    type: "time",
    open: true,
    closeTime: "01:00",
    promos: ["RESERVATION ONLY", "TASTING MENU"],
    address: "955 W Fulton Market, Chicago, IL 60607",
    phone: "+1-312-226-0868",
    genre: "Molecular Mixology",
    image:
      "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?ixlib=rb-1.2.1&auto=format&fit=crop&w=1172&q=80",
  },
  {
    id: 5,
    name: "Death & Co",
    lat: 40.7264,
    lon: -73.9847,
    rating: 4.7,
    reviews: 1100,
    type: "venue",
    open: true,
    closeTime: "03:00",
    promos: ["SIGNATURE COCKTAILS", "INTIMATE SETTING"],
    address: "433 E 6th St, New York, NY 10009",
    phone: "+1-212-388-0882",
    genre: "Cocktail Lounge",
    image:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 6,
    name: "Attaboy",
    lat: 40.7194,
    lon: -73.9909,
    rating: 4.8,
    reviews: 735,
    type: "genre",
    open: true,
    closeTime: "04:00",
    promos: ["NO MENU", "BESPOKE COCKTAILS"],
    address: "134 Eldridge St, New York, NY 10002",
    phone: "+1-212-555-1212",
    genre: "Speakeasy",
    image:
      "https://images.unsplash.com/photo-1582819509237-01cde5a3d7b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 7,
    name: "Columbia Room",
    lat: 38.907,
    lon: -77.0211,
    rating: 4.7,
    reviews: 420,
    type: "time",
    open: true,
    closeTime: "12:00",
    promos: ["TASTING MENU", "AWARD-WINNING"],
    address: "124 Blagden Alley NW, Washington, DC 20001",
    phone: "+1-202-316-9396",
    genre: "Craft Cocktails",
    image:
      "https://images.unsplash.com/photo-1529502669403-c073b74fcefb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
  },
];

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
  const [poiMarkers, setPoiMarkers] = useState(
    barData.filter((bar) => bar.type === "venue"),
  );

  const mapRef = useRef<L.Map | null>(null);

  // Custom icon for marker
  const customIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23EA4335' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3'%3E%3C/circle%3E%3C/svg%3E",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      }),
    [],
  );

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);

    const filtered = barData.filter((bar) => bar.type === categoryId);
    setPoiMarkers(filtered);
  };

  // Fix Leaflet default icon issue in Next.js
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-expect-error - _getIconUrl is not in the types but exists in the implementation
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      });
    }
  }, []);

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
    const bar = barData.find(b => b.id.toString() === place.place_id);
    if (bar?.image) {
      setLocationPhotos([bar.image]);
    } else {
      // Set default photo if none available
      setLocationPhotos([
        "https://via.placeholder.com/400x300?text=No+Image+Available",
      ]);
    }
  }, []);

  // Search places with Nominatim API (OpenStreetMap)
  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.trim() === '') return;
    
    try {
      // Cari di data lokal (barData) daripada menggunakan API
      const lowerQuery = query.toLowerCase();
      
      // Filter barData berdasarkan nama atau alamat yang cocok dengan query
      const matchedBars = barData.filter(bar => 
        bar.name.toLowerCase().includes(lowerQuery) || 
        bar.address.toLowerCase().includes(lowerQuery) ||
        bar.genre.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);
      
      if (matchedBars.length > 0) {
        // Ubah format barData ke format PlaceResult
        const results: PlaceResult[] = matchedBars.map(bar => ({
          place_id: bar.id.toString(),
          lat: bar.lat.toString(),
          lon: bar.lon.toString(),
          display_name: `${bar.name}, ${bar.address}`,
          type: bar.type,
          category: bar.genre,
          address: {
            road: bar.address,
            phone: bar.phone,
            name: bar.name,
            genre: bar.genre,
          }
        }));
        
        setSearchResults(results);
        
        // Auto select first result from search if it exists
        if (results[0]) {
          handleSelectPlace(results[0]);
        }
      } else {
        // Jika tidak ada hasil
        setSearchResults([]);
        console.log("Tidak ada hasil pencarian untuk:", query);
      }
    } catch (error) {
      console.error("Error saat pencarian:", error);
      setSearchResults([]);
    }
  }, [handleSelectPlace]);

  // Handle search input
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Function to handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length >= 2) {
      // Filter untuk autocomplete
      const lowerQuery = value.toLowerCase();
      const suggestions = barData
        .filter(bar => 
          bar.name.toLowerCase().includes(lowerQuery) || 
          bar.address.toLowerCase().includes(lowerQuery) ||
          bar.genre.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5)
        .map(bar => ({
          id: bar.id.toString(),
          name: bar.name,
          address: bar.address,
        }));
      
      setSearchResults(suggestions.map(sugg => ({
        place_id: sugg.id,
        lat: barData.find(bar => bar.id.toString() === sugg.id)?.lat.toString() || "0",
        lon: barData.find(bar => bar.id.toString() === sugg.id)?.lon.toString() || "0",
        display_name: `${sugg.name}, ${sugg.address}`,
      })));
      
      setShowAutocomplete(suggestions.length > 0);
    } else {
      setSearchResults([]);
      setShowAutocomplete(false);
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
  const handleAutocompleteSelect = (place: PlaceResult) => {
    setSearchQuery(place.display_name.split(',')[0]);
    handleSelectPlace(place);
    setShowAutocomplete(false);
  };

  // Handle POI marker click
  const handlePoiClick = (poi: (typeof barData)[0]) => {
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

  return (
    <div className="relative">
      {/* Search bar */}
      <div className="absolute top-4 left-0 right-0 z-[999] mx-auto w-[90%] max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Cari bar, pub, lounge..."
            className="w-full rounded-full border-0 bg-white py-3 pl-4 pr-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-red-600 p-2 text-white"
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
        </form>
        
        {/* Autocomplete dropdown */}
        {showAutocomplete && searchResults.length > 0 && (
          <div className="absolute mt-1 w-full rounded-lg bg-white py-2 shadow-lg">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => handleAutocompleteSelect(result)}
              >
                <div className="font-medium">{result.display_name.split(',')[0]}</div>
                <div className="text-xs text-gray-500 truncate">
                  {result.display_name.split(',').slice(1).join(',')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet Map */}
      <div className="h-full w-full">
        <MapContainer
          style={{ width: "100%", height: "55vh" }}
          center={selectedLocation ?? defaultCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          ref={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* POI Markers */}
          {poiMarkers.map((poi) => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lon]}
              icon={customIcon}
              eventHandlers={{
                click: () => handlePoiClick(poi),
              }}
            />
          ))}

          {/* {selectedLocation && selectedPlace && (
            <Marker
              position={selectedLocation}
              icon={customIcon}
              eventHandlers={{
                click: handleMarkerClick,
              }}
            >
              {showInfoWindow && (
                <Popup>
                  <div className="max-w-[250px] min-w-[200px]">
                    <h3 className="font-semibold text-gray-900">
                      {selectedPlace.display_name.split(",")[0]}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedPlace.display_name}
                    </p>
                    <button
                      onClick={toggleDetails}
                      className="mt-2 text-sm font-medium text-blue-600"
                    >
                      View details
                    </button>
                  </div>
                </Popup>
              )}
            </Marker>
          )} */}

          {/* Update map position when location changes */}
          {selectedLocation && (
            <MapUpdater center={selectedLocation} zoom={mapZoom} />
          )}
        </MapContainer>
        {/* Category Filter */}
        <div className="mx-4 mt-3 h-[10vh]">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`mr-2 flex h-12 min-w-[80px] flex-col items-center justify-center rounded-full px-4 shadow-md ${
                  selectedCategory === category.id
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="mt-1 text-xs font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Card - Location Info */}
      {showBottomCard && selectedPlace && (
        <div 
          className="z-[999] h-[30%] bg-gradient-to-r from-red-600 to-red-800 rounded-t-3xl shadow-lg pb-3 pt-5 px-5 transition-all duration-300 ease-in-out transform"
          style={{
            transform: showBottomCard ? 'translateY(0)' : 'translateY(100%)',
            opacity: showBottomCard ? 1 : 0
          }}
        >
          <div className="flex flex-col">
            <div className="flex gap-4">
              {/* Image on the left */}
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                <img 
                  src={locationPhotos[0] ?? "https://via.placeholder.com/400x300?text=No+Image+Available"} 
                  alt={selectedPlace.display_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Text content on the right */}
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-white mb-1">
                  {selectedPlace.address?.name || selectedPlace.display_name.split(",")[0]}
                </h2>
                <p className="text-white/80 text-xs mb-3">
                  {selectedPlace.type ?? 'venue'}: {selectedPlace.address?.name ?? selectedPlace.display_name.split(",")[0]} 
                  {selectedPlace.address?.genre && ` | genre: ${selectedPlace.address.genre}`}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedPlace.category && (
                    <span className="bg-white/20 text-white/90 px-2 py-0.5 rounded-full text-[10px]">
                      {selectedPlace.category}
                    </span>
                  )}
                  
                  {/* Show promos from barData */}
                  {selectedPlace.place_id && barData.find(b => b.id.toString() === selectedPlace.place_id)?.promos?.map((promo, idx) => (
                    <span key={idx} className="bg-white/20 text-white/90 px-2 py-0.5 rounded-full text-[10px]">
                      {promo.toLowerCase()}
                    </span>
                  ))}
                </div>

                {/* Additional info */}
                <p className="text-white/70 text-[10px] mb-1">
                  {selectedPlace.address?.phone && `phone: ${selectedPlace.address.phone}`}
                  {selectedPlace.place_id && barData.find(b => b.id.toString() === selectedPlace.place_id)?.closeTime && 
                    ` | closes: ${barData.find(b => b.id.toString() === selectedPlace.place_id)?.closeTime}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Location Button */}
      {/* <div className="absolute right-4 bottom-24 z-[998]">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  setSelectedLocation([lat, lng]);
                  setMapZoom(17);

                  // Fetch location details based on coordinates (reverse geocoding)
                  fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data) {
                        setSelectedPlace(data as PlaceResult);
                        setShowBottomCard(true);
                      }
                    })
                    .catch((error) => {
                      console.error("Error fetching location details:", error);
                    });
                },
                () => {
                  alert("Unable to find your location.");
                },
              );
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div> */}
    </div>
  );
}
