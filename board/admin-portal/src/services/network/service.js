import APIRequestBuilder from '@utilities/apiRequestBuilder';
export const NetworkAPI = new APIRequestBuilder('/network');

export const getAvailableNetworks = NetworkAPI.register({
    path: '/',
    method: 'GET'
});

export const saveNetworkConnection = NetworkAPI.register({
    path: '/',
    method: 'POST'
});

export const isESPConnectedToWiFi = NetworkAPI.register({
    path: '/is-connected/',
    method: 'GET'
});