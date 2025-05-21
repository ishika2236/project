
import { createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from './attendanceService';


export const openAttendanceWindow = createAsyncThunk(
  'attendance/openWindow',
  async ({ classId, duration }, thunkAPI) => {
    try {
      return await attendanceService.openAttendanceWindow(classId, duration);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to open attendance window';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const closeAttendanceWindow = createAsyncThunk(
  'attendance/closeWindow',
  async (classId, thunkAPI) => {
    try {
      return await attendanceService.closeAttendanceWindow(classId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to close attendance window';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAttendanceManually = createAsyncThunk(
  'attendance/markManually',
  async ({ classId, studentId, status, notes }, thunkAPI) => {
    try {
        // console.log(classId, studentId, status, notes);
      return await attendanceService.markAttendanceManually(classId, studentId, status, notes);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to mark attendance';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bulkMarkAttendance = createAsyncThunk(
  'attendance/bulkMark',
  async ({ classId, attendanceData }, thunkAPI) => {
    try {
      return await attendanceService.bulkMarkAttendance(classId, attendanceData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to mark bulk attendance';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getClassAttendance = createAsyncThunk(
  'attendance/getClassAttendance',
  async (classId, thunkAPI) => {
    try {
      return await attendanceService.getClassAttendance(classId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch class attendance';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Student Async Thunks
export const markAttendanceByFaceAndLocation = createAsyncThunk(
  'attendance/markByFaceAndLocation',
  async ({ classId, faceEmbeddingData, location }, thunkAPI) => {
    try {
      return await attendanceService.markAttendanceByFaceAndLocation(classId, faceEmbeddingData, location);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to mark attendance';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getStudentAttendance = createAsyncThunk(
  'attendance/getStudentAttendance',
  async (courseId, thunkAPI) => {
    try {
      return await attendanceService.getStudentAttendance(courseId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch student attendance';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Common Async Thunks
export const getAttendanceWindowStatus = createAsyncThunk(
  'attendance/getWindowStatus',
  async (classId, thunkAPI) => {
    try {
      return await attendanceService.getAttendanceWindowStatus(classId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch attendance window status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const verifyFaceEmbedding = createAsyncThunk(
  'attendance/verifyFace',
  async (faceEmbeddingData, thunkAPI) => {
    try {
      return await attendanceService.verifyFaceEmbedding(faceEmbeddingData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify face';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Location Verification Thunk
export const checkLocationValidityAndMarkPresent = createAsyncThunk(
  'attendance/checkLocation',
  async ({ classId, location }, thunkAPI) => {
    try {
      return await attendanceService.checkLocationValidity(classId, location);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify location';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
