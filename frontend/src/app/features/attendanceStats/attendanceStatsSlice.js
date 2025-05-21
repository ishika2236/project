import { createSlice } from '@reduxjs/toolkit';
import { getMyAttendance, getStudentAttendance, getClassAttendance, getClassroomAttendance, getTeacherAttendance, getOverallAttendance, getDailyAttendanceReport, getMonthlyAttendanceReport } from './attendanceStatsThunks';

// Initial state
const initialState = {
  studentAttendance: null,
  classAttendance: null,
  classroomAttendance: null,
  teacherAttendance: null,
  overallAttendance: null,
  dailyReport: null,
  monthlyReport: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async thunks

// Create slice
const attendanceStatsSlice = createSlice({
  name: 'attendanceStats',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearAttendanceData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMyAttendance
      .addCase(getMyAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentAttendance = action.payload.data;
      })
      .addCase(getMyAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getStudentAttendance
      .addCase(getStudentAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStudentAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentAttendance = action.payload.data;
      })
      .addCase(getStudentAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getClassAttendance
      .addCase(getClassAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classAttendance = action.payload.data;
      })
      .addCase(getClassAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getClassroomAttendance
      .addCase(getClassroomAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomAttendance = action.payload.data;
      })
      .addCase(getClassroomAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getTeacherAttendance
      .addCase(getTeacherAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTeacherAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.teacherAttendance = action.payload.data;
      })
      .addCase(getTeacherAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getOverallAttendance
      .addCase(getOverallAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOverallAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.overallAttendance = action.payload.data;
      })
      .addCase(getOverallAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getDailyAttendanceReport
      .addCase(getDailyAttendanceReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDailyAttendanceReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dailyReport = action.payload.data;
      })
      .addCase(getDailyAttendanceReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // getMonthlyAttendanceReport
      .addCase(getMonthlyAttendanceReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyAttendanceReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.monthlyReport = action.payload.data;
      })
      .addCase(getMonthlyAttendanceReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearAttendanceData } = attendanceStatsSlice.actions;
export default attendanceStatsSlice.reducer;