import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { generateEmployeeId } from '../utils/employeeId';

/**
 * Sign in user
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    const userData = { id: user.uid, ...userDoc.data() };
    return userData;
  } catch (error) {
    throw error;
  }
}

/**
 * Create new employee (Admin only)
 */
export async function createEmployee(employeeData, adminId) {
  try {
    // Generate employee ID
    const joiningYear = new Date(employeeData.joiningDate).getFullYear();
    
    // Get current serial number for the year
    const configDoc = await getDoc(doc(db, 'system', 'config'));
    const config = configDoc.exists() ? configDoc.data() : { employeeIdConfig: { currentYear: joiningYear, lastSerialNumber: 0 } };
    
    const currentYear = config.employeeIdConfig?.currentYear || joiningYear;
    let serialNumber = 1;
    
    if (currentYear === joiningYear) {
      serialNumber = (config.employeeIdConfig?.lastSerialNumber || 0) + 1;
    }
    
    const employeeId = generateEmployeeId(
      employeeData.firstName,
      employeeData.lastName,
      employeeData.joiningDate,
      serialNumber
    );
    
    // Create auth user with default password
    const defaultPassword = 'Welcome@123';
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      employeeData.email,
      defaultPassword
    );
    
    const newUser = userCredential.user;
    
    // Create user document in Firestore
    const userDoc = {
      employeeId,
      email: employeeData.email,
      role: 'employee',
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      phone: employeeData.phone || '',
      address: employeeData.address || '',
      designation: employeeData.designation || '',
      department: employeeData.department || '',
      employeeType: employeeData.employeeType || 'Full-time',
      joiningDate: employeeData.joiningDate,
      reportingManager: employeeData.reportingManager || null,
      workLocation: employeeData.workLocation || '',
      isActive: true,
      currentStatus: 'absent',
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: adminId
    };
    
    await setDoc(doc(db, 'users', newUser.uid), userDoc);
    
    // Update config with new serial number
    await setDoc(doc(db, 'system', 'config'), {
      employeeIdConfig: {
        currentYear: joiningYear,
        lastSerialNumber: serialNumber
      }
    }, { merge: true });
    
    return { ...userDoc, id: newUser.uid };
  } catch (error) {
    throw error;
  }
}

/**
 * Change password
 */
export async function changePassword(newPassword) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    await updatePassword(user, newPassword);
    
    // Update isFirstLogin flag
    await setDoc(doc(db, 'users', user.uid), {
      isFirstLogin: false
    }, { merge: true });
    
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out
 */
export async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Get current user data
 */
export async function getCurrentUserData() {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;
    
    return { id: user.uid, ...userDoc.data() };
  } catch (error) {
    throw error;
  }
}

