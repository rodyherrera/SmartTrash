import { configureStore } from '@reduxjs/toolkit';
import coreReducer from '@services/core/slice';

/**
 * @function configureStore 
 * @description Configures the Redux store for the SmartTrash Admin Portal application.
 * @param {Object} options - Configuration options for the Redux store.
 * @param {Object} options.reducer - A combined reducer object containing slices of state for different application areas.
 * @returns {Store} The configured Redux store.
*/
const store = configureStore({
    reducer: {
        core: coreReducer
    }
});

export default store;