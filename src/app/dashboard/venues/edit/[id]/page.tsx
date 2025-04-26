"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { useRouter } from "next/navigation";
import { fetchVenueById, updateVenue, fetchTags, fetchAmenities, fetchGenres } from "../../../../utils/api";
import type { Venue, Tag, Amenity, Genre, VenueHour } from "../../../../utils/api";
import { FiSave, FiX, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function EditVenue({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  // Await the params to extract the id
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  if (!id) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  const [formData, setFormData] = useState<Venue>({
    id: id,
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    latitude: undefined,
    longitude: undefined,
    phone: "",
    website: "",
    email: "",
    capacity: undefined,
    price_range: "",
    dress_code: "",
    cover_charge: "",
    parking: "",
    hours: [],
    amenities: [],
    tags: [],
    genres: []
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  // Fetch venue data and dropdown options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [venueData, tagsData, amenitiesData, genresData] = await Promise.all([
          fetchVenueById(id),
          fetchTags(),
          fetchAmenities(),
          fetchGenres()
        ]);
        
        // Set form data
        setFormData(venueData);
        
        // Set dropdown options
        setTags(tagsData || []);
        setAmenities(amenitiesData || []);
        setGenres(genresData || []);
        
        // Set selected items based on venue data
        if (venueData.tags) {
          setSelectedTags(venueData.tags.map(tag => tag.id));
        }
        
        if (venueData.amenities) {
          setSelectedAmenities(venueData.amenities.map(amenity => amenity.id));
        }
        
        if (venueData.genres) {
          setSelectedGenres(venueData.genres.map(genre => genre.id));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error loading venue data:", err);
        setError("Gagal memuat data venue. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Fix type mismatch in handleTagChange
  const handleTagChange = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelectedTags);

    const selectedTagObjects = tags.filter(tag => newSelectedTags.includes(tag.id));
    setFormData({
      ...formData,
      tags: selectedTagObjects,
    });
  };

  // Fix type mismatch in handleInputChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | undefined = value;

    if (type === 'number') {
      parsedValue = value ? parseFloat(value) : undefined;
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  // Fix type mismatch in handleAmenityChange
  const handleAmenityChange = (amenityId: number) => {
    const newSelectedAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setSelectedAmenities(newSelectedAmenities);

    const selectedAmenityObjects = amenities.filter(amenity => newSelectedAmenities.includes(amenity.id));
    setFormData({
      ...formData,
      amenities: selectedAmenityObjects,
    });
  };

  // Fix type mismatch in handleGenreChange
  const handleGenreChange = (genreId: number) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(newSelectedGenres);

    const selectedGenreObjects = genres.filter(genre => newSelectedGenres.includes(genre.id));
    setFormData({
      ...formData,
      genres: selectedGenreObjects,
    });
  };

  // Add an empty hour entry
  const addHour = () => {
    const newHours = [...(formData.hours || []), { 
      day_of_week: 1, 
      open_time: "09:00", 
      close_time: "17:00" 
    }];
    
    setFormData({
      ...formData,
      hours: newHours
    });
  };
  
  // Remove an hour entry
  const removeHour = (index: number) => {
    const newHours = [...(formData.hours || [])];
    newHours.splice(index, 1);
    
    setFormData({
      ...formData,
      hours: newHours
    });
  };
  
  // Fix type mismatch in updateHour
  const updateHour = (index: number, field: keyof VenueHour, value: any) => {
    const newHours = [...(formData.hours || [])];
    newHours[index] = {
      ...newHours[index],
      [field]: field === 'day_of_week' ? parseInt(value, 10) : value,
    } as VenueHour;

    setFormData({
      ...formData,
      hours: newHours,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      await updateVenue(id, formData);
      router.push(`/dashboard/venues/${id}`);
    } catch (err) {
      console.error("Error updating venue:", err);
      setError("Gagal menyimpan perubahan. Silakan coba lagi.");
      setSaving(false);
    }
  };
  
  // Days of week for the hours selector
  const daysOfWeek = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
    { value: 6, label: "Sabtu" },
    { value: 7, label: "Minggu" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link
            href={`/dashboard/venues/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" /> Kembali ke detail venue
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Edit Venue: {formData.name}</h1>
            <p className="mt-2 opacity-80">Perbarui informasi venue</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Venue <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.capacity === undefined ? '' : formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Location Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Lokasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.zip_code || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    step="any"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.latitude === undefined ? '' : formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    step="any"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.longitude === undefined ? '' : formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kontak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Tambahan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price_range" className="block text-sm font-medium text-gray-700 mb-1">
                    Kisaran Harga
                  </label>
                  <input
                    type="text"
                    id="price_range"
                    name="price_range"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.price_range || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="dress_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pakaian
                  </label>
                  <input
                    type="text"
                    id="dress_code"
                    name="dress_code"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.dress_code || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="cover_charge" className="block text-sm font-medium text-gray-700 mb-1">
                    Biaya Masuk
                  </label>
                  <input
                    type="text"
                    id="cover_charge"
                    name="cover_charge"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.cover_charge || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                    Parkir
                  </label>
                  <input
                    type="text"
                    id="parking"
                    name="parking"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.parking || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Hours Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Jam Operasional</h2>
                <button
                  type="button"
                  onClick={addHour}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-all text-sm font-medium"
                >
                  + Tambah Jam
                </button>
              </div>
              
              {formData.hours && formData.hours.length > 0 ? (
                <div className="space-y-4">
                  {formData.hours.map((hour, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hari
                        </label>
                        <select
                          value={hour.day_of_week}
                          onChange={(e) => updateHour(index, 'day_of_week', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Buka
                        </label>
                        <input
                          type="time"
                          value={hour.open_time}
                          onChange={(e) => updateHour(index, 'open_time', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tutup
                        </label>
                        <input
                          type="time"
                          value={hour.close_time}
                          onChange={(e) => updateHour(index, 'close_time', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div className="w-full sm:w-auto flex items-end">
                        <button
                          type="button"
                          onClick={() => removeHour(index)}
                          className="p-2 text-red-500 hover:text-red-700 mt-5"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Belum ada jam operasional. Klik tombol di atas untuk menambahkan.</p>
                </div>
              )}
            </div>
            
            {/* Tags, Amenities, and Genres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tags Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {tags.length > 0 ? (
                    tags.map(tag => (
                      <div key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagChange(tag.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
                        />
                        <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700">
                          {tag.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Memuat tags...</p>
                  )}
                </div>
              </div>
              
              {/* Amenities Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {amenities.length > 0 ? (
                    amenities.map(amenity => (
                      <div key={amenity.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => handleAmenityChange(amenity.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
                        />
                        <label htmlFor={`amenity-${amenity.id}`} className="ml-2 text-sm text-gray-700">
                          {amenity.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Memuat amenities...</p>
                  )}
                </div>
              </div>
              
              {/* Genres Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Genres</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {genres.length > 0 ? (
                    genres.map(genre => (
                      <div key={genre.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`genre-${genre.id}`}
                          checked={selectedGenres.includes(genre.id)}
                          onChange={() => handleGenreChange(genre.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
                        />
                        <label htmlFor={`genre-${genre.id}`} className="ml-2 text-sm text-gray-700">
                          {genre.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Memuat genres...</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href={`/dashboard/venues/${id}`}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              >
                {saving ? (
                  <div className="mr-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <FiSave className="mr-2" />
                )}
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}