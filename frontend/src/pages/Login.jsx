import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const from = location.state?.from?.pathname || '/';

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
          username: formValues.username,
          email: formValues.email,
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          password: formValues.password,
        });
        showSuccess('Registration successful! Signing you in...');
        await login(formValues.username, formValues.password);
        navigate(from, { replace: true });
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
      await login(formValues.username, formValues.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-grid">
        <section className="login-hero">
          <img src="/NIF.png" alt="NIF Logo" className="login-brand" />
          <div className="login-hero-copy">
            <p className="login-badge">NIF Portal</p>
            <h1>One portal for leave management.</h1>
            <p className="login-subtitle">Sign in to continue to your workspace. Manage your leave requests as a maker, checker, or approver with role-based access control.</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <span>•</span>
              <div>
                <strong>Role-based access</strong>
                <p>Maker, checker, and approver interfaces are separated clearly.</p>
              </div>
            </div>
            <div className="feature-item">
              <span>•</span>
              <div>
                <strong>Secure sign in</strong>
                <p>Connect with your username and password via backend authentication.</p>
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

          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label>Username</label>
              <input name="username" value={formValues.username} onChange={handleChange} required placeholder="Choose a username" />
            </div>

            {isRegister && (
              <>
                <div className="login-group">
                  <label>Email</label>
                  <input name="email" type="email" value={formValues.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
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
              <input type="password" name="password" value={formValues.password} onChange={handleChange} required placeholder="Enter your password" />
            </div>

            {isRegister && (
              <div className="login-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formValues.confirmPassword} onChange={handleChange} required placeholder="Repeat your password" />
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
