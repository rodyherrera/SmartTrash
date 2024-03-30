import React from 'react';
import CurrentWiFiConnection from '@components/network/CurrentWiFiConnection';
import './Header.css';

const Header = () => {

    return (
        <header className='Header-Container'>
            <section className='Header-Brand-Container'>
            </section>
            <section className='Header-ESP-Related-Container'>
                <CurrentWiFiConnection />
            </section>
        </header>
    );
};

export default Header;