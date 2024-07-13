import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import taskReducer from './taskSlice';
import toastSlice from './toastSlice';

export const store = configureStore({
	reducer: { auth: authReducer, task: taskReducer, toast: toastSlice },
});
