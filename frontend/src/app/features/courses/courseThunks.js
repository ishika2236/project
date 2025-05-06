import { createAsyncThunk } from "@reduxjs/toolkit";
import courseService from './courseService';

export const fetchAdminCourses = createAsyncThunk(
  'courses/fetchAdmin',
  async (_, thunkAPI) => {
    try {
      return await courseService.getAdminCourses();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTeacherCourses = createAsyncThunk(
  'courses/fetchTeacher',
  async (_, thunkAPI) => {
    try {
      return await courseService.getTeacherCourses();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStudentCourses = createAsyncThunk(
  'courses/fetchStudent',
  async (_, thunkAPI) => {
    try {
      return await courseService.getStudentCourses();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const createCourse = createAsyncThunk(
  'courses/create', 
  async(courseData, thunkAPI) => {
    try {
      return await courseService.createCourse(courseData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
  
export const assignCoordinator = createAsyncThunk(
  'courses/assignCoordinator', 
  async({courseId, coordinatorId}, thunkAPI) => {
    try {
      return await courseService.assignCoordinator(courseId, coordinatorId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById', 
  async(courseId, thunkAPI) => {
    try {
      return await courseService.getCourseById(courseId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async ({ courseId, studentId }, thunkAPI) => {
    try {
      return await courseService.enrollInCourse(courseId, studentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, courseData }, thunkAPI) => {
    try {
      return await courseService.updateCourse(courseId, courseData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, thunkAPI) => {
    try {
      return await courseService.deleteCourse(courseId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add missing thunk to match backend
export const fetchCoursesByDepartment = createAsyncThunk(
  'courses/fetchByDepartment',
  async (departmentId, thunkAPI) => {
    try {
      return await courseService.getCoursesByDepartment(departmentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const assignTeacherToCourse = createAsyncThunk(
  'courses/assignTeacher',
  async ({ courseId, teacherId, groupId }, thunkAPI) => {
    try{
      return await courseService.assignTeacherToCourse(courseId, teacherId, groupId);
    }
    catch(error)
    {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);