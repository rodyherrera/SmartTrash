import APIRequestBuilder from '@utilities/apiRequestBuilder';
export const ServerAPI = new APIRequestBuilder('/server');

export const getAPConfig = ServerAPI.register({
    path: '/ap-config/',
    method: 'GET'
});

export const updateAPConfig = ServerAPI.register({
    path: '/ap-config/',
    method: 'PUT'
});

export const restartESP = ServerAPI.register({
    path: '/restart/',
    method: 'GET'
});

export const resetAPConfig = ServerAPI.register({
    path: '/ap-config/reset/',
    method: 'GET'
});