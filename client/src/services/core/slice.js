import { createSlice } from '@reduxjs/toolkit';

const state = {
    isHeaderAnimated: false
};

const coreSlice = createSlice({
    name: 'core',
    initialState: state,
    reducers: {
        setIsHeaderAnimated(state, action){
            state.isHeaderAnimated = action.payload;
        }
    }
});

export const {
    setIsHeaderAnimated
} = coreSlice.actions;

export default coreSlice.reducer;