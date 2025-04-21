"use client";

import React from "react";
import AdminLayout from "../../components/AdminLayout";

export default function CrowdTypesDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 -mb-10 -ml-10"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Crowd Types Management</h1>
            <p className="mt-2 opacity-80">Manage venue crowd type information</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-6">
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Crowd Types Dashboard</h2>
              <p className="text-gray-500 mt-2">This page will display crowd types management functionality</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}