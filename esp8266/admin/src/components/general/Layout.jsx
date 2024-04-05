import React from 'react';
import Header from '@components/general/Header';
import Footer from '@components/general/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {

    return (
        <React.Fragment>
            <Header />
            <Outlet />
            <Footer />
        </React.Fragment>
    );
};

export default Layout;