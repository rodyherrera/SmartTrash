import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
    isAPUpdateLoading: false,
    apConfig: {},
    isDeviceUIDLoading: true,
    deviceUID: ''
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
        },
        setIsDeviceUIDLoading: (state, action) => {
            state.isDeviceUIDLoading = action.payload;
        },
        setDeviceUID: (state, action) => {
            state.deviceUID = action.payload;
        }
    }
});

export const {
    setError,
    setIsLoading,
    setIsDeviceUIDLoading,
    setDeviceUID,
    setAPConfig,
    setIsAPUpdateLoading
} = serverSlice.actions;

export default serverSlice.reducer;