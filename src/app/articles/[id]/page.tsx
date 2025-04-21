"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, MapPinIcon, StarIcon, ClockIcon, MusicalNoteIcon, CalendarDaysIcon, UserIcon, TagIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchArticleById } from '../../utils/api';
import type { Article } from '../../utils/api';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error("Article ID is missing");
        }
        
        const data = await fetchArticleById(id.toString());
        setArticle(data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        setError("Failed to load article. It might have been deleted or is unavailable.");
      } finally {
        setIsLoading(false);
      }
    };

    getArticle();
  }, [id]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-red-500/30 h-12 w-12 mb-4"></div>
          <div className="h-5 bg-red-500/30 rounded w-48"></div>
          <div className="mt-2 h-4 bg-red-500/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Render error if article not found
  if (error || !article) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Article Not Found</h1>
        <p className="text-xl mb-8 text-red-500/80">{error || "We couldn't find the article you were looking for."}</p>
        <Link href="/recommendations" className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Return to Recommendations
        </Link>
      </div>
    );
  }

  // Render article content with Markdown processing
  const renderContent = () => {
    // Simple markdown-like parsing for headings and paragraphs
    if (!article.content) return null;
    
    return article.content.split('\n\n').map((paragraph: string, index: number) => {
      if (paragraph.trim() === '') return null;
      
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-red-500 mb-4">{paragraph.substring(2)}</h1>;
      } else if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-red-500 mt-8 mb-4">{paragraph.substring(3)}</h2>;
      } else if (paragraph.startsWith('- ')) {
        return (
          <ul key={index} className="list-disc pl-6 my-4 text-red-500/90">
            {paragraph.split('\n').map((item, i) => (
              <li key={i} className="mb-2">{item.substring(2)}</li>
            ))}
          </ul>
        );
      } else {
        // Process bold text within paragraphs
        const processedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <p 
            key={index} 
            className="text-red-500/90 mb-4 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
    });
  };

  return (
    <main className="min-h-screen bg-white relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-700/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 -right-20 w-96 h-96 bg-red-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] z-0 pointer-events-none"></div>
      
      {/* Hero section with image */}
      <div className="w-full h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src={article.coverImageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
          }}
        />
        
        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-5xl mx-auto">
            <Link 
              href="/recommendations" 
              className="inline-flex items-center text-white mb-4 group hover:text-red-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Recommendations
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{article.title}</h1>
            
            <div className="flex items-center flex-wrap gap-4 mt-4">
              <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                <CalendarDaysIcon className="h-4 w-4 text-red-300 mr-1" />
                <span className="text-white text-sm">{formatDate(article.published_at || article.created_at)}</span>
              </div>
              
              {article.category && (
                <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                  <MusicalNoteIcon className="h-4 w-4 text-red-300 mr-1" />
                  <span className="text-white text-sm">{article.category}</span>
                </div>
              )}
              
              {article.created_by && (
                <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                  <UserIcon className="h-4 w-4 text-red-300 mr-1" />
                  <span className="text-white text-sm">{article.created_by}</span>
                </div>
              )}
              
              <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                <span className={`text-white text-sm ${
                  article.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {article.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article content */}
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="prose prose-lg prose-red max-w-none">
          {renderContent()}
        </div>
        
        {/* Tags section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-red-500 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="mt-16 mb-8 text-center">
          <Link 
            href="/recommendations" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-red-500/40"
          >
            View More Articles
          </Link>
        </div>
      </div>
      
      {/* Add this at the end of your JSX */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 0, 0, 0.03) 1px, transparent 1px);
        }
      `}</style>
    </main>
  );
}