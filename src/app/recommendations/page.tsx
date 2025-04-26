"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { fetchArticles } from '../utils/api';

// Define the Article type to match the actual API response
export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  created_by?: string | null;
  published_at?: string | null;
  updated_at?: string;
  updated_by?: string | null;
  status: string;
  url: string | null;
  deleted_at: string | null;
}

// Fallback image in case article doesn't have a cover image
const fallbackImage = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80";

export default function RecommendationsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles from the API
  useEffect(() => {
    const getArticles = async () => {
      try {
        setIsLoading(true);
        const data: any = await fetchArticles();
        console.log("Fetched articles:", data);
        // Take the first 6 articles regardless of status for display
        setArticles(data?.slice(0, 6));
        setError(null);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError("Failed to load recommended articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    getArticles();
  }, []);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get a preview of the content to use as excerpt
  const getContentPreview = (content: string) => {
    return content.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  return (
    <main className="min-h-screen bg-secondary-500 p-8 md:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-700/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 -right-20 w-96 h-96 bg-primary-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-tertiary-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
      
      <div className="container mx-auto my-15 relative z-10">
        <div className="relative mb-16">
          <h1 className="text-4xl md:text-7xl font-bold text-center text-primary-700 tracking-tight">
            Featured Articles
          </h1>
          <p className="text-center text-primary-600 mt-4 max-w-2xl mx-auto">
            Discover the latest in nightlife, music venues, events, and more from our expert writers
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-700 border-t-transparent"></div>
              <p className="mt-4 text-primary-700 text-lg">Loading articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="text-center bg-secondary-500/10 backdrop-blur-sm p-8 rounded-xl border border-primary-700/20 max-w-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-primary-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-primary-700 text-xl font-semibold mb-2">Error Loading Articles</h3>
              <p className="text-primary-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary-700/20 hover:bg-primary-700/30 border border-primary-700/30 rounded-lg text-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="text-center bg-secondary-500/10 backdrop-blur-sm p-8 rounded-xl border border-primary-700/20 max-w-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-primary-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-primary-700 text-xl font-semibold mb-2">No Articles Available</h3>
              <p className="text-primary-600">There are no published articles at the moment. Check back later!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group bg-secondary-500/5 backdrop-blur-xl rounded-2xl border border-secondary-500/10 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-tertiary-500/50"
              >
                <div className="relative">
                  <img
                    src={article.url || fallbackImage}
                    alt={article.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = fallbackImage;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-500 text-sm font-medium">
                        Article
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        article.status === 'published' 
                          ? 'bg-green-900/50 text-green-400 border border-green-500/30' 
                          : 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-400/10 to-primary-600/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-semibold mb-3 text-primary-700">{article.title}</h2>
                    <p className="text-primary-600 mb-5 line-clamp-3">{getContentPreview(article.content)}</p>
                    
                    <div className="flex flex-col gap-3 mb-4">
                      {/* Author and date info */}
                      <div className="flex items-center text-sm text-primary-600">
                        <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-primary-600" />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                        {article.created_by && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{article.created_by}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-primary-600">
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <Link href={`/articles/${article.id}`}>
                        <button className="px-4 py-2 bg-tertiary-500/20 hover:bg-primary-700/30 border border-tertiary-500/30 hover:border-primary-700/50 rounded-lg text-primary-700 text-sm transition-colors duration-300 flex items-center gap-2">
                          <span>Read More</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View all articles button */}
        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <Link href="/articles">
              <button className="px-6 py-3 bg-primary-700/20 hover:bg-primary-700/30 border border-primary-700/30 rounded-lg text-primary-700 font-medium transition-colors duration-300 flex items-center gap-2 mx-auto">
                <span>View All Articles</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Add this at the end of your JSX */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </main>
  );
}
