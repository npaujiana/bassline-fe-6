"use client";

import React, { useState } from 'react';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createArticle } from '../../../utils/api';

// Interface for article form data
interface ArticleFormData {
  title: string;
  content: string;
  status: 'draft' | 'published';
}

export default function CreateArticle() {
  const router = useRouter();
  
  // State for article form
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    status: 'draft',
  });
  
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle input text changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createArticle({
        title: formData.title,
        content: formData.content,
        status: formData.status,
      });
      
      alert('Artikel berhasil dibuat!');
      // Redirect to dashboard articles after success
      router.push('/dashboard/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      setError('Gagal membuat artikel. Silakan coba lagi.');
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
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/dashboard/articles"
              className="mr-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-red-400">
              Buat Artikel Baru
            </h1>
          </div>
          
          <div>
            <button
              type="submit"
              form="article-form"
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                'Simpan Artikel'
              )}
            </button>
          </div>
        </div>
        
        {/* Display error message if there is one */}
        <ErrorMessage />
        
        {/* Form section with glassmorphism effect */}
        <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <form id="article-form" onSubmit={handleSubmit} className="relative space-y-6">
            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-red-300 mb-1">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Masukkan judul yang menarik"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
              />
            </div>
            
            {/* Status select */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-red-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white"
              >
                <option value="draft" className="bg-gray-900">Simpan sebagai Draft</option>
                <option value="published" className="bg-gray-900">Terbitkan Sekarang</option>
              </select>
            </div>
            
            {/* Content textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-red-300 mb-1">
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <textarea
                  id="content"
                  name="content"
                  rows={15}
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Tulis konten artikel disini..."
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 resize-none"
                />
              </div>
            </div>
            
            <div className="pt-5 border-t border-white/10 flex justify-end space-x-3">
              <Link
                href="/dashboard/articles"
                className="px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/50 transition-colors"
              >
                Batal
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menerbitkan...
                  </div>
                ) : (
                  'Terbitkan Artikel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}