import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    device: {},
    isLoading: false,
    devices: []
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
        },
        setDevices(state, action){
            state.devices = action.payload;
        }
    }
});

export const {
    setError,
    setDevices,
    setDevice,
    setIsLoading
} = deviceSlice.actions;

export default deviceSlice.reducer;