import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import CheckInOutButton from './CheckInOutButton';

export default function Header({ showMenu = false, onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2.5 group transition-opacity hover:opacity-80"
            aria-label="Dayflow Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft-md group-hover:shadow-soft-lg transition-shadow">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-neutral-900 leading-none">Dayflow</span>
              <span className="text-xs text-neutral-500 hidden sm:block">HRMS</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Check In/Out Button (Employee only) */}
            {user?.role === 'employee' && <CheckInOutButton />}

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="w-9 h-9 bg-gradient-primary text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-soft-md">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-900 leading-none">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-neutral-500 leading-none mt-0.5">
                    {user?.role === 'admin' ? 'Admin' : 'Employee'}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-neutral-200 py-2 z-50 animate-fade-in"
                  role="menu"
                >
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-neutral-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
