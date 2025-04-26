"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import { fetchArticles, deleteArticle } from "../../utils/api";
import type { Article } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function ArticlesDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Fetch articles data
  const loadArticles = async () => {
    try {
      setLoading(true);
      const data: any = await fetchArticles();
      
      // Handle different response formats
      let articlesData: Article[] = [];
      
      if (Array.isArray(data)) {
        articlesData = data;
      } else if (data && data?.data && Array.isArray(data.data)) {
        articlesData = data?.data;
      } else if (data && data.data && data.data.articles && Array.isArray(data.data.articles)) {
        articlesData = data.data.articles;
      }
      
      setArticles(articlesData);
      setFilteredArticles(articlesData);
      setError(null);
    } catch (err) {
      console.error("Error loading articles:", err);
      setError("Failed to load article data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle article search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      (article.content && article.content.toLowerCase().includes(query)) ||
      (article.category && article.category.toLowerCase().includes(query))
    );
    
    setFilteredArticles(filtered);
  };

  // Handle article deletion
  const confirmDelete = (id: number) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setArticleToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      await deleteArticle(articleToDelete);
      setArticles(articles.filter(article => article.id !== articleToDelete));
      setFilteredArticles(filteredArticles.filter(article => article.id !== articleToDelete));
      setShowDeleteModal(false);
      setArticleToDelete(null);
      // Display success message, can use toast notification
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article. Please try again later.");
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Handle search on input change
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  // Format date helper function
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold">Article Management</h1>
            <p className="mt-2 opacity-80">Manage your article content</p>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Add Button */}
          <Link href="/dashboard/articles/add">
            <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Article
            </div>
          </Link>
        </div>
        
        {/* Articles List */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Article List
            </h2>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}
          
          {/* Articles Table */}
          {!loading && filteredArticles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publication Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="relative px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{article.category || 'No category'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(article.status)}`}>
                          {article.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(article.published_at || article.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.author || article.created_by || 'Admin'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/dashboard/articles/${article.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </Link>
                          
                          <Link href={`/dashboard/articles/edit/${article.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                          
                          <button
                            onClick={() => confirmDelete(article.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && filteredArticles.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No articles</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'No articles found matching your search.' : 'Start adding your first article.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove search filter
                </button>
              )}
              {!searchQuery && (
                <Link href="/dashboard/articles/add">
                  <div className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Article
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 z-10">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Confirm Delete</h3>
                </div>
                <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this article? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}