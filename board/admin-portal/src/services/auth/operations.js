import * as authService from '@services/auth/service';
import * as authSlice from '@services/auth/slice';
import OperationHandler from '@utilities/operationHandler';

export const signUp = (body) => async (dispatch) => {
    const operation = new OperationHandler(authSlice, dispatch);
    operation.on('response', console.log);
    operation.use({
        api: authService.signUp,
        loaderState: authSlice.setIsLoading,
        responseState: authSlice.setUser,
        query: { body }
    });
};