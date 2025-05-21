// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './features/courses/courseSlice';
import groupReducer from './features/groups/groupSlice';
import userReducer from './features/users/userSlice';
import departmentReducer from './features/departments/departmentSlice';
import authReducer from './features/auth/authSlice';
import classReducer from './features/class/classSlice'
import classroomReducer from './features/classroom/classroomSlice';
import attendanceReducer from './features/attendance/attendanceSlice'
import attendanceStatsReducer from './features/attendanceStats/attendanceStatsSlice'
// Configure store without navigation middleware initially
const store = configureStore({
  reducer: {
    courses: courseReducer,
    groups: groupReducer,
    users: userReducer,
    departments: departmentReducer,
    auth: authReducer,
    classes: classReducer,
    classrooms : classroomReducer,
    attendance: attendanceReducer,
    attendanceStats : attendanceStatsReducer
  },
});



export default store;