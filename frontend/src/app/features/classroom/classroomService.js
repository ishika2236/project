import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + '/classroom';

/**
 * Service for Classroom API calls
 */
const classroomService = {
  /**
   * Create a new classroom
   * @param {Object} classroomData - Classroom data
   * @returns {Promise} - Promise with created classroom data
   */
  createClassroom: async (classroomData) => {
    const response = await axiosInstance.post(API_URL, classroomData);
    return response.data;
  },

  /**
   * Get all classrooms
   * @returns {Promise} - Promise with all classrooms
   */
  getAllClassrooms: async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  /**
   * Get classrooms by department
   * @param {string} departmentId - Department ID
   * @returns {Promise} - Promise with department's classrooms
   */
  getClassroomsByDepartment: async (departmentId) => {
    const response = await axiosInstance.get(`${API_URL}/department/${departmentId}`);
    return response.data;
  },

  /**
   * Get classrooms by course
   * @param {string} courseId - Course ID
   * @returns {Promise} - Promise with course's classrooms
   */
  getClassroomsByCourse: async (courseId) => {
    const response = await axiosInstance.get(`${API_URL}/course/${courseId}`);
    return response.data;
  },

  /**
   * Get classrooms by group
   * @param {string} groupId - Group ID
   * @returns {Promise} - Promise with group's classrooms
   */
  getClassroomsByGroup: async (groupId) => {
    const response = await axiosInstance.get(`${API_URL}/group/${groupId}`);
    return response.data;
  },

  /**
   * Get classrooms by teacher
   * @param {string} teacherId - Teacher ID
   * @returns {Promise} - Promise with teacher's classrooms
   */
  getClassroomsByTeacher: async (teacherId) => {
    const response = await axiosInstance.get(`${API_URL}/teacher/${teacherId}`);
    return response.data;
  },

  /**
   * Get a specific classroom by ID
   * @param {string} id - Classroom ID
   * @returns {Promise} - Promise with classroom data
   */
  getClassroomById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Get classroom students
   * @param {string} id - Classroom ID
   * @returns {Promise} - Promise with classroom students
   */
  getClassroomStudents: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}/students`);
    return response.data;
  },

  /**
   * Update a classroom
   * @param {string} id - Classroom ID
   * @param {Object} classroomData - Updated classroom data
   * @returns {Promise} - Promise with updated classroom data
   */
  updateClassroom: async (id, classroomData) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, classroomData);
    return response.data;
  },
  getClassroomsByStudent: async (studentId) => {
    const response = await axiosInstance.get(`${API_URL}/student/${studentId}`);
    return response.data;
  },

  /**
   * Update classroom teacher
   * @param {string} id - Classroom ID
   * @param {Object} teacherData - Teacher data
   * @returns {Promise} - Promise with updated classroom data
   */
  updateTeacher: async (id, teacherData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/teacher`, teacherData);
    return response.data;
  },

  /**
   * Update classroom group
   * @param {string} id - Classroom ID
   * @param {Object} groupData - Group data
   * @returns {Promise} - Promise with updated classroom data
   */
  updateGroup: async (id, groupData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/group`, groupData);
    return response.data;
  },

  /**
   * Update classroom course
   * @param {string} id - Classroom ID
   * @param {Object} courseData - Course data
   * @returns {Promise} - Promise with updated classroom data
   */
  updateCourse: async (id, courseData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/course`, courseData);
    return response.data;
  },

  /**
   * Delete a classroom
   * @param {string} id - Classroom ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteClassroom: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Material Upload
  uploadMaterial : (classroomId, resourceData) => async (dispatch) => {
    const res = await axiosInstance.post(`${API_URL}/${classroomId}/upload-material`, resourceData);
    return res.data;
  },
  
  // Fetch Announcements
  fetchAnnouncements : (classroomId) => async () => {
    const res = await axiosInstance.get(`${API_URL}/${classroomId}/announcements`);
    // console.log(res.data);
    return res.data.announcements;
  },
  
  // Edit Announcement
  editAnnouncement : (classroomId, announcementId, message) => async () => {
    const res = await axiosInstance.put(`${API_URL}/${classroomId}/announcement/${announcementId}`, { message });
    return res.data;
  },
  
  // Delete Announcement
 deleteAnnouncement : (classroomId, announcementId) => async () => {
    const res = await axiosInstance.delete(`${API_URL}/${classroomId}/announcement/${announcementId}`);
    return res.data;
  },
  
  // Post Announcement
  postAnnouncement : (classroomId, message) => async () => {
    const res = await axiosInstance.post(`${API_URL}/${classroomId}/announcement`, { message });
    return res.data;
  },
  deleteMaterial : (classroomId, resourceId) => async () => {
    const res = await axiosInstance.delete(`${API_URL}/${classroomId}/delete-material/${resourceId}`);
    return res.data;
  },
};

export default classroomService;