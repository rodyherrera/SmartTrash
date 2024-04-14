import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    device: {},
    isLoading: false
};

const deviceSlice = createSlice({
    name: 'device',
    initialState: state,
    reducers: {
        setError(state, action){
            state.error = action.payload;
        },
        setIsLoading(state, action){
            state.isLoading = action.payload;
        },
        setDevice(state, action){
            state.device = action.payload;
        }
    }
});

export const {
    setError,
    setDevice,
    setIsLoading
} = deviceSlice.actions;

export default deviceSlice.reducer;