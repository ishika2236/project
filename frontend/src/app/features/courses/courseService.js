// courseService.js
import axiosInstance from "../../../utils/axiosInstance";
const API_URL = import.meta.env.VITE_API_URL + "/courses"; 

const createCourse = async (courseData) => {
  const res = await axiosInstance.post(`${API_URL}/create`, courseData);
  return res.data;
};

const getAdminCourses = async () => {
  const res = await axiosInstance.get(`${API_URL}/admin/courses`);
  return res.data;
};

const getTeacherCourses = async () => {
 
  const res = await axiosInstance.get(`${API_URL}/teacher/courses`);
  console.log(res.data);
  return res.data;
};

const getStudentCourses = async () => {
  const res = await axiosInstance.get(`${API_URL}/student/courses`);
  return res.data;
};

const getCourseById = async (courseId) => {
  const res = await axiosInstance.get(`${API_URL}/${courseId}`);
  return res.data;
};

const assignCoordinator = async (courseId, coordinatorId) => {
  const res = await axiosInstance.patch(`${API_URL}/${courseId}/assign-coordinator`, {
    coordinatorId,
  });
  return res.data;
};

const enrollInCourse = async (courseId, studentId) => {
  const res = await axiosInstance.post(`${API_URL}/${courseId}/enroll`, {
    studentId,
  });
  return res.data;
};

const updateCourse = async (courseId, courseData) => {
  const res = await axiosInstance.put(`${API_URL}/${courseId}`, courseData);
  return res.data;
};

const deleteCourse = async (courseId) => {
  const res = await axiosInstance.delete(`${API_URL}/${courseId}`);
  return res.data;
};

// Add missing function to match backend
const getCoursesByDepartment = async (departmentId) => {
  const res = await axiosInstance.get(`${API_URL}/department/${departmentId}`);
  return res.data;
};
const assignTeacherToCourse  = async( courseId, teacherId, groupId ) => {
    const response = await axiosInstance.post(`${API_URL}/${courseId}/assign-teacher`, {
      teacherId,
      groupId
    });
    return response.data;
  
}
const courseService = {
  createCourse,
  getAdminCourses,
  getTeacherCourses,
  getStudentCourses,
  getCourseById,
  assignCoordinator,
  enrollInCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
  assignTeacherToCourse
};

export default courseService;