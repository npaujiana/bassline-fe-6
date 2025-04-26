"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchVenueById, deleteVenue } from "../../../utils/api";
import type { Venue } from "../../../utils/api";
import { FiEdit, FiTrash2, FiArrowLeft, FiClock, FiMapPin, FiPhone, FiMail, FiGlobe } from "react-icons/fi";

export default function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  // Await the params to extract the id
  const [id, setId] = useState<string | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fetchVenueById(id);
        setVenue(data);
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError("Failed to load venue data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(id!);
        router.push("/dashboard/venues");
      } catch (err) {
        console.error("Error deleting venue:", err);
        alert("Failed to delete venue. Please try again later.");
      }
    }
  };

  // Helper to format days of week
  const formatDayOfWeek = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day % 7];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !venue) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          <p>{error || "Venue not found"}</p>
        </div>
        <div>
          <Link
            href="/dashboard/venues"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          >
            <FiArrowLeft className="mr-2" /> Back to Venue List
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <Link
            href="/dashboard/venues"
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" /> Back to venue list
          </Link>
          <div className="flex space-x-2">
            <Link
              href={`/dashboard/venues/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Venue Name */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl text-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="mt-2 text-lg opacity-90">{venue.city || "Location not available"}</p>
        </div>

        {/* Venue Details */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Basic Info */}
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              
              <div>
                <h3 className="text-sm text-gray-500">Description</h3>
                <p className="text-gray-700">{venue.description || "No description available"}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Capacity</h3>
                <p className="text-gray-700">{venue.capacity || "Not available"}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Price Range</h3>
                <p className="text-gray-700">{venue.price_range || "Not available"}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Dress Code</h3>
                <p className="text-gray-700">{venue.dress_code || "None"}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Cover Charge</h3>
                <p className="text-gray-700">{venue.cover_charge || "None"}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Parking</h3>
                <p className="text-gray-700">{venue.parking || "Not available"}</p>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Contact & Location</h2>
              
              <div className="flex items-start">
                <FiMapPin className="mt-1 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm text-gray-500">Address</h3>
                  <p className="text-gray-700">
                    {venue.address ? (
                      <>
                        {venue.address}
                        <br />
                        {venue.city && venue.city}
                        {venue.state && `, ${venue.state}`}
                        {venue.zip_code && ` ${venue.zip_code}`}
                      </>
                    ) : (
                      "Address not available"
                    )}
                  </p>
                </div>
              </div>

              {venue.phone && (
                <div className="flex items-center">
                  <FiPhone className="text-red-500 mr-2" />
                  <div>
                    <h3 className="text-sm text-gray-500">Phone</h3>
                    <p className="text-gray-700">{venue.phone}</p>
                  </div>
                </div>
              )}

              {venue.email && (
                <div className="flex items-center">
                  <FiMail className="text-red-500 mr-2" />
                  <div>
                    <h3 className="text-sm text-gray-500">Email</h3>
                    <p className="text-gray-700">{venue.email}</p>
                  </div>
                </div>
              )}

              {venue.website && (
                <div className="flex items-center">
                  <FiGlobe className="text-red-500 mr-2" />
                  <div>
                    <h3 className="text-sm text-gray-500">Website</h3>
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {venue.website}
                    </a>
                  </div>
                </div>
              )}

              {venue.latitude && venue.longitude && (
                <div>
                  <h3 className="text-sm text-gray-500">Coordinates</h3>
                  <p className="text-gray-700">
                    {venue.latitude}, {venue.longitude}
                  </p>
                </div>
              )}
            </div>

            {/* Hours & Tags */}
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Hours & Categories</h2>
              
              <div>
                <h3 className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-2 text-red-500" /> Operating Hours
                </h3>
                {venue.hours && venue.hours.length > 0 ? (
                  <div className="space-y-1 mt-2">
                    {venue.hours.map((hour, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-medium">{formatDayOfWeek(hour.day_of_week)}</span>
                        <span>
                          {hour.open_time} - {hour.close_time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No operating hours information</p>
                )}
              </div>

              {venue.tags && venue.tags.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {venue.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {venue.amenities && venue.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {venue.amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {venue.genres && venue.genres.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500">Music Genre</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {venue.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}