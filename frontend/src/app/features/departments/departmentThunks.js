import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentService from './departmentService';

// Define initial state
const initialState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Create thunks for async operations
export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, thunkAPI) => {
    try {
      return await departmentService.createDepartment(departmentData);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  'departments/getAll',
  async (_, thunkAPI) => {
    try {
      return await departmentService.getAllDepartments();
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDepartmentById = createAsyncThunk(
  'departments/getById',
  async (id, thunkAPI) => {
    try {
      return await departmentService.getDepartmentById(id);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, departmentData }, thunkAPI) => {
    try {
      return await departmentService.updateDepartment(id, departmentData);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, thunkAPI) => {
    try {
      const deletedDepartment = await departmentService.deleteDepartment(id);
      return { id, deletedDepartment };
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const assignDepartmentHead = createAsyncThunk(
  'departments/assignHead',
  async ({ departmentId, userId }, thunkAPI) => {
    try {
      return await departmentService.assignDepartmentHead(departmentId, userId);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addFacultyToDepartment = createAsyncThunk(
  'departments/addFaculty',
  async ({ departmentId, userIds }, thunkAPI) => {
    try {
      return await departmentService.addFacultyToDepartment(departmentId, userIds);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeFacultyFromDepartment = createAsyncThunk(
  'departments/removeFaculty',
  async ({ departmentId, userId }, thunkAPI) => {
    try {
      return await departmentService.removeFacultyFromDepartment(departmentId, userId);
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
