"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { fetchVenues, fetchAmenities, fetchTags, fetchGenres } from "../utils/api";

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
  },
  {
    title: "Amenities",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    bgGradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Tags",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    bgGradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Genres",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    bgGradient: "from-yellow-500 to-yellow-600",
  }
];

// Recent venues data
const recentActivity = [
  {
    id: 1,
    type: "venue",
    action: "added",
    name: "The Bass Lounge",
    time: "5 minutes ago",
    user: "Admin User",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8V7a1 1 0 00-1-1H6a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 2,
    type: "article",
    action: "updated",
    name: "Top 10 EDM Venues in NYC",
    time: "1 hour ago",
    user: "Content Editor",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 3,
    type: "user",
    action: "registered",
    name: "john_doe_music",
    time: "3 hours ago",
    user: "System",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 4,
    type: "genre",
    action: "added",
    name: "Future Garage",
    time: "Yesterday",
    user: "Admin User",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
      </svg>
    )
  },
  {
    id: 5,
    type: "venue",
    action: "updated",
    name: "Techno Temple",
    time: "2 days ago",
    user: "Venue Manager",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8V7a1 1 0 00-1-1H6a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1z" clipRule="evenodd" />
      </svg>
    )
  }
];

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
  };
  
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setCurrentTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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

        // Extract data from successful API calls
        if (venuesResult.status === 'fulfilled') {
          venuesCount = venuesResult.value.length;
        }
        
        if (amenitiesResult.status === 'fulfilled') {
          amenitiesCount = amenitiesResult.value.length;
        }
        
        if (tagsResult.status === 'fulfilled') {
          tagsCount = tagsResult.value.length;
        }
        
        if (genresResult.status === 'fulfilled') {
          genresCount = genresResult.value.length;
        }

        setStatsData([
          { ...statsConfig[0], value: venuesCount, change: "+5%", positive: true } as StatItem,
          { ...statsConfig[1], value: amenitiesCount, change: "+2%", positive: true } as StatItem,
          { ...statsConfig[2], value: tagsCount, change: "+8%", positive: true } as StatItem,
          { ...statsConfig[3], value: genresCount, change: "+3%", positive: true } as StatItem,
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
              <div key={index} className="relative overflow-hidden group">
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
              </div>
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
                Recent Venues
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    activity.type === 'venue' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'article' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'user' ? 'bg-green-100 text-green-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      <span className="font-medium">{activity.user}</span> {activity.action} this {activity.type}
                    </p>
                  </div>
                  <button className="ml-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Activity
              </button>
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
              {/* Action Cards */}
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
                      <p className="mt-1 text-sm text-gray-500">Add, edit or remove venues</p>
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

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Bassline Admin Dashboard • Last updated: April 20, 2025</p>
        </div>
      </div>
    </AdminLayout>
  );
}
