import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock auth for demo — replace with real Firebase Auth
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted demo user
    const savedUser = localStorage.getItem('civicsense_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    // Demo login — in production use Firebase Google Auth
    const demoUser = {
      uid: 'demo-user-001',
      email: 'citizen@example.com',
      displayName: 'Shivam Kumar',
      photoURL: null,
      xp: 340,
      level: 'Community Champion',
      reportsCount: 12,
      verifiedCount: 28,
      badges: ['First Reporter', 'Verified Hero', '10 Reports Club'],
      joinedAt: '2024-01-15',
      neighborhood: 'Sector 15, Noida'
    };
    setUser(demoUser);
    localStorage.setItem('civicsense_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const loginWithEmail = async (email, password) => {
    const demoUser = {
      uid: 'demo-user-001',
      email,
      displayName: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Citizen',
      photoURL: null,
      xp: 120,
      level: 'Active Reporter',
      reportsCount: 4,
      verifiedCount: 9,
      badges: ['First Reporter'],
      joinedAt: new Date().toISOString().split('T')[0],
      neighborhood: 'Your Neighborhood'
    };
    setUser(demoUser);
    localStorage.setItem('civicsense_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const loginAsOfficer = async () => {
    const demoAdmin = {
      uid: 'admin-001',
      email: 'officer@city.gov.in',
      displayName: 'A. Sharma (Municipal Officer)',
      role: 'admin',
      photoURL: null,
      xp: 0,
      level: 'Admin',
      reportsCount: 0,
      verifiedCount: 0,
      badges: [],
      joinedAt: '2020-05-10',
      neighborhood: 'City Headquarters'
    };
    setUser(demoAdmin);
    localStorage.setItem('civicsense_user', JSON.stringify(demoAdmin));
    return demoAdmin;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civicsense_user');
  };

  const updateUserXP = (points) => {
    if (!user) return;
    const updated = { ...user, xp: user.xp + points, reportsCount: user.reportsCount + 1 };
    setUser(updated);
    localStorage.setItem('civicsense_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, loginAsOfficer, logout, updateUserXP }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
