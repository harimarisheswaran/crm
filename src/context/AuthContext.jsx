import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROFILES } from '../data/mockData';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'edupulse_current_user_v1';

export const ROLE_DEFINITIONS = {
  super_admin: { label: 'Super Admin', badge: 'bg-purple-100 text-purple-700 border-purple-200', defaultPath: '/admin/dashboard' },
  school_admin: { label: 'School Admin', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', defaultPath: '/admin/dashboard' },
  principal: { label: 'Principal', badge: 'bg-blue-100 text-blue-700 border-blue-200', defaultPath: '/admin/dashboard' },
  teacher: { label: 'Teacher', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', defaultPath: '/teacher/dashboard' },
  accountant: { label: 'Accountant', badge: 'bg-amber-100 text-amber-700 border-amber-200', defaultPath: '/accountant/dashboard' },
  receptionist: { label: 'Receptionist', badge: 'bg-rose-100 text-rose-700 border-rose-200', defaultPath: '/receptionist/dashboard' },
  student: { label: 'Student', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200', defaultPath: '/student/dashboard' },
  parent: { label: 'Parent', badge: 'bg-teal-100 text-teal-700 border-teal-200', defaultPath: '/parent/dashboard' },
};

export const AuthProvider = ({ children }) => {
  // Current user state (defaults to School Admin for instant access, or remembers last signed in user)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to School Admin
    return INITIAL_PROFILES[1];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // Smooth realistic latency

    const matchedProfile = INITIAL_PROFILES.find(
      p => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedProfile) {
      setLoading(false);
      throw new Error('Invalid email or password. Please verify credentials or use quick demo logins.');
    }

    setUser(matchedProfile);
    setLoading(false);
    return matchedProfile;
  };

  // Quick switch role (vital for testing all 8 roles!)
  const switchRole = (roleKey) => {
    const targetUser = INITIAL_PROFILES.find(p => p.role === roleKey) || {
      id: `usr-${roleKey}`,
      email: `${roleKey}@oakridge.edu`,
      full_name: `${ROLE_DEFINITIONS[roleKey]?.label || roleKey} User`,
      role: roleKey,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
    setUser(targetUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        roleInfo: ROLE_DEFINITIONS[user?.role] || { label: 'Guest', badge: 'bg-gray-100 text-gray-700' },
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        switchRole,
        updateUserProfile,
        allDemoProfiles: INITIAL_PROFILES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

