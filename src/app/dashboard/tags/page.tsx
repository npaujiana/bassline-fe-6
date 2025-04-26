"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { fetchTags, createTag, updateTag, deleteTag, deleteTagsBatch, createTagsBatch } from "../../utils/api";

interface Tag {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function TagsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] = useState(false);
  const [isBatchAddModalOpen, setIsBatchAddModalOpen] = useState(false);
  
  // Form values
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [currentTagId, setCurrentTagId] = useState<string | null>(null);
  
  // Batch operations
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [batchTagsInput, setBatchTagsInput] = useState("");
  
  // Load tags
  useEffect(() => {
    loadTags();
  }, []);
  
  // Filter tags based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(tags);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      setFilteredTags(
        tags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(lowercaseQuery) ||
            (tag.description != null && tag.description.toLowerCase().includes(lowercaseQuery))
        )
      );
    }
  }, [searchQuery, tags]);
  
  // Load tags from API
  const loadTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTags();
      
      // Log untuk debugging
      console.log("Tag API Response:", response);
      
      // Mengakses data tag dari response.data.tags
      if (response && typeof response === 'object' && response.data && response.data.tags) {
        const tagsData = response.data.tags;
        setTags(tagsData);
        setFilteredTags(tagsData);
        
        // Mengambil total items dari pagination jika ada
        if (response.data.pagination && response.data.pagination.total_items !== undefined) {
          setTotalItems(response.data.pagination.total_items);
        } else {
          setTotalItems(tagsData.length);
        }
      } else {
        // Fallback jika struktur respons tidak sesuai ekspektasi
        console.error("Format respons API tidak didukung:", response);
        setTags([]);
        setFilteredTags([]);
        setTotalItems(0);
      }
      
      setError(null);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setError("Gagal memuat tag. Silakan coba lagi nanti.");
      setTags([]);
      setFilteredTags([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle add tag
  const handleAddTag = async () => {
    try {
      if (!formName.trim()) {
        alert("Nama tag wajib diisi");
        return;
      }
      
      await createTag({ name: formName, description: formDescription });
      alert("Tag berhasil ditambahkan");
      
      resetForm();
      setIsAddModalOpen(false);
      loadTags();
    } catch (error) {
      console.error("Failed to add tag:", error);
      alert("Gagal menambahkan tag. Silakan coba lagi nanti.");
    }
  };
  
  // Handle edit tag
  const handleEditTag = async () => {
    try {
      if (!currentTagId || !formName.trim()) {
        alert("Nama tag wajib diisi");
        return;
      }
      
      await updateTag(currentTagId, { name: formName, description: formDescription });
      alert("Tag berhasil diperbarui");
      
      resetForm();
      setIsEditModalOpen(false);
      loadTags();
    } catch (error) {
      console.error("Failed to update tag:", error);
      alert("Gagal memperbarui tag. Silakan coba lagi nanti.");
    }
  };
  
  // Handle delete tag
  const handleDeleteTag = async () => {
    try {
      if (!currentTagId) return;
      
      await deleteTag(currentTagId);
      alert("Tag berhasil dihapus");
      
      resetForm();
      setIsDeleteConfirmOpen(false);
      loadTags();
    } catch (error) {
      console.error("Failed to delete tag:", error);
      alert("Gagal menghapus tag. Silakan coba lagi nanti.");
    }
  };
  
  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      if (selectedTags.length === 0) {
        alert("Pilih minimal satu tag untuk dihapus");
        return;
      }
      
      await deleteTagsBatch(selectedTags);
      alert(`${selectedTags.length} tag berhasil dihapus`);
      
      setSelectedTags([]);
      setIsBatchDeleteConfirmOpen(false);
      loadTags();
    } catch (error) {
      console.error("Failed to batch delete tags:", error);
      alert("Gagal menghapus tag secara batch. Silakan coba lagi nanti.");
    }
  };
  
  // Handle batch add
  const handleBatchAdd = async () => {
    try {
      const lines = batchTagsInput
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const parts = line.split("|");
          return {
            name: parts[0]?.trim() || "",
            description: parts[1] ? parts[1].trim() : "",
          };
        });
      
      if (lines.length === 0 || lines.some(line => !line.name)) {
        alert("Format tidak valid. Pastikan setiap baris memiliki format: Nama|Deskripsi");
        return;
      }
      
      await createTagsBatch(lines);
      alert(`${lines.length} tag berhasil ditambahkan`);
      
      setBatchTagsInput("");
      setIsBatchAddModalOpen(false);
      loadTags();
    } catch (error) {
      console.error("Failed to batch add tags:", error);
      alert("Gagal menambahkan tag secara batch. Silakan coba lagi nanti.");
    }
  };
  
  // Open edit form with tag data
  const openEditModal = (tag: Tag) => {
    setCurrentTagId(tag.id);
    setFormName(tag.name);
    setFormDescription(tag.description ?? "");
    setIsEditModalOpen(true);
  };
  
  // Open delete confirmation
  const openDeleteConfirm = (tagId: string) => {
    setCurrentTagId(tagId);
    setIsDeleteConfirmOpen(true);
  };
  
  // Toggle tag selection
  const toggleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  // Toggle all tags selection
  const toggleAllTags = () => {
    if (!Array.isArray(filteredTags)) {
      console.error("filteredTags bukan array:", filteredTags);
      return;
    }
    
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags.map((tag) => tag.id));
    }
  };
  
  // Reset form values
  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setCurrentTagId(null);
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
          <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">{title}</h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-500" 
                onClick={onClose}
              >
                <span className="sr-only">Tutup</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
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
                <h1 className="text-3xl font-bold">Manajemen Tag</h1>
                <p className="mt-2 opacity-80">Kelola tag untuk venue dan artikel</p>
              </div>
              
              {!isLoading && !error && (
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <span className="text-sm font-medium">Total Tag: <span className="text-white font-bold">{totalItems}</span></span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {error ? (
            <div className="text-center p-8">
              <div className="text-6xl text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Error Memuat Tag</h2>
              <p className="text-gray-500 mt-2">{error}</p>
              <button 
                onClick={() => loadTags()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-t-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-4">Memuat tag...</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Action Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-1/3">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari tag..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsAddModalOpen(true)} 
                    className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Tag
                  </button>
                  <button 
                    onClick={() => setIsBatchAddModalOpen(true)} 
                    className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import Batch
                  </button>
                  {selectedTags.length > 0 && (
                    <button 
                      onClick={() => setIsBatchDeleteConfirmOpen(true)} 
                      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus Terpilih ({selectedTags.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Tags Table */}
              {!Array.isArray(filteredTags) || filteredTags.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-600">Belum ada tag</h3>
                  <p className="text-gray-500 mt-1">Klik "Tambah Tag" untuk menambahkan tag baru</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="w-12 px-6 py-3 text-left">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            checked={filteredTags.length > 0 && selectedTags.length === filteredTags.length}
                            onChange={toggleAllTags}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                        <th scope="col" className="w-24 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(filteredTags) ? filteredTags.map((tag) => (
                        <tr key={tag.id} className="h-16">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                              checked={selectedTags.includes(tag.id)}
                              onChange={() => toggleTagSelection(tag.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tag.name}</td>
                          <td className="px-6 py-4 max-w-xs truncate text-gray-500">{tag.description ?? "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button 
                                className="text-blue-500 hover:text-blue-700" 
                                onClick={() => openEditModal(tag)}
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                className="text-red-500 hover:text-red-700" 
                                onClick={() => openDeleteConfirm(tag.id)}
                                title="Hapus"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            Error: Tidak dapat menampilkan data tag.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Tag Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => { resetForm(); setIsAddModalOpen(false); }} 
        title="Tambah Tag Baru"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Tag *</label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Masukkan nama tag"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              id="description"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Masukkan deskripsi tag (opsional)"
              rows={3}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => { resetForm(); setIsAddModalOpen(false); }}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none"
            onClick={handleAddTag}
          >
            Simpan
          </button>
        </div>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => { resetForm(); setIsEditModalOpen(false); }} 
        title="Edit Tag"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nama Tag *</label>
            <input
              type="text"
              id="edit-name"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Masukkan nama tag"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              id="edit-description"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Masukkan deskripsi tag (opsional)"
              rows={3}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => { resetForm(); setIsEditModalOpen(false); }}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none"
            onClick={handleEditTag}
          >
            Perbarui
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteConfirmOpen} 
        onClose={() => setIsDeleteConfirmOpen(false)} 
        title="Konfirmasi Hapus"
      >
        <div className="py-4">
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus tag ini? Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none"
            onClick={handleDeleteTag}
          >
            Hapus
          </button>
        </div>
      </Modal>

      {/* Batch Delete Confirmation Modal */}
      <Modal 
        isOpen={isBatchDeleteConfirmOpen} 
        onClose={() => setIsBatchDeleteConfirmOpen(false)} 
        title="Konfirmasi Hapus Batch"
      >
        <div className="py-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus {selectedTags.length} tag yang dipilih? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsBatchDeleteConfirmOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none"
            onClick={handleBatchDelete}
          >
            Hapus {selectedTags.length} Tag
          </button>
        </div>
      </Modal>

      {/* Batch Add Modal */}
      <Modal 
        isOpen={isBatchAddModalOpen} 
        onClose={() => { setBatchTagsInput(""); setIsBatchAddModalOpen(false); }} 
        title="Import Tag Batch"
      >
        <div className="space-y-4 py-4">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-600 mb-2">
              Masukkan satu tag per baris dengan format: <span className="font-mono bg-gray-200 px-1 rounded">Nama|Deskripsi</span>
            </p>
            <p className="text-sm text-gray-600">
              Contoh:
              <pre className="mt-1 p-2 bg-gray-200 rounded text-xs">
                Jazz|Genre musik jazz<br/>
                Rock|Genre musik rock<br/>
                Live Music|Live music performances
              </pre>
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="batch-tags" className="block text-sm font-medium text-gray-700">Tag Batch</label>
            <textarea
              id="batch-tags"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
              value={batchTagsInput}
              onChange={(e) => setBatchTagsInput(e.target.value)}
              placeholder="Masukkan tag batch..."
              rows={8}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => { setBatchTagsInput(""); setIsBatchAddModalOpen(false); }}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none"
            onClick={handleBatchAdd}
          >
            Import
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
}