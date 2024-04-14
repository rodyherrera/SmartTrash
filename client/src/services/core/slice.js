import { createSlice } from '@reduxjs/toolkit';

const state = {
    isHeaderAnimated: false,
    errors: [],
    error: null
};

const coreSlice = createSlice({
    name: 'core',
    initialState: state,
    reducers: {
        setIsHeaderAnimated(state, action){
            state.isHeaderAnimated = action.payload;
        },
        addError(state, action){
            const error = action.payload;
            state.errors.push(error);
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
    setIsHeaderAnimated,
    addError,
    setError,
    removeError
} = coreSlice.actions;

export default coreSlice.reducer;