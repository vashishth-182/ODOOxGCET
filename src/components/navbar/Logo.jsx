import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component
 * Brand logo with Dayflow name
 */
export default function Logo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center space-x-2.5 group transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white rounded-lg px-1 -ml-1"
      aria-label="Dayflow Home"
    >
      {/* Logo Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-110">
        <span className="text-lg font-bold text-white drop-shadow-sm">D</span>
      </div>
      
      {/* Brand Name */}
      <div className="flex flex-col select-none">
        <span className="text-lg font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent leading-none tracking-tight">
          Dayflow
        </span>
        <span className="text-xs text-neutral-500 leading-none mt-0.5 hidden sm:block font-medium">
          HRMS
        </span>
      </div>
    </Link>
  );
}

