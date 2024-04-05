import APIRequestBuilder from '@utilities/apiRequestBuilder';
export const AuthAPI = new APIRequestBuilder('/auth');

export const signUp = AuthAPI.register({
    path: '/sign-up/',
    method: 'POST'
});