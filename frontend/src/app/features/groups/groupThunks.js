import { createAsyncThunk } from '@reduxjs/toolkit';
import groupService from './groupService';

export const createGroup = createAsyncThunk(
  'groups/create',
  async (groupData, { rejectWithValue }) => {
    try {
      const { departmentId, ...restGroupData } = groupData;
      const response = await groupService.createGroup(departmentId, restGroupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create group');
    }
  }
);

export const fetchGroups = createAsyncThunk(
  'groups/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await groupService.fetchGroups();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch groups');
    }
  }
);

export const fetchAllGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupService.fetchAllGroups();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all groups');
    }
  }
);

export const fetchGroupsByDepartment = createAsyncThunk(
  'groups/fetchByDepartment',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await groupService.fetchGroupsByDepartment(departmentId);
      return { departmentId, groups: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch groups by department');
    }
  }
);

export const assignStudentToGroup = createAsyncThunk(
  'groups/assignStudent', 
  async ({groupId, studentIds}, { rejectWithValue }) => {
    try {
      const response = await groupService.assignStudentToGroup(groupId, studentIds);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to assign student');
    }
  }
);

export const removeStudentFromGroup = createAsyncThunk(
  'groups/removeStudent', 
  async ({ groupId, studentId }, { rejectWithValue }) => {
    try {
      const response = await groupService.removeStudentFromGroup(groupId, studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove student');
    }
  }
);
  
export const assignTeacherToGroup = createAsyncThunk(
  'groups/assignTeacher', 
  async ({ groupId, teacherId }, { rejectWithValue }) => {
    try {
      const response = await groupService.assignTeacherToGroup(groupId, teacherId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to assign teacher');
    }
  }
);

export const updateGroup = createAsyncThunk(
  'groups/update',
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const response = await groupService.updateGroup(groupId, groupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update group');
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'groups/delete',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await groupService.deleteGroup(groupId);
      return { groupId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete group');
    }
  }
);