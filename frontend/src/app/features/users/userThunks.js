// redux/thunks/userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch teachers only
export const fetchTeachers = createAsyncThunk(
  'users/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await  userService.getTeachers();
        // console.log(response.students);
      return response.teachers; 
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch students only
export const fetchStudents = createAsyncThunk(
  'users/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
        const response = await  userService.getStudents();
        // console.log(response.students);
      return response.students; 
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      return await userService.getUserById(userId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(userId, userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);