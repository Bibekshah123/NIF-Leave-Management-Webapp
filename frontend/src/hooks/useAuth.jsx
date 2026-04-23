import { useState, createContext, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const buildUiUser = (profile) => {
  const name = profile.full_name || profile.email?.split('@')[0] || 'User';
  const initials = name
    .split(' ')
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorMap = {
    maker: '#10B981',
    approver: '#DC143C',
    admin: '#2563EB',
  };

  return {
    username: profile.username,
    email: profile.email,
    full_name: name,
    name,
    title: profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User',
    initials: initials || profile.email?.slice(0, 2).toUpperCase() || 'U',
    color: colorMap[profile.role] || '#6B7280',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.me();
      const uiUser = buildUiUser(response.data);
      setUser(uiUser);
      setRole(response.data.role);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      const profile = await authService.me();
      const uiUser = buildUiUser(profile.data);
      setUser(uiUser);
      setRole(profile.data.role);
      setIsAuthenticated(true);
      return profile.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // eslint-disable-line react-refresh/only-export-components
