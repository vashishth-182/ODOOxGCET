import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, getDay } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  return format(new Date(date), formatStr);
}

/**
 * Format time for display
 */
export function formatTime(time) {
  if (!time) return '';
  return format(new Date(time), 'h:mm a');
}

/**
 * Get all days in a month
 */
export function getDaysInMonth(year, month) {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
}

/**
 * Check if date is weekend
 */
export function isWeekendDay(date) {
  return isWeekend(new Date(date));
}

/**
 * Calculate days between two dates
 */
export function calculateDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Inclusive of both dates
}

/**
 * Get working days in a month (excluding weekends)
 */
export function getWorkingDaysInMonth(year, month) {
  const days = getDaysInMonth(year, month);
  return days.filter(day => !isWeekend(day)).length;
}

