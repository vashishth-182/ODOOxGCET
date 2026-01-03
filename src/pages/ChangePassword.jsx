import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../services/authService';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const validatePassword = (password) => {
    const errors = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.special = 'Password must contain at least one special character';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate password strength
    const errors = validatePassword(newPassword);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await changePassword(newPassword);
      alert('Password changed successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { key: 'length', label: 'At least 8 characters', met: newPassword.length >= 8 },
    { key: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { key: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { key: 'number', label: 'One number', met: /[0-9]/.test(newPassword) },
    { key: 'special', label: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
  ];

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card p-8 md:p-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-soft-md">
              <Lock className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Change Password</h2>
            <p className="text-neutral-600">
              Welcome, <span className="font-medium text-neutral-900">{user?.firstName}</span>! Please set a new password to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-light border border-danger/20 rounded-xl flex items-start space-x-3 animate-fade-in" role="alert">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-danger-dark flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="currentPassword" className="label">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input"
                placeholder="Welcome@123"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setValidationErrors({});
                }}
                required
                autoComplete="new-password"
                className="input"
                placeholder="Enter new password"
              />
              {newPassword && (
                <div className="mt-3 space-y-2">
                  {requirements.map((req) => (
                    <div key={req.key} className="flex items-center space-x-2 text-sm">
                      {req.met ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300 flex-shrink-0" aria-hidden="true"></div>
                      )}
                      <span className={req.met ? 'text-success-dark' : 'text-neutral-500'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="input"
                placeholder="Confirm new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-2 text-sm text-danger">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary text-base py-3 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Changing Password...</span>
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
