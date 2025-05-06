// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './features/courses/courseSlice';
import groupReducer from './features/groups/groupSlice';
import userReducer from './features/users/userSlice';
import departmentReducer from './features/departments/departmentSlice';
import authReducer from './features/auth/authSlice';
import classReducer from './features/class/classSlice'

// Configure store without navigation middleware initially
const store = configureStore({
  reducer: {
    courses: courseReducer,
    groups: groupReducer,
    users: userReducer,
    departments: departmentReducer,
    auth: authReducer,
    classes: classReducer,
  },
});



export default store;