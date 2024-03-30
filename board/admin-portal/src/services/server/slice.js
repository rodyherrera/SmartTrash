import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
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
        setAPConfig: (state, action) => {
            state.apConfig = action.payload;
        }
    }
});

export const {
    setError,
    setIsLoading,
    setAPConfig
} = serverSlice.actions;

export default serverSlice.reducer;