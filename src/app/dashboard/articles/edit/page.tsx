"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Interface untuk data artikel
interface ArticleFormData {
  id: number;
  title: string;
  content: string;
  category: string;
  excerpt: string;
  coverImage: File | null;
  coverImageUrl?: string;
  status: 'draft' | 'published';
  tags: string[];
  author: string;
  publishDate: string;
}

export default function EditArticle() {
  // const searchParams = useSearchParams();
  const articleId =  '1'; // Default to '1' if no ID provided
  
  // State untuk form artikel
  const [formData, setFormData] = useState<ArticleFormData>({
    id: parseInt(articleId),
    title: '',
    content: '',
    category: '',
    excerpt: '',
    coverImage: null,
    coverImageUrl: '',
    status: 'draft',
    tags: [],
    author: '',
    publishDate: '',
  });
  
  // State untuk tag input
  const [tagInput, setTagInput] = useState('');
  
  // State untuk preview image
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  // Ref untuk file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State untuk loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Kategori artikel
  const categories = ['Music Venues', 'Bars & Drinks', 'Events', 'Nightlife', 'Artists', 'Festivals'];
  
  // Dummy article data (simulasi fetch dari API)
  const dummyArticles = [
    {
      id: 1,
      title: "The Best Jazz Bars in San Francisco",
      content: "San Francisco has a rich jazz heritage and offers some of the best jazz venues in the country. From historic clubs that have hosted legendary performers to modern lounges with innovative talent, the city's jazz scene is vibrant and diverse.\n\nIf you're looking for authentic jazz experiences in San Francisco, make sure to check out these venues:\n\n1. **Bar Part Time**: Located on 14th Street, this trendy spot offers a mix of classic jazz and modern interpretations. The intimate setting creates a perfect atmosphere for enjoying the nuanced performances.\n\n2. **Key Klub**: This stylish cocktail bar frequently features live jazz performances in an upscale yet approachable environment. The acoustics are excellent, making it a favorite among serious jazz aficionados.\n\n3. **Black Cat**: A Tenderloin gem that hosts some of the best local and touring jazz artists. The supper club atmosphere harkens back to jazz's golden era.\n\n4. **Mr. Tipple's Recording Studio**: Combines craft cocktails with nightly jazz performances. The sound quality is exceptional, and there's never a cover charge.\n\n5. **SFJAZZ Center**: While not a bar, this modern venue is the West Coast's premier jazz institution, offering world-class performances throughout the year.",
      excerpt: "Explore the vibrant jazz scene in San Francisco with our guide to the city's best jazz bars and lounges.",
      author: "John Doe",
      publishDate: "2025-04-12",
      category: "Music Venues",
      status: "published",
      coverImageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["jazz", "live music", "san francisco", "nightlife", "cocktail bars"],
    },
    {
      id: 2,
      title: "Underground Electronic Music Spots",
      content: "The underground electronic music scene in San Francisco is thriving, with venues that range from warehouse spaces to intimate clubs. These spaces are where you'll find the most cutting-edge sounds and vibrant communities of music enthusiasts.\n\nSome of the best underground electronic music venues include:\n\n1. **The Midway**: This massive creative complex hosts some of the biggest names in techno and house music, with state-of-the-art sound systems and immersive light installations.\n\n2. **Public Works**: Located in the Mission District, this venue consistently books forward-thinking electronic music artists across multiple rooms.\n\n3. **F8**: A small but mighty club that focuses on bass music and experimental sounds, with a loyal local following.\n\n4. **Great Northern**: Features stunning design elements and a powerful sound system, hosting everything from deep house to progressive trance events.\n\n5. **Audio**: A sleek, high-end club with a custom Funktion-One sound system that attracts world-class DJs and producers.",
      excerpt: "Discover the hidden underground electronic music venues that are redefining the nightlife scene.",
      author: "Jane Smith",
      publishDate: "2025-04-10",
      category: "Music Venues",
      status: "draft",
      coverImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["electronic", "techno", "house music", "nightclub", "DJ"],
    },
  ];
  
  // Fetch article data (simulasi API call)
  useEffect(() => {
    setIsLoading(true);
    
    // Simulasi fetch dari API berdasarkan articleId
    setTimeout(() => {
      const article = dummyArticles.find(a => a.id === parseInt(articleId));
      
      if (article) {
        setFormData({
          ...article,
          coverImage: null, // Tidak ada file lokal, hanya URL
          status: article.status as 'draft' | 'published', // Ensure status has the correct type
        });
        
        // Set image preview dari URL
        setCoverImagePreview(article.coverImageUrl || null);
      }
      
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, [articleId]);
  
  // Handle perubahan input text
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        coverImage: file,
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle click pada tombol upload
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle tambah tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };
  
  // Handle remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };
  
  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi proses pengiriman data
    try {
      // Di sini nanti akan ada kode untuk mengirim data ke API
      console.log('Updating article data:', formData);
      
      // Simulasi delay untuk demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Article updated successfully!');
      // Redirect ke dashboard artikel setelah sukses
      window.location.href = '/dashboard/articles';
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to update article');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-white text-lg">Loading article data...</p>
        </div>
      </main>
    );
  }
  
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
              Edit Article
            </h1>
          </div>
          
          <div>
            <button
              type="button"
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Update Article'
              )}
            </button>
          </div>
        </div>
        
        {/* Form section with glassmorphism effect */}
        <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <form id="article-form" onSubmit={handleSubmit} className="relative space-y-6">
            {/* Article metadata display */}
            <div className="p-3 bg-black/30 rounded-lg mb-4 text-sm text-gray-300 flex flex-wrap gap-3">
              <div>
                <span className="text-red-300">ID:</span> {formData.id}
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-red-300">Author:</span> {formData.author}
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-red-300">Published:</span> {formData.publishDate}
              </div>
            </div>
            
            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-red-300 mb-1">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter a captivating title"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
              />
            </div>
            
            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category select */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-red-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white"
                >
                  <option value="" disabled className="bg-gray-900">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
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
                  <option value="draft" className="bg-gray-900">Save as Draft</option>
                  <option value="published" className="bg-gray-900">Publish Immediately</option>
                </select>
              </div>
            </div>
            
            {/* Excerpt textarea */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-red-300 mb-1">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                placeholder="Write a brief summary of your article"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 resize-none"
              />
            </div>
            
            {/* Content textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-red-300 mb-1">
                Article Content <span className="text-red-500">*</span>
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
                  placeholder="Write your article content here..."
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 resize-none"
                />
              </div>
            </div>
            
            {/* Cover Image upload */}
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                Cover Image
              </label>
              <div 
                onClick={handleUploadClick}
                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all hover:bg-white/5 flex flex-col items-center justify-center ${coverImagePreview ? 'border-green-400/50' : 'border-red-500/30'}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {coverImagePreview ? (
                  <div className="space-y-3 w-full">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="h-40 object-cover w-full rounded-lg" 
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Image uploaded
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImagePreview(null);
                          setFormData({...formData, coverImage: null, coverImageUrl: undefined});
                        }}
                        className="text-xs px-2 py-1 bg-red-900/20 text-red-400 rounded hover:bg-red-900/40 transition-colors"
                      >
                        Change image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-red-500/50" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <span className="relative rounded-md bg-black/30 px-3 py-1.5 font-semibold text-white hover:bg-black/50 focus:outline-none">
                        Upload image
                      </span>
                      <p className="pl-1 pt-1.5">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tags input */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-red-300 mb-1">
                Tags
              </label>
              <div className="w-full px-4 py-2 bg-black/20 border border-red-500/30 rounded-lg focus-within:ring-red-500 focus-within:border-red-500 flex flex-wrap items-center">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center m-1 px-2 py-1 rounded-full text-xs font-medium bg-red-900/40 text-red-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 h-4 w-4 rounded-full inline-flex justify-center items-center hover:bg-red-800/40"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-grow min-w-[120px] py-1 bg-transparent text-white outline-none placeholder-gray-400"
                  placeholder={formData.tags.length === 0 ? "Add tags (press Enter)" : ""}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Press Enter to add a tag</p>
            </div>
            
            <div className="pt-5 border-t border-white/10 flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this article?")) {
                    alert("Article would be deleted (not implemented in this demo)");
                    window.location.href = '/dashboard/articles';
                  }
                }}
              >
                Delete Article
              </button>
              
              <div className="flex space-x-3">
                <Link
                  href="/dashboard/articles"
                  className="px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/50 transition-colors"
                >
                  Cancel
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
                      Saving...
                    </div>
                  ) : (
                    'Update Article'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}