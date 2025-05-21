import { createAsyncThunk } from '@reduxjs/toolkit';
import classService from './classService';

// Schedule a class
export const scheduleClass = createAsyncThunk(
  'classes/schedule',
  async (classData, thunkAPI) => {
    try {
      return await classService.scheduleClass(classData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all classes
export const getAllClasses = createAsyncThunk(
  'classes/getAll',
  async (_, thunkAPI) => {
    try {
      return await classService.getAllClasses();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get class by ID
export const getClassById = createAsyncThunk(
  'classes/getById',
  async (id, thunkAPI) => {
    try {
      return await classService.getClassById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classes for date range
export const getClassesForDateRange = createAsyncThunk(
  'classes/getForDateRange',
  async ({ startDate, endDate, classroomId }, thunkAPI) => {
    try {
      return await classService.getClassesForDateRange(startDate, endDate, classroomId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classes for a specific classroom
export const getClassesByClassroom = createAsyncThunk(
  'classes/getByClassroom',
  async (classroomId, thunkAPI) => {
    try {
      // console.log(classroomId)
      return await classService.getClassesByClassroom(classroomId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get classes for a specific classroom within a date range
export const getClassesByClassroomForDateRange = createAsyncThunk(
  'classes/getByClassroomForDateRange',
  async ({ classroomId, startDate, endDate }, thunkAPI) => {
    try {
      return await classService.getClassesByClassroomForDateRange(classroomId, startDate, endDate);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reschedule a class
export const rescheduleClass = createAsyncThunk(
  'classes/reschedule',
  async ({ id, scheduleData }, thunkAPI) => {
    try {
      return await classService.rescheduleClass(id, scheduleData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update class location
export const updateClassLocation = createAsyncThunk(
  'classes/updateLocation',
  async ({ id, locationData }, thunkAPI) => {
    try {
      return await classService.updateClassLocation(id, locationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update class notes
export const updateClassNotes = createAsyncThunk(
  'classes/updateNotes',
  async ({ id, notesData }, thunkAPI) => {
    try {
      return await classService.updateClassNotes(id, notesData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update class topics
export const updateClassTopics = createAsyncThunk(
  'classes/updateTopics',
  async ({ id, topicsData }, thunkAPI) => {
    try {
      return await classService.updateClassTopics(id, topicsData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update class special requirements
export const updateSpecialRequirements = createAsyncThunk(
  'classes/updateRequirements',
  async ({ id, requirementsData }, thunkAPI) => {
    try {
      return await classService.updateSpecialRequirements(id, requirementsData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a class
export const deleteClass = createAsyncThunk(
  'classes/delete',
  async (id, thunkAPI) => {
    try {
      return await classService.deleteClass(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);