import axiosInstance from "../../../utils/axiosInstance";

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL + '/attendanceStats';

// Helper function to handle API errors
const handleApiError = (error) => {
  const message = 
    error.response?.data?.message ||
    error.message ||
    'Something went wrong';
  
  return Promise.reject(message);
};

// Service methods that correspond to API endpoints
const attendanceStatsService = {
  // Student attendance data
  getMyAttendance: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/student/me`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin: Get specific student's attendance
  getStudentAttendance: async (studentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/student/${studentId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin/Teacher: Get class attendance
  getClassAttendance: async (classId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/class/${classId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin: Get classroom attendance
  getClassroomAttendance: async (classroomId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin/Teacher: Get teacher's classes attendance
  getTeacherAttendance: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin: Get overall attendance reports
  getOverallAttendance: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/reports/overall`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin: Get daily attendance reports
  getDailyAttendanceReport: async (date) => {
    try {
      const params = date ? { date } : {};
      const response = await axiosInstance.get(`${API_URL}/reports/daily`, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Admin: Get monthly attendance reports
  getMonthlyAttendanceReport: async (month, year) => {
    try {
      const params = { month, year };
      const response = await axiosInstance.get(`${API_URL}/reports/monthly`, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default attendanceStatsService;
