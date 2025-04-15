import React from "react";

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-yellow-50">
      <div className="relative bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl px-8 py-10 flex flex-col items-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 via-pink-400 to-yellow-400 blur-xl opacity-60 animate-pulse" />
          <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-t-red-500 border-b-yellow-400 rounded-full animate-spin" />
          <div className="absolute inset-4 flex items-center justify-center bg-white/80 rounded-full shadow-inner">
            <svg className="w-8 h-8 text-red-500 animate-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 0V4m0 4a4 4 0 110 8m0-8a4 4 0 100 8m0 0v4m0-4v4" />
            </svg>
          </div>
        </div>
        <p className="text-lg sm:text-xl font-semibold text-red-600 drop-shadow-lg animate-glow">{text}</p>
      </div>
    </div>
  );
}
