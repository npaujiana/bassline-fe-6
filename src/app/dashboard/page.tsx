"use client";

import React, { useState, useEffect } from "react";

const initialArticles = [
  {
    id: 1,
    title: "Beautiful Beach",
    description: "A beautiful beach with crystal clear water and white sand.",
    location: "Bali, Indonesia",
    createdAt: "2025-04-10"
  },
  {
    id: 2,
    title: "Mountain Retreat",
    description: "A peaceful mountain retreat surrounded by nature.",
    location: "Bandung, Indonesia",
    createdAt: "2025-04-15"
  },
];

export default function DashboardPage() {
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState({ title: "", description: "", location: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("articles");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.title || !form.description || !form.location) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newArticle = {
        id: articles.length ? Math.max(...articles.map((a) => a.id)) + 1 : 1,
        title: form.title,
        description: form.description,
        location: form.location,
        createdAt: new Date().toISOString().split('T')[0] || new Date().toDateString()
      };
      setArticles([...articles, newArticle]);
      setForm({ title: "", description: "", location: "" });
      setIsLoading(false);
    }, 600);
  };

  const handleEdit = (article: { id: number; title: string; description: string; location: string }) => {
    setEditId(article.id);
    setForm({
      title: article.title,
      description: article.description,
      location: article.location,
    });
  };

  const handleUpdate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setArticles(
        articles.map((a) =>
          a.id === editId ? { ...a, ...form } : a
        )
      );
      setEditId(null);
      setForm({ title: "", description: "", location: "" });
      setIsLoading(false);
    }, 600);
  };

  const handleDelete = (id: number) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setArticles(articles.filter((a) => a.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({ title: "", description: "", location: "" });
      }
      setIsLoading(false);
    }, 600);
  };

  // Animation effect for loading state
  useEffect(() => {
    if (isLoading) {
      document.body.style.cursor = 'progress';
    } else {
      document.body.style.cursor = 'default';
    }
    
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isLoading]);

  // Dashboard data for summary
  const dashboardData = {
    totalArticles: articles.length,
    recentActivity: "2 new articles added today",
    pendingReviews: 3,
    analytics: {
      views: 1254,
      engagement: "78%",
      trending: "Bali, Indonesia"
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 p-4 md:p-8 relative">
      {/* Grid background with neon effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      </div>
      
      {/* Dashboard Header */}
      <div className="relative z-10 max-w-6xl mx-auto mb-10 mt-15">
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-white to-red-600 rounded-lg blur opacity-25 -z-10"></div>
          <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
                Control Center
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm">System Online</span>
              </div>
            </div>
            
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white/90">Total Articles</h3>
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-semibold text-white mt-2">{dashboardData.totalArticles}</p>
                <p className="text-sm text-blue-300 mt-1">+2 this week</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:border-purple-500/50 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white/90">Recent Activity</h3>
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl font-semibold text-white mt-2">{dashboardData.recentActivity}</p>
                <p className="text-sm text-purple-300 mt-1">Last updated 2h ago</p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto space-x-4 pb-2 mt-4">
              <button 
                onClick={() => setActiveTab("articles")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${activeTab === "articles" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Articles
              </button>
              <button 
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${activeTab === "analytics" 
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-600/20" 
                  : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${activeTab === "settings" 
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-600/20" 
                  : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </div>

        {activeTab === "articles" && (
          <>
            {/* Article Form */}
            <div className="mb-6 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-75 -z-10 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {editId ? "Edit Article" : "Create New Article"}
                </h2>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none transition-all duration-300"
                    rows={3}
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                  />
                  {editId ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="relative group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Update</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null);
                          setForm({ title: "", description: "", location: "" });
                        }}
                        disabled={isLoading}
                        className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdd}
                      disabled={isLoading}
                      className="relative group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span>Add Article</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-75 -z-10 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Existing Articles
                  </h2>
                  <span className="text-sm text-white/50">Total: {articles.length}</span>
                </div>
                
                {articles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-white/70 text-lg">No articles available.</p>
                    <button className="mt-4 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Create your first article</span>
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {articles.map((article) => (
                      <li
                        key={article.id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10 relative group"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-white">{article.title}</h3>
                              <span className="text-xs text-white/40 hidden sm:inline"># {article.id}</span>
                            </div>
                            <p className="text-white/70 my-2">{article.description}</p>
                            <div className="flex flex-wrap gap-3 items-center mt-3">
                              <div className="flex items-center text-sm text-white/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{article.location}</span>
                              </div>
                              {article.createdAt && (
                                <div className="flex items-center text-sm text-white/40">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                  </svg>
                                  <span>{article.createdAt}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              disabled={isLoading}
                              className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              disabled={isLoading}
                              className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                        {/* Hover effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 rounded-xl blur transition-all duration-500"></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === "analytics" && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-75 -z-10"></div>
            <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Analytics Dashboard</h2>
              <div className="flex items-center justify-center h-64 text-white/50">
                <p className="text-center">Analytics features coming soon</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "settings" && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-75 -z-10"></div>
            <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Settings</h2>
              <div className="flex items-center justify-center h-64 text-white/50">
                <p className="text-center">Settings configuration coming soon</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer with version info */}
        <div className="mt-8 text-center text-xs text-white/30">
          <p>Dashboard v2.0 • Last updated: April 18, 2025</p>
        </div>
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
