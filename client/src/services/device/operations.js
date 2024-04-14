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
import * as deviceSlice from '@services/device/slice';
import * as deviceService from '@services/device/service';
import OperationHandler from '@utilities/operationHandler';

export const createDevice = (body) => async (dispatch) => {
    const operation = new OperationHandler(deviceSlice, dispatch);
    operation.on('response', (data) => {
        console.log(data);
        dispatch(deviceSlice.setDevice(data))
    });
    operation.use({
        api: deviceService.createDevice,
        loaderState: deviceSlice.setIsLoading,
        query: { body }
    });
};