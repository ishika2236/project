import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth validation error:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Register new user
  // Register new user
const register = async (formData) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Handle primitive values and files directly
      for (const key in formData) {
        // Skip null or undefined values
        if (formData[key] === null || formData[key] === undefined) continue;
        
        // Handle files
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
          continue;
        }
        
        // Handle objects (like addresses)
        if (typeof formData[key] === 'object' && !(formData[key] instanceof File)) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          // Handle primitive values
          formDataToSend.append(key, formData[key]);
        }
      }
      
      // Log for debugging
      console.log("Form data entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Important: When sending FormData, don't set Content-Type header
      // Axios will automatically set the correct boundary
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        formDataToSend,
        {
          headers: {
            // Let browser set the content type with proper boundary
            // 'Content-Type': 'multipart/form-data' - DON'T SET THIS
          }
        }
      );const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        credentials
      );
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      
      Object.keys(updateData).forEach(key => {
        if (typeof updateData[key] === 'object' && updateData[key] !== null && !(updateData[key] instanceof File)) {
          formDataToSend.append(key, JSON.stringify(updateData[key]));
        } else {
          formDataToSend.append(key, updateData[key]);
        }
      });
      
      if (updateData.profileImage) {
        formDataToSend.append('profileImage', updateData.profileImage);
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  };

  // Auth validation helper
  const validateField = (field, value) => {
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else if (field === 'password') {
      return value.length >= 6;
    } else if (field === 'confirmPassword') {
      return value === document.querySelector('input[name="password"]').value;
    }
    return true;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    validateField
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;