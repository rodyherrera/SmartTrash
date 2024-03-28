/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/CleverBin/
 *
 * All your applications, just in one place. 
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
****/

import { configureStore } from '@reduxjs/toolkit';
import NetworkReducer from '@services/network/slice';

/**
 * @function configureStore 
 * @description Configures the Redux store for the CleverBin Admin Portal application.
 * @param {Object} options - Configuration options for the Redux store.
 * @param {Object} options.reducer - A combined reducer object containing slices of state for different application areas.
 * @returns {Store} The configured Redux store.
*/
const store = configureStore({
    reducer: {
        network: NetworkReducer
    }
});

export default store;