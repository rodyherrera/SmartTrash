import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: true,
    isDeviceCreating: false,
    devices: [],
    isAnalyticsLoading: true,
    analytics: {},
    isUpdateLoading: false,
    isDeviceLogsCountLoading: true,
    deviceLogsCount: {}
};

const deviceSlice = createSlice({
    name: 'device',
    initialState: state,
    reducers: {
        setIsUpdateLoading(state, action){
            state.isUpdateLoading = action.payload;
        },
        setIsDeviceCreating(state, action){
            state.isDeviceCreating = action.payload;
        },
        setIsDeviceLogsCountLoading(state, action){
            state.isDeviceLogsCountLoading = action.payload;
        },
        setDeviceLogsCount(state, action){
            state.deviceLogsCount = action.payload;
        },
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
            state.devices = state.devices.map((device) => {
                if(device.id === action.payload.id) return action.payload;
                return device;
            });
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
    setIsUpdateLoading,
    setDevices,
    setDevice,
    setIsDeviceCreating,
    setDeviceLogsCount,
    setIsDeviceLogsCountLoading,
    setIsLoading
} = deviceSlice.actions;

export default deviceSlice.reducer;