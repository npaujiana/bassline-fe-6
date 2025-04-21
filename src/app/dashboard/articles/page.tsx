"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AdminLayout from "../../components/AdminLayout";
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchArticles, deleteArticle } from '../../utils/api';
import type { Article } from '../../utils/api';

export default function ArticlesDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch articles from API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArticles();
        setArticles(data);
        setTotalArticles(data.length);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);

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
                <h1 className="text-3xl font-bold">Articles Management</h1>
                <p className="mt-2 opacity-80">Manage your content articles</p>
              </div>
              <Link 
                href="/dashboard/articles/create" 
                className="flex items-center px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-white/30 transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>New Article</span>
              </Link>
            </div>
            
            {!isLoading && (
              <div className="mt-4 px-4 py-2 bg-white/10 rounded-lg inline-block">
                <span className="text-sm font-medium">Total Articles: <span className="text-white font-bold">{totalArticles}</span></span>
              </div>
            )}
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
              <h2 className="text-2xl font-bold text-gray-800">Error Loading Articles</h2>
              <p className="text-gray-500 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-t-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-6xl text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">No Articles Found</h2>
                <p className="text-gray-500 mt-2">Get started by creating your first article</p>
                <Link 
                  href="/dashboard/articles/create" 
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Create Article</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Articles Dashboard</h2>
              <p className="text-gray-500 mt-2">Manage your content articles ({totalArticles} articles available)</p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link 
                  href="/dashboard/articles/create" 
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Create New Article</span>
                </Link>
                <Link 
                  href="/dashboard/articles/manage" 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* To maintain previous functionality but temporarily hidden */}
        {/* You can use a flag to switch between simple and advanced views later */}
        <div className="hidden">
          {/* Previous implementation code would go here */}
        </div>
      </div>
    </AdminLayout>
  );
}