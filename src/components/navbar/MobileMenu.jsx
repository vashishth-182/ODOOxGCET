import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Menu, LayoutDashboard, User, Calendar, Plane, DollarSign, Users, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';
import CheckInOutButton from '../CheckInOutButton';

/**
 * Mobile Menu Component
 * 
 * Slide-in menu for mobile devices with:
 * - Navigation links
 * - Check-in/out button (employees)
 * - User info
 * - Logout
 * - Smooth animations
 * - Backdrop overlay
 */
export default function MobileMenu({ isOpen, onToggle, isAdmin, currentPath, user }) {
  const navigate = useNavigate();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
    { path: '/attendance', label: 'Attendance', icon: Calendar, roles: ['admin', 'employee'] },
    { path: '/leave', label: 'Leave', icon: Plane, roles: ['admin', 'employee'] },
    { path: '/payroll', label: 'Payroll', icon: DollarSign, roles: ['admin', 'employee'] },
    { path: '/create-employee', label: 'Employees', icon: Users, roles: ['admin'] },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.roles.includes('admin') && item.roles.includes('employee')) {
      return true;
    }
    return item.roles.includes(isAdmin ? 'admin' : 'employee');
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={onToggle}
        className="
          sm:hidden w-9 h-9 rounded-xl
          flex items-center justify-center
          bg-white border border-neutral-200 shadow-sm
          hover:bg-neutral-50 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white
          transition-all duration-300
        "
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-neutral-700" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5 text-neutral-700" aria-hidden="true" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw]
          glass shadow-soft-xl z-50 border-l border-neutral-200/50
          transform transition-transform duration-300 ease-out
          lg:hidden backdrop-blur-xl bg-white/95
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-md shadow-primary-500/25">
                {user ? getInitials(user.firstName, user.lastName) : 'U'}
              </div>
              <div className="select-none">
                <div className="text-sm font-semibold text-neutral-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  {user?.role === 'admin' ? 'Admin' : 'Employee'}
                </div>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-neutral-600" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
            <ul className="space-y-1 px-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || 
                                (item.path === '/dashboard' && currentPath === '/');

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onToggle}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl
                        text-base font-semibold
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="select-none">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Check In/Out Button (Employee only) */}
            {user?.role === 'employee' && (
              <div className="px-2 mt-4">
                <CheckInOutButton />
              </div>
            )}
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-neutral-200 p-4 space-y-2">
            <Link
              to="/profile"
              onClick={onToggle}
              className="
                flex items-center space-x-3 px-4 py-2.5 rounded-xl
                text-sm font-medium text-neutral-700
                hover:bg-primary-50 hover:text-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset
                transition-all duration-200
              "
            >
              <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
              <span className="select-none">My Profile</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl
                text-sm font-medium text-danger-600
                hover:bg-danger-50 hover:text-danger-700
                focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-inset
                transition-all duration-200
              "
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="select-none">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

