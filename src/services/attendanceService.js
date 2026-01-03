import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';

/**
 * Check in
 */
export async function checkIn(userId, employeeId) {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    
    // Check if already checked in today
    const existingQuery = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      throw new Error('Already checked in today');
    }
    
    // Create attendance record
    const attendanceData = {
      userId,
      employeeId,
      date: today,
      checkInTime: Timestamp.fromDate(now),
      checkOutTime: null,
      totalHours: null,
      status: 'present',
      isManualEntry: false,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    };
    
    const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
    
    // Update user status
    await updateDoc(doc(db, 'users', userId), {
      currentStatus: 'present',
      updatedAt: Timestamp.fromDate(now)
    });
    
    return { id: docRef.id, ...attendanceData };
  } catch (error) {
    throw error;
  }
}

/**
 * Check out
 */
export async function checkOut(userId) {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    
    // Find today's attendance
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    
    const attendanceDocs = await getDocs(attendanceQuery);
    if (attendanceDocs.empty) {
      throw new Error('No check-in record found for today');
    }
    
    const attendanceDoc = attendanceDocs.docs[0];
    const attendanceData = attendanceDoc.data();
    
    if (attendanceData.checkOutTime) {
      throw new Error('Already checked out today');
    }
    
    // Calculate hours worked
    const checkInTime = attendanceData.checkInTime.toDate();
    const checkOutTime = now;
    const diffMs = checkOutTime - checkInTime;
    const totalHours = diffMs / (1000 * 60 * 60); // Convert to hours
    
    // Update attendance record
    await updateDoc(attendanceDoc.ref, {
      checkOutTime: Timestamp.fromDate(now),
      totalHours: Math.round(totalHours * 100) / 100,
      updatedAt: Timestamp.fromDate(now)
    });
    
    // Update user status
    await updateDoc(doc(db, 'users', userId), {
      currentStatus: 'absent',
      updatedAt: Timestamp.fromDate(now)
    });
    
    return { totalHours, checkOutTime: now };
  } catch (error) {
    throw error;
  }
}

/**
 * Get today's attendance for user
 */
export async function getTodayAttendance(userId) {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    
    const attendanceDocs = await getDocs(attendanceQuery);
    if (attendanceDocs.empty) return null;
    
    const doc = attendanceDocs.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
}

/**
 * Get attendance for user in a month
 */
export async function getMonthlyAttendance(userId, year, month) {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const attendanceDocs = await getDocs(attendanceQuery);
    const attendance = {};
    
    attendanceDocs.forEach(doc => {
      const data = doc.data();
      attendance[data.date] = { id: doc.id, ...data };
    });
    
    return attendance;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all employees' attendance for today (Admin)
 */
export async function getTodayAllAttendance() {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('date', '==', today)
    );
    
    const attendanceDocs = await getDocs(attendanceQuery);
    const attendance = {};
    
    attendanceDocs.forEach(doc => {
      const data = doc.data();
      attendance[data.userId] = { id: doc.id, ...data };
    });
    
    return attendance;
  } catch (error) {
    throw error;
  }
}

