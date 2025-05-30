import { createSlice } from '@reduxjs/toolkit';
import { 
  scheduleClass, 
  getAllClasses, 
  getClassById, 
  getClassesForDateRange, 
  getClassesByClassroom,
  getClassesByClassroomForDateRange,
  rescheduleClass, 
  updateClassLocation, 
  updateClassNotes, 
  updateClassTopics, 
  updateSpecialRequirements, 
  deleteClass 
} from './classThunks';

// Initial state
const initialState = {
  classes: [],
  currentClass: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
    // Add a reducer to manually update a class in the array
    updateClassInArray: (state, action) => {
      const updatedClass = action.payload;
      const index = state.classes.findIndex(c => c._id === updatedClass._id);
      if (index !== -1) {
        state.classes[index] = updatedClass;
      }
    },
    // Add a reducer to add a new class to the array
    addClassToArray: (state, action) => {
      const newClass = action.payload;
      // Check if class already exists to prevent duplicates
      const exists = state.classes.some(c => c._id === newClass._id);
      if (!exists) {
        state.classes.push(newClass);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Schedule class
      .addCase(scheduleClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(scheduleClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Check if class already exists in the array (prevent duplicates)
        const existingIndex = state.classes.findIndex(c => c._id === action.payload._id);
        if (existingIndex !== -1) {
          // Update existing class
          state.classes[existingIndex] = action.payload;
        } else {
          // Add new class
          state.classes.push(action.payload);
        }
        
        state.currentClass = action.payload;
        state.message = 'Class scheduled successfully';
      })
      .addCase(scheduleClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get all classes
      .addCase(getAllClasses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload || [];
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get class by ID
      .addCase(getClassById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        
        // Also update the class in the classes array if it exists
        if (action.payload && action.payload._id) {
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          }
        }
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes for date range
      .addCase(getClassesForDateRange.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getClassesForDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload || [];
      })
      .addCase(getClassesForDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes by classroom
      .addCase(getClassesByClassroom.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getClassesByClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload || [];
      })
      .addCase(getClassesByClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes by classroom for date range
      .addCase(getClassesByClassroomForDateRange.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getClassesByClassroomForDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload || [];
      })
      .addCase(getClassesByClassroomForDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Reschedule class
      .addCase(rescheduleClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(rescheduleClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload._id) {
          // Update current class
          state.currentClass = action.payload;
          
          // Find and update class in the array
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          } else {
            // If for some reason the class isn't in the array, add it
            state.classes.push(action.payload);
          }
        }
        
        state.message = 'Class rescheduled successfully';
      })
      .addCase(rescheduleClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update class location
      .addCase(updateClassLocation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateClassLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload._id) {
          // Update current class
          state.currentClass = action.payload;
          
          // Find and update class in the array
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          }
        }
        
        state.message = 'Class location updated successfully';
      })
      .addCase(updateClassLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update class notes
      .addCase(updateClassNotes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateClassNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload._id) {
          // Update current class
          state.currentClass = action.payload;
          
          // Find and update class in the array
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          }
        }
        
        state.message = 'Class notes updated successfully';
      })
      .addCase(updateClassNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update class topics
      .addCase(updateClassTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateClassTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload._id) {
          // Update current class
          state.currentClass = action.payload;
          
          // Find and update class in the array
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          }
        }
        
        state.message = 'Class topics updated successfully';
      })
      .addCase(updateClassTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update special requirements
      .addCase(updateSpecialRequirements.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateSpecialRequirements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload._id) {
          // Update current class
          state.currentClass = action.payload;
          
          // Find and update class in the array
          const index = state.classes.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.classes[index] = action.payload;
          }
        }
        
        state.message = 'Special requirements updated successfully';
      })
      .addCase(updateSpecialRequirements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete class
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Remove class from array using the ID from the action meta
        const classId = action.meta.arg;
        state.classes = state.classes.filter((c) => c._id !== classId);
        
        // Clear current class if it was the deleted one
        if (state.currentClass && state.currentClass._id === classId) {
          state.currentClass = null;
        }
        
        state.message = 'Class deleted successfully';
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentClass, updateClassInArray, addClassToArray } = classSlice.actions;
export default classSlice.reducer;