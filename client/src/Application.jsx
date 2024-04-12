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
                <Route index element={<pages.everybody.Home />} />
                <Route path='/auth/sign-in/' element={<pages.guest.SignIn />} />
                <Route path='/auth/sign-up/' element={<pages.guest.SignUp />} />
            </Route>
        </Routes>
    );
}

export default Application;