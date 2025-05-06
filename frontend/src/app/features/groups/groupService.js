// groupService.js
import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + "/groups";

const createGroup = async (departmentId, groupData) => {
  const res = await axiosInstance.post(`${API_URL}/department/${departmentId}/create`, groupData);
  return res.data;
};

const fetchGroups = async () => {
  const res = await axiosInstance.get(`${API_URL}`);
  return res.data;
};

const fetchAllGroups = async () => {
  const res = await axiosInstance.get(`${API_URL}/all`);
  return res.data;
};

const fetchGroupsByDepartment = async (departmentId) => {
  const res = await axiosInstance.get(`${API_URL}/department/${departmentId}`);
  return res.data;
};

const assignStudentToGroup = async (groupId, studentIds) => {
  const res = await axiosInstance.post(`${API_URL}/${groupId}/assign-student`, { studentIds });
  return res.data;
};

const removeStudentFromGroup = async (groupId, studentId) => {
  const res = await axiosInstance.delete(`${API_URL}/${groupId}/remove-student`, { 
    data: { studentId } 
  });
  return res.data;
};

const assignTeacherToGroup = async (groupId, teacherId) => {
  const res = await axiosInstance.post(`${API_URL}/${groupId}/assign-teacher`, { teacherId });
  return res.data;
};

const updateGroup = async (groupId, groupData) => {
  const res = await axiosInstance.put(`${API_URL}/${groupId}`, groupData);
  return res.data;
};

const deleteGroup = async (groupId) => {
  const res = await axiosInstance.delete(`${API_URL}/${groupId}`);
  return res.data;
};

const groupService = {
  createGroup,
  assignStudentToGroup,
  removeStudentFromGroup,
  assignTeacherToGroup,
  fetchGroups,
  fetchAllGroups,
  fetchGroupsByDepartment,
  updateGroup,
  deleteGroup
};

export default groupService;