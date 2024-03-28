import APIRequestBuilder from '@utilities/apiRequestBuilder';
export const NetworkAPI = new APIRequestBuilder('/network');

export const getAvailableNetworks = NetworkAPI.register({
    path: '/',
    method: 'GET',
    isESP8266Endpoint: true
});

export const saveNetworkConnection = NetworkAPI.register({
    path: '/',
    method: 'POST',
    isESP8266Endpoint: true
});