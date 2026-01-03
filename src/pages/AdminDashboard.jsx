import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Users, UserCheck, Plane, UserPlus, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllEmployees } from '../services/userService';
import { getTodayAllAttendance } from '../services/attendanceService';
import { getPendingLeaveRequests } from '../services/leaveService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({});
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [emps, attendance, leaves] = await Promise.all([
        getAllEmployees(),
        getTodayAllAttendance(),
        getPendingLeaveRequests()
      ]);
      
      setEmployees(emps);
      setTodayAttendance(attendance);
      setPendingLeaves(leaves);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeStatus = (emp) => {
    const attendance = todayAttendance[emp.id];
    if (attendance) {
      return { type: 'present', label: 'Present', color: 'status-present', bg: 'bg-success-light', text: 'text-success-dark' };
    }
    if (emp.currentStatus === 'on-leave') {
      return { type: 'leave', label: 'On Leave', color: 'status-leave', bg: 'bg-accent-50', text: 'text-accent-700', icon: '✈️' };
    }
    return { type: 'absent', label: 'Absent', color: 'status-absent', bg: 'bg-neutral-100', text: 'text-neutral-600' };
  };

  const filteredEmployees = employees.filter(emp => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(query) ||
      emp.lastName?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query) ||
      emp.employeeId?.toLowerCase().includes(query)
    );
  });

  const presentCount = employees.filter(emp => todayAttendance[emp.id]).length;
  const onLeaveCount = employees.filter(emp => emp.currentStatus === 'on-leave').length;

  const statCards = [
    {
      label: 'Total Employees',
      value: employees.length,
      icon: Users,
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      label: 'Present Today',
      value: presentCount,
      icon: UserCheck,
      gradient: 'from-success to-success-dark',
    },
    {
      label: 'On Leave Today',
      value: onLeaveCount,
      icon: Plane,
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      label: 'Pending Approvals',
      value: pendingLeaves.length,
      icon: Plane,
      gradient: 'from-warning to-warning-dark',
      link: '/leave',
    }
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-neutral-600 text-lg">Welcome back, {user?.firstName}</p>
          </div>
          <Link to="/create-employee" className="btn btn-primary inline-flex items-center space-x-2 self-start">
            <UserPlus className="w-5 h-5" aria-hidden="true" />
            <span>Add Employee</span>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const CardWrapper = stat.link ? Link : 'div';
            const cardProps = stat.link ? { to: stat.link } : {};
            
            return (
              <CardWrapper
                key={index}
                {...cardProps}
                className={stat.link ? 'block' : ''}
              >
                <div className={`card p-6 ${stat.link ? 'card-interactive' : ''} animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-soft-md`}>
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* Employee List */}
        <div className="card p-6 md:p-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-neutral-900">Employee List</h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
                aria-label="Search employees"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-500">
              <div className="spinner mx-auto mb-4 w-8 h-8 border-4"></div>
              <p>Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-neutral-300" aria-hidden="true" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((emp) => {
                const status = getEmployeeStatus(emp);
                return (
                  <Link
                    key={emp.id}
                    to={`/profile?userId=${emp.id}`}
                    className="block p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-soft transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary text-white rounded-xl flex items-center justify-center font-semibold shadow-soft-md flex-shrink-0">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-neutral-900 text-lg">
                              {emp.firstName} {emp.lastName}
                            </h3>
                            <span className={`status-dot ${status.color}`} aria-label={status.label}></span>
                            <span className={`badge ${status.bg} ${status.text} text-xs`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 mb-0.5">{emp.designation}</p>
                          <p className="text-xs text-neutral-500">{emp.email}</p>
                          <p className="text-xs text-neutral-400 font-mono mt-1">{emp.employeeId}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" aria-hidden="true" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
