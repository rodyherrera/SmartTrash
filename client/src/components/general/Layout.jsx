import React, { useEffect } from 'react';
import Header from '@components/general/Header';
import { authenticateWithCachedToken } from '@services/authentication/utils';
import { resetErrorForAllSlices } from '@services/core/operations';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGLTF } from '@react-three/drei';

const Layout = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(resetErrorForAllSlices());
    }, [location.pathname]);

    useEffect(() => {
        if(isAuthenticated) return;
        authenticateWithCachedToken(dispatch);
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        useGLTF.preload('/gltf/TrashCan.gltf');
    }, []);

    return (
        <React.Fragment>
            <Header />
            <Outlet />
        </React.Fragment>
    );
};

export default Layout;