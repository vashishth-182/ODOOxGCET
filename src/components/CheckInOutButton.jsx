import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkIn, checkOut, getTodayAttendance } from '../services/attendanceService';
import { format } from 'date-fns';

export default function CheckInOutButton() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayAttendance();
  }, [user]);

  const loadTodayAttendance = async () => {
    if (!user) return;
    try {
      const todayAtt = await getTodayAttendance(user.id);
      setAttendance(todayAtt);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await checkIn(user.id, user.employeeId);
      await loadTodayAttendance();
      // Show success message
      const time = format(new Date(), 'h:mm a');
      alert(`Checked in successfully at ${time}`);
    } catch (error) {
      alert(error.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const result = await checkOut(user.id);
      await loadTodayAttendance();
      // Show success message
      alert(`Checked out successfully. Total hours: ${result.totalHours.toFixed(2)}h`);
    } catch (error) {
      alert(error.message || 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = attendance?.checkInTime && !attendance?.checkOutTime;
  const checkInTime = attendance?.checkInTime
    ? format(attendance.checkInTime.toDate(), 'h:mm a')
    : null;

  if (isCheckedIn) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-success-light rounded-lg">
          <div className="status-dot status-present" aria-hidden="true"></div>
          <span className="text-sm font-medium text-success-dark">Checked In</span>
        </div>
        <button
          onClick={handleCheckOut}
          disabled={loading}
          className="btn btn-danger text-sm"
          aria-label="Check out"
        >
          {loading ? (
            <span className="spinner" aria-hidden="true"></span>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Check Out</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={loading || !!attendance?.checkOutTime}
      className="btn btn-primary text-sm"
      aria-label="Check in"
    >
      {loading ? (
        <span className="spinner" aria-hidden="true"></span>
      ) : (
        <>
          <Clock className="w-4 h-4 mr-1.5" aria-hidden="true" />
          <span>Check In</span>
        </>
      )}
    </button>
  );
}
