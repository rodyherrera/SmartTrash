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

import APIRequestBuilder from '@utilities/apiRequestBuilder';

/**
 * @constant DeviceAPI
 * @description Represents the base endpoint for device's-related API requests.
 * @type {APIRequestBuilder} An instance of the APIRequestBuilder utility.
*/
export const DeviceAPI = new APIRequestBuilder('/device');

export const updateMyDevice = DeviceAPI.register({
    path: '/me/:id/',
    method: 'PATCH'
});

export const createDevice = DeviceAPI.register({
    path: '/',
    method: 'POST'
});

export const getMyDevices = DeviceAPI.register({
    path: '/me/',
    method: 'GET'
});

export const getDeviceAnalytics = DeviceAPI.register({
    path: '/:id/analytics/',
    method: 'GET'
});