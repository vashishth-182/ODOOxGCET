import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { User, Calendar, Plane, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const quickAccessCards = [
    {
      icon: User,
      title: 'My Profile',
      subtitle: 'View and edit your information',
      link: '/profile',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      icon: Calendar,
      title: 'Attendance',
      subtitle: 'View your attendance records',
      link: '/attendance',
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      icon: Plane,
      title: 'Leave Requests',
      subtitle: 'Apply for time off',
      link: '/leave',
      gradient: 'from-warning to-warning-dark',
    },
    {
      icon: LogOut,
      title: 'Logout',
      subtitle: 'Sign out of your account',
      action: handleLogout,
      gradient: 'from-neutral-600 to-neutral-700',
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      present: { 
        color: 'status-present', 
        label: 'checked in',
        bg: 'bg-success-light',
        text: 'text-success-dark'
      },
      absent: { 
        color: 'status-absent', 
        label: 'not checked in',
        bg: 'bg-neutral-100',
        text: 'text-neutral-600'
      },
      'on-leave': { 
        color: 'status-leave', 
        label: 'on leave',
        bg: 'bg-accent-50',
        text: 'text-accent-700'
      }
    };
    return configs[status] || configs.absent;
  };

  const statusConfig = getStatusConfig(user?.currentStatus);

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Welcome back, <span className="text-primary-600">{user?.firstName}</span>
          </h1>
          <div className="flex items-center space-x-3">
            <div className={`status-dot ${statusConfig.color}`} aria-hidden="true"></div>
            <span className={`text-base ${statusConfig.text} font-medium`}>
              You are {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {quickAccessCards.map((card, index) => {
            const Icon = card.icon;
            const cardContent = (
              <div className="card card-interactive p-6 h-full flex flex-col group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-soft-md group-hover:shadow-soft-lg transition-shadow`}>
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1.5">{card.title}</h3>
                <p className="text-sm text-neutral-600 mb-4 flex-1">{card.subtitle}</p>
                <div className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
                  <span>Open</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </div>
            );

            if (card.action) {
              return (
                <button
                  key={index}
                  onClick={card.action}
                  className="text-left"
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={card.link}
                className="block"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="card p-6 md:p-8 animate-fade-in">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-neutral-500">
              <div className="w-2 h-2 bg-neutral-300 rounded-full" aria-hidden="true"></div>
              <span>Your recent check-in and check-out times will appear here</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
