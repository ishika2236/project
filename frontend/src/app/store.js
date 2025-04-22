import {configureStore} from '@reduxjs/toolkit';
import courseReducer from './features/courses/courseSlice'
import groupReducer from './features/groups/groupSlice'
import userReducer from './features/users/userSlice'

const store = configureStore({
    reducer:{
        courses: courseReducer,
        groups: groupReducer,
        users : userReducer,
    },
});

export default store;