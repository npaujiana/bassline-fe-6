"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { fetchVenues, searchVenues } from "../utils/api";
import type { Venue as ApiVenue, VenueSearchParams } from "../utils/api";

interface Venue {
  id: string | number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  genres?: { name: string; description?: string }[];
  description?: string;
  category?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  email?: string;
  amenities?: { name: string; description?: string }[];
  tags?: { name: string; description?: string }[];
  ambiances?: { name: string; description?: string }[];
  crowd_types?: { name: string; description?: string }[];
  image?: string;
  display_name?: string;
  place_id?: string;
  type?: string;
}

// Ekstensi dari ApiVenue untuk menampung properti tambahan
interface ExtendedApiVenue extends ApiVenue {
  lat?: number;
  lng?: number;
  venue_type?: string;
  image?: string;
}

interface ApiResponse {
  data: ApiVenue[];
  pagination: {
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
  };
}

interface BarData {
  id: number;
  name: string;
  address: string;
  rating: string;
  reviews: string;
  openTime: string;
  closeTime: string;
  image: string;
  promos?: string[];
}

interface Position {
  top: number;
  left: number;
}

const defaultCenter = { lat: -6.1751, lng: 106.8650 }; // Jakarta, Indonesia sebagai default

export default function LocationSearch() {
  const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cardHeight, setCardHeight] = useState("30%");
  const [cardZIndex, setCardZIndex] = useState(999);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<Position | null>(null);
  const [locationPhotos, setLocationPhotos] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [nearbyVenues, setNearbyVenues] = useState<Venue[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Kategori untuk filter
  const categories = [
    { id: "location", name: "Location", icon: "📍" },
    { id: "closingTime", name: "Closing Time", icon: "🕙" },
    { id: "venueType", name: "Venue Type", icon: "🏢" },
    { id: "musicGenre", name: "Music Genre", icon: "🎵" },
    { id: "ambiance", name: "Ambiance", icon: "✨" },
    { id: "priceRange", name: "Price", icon: "💰" },
    { id: "dressCode", name: "Dress Code", icon: "👔" },
    { id: "crowd", name: "Crowd", icon: "👥" },
    { id: "realTime", name: "Real-Time", icon: "⌚" },
  ];

  // Opsi dropdown untuk setiap kategori
  const dropdownOptions = {
    location: [
      "Within 1 mile",
      "Within 3 miles",
      "Within 5 miles",
      "Walkable spots",
      "Downtown",
      "Uptown",
      "Midtown"
    ],
    closingTime: [
      "Open now",
      "Open past 2 AM",
      "24-hour spots",
      "Late entry allowed"
    ],
    venueType: [
      "Bar",
      "Club",
      "Lounge",
      "After-hours spot",
      "Late-night restaurant"
    ],
    musicGenre: [
      "Hip-hop / R&B",
      "House / Techno",
      "Jazz / Blues",
      "Live Music / Bands",
      "Mixed / Open format"
    ],
    ambiance: [
      "Chill / Low-key",
      "Lively but not packed",
      "High-energy / Party vibes",
      "Exclusive / VIP"
    ],
    priceRange: [
      "$ (Budget-friendly)",
      "$$",
      "$$$"
    ],
    dressCode: [
      "Casual",
      "Smart Casual",
      "Dressy / Fancy"
    ],
    crowd: [
      "LGBTQ+ friendly",
      "College crowd",
      "Trendy / Influencer spots",
      "Industry / Music scene"
    ],
    realTime: [
      "Empty",
      "Moderate",
      "Packed",
      "Short queue",
      "Long queue",
      "Reservations required",
      "Walk-in friendly"
    ]
  };

  const [selectedFilters, setSelectedFilters] = useState<{
    location: string[];
    closingTime: string[];
    venueType: string[];
    musicGenre: string[];
    ambiance: string[];
    priceRange: string[];
    dressCode: string[];
    crowd: string[];
    realTime: string[];
  }>({
    location: [],
    closingTime: [],
    venueType: [],
    musicGenre: [],
    ambiance: [],
    priceRange: [],
    dressCode: [],
    crowd: [],
    realTime: []
  });

  // Sample data for nearby bars
  const barData: BarData[] = [
    {
      id: 1,
      name: "The Dead Rabbit",
      address: "30 Water St, New York",
      rating: "4.5/5",
      reviews: "1,246",
      openTime: "4:00 PM",
      closeTime: "2:00 AM",
      image: "https://via.placeholder.com/200x200?text=Bar1",
      promos: ["happy hour", "free appetizer"]
    },
    {
      id: 2,
      name: "Employees Only",
      address: "510 Hudson St, New York",
      rating: "4.7/5",
      reviews: "982",
      openTime: "5:00 PM",
      closeTime: "3:30 AM",
      image: "https://via.placeholder.com/200x200?text=Bar2",
      promos: ["signature cocktails", "live music"]
    },
    {
      id: 3,
      name: "PDT (Please Don't Tell)",
      address: "113 St Marks Pl, New York",
      rating: "4.8/5",
      reviews: "753",
      openTime: "6:00 PM",
      closeTime: "2:30 AM",
      image: "https://via.placeholder.com/200x200?text=Bar3",
      promos: ["speakeasy", "craft cocktails"]
    }
  ];

  // Validasi koordinat
  const isValidCoordinate = (coord: any): boolean => {
    return (
      coord !== undefined && 
      coord !== null && 
      typeof coord === 'number' && 
      !isNaN(coord) && 
      isFinite(coord)
    );
  };

  // Set map center dengan validasi
  const safeSetMapCenter = (lat: any, lng: any) => {
    if (isValidCoordinate(lat) && isValidCoordinate(lng)) {
      // Konversi ke tipe number untuk memastikan tipe data yang benar
      const numLat = Number(lat);
      const numLng = Number(lng);
      
      // Validasi tambahan untuk range yang diterima Google Maps
      if (numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180) {
        setMapCenter({ lat: numLat, lng: numLng });
      } else {
        console.warn('Koordinat di luar range yang valid:', { lat, lng });
        setMapCenter(defaultCenter);
      }
    } else {
      console.warn('Koordinat tidak valid:', { lat, lng });
      setMapCenter(defaultCenter);
    }
  };

  // Mengambil data venue dari API
  useEffect(() => {
    const getVenues = async () => {
      setIsLoading(true);
      setError(null);
      setIsDataReady(false);
      
      try {
        // Menggunakan fungsi fetchVenues dari api utility
        const response: any = await fetchVenues();
        
        // Ekstrak data venue dari respons
        // API mengembalikan format: { data: [...venues], pagination: {...} }
        const venuesData = response.data ? response.data : (Array.isArray(response) ? response : []);
        
        console.log("Data venues yang diterima:", venuesData);
        
        // Validasi data venue sebelum disimpan dalam state
        const validVenues: Venue[] = venuesData
          .filter((venue: ExtendedApiVenue) => {
          return (
            venue && 
              venue.name &&
              ((venue.latitude !== undefined && isValidCoordinate(venue.latitude) && 
                venue.longitude !== undefined && isValidCoordinate(venue.longitude)) ||
               (venue.lat !== undefined && isValidCoordinate(venue.lat) && 
                venue.lng !== undefined && isValidCoordinate(venue.lng)))
          );
          })
          .map((venue: ExtendedApiVenue): Venue => ({
            id: venue.id,
            name: venue.name,
            address: venue.address || "",
            latitude: Number(venue.latitude) || Number(venue.lat),
            longitude: Number(venue.longitude) || Number(venue.lng),
            phone: venue.phone,
            website: venue.website,
            genres: venue.genres,
            description: venue.description,
            category: venue.category || venue.venue_type,
            city: venue.city,
            state: venue.state,
            zip_code: venue.zip_code,
            email: venue.email,
            amenities: venue.amenities,
            tags: venue.tags,
            ambiances: venue.ambiances,
            crowd_types: venue.crowd_types,
            image: venue.image,
            display_name: venue.name,
            place_id: String(venue.id)
          }));
        
        if (validVenues.length === 0) {
          console.warn("Tidak ada venue dengan koordinat valid ditemukan");
        } else {
          console.log("Venues valid:", validVenues.length);
        }
        
        setVenues(validVenues);
        setFilteredVenues(validVenues);
        
        // Pusatkan map pada venue pertama jika tersedia
        if (validVenues.length > 0) {
          const firstVenue = validVenues[0];
          if (firstVenue && 
              isValidCoordinate(firstVenue.latitude) && 
              isValidCoordinate(firstVenue.longitude)) {
            safeSetMapCenter(firstVenue.latitude, firstVenue.longitude);
          }
        }
        
        // Tandai bahwa data telah siap
        setIsDataReady(true);
      } catch (err) {
        console.error('Gagal mengambil data venues:', err);
        setError('Gagal memuat data venue.');
        setIsDataReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    getVenues();
  }, []);

  // Filter venues berdasarkan query pencarian
  useEffect(() => {
    // Fungsi untuk mengelola pencarian venue
    const handleSearch = async () => {
      if (!searchQuery) {
        // Jika tidak ada query, kembalikan ke semua venues
        setFilteredVenues(venues);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Buat objek parameter pencarian
        const searchParams: VenueSearchParams = {
          query: searchQuery
        };
        
        // Panggil API untuk mencari venue
        const response = await searchVenues(searchParams);
        
        // Validasi dan transformasi data yang diterima
        const venuesData = response.data ? response.data : (Array.isArray(response) ? response : []);
        
        console.log("Hasil pencarian venues:", venuesData);
        
        // Validasi data venue sebelum disimpan dalam state
        const validVenues: Venue[] = venuesData
          .filter((venue: ExtendedApiVenue) => {
            return (
              venue && 
              venue.name &&
              ((venue.latitude !== undefined && isValidCoordinate(venue.latitude) && 
                venue.longitude !== undefined && isValidCoordinate(venue.longitude)) ||
               (venue.lat !== undefined && isValidCoordinate(venue.lat) && 
                venue.lng !== undefined && isValidCoordinate(venue.lng)))
            );
          })
          .map((venue: ExtendedApiVenue): Venue => ({
            id: venue.id,
            name: venue.name,
            address: venue.address || "",
            latitude: Number(venue.latitude) || Number(venue.lat),
            longitude: Number(venue.longitude) || Number(venue.lng),
            phone: venue.phone,
            website: venue.website,
            genres: venue.genres,
            description: venue.description,
            category: venue.category || venue.venue_type,
            city: venue.city,
            state: venue.state,
            zip_code: venue.zip_code,
            email: venue.email,
            amenities: venue.amenities,
            tags: venue.tags,
            ambiances: venue.ambiances,
            crowd_types: venue.crowd_types,
            image: venue.image,
            display_name: venue.name,
            place_id: String(venue.id)
          }));
        
        setFilteredVenues(validVenues);
      } catch (err) {
        console.error('Gagal melakukan pencarian venues:', err);
        setError('Gagal melakukan pencarian venue.');
        
        // Jika gagal, lakukan pencarian lokal sebagai fallback
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = venues.filter((venue) => {
          // Validasi name
          const nameMatch = venue.name.toLowerCase().includes(lowerQuery);
          
          // Validasi address
          const addressMatch = venue.address ? 
            venue.address.toLowerCase().includes(lowerQuery) : false;
          
          // Validasi category
          const categoryMatch = venue.category ? 
            venue.category.toLowerCase().includes(lowerQuery) : false;
          
          // Validasi genres
          const genresMatch = venue.genres && venue.genres.length > 0 ? 
            venue.genres.some((genre) => {
              return genre && genre.name ? 
                genre.name.toLowerCase().includes(lowerQuery) : false;
            }) : false;

          // Validasi city
          const cityMatch = venue.city ?
            venue.city.toLowerCase().includes(lowerQuery) : false;
          
          return nameMatch || addressMatch || categoryMatch || genresMatch || cityMatch;
        });
        
        setFilteredVenues(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    // Gunakan debounce untuk menghindari terlalu banyak permintaan API
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Tunda pencarian selama 500ms setelah berhenti mengetik
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, venues]);

  // Menangani outside click untuk dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
    safeSetMapCenter(venue.latitude, venue.longitude);
    setMapZoom(15);
    setShowBottomCard(true);
    
    // Set sample location photo when a venue is selected
    setLocationPhotos(["https://via.placeholder.com/400x300?text=Venue+Photo"]);
    
    // Find nearby venues in same neighborhood/city
    const nearbyVenues = findNearbyVenues(venue);
    setNearbyVenues(nearbyVenues);
  };

  const handleMapClick = () => {
    setSelectedVenue(null);
  };

  const handleCloseDetailCard = () => {
    setShowBottomCard(false);
  };

  const handleCategoryFilter = (categoryId: string, event: React.MouseEvent) => {
    // Toggle dropdown
    if (filterDropdownOpen === categoryId) {
      setFilterDropdownOpen(null);
    } else {
      setFilterDropdownOpen(categoryId);
      
      // Calculate and set position of dropdown
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleFilterOptionSelect = (categoryId: string, option: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[categoryId as keyof typeof prev] || [];
      
      // If option is already selected, remove it, otherwise add it
      const newCategoryFilters = categoryFilters.includes(option)
        ? categoryFilters.filter(item => item !== option)
        : [...categoryFilters, option];
      
      return {
        ...prev,
        [categoryId]: newCategoryFilters
      };
    });
    
    // Apply filters to venues
    applyFilters();
  };

  const applyFilters = async () => {
    setIsLoading(true);
    
    try {
      // Buat objek parameter pencarian dengan filter yang dipilih
      const searchParams: VenueSearchParams = {};
      
      // Tambahkan query pencarian jika ada
      if (searchQuery) {
        searchParams.query = searchQuery;
      }
      
      // Tambahkan filter lain yang relevan ke searchParams
      // Misalnya: tag, ambiance, dll sesuai dengan struktur API
      // Contoh:
      if (selectedFilters.venueType.length > 0) {
        // Konversi tipe venue menjadi tag atau parameter lain yang didukung API
      }
      
      if (selectedFilters.musicGenre.length > 0) {
        // Konversi genre musik menjadi parameter genre di API
      }
      
      // Panggil API untuk mencari venue dengan filter
      const response = await searchVenues(searchParams);
      
      // Validasi dan transformasi data yang diterima
      const venuesData = response.data ? response.data : (Array.isArray(response) ? response : []);
      
      console.log("Hasil pencarian venues dengan filter:", venuesData);
      
      // Validasi data venue sebelum disimpan dalam state
      const validVenues: Venue[] = venuesData
        .filter((venue: ExtendedApiVenue) => {
          return (
            venue && 
            venue.name &&
            ((venue.latitude !== undefined && isValidCoordinate(venue.latitude) && 
              venue.longitude !== undefined && isValidCoordinate(venue.longitude)) ||
             (venue.lat !== undefined && isValidCoordinate(venue.lat) && 
              venue.lng !== undefined && isValidCoordinate(venue.lng)))
          );
        })
        .map((venue: ExtendedApiVenue): Venue => ({
          id: venue.id,
          name: venue.name,
          address: venue.address || "",
          latitude: Number(venue.latitude) || Number(venue.lat),
          longitude: Number(venue.longitude) || Number(venue.lng),
          phone: venue.phone,
          website: venue.website,
          genres: venue.genres,
          description: venue.description,
          category: venue.category || venue.venue_type,
          city: venue.city,
          state: venue.state,
          zip_code: venue.zip_code,
          email: venue.email,
          amenities: venue.amenities,
          tags: venue.tags,
          ambiances: venue.ambiances,
          crowd_types: venue.crowd_types,
          image: venue.image,
          display_name: venue.name,
          place_id: String(venue.id)
        }));
      
      setFilteredVenues(validVenues);
    } catch (err) {
      console.error('Gagal melakukan pencarian venues dengan filter:', err);
      setError('Gagal menerapkan filter venue.');
      
      // Fallback ke filter lokal jika API gagal
      let filtered = [...venues];
      
      // Apply search query filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(venue => 
          venue.name.toLowerCase().includes(lowerQuery) ||
          (venue.address && venue.address.toLowerCase().includes(lowerQuery)) ||
          (venue.category && venue.category.toLowerCase().includes(lowerQuery))
        );
      }
      
      // Apply category filters
      Object.entries(selectedFilters).forEach(([category, options]) => {
        if (options.length > 0) {
          filtered = filtered.filter(venue => {
            // For genre filter
            if (category === 'musicGenre' && venue.genres) {
              return venue.genres.some(g => 
                options.some(option => g.name.toLowerCase().includes(option.toLowerCase()))
              );
            }
            
            // For atmosphere/ambiance filter
            if (category === 'ambiance' && venue.ambiances) {
              return venue.ambiances.some(a => 
                options.some(option => a.name.toLowerCase().includes(option.toLowerCase()))
              );
            }
            
            // For crowd filter
            if (category === 'crowd' && venue.crowd_types) {
              return venue.crowd_types.some(c => 
                options.some(option => c.name.toLowerCase().includes(option.toLowerCase()))
              );
            }
            
            // For features/amenities filter
            if (category === 'features' && venue.amenities) {
              return venue.amenities.some(a => 
                options.some(option => a.name.toLowerCase().includes(option.toLowerCase()))
              );
            }
            
            return true;
          });
        }
      });
      
      setFilteredVenues(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to find nearby venues based on location
  const findNearbyVenues = (selectedVenue: Venue): Venue[] => {
    // Define nearby venues as those in the same city or neighborhood
    // and different from the selected venue
    return venues.filter(venue => {
      // Skip the selected venue itself
      if (venue.id === selectedVenue.id) return false;
      
      // Check if venues are in the same city
      const sameCityMatch = venue.city && selectedVenue.city && venue.city === selectedVenue.city;
      
      // Check if venues are in the same neighborhood (rough check by address partial match)
      let sameNeighborhoodMatch = false;
      if (venue.address && selectedVenue.address) {
        const venueAddressLower = venue.address.toLowerCase();
        const selectedAddressLower = selectedVenue.address.toLowerCase();
        
        // Check if addresses share common neighborhood identifiers
        const commonWords = venueAddressLower.split(' ').filter(word => 
          word.length > 3 && selectedAddressLower.includes(word)
        );
        
        sameNeighborhoodMatch = commonWords.length > 0;
      }
      
      return sameCityMatch || sameNeighborhoodMatch;
    }).slice(0, 5); // Limit to 5 nearby venues
  };

  // Handle untuk perubahan input pencarian
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 1) {
      setIsSearching(true);
      searchAutocomplete(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Search autocomplete menggunakan API
  const searchAutocomplete = async (query: string) => {
    if (!query.trim()) return;

    try {
      // Buat objek parameter pencarian
      const searchParams: VenueSearchParams = {
        query: query
      };
      
      // Panggil API untuk mencari venue
      const response = await searchVenues(searchParams);
      
      // Validasi dan transformasi data yang diterima
      const venuesData = response.data ? response.data : (Array.isArray(response) ? response : []);
      
      // Validasi data venue untuk autocomplete
      const validVenues: Venue[] = venuesData
        .filter((venue: ExtendedApiVenue) => {
          return (
            venue && 
            venue.name &&
            ((venue.latitude !== undefined && isValidCoordinate(venue.latitude) && 
              venue.longitude !== undefined && isValidCoordinate(venue.longitude)) ||
             (venue.lat !== undefined && isValidCoordinate(venue.lat) && 
              venue.lng !== undefined && isValidCoordinate(venue.lng)))
          );
        })
        .map((venue: ExtendedApiVenue): Venue => ({
          id: venue.id,
          name: venue.name,
          address: venue.address || "",
          latitude: Number(venue.latitude) || Number(venue.lat),
          longitude: Number(venue.longitude) || Number(venue.lng),
          phone: venue.phone,
          website: venue.website,
          genres: venue.genres,
          description: venue.description,
          category: venue.category || venue.venue_type,
          city: venue.city,
          state: venue.state,
          zip_code: venue.zip_code,
          email: venue.email,
          amenities: venue.amenities,
          tags: venue.tags,
          ambiances: venue.ambiances,
          crowd_types: venue.crowd_types,
          image: venue.image,
          display_name: venue.name,
          place_id: String(venue.id)
        }));
      
      setSearchResults(validVenues.slice(0, 5)); // Batasi hingga 5 saran
      setShowDropdown(validVenues.length > 0);
      setIsSearching(false);
    } catch (err) {
      console.error('Gagal mengambil saran venue:', err);
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  // Handle untuk memilih venue dari dropdown
  const handleSelectPlace = (venue: Venue) => {
    setSearchQuery(venue.name);
    setShowDropdown(false);
    
    // Set venue yang dipilih sebagai hasil pencarian
    setFilteredVenues([venue]);
    
    // Jika ada koordinat yang valid, pusatkan peta pada venue ini
    if (isValidCoordinate(venue.latitude) && isValidCoordinate(venue.longitude)) {
      safeSetMapCenter(venue.latitude, venue.longitude);
      setMapZoom(15);
    }
    
    // Pilih venue tersebut langsung
    setSelectedVenue(venue);
    setShowBottomCard(true);
  };

  // Menangani pencarian saat tombol Enter ditekan
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    
    if (!searchQuery.trim()) {
      setFilteredVenues(venues);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Buat objek parameter pencarian
      const searchParams: VenueSearchParams = {
        query: searchQuery
      };
      
      // Panggil API untuk mencari venue
      const response = await searchVenues(searchParams);
      
      // Validasi dan transformasi data yang diterima
      const venuesData = response.data ? response.data : (Array.isArray(response) ? response : []);
      
      console.log("Hasil pencarian venues:", venuesData);
      
      // Validasi data venue sebelum disimpan dalam state
      const validVenues: Venue[] = venuesData
        .filter((venue: ExtendedApiVenue) => {
          return (
            venue && 
            venue.name &&
            ((venue.latitude !== undefined && isValidCoordinate(venue.latitude) && 
              venue.longitude !== undefined && isValidCoordinate(venue.longitude)) ||
             (venue.lat !== undefined && isValidCoordinate(venue.lat) && 
              venue.lng !== undefined && isValidCoordinate(venue.lng)))
          );
        })
        .map((venue: ExtendedApiVenue): Venue => ({
          id: venue.id,
          name: venue.name,
          address: venue.address || "",
          latitude: Number(venue.latitude) || Number(venue.lat),
          longitude: Number(venue.longitude) || Number(venue.lng),
          phone: venue.phone,
          website: venue.website,
          genres: venue.genres,
          description: venue.description,
          category: venue.category || venue.venue_type,
          city: venue.city,
          state: venue.state,
          zip_code: venue.zip_code,
          email: venue.email,
          amenities: venue.amenities,
          tags: venue.tags,
          ambiances: venue.ambiances,
          crowd_types: venue.crowd_types,
          image: venue.image,
          display_name: venue.name,
          place_id: String(venue.id)
        }));
      
      setFilteredVenues(validVenues);
      
      // Jika hanya ada satu hasil pencarian, pilih langsung
      if (validVenues.length === 1) {
        const venueToSelect = validVenues[0];
        if (venueToSelect) {
          handleMarkerClick(venueToSelect);
        }
      }
      // Jika ada beberapa hasil, zoom dan reposisi peta untuk menampilkan semua hasil
      else if (validVenues.length > 1) {
        // Tentukan bound dari semua marker yang valid
        const bounds = new google.maps.LatLngBounds();
        validVenues.forEach(venue => {
          if (isValidCoordinate(venue.latitude) && isValidCoordinate(venue.longitude)) {
            bounds.extend({ lat: Number(venue.latitude), lng: Number(venue.longitude) });
          }
        });
        
        // Pastikan peta sudah terinisialisasi
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Gagal melakukan pencarian venues:', err);
      setError('Gagal melakukan pencarian venue.');
      
      // Jika gagal, lakukan pencarian lokal sebagai fallback
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = venues.filter((venue) => {
        // Validasi name
        const nameMatch = venue.name.toLowerCase().includes(lowerQuery);
        
        // Validasi address
        const addressMatch = venue.address ? 
          venue.address.toLowerCase().includes(lowerQuery) : false;
        
        // Validasi category
        const categoryMatch = venue.category ? 
          venue.category.toLowerCase().includes(lowerQuery) : false;
        
        // Validasi genres
        const genresMatch = venue.genres && venue.genres.length > 0 ? 
          venue.genres.some((genre) => {
            return genre && genre.name ? 
              genre.name.toLowerCase().includes(lowerQuery) : false;
          }) : false;

        // Validasi city
        const cityMatch = venue.city ?
          venue.city.toLowerCase().includes(lowerQuery) : false;
        
        return nameMatch || addressMatch || categoryMatch || genresMatch || cityMatch;
      });
      
      setFilteredVenues(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  // Tampilkan loading screen sampai data dan map siap
  if (isLoading || !mapsLoaded || !isDataReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Mohon Tunggu</h2>
          <p className="text-gray-600">Sedang memuat data venues...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error
  if (mapsLoadError || error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500 p-6 rounded-lg border border-red-300 bg-red-50 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{mapsLoadError ? "Gagal memuat Google Maps" : error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada venues yang valid
  if (venues.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Tidak Ada Venues</h2>
          <p className="text-gray-600">Tidak ada venue dengan koordinat yang valid saat ini.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Render halaman utama hanya ketika data dan map siap
  return (
    <div className="w-full h-[calc(100vh-5rem)] relative flex flex-col pt-">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-md z-10 mt-[5rem] rounded-lg mx-2">
        <div 
          ref={searchRef}
          className="relative max-w-md mx-auto"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Cari venue..."
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-12 text-gray-700 shadow-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-red-500 p-2 text-white transition-colors duration-300 hover:bg-red-600"
              >
                {isSearching ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
              {searchResults.map((venue) => (
                <div
                  key={venue.id.toString()}
                  className="flex cursor-pointer items-start border-b border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => handleSelectPlace(venue)}
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
                      {venue.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {venue.address}
                      {venue.city && `, ${venue.city}`}
                      {venue.state && `, ${venue.state}`}
                    </p>
                    {venue.category && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {venue.category}
                        </span>
                        {venue.genres && venue.genres.length > 0 && venue.genres[0] && (
                          <span className="ml-2 text-xs text-gray-500">
                            {venue.genres[0].name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="h-[41vh]">
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
            zoomControl: true,
          }}
        >
          {filteredVenues.filter((venue) => 
            isValidCoordinate(venue.latitude) && isValidCoordinate(venue.longitude)
          ).map((venue) => (
            <Marker
              key={venue.id.toString()}
              position={{ 
                lat: Number(venue.latitude), 
                lng: Number(venue.longitude) 
              }}
              onClick={() => handleMarkerClick(venue)}
              title={venue.name}
              icon={{
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23FF3366' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3'%3E%3C/circle%3E%3C/svg%3E",
                scaledSize: new google.maps.Size(36, 36),
              }}
            />
          ))}

          {selectedVenue && isValidCoordinate(selectedVenue.latitude) && isValidCoordinate(selectedVenue.longitude) && (
            <InfoWindow
              position={{ 
                lat: Number(selectedVenue.latitude), 
                lng: Number(selectedVenue.longitude) 
              }}
              onCloseClick={() => setSelectedVenue(null)}
            >
              <div className="max-w-xs">
                <h3 className="font-bold text-lg">{selectedVenue.name}</h3>
                {selectedVenue.address && (
                  <p className="text-sm">
                    {selectedVenue.address}
                    {selectedVenue.city && `, ${selectedVenue.city}`}
                    {selectedVenue.state && `, ${selectedVenue.state}`}
                    {selectedVenue.zip_code && ` ${selectedVenue.zip_code}`}
                  </p>
                )}
                
                {selectedVenue.description && <p className="text-sm mt-1">{selectedVenue.description}</p>}
                {selectedVenue.category && <p className="text-sm mt-1">Kategori: {selectedVenue.category}</p>}
                {selectedVenue.phone && <p className="text-sm mt-1">Telepon: {selectedVenue.phone}</p>}
                {selectedVenue.email && <p className="text-sm mt-1">Email: {selectedVenue.email}</p>}
                
                {selectedVenue.website && (
                  <p className="text-sm mt-1">
                    Website:{" "}
                    <a href={selectedVenue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {selectedVenue.website}
                    </a>
                  </p>
                )}
                
                {selectedVenue.genres && selectedVenue.genres.length > 0 && (
                  <p className="text-sm mt-1">Genre: {selectedVenue.genres.map((g) => g.name).join(", ")}</p>
                )}
                
                {selectedVenue.tags && selectedVenue.tags.length > 0 && (
                  <p className="text-sm mt-1">Tags: {selectedVenue.tags.map((t) => t.name).join(", ")}</p>
                )}
                
                {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
                  <p className="text-sm mt-1">Fasilitas: {selectedVenue.amenities.map((a) => a.name).join(", ")}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {/* Category Filter */}
      <div className="mx-4 my-3 h-[8vh] overflow-x-auto">
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
              {filterDropdownOpen === category.id && (
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

      {/* Bottom Card - Location Info */}
      <div className="flex-none h-[25vh]">
        {showBottomCard && selectedVenue && (
          <div
            className="w-full overflow-y-auto rounded-t-3xl bg-gradient-to-r from-red-600 to-red-800 px-5 pt-5 pb-3 shadow-lg transition-all duration-300 ease-in-out"
            style={{
              maxHeight: "50vh",
              transform: showBottomCard ? "translateY(0)" : "translateY(100%)",
              opacity: showBottomCard ? 1 : 0,
            }}
          >
            <div className="mx-auto mb-2 h-1 w-12 cursor-pointer rounded-full bg-white" />
            <div className="flex flex-col">
              <div className="flex gap-4">
                {/* Image on the left */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={
                      selectedVenue.image
                    }
                    alt={"Venue Image"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text content on the right */}
                <div className="flex-grow">
                  <h2 className="mb-1 text-lg font-bold text-white">
                    {selectedVenue.name}
                  </h2>
                  <p className="mb-3 text-xs text-white/80">
                    {selectedVenue.type ?? "Venue"}:{" "}
                    {selectedVenue.name}
                    {selectedVenue.genres && selectedVenue.genres.length > 0 &&
                      selectedVenue.genres[0]?.name && ` | Genre: ${selectedVenue.genres[0].name}`}
                  </p>

                  <div className="mb-2 flex flex-wrap gap-1">
                    {selectedVenue.category && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90">
                        {selectedVenue.category}
                      </span>
                    )}

                    {/* Show tags or genres as badges */}
                    {selectedVenue.genres && selectedVenue.genres.map((genre, idx) => (
                      <span key={idx} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90">
                        {genre.name.toLowerCase()}
                      </span>
                    ))}
                    
                    {selectedVenue.tags && selectedVenue.tags.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90">
                        {tag.name.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  {/* Additional info */}
                  <p className="mb-1 text-[10px] text-white/70">
                    {selectedVenue.phone && `Phone: ${selectedVenue.phone}`}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-4">
                <h3 className="text-md font-semibold text-white">Details</h3>
                <ul className="mt-2 space-y-1 text-sm text-white/80">
                  <li>
                    <strong>Address:</strong>{" "}
                    {selectedVenue.address || "N/A"}
                  </li>
                  <li>
                    <strong>Rating:</strong>{" "}
                    {"4.5/5"}
                  </li>
                  <li>
                    <strong>Email:</strong>{" "}
                    {selectedVenue.email || "N/A"}
                  </li>
                  <li>
                    <strong>Website:</strong>{" "}
                    {selectedVenue.website || "N/A"}
                  </li>
                </ul>
              </div>

              {/* Carousel Placeholder */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-white">
                  Nearby Locations
                </h3>
                <div className="mt-2 flex gap-4 overflow-x-auto pb-4">
                  {nearbyVenues.length > 0 ? (
                    nearbyVenues.map((venue) => (
                      <div
                        key={venue.id.toString()}
                        className="min-w-[200px] flex-shrink-0 rounded-lg bg-white p-3 shadow-md"
                        onClick={() => handleMarkerClick(venue)}
                      >
                        <img
                          src={venue.image || "https://via.placeholder.com/200x200?text=Venue"}
                          alt={venue.name}
                          className="h-32 w-full rounded-md object-cover"
                        />
                        <h4 className="mt-2 text-sm font-bold text-gray-800">
                          {venue.name}
                        </h4>
                        <p className="text-xs text-gray-600">{venue.address}</p>
                        {venue.category && (
                          <p className="mt-1 text-xs text-gray-500">
                            <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                              {venue.category}
                            </span>
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-white/70">
                      <p>Tidak ada lokasi terdekat yang ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Close Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowBottomCard(false)}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {filteredVenues.length === 0 && venues.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Tidak ada venue yang sesuai dengan pencarian Anda</p>
        </div>
      )}
    </div>
  );
}
