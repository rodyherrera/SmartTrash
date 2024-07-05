import { createSlice } from '@reduxjs/toolkit';

const state = {
    deviceLogs: [],
    page: 1,
    isLoading: true,
    errors: [],
    totalPages: 1,
    totalResults: 1,
    error: null
};

const deviceLogSlice = createSlice({
    name: 'deviceLog',
    initialState: state,
    reducers: {
        setDeviceLogs(state, action){
            state.deviceLogs = action.payload;
        },
        setTotalPages(state, action){
            state.totalPages = action.payload;
        },
        setPage(state, action){
            state.page = action.payload;
        },
        setIsLoading(state, action){
            state.isLoading = action.payload;
        },
        addError(state, action){
            const error = action.payload;
            state.errors.push(error);
        },
        setTotalResults(state, action){
            state.totalResults = action.payload;
        },
        removeError(state, action){
            const errorId = action.payload;
            state.errors = state.errors.filter((error) => error.id !== errorId);
        },
        setError(state, action){
            state.error = action.payload;
        }
    }
});

export const {
    setIsLoading,
    setTotalResults,
    addError,
    setError,
    removeError,
    setDeviceLogs,
    setTotalPages,
    setPage
} = deviceLogSlice.actions;

export default deviceLogSlice.reducer;