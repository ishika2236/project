
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminCourses,
  fetchTeacherCourses,
  fetchStudentCourses,
  createCourse,
  assignCoordinator,
  fetchCourseById,
  enrollInCourse,
  updateCourse,
  deleteCourse,
} from './courseThunks';

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    selectedCourse: null,
    isLoading: false,
    message: null,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearCourseMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
      })
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdCourse = action.payload;
        state.courses.push(action.payload);
        state.lastFetched = Date.now();
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
      })
      .addCase(assignCoordinator.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignCoordinator.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) state.courses[index] = updatedCourse;
        state.message = "Coordinator assigned";
        state.lastFetched = Date.now();
      })
      .addCase(assignCoordinator.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.enrolledCourses) state.enrolledCourses = [];
        state.enrolledCourses.push(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add update course cases
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
        if (state.selectedCourse && state.selectedCourse._id === updatedCourse._id) {
          state.selectedCourse = updatedCourse;
        }
        state.message = "Course updated successfully";
        state.lastFetched = Date.now();
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add delete course cases
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedCourseId = action.payload._id || action.meta.arg;
        state.courses = state.courses.filter(course => course._id !== deletedCourseId);
        if (state.selectedCourse && state.selectedCourse._id === deletedCourseId) {
          state.selectedCourse = null;
        }
        state.message = "Course deleted successfully";
        state.lastFetched = Date.now();
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("courses/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("courses/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearCourseMessage } = courseSlice.actions;
export default courseSlice.reducer;