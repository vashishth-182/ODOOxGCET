import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { logout } from '../../services/authService';

/**
 * User Menu Component
 * 
 * Profile dropdown with:
 * - User avatar with initials
 * - Name and role display
 * - Profile link
 * - Logout action
 * - Keyboard accessible
 */
export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

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

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center space-x-2.5 px-3 py-2 rounded-xl
          hover:bg-neutral-50 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white
          transition-all duration-300
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-md shadow-primary-500/25 flex-shrink-0">
          {getInitials(user.firstName, user.lastName)}
        </div>
        
        {/* Name and Role */}
        <div className="hidden lg:flex flex-col items-start select-none">
          <span className="text-sm font-semibold text-neutral-900 leading-none">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-neutral-500 leading-none mt-0.5 font-medium">
            {user.role === 'admin' ? 'Admin' : 'Employee'}
          </span>
        </div>
        
        {/* Chevron */}
        <ChevronDown
          className={`
            w-4 h-4 text-neutral-400 transition-transform duration-300
            ${isOpen ? 'rotate-180' : ''}
          `}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-56
            glass rounded-xl shadow-soft-lg border border-neutral-200/50 py-2
            animate-fade-in z-50
            backdrop-blur-xl bg-white/95
          "
          role="menu"
        >
          <Link
            to="/profile"
            className="
              flex items-center space-x-3 px-4 py-2.5 text-sm text-neutral-700
              hover:bg-primary-50 hover:text-primary-700
              focus:outline-none focus:bg-primary-50
              transition-all duration-200
              font-medium
            "
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
            <span className="select-none">My Profile</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-danger-600
              hover:bg-danger-50 hover:text-danger-700
              focus:outline-none focus:bg-danger-50
              transition-all duration-200
              font-medium
            "
            role="menuitem"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span className="select-none">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

