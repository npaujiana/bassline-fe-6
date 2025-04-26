"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { fetchVenues, fetchAmenities, fetchTags, fetchGenres } from "../utils/api";
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Mendaftarkan komponen chart yang dibutuhkan
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Stats data icons and gradient configurations
const statsConfig = [
  {
    title: "Information Venues",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    bgGradient: "from-red-500 to-red-600",
    link: "/dashboard/venues"
  },
  {
    title: "Amenities",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    bgGradient: "from-purple-500 to-purple-600",
    link: "/dashboard/amenities"
  },
  {
    title: "Tags",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    bgGradient: "from-blue-500 to-blue-600",
    link: "/dashboard/tags"
  },
  {
    title: "Genres",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    bgGradient: "from-yellow-500 to-yellow-600",
    link: "/dashboard/genres"
  }
];

// Mendefinisikan tipe untuk respons API
// Karena struktur respons dari setiap API berbeda, kita akan definisikan respons secara spesifik untuk setiap API call
// interface ApiResponse<T> {
//   data: T[] | {
//     pagination?: {
//       page: number;
//       per_page: number;
//       total_items: number;
//       total_pages: number;
//     };
//     tags?: Tag[];
//     amenities?: Amenity[];
//     genres?: Genre[];
//     venues?: Venue[];
//   };
//   message?: string;
//   success?: boolean;
//   pagination?: {
//     total: number;
//     pages: number;
//     current_page: number;
//     per_page: number;
//     total_items?: number;
//   };
// }

interface Venue {
  id: string;
  name: string;
  description: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  category?: string;
  rating?: number;
  created_by?: string;
  tags: Tag[];
  genres: Genre[];
  amenities: Amenity[];
  venue_type?: string;
  // Properti lainnya
}

interface Amenity {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface Tag {
  id: number;
  name: string;
  description: string;
}

interface Genre {
  id: number;
  name: string;
  description: string;
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  // Define the type for stat items
  type StatItem = {
    title: string;
    icon: React.ReactNode;
    bgGradient: string;
    value: number;
    change: string;
    positive: boolean;
    link: string;
  };
  
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentVenues, setRecentVenues] = useState<any[]>([]);
  
