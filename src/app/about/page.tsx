"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Tentang Aplikasi Pencari Lokasi</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Apa itu LocationFinder?</h2>
          <p className="text-gray-700 mb-4">
            LocationFinder adalah aplikasi web yang memungkinkan pengguna mencari lokasi dan melihatnya di peta. 
            Aplikasi ini menggunakan Google Maps API untuk memberikan pengalaman pencarian lokasi yang akurat dan interaktif.
          </p>
          <p className="text-gray-700">
            Dengan LocationFinder, Anda dapat dengan mudah mencari alamat, tempat wisata, restoran, dan lokasi lainnya 
            di seluruh dunia. Cukup ketik nama lokasi di kotak pencarian, dan aplikasi akan menampilkan hasilnya di peta.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fitur Utama</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Pencarian lokasi dengan auto-complete</li>
            <li>Tampilan peta interaktif menggunakan Google Maps</li>
            <li>Penanda lokasi yang jelas</li>
            <li>Antarmuka yang responsif dan mudah digunakan</li>
            <li>Hasil pencarian yang akurat dan relevan</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Cara Menggunakan</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Masukkan nama lokasi yang ingin Anda cari di kotak pencarian</li>
            <li>Pilih lokasi dari daftar hasil yang muncul</li>
            <li>Peta akan otomatis menampilkan lokasi yang Anda pilih dengan penanda</li>
            <li>Anda dapat memperbesar atau memperkecil peta untuk melihat detail lebih lanjut</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
