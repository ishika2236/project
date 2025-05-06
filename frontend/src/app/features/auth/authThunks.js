// authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData)
      return response ;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login', 
  async (userData, thunkAPI) => {
    try {
      const response = await  authService.login(userData);
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get current user status
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to get current user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getDepartments = createAsyncThunk('auth/departments', 
  async(_, thunkAPI)=>{
    try {
      const response = await authService.getDepartments();
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to get current user';
      return thunkAPI.rejectWithValue(message);
      
    }
  }
)

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response =await  authService.updateProfile(userData);
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout', 
  async () => {
    authService.logout();
  }
);