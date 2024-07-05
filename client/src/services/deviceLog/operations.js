import * as deviceLogSlice from '@services/deviceLog/slice';
import * as deviceLogService from '@services/deviceLog/service';
import OperationHandler from '@utilities/operationHandler';

export const getDeviceLogs = (page, stduid, setLoaderState = true) => (dispatch) => {
    const operation = new OperationHandler(deviceLogService, dispatch);
    operation.on('fullResponse', ({ page, results }) => {
        dispatch(deviceLogSlice.setTotalPages(page.total));
        dispatch(deviceLogSlice.setTotalResults(results.total));
    });
    operation.use({
        api: deviceLogService.getDeviceLogs,
        loaderState: setLoaderState ? deviceLogSlice.setIsLoading : undefined,
        responseState: deviceLogSlice.setDeviceLogs,
        query: { query: { queryParams: { page, stduid } } }
    });
};