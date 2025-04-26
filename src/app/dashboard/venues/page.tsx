"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import { fetchVenues, deleteVenue, searchVenues, fetchTags, fetchAmenities, fetchGenres } from "../../utils/api";
import type { Venue, VenueSearchParams, Tag, Amenity, Genre, Ambiance, CrowdType } from "../../utils/api";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiFilter } from "react-icons/fi";

export default function VenuesDashboard() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedAmbiances, setSelectedAmbiances] = useState<number[]>([]);
  const [selectedCrowdTypes, setSelectedCrowdTypes] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ambiances, setAmbiances] = useState<Ambiance[]>([]);
  const [crowdTypes, setCrowdTypes] = useState<CrowdType[]>([]);

  // Fetch venues and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [venuesData, tagsData, amenitiesData, genresData] = await Promise.all([
          fetchVenues(),
          fetchTags(),
          fetchAmenities(),
          fetchGenres()
        ]);
        
        setVenues(venuesData);
        setTags(tagsData || []);
        setAmenities(amenitiesData || []);
        setGenres(genresData || []);
        
        // Note: Assuming these would be available from the API in a real implementation
        // In a real app, you would have endpoints for these
        setAmbiances([]);
        setCrowdTypes([]);
      } catch (error) {
        console.error("Error loading venue data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search with filters
  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchParams: VenueSearchParams = {
        query: searchQuery,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        ambiances: selectedAmbiances.length > 0 ? selectedAmbiances : undefined,
        crowd_types: selectedCrowdTypes.length > 0 ? selectedCrowdTypes : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined
      };
      
      const results = await searchVenues(searchParams);
      setVenues(results);
    } catch (error) {
      console.error("Error searching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and filters
  const handleClearSearch = async () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedAmbiances([]);
    setSelectedCrowdTypes([]);
    setSelectedAmenities([]);
    
    try {
      setLoading(true);
      const venuesData = await fetchVenues();
      setVenues(venuesData);
    } catch (error) {
      console.error("Error resetting venues:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle venue deletion
  const handleDeleteVenue = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus venue ini?")) {
      try {
        await deleteVenue(id);
        setVenues(venues.filter(venue => venue.id !== id));
      } catch (error) {
        console.error("Error deleting venue:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 -mb-10 -ml-10"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Venues Management</h1>
              <p className="mt-2 opacity-80">Manage your music venues information</p>
            </div>
            <Link 
              href="/dashboard/venues/add" 
              className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium flex items-center shadow-md transition-all duration-200"
            >
              <FiPlus className="mr-2" /> Tambah Venue
            </Link>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari venue..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center"
                onClick={handleSearch}
              >
                <FiSearch className="mr-2" /> Cari
              </button>
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FiFilter className="mr-2" /> Filter
              </button>
              {(searchQuery || selectedTags.length > 0 || selectedAmenities.length > 0) && (
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all flex items-center"
                  onClick={handleClearSearch}
                >
                  <FiX className="mr-2" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tags Filter */}
                <div>
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 5).map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setSelectedTags(
                            selectedTags.includes(Number(tag.id))
                              ? selectedTags.filter(id => id !== Number(tag.id))
                              : [...selectedTags, Number(tag.id)]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(Number(tag.id))
                            ? "bg-red-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.slice(0, 5).map((amenity) => (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          setSelectedAmenities(
                            selectedAmenities.includes(amenity.id)
                              ? selectedAmenities.filter(id => id !== amenity.id)
                              : [...selectedAmenities, amenity.id]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedAmenities.includes(amenity.id)
                            ? "bg-red-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700"
                        }`}
                      >
                        {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Venues List */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : venues.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-6xl text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">No venues found</h2>
                <p className="text-gray-500 mt-2">Tambahkan venue baru atau ubah filter pencarian Anda</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasitas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {venues.map((venue) => (
                    <tr key={venue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {venue.description?.substring(0, 60) || "No description"}
                              {venue.description && venue.description.length > 60 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{venue.city || '-'}</div>
                        <div className="text-sm text-gray-500">{venue.address?.substring(0, 30) || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{venue.capacity || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{venue.phone || '-'}</div>
                        <div className="text-sm text-gray-500">{venue.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/dashboard/venues/${venue.id}`}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Detail
                          </Link>
                          <Link
                            href={`/dashboard/venues/edit/${venue.id}`}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                          >
                            <FiEdit className="inline" />
                          </Link>
                          <button
                            onClick={() => handleDeleteVenue(venue.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                          >
                            <FiTrash2 className="inline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}