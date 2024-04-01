import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
    user: {}
};

const authSlice = createSlice({
    name: 'auth',
    initialState: state,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const {
    setError,
    setIsLoading,
    setUser
} = authSlice.actions;

export default authSlice.reducer;