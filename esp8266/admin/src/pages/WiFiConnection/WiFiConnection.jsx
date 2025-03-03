import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAvailableNetworks } from '@services/network/operations';
import { CircularProgress } from '@mui/material';
import Breadcrumbs from '@components/general/Breadcrumbs';
import WiFiConnectionCard from '@components/network/WiFiConnectionCard';
import './WiFiConnection.css';

const WiFiConnection = () => {
    const dispatch = useDispatch();
    const { isLoading, networks } = useSelector((state) => state.network);

    useEffect(() => {
        dispatch(getAvailableNetworks());
    }, []);

    return (
        <main id='WiFi-Connection-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connect to the Internet', to: '/wifi/networks/' }
                ]}
            />
            <section id='WiFi-Connection-Header'>
                <h3 id='WiFi-Connection-Title'>Connecting your SmartTrash to WiFi</h3>
            </section>
            {(isLoading) ? (
                <CircularProgress />
            ) : (
                <React.Fragment>
                    <section id='WiFi-Connection-Available-List'>
                        {networks.map(({ ssid, isCurrent }, index) => (
                            <WiFiConnectionCard ssid={ssid} key={index} isCurrent={isCurrent} />
                        ))}
                    </section>
                </React.Fragment>
            )}
        </main>
    );
};

export default WiFiConnection;