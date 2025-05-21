import { createAsyncThunk } from '@reduxjs/toolkit';
import classroomService from './classroomService';

// Create classroom
export const createClassroom = createAsyncThunk(
  'classrooms/create',
  async (classroomData, thunkAPI) => {
    try {
      return await classroomService.createClassroom(classroomData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all classrooms
export const getAllClassrooms = createAsyncThunk(
  'classrooms/getAll',
  async (_, thunkAPI) => {
    try {
      return await classroomService.getAllClassrooms();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classrooms by department
export const getClassroomsByDepartment = createAsyncThunk(
  'classrooms/getByDepartment',
  async (departmentId, thunkAPI) => {
    try {
      return await classroomService.getClassroomsByDepartment(departmentId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classrooms by course
export const getClassroomsByCourse = createAsyncThunk(
  'classrooms/getByCourse',
  async (courseId, thunkAPI) => {
    try {
      return await classroomService.getClassroomsByCourse(courseId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classrooms by group
export const getClassroomsByGroup = createAsyncThunk(
  'classrooms/getByGroup',
  async (groupId, thunkAPI) => {
    try {
      return await classroomService.getClassroomsByGroup(groupId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classrooms by teacher
export const getClassroomsByTeacher = createAsyncThunk(
  'classrooms/getByTeacher',
  async (teacherId, thunkAPI) => {
    try {
      const data =  await classroomService.getClassroomsByTeacher(teacherId);
    //   console.log(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classroom by ID
export const getClassroomById = createAsyncThunk(
  'classrooms/getById',
  async (id, thunkAPI) => {
    try {
      return await classroomService.getClassroomById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classroom students
export const getClassroomStudents = createAsyncThunk(
  'classrooms/getStudents',
  async (id, thunkAPI) => {
    try {
      return await classroomService.getClassroomStudents(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update classroom
export const updateClassroom = createAsyncThunk(
  'classrooms/update',
  async ({ id, classroomData }, thunkAPI) => {
    try {
      return await classroomService.updateClassroom(id, classroomData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update classroom teacher
export const updateTeacher = createAsyncThunk(
  'classrooms/updateTeacher',
  async ({ id, teacherData }, thunkAPI) => {
    try {
      return await classroomService.updateTeacher(id, teacherData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update classroom group
export const updateGroup = createAsyncThunk(
  'classrooms/updateGroup',
  async ({ id, groupData }, thunkAPI) => {
    try {
      return await classroomService.updateGroup(id, groupData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update classroom course
export const updateCourse = createAsyncThunk(
  'classrooms/updateCourse',
  async ({ id, courseData }, thunkAPI) => {
    try {
      return await classroomService.updateCourse(id, courseData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete classroom
export const deleteClassroom = createAsyncThunk(
  'classrooms/delete',
  async (id, thunkAPI) => {
    try {
      return await classroomService.deleteClassroom(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload classroom material
export const uploadMaterial = createAsyncThunk(
  'classrooms/uploadMaterial',
  async ({ classroomId, resourceData }, thunkAPI) => {
    try {
      return await classroomService.uploadMaterial(classroomId, resourceData)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch classroom announcements
export const fetchAnnouncements = createAsyncThunk(
  'classrooms/fetchAnnouncements',
  async (classroomId, thunkAPI) => {
    try {
      return await classroomService.fetchAnnouncements(classroomId)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Edit classroom announcement
export const editAnnouncement = createAsyncThunk(
  'classrooms/editAnnouncement',
  async ({ classroomId, announcementId, message }, thunkAPI) => {
    try {
      return await classroomService.editAnnouncement(classroomId, announcementId, message)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete classroom announcement
export const deleteAnnouncement = createAsyncThunk(
  'classrooms/deleteAnnouncement',
  async ({ classroomId, announcementId }, thunkAPI) => {
    try {
      return await classroomService.deleteAnnouncement(classroomId, announcementId)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Post classroom announcement
export const postAnnouncement = createAsyncThunk(
  'classrooms/postAnnouncement',
  async ({ classroomId, message }, thunkAPI) => {
    try {
      return await classroomService.postAnnouncement(classroomId, message)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete classroom material
export const deleteMaterial = createAsyncThunk(
  'classrooms/deleteMaterial',
  async ({ classroomId, resourceId }, thunkAPI) => {
    try {
      return await classroomService.deleteMaterial(classroomId, resourceId)(thunkAPI.dispatch);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getClassroomsByStudent = createAsyncThunk(
  'classrooms/getByStudent',
  async (studentId, thunkAPI) => {
    try {
      return await classroomService.getClassroomsByStudent(studentId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);