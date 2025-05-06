import axiosInstance from '../../../utils/axiosInstance';

/**
 * Service for handling class-related API calls
 */
const API_URL = import.meta.env.VITE_API_URL;

const classService = {
  // Get all classes for a group
  getClassesByGroup: async (groupId) => {
    const response = await axiosInstance.get(`${API_URL}/classes/group/${groupId}`);
    return response.data;
  },
  
  // Get all classes for a course
  getClassesByCourse: async (courseId) => {
    const response = await axiosInstance.get(`${API_URL}/classes/course/${courseId}`);
    return response.data;
  },
  
  // Get all classes for a teacher
  getClassesByTeacher: async (teacherId) => {
    const response = await axiosInstance.get(`${API_URL}/classes/teacher/${teacherId}`);
    return response.data;
  },
  
  // Get class by ID
  getClassById: async (classId) => {
    const response = await axiosInstance.get(`${API_URL}/classes/${classId}`);
    return response.data;
  },
  
  // Create a new class
  createClass: async (classData) => {
    const response = await axiosInstance.post(`${API_URL}/classes`, classData);
    return response.data;
  },
  
  // Update an existing class
  updateClass: async (classId, classData) => {
    const response = await axiosInstance.put(`${API_URL}/classes/${classId}`, classData);
    return response.data;
  },
  
  // Delete a class
  deleteClass: async (classId) => {
    const response = await axiosInstance.delete(`${API_URL}/classes/${classId}`);
    return response.data;
  },
  
  // Add a schedule to a class (periodic class)
  addSchedule: async (classId, scheduleData) => {
    const response = await axiosInstance.post(`${API_URL}/classes/${classId}/schedule`, scheduleData);
    return response.data;
  },
  
  // Update a schedule entry
  updateSchedule: async (classId, scheduleId, scheduleData) => {
    const response = await axiosInstance.put(`${API_URL}/classes/${classId}/schedule/${scheduleId}`, scheduleData);
    return response.data;
  },
  
  // Delete a schedule entry
  deleteSchedule: async (classId, scheduleId) => {
    const response = await axiosInstance.delete(`${API_URL}/classes/${classId}/schedule/${scheduleId}`);
    return response.data;
  },
  
  // Create a session (extra class)
  createSession: async (classId, sessionData) => {
    const response = await axiosInstance.post(`${API_URL}/classes/${classId}/session`, sessionData);
    return response.data;
  },
  
  // Update a session
  updateSession: async (classId, sessionId, sessionData) => {
    const response = await axiosInstance.put(`${API_URL}/classes/${classId}/session/${sessionId}`, sessionData);
    return response.data;
  },
  
  // Delete a session
  deleteSession: async (classId, sessionId) => {
    const response = await axiosInstance.delete(`${API_URL}/classes/${classId}/session/${sessionId}`);
    return response.data;
  },
  
  // Update class location with geolocation
  updateClassLocation: async (classId, locationData) => {
    const response = await axiosInstance.put(`${API_URL}/classes/${classId}/location`, locationData);
    return response.data;
  },
  
  // Mark attendance for a session
  markAttendance: async (classId, sessionId, attendanceData) => {
    const response = await axiosInstance.post(
      `${API_URL}/classes/${classId}/session/${sessionId}/attendance`,
      attendanceData
    );
    return response.data;
  },
  
  // Get attendance for a session
  getSessionAttendance: async (classId, sessionId) => {
    const response = await axiosInstance.get(`${API_URL}/classes/${classId}/session/${sessionId}/attendance`);
    return response.data;
  },
  
  getTeacherClassrooms: async () => {
    const response = await axiosInstance.get(`${API_URL}/classes/teacher`);
    return response.data;
  }
};

export default classService;