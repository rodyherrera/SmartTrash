import React from 'react';
import Breadcrumbs from '@components/general/Breadcrumbs';
import RectangleCard from '@components/general/RectangleCard';
import { deleteCurrentWiFiNetwork } from '@services/network/operations';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CurrentWiFiConnection.css';

const CurrentWiFiConnection = () => {
    const { isConnectedToWiFi, isCurrentWiFiRemoveLoading } = useSelector((state) => state.network);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const disconnectFromNetworkHandler = () => {
        dispatch(deleteCurrentWiFiNetwork(navigate));
    };

    return (
        <main id='Current-WiFi-Connection-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connect to the Internet', to: '/wifi/networks/' },
                    { title: 'Current WiFi Connection', to: '/wifi/current-network/' }
                ]}
            />
            <section id='Current-WiFi-Connection-Header'>
                <h3 id='Current-WiFi-Connection-Title'>You are currently connected to "{isConnectedToWiFi.ssid}"</h3>
            </section>
            <section id='Current-WiFi-Connection-Body'>
                <RectangleCard 
                    onClick={disconnectFromNetworkHandler}
                    title='Disconnect from the network' 
                    isLoading={isCurrentWiFiRemoveLoading} />
                <RectangleCard title='Forget network' />
            </section>
        </main>
    );
};

export default CurrentWiFiConnection;