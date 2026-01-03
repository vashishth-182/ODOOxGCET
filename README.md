# Dayflow HRMS

**Tagline**: Every workday, perfectly aligned.

A comprehensive Human Resource Management System built with React, Firebase, and Tailwind CSS.

## Features

- 🔐 Secure authentication with role-based access
- 👥 Employee profile management
- 📅 Real-time attendance tracking with check-in/check-out
- ✈️ Leave management with approval workflows
- 💰 Automatic salary calculations
- 📊 Comprehensive dashboards for Admin and Employees

## Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Dates**: date-fns

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/config/firebase.js`

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Default Credentials

### Admin Account
- Email: admin@dayflow.com
- Password: Welcome@123

### Employee Account
- Email: john.doe@dayflow.com
- Password: Welcome@123

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── contexts/       # React contexts (Auth)
├── hooks/          # Custom React hooks
├── services/       # Firebase services
├── utils/          # Utility functions
├── config/         # Configuration files
└── App.jsx         # Main app component
```

## License

MIT
