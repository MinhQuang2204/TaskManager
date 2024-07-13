// Redux slice (toastSlice.js)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shownToasts: [], // Mảng lưu các id của các toast đã được hiển thị
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addShownToast(state, action) {
            state.shownToasts.push(action.payload);
        },
        removeShownToast(state, action) {
            state.shownToasts = state.shownToasts.filter(id => id !== action.payload);
        },
        resetShownToasts(state) {
            state.shownToasts = [];
        },
    },
});

export const { addShownToast, removeShownToast, resetShownToasts } = toastSlice.actions;
export default toastSlice.reducer;
