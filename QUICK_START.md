# Dayflow HRMS - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Copy your config to `src/config/firebase.js`

### 3. Set Up Initial Data

**Option A: Using Firebase Console (Recommended)**

1. Go to Authentication → Add user:
   - Email: `admin@dayflow.com`
   - Password: `Welcome@123`

2. Go to Firestore → Create document:
   - Collection: `users`
   - Document ID: (copy from Authentication UID)
   - Fields:
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
     workLocation: "Main Office"
     isActive: true
     currentStatus: "present"
     isFirstLogin: true
     createdAt: (timestamp)
     updatedAt: (timestamp)
     ```

3. Create system config:
   - Collection: `system`
   - Document ID: `config`
   - Fields:
     ```
     employeeIdConfig: {
       companyCode: "OI"
       currentYear: 2024
       lastSerialNumber: 0
     }
     ```

**Option B: Using Browser Console**

After logging in as admin, open browser console and run:
```javascript
// This would require importing seedData utility
// Better to use Option A for first setup
```

### 4. Run the App
```bash
npm run dev
```

Visit http://localhost:3000

## 📝 Default Login

- **Email**: admin@dayflow.com
- **Password**: Welcome@123

**Note**: You'll be prompted to change password on first login.

## ✨ Key Features

### Employee Features
- ✅ View own profile
- ✅ Edit personal information (phone, address)
- ✅ Check-in/Check-out daily
- ✅ View attendance calendar
- ✅ Apply for leave
- ✅ View own salary (read-only)

### Admin Features
- ✅ Create new employees
- ✅ View all employee profiles
- ✅ Edit any employee details
- ✅ View all attendance records
- ✅ Approve/reject leave requests
- ✅ Manage salary structures
- ✅ Auto-generate employee IDs

## 🆔 Employee ID Format

Employee IDs are auto-generated: `OI[XX][YYYY][NNNN]`

- **OI**: Company code (Odoo India)
- **XX**: First 2 letters of first name + first 2 letters of last name
- **YYYY**: Year of joining
- **NNNN**: Serial number (4 digits)

Example: `OIJODO20220001` for John Doe joining in 2022

## 💰 Salary Calculation

Salary components are automatically calculated from monthly wage:

- **Basic**: 50% of wage
- **HRA**: 50% of basic
- **Standard Allowance**: ₹4,167 (fixed)
- **Performance Bonus**: 8.33% of wage
- **LTA**: 8.33% of wage
- **Fixed Allowance**: Auto-calculated to balance total

**Deductions:**
- **PF**: 12% of gross
- **Professional Tax**: ₹200 (fixed)

## 📁 Project Structure

```
src/
├── components/       # Reusable components (Header, CheckInOutButton)
├── pages/           # Page components (Dashboard, Profile, etc.)
├── contexts/        # React contexts (AuthContext)
├── services/        # Firebase service functions
├── utils/           # Utility functions
├── config/          # Configuration (Firebase)
└── App.jsx          # Main app component
```

## 🔒 Security Rules

Update Firestore security rules in Firebase Console (see SETUP.md for details).

## 🐛 Troubleshooting

### Can't login?
- Verify Firebase config is correct
- Check if user exists in Firestore (not just Authentication)
- Ensure `role` field exists in user document

### Employee ID not generating?
- Check `system/config` document exists
- Verify `employeeIdConfig` structure is correct
- Check joining date format (YYYY-MM-DD)

### Salary not calculating?
- Ensure monthly wage is a valid number
- Check Firestore permissions
- Verify salary document structure

## 📚 Next Steps

1. Create employees via Admin dashboard
2. Set up attendance check-in/out
3. Configure leave quotas
4. Customize salary components (if needed)

## 🆘 Support

For issues or questions:
1. Check browser console for errors
2. Verify Firebase configuration
3. Review Firestore security rules
4. Check SETUP.md for detailed instructions

