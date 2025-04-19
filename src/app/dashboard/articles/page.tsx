"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Dummy data artikel untuk contoh
const dummyArticles = [
  {
    id: 1,
    title: "The Best Jazz Bars in San Francisco",
    excerpt: "Explore the vibrant jazz scene in San Francisco with our guide to the city's best jazz bars and lounges.",
    author: "John Doe",
    publishDate: "2025-04-12",
    category: "Music Venues",
    status: "published",
  },
  {
    id: 2,
    title: "Underground Electronic Music Spots",
    excerpt: "Discover the hidden underground electronic music venues that are redefining the nightlife scene.",
    author: "Jane Smith",
    publishDate: "2025-04-10",
    category: "Music Venues",
    status: "draft",
  },
  {
    id: 3,
    title: "Cocktail Bars with Live Music",
    excerpt: "The perfect blend of mixology and melodies - these cocktail bars offer exceptional drinks and live performances.",
    author: "Alex Johnson",
    publishDate: "2025-04-05",
    category: "Bars & Drinks",
    status: "published",
  },
  {
    id: 4,
    title: "Weekend DJ Lineups to Check Out",
    excerpt: "Plan your weekend with our curated list of the hottest DJ performances happening across the city.",
    author: "Sarah Williams",
    publishDate: "2025-04-01",
    category: "Events",
    status: "published",
  },
  {
    id: 5,
    title: "Rooftop Bars with Amazing Views",
    excerpt: "Elevate your night out with these stunning rooftop bars offering panoramic city views and great atmosphere.",
    author: "Michael Brown",
    publishDate: "2025-03-28",
    category: "Bars & Drinks",
    status: "draft",
  },
];

export default function ArticlesDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Filter artikel berdasarkan pencarian, kategori, dan status
  const filteredArticles = dummyArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Array unik dari kategori untuk filter
  const categories = ["all", ...new Set(dummyArticles.map(article => article.category))];
  
  // Handle edit article
  const handleEditArticle = (articleId: number) => {
    router.push(`/dashboard/articles/edit?id=${articleId}`);
  };
  
  // Handle delete article
  const handleDeleteArticle = (articleId: number, articleTitle: string) => {
    if (confirm(`Are you sure you want to delete article: "${articleTitle}"?`)) {
      // In a real application, you would make an API call to delete the article
      alert(`Article ${articleId} would be deleted (not implemented in this demo)`);
      
      // For demo purposes, just refresh the page
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-red-400">
            Article Dashboard
          </h1>
          <Link 
            href="/dashboard/articles/create" 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            <span>New Article</span>
          </Link>
        </div>

        {/* Filter section with glassmorphism effect */}
        <div className="mb-8 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-5 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-red-300" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="block w-full pl-10 pr-3 py-2 bg-black/20 border border-red-500/30 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-red-300/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full bg-black/20 border border-red-500/30 rounded-lg py-2 px-3 text-white focus:ring-red-500 focus:border-red-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full bg-black/20 border border-red-500/30 rounded-lg py-2 px-3 text-white focus:ring-red-500 focus:border-red-500"
              >
                <option value="all" className="bg-gray-900">All Status</option>
                <option value="published" className="bg-gray-900">Published</option>
                <option value="draft" className="bg-gray-900">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles table with glassmorphism effect */}
        <div className="overflow-hidden backdrop-blur-md bg-white/5 rounded-xl border border-white/10 shadow-lg">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
            
            <table className="w-full">
              <thead className="border-b border-white/10 bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-red-300 uppercase tracking-wider">Title</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-red-300 uppercase tracking-wider">Author</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-red-300 uppercase tracking-wider">Category</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-red-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-red-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-red-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <div className="flex flex-col">
                          <span>{article.title}</span>
                          <span className="text-xs text-gray-400 md:hidden mt-1">{article.author} • {article.category}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.author}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.category}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.publishDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="p-1.5 bg-blue-900/20 rounded-lg text-blue-400 hover:bg-blue-900/40 transition-colors"
                            onClick={() => handleEditArticle(article.id)}
                            title="Edit article"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 bg-red-900/20 rounded-lg text-red-400 hover:bg-red-900/40 transition-colors"
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            title="Delete article"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-300">
                      <div className="flex flex-col items-center">
                        <MagnifyingGlassIcon className="h-12 w-12 text-red-500/50 mb-4" />
                        <p className="text-lg font-medium">No articles found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{filteredArticles.length}</span> of <span className="font-medium text-white">{dummyArticles.length}</span> articles
          </p>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-lg bg-black/30 border border-white/10 text-gray-400 hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-900/50">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}