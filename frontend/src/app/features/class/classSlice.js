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
  },
  extraReducers: (builder) => {
    builder
      // Schedule class
      .addCase(scheduleClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(scheduleClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes.push(action.payload);
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
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get class by ID
      .addCase(getClassById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes for date range
      .addCase(getClassesForDateRange.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassesForDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getClassesForDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes by classroom
      .addCase(getClassesByClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassesByClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getClassesByClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classes by classroom for date range
      .addCase(getClassesByClassroomForDateRange.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassesByClassroomForDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getClassesByClassroomForDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Reschedule class
      .addCase(rescheduleClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rescheduleClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        state.classes = state.classes.map((c) => 
          c._id === action.payload._id ? action.payload : c
        );
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
      })
      .addCase(updateClassLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        state.classes = state.classes.map((c) => 
          c._id === action.payload._id ? action.payload : c
        );
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
      })
      .addCase(updateClassNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        state.classes = state.classes.map((c) => 
          c._id === action.payload._id ? action.payload : c
        );
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
      })
      .addCase(updateClassTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        state.classes = state.classes.map((c) => 
          c._id === action.payload._id ? action.payload : c
        );
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
      })
      .addCase(updateSpecialRequirements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
        state.classes = state.classes.map((c) => 
          c._id === action.payload._id ? action.payload : c
        );
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
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = state.classes.filter((c) => c._id !== action.meta.arg);
        state.currentClass = null;
        state.message = 'Class deleted successfully';
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;