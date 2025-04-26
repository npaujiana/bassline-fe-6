"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchArticleById, updateArticle } from "../../../../utils/api";
import type { Article, UpdateArticleData } from "../../../../utils/api";
import AdminLayout from "../../../../components/AdminLayout";
import Loading from "../../../../components/Loading";

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
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
          <Loading text="Memuat artikel..." />
        </div>
      </AdminLayout>
    );
  }
  
  // State for article form
  const [formData, setFormData] = useState<UpdateArticleData>({
    id: parseInt(id),
    title: '',
    content: '',
    status: 'draft',
    excerpt: '',
    category: '',
    tags: [],
  });
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load article data
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArticleById(id);
        
        if (!data) {
          setError("Artikel tidak ditemukan");
          return;
        }
        
        // Initialize form with article data
        setFormData({
          id: data.id,
          title: data.title || '',
          content: data.content || '',
          status: data.status || 'draft',
          excerpt: data.excerpt || '',
          category: data.category || '',
          tags: data.tags || [],
        });
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [id]);
  
  // Handle input text changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle tags input changes
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({
      ...formData,
      tags: tagsArray,
    });
  };
  
  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateArticle(formData);
      
      alert('Artikel berhasil diperbarui!');
      // Redirect to article detail after success
      router.push(`/dashboard/articles/${id}`);
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Gagal memperbarui artikel. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show error message if there's an error
  const ErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="mb-6 p-4 border border-red-500/30 rounded-lg bg-red-900/20 text-red-400">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loading text="Memuat artikel..." />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with back button and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Artikel
            </h1>
          </div>
          
          <div>
            <button
              type="submit"
              form="article-form"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </div>
        
        {/* Display error message if there is one */}
        <ErrorMessage />
        
        {/* Form section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Masukkan judul artikel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>
            
            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Ringkasan
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt || ''}
                onChange={handleInputChange}
                placeholder="Ringkasan singkat artikel (opsional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                placeholder="Kategori artikel (opsional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                placeholder="Tags artikel (pisahkan dengan koma)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
              <p className="mt-1 text-sm text-gray-500">Pisahkan tag dengan koma (contoh: musik, konser, artis)</p>
            </div>
            
            {/* Status select */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Publikasikan</option>
              </select>
            </div>
            
            {/* Content textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Tulis konten artikel di sini..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900 resize-none"
                />
              </div>
            </div>
            
            <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
              <Link
                href={`/dashboard/articles/${id}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}