"use client";

import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';

const dummyRecommendations = [
  {
    id: 1,
    title: 'Bar Part Time',
    description: 'Trendy spot featuring House and Disco music in a vibrant atmosphere.',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMoS60Pk6Mx8r52E0_S2a44U6hHsXsbUOhbmWuQ=w408-h306-k-no',
    location: '496 14th St, San Francisco, CA 94103',
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Key Klub',
    description: 'Stylish cocktail bar with an intimate setting and curated drink menu.',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipPH0E5eSBaR5Cu53NdN00lnHlcmjl0Rrftp-Aza=w426-h240-k-no',
    location: '850 Bush St, San Francisco, CA 94108',
    rating: 4.6,
  },
  {
    id: 3,
    title: 'Verjus',
    description: 'Elegant wine bar and bottle shop offering exceptional small plates and ambiance.',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipP9Y8jRBvlz8jNiTO8MVsA3bp6oNts4AVM2twYo=w408-h271-k-no',
    location: '550 Washington St, San Francisco, CA 94111',
    rating: 4.5,
  },
];

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-blue-950 p-8 md:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 -right-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
      
      <div className="container mx-auto my-10 relative z-10">
        <div className="relative mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-30 -z-10"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 tracking-tight">
            Explore San Francisco
          </h1>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto mb-16 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl group-hover:from-cyan-500/40 group-hover:to-purple-500/40 transition-all duration-700"></div>
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-white/20 transition-all duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-cyan-100 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Discover the Future</h3>
                <p className="text-white/70">
                  Explore futuristic entertainment spots in the city
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2">
                  <span>Explore</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium backdrop-blur-sm transition-all duration-300">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {dummyRecommendations.map((place) => (
            <div
              key={place.id}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-cyan-500/50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={place.imageUrl}
                  alt={place.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500 z-20">
                  <div className="flex items-center text-yellow-300 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(place.rating) ? 'text-yellow-300' : 'text-gray-500'}`} />
                    ))}
                    <span className="text-white text-sm ml-2">{place.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-medium">
                  Trending
                </div>
              </div>
              <div className="p-6 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h2 className="text-2xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">{place.title}</h2>
                  <p className="text-white/70 mb-5">{place.description}</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-sm text-white/60">
                      <MapPinIcon className="h-4 w-4 mr-1.5 text-cyan-400" />
                      <span className="truncate">{place.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/40">
                        Open until 2:00 AM
                      </span>
                      <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-cyan-300 text-sm transition-colors duration-300 flex items-center gap-2">
                        <span>Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add this at the end of your JSX */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </main>
  );
}