  // Chart data states
  const [venueTypeData, setVenueTypeData] = useState({
    labels: ['Bar', 'Club', 'Lounge', 'Festival', 'Other'],
    datasets: [{
      label: 'Venue Types',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  });
  
  const [ratingData, setRatingData] = useState({
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      label: 'Rating Distribution',
      data: [0, 0, 0, 0, 0],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Use Promise.allSettled to handle all API calls together, even if some fail
        const [venuesResult, amenitiesResult, tagsResult, genresResult] = await Promise.allSettled([
          fetchVenues(),
          fetchAmenities(),
          fetchTags(),
          fetchGenres()
        ]);

        // Default values in case API fails
        let venuesCount = 0;
        let amenitiesCount = 0;
        let tagsCount = 0;
        let genresCount = 0;
        let venuesData: Venue[] = [];

        // Extract data from successful API calls
        if (venuesResult.status === 'fulfilled') {
          // Log response untuk debugging
          console.log('Venues API response:', venuesResult.value);
          
          const response = venuesResult.value as any;
          
          // Reset data venues
          venuesData = [];
          
          try {
            // Coba berbagai kemungkinan struktur data
            if (response && response.data && Array.isArray(response.data)) {
              // Format 1: { data: [...] }
              venuesData = response.data;
            } else if (response && response.data && response.data.venues && Array.isArray(response.data.venues)) {
              // Format 2: { data: { venues: [...] } }
              venuesData = response.data.venues;
            } else if (Array.isArray(response)) {
              // Format 3: directly array
              venuesData = response;
            }
          } catch (error) {
            console.error('Error parsing venues data:', error);
          }
          
          venuesCount = venuesData.length;
          console.log('Processed venues data:', venuesData);
          console.log('Venues count:', venuesCount);
          
          // Update recent venues dengan data yang benar
          const recentVenuesList = venuesData.slice(0, 5).map((venue: Venue, index: number) => {
            const venueId = venue.id || index + 1;
            const venueName = venue.name || 'Unnamed Venue';
            const venueAddress = venue.address || 'No address';
            
            return {
              id: venueId,
              type: 'venue',
              action: 'added',
              name: venueName,
              address: venueAddress,
              time: new Date().toLocaleDateString('en-US'),
              user: venue.created_by || 'Admin User',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8V7a1 1 0 00-1-1H6a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1z" clipRule="evenodd" />
                </svg>
              )
            };
          });
          
          setRecentVenues(recentVenuesList);
          
          // Persiapkan data untuk chart venue type berdasarkan kategori atau tipe venue
          const venueTypes: Record<string, number> = {};
          
          venuesData.forEach((venue: Venue) => {
            // Coba ambil kategori dari venue (bisa dari kategori, tipe, atau tags)
            let category = venue.venue_type || 'Other';
            
            if (!category && venue.tags && venue.tags.length > 0) {
              // Jika tidak ada kategori, gunakan tag pertama sebagai kategori
              category = venue.tags[0]?.name || 'Other';
            }
            
            venueTypes[category] = (venueTypes[category] || 0) + 1;
          });
          
          // Jika tidak ada tipe venue yang ditemukan, gunakan data dummy
          if (Object.keys(venueTypes).length === 0) {
            // Contoh tipe venue dummy
            venueTypes['Bar'] = 1;
            venueTypes['Club'] = 0;
            venueTypes['Lounge'] = 0;
            venueTypes['Festival'] = 0;
            venueTypes['Other'] = 0;
          }
          
          console.log('Venue types for chart:', venueTypes);
          
          // Update chart venue type
          setVenueTypeData({
            labels: Object.keys(venueTypes),
            datasets: [{
              label: 'Venue Types',
              data: Object.values(venueTypes),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            }]
          });
          
          // Persiapkan data rating
          // Ambil data rating dari venue jika ada, atau gunakan data dummy sebagai fallback
          const ratings: Record<string, number> = {
            '5 Stars': 0,
            '4 Stars': 0,
            '3 Stars': 0,
            '2 Stars': 0,
            '1 Star': 0
          };
          
          venuesData.forEach((venue: Venue) => {
            if (venue.rating) {
              const rating = Math.floor(venue.rating);
              if (rating >= 1 && rating <= 5) {
                const key = `${rating} ${rating === 1 ? 'Star' : 'Stars'}`;
                ratings[key] = (ratings[key] || 0) + 1;
              }
            }
          });
          
          // Jika tidak ada rating, gunakan data dummy
          let hasRatingData = false;
          for (const count of Object.values(ratings)) {
            if (count > 0) {
              hasRatingData = true;
              break;
            }
          }
          
          if (!hasRatingData) {
            // Gunakan data dummy agar chart tetap terlihat
            ratings['5 Stars'] = 5;
            ratings['4 Stars'] = 12;
            ratings['3 Stars'] = 8;
            ratings['2 Stars'] = 3;
            ratings['1 Star'] = 1;
          }
          
          console.log('Rating data for chart:', ratings);
          
          // Update chart rating
          setRatingData({
            labels: Object.keys(ratings),
            datasets: [{
              label: 'Rating Distribution',
              data: Object.values(ratings),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }]
          });
        }
        
        if (amenitiesResult.status === 'fulfilled') {
          console.log('Amenities API response:', amenitiesResult.value);
          
          const response = amenitiesResult.value as unknown as {
            data: Amenity[];
            pagination: {
              total_items: number;
              pages: number;
              current_page: number;
              per_page: number;
            };
          };
          console.log('Response:', response);
          
          // Struktur respons amenities berbeda: data.pagination.total_items
          if (response && response.pagination) {
            amenitiesCount = response.pagination.total_items;
          } else {
            // Fallback ke panjang array jika pagination tidak tersedia
            let amenitiesData: Amenity[] = [];
            if (response && response.data && response.data) {
              amenitiesData = response.data;
            }
            
            amenitiesCount = amenitiesData.length;
          }
          
          console.log('Amenities count:', amenitiesCount);
        }
        
        if (tagsResult.status === 'fulfilled') {
          console.log('Tags API response:', tagsResult.value);
          
          // Handle response format sesuai struktur API yang sebenarnya
          const response = tagsResult.value as unknown as any;
          
          // Format respons: { data: { pagination: { total_items: X }, tags: [...] } }
          if (response && response.data && response.data.pagination && response.data.pagination.total_items !== undefined) {
            tagsCount = response.data.pagination.total_items;
            console.log('Tags count from total_items:', tagsCount);
          } else {
            // Fallback ke panjang array jika struktur berbeda
            let tagsData: Tag[] = [];
            if (response && response.data && Array.isArray(response.data.tags)) {
              tagsData = response.data.tags;
            } else if (response && Array.isArray(response.data)) {
              tagsData = response.data;
            } else if (Array.isArray(response)) {
              tagsData = response;
            }
            
            tagsCount = tagsData.length;
            console.log('Tags count from length:', tagsCount);
          }
        }
        
        if (genresResult.status === 'fulfilled') {
          console.log('Genres API response:', genresResult.value);
          
          const response = genresResult.value as unknown as {
            data: {
              pagination: {
                page: number;
                per_page: number;
                total_items: number;
                total_pages: number;
              };
              genres: Genre[];
            };
          };
          
          // Struktur respons genres berbeda: data.pagination.total_items
          if (response && response.data && response.data.pagination) {
            genresCount = response.data.pagination.total_items;
          } else {
            // Fallback ke panjang array jika pagination tidak tersedia
            let genresData: Genre[] = [];
            if (response && response.data && response.data.genres) {
              genresData = response.data.genres;
            }
            
            genresCount = genresData.length;
          }
          
          console.log('Genres count:', genresCount);
        }

        console.log('Stats data to be displayed:', {
          venues: venuesCount,
          amenities: amenitiesCount,
          tags: tagsCount,
          genres: genresCount
        });

        setStatsData([
          { 
            title: statsConfig[0]?.title || "Information Venues", 
            icon: statsConfig[0]?.icon || <></>, 
            bgGradient: statsConfig[0]?.bgGradient || "from-red-500 to-red-600", 
            value: venuesCount, 
            change: "+5%", 
            positive: true, 
            link: statsConfig[0]?.link || "/dashboard/venues" 
          },
          { 
            title: statsConfig[1]?.title || "Amenities", 
            icon: statsConfig[1]?.icon || <></>, 
            bgGradient: statsConfig[1]?.bgGradient || "from-purple-500 to-purple-600", 
            value: amenitiesCount, 
            change: "+2%", 
            positive: true, 
            link: statsConfig[1]?.link || "/dashboard/amenities" 
          },
          { 
            title: statsConfig[2]?.title || "Tags", 
            icon: statsConfig[2]?.icon || <></>, 
            bgGradient: statsConfig[2]?.bgGradient || "from-blue-500 to-blue-600", 
            value: tagsCount, 
            change: "+8%", 
            positive: true, 
            link: statsConfig[2]?.link || "/dashboard/tags" 
          },
          { 
            title: statsConfig[3]?.title || "Genres", 
            icon: statsConfig[3]?.icon || <></>, 
            bgGradient: statsConfig[3]?.bgGradient || "from-yellow-500 to-yellow-600", 
            value: genresCount, 
            change: "+3%", 
            positive: true, 
            link: statsConfig[3]?.link || "/dashboard/genres" 
          }
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Venue Type Distribution',
      },
    },
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rating Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section with Date/Time */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 -mb-10 -ml-10"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Welcome to Bassline Admin</h1>
            <p className="mt-2 opacity-80">Manage your music venues and content efficiently.</p>
            
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Current Date & Time</p>
                <div className="mt-1">
                  <p className="text-xl">{currentDate}</p>
                  <p className="text-2xl font-mono tracking-wider">{currentTime}</p>
                </div>
              </div>
              
              <div className="flex items-center mt-4 sm:mt-0">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="col-span-4 text-center text-gray-500">Loading...</div>
          ) : (
            statsData.map((stat, index) => (
              <Link href={stat.link} key={index} className="relative overflow-hidden group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 h-16 w-16 rounded-tl-full bg-white/10"></div>
                <div className="absolute top-0 left-0 h-8 w-8 rounded-br-full bg-white/10"></div>
                
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-white/20">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-white/0 rounded-xl transition-all duration-300 group-hover:border-white/20 pointer-events-none"></div>
              </Link>
            ))
          )}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Venues Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Latest Venues
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentVenues.length > 0 ? (
                recentVenues.map((venue) => (
                  <div key={venue.id} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 rounded-full p-2 bg-blue-100 text-blue-600">
                      {venue.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{venue.name}</p>
                        <p className="text-xs text-gray-500">{venue.time}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        <span className="font-medium">{venue.address}</span>
                      </p>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No venues available</div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Link href="/dashboard/venues" className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors block">
                View All Venues
              </Link>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm14 5H1v11a1 1 0 001 1h16a1 1 0 001-1V7z" clipRule="evenodd" />
                </svg>
                Quick Actions
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <Link href="/dashboard/venues" className="block group">
                <div className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-red-200 bg-gradient-to-r hover:from-red-50 hover:to-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-red-600 transition-colors">Manage Venues</h3>
                      <p className="mt-1 text-sm text-gray-500">Add, edit or delete venues</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/articles" className="block group">
                <div className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-red-200 bg-gradient-to-r hover:from-red-50 hover:to-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-red-600 transition-colors">Manage Articles</h3>
                      <p className="mt-1 text-sm text-gray-500">Create and publish new content</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/users" className="block group">
                <div className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-red-200 bg-gradient-to-r hover:from-red-50 hover:to-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-red-600 transition-colors">User Management</h3>
                      <p className="mt-1 text-sm text-gray-500">Manage user accounts and permissions</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Link href="/dashboard/settings" className="block w-full text-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart - Venue Types */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Venue Types
              </h2>
            </div>
            <div className="p-6" style={{height: "300px"}}>
              <Pie data={venueTypeData} options={pieChartOptions} />
            </div>
          </div>

          {/* Bar Chart - Ratings */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Rating Distribution
              </h2>
            </div>
            <div className="p-6" style={{height: "300px"}}>
              <Bar data={ratingData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Bassline Admin Dashboard • Last updated: {new Date().toLocaleDateString('en-US')}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
