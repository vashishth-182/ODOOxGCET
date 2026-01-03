# Navbar Migration Guide

The navbar has been moved from individual pages to the App level. All pages that used `<Header />` should now remove those imports and components.

## Files That Need Updates

The following pages currently import and use `<Header />` and should have it removed:

1. `src/pages/EmployeeDashboard.jsx`
2. `src/pages/AdminDashboard.jsx`
3. `src/pages/Profile.jsx`
4. `src/pages/Attendance.jsx`
5. `src/pages/LeaveManagement.jsx`
6. `src/pages/Payroll.jsx`
7. `src/pages/CreateEmployee.jsx`

## Changes Needed

For each file:
1. Remove the import: `import Header from '../components/Header';`
2. Remove the `<Header />` component from the JSX

The navbar is now automatically rendered by the `Navbar` component in `App.jsx`, so it will appear on all authenticated pages automatically.

## Example

**Before:**
```jsx
import Header from '../components/Header';

export default function MyPage() {
  return (
    <div>
      <Header />
      <main>...</main>
    </div>
  );
}
```

**After:**
```jsx
export default function MyPage() {
  return (
    <div>
      <main>...</main>
    </div>
  );
}
```

