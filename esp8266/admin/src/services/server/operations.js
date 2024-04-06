import * as serverService from '@services/server/service';
import * as serverSlice from '@services/server/slice';
import OperationHandler from '@utilities/operationHandler';

export const getAPConfig = () => async (dispatch) => {
    const operation = new OperationHandler(serverSlice, dispatch);
    operation.use({
        api: serverService.getAPConfig,
        loaderState: serverSlice.setIsLoading,
        responseState: serverSlice.setAPConfig
    });
};

export const updateAPConfig = (body, navigate) => async (dispatch) => {
    const operation = new OperationHandler(serverSlice, dispatch);
    operation.on('response', () => navigate('/'));
    operation.use({
        api: serverService.updateAPConfig,
        loaderState: serverSlice.setIsAPUpdateLoading,
        query: { body }
    });
};

export const restartESP = () => async (dispatch) => {
    const operation = new OperationHandler(serverSlice, dispatch);
    operation.use({
        api: serverService.restartESP
    });
};

export const resetAPConfig = () => async (dispatch) => {
    const operation = new OperationHandler(serverSlice, dispatch);
    operation.use({
        api: serverService.resetAPConfig,
        loaderState: serverSlice.setIsAPUpdateLoading
    });
};

export const getDeviceUID = () => async (dispatch) => {
    const operation = new OperationHandler(serverSlice, dispatch);
    operation.use({
        api: serverService.getDeviceUID,
        loaderState: serverSlice.setIsDeviceUIDLoading,
        responseState: serverSlice.setDeviceUID
    });
};