import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getMonthlyAttendance, getTodayAllAttendance } from '../services/attendanceService';
import { getAllEmployees } from '../services/userService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDaysInMonth, isWeekend } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function Attendance() {
  const { user, isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState(isAdmin ? 'today' : 'month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && viewMode === 'today') {
      loadTodayAttendance();
    } else {
      loadMonthlyAttendance();
    }
  }, [currentDate, viewMode, selectedEmployee]);

  useEffect(() => {
    if (isAdmin) {
      loadEmployees();
    }
  }, [isAdmin]);

  const loadTodayAttendance = async () => {
    setLoading(true);
    try {
      const todayAtt = await getTodayAllAttendance();
      const emps = await getAllEmployees();
      setAttendance(todayAtt);
      setEmployees(emps);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const userId = selectedEmployee?.id || user.id;
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthlyAtt = await getMonthlyAttendance(userId, year, month);
      setAttendance(monthlyAtt);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const emps = await getAllEmployees();
      setEmployees(emps);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const getStatusForDate = (dateStr) => {
    const att = attendance[dateStr];
    if (!att) {
      const date = new Date(dateStr);
      if (isWeekend(date)) return { type: 'weekend', label: '-' };
      return { type: 'absent', label: 'A' };
    }
    
    if (att.status === 'leave') return { type: 'leave', label: 'L' };
    if (att.status === 'present') return { type: 'present', label: 'P' };
    if (att.status === 'half-day') return { type: 'half-day', label: 'H' };
    return { type: 'absent', label: 'A' };
  };

  const getDaysInMonthArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    // Add empty cells for days before month starts
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    allDays.forEach(day => {
      days.push(day);
    });
    
    return days;
  };

  const statusColors = {
    present: 'bg-green-500 text-white',
    absent: 'bg-red-500 text-white',
    'half-day': 'bg-yellow-500 text-white',
    leave: 'bg-blue-500 text-white',
    weekend: 'bg-gray-200 text-gray-400'
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  if (isAdmin && viewMode === 'today') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Attendance - Today</h1>
            <div className="space-x-2">
              <button
                onClick={() => setViewMode('today')}
                className={`btn ${viewMode === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              >
                By Employee
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">
              Present Today ({Object.keys(attendance).length}/{employees.length})
            </h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-3">
                {employees.map(emp => {
                  const att = attendance[emp.id];
                  const isPresent = !!att;
                  return (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${isPresent ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <h3 className="font-semibold">{emp.firstName} {emp.lastName}</h3>
                          <p className="text-sm text-gray-600">{emp.designation}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {isPresent && att.checkInTime && (
                          <span>Checked in at {format(att.checkInTime.toDate(), 'h:mm a')}</span>
                        )}
                        {!isPresent && <span className="text-yellow-600">Absent</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          {isAdmin && (
            <div className="space-x-2">
              <button
                onClick={() => { setViewMode('today'); loadTodayAttendance(); }}
                className={`btn ${viewMode === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              >
                By Employee
              </button>
            </div>
          )}
        </div>

        {isAdmin && viewMode === 'month' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <select
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp || null);
              }}
              className="input max-w-xs"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => navigateMonth(-1)} className="btn btn-secondary">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="btn btn-secondary">
                Today
              </button>
              <button onClick={() => navigateMonth(1)} className="btn btn-secondary">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonthArray().map((day, index) => {
                  if (!day) return <div key={index}></div>;
                  
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const status = getStatusForDate(dateStr);
                  
                  return (
                    <div
                      key={dateStr}
                      className={`aspect-square flex items-center justify-center rounded-lg font-medium text-sm ${
                        statusColors[status.type] || 'bg-gray-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xs">{day.getDate()}</div>
                        <div className="text-xs mt-1">{status.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Leave</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Weekend</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

