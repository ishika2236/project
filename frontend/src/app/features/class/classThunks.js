import { createAsyncThunk } from '@reduxjs/toolkit';
import classService from './classService';

/**
 * Thunk for fetching classes by group
 */
export const fetchClassesByGroup = createAsyncThunk(
  'classes/fetchByGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      return await classService.getClassesByGroup(groupId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch classes';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for fetching classes by course
 */
export const fetchClassesByCourse = createAsyncThunk(
  'classes/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      return await classService.getClassesByCourse(courseId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch classes';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for fetching classes by teacher
 */
export const fetchClassesByTeacher = createAsyncThunk(
  'classes/fetchByTeacher',
  async (teacherId, { rejectWithValue }) => {
    try {
      return await classService.getClassesByTeacher(teacherId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch classes';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for fetching a single class by ID
 */
export const fetchClassById = createAsyncThunk(
  'classes/fetchById',
  async (classId, { rejectWithValue }) => {
    try {
      return await classService.getClassById(classId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch class';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for creating a new class
 */
export const createNewClass = createAsyncThunk(
  'classes/create',
  async (classData, { rejectWithValue }) => {
    try {
      return await classService.createClass(classData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create class';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for updating a class
 */
export const updateExistingClass = createAsyncThunk(
  'classes/update',
  async ({ classId, classData }, { rejectWithValue }) => {
    try {
      return await classService.updateClass(classId, classData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update class';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for deleting a class
 */
export const deleteExistingClass = createAsyncThunk(
  'classes/delete',
  async (classId, { rejectWithValue }) => {
    try {
      await classService.deleteClass(classId);
      return classId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete class';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for adding a schedule to a class (periodic class)
 */
export const addClassSchedule = createAsyncThunk(
  'classes/addSchedule',
  async ({ classId, scheduleData }, { rejectWithValue }) => {
    try {
      return await classService.addSchedule(classId, scheduleData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add schedule';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for updating a schedule
 */
export const updateClassSchedule = createAsyncThunk(
  'classes/updateSchedule',
  async ({ classId, scheduleId, scheduleData }, { rejectWithValue }) => {
    try {
      return await classService.updateSchedule(classId, scheduleId, scheduleData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update schedule';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for deleting a schedule
 */
export const deleteClassSchedule = createAsyncThunk(
  'classes/deleteSchedule',
  async ({ classId, scheduleId }, { rejectWithValue }) => {
    try {
      await classService.deleteSchedule(classId, scheduleId);
      return scheduleId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete schedule';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for creating a new session (extra class)
 */
export const createClassSession = createAsyncThunk(
  'classes/createSession',
  async ({ classId, sessionData }, { rejectWithValue }) => {
    try {
      const result = await classService.createSession(classId, sessionData);
      return result.session;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for updating a session
 */
export const updateClassSession = createAsyncThunk(
  'classes/updateSession',
  async ({ classId, sessionId, sessionData }, { rejectWithValue }) => {
    try {
      const result = await classService.updateSession(classId, sessionId, sessionData);
      return result.session;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for deleting a session
 */
export const deleteClassSession = createAsyncThunk(
  'classes/deleteSession',
  async ({ classId, sessionId }, { rejectWithValue }) => {
    try {
      await classService.deleteSession(classId, sessionId);
      return sessionId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for updating class location with geolocation
 */
export const updateClassGeoLocation = createAsyncThunk(
  'classes/updateLocation',
  async ({ classId, locationData }, { rejectWithValue }) => {
    try {
      const result = await classService.updateClassLocation(classId, locationData);
      return result.classData;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update location';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for marking attendance for a session
 */
export const markSessionAttendance = createAsyncThunk(
  'classes/markAttendance',
  async ({ classId, sessionId, attendanceData }, { rejectWithValue }) => {
    try {
      const result = await classService.markAttendance(classId, sessionId, attendanceData);
      return result.attendance;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to mark attendance';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for fetching attendance for a session
 */
export const fetchSessionAttendance = createAsyncThunk(
  'classes/fetchAttendance',
  async ({ classId, sessionId }, { rejectWithValue }) => {
    try {
      return await classService.getSessionAttendance(classId, sessionId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch attendance';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for fetching teacher classrooms
 */
export const fetchTeacherClassrooms = createAsyncThunk(
  'classes/teacher',
  async (_, { rejectWithValue }) => {
    try {
      return await classService.getTeacherClassrooms();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch classes';
      return rejectWithValue(message);
    }
  }
);