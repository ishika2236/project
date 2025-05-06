import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchClassesByGroup, 
  fetchClassesByCourse, 
  fetchClassesByTeacher,
  fetchClassById,
  createNewClass,
  updateExistingClass,
  deleteExistingClass,
  addClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  createClassSession,
  updateClassSession,
  deleteClassSession,
  updateClassGeoLocation,
  markSessionAttendance,
  fetchSessionAttendance,
  fetchTeacherClassrooms
} from './classThunks';

/**
 * Redux slice for class management
 */
const classSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    currentClass: null,
    sessions: [],
    attendance: [],
    loading: false,
    error: null,
    success: false,
    message: '',
    teacherClassrooms: {
      department: null,
      teachingAssignments: []
    }
  },
  reducers: {
    // Reset status
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Common pending handler for all async thunks
      
      
      // Fetch classes thunks
      .addCase(fetchClassesByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClassesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClassesByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      
      // Get single class by ID
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      
      // Create class
      .addCase(createNewClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
        state.success = true;
        state.message = 'Class created successfully';
      })
      
      // Update class
      .addCase(updateExistingClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.map(cls => 
          cls._id === action.payload._id ? action.payload : cls
        );
        
        // Also update currentClass if it's the one being updated
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
        
        state.success = true;
        state.message = 'Class updated successfully';
      })
      
      // Delete class
      .addCase(deleteExistingClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(cls => cls._id !== action.payload);
        
        // Clear currentClass if it's the one deleted
        if (state.currentClass && state.currentClass._id === action.payload) {
          state.currentClass = null;
        }
        
        state.success = true;
        state.message = 'Class deleted successfully';
      })
      
      // Add schedule
      .addCase(addClassSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
        
        // Also update in classes list if present
        if (state.currentClass) {
          state.classes = state.classes.map(cls => 
            cls._id === state.currentClass._id ? state.currentClass : cls
          );
        }
        
        state.success = true;
        state.message = 'Schedule added successfully';
      })
      
      // Update schedule
      .addCase(updateClassSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
        
        // Also update in classes list if present
        if (state.currentClass) {
          state.classes = state.classes.map(cls => 
            cls._id === state.currentClass._id ? state.currentClass : cls
          );
        }
        
        state.success = true;
        state.message = 'Schedule updated successfully';
      })
      
      // Delete schedule
      .addCase(deleteClassSchedule.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove schedule from current class
        if (state.currentClass && state.currentClass.schedule) {
          state.currentClass = {
            ...state.currentClass,
            schedule: state.currentClass.schedule.filter(schedule => 
              schedule._id !== action.payload
            )
          };
          
          // Also update in classes list if present
          state.classes = state.classes.map(cls => 
            cls._id === state.currentClass._id ? state.currentClass : cls
          );
        }
        
        state.success = true;
        state.message = 'Schedule removed successfully';
      })
      
      // Create session
      .addCase(createClassSession.fulfilled, (state, action) => {
        state.loading = false;
        
        // If the current class is set, update its sessions
        if (state.currentClass) {
          state.currentClass = {
            ...state.currentClass,
            sessions: [...(state.currentClass.sessions || []), action.payload]
          };
        }
        
        state.success = true;
        state.message = 'Session created successfully';
      })
      
      // Update session
      .addCase(updateClassSession.fulfilled, (state, action) => {
        state.loading = false;
        
        // If the current class is set, update the specific session
        if (state.currentClass && state.currentClass.sessions) {
          state.currentClass = {
            ...state.currentClass,
            sessions: state.currentClass.sessions.map(session => 
              session._id === action.payload._id ? action.payload : session
            )
          };
        }
        
        state.success = true;
        state.message = 'Session updated successfully';
      })
      
      // Delete session
      .addCase(deleteClassSession.fulfilled, (state, action) => {
        state.loading = false;
        
        // If the current class is set, remove the session
        if (state.currentClass && state.currentClass.sessions) {
          state.currentClass = {
            ...state.currentClass,
            sessions: state.currentClass.sessions.filter(session => 
              session._id !== action.payload
            )
          };
        }
        
        state.success = true;
        state.message = 'Session deleted successfully';
      })
      
      // Update location
      .addCase(updateClassGeoLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
        
        // Also update in classes list if present
        if (state.currentClass) {
          state.classes = state.classes.map(cls => 
            cls._id === state.currentClass._id ? state.currentClass : cls
          );
        }
        
        state.success = true;
        state.message = 'Location updated successfully';
      })
      
      // Mark attendance
      .addCase(markSessionAttendance.fulfilled, (state, action) => {
        state.loading = false;
        
        // Check if attendance record already exists
        const existingIndex = state.attendance.findIndex(
          record => record.student._id === action.payload.student._id
        );
        
        if (existingIndex >= 0) {
          // Update existing record
          state.attendance = [
            ...state.attendance.slice(0, existingIndex),
            action.payload,
            ...state.attendance.slice(existingIndex + 1)
          ];
        } else {
          // Add new record
          state.attendance = [...state.attendance, action.payload];
        }
        
        state.success = true;
        state.message = 'Attendance recorded successfully';
      })
      
      // Fetch attendance
      .addCase(fetchSessionAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      
      // Teacher classrooms
      .addCase(fetchTeacherClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherClassrooms = action.payload;
        
        // If you also need the plain class list separately
        if (action.payload.teachingAssignments) {
          state.classes = action.payload.teachingAssignments;
        }
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
          state.message = '';
        }
      )
      // Common rejected handler for all async thunks
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      );
  }
});

// Export actions
export const { resetStatus } = classSlice.actions;

// Export reducer
export default classSlice.reducer;