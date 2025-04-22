import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          
          localStorage.setItem('authToken', response.data.token);
          navigate(`/${response.data.user.role}/dashboard`);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth validation error:', error);
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const register = async (formData) => {
    setLoading(true);
    try {
      formData.faceEmbedding = JSON.stringify(formData.faceEmbedding);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      navigate(`/${user.role}/dashboard`);
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      navigate(`/${user.role}/dashboard`);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

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
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
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

  const value = { user, loading, isAuthenticated, register, login, logout, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;