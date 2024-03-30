/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/SmartTrash/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
****/

import { configureStore } from '@reduxjs/toolkit';
import networkReducer from '@services/network/slice';
import coreReducer from '@services/core/slice';
import serverReducer from '@services/server/slice';

/**
 * @function configureStore 
 * @description Configures the Redux store for the SmartTrash Admin Portal application.
 * @param {Object} options - Configuration options for the Redux store.
 * @param {Object} options.reducer - A combined reducer object containing slices of state for different application areas.
 * @returns {Store} The configured Redux store.
*/
const store = configureStore({
    reducer: {
        network: networkReducer,
        core: coreReducer,
        server: serverReducer
    }
});

export default store;