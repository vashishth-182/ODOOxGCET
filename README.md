# 🚀 Dayflow Human Resource Management System

**Every workday, perfectly aligned.**

Dayflow is a modern **Human Resource Management System (HRMS)** designed to simplify employee management, attendance tracking, leave workflows, and payroll operations through a clean and user-friendly interface.

Built using **React**, **Firebase**, and **Tailwind CSS**, Dayflow focuses on performance, security, and real-time data handling.

---

## ✨ Features

- 🔐 Secure authentication with role-based access (Admin & Employee)
- 👥 Employee profile management
- 📅 Real-time attendance tracking (check-in / check-out)
- ✈️ Leave management with approval workflow
- 💰 Automatic salary calculation
- 📊 Separate dashboards for Admin and Employees

---

## 🛠 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Lucide React (Icons)

### Backend & Services
- Firebase Authentication
- Firebase Firestore (NoSQL Database)

### Utilities
- React Hook Form + Zod (Form handling & validation)
- date-fns (Date utilities)

---

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── contexts/       # Global state (Auth context)
├── hooks/          # Custom React hooks
├── services/       # Firebase service logic
├── utils/          # Helper utilities
├── config/         # Configuration files
└── App.jsx         # Root component
```

---

## ⚙️ Getting Started

### 1️⃣ Install Dependencies
```bash
npm install
```

---

### 2️⃣ Firebase Setup

1. Create a Firebase project  
   👉 https://console.firebase.google.com

2. Enable the following:
   - Authentication → Email/Password
   - Firestore Database

3. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Firebase configuration is handled in:
```
src/config/firebase.js
```

⚠️ Make sure `.env` is added to `.gitignore`.

---

### 3️⃣ Run Development Server
```bash
npm run dev
```

Open in browser:
```
http://localhost:3000
```

---

## 🔑 Default Credentials

> ⚠️ These users must exist in Firebase Authentication and Firestore.

### Admin Account
- Email: `admin@dayflow.com`
- Password: `Welcome@123`

### Employee Account
- Email: `jhondow123@dayflow.com`
- Password: `JhonDoe_123`

---

## 🔐 Authentication & Authorization

- Firebase Authentication handles login security
- Firestore stores user profile and role data
- Role-based routing protects admin-only pages
- Unauthorized access is restricted automatically

---

## 🚧 Future Enhancements

- 📈 Advanced analytics & reporting
- 🔔 Notification system
- 🌙 Dark mode support
- 🕒 Shift & overtime tracking
- 📄 Payroll and attendance export

---

## 🎬 Demo Video

Watch the complete demo of the project showcasing core features, UI flow, and functionality.

👉 [Watch Demo on YouTube](https://youtu.be/EMq1Jm8WJck)

---

⭐ If you like this project, give it a star on GitHub!

---
