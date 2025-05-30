// Enhanced groupSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createGroup,
  assignStudentToGroup,
  removeStudentFromGroup,
  assignTeacherToGroup,
  fetchGroups,
  fetchAllGroups,
  fetchGroupsByDepartment,
  updateGroup,
  deleteGroup
} from './groupThunks';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    // Groups organized by department
    allGroups: {}, // departmentId: [groups]
    userGroups: {}, // departmentId: [groups]
    loading: false,
    error: null,
    lastFetched: {
      allGroups: null,
      userGroups: null,
    }
  },
  reducers: {
    // Add any additional reducers if needed
    clearGroupErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch groups (based on user role)
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        // Organize groups by department
        const groupsByDepartment = {};
        
        action.payload.forEach(group => {
          const departmentId = group.department._id;
          if (!groupsByDepartment[departmentId]) {
            groupsByDepartment[departmentId] = [];
          }
          groupsByDepartment[departmentId].push(group);
        });
        
        state.userGroups = groupsByDepartment;
        state.lastFetched.userGroups = Date.now();
        state.loading = false;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch all groups (admin only)
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        // Organize groups by department
        const groupsByDepartment = {};
        
        action.payload.forEach(group => {
          const departmentId = group.department._id;
          if (!groupsByDepartment[departmentId]) {
            groupsByDepartment[departmentId] = [];
          }
          groupsByDepartment[departmentId].push(group);
        });
        
        state.allGroups = groupsByDepartment;
        state.lastFetched.allGroups = Date.now();
        state.loading = false;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch groups by department
      .addCase(fetchGroupsByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByDepartment.fulfilled, (state, action) => {
        const { departmentId, groups } = action.payload;
        
        // Update the appropriate state based on user role info that could be passed in the meta
        if (action.meta.arg?.isAdmin) {
          state.allGroups[departmentId] = groups;
          state.lastFetched.allGroups = Date.now();
        } else {
          state.userGroups[departmentId] = groups;
          state.lastFetched.userGroups = Date.now();
        }
        
        state.loading = false;
      })
      .addCase(fetchGroupsByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        const group = action.payload.group;
        const departmentId = group.department._id;
        
        // Initialize the department array if it doesn't exist
        if (!state.allGroups[departmentId]) {
          state.allGroups[departmentId] = [];
        }
        
        // Add to admin's allGroups
        state.allGroups[departmentId].push(group);
        
        // Also add to userGroups if appropriate
        if (state.userGroups[departmentId]) {
          state.userGroups[departmentId].push(group);
        }
        
        state.loading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign student to group
      .addCase(assignStudentToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStudentToGroup.fulfilled, (state, action) => {
        const { groupId, students } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups).forEach(departmentId => {
          const groupIndex = state.allGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Create a new students array with both existing and new students
            const existingStudents = state.allGroups[departmentId][groupIndex].students || [];
            const updatedStudents = [...existingStudents];
            
            // Add new students if they don't already exist
            students.forEach(student => {
              if (!updatedStudents.some(s => s._id === student._id)) {
                updatedStudents.push(student);
              }
            });
            
            // Update the students array immutably
            state.allGroups[departmentId][groupIndex] = {
              ...state.allGroups[departmentId][groupIndex],
              students: updatedStudents
            };
          }
        });
        
        Object.keys(state.userGroups).forEach(departmentId => {
          const groupIndex = state.userGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Create a new students array with both existing and new students
            const existingStudents = state.userGroups[departmentId][groupIndex].students || [];
            const updatedStudents = [...existingStudents];
            
            // Add new students if they don't already exist
            students.forEach(student => {
              if (!updatedStudents.some(s => s._id === student._id)) {
                updatedStudents.push(student);
              }
            });
            
            // Update the students array immutably
            state.userGroups[departmentId][groupIndex] = {
              ...state.userGroups[departmentId][groupIndex],
              students: updatedStudents
            };
          }
        });
        
        state.loading = false;
      })
      .addCase(assignStudentToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove student from group
      .addCase(removeStudentFromGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStudentFromGroup.fulfilled, (state, action) => {
        const { groupId, studentId } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups).forEach(departmentId => {
          const groupIndex = state.allGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Create a new students array without the removed student
            const updatedStudents = state.allGroups[departmentId][groupIndex].students.filter(
              s => s._id !== studentId
            );
            
            // Update the students array immutably
            state.allGroups[departmentId][groupIndex] = {
              ...state.allGroups[departmentId][groupIndex],
              students: updatedStudents
            };
          }
        });
        
        Object.keys(state.userGroups).forEach(departmentId => {
          const groupIndex = state.userGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Create a new students array without the removed student
            const updatedStudents = state.userGroups[departmentId][groupIndex].students.filter(
              s => s._id !== studentId
            );
            
            // Update the students array immutably
            state.userGroups[departmentId][groupIndex] = {
              ...state.userGroups[departmentId][groupIndex],
              students: updatedStudents
            };
          }
        });
        
        state.loading = false;
      })
      .addCase(removeStudentFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign teacher to group
      .addCase(assignTeacherToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTeacherToGroup.fulfilled, (state, action) => {
        const { groupId, teacher } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups).forEach(departmentId => {
          const groupIndex = state.allGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Update the mentor immutably
            state.allGroups[departmentId][groupIndex] = {
              ...state.allGroups[departmentId][groupIndex],
              mentor: teacher
            };
          }
        });
        
        Object.keys(state.userGroups).forEach(departmentId => {
          const groupIndex = state.userGroups[departmentId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            // Update the mentor immutably
            state.userGroups[departmentId][groupIndex] = {
              ...state.userGroups[departmentId][groupIndex],
              mentor: teacher
            };
          }
        });
        
        state.loading = false;
      })
      .addCase(assignTeacherToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update group
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const departmentId = updatedGroup.department._id;
        
        // Update in allGroups
        Object.keys(state.allGroups).forEach(deptId => {
          if (deptId === departmentId) {
            // Handle updating in the correct department
            const groupIndex = state.allGroups[deptId]?.findIndex(g => g._id === updatedGroup._id);
            if (groupIndex !== -1 && groupIndex !== undefined) {
              // Update the group immutably
              state.allGroups[deptId][groupIndex] = updatedGroup;
            } else {
              // Group not found in this department, add it
              if (!state.allGroups[deptId]) {
                state.allGroups[deptId] = [];
              }
              state.allGroups[deptId].push(updatedGroup);
            }
          } else {
            // Remove from old department if it exists
            state.allGroups[deptId] = state.allGroups[deptId]?.filter(g => g._id !== updatedGroup._id) || [];
          }
        });
        
        // Initialize new department if needed
        if (!state.allGroups[departmentId]) {
          state.allGroups[departmentId] = [updatedGroup];
        }
        
        // Update in userGroups similarly
        Object.keys(state.userGroups).forEach(deptId => {
          if (deptId === departmentId) {
            // Handle updating in the correct department
            const groupIndex = state.userGroups[deptId]?.findIndex(g => g._id === updatedGroup._id);
            if (groupIndex !== -1 && groupIndex !== undefined) {
              // Update the group immutably
              state.userGroups[deptId][groupIndex] = updatedGroup;
            } else {
              // Group not found in this department, add it
              if (!state.userGroups[deptId]) {
                state.userGroups[deptId] = [];
              }
              state.userGroups[deptId].push(updatedGroup);
            }
          } else {
            // Remove from old department if it exists
            state.userGroups[deptId] = state.userGroups[deptId]?.filter(g => g._id !== updatedGroup._id) || [];
          }
        });
        
        // Initialize new department if needed
        if (!state.userGroups[departmentId]) {
          state.userGroups[departmentId] = [updatedGroup];
        }
        
        state.loading = false;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        const { groupId } = action.payload;
        
        // Remove from allGroups and userGroups
        Object.keys(state.allGroups).forEach(departmentId => {
          if (state.allGroups[departmentId]) {
            state.allGroups[departmentId] = state.allGroups[departmentId].filter(g => g._id !== groupId);
          }
        });
        
        Object.keys(state.userGroups).forEach(departmentId => {
          if (state.userGroups[departmentId]) {
            state.userGroups[departmentId] = state.userGroups[departmentId].filter(g => g._id !== groupId);
          }
        });
        
        state.loading = false;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and any action creators
export const { clearGroupErrors } = groupSlice.actions;
export default groupSlice.reducer;