import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + '/classes';

/**
 * Service for Class API calls
 */
const classService = {
  /**
   * Schedule a class (handles both regular and extra classes)
   * @param {Object} classData - Class scheduling data
   * @returns {Promise} - Promise with scheduled class data
   */
  scheduleClass: async (classData) => {
    const response = await axiosInstance.post(`${API_URL}/schedule`, classData);
    return response.data;
  },

  /**
   * Get all classes
   * @returns {Promise} - Promise with all classes
   */
  getAllClasses: async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  /**
   * Get a specific class by ID
   * @param {string} id - Class ID
   * @returns {Promise} - Promise with class data
   */
  getClassById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Get classes for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} [classroomId] - Optional classroom ID
   * @returns {Promise} - Promise with classes in date range
   */
  getClassesForDateRange: async (startDate, endDate, classroomId) => {
    let url = `${API_URL}/daterange?startDate=${startDate}&endDate=${endDate}`;
    if (classroomId) {
      url += `&classroomId=${classroomId}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Get classes for a specific classroom
   * @param {string} classroomId - Classroom ID
   * @returns {Promise} - Promise with classes for the classroom
   */
  getClassesByClassroom: async (input) => {
    const classroomId = typeof input === 'object' ? input.classroomId : input;
    console.log("classroomId in service: ", classroomId);
    const response = await axiosInstance.get(`${API_URL}/classroom/${classroomId}`);
    return response.data;
  },

  /**
   * Get classes for a specific classroom within a date range
   * @param {string} classroomId - Classroom ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise} - Promise with classes for the classroom within date range
   */
  getClassesByClassroomForDateRange: async (classroomId, startDate, endDate) => {
    const response = await axiosInstance.get(
      `${API_URL}/classroom/${classroomId}/daterange?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  /**
   * Reschedule a class
   * @param {string} id - Class ID
   * @param {Object} scheduleData - New schedule data
   * @returns {Promise} - Promise with updated class data
   */
  rescheduleClass: async (id, scheduleData) => {
    const response = await axiosInstance.put(`${API_URL}/${id}/schedule`, scheduleData);
    return response.data;
  },

  /**
   * Update class location
   * @param {string} id - Class ID
   * @param {Object} locationData - Updated location data
   * @returns {Promise} - Promise with updated location data
   */
  updateClassLocation: async (id, locationData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/location`, locationData);
    return response.data;
  },

  /**
   * Update class notes
   * @param {string} id - Class ID
   * @param {Object} notesData - Updated notes data
   * @returns {Promise} - Promise with updated notes data
   */
  updateClassNotes: async (id, notesData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/notes`, notesData);
    return response.data;
  },

  /**
   * Update class topics
   * @param {string} id - Class ID
   * @param {Object} topicsData - Updated topics data
   * @returns {Promise} - Promise with updated topics data
   */
  updateClassTopics: async (id, topicsData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/topics`, topicsData);
    return response.data;
  },

  /**
   * Update class special requirements
   * @param {string} id - Class ID
   * @param {Object} requirementsData - Updated requirements data
   * @returns {Promise} - Promise with updated requirements data
   */
  updateSpecialRequirements: async (id, requirementsData) => {
    const response = await axiosInstance.patch(`${API_URL}/${id}/requirements`, requirementsData);
    return response.data;
  },

  /**
   * Delete a class
   * @param {string} id - Class ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default classService;