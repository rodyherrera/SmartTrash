import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@components/general/Layout';
import pages from '@pages';

const Application = () => {
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: 0 })
    }, [location.pathname])

    return (
        <Routes location={location} key={location.pathname}>
            <Route element={<Layout />}>
                <Route index element={<pages.Home />} />
                <Route path='/wifi/networks/' element={<pages.WiFiConnection />} />
                <Route path='/wifi/setup-network/' element={<pages.SetupWiFiConnection />} />
                <Route path='/wifi/current-network/' element={<pages.CurrentWiFiConnection />} />
                <Route path='/server/ap-config/' element={<pages.AccessPointConfig />} />

                <Route path='/cloud/connect/' element={<pages.LinkingDevice />} />
            </Route>
        </Routes>
    );
}

export default Application;