// src/contexts/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin@123'
};

// Local storage keys
const STORAGE_KEYS = {
  IS_LOGGED_IN: 'admin_is_logged_in',
  USER_DATA: 'admin_user_data'
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedLoginState = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
        const storedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (storedLoginState === 'true' && storedUserData) {
          const userData = JSON.parse(storedUserData);
          setIsLoggedIn(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function with credential validation
  const login = (email, password) => {
    setError('');
    
    // Check if credentials match admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const userData = {
        email: email,
        role: 'admin',
        name: 'Administrator'
      };
      
      setIsLoggedIn(true);
      setUser(userData);
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      toast.success('Welcome back, Administrator!');
      navigate('/');
      return { success: true };
    } else {
      const errorMessage = 'Invalid email or password. Only admin users can access this panel.';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        icon: '🚫',
      });
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setError('');
    
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Clear error function
  const clearError = () => {
    setError('');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      error, 
      isLoading,
      login, 
      logout, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};