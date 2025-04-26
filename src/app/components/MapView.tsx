"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TiktokVideo {
  video_id: string;
  video_url: string;
  caption: string;
  author_username: string;
  likes_count: number;
  views_count: number;
}

interface LocationResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  types: string[];
  tiktok_videos: TiktokVideo[];
}

interface MapViewProps {
  searchQuery: string;
}

const defaultPosition = { lat: -6.2088, lng: 106.8456 }; // Jakarta default

// Fix leaflet's default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function ChangeView({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function MapView({ searchQuery }: MapViewProps) {
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultPosition);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Function to get user's current location and update map center
  const handleMyLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
      }
    );
  };

  useEffect(() => {
    if (!searchQuery) {
      setLocations([]);
      setMapCenter(defaultPosition);
      return;
    }

    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use base API URL from environment variable if available
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/api/google-maps/places/search/?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setLocations(data.results);
          const firstLocation = data.results[0].geometry.location;
          setMapCenter({ lat: firstLocation.lat, lng: firstLocation.lng });
        } else {
          setLocations([]);
          setError("No locations found.");
          setMapCenter(defaultPosition);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch locations.");
        setLocations([]);
        setMapCenter(defaultPosition);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLocations();
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-secondary flex items-center justify-center">
        <p className="text-primary text-xl">Loading location information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-secondary flex items-center justify-center">
        <p className="text-primary text-xl">{error}</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="fixed inset-0 bg-secondary flex items-center justify-center">
        <p className="text-accent text-xl">No locations to display. Please enter a search query.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="relative w-full h-[60%] flex-none">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc, idx) => (
            <Marker
              key={idx}
              position={[loc.geometry.location.lat, loc.geometry.location.lng]}
            >
              <Popup>
                <div>
                  <h2 className="font-bold">{loc.name}</h2>
                  <p>{loc.formatted_address}</p>
                  <p>Rating: {loc.rating ?? "N/A"}</p>
                  {loc.tiktok_videos.length > 0 && (
                    <>
                      <h3 className="mt-2 font-semibold">TikTok Videos:</h3>
                      <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto">
                        {loc.tiktok_videos.map((video) => (
                          <li key={video.video_id}>
                            <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-red-600 underline">
                              {video.caption || "View Video"}
                            </a> by @{video.author_username} ({video.likes_count} likes, {video.views_count} views)
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {/* My Location Button */}
        <button
          onClick={handleMyLocationClick}
          aria-label="My Location"
          className="fixed top-20 right-4 z-50 bg-secondary shadow-lg rounded-full p-3 hover:bg-secondary-300 transition-colors duration-300 flex items-center justify-center"
          title="Go to My Location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 bg-secondary rounded-t-3xl -mt-6 z-10 shadow-lg overflow-y-auto p-5">
        <h1 className="text-xl font-bold text-accent mb-4">Search Results for "{searchQuery}"</h1>
        {locations.map((loc, idx) => (
          <div key={idx} className="mb-4 border-b border-accent-200 pb-3">
            <h2 className="font-semibold text-accent">{loc.name}</h2>
            <p className="text-accent-600 text-sm">{loc.formatted_address}</p>
            <p className="text-sm text-accent-700">Rating: {loc.rating ?? "N/A"}</p>
            {loc.tiktok_videos.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold text-accent">TikTok Videos:</h3>
                <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto">
                  {loc.tiktok_videos.map((video) => (
                    <li key={video.video_id}>
                      <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        {video.caption || "View Video"}
                      </a> by @{video.author_username} ({video.likes_count} likes, {video.views_count} views)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
