import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import CheckInOutButton from '../CheckInOutButton';

/**
 * Main Navbar Component
 * 
 * Features:
 * - Fully responsive (desktop, tablet, mobile)
 * - Sticky positioning with smooth scroll
 * - Active route highlighting
 * - Theme toggle integration
 * - User menu with profile/logout
 * - Mobile slide-in menu
 */
export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on login/change-password pages
  if (location.pathname === '/login' || location.pathname === '/change-password') {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-50 glass border-b border-neutral-200/50 shadow-soft select-none"
      role="navigation"
      aria-label="Main navigation"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 lg:flex-1 lg:justify-center lg:px-8">
            <NavLinks isAdmin={isAdmin} currentPath={location.pathname} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Check In/Out Button (Employee only, Desktop) */}
            {user?.role === 'employee' && (
              <div className="hidden sm:block">
                <CheckInOutButton />
              </div>
            )}

            {/* User Menu (Desktop) */}
            <div className="hidden sm:block">
              <UserMenu user={user} />
            </div>

            {/* Mobile Menu Button */}
            <MobileMenu
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              isAdmin={isAdmin}
              currentPath={location.pathname}
              user={user}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

