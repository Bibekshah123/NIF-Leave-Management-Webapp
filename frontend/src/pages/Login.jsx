import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const from = location.state?.from?.pathname || '/';
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  useEffect(() => {
    const justLoggedOut = localStorage.getItem('justLoggedOut');
    if (justLoggedOut) {
      localStorage.removeItem('justLoggedOut');
      setShowLogoutSuccess(true);
      setTimeout(() => setShowLogoutSuccess(false), 4000);
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isRegister) {
      if (formValues.password !== formValues.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      try {
        await authService.register({
          email: formValues.email,
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          password: formValues.password,
        });
        const profile = await login(formValues.email, formValues.password);
        localStorage.setItem('justLoggedIn', 'true');
        showSuccess('Registration successful! Signing you in...');
        
        const redirectTo = profile.role === 'approver' || profile.role === 'admin' ? '/leave' : from;
        navigate(redirectTo, { replace: true });
      } catch (err) {
        const detail = err?.response?.data || err?.response?.data?.detail;
        const message = typeof detail === 'string'
          ? detail
          : Object.values(detail || {}).flat().join(' ');
        setError(message || err.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const profile = await login(formValues.email, formValues.password);
      localStorage.setItem('justLoggedIn', 'true');
      showSuccess('Login successful! Redirecting...');
      
      const redirectTo = profile.role === 'approver' || profile.role === 'admin' ? '/leave' : from;
      setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      {showLogoutSuccess && (
        <div className="toast-notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Logged out successfully!</span>
        </div>
      )}
      {(error || successMessage) && (
        <div className="popup-overlay" onClick={() => { setError(null); setSuccessMessage(''); }}>
          <div className="popup-modal" onClick={e => e.stopPropagation()}>
            {error && (
              <>
                <div className="popup-icon popup-error-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <h3>Login Failed</h3>
                <p>{error}</p>
              </>
            )}
            {successMessage && (
              <>
                <div className="popup-icon popup-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3>Welcome!</h3>
                <p>{successMessage}</p>
              </>
            )}
            <button className="popup-btn" onClick={() => { setError(null); setSuccessMessage(''); }}>OK</button>
          </div>
        </div>
      )}

      <div className="login-grid">
        <section className="login-hero">
          <img src="/NIF.png" alt="NIF Logo" className="login-brand" />
          <div className="login-hero-copy">
            <p className="login-badge">Nepal Internet Foundation</p>
            <h1> NIF Leave Management</h1>
            <p className="login-subtitle">Sign in to continue </p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <span>•</span>
              <div>
                <strong>Role-based access</strong>
                <p>Maker and approver interfaces are separated clearly.</p>
              </div>
            </div>
            <div className="feature-item">
              <span>•</span>
              <div>
                <strong>Secure sign in</strong>
                <p>Connect with your email and password via backend authentication.</p>
              </div>
            </div>
            <div className="feature-item">
              <span>•</span>
              <div>
                <strong>Unified leave management</strong>
                <p>Apply, review, and approve leave requests from one portal.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <div>
              <div className="login-eyebrow">Welcome back</div>
              <h2>{isRegister ? 'Create a new account' : 'Sign in to continue'}</h2>
            </div>
            <div className="login-status">Role friendly, secure access</div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label>Email</label>
              <input name="email" type="email" value={formValues.email} onChange={handleChange} required placeholder="Enter your email" />
            </div>

            {isRegister && (
              <>
                <div className="login-group">
                  <label>First name</label>
                  <input name="first_name" value={formValues.first_name} onChange={handleChange} placeholder="First name" />
                </div>
                <div className="login-group">
                  <label>Last name</label>
                  <input name="last_name" value={formValues.last_name} onChange={handleChange} placeholder="Last name" />
                </div>
              </>
            )}

            <div className="login-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formValues.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your password" 
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="login-group">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword" 
                    value={formValues.confirmPassword} 
                    onChange={handleChange} 
                    required 
                    placeholder="Repeat your password" 
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Register' : 'Sign In')}
            </button>
          </form>

          <div className="login-help">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button type="button" className="login-toggle" onClick={() => { setIsRegister(false); setError(null); setSuccessMessage(''); }}>
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Need an account?{' '}
                <button type="button" className="login-toggle" onClick={() => { setIsRegister(true); setError(null); setSuccessMessage(''); }}>
                  Register now
                </button>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
