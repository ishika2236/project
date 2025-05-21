import {  createAsyncThunk } from '@reduxjs/toolkit';
import attendanceStatsService from './attendanceStatsService';
export const getMyAttendance = createAsyncThunk(
    'attendanceStats/getMyAttendance',
    async (_, thunkAPI) => {
      try {
        return await attendanceStatsService.getMyAttendance();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getStudentAttendance = createAsyncThunk(
    'attendanceStats/getStudentAttendance',
    async (studentId, thunkAPI) => {
      try {
        return await attendanceStatsService.getStudentAttendance(studentId);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getClassAttendance = createAsyncThunk(
    'attendanceStats/getClassAttendance',
    async (classId, thunkAPI) => {
      try {
        return await attendanceStatsService.getClassAttendance(classId);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getClassroomAttendance = createAsyncThunk(
    'attendanceStats/getClassroomAttendance',
    async (classroomId, thunkAPI) => {
      try {
        return await attendanceStatsService.getClassroomAttendance(classroomId);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getTeacherAttendance = createAsyncThunk(
    'attendanceStats/getTeacherAttendance',
    async (teacherId, thunkAPI) => {
      try {
        return await attendanceStatsService.getTeacherAttendance(teacherId);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getOverallAttendance = createAsyncThunk(
    'attendanceStats/getOverallAttendance',
    async (_, thunkAPI) => {
      try {
        return await attendanceStatsService.getOverallAttendance();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getDailyAttendanceReport = createAsyncThunk(
    'attendanceStats/getDailyAttendanceReport',
    async (date, thunkAPI) => {
      try {
        return await attendanceStatsService.getDailyAttendanceReport(date);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getMonthlyAttendanceReport = createAsyncThunk(
    'attendanceStats/getMonthlyAttendanceReport',
    async ({ month, year }, thunkAPI) => {
      try {
        return await attendanceStatsService.getMonthlyAttendanceReport(month, year);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  