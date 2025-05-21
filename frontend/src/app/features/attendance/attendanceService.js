
import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + '/attendance';

// Teacher Services
const openAttendanceWindow = async (classId, duration) => {
  const response = await axiosInstance.post(`${API_URL}/window/open`, { 
    classId, 
    duration 
  });
  return response.data;
};

const closeAttendanceWindow = async (classId) => {
  const response = await axiosInstance.post(`${API_URL}/window/close`, { 
    classId 
  });
  return response.data;
};

const markAttendanceManually = async (classId, studentId, status, notes) => {
  const response = await axiosInstance.post(`${API_URL}/mark/manual`, { 
    classId, 
    studentId, 
    status, 
    notes 
  });
  return response.data;
};

const bulkMarkAttendance = async (classId, attendanceData) => {
  const response = await axiosInstance.post(`${API_URL}/mark/bulk`, { 
    classId, 
    attendanceData 
  });
  return response.data;
};

const getClassAttendance = async (classId) => {
  const response = await axiosInstance.get(`${API_URL}/class/${classId}`);
  return response.data;
};

// Student Services
const markAttendanceByFaceAndLocation = async (classId, faceEmbeddingData, location) => {
  const response = await axiosInstance.post(`${API_URL}/mark`, { 
    classId, 
    faceEmbeddingData, 
    location 
  });
  return response.data;
};

const getStudentAttendance = async (courseId) => {
  const response = await axiosInstance.get(`${API_URL}/student/course/${courseId}`);
  return response.data;
};

// Common Services
const getAttendanceWindowStatus = async (classId) => {
  const response = await axiosInstance.get(`${API_URL}/window-status/${classId}`);
  return response.data;
};

// New Face Verification Service
const verifyFaceEmbedding = async (faceEmbeddingData) => {
  const response = await axiosInstance.post(`${API_URL}/verify-face`, { 
    faceEmbeddingData 
  });
  return response.data;
};

// New Location Verification Service
const checkLocationValidity = async (classId, location) => {
  const response = await axiosInstance.post(`${API_URL}/verify-location`, { 
    classId, 
    location 
  });
  return response.data;
};

const attendanceService = {
  // Teacher Services
  openAttendanceWindow,
  closeAttendanceWindow,
  markAttendanceManually,
  bulkMarkAttendance,
  getClassAttendance,
  
  // Student Services
  markAttendanceByFaceAndLocation,
  getStudentAttendance,
  
  // Common Services
  getAttendanceWindowStatus,
  
  // New Face and Location Verification Services
  verifyFaceEmbedding,
  checkLocationValidity
};

export default attendanceService;