// groupService.js
import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + "/groups" ;

const createGroup = async (courseId, groupData) => {
  const res = await axiosInstance.post(`${API_URL}/courses/${courseId}/groups/create`, groupData);
  return res.data;
};

const fetchGroups = async () => {
  const res = await axiosInstance.get(`${API_URL}`);
  console.log("res in data: ", res.data);
  return res.data;
};

const fetchGroupsByCourse = async (courseId) => {
  const res = await axiosInstance.get(`${API_URL}/courses/${courseId}/groups`);
  return res.data;
};

const assignStudentToGroup = async (groupId, studentIds) => {
  const res = await axiosInstance.post(`${API_URL}/${groupId}/assign`, { studentIds });
  return res.data;
};

const removeStudentFromGroup = async (groupId, studentId) => {
  const res = await axiosInstance.delete(`${API_URL}/${groupId}/remove`, { 
    data: { studentId } 
  });
  return res.data;
};

const assignTeacherToGroup = async (groupId, teacherId) => {
  const res = await axiosInstance.post(`${API_URL}/${groupId}/assignTeacher`, { teacherId });
  return res.data;
};

const fetchGroupMaterials = async (groupId) => {
  const res = await axiosInstance.get(`${API_URL}/${groupId}/materials`);
  return res.data;
};

const fetchGroupClasses = async (groupId) => {
  const res = await axiosInstance.get(`${API_URL}/${groupId}/classes`);
  return res.data;
};

const groupService = {
  createGroup,
  assignStudentToGroup,
  removeStudentFromGroup,
  assignTeacherToGroup,
  fetchGroupMaterials,
  fetchGroupClasses,
  fetchGroupsByCourse,
  fetchGroups
};

export default groupService;