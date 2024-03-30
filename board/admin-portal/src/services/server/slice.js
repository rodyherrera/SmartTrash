import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
    isAPUpdateLoading: false,
    apConfig: {}
};

const serverSlice = createSlice({
    name: 'server',
    initialState: state,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setIsAPUpdateLoading: (state, action) => {
            state.isAPUpdateLoading = action.payload;
        },
        setAPConfig: (state, action) => {
            state.apConfig = action.payload;
        }
    }
});

export const {
    setError,
    setIsLoading,
    setAPConfig,
    setIsAPUpdateLoading
} = serverSlice.actions;

export default serverSlice.reducer;