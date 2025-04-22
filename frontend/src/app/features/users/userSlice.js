// redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, fetchTeachers, fetchStudents } from './userThunks';

const initialState = {
  users: [],
  teachers: [],
  students: [],
  loading: {
    users: false,
    teachers: false,
    students: false
  },
  error: {
    users: null,
    teachers: null,
    students: null
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.error = {
        users: null,
        teachers: null,
        students: null
      };
    }
  },
  extraReducers: (builder) => {
    // Handle fetchUsers
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading.users = true;
      state.error.users = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading.users = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading.users = false;
      state.error.users = action.payload || 'Failed to fetch users';
    });

    // Handle fetchTeachers
    builder.addCase(fetchTeachers.pending, (state) => {
      state.loading.teachers = true;
      state.error.teachers = null;
    });
    builder.addCase(fetchTeachers.fulfilled, (state, action) => {
      state.teachers = action.payload;
      state.loading.teachers = false;
    });
    builder.addCase(fetchTeachers.rejected, (state, action) => {
      state.loading.teachers = false;
      state.error.teachers = action.payload || 'Failed to fetch teachers';
    });

    // Handle fetchStudents
    builder.addCase(fetchStudents.pending, (state) => {
      state.loading.students = true;
      state.error.students = null;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.students = action.payload;
      state.loading.students = false;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.loading.students = false;
      state.error.students = action.payload || 'Failed to fetch students';
    });
  }
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;