import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing user session in localStorage
    const savedUser = localStorage.getItem('drogo_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('drogo_user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Initialize Google Sign-In
      if (!window.google) {
        throw new Error('Google Sign-In not loaded');
      }

      // Mock Google sign-in for demo purposes
      // In production, replace with actual Google OAuth implementation
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Chintan Dedhia',
        email: 'chintan@example.com',
        photoURL: 'https://ui-avatars.com/api/?name=Chintan+Dedhia&background=00D67F&color=fff',
        provider: 'google',
        createdAt: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('drogo_user', JSON.stringify(mockUser));
      setShowAuthModal(false);
      
      toast.success(`Welcome, ${mockUser.name}! 🎉`);
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      
      // Mock email sign-in for demo purposes
      // In production, replace with actual authentication
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockUser = {
        id: 'email_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00D67F&color=fff`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('drogo_user', JSON.stringify(mockUser));
      setShowAuthModal(false);
      
      toast.success(`Welcome back, ${mockUser.name}! 🎉`);
      
    } catch (error) {
      console.error('Email sign-in error:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    try {
      setLoading(true);
      
      // Mock sign-up for demo purposes
      // In production, replace with actual user registration
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      const newUser = {
        id: 'signup_' + Date.now(),
        name: name,
        email: email,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=00D67F&color=fff`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('drogo_user', JSON.stringify(newUser));
      setShowAuthModal(false);
      
      toast.success(`Account created successfully! Welcome, ${newUser.name}! 🎉`);
      
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('drogo_user');
      
      // Also clear cart and location data
      localStorage.removeItem('drogo_cart');
      localStorage.removeItem('drogo_location');
      
      toast.success('Signed out successfully! 👋');
      
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const value = {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
