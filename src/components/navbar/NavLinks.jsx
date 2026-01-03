import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, Plane, DollarSign, Users } from 'lucide-react';

/**
 * Navigation Links Component
 * 
 * Displays navigation links with:
 * - Active state highlighting
 * - Icon + label
 * - Smooth hover transitions
 * - Role-based visibility
 */
export default function NavLinks({ isAdmin, currentPath }) {
  // Navigation items with icons and routes
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'employee'],
    },
    {
      path: '/attendance',
      label: 'Attendance',
      icon: Calendar,
      roles: ['admin', 'employee'],
    },
    {
      path: '/leave',
      label: 'Leave',
      icon: Plane,
      roles: ['admin', 'employee'],
    },
    {
      path: '/payroll',
      label: 'Payroll',
      icon: DollarSign,
      roles: ['admin', 'employee'],
    },
    {
      path: '/create-employee',
      label: 'Employees',
      icon: Users,
      roles: ['admin'],
    },
  ];

  // Filter items based on role
  const visibleItems = navItems.filter((item) => {
    if (item.roles.includes('admin') && item.roles.includes('employee')) {
      return true;
    }
    return item.roles.includes(isAdmin ? 'admin' : 'employee');
  });

  return (
    <ul className="flex items-center space-x-1" role="list">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path || 
                        (item.path === '/dashboard' && currentPath === '/');

        return (
          <li key={item.path} role="listitem">
            <Link
              to={item.path}
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-xl
                text-sm font-semibold
                transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white
                ${
                  isActive
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="select-none">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

