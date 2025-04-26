"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { 
  fetchAmenities, 
  createAmenity, 
  updateAmenity, 
  deleteAmenity
} from "../../utils/api";
import type { Amenity } from "../../utils/api";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { FaPen, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

// Interface untuk menyesuaikan dengan format respons API
interface AmenityResponse {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export default function AmenitiesDashboard() {
  const [amenities, setAmenities] = useState<AmenityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
    per_page: 10
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityResponse | null>(null);
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    description: string;
    icon?: string;
  }>({
    name: "",
    description: "",
    icon: ""
  });

  useEffect(() => {
    loadAmenities();
  }, [pagination.current_page, pagination.per_page]);

  const loadAmenities = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAmenities(pagination.current_page, pagination.per_page);
      
      // Menyesuaikan dengan format respons yang diterima
      if (response && response.amenities) {
        setAmenities(response.amenities);
        
        if (response.pagination) {
          setPagination({
            total: response.pagination.total_items || 0,
            pages: response.pagination.total_pages || 0,
            current_page: response.pagination.page || 1,
            per_page: response.pagination.per_page || 10
          });
        }
      } else {
        // Fallback untuk format respons tak terduga
        setAmenities([]);
      }
      
      setError(null);
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
      setError("Gagal memuat fasilitas. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (page: number) => {
    setPagination({
      ...pagination,
      current_page: page
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateModal = () => {
    setSelectedAmenity(null);
    setFormData({
      name: "",
      description: "",
      icon: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (amenity: AmenityResponse) => {
    setSelectedAmenity(amenity);
    setFormData({
      id: amenity.id,
      name: amenity.name,
      description: amenity.description || "",
      icon: amenity.icon || ""
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (amenity: AmenityResponse) => {
    setSelectedAmenity(amenity);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedAmenity) {
        // Update existing amenity
        await updateAmenity(selectedAmenity.id, formData);
      } else {
        // Create new amenity
        await createAmenity(formData);
      }
      
      // Refresh the amenities list
      await loadAmenities();
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving amenity:", error);
      setError("Gagal menyimpan fasilitas. Silakan coba lagi.");
    }
  };

  const handleDelete = async () => {
    if (!selectedAmenity) return;
    
    try {
      await deleteAmenity(selectedAmenity.id);
      
      // Refresh the amenities list
      await loadAmenities();
      
      // Close the modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting amenity:", error);
      setError("Gagal menghapus fasilitas. Silakan coba lagi.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 -mb-10 -ml-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Manajemen Fasilitas</h1>
                <p className="mt-2 opacity-80">Kelola informasi fasilitas venue</p>
              </div>
              
              {!isLoading && !error && (
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <span className="text-sm font-medium">Total Fasilitas: <span className="text-white font-bold">{pagination.total}</span></span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-6">
          {error ? (
            <div className="text-center p-8">
              <div className="text-6xl text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Error Memuat Fasilitas</h2>
              <p className="text-gray-500 mt-2">{error}</p>
              <button 
                onClick={() => loadAmenities()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-t-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-4">Memuat fasilitas...</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Fasilitas</h2>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Tambah Fasilitas
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700">Nama</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700">Deskripsi</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700">Terakhir Diperbarui</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {amenities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Tidak ada fasilitas yang tersedia
                        </td>
                      </tr>
                    ) : (
                      amenities.map((amenity) => (
                        <tr key={amenity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{amenity.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{amenity.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{amenity.description || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(amenity.updated_at).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openEditModal(amenity)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <FaPen />
                              </button>
                              <button 
                                onClick={() => openDeleteModal(amenity)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center space-x-1 mt-6">
                  <button
                    onClick={() => handleChangePage(Math.max(1, pagination.current_page - 1))}
                    disabled={pagination.current_page === 1}
                    className={`px-3 py-1 rounded ${
                      pagination.current_page === 1
                        ? 'text-gray-400 bg-gray-100'
                        : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    &laquo;
                  </button>
                  
                  {[...Array(pagination.pages)].map((_, index) => {
                    const page = index + 1;
                    // Only show a subset of pages if there are many
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handleChangePage(page)}
                          className={`px-3 py-1 rounded ${
                            pagination.current_page === page
                              ? 'bg-red-500 text-white'
                              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === 2 && pagination.current_page > 3) ||
                      (page === pagination.pages - 1 && pagination.current_page < pagination.pages - 2)
                    ) {
                      return <span key={page} className="px-1 py-1">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handleChangePage(Math.min(pagination.pages, pagination.current_page + 1))}
                    disabled={pagination.current_page === pagination.pages}
                    className={`px-3 py-1 rounded ${
                      pagination.current_page === pagination.pages
                        ? 'text-gray-400 bg-gray-100'
                        : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Create/Edit Modal - dengan backdrop blur */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedAmenity ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Ikon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Masukkan nama ikon (contoh: fa-wifi)"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal - dengan backdrop blur */}
      {isDeleteModalOpen && selectedAmenity && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">
              Apakah Anda yakin ingin menghapus fasilitas "{selectedAmenity.name}"? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}