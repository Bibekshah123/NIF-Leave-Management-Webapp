import { useState, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('maker'); // maker, checker, approver
  const [user, setUser] = useState({
    name: 'Bikash Khatri',
    title: 'Program Director',
    initials: 'RB',
    color: '#10B981'
  });

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'maker') {
      setUser({ name: 'Bikash Kadayat', title: 'IT Assistant', initials: 'BK', color: '#10B981' });
    } else if (newRole === 'checker') {
      setUser({ name: 'Bikash Khatri', title: 'Program Director', initials: 'BK', color: '#F59E0B' });
    } else if (newRole === 'approver') {
      setUser({ name: 'Bikram Shrestha', title: 'President', initials: 'BS', color: '#DC143C' });
    }
  };

  return (
    <AuthContext.Provider value={{ role, user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
