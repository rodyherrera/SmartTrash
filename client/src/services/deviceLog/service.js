import APIRequestBuilder from '@utilities/apiRequestBuilder';

export const DeviceLogAPI = new APIRequestBuilder('/devicelog');

export const getDeviceLogs = DeviceLogAPI.register({
    path: '/me/',
    method: 'GET'
});