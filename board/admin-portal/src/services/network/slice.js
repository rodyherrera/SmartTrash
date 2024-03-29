import { createSlice } from '@reduxjs/toolkit';

const state = {
    error: null,
    isLoading: false,
    networks: []
};

const networkSlice = createSlice({
    name: 'network',
    initialState: state,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
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
    setNetworks
} = networkSlice.actions;

export default networkSlice.reducer;