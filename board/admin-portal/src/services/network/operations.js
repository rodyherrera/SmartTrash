import * as networkService from '@services/network/service';
import * as networkSlice from '@services/network/slice';
import OperationHandler from '@utilities/operationHandler';

export const getAvailableNetworks = () => async (dispatch) => {
    const operation = new OperationHandler(networkSlice, dispatch);
    operation.use({
        api: networkService.getAvailableNetworks,
        loaderState: networkSlice.setIsLoading,
        responseState: networkSlice.setNetworks
    });
};

export const isESPConnectedToWiFi = () => async (dispatch) => {
    const operation = new OperationHandler(networkSlice, dispatch);
    operation.use({
        api: networkService.isESPConnectedToWiFi,
        loaderState: networkSlice.setIsConnectedToWiFiLoading,
        responseState: networkSlice.setIsConnectedToWiFi
    });
};

export const saveNetworkConnection = (body, navigate) => async (dispatch) => {
    const operation = new OperationHandler(networkSlice, dispatch);
    operation.on('response', () => navigate('/'));
    operation.use({
        api: networkService.saveNetworkConnection,
        loaderState: networkSlice.setIsLoading,
        query: { body }
    });
};