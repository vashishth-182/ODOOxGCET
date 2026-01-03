import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signIn } from '../services/authService';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.isFirstLogin) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await signIn(email, password);
      
      if (userData.isFirstLogin) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Welcome Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 mb-6 shadow-lg shadow-primary-500/30 animate-float">
            <span className="text-3xl font-bold text-white drop-shadow-sm">D</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent mb-3 tracking-tight">
            Dayflow
          </h1>
          <p className="text-neutral-600 text-lg font-medium">
            Every workday, perfectly aligned
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8 md:p-10 animate-slide-up border-0 shadow-soft-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Welcome back
            </h2>
            <p className="text-neutral-600">
              Sign in to continue to your workspace
            </p>
          </div>

          {error && (
            <div 
              className="mb-6 p-4 bg-danger-light border border-danger/20 rounded-xl flex items-start space-x-3 animate-fade-in"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-danger-dark flex-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input"
                placeholder="you@company.com"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input"
                placeholder="Enter your password"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary text-base py-3 mt-6"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  <span>Sign In</span>
                </span>
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center leading-relaxed">
              <span className="font-medium">Demo credentials:</span>
              <br />
              admin@dayflow.com / Welcome@123
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-xs text-neutral-500">
            Secure • Reliable • Built for your team
          </p>
        </div>
      </div>
    </div>
  );
}
