// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Start in a loading state
  const navigate = useNavigate();

  // This listener is the core of the fix. It checks the REAL Firebase auth state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the Firebase user object
      setIsLoading(false); // Auth check is complete, stop loading
    });
    // Cleanup on unmount
    return unsubscribe;
  }, []);

  // NEW login function using Firebase
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back, Administrator!');
      navigate('/');
      return { success: true };
    } catch (error) {
      console.error("Firebase Login Error:", error.code);
      const errorMessage = 'Invalid email or password.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // NEW logout function using Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error("Firebase Logout Error:", error);
      toast.error('Failed to log out.');
    }
  };

const clearError = () => {
    setError(null);
     setError(null);
  };

  const value = {
    currentUser,
    isLoggedIn: !!currentUser, // isLoggedIn is true if currentUser is not null
    isLoading,
    login,
    logout,
     clearError 
  };

  // While checking auth state, don't render the app. This prevents permission errors.
  if (isLoading) {
    return <div>Loading Authentication...</div>; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};