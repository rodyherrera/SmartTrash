import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
    networks: [],
    isConnectedToWiFiLoading: true,
    isConnectedToWiFi: {}
};

const networkSlice = createSlice({
    name: 'network',
    initialState: state,
    reducers: {
        setIsConnectedToWiFi: (state, action) => {
            state.isConnectedToWiFi = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setIsConnectedToWiFiLoading: (state, action) => {
            state.isConnectedToWiFiLoading = action.payload;
        },
        setError(state, action){
            state.error = action.payload;
        },
        setNetworks(state, action){
            state.networks = action.payload;
        }
    }
});

export const {
    setError,
    setIsLoading,
    setData,
    setNetworks,
    setIsConnectedToWiFi,
    setIsConnectedToWiFiLoading
} = networkSlice.actions;

export default networkSlice.reducer;