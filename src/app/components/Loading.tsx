import React from "react";

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-secondary">
      <div className="relative bg-secondary/20 backdrop-blur-xl rounded-2xl border border-secondary/30 shadow-2xl px-8 py-10 flex flex-col items-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-primary opacity-60 animate-pulse" />
          <div className="absolute inset-0 border-4 border-secondary/30 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-t-primary border-b-accent rounded-full animate-spin" />
          <div className="absolute inset-4 flex items-center justify-center bg-secondary/80 rounded-full shadow-inner">
            <svg className="w-8 h-8 text-primary animate-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 0V4m0 4a4 4 0 110 8m0-8a4 4 0 100 8m0 0v4m0-4v4" />
            </svg>
          </div>
        </div>
        <p className="text-lg sm:text-xl font-semibold text-primary drop-shadow-lg animate-glow">{text}</p>
      </div>
    </div>
  );
}
