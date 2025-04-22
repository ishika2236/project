import { createAsyncThunk } from '@reduxjs/toolkit';
import groupService from './groupService';

export const createGroup = createAsyncThunk(
  'groups/create',
  async (groupData, { rejectWithValue }) => {
    try {
      // Extract courseId from groupData since the API needs it as a separate parameter
      const { courseId, ...restGroupData } = groupData;
      console.log(courseId);
      const response = await groupService.createGroup(courseId, groupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create group');
    }
  }
);

// Add other thunks as needed
export const fetchGroupsByCourse = createAsyncThunk(
  'groups/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await groupService.fetchGroupsByCourse(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch groups');
    }
  }
);
export const assignStudentToGroup = createAsyncThunk('groups/assignStudent', ({groupId, studentIds}, thunkAPI)=>{
    groupService.assignStudentToGroup(groupId, studentIds);
})
export const removeStudentFromGroup = createAsyncThunk('groups/removeStudent', ({ groupId, studentId }, thunkAPI) =>
    groupService.removeStudentFromGroup(groupId, studentId)
);
  
  export const assignTeacherToGroup = createAsyncThunk('groups/assignTeacher', ({ groupId, teacherId }, thunkAPI) =>
    groupService.assignTeacherToGroup(groupId, teacherId)
);
  
  export const fetchGroupMaterials = createAsyncThunk('groups/fetchMaterials', ({ groupId }, thunkAPI) =>
    groupService.fetchGroupMaterials(groupId)
);
  
  export const fetchGroupClasses = createAsyncThunk('groups/fetchClasses', ({ groupId }, thunkAPI) =>
    groupService.fetchGroupClasses(groupId)
);

export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async ({ isAdmin, isTeacher } = {}, { rejectWithValue }) => {
    try {
      const response = await groupService.fetchGroups();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch groups');
    }
  }
);
