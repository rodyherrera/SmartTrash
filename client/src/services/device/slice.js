import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    device: {},
    isLoading: false,
    devices: [],
    isAnalyticsLoading: true,
    analytics: {}
};

const deviceSlice = createSlice({
    name: 'device',
    initialState: state,
    reducers: {
        setIsAnalyticsLoading(state, action){
            state.isAnalyticsLoading = action.payload;
        },
        setAnalytics(state, action){
            state.analytics = action.payload;
        },
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
    setAnalytics,
    setIsAnalyticsLoading,
    setError,
    setDevices,
    setDevice,
    setIsLoading
} = deviceSlice.actions;

export default deviceSlice.reducer;