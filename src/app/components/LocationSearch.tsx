"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  genres?: { name: string }[];
}

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco

export default function LocationSearch() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch venues data - since no API route, mock some data here or fetch from existing source
  useEffect(() => {
    // Mock data for demonstration
    const mockVenues: Venue[] = [
      {
        id: "1",
        name: "The Jazz Club",
        address: "123 Jazz St, San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        phone: "555-1234",
        website: "http://jazzclub.example.com",
        genres: [{ name: "Jazz" }],
      },
      {
        id: "2",
        name: "Rock Arena",
        address: "456 Rock Ave, San Francisco, CA",
        latitude: 37.7849,
        longitude: -122.4094,
        phone: "555-5678",
        website: "http://rockarena.example.com",
        genres: [{ name: "Rock" }],
      },
      {
        id: "3",
        name: "Hip Hop Lounge",
        address: "789 HipHop Blvd, San Francisco, CA",
        latitude: 37.7649,
        longitude: -122.4294,
        phone: "555-9012",
        website: "http://hiphoplounge.example.com",
        genres: [{ name: "Hip Hop" }],
      },
    ];
    setVenues(mockVenues);
    setFilteredVenues(mockVenues);
  }, []);

  // Filter venues by search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredVenues(venues);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredVenues(
        venues.filter((venue) =>
          venue.name.toLowerCase().includes(lowerQuery) ||
          venue.address.toLowerCase().includes(lowerQuery) ||
          venue.genres?.some((g) => g.name.toLowerCase().includes(lowerQuery))
        )
      );
    }
  }, [searchQuery, venues]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setMapCenter({ lat: venue.latitude, lng: venue.longitude });
    setMapZoom(15);
  };

  const handleMapClick = () => {
    setSelectedVenue(null);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="w-full h-[60vh] relative">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={mapZoom}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {filteredVenues.map((venue) => (
          <Marker
            key={venue.id}
            position={{ lat: venue.latitude, lng: venue.longitude }}
            onClick={() => handleMarkerClick(venue)}
            title={venue.name}
            icon={{
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23FF3366' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3'%3E%3C/circle%3E%3C/svg%3E",
              scaledSize: new google.maps.Size(36, 36),
            }}
          />
        ))}

        {selectedVenue && (
          <InfoWindow
            position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
            onCloseClick={() => setSelectedVenue(null)}
          >
            <div className="max-w-xs">
              <h3 className="font-bold text-lg">{selectedVenue.name}</h3>
              <p className="text-sm">{selectedVenue.address}</p>
              {selectedVenue.phone && <p className="text-sm">Phone: {selectedVenue.phone}</p>}
              {selectedVenue.website && (
                <p className="text-sm">
                  Website:{" "}
                  <a href={selectedVenue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {selectedVenue.website}
                  </a>
                </p>
              )}
              {selectedVenue.genres && selectedVenue.genres.length > 0 && (
                <p className="text-sm">Genres: {selectedVenue.genres.map((g) => g.name).join(", ")}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
