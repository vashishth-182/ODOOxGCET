# Dayflow HRMS Setup Guide

## Prerequisites

- Node.js 18+ installed
- Firebase project created

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (or configure security rules)
   - Choose a location

5. Get Firebase Config:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click web icon (</>)
   - Copy the config object

6. Update `src/config/firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

## Step 3: Firestore Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         request.auth.uid == userId);
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Leave requests
    match /leaveRequests/{leaveId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         resource.data.userId == request.auth.uid);
    }
    
    // Salary collection
    match /salary/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // System config
    match /system/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 4: Create Seed Data

After setting up Firebase, you can create the admin user manually:

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: `admin@dayflow.com`
4. Password: `Welcome@123`
5. Note the User UID

6. Go to Firestore Database
7. Create a document in `users` collection with the UID:
   ```
   employeeId: "OIADMI20220001"
   email: "admin@dayflow.com"
   role: "admin"
   firstName: "Admin"
   lastName: "User"
   designation: "HR Manager"
   department: "HR"
   employeeType: "Full-time"
   joiningDate: "2022-01-01"
   isActive: true
   currentStatus: "present"
   isFirstLogin: true
   ```

8. Create `system/config` document:
   ```
   employeeIdConfig: {
     companyCode: "OI"
     currentYear: 2024
     lastSerialNumber: 0
   }
   ```

## Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 6: First Login

1. Login with:
   - Email: `admin@dayflow.com`
   - Password: `Welcome@123`

2. Change password on first login

3. Create employees using the "Add Employee" button

## Default Credentials

- **Admin**: admin@dayflow.com / Welcome@123
- All employees created will have default password: `Welcome@123`

## Troubleshooting

### Firebase connection errors
- Verify Firebase config in `src/config/firebase.js`
- Check browser console for detailed error messages
- Ensure Firestore is enabled in Firebase Console

### Authentication errors
- Verify Email/Password provider is enabled
- Check Firestore security rules
- Ensure user document exists in Firestore

### Permission errors
- Review Firestore security rules
- Ensure user has correct role in Firestore document

## Production Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy to Vercel/Netlify:
   - Connect your repository
   - Set environment variables if needed
   - Deploy

3. Update Firebase config for production domain in Firebase Console

