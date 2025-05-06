import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {fetchDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment, assignDepartmentHead, addFacultyToDepartment, removeFacultyFromDepartment} from './departmentThunks';

// Define initial state
const initialState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

const departmentSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
      resetDepartmentState: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      },
      clearCurrentDepartment: (state) => {
        state.currentDepartment = null;
      }
    },
    extraReducers: (builder) => {
      builder
        // Create department
        .addCase(createDepartment.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createDepartment.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.departments.push(action.payload);
        })
        .addCase(createDepartment.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Get all departments
        .addCase(fetchDepartments.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchDepartments.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.departments = action.payload;
        })
        .addCase(fetchDepartments.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Get department by ID
        .addCase(getDepartmentById.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getDepartmentById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.currentDepartment = action.payload;
        })
        .addCase(getDepartmentById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Update department
        .addCase(updateDepartment.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateDepartment.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.departments = state.departments.map(department => 
            department._id === action.payload._id ? action.payload : department
          );
          if (state.currentDepartment?._id === action.payload._id) {
            state.currentDepartment = action.payload;
          }
        })
        .addCase(updateDepartment.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Delete department
        .addCase(deleteDepartment.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteDepartment.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.departments = state.departments.filter(
            department => department._id !== action.payload.id
          );
          if (state.currentDepartment?._id === action.payload.id) {
            state.currentDepartment = null;
          }
        })
        .addCase(deleteDepartment.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Assign department head
        .addCase(assignDepartmentHead.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(assignDepartmentHead.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          const updatedDepartment = action.payload;
          state.departments = state.departments.map(department => 
            department._id === updatedDepartment._id ? updatedDepartment : department
          );
          if (state.currentDepartment?._id === updatedDepartment._id) {
            state.currentDepartment = updatedDepartment;
          }
        })
        .addCase(assignDepartmentHead.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Add faculty to department
        .addCase(addFacultyToDepartment.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(addFacultyToDepartment.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          const updatedDepartment = action.payload;
          state.departments = state.departments.map(department => 
            department._id === updatedDepartment._id ? updatedDepartment : department
          );
          if (state.currentDepartment?._id === updatedDepartment._id) {
            state.currentDepartment = updatedDepartment;
          }
        })
        .addCase(addFacultyToDepartment.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        
        // Remove faculty from department
        .addCase(removeFacultyFromDepartment.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(removeFacultyFromDepartment.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          const updatedDepartment = action.payload;
          state.departments = state.departments.map(department => 
            department._id === updatedDepartment._id ? updatedDepartment : department
          );
          if (state.currentDepartment?._id === updatedDepartment._id) {
            state.currentDepartment = updatedDepartment;
          }
        })
        .addCase(removeFacultyFromDepartment.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        });
    }
  });
  
  export const { resetDepartmentState, clearCurrentDepartment } = departmentSlice.actions;
  export default departmentSlice.reducer;