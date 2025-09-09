import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-healthcare-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-healthcare-accent/30 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}