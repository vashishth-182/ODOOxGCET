import { collection, getDocs, doc, getDoc, updateDoc, setDoc, query, where, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Get all employees (Admin)
 */
export async function getAllEmployees() {
  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', 'employee'));
    const userDocs = await getDocs(usersQuery);
    
    const employees = [];
    userDocs.forEach(doc => {
      employees.push({ id: doc.id, ...doc.data() });
    });
    
    return employees;
  } catch (error) {
    throw error;
  }
}

/**
 * Get employee by ID
 */
export async function getEmployee(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    throw error;
  }
}

/**
 * Update employee profile
 */
export async function updateEmployee(userId, updateData) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user's salary information
 */
export async function getSalaryInfo(userId) {
  try {
    const salaryDoc = await getDoc(doc(db, 'salary', userId));
    if (!salaryDoc.exists()) return null;
    
    return { id: salaryDoc.id, ...salaryDoc.data() };
  } catch (error) {
    throw error;
  }
}

/**
 * Update salary information (Admin)
 */
export async function updateSalary(userId, salaryData) {
  try {
    await setDoc(doc(db, 'salary', userId), {
      ...salaryData,
      lastUpdatedBy: auth.currentUser.uid,
      updatedAt: Timestamp.now()
    }, { merge: true });
    
    return true;
  } catch (error) {
    throw error;
  }
}

