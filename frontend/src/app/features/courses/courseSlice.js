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
  fetchCoursesByDepartment,
  assignTeacherToCourse
} from './courseThunks';

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    selectedCourse: null,
    departmentCourses: [], // For storing courses by department
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
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin courses
      .addCase(fetchAdminCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch teacher courses
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch student courses
      .addCase(fetchStudentCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses.push(action.payload);
        state.message = "Course created successfully";
        state.lastFetched = Date.now();
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Assign coordinator
      .addCase(assignCoordinator.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignCoordinator.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) state.courses[index] = updatedCourse;
        if (state.selectedCourse && state.selectedCourse._id === updatedCourse._id) {
          state.selectedCourse = updatedCourse;
        }
        state.message = "Coordinator assigned successfully";
        state.lastFetched = Date.now();
      })
      .addCase(assignCoordinator.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Enroll in course
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) state.courses[index] = updatedCourse;
        if (state.selectedCourse && state.selectedCourse._id === updatedCourse._id) {
          state.selectedCourse = updatedCourse;
        }
        state.message = "Student enrolled successfully";
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update course
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
        
        // Also update in departmentCourses if present
        if (state.departmentCourses.length > 0) {
          const deptIndex = state.departmentCourses.findIndex(c => c._id === updatedCourse._id);
          if (deptIndex !== -1) {
            state.departmentCourses[deptIndex] = updatedCourse;
          }
        }
        
        state.message = "Course updated successfully";
        state.lastFetched = Date.now();
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedCourseId = action.payload._id || action.meta.arg;
        state.courses = state.courses.filter(course => course._id !== deletedCourseId);
        state.departmentCourses = state.departmentCourses.filter(course => course._id !== deletedCourseId);
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
      
      // Fetch courses by department (missing in your original code)
      .addCase(fetchCoursesByDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departmentCourses = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCoursesByDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(assignTeacherToCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignTeacherToCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) state.courses[index] = updatedCourse;
        if (state.selectedCourse && state.selectedCourse._id === updatedCourse._id) {
          state.selectedCourse = updatedCourse;
        }
        state.message = "Teacher assigned successfully";
      })
      .addCase(assignTeacherToCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCourseMessage, clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;