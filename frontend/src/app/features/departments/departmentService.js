import axiosInstance from '../../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_API_URL + "/departments"; 



// Department service functions
const createDepartment = async (departmentData) => {
  const response = await axiosInstance.post(
    `${API_URL}/create`,
    departmentData
  );
  return response.data;
};

const getAllDepartments = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

const getDepartmentById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

const updateDepartment = async (id, departmentData) => {
  const response = await axiosInstance.put(
    `${API_URL}/${id}`,
    departmentData
  );
  return response.data;
};

const deleteDepartment = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

const assignDepartmentHead = async (departmentId, userId) => {
  const response = await axiosInstance.post(
    `${API_URL}/${departmentId}/assign-head`,
    { userId }
  );
  return response.data;
};

const addFacultyToDepartment = async (departmentId, userIds) => {
  const response = await axiosInstance.post(
    `${API_URL}/${departmentId}/add-faculty`,
    { userIds }
  );
  return response.data;
};

const removeFacultyFromDepartment = async (departmentId, userId) => {
  const response = await axiosInstance.delete(
    `${API_URL}/${departmentId}/remove-faculty`,
    { 
     
      data: { userId }
    }
  );
  return response.data;
};

const departmentService = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  addFacultyToDepartment,
  removeFacultyFromDepartment
};

export default departmentService;