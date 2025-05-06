// authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

// Register user
const register = async (userData) => {
  // Prepare FormData
  let dataToSend;
  if (userData instanceof FormData) {
    dataToSend = userData;
  } else {
    dataToSend = new FormData();
    Object.keys(userData).forEach(key => {
      if (typeof userData[key] === 'object' && userData[key] !== null && !(userData[key] instanceof File)) {
        dataToSend.append(key, JSON.stringify(userData[key]));
      } else {
        dataToSend.append(key, userData[key]);
      }
    });
  }

  const response = await axios.post(`${API_URL}/auth/signup`, dataToSend);

  if (response.data) {
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user }; // ✅ return consistent object
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);

  if (response.data) {
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    
    return { token, user }; 
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) return null;

  
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data.user);

    
    return response.data;
  } catch (error) {
    logout();
    return null;
  }
};
const getDepartments = async() => {
    try {
      const response = await axios.get(`${API_URL}/auth/departments`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('error occured in fetching departments', error);
      return null;
    }
}

// Update user profile
const updateProfile = async (userData) => {
  const token = localStorage.getItem('authToken');
  
  let dataToSend;
  if (userData instanceof FormData) {
    dataToSend = userData;
  } else {
    dataToSend = new FormData();
    Object.keys(userData).forEach(key => {
      if (typeof userData[key] === 'object' && userData[key] !== null && !(userData[key] instanceof File)) {
        dataToSend.append(key, JSON.stringify(userData[key]));
      } else {
        dataToSend.append(key, userData[key]);
      }
    });
  }

  const response = await axios.put(`${API_URL}/users/profile`, dataToSend, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  
  if (response.data && response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Validate field (util function for form validation)
const validateField = (field, value, formData = {}) => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    
    case 'password':
      return value.length >= 6;
      
    case 'confirmPassword':
      return value === formData.password;
      
    default:
      return true;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  validateField,
  getDepartments
};

export default authService;