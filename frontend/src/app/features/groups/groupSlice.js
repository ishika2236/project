// groupSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createGroup,
  assignStudentToGroup,
  assignTeacherToGroup,
  removeStudentFromGroup,
  fetchGroupMaterials,
  fetchGroupClasses,
  fetchGroupsByCourse,
  fetchGroups
} from './groupThunks';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    allGroups: {}, // Organized by courseId: { courseId: [groups] }
    userGroups: {}, // Organized by courseId: { courseId: [groups] }
    groupMaterials: {}, // Organized by groupId
    groupClasses: {}, // Organized by groupId
    loading: false,
    error: null,
    lastFetched: {
      allGroups: null,
      userGroups: null,
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch all groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        
        const groupsByCourse = {};
        console.log("action payload in slice: ", action.payload);
        action.payload?.forEach(group => {
          const courseId = group.course._id;
          if (!groupsByCourse[courseId]) {
            groupsByCourse[courseId] = [];
          }
          groupsByCourse[courseId].push(group);
        });
        
        
        if (action.meta.arg?.isAdmin || action.meta.arg?.isTeacher) {
          state.allGroups = groupsByCourse;
          state.lastFetched.allGroups = Date.now();
        } else {
          state.userGroups = groupsByCourse;
          state.lastFetched.userGroups = Date.now();
        }
        
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        console.log("rejected");
        state.error = action.payload;
      })
      
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        const group = action.payload;
        const courseId = group.course;
        
        // Initialize the course array if it doesn't exist
        if (!state.allGroups[courseId]) {
          state.allGroups[courseId] = [];
        }
        
        // Add to admin's allGroups
        state.allGroups[courseId].push(group);
        state.loading = false;
        state.lastFetched.allGroups = Date.now();
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch groups by course
      .addCase(fetchGroupsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByCourse.fulfilled, (state, action) => {
        const courseId = action.meta.arg.courseId;
        const groups = action.payload;
        
        if (action.meta.arg.isAdmin || action.meta.arg.isTeacher) {
          state.allGroups[courseId] = groups;
          state.lastFetched.allGroups = Date.now();
        } else {
          state.userGroups[courseId] = groups;
          state.lastFetched.userGroups = Date.now();
        }
        
        state.loading = false;
      })
      .addCase(fetchGroupsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign student to group
      .addCase(assignStudentToGroup.fulfilled, (state, action) => {
        console.log(action.payload);
        const { groupId, studentId } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups)?.forEach(courseId => {
          const groupIndex = state.allGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            if (!state.allGroups[courseId][groupIndex].students.some(s => s._id === studentId)) {
              state.allGroups[courseId][groupIndex].students.push({ _id: studentId });
            }
          }
        });
        
        Object.keys(state.userGroups)?.forEach(courseId => {
          const groupIndex = state.userGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            if (!state.userGroups[courseId][groupIndex].students.some(s => s._id === studentId)) {
              state.userGroups[courseId][groupIndex].students.push({ _id: studentId });
            }
          }
        });
      })
      
      // Remove student from group
      .addCase(removeStudentFromGroup.fulfilled, (state, action) => {
        const { groupId, studentId } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups)?.forEach(courseId => {
          const groupIndex = state.allGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            state.allGroups[courseId][groupIndex].students = 
              state.allGroups[courseId][groupIndex].students.filter(s => s._id !== studentId);
          }
        });
        
        Object.keys(state.userGroups)?.forEach(courseId => {
          const groupIndex = state.userGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            state.userGroups[courseId][groupIndex].students = 
              state.userGroups[courseId][groupIndex].students.filter(s => s._id !== studentId);
          }
        });
      })
      
      // Assign teacher to group
      .addCase(assignTeacherToGroup.fulfilled, (state, action) => {
        const { groupId, teacherId } = action.payload;
        
        // Update in both allGroups and userGroups
        Object.keys(state.allGroups)?.forEach(courseId => {
          const groupIndex = state.allGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            state.allGroups[courseId][groupIndex].mentor = teacherId;
          }
        });
        
        Object.keys(state.userGroups)?.forEach(courseId => {
          const groupIndex = state.userGroups[courseId]?.findIndex(g => g._id === groupId);
          if (groupIndex !== -1 && groupIndex !== undefined) {
            state.userGroups[courseId][groupIndex].mentor = teacherId;
          }
        });
      })
      
      // Fetch group materials
      .addCase(fetchGroupMaterials.fulfilled, (state, action) => {
        state.groupMaterials[action.meta.arg.groupId] = action.payload;
      })
      
      // Fetch group classes
      .addCase(fetchGroupClasses.fulfilled, (state, action) => {
        state.groupClasses[action.meta.arg.groupId] = action.payload;
      });
  },
});

export default groupSlice.reducer;