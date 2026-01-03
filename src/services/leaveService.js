import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateDaysDifference } from '../utils/dateHelpers';

/**
 * Apply for leave
 */
export async function applyForLeave(userId, employeeId, employeeName, leaveData) {
  try {
    const totalDays = calculateDaysDifference(leaveData.fromDate, leaveData.toDate);
    
    const leaveRequest = {
      userId,
      employeeId,
      employeeName,
      leaveType: leaveData.leaveType,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      totalDays,
      reason: leaveData.reason,
      status: 'pending',
      approvedBy: null,
      approvedByName: null,
      approverComments: '',
      respondedAt: null,
      appliedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'leaveRequests'), leaveRequest);
    return { id: docRef.id, ...leaveRequest };
  } catch (error) {
    throw error;
  }
}

/**
 * Get leave requests for user
 */
export async function getUserLeaveRequests(userId) {
  try {
    const leaveQuery = query(
      collection(db, 'leaveRequests'),
      where('userId', '==', userId)
    );
    
    const leaveDocs = await getDocs(leaveQuery);
    const requests = [];
    
    leaveDocs.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by date (newest first)
    requests.sort((a, b) => {
      const dateA = a.appliedAt?.toDate() || new Date(a.createdAt);
      const dateB = b.appliedAt?.toDate() || new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return requests;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all pending leave requests (Admin)
 */
export async function getPendingLeaveRequests() {
  try {
    const leaveQuery = query(
      collection(db, 'leaveRequests'),
      where('status', '==', 'pending')
    );
    
    const leaveDocs = await getDocs(leaveQuery);
    const requests = [];
    
    leaveDocs.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by applied date (oldest first for admin)
    requests.sort((a, b) => {
      const dateA = a.appliedAt?.toDate() || new Date(a.createdAt);
      const dateB = b.appliedAt?.toDate() || new Date(b.createdAt);
      return dateA - dateB;
    });
    
    return requests;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all leave requests (Admin)
 */
export async function getAllLeaveRequests() {
  try {
    const leaveQuery = query(collection(db, 'leaveRequests'));
    
    const leaveDocs = await getDocs(leaveQuery);
    const requests = [];
    
    leaveDocs.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by date (newest first)
    requests.sort((a, b) => {
      const dateA = a.appliedAt?.toDate() || new Date(a.createdAt);
      const dateB = b.appliedAt?.toDate() || new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return requests;
  } catch (error) {
    throw error;
  }
}

/**
 * Approve leave request
 */
export async function approveLeaveRequest(requestId, adminId, adminName, comments = '') {
  try {
    const now = Timestamp.now();
    
    await updateDoc(doc(db, 'leaveRequests', requestId), {
      status: 'approved',
      approvedBy: adminId,
      approvedByName: adminName,
      approverComments: comments,
      respondedAt: now,
      updatedAt: now
    });
    
    // Update attendance records for the leave dates
    const leaveDoc = await getDoc(doc(db, 'leaveRequests', requestId));
    const leaveData = leaveDoc.data();
    
    // This would update attendance records - simplified for now
    // In production, you'd create/update attendance entries for each date
    
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Reject leave request
 */
export async function rejectLeaveRequest(requestId, adminId, adminName, comments = '') {
  try {
    const now = Timestamp.now();
    
    await updateDoc(doc(db, 'leaveRequests', requestId), {
      status: 'rejected',
      approvedBy: adminId,
      approvedByName: adminName,
      approverComments: comments,
      respondedAt: now,
      updatedAt: now
    });
    
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Cancel leave request (Employee)
 */
export async function cancelLeaveRequest(requestId) {
  try {
    await updateDoc(doc(db, 'leaveRequests', requestId), {
      status: 'cancelled',
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
}

