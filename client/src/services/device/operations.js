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
    operation.use({
        api: deviceService.createDevice,
        loaderState: deviceSlice.setIsLoading,
        responseState: deviceSlice.setDevice,
        query: { body }
    });
};

export const getMyDevices = () => (dispatch) => {
    const operation = new OperationHandler(deviceSlice, dispatch);
    operation.use({
        api: deviceService.getMyDevices,
        loaderState: deviceSlice.setIsLoading,
        responseState: deviceSlice.setDevices
    });
};

export const countDeviceLogs = (id) => async (dispatch) => {
    const operation = new OperationHandler(deviceSlice, dispatch);
    operation.use({
        api: deviceService.getDeviceAnalytics,
        loaderState: deviceSlice.setIsDeviceLogsCountLoading,
        responseState: deviceSlice.setDeviceLogsCount,
        query: { query: { params: { id }, queryParams: { type: 'countDeviceLogs' } } }
    });
};

export const getDeviceAnalytics = (id) => async (dispatch) => {
    const operation = new OperationHandler(deviceSlice, dispatch);
    operation.use({
        api: deviceService.getDeviceAnalytics,
        loaderState: deviceSlice.setIsAnalyticsLoading,
        responseState: deviceSlice.setAnalytics,
        query: { query: { params: { id } } }
    });
};