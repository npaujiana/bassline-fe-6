"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface MapViewProps {
  searchQuery: string;
}

// Simulasi data lokasi
const simulateLocationSearch = async (query: string) => {
  // Simulasi pencarian berdasarkan lokasi yang telah ditentukan
  const locations = {
    "victory": {
      name: "Victory Sweet Shop/Victory Garden Cafe",
      address: "Jl. Medan Merdeka Barat No.12, Jakarta Pusat",
      lat: 40.77324849915862,
      lng: -73.90543400239613,
      photos: [
        "https://lh3.googleusercontent.com/p/AF1QipMyNlFi3AKFo3QVSx9A8f46RTGuKyyUn8hml42A=w262-h104-p-k-no",
        "https://img.okezone.com/content/2023/06/13/25/2833125/5-fakta-menarik-monas-monumen-nasional-yang-jadi-kebanggaan-indonesia-UdJX8VwRTz.jpg",
        "https://awsimages.detik.net.id/community/media/visual/2023/01/01/monas-dibuka-untuk-umum-pada-malam-tahun-baru-2023-3.jpeg?w=1200"
      ]
    },
    "pantai kuta bali": {
      name: "Pantai Kuta",
      address: "Kuta, Kabupaten Badung, Bali",
      lat: -8.7180,
      lng: 115.1686,
      photos: [
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/f0/a3/d0/kuta-beach-bali.jpg?w=1200&h=-1&s=1",
        "https://a.cdn-hotels.com/gdcs/production8/d1098/064a4e00-23ee-4137-8ec3-a0d27bca0782.jpg?impolicy=fcrop&w=800&h=533&q=medium",
        "https://www.indonesia.travel/content/dam/indtravelrevamp/en/destinations/revisi-2020/destinations-thumbnail/Bali-Thumbnail.jpg"
      ]
    },
    "malioboro yogyakarta": {
      name: "Jalan Malioboro",
      address: "Jl. Malioboro, Yogyakarta",
      lat: -7.7932,
      lng: 110.3668,
      photos: [
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/53/95/d1/malioboro-street.jpg?w=1200&h=-1&s=1",
        "https://img.okezone.com/content/2021/07/24/408/2445444/sejarah-malioboro-jalan-ikonik-di-yogyakarta-yang-jadi-destinasi-wisata-favorit-Gm3k2ZUFw3.jpg",
        "https://asset.kompas.com/crops/MbCgangOz_iS9-L4_irH5CxFXiQ=/0x0:1000x667/750x500/data/photo/2021/09/11/613c7ff077b45.jpg"
      ]
    },
    "borobudur": {
      name: "Candi Borobudur",
      address: "Jl. Badrawati, Borobudur, Magelang, Jawa Tengah",
      lat: -7.6079,
      lng: 110.2038,
      photos: [
        "https://asset.kompas.com/crops/33vwqzWlnARC0RcnrSw3tuYGYwU=/0x0:1800x1200/750x500/data/photo/2022/06/06/629dc24a2ba13.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/df/98/c2/borobudur-temple.jpg?w=1200&h=-1&s=1",
        "https://img.okezone.com/content/2023/02/27/408/2767280/candi-borobudur-masuk-daftar-7-keajaiban-dunia-benarkah-EFzSRvRJLO.jpg"
      ]
    }
  };

  // Mencari kecocokan parsial pada kunci
  const lowerQuery = query.toLowerCase();
  const matchedKey = Object.keys(locations).find(key => 
    lowerQuery.includes(key) || key.includes(lowerQuery)
  );

  // Jika menemukan kecocokan, kembalikan data tersebut
  if (matchedKey) {
    return locations[matchedKey as keyof typeof locations];
  }
  
  // Jika tidak ada kecocokan, kembalikan data generik
  return {
    name: query,
    address: "Lokasi tidak ditemukan secara spesifik",
    lat: -6.2088, // Default ke Jakarta
    lng: 106.8456,
    photos: [
      "https://asset.kompas.com/crops/thwHBGGZ_mg9_mHDQnYiAiRFbOk=/71x0:1071x667/750x500/data/photo/2021/10/31/617e5dc184a9f.jpg"
    ]
  };
};

export default function MapView({ searchQuery }: MapViewProps) {
  // State untuk menyimpan informasi tempat
  const [placeInfo, setPlaceInfo] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
    photos: string[];
    description?: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Mencari tempat ketika komponen dimuat atau ketika query pencarian berubah
  useEffect(() => {
    if (!searchQuery) return;

    setIsLoading(true);
    
    // Simulasi pemanggilan API
    const fetchData = async () => {
      try {
        // Simulasi penundaan untuk membuat tampak seperti panggilan API yang sebenarnya
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const result = await simulateLocationSearch(searchQuery);
        setPlaceInfo(result);
      } catch (error) {
        console.error("Error saat mencari lokasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    void fetchData();
  }, [searchQuery]);

  // Auto-rotate photos
  useEffect(() => {
    if (!placeInfo || placeInfo.photos.length <= 1) return;
    
    const interval = setInterval(() => {
      setActivePhotoIndex(prev => (prev + 1) % placeInfo.photos.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [placeInfo]);

  // Jika sedang memuat, tampilkan indikator loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-red-100 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-base sm:text-xl text-red-600">Memuat informasi lokasi...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada informasi tempat, tampilkan pesan
  if (!placeInfo) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <p className="text-base sm:text-xl text-red-600">Tidak dapat menemukan informasi untuk lokasi ini.</p>
      </div>
    );
  }

  // URL untuk peta statis menggunakan OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${placeInfo.lng - 0.01}%2C${placeInfo.lat - 0.01}%2C${placeInfo.lng + 0.01}%2C${placeInfo.lat + 0.01}&amp;layer=mapnik&amp;marker=${placeInfo.lat}%2C${placeInfo.lng}`;

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Map section - mengambil 60% tinggi layar, lebar penuh */}
      <div className="relative w-full h-[60%] flex-none">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          aria-hidden="false"
          tabIndex={0}
          className="absolute inset-0 w-full"
        ></iframe>
        
        {/* Location pin marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="h-8 w-8 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Details section - mengambil sisa 40% layar dengan bottom sheet style */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 z-10 shadow-lg overflow-y-auto">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
        
        <div className="px-5 pb-8 overflow-y-auto">
          {/* Location info header */}
          <h1 className="text-xl font-bold text-gray-900 mt-2">{placeInfo.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{placeInfo.address}</p>
          
          {/* Coordinates badge */}
          <div className="mt-3 inline-flex items-center bg-red-50 px-3 py-1 rounded-full text-xs text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{placeInfo.lat.toFixed(4)}, {placeInfo.lng.toFixed(4)}</span>
          </div>
          
          {/* Photos carousel */}
          <div className="mt-4 relative rounded-xl overflow-hidden h-36 sm:h-48">
            <div className="relative w-full h-full group">
              {placeInfo.photos.map((photo, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === activePhotoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <Image
                    src={photo}
                    alt={`${placeInfo.name} - Foto ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized // Menggunakan unoptimized karena gambar berasal dari domain eksternal
                  />
                </div>
              ))}
            </div>
            
            {/* Photo indicator dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {placeInfo.photos.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setActivePhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activePhotoIndex ? 'bg-white scale-125' : 'bg-white/60'}`}
                  aria-label={`Lihat foto ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Description */}
          {placeInfo.description && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Tentang Tempat Ini</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{placeInfo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
