/**
 * Seed data script for Firebase Firestore
 * Run this in browser console after Firebase is set up
 */

import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { calculateSalary } from './salaryCalculation';

export async function seedDatabase() {
  try {
    // Create Admin User
    const adminEmail = 'admin@dayflow.com';
    const adminPassword = 'Welcome@123';
    
    let adminUser;
    try {
      adminUser = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists');
        return;
      }
      throw error;
    }

    const adminData = {
      employeeId: 'OIADMI20220001',
      email: adminEmail,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+91-9999999999',
      address: 'Company Headquarters',
      designation: 'HR Manager',
      department: 'HR',
      employeeType: 'Full-time',
      joiningDate: '2022-01-01',
      workLocation: 'Main Office',
      isActive: true,
      currentStatus: 'present',
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: adminUser.user.uid
    };

    await setDoc(doc(db, 'users', adminUser.user.uid), adminData);

    // Create System Config
    await setDoc(doc(db, 'system', 'config'), {
      employeeIdConfig: {
        companyCode: 'OI',
        currentYear: 2024,
        lastSerialNumber: 5
      },
      leaveQuotas: {
        paidLeave: 12,
        sickLeave: 6,
        unpaidLeave: -1
      },
      salaryConfig: {
        minimumWage: 18000,
        pfRate: 12,
        professionalTax: 200
      }
    });

    // Sample Employees
    const employees = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@dayflow.com',
        designation: 'Software Engineer',
        department: 'Engineering',
        monthlyWage: 50000
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@dayflow.com',
        designation: 'Product Manager',
        department: 'Product',
        monthlyWage: 60000
      },
      {
        firstName: 'Sarah',
        lastName: 'Lee',
        email: 'sarah.lee@dayflow.com',
        designation: 'Designer',
        department: 'Design',
        monthlyWage: 45000
      }
    ];

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const employeeId = `OIJODO${2022}${String(i + 2).padStart(4, '0')}`;
      
      let userCred;
      try {
        userCred = await createUserWithEmailAndPassword(auth, emp.email, adminPassword);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`Employee ${emp.email} already exists`);
          continue;
        }
        throw error;
      }

      const empData = {
        employeeId,
        email: emp.email,
        role: 'employee',
        firstName: emp.firstName,
        lastName: emp.lastName,
        phone: '',
        address: '',
        designation: emp.designation,
        department: emp.department,
        employeeType: 'Full-time',
        joiningDate: '2022-01-15',
        workLocation: 'Main Office',
        isActive: true,
        currentStatus: 'absent',
        isFirstLogin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: adminUser.user.uid
      };

      await setDoc(doc(db, 'users', userCred.user.uid), empData);

      // Create salary record
      const salary = calculateSalary(emp.monthlyWage);
      await setDoc(doc(db, 'salary', userCred.user.uid), {
        ...salary,
        effectiveFrom: '2022-01-15',
        lastUpdatedBy: adminUser.user.uid,
        updatedAt: new Date().toISOString()
      });
    }

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

