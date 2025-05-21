
import { createSlice } from "@reduxjs/toolkit";
import { 
  openAttendanceWindow, 
  closeAttendanceWindow, 
  markAttendanceByFaceAndLocation, 
  markAttendanceManually, 
  bulkMarkAttendance, 
  getClassAttendance, 
  getStudentAttendance, 
  getAttendanceWindowStatus,
  verifyFaceEmbedding,
  checkLocationValidityAndMarkPresent
} from "./attendanceThunks";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  error: null,
  
  // Teacher-specific states
  classAttendance: {
    class: null,
    attendance: [],
    stats: {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    }
  },
  attendanceWindow: {
    isOpen: false,
    openedAt: null,
    closesAt: null,
  },
  
  // Student-specific states
  studentAttendance: {
    attendanceRecords: [],
    stats: {
      totalClasses: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      percentage: 0
    }
  },
  currentAttendanceStatus: null,
  
  // New face and location verification states
  faceVerification: {
    isVerified: false,
    confidence: null,
    message: null
  },
  locationVerification: {
    isValid: false,
    distance: null,
    message: null
  }
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.error = null;
    },
    resetStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.error = null;
    },
    clearAttendanceData: (state) => {
      state.classAttendance = {
        class: null,
        attendance: [],
        stats: {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        }
      };
      state.studentAttendance = {
        attendanceRecords: [],
        stats: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          percentage: 0
        }
      };
      state.attendanceWindow = {
        isOpen: false,
        openedAt: null,
        closesAt: null,
      };
      state.currentAttendanceStatus = null;
      state.faceVerification = {
        isVerified: false,
        confidence: null,
        message: null
      };
      state.locationVerification = {
        isValid: false,
        distance: null,
        message: null
      };
    },
    resetVerificationData: (state) => {
      state.faceVerification = {
        isVerified: false,
        confidence: null,
        message: null
      };
      state.locationVerification = {
        isValid: false,
        distance: null,
        message: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // openAttendanceWindow
      .addCase(openAttendanceWindow.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(openAttendanceWindow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.attendanceWindow = {
          isOpen: true,
          openedAt: action.payload.data.openedAt,
          closesAt: action.payload.data.closesAt
        };
      })
      .addCase(openAttendanceWindow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // closeAttendanceWindow
      .addCase(closeAttendanceWindow.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(closeAttendanceWindow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.attendanceWindow = {
          isOpen: false,
          openedAt: null,
          closesAt: null
        };
      })
      .addCase(closeAttendanceWindow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // markAttendanceManually
      .addCase(markAttendanceManually.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(markAttendanceManually.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        
        // Update attendance in state if we have the class attendance loaded
        if (state.classAttendance.attendance.length > 0) {
          const markedStudent = action.payload.data;
          const index = state.classAttendance.attendance.findIndex(
            item => item.student._id === markedStudent.student
          );
          
          if (index !== -1) {
            state.classAttendance.attendance[index].attendance = {
              status: markedStudent.status,
              markedBy: markedStudent.markedBy,
              markedAt: markedStudent.markedAt,
              notes: markedStudent.notes
            };
            
            // Update stats
            // Note: This is a simplified approach; in a real app, you might want to recalculate stats completely
            // or fetch updated stats from backend
            if (state.classAttendance.attendance[index].attendance.status !== markedStudent.status) {
              // Decrement old status count
              if (state.classAttendance.attendance[index].attendance.status) {
                state.classAttendance.stats[state.classAttendance.attendance[index].attendance.status] -= 1;
              }
              // Increment new status count
              state.classAttendance.stats[markedStudent.status] += 1;
            }
          }
        }
      })
      .addCase(markAttendanceManually.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // bulkMarkAttendance
      .addCase(bulkMarkAttendance.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(bulkMarkAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(bulkMarkAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // getClassAttendance
      .addCase(getClassAttendance.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getClassAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classAttendance = action.payload.data;
        console.log(action.payload.data);
      })
      .addCase(getClassAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // markAttendanceByFaceAndLocation
      .addCase(markAttendanceByFaceAndLocation.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(markAttendanceByFaceAndLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.currentAttendanceStatus = {
          status: action.payload.data.status,
          markedAt: action.payload.data.markedAt,
          faceRecognized: action.payload.data.faceRecognized,
          locationVerified: action.payload.data.locationVerified
        };
      })
      .addCase(markAttendanceByFaceAndLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // getStudentAttendance
      .addCase(getStudentAttendance.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
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
        state.error = action.payload;
      })
      
      // getAttendanceWindowStatus
      .addCase(getAttendanceWindowStatus.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getAttendanceWindowStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceWindow = {
          isOpen: action.payload.data.isOpen,
          openedAt: action.payload.data.isOpen ? action.payload.data.windowDetails.openedAt : null,
          closesAt: action.payload.data.isOpen ? action.payload.data.windowDetails.closesAt : null
        };
        state.currentAttendanceStatus = action.payload.data.attendanceStatus;
      })
      .addCase(getAttendanceWindowStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
      })
      
      // New Face Verification Cases
      .addCase(verifyFaceEmbedding.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.faceVerification = {
          ...state.faceVerification,
          isVerified: false
        };
      })
      .addCase(verifyFaceEmbedding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.faceVerification = {
          isVerified: action.payload.data.isVerified,
          confidence: action.payload.data.confidence,
          message: action.payload.message
        };
      })
      .addCase(verifyFaceEmbedding.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
        state.faceVerification = {
          isVerified: false,
          confidence: null,
          message: action.payload
        };
      })
      
      // New Location Verification Cases
      .addCase(checkLocationValidityAndMarkPresent.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.locationVerification = {
          ...state.locationVerification,
          isValid: false
        };
      })
      .addCase(checkLocationValidityAndMarkPresent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.locationVerification = {
          isValid: action.payload.data.isValid,
          distance: action.payload.data.distance,
          message: action.payload.message
        };
      })
      .addCase(checkLocationValidityAndMarkPresent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.error = action.payload;
        state.locationVerification = {
          isValid: false,
          distance: null,
          message: action.payload
        };
      });
  }
});

export const { reset, resetStatus, clearAttendanceData, resetVerificationData } = attendanceSlice.actions;
export default attendanceSlice.reducer;