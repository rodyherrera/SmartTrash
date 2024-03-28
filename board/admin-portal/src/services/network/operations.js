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