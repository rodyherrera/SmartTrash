import React from 'react';
import CurrentWiFiConnection from '@components/network/CurrentWiFiConnection';
import RestartESPButton from '@components/server/RestartESPButton';
import ResetAPConfigButton from '@components/server/ResetAPConfigButton';
import './Header.css';

const Header = () => {

    return (
        <header className='Header-Container'>
            <section className='Header-Brand-Container'>
                <h3 className='Header-Brand-Title'>ST</h3>
            </section>
            <section className='Header-ESP-Related-Container'>
                <ResetAPConfigButton />
                <RestartESPButton />
                <CurrentWiFiConnection />
            </section>
        </header>
    );
};

export default Header;