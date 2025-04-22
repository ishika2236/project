import axiosInstance from '../../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_API_URL; 



export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get teachers only
  getTeachers: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users/teachers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get students only
  getStudents: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;