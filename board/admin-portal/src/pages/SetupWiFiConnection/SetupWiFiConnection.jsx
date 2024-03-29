import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '@components/general/Breadcrumbs';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import { saveNetworkConnection } from '@services/network/operations';
import './SetupWiFiConnection.css';

const SetupWiFiConnection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ssid = new URLSearchParams(location.search).get('ssid');
    const [password, setPassword] = useState('');
    const { isLoading } = useSelector((state) => state.network);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(saveNetworkConnection({ ssid, password }, navigate));
    };

    useEffect(() => {
        if(!ssid) return navigate('/wifi/networks/');
        return () => {
            setPassword('');
        };
    }, []);

    return (
        <main id='Setup-WiFi-Connection-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connect to the Internet', to: '/wifi/networks/' },
                    { title: `Setup "${ssid}" WiFi connection`, to: `/wifi/setup-network?ssid=${ssid}` }
                ]}
            />
            <section id='Setup-WiFi-Connection-Header'>
                <h3 id='Setup-WiFi-Connection-Title'>We're almost ready with "{ssid}"</h3>
            </section>
            <form id='Setup-WiFi-Connection-Body' onSubmit={formSubmitHandler}>
                <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter the network password i.e "12345678"'/>
                <Button 
                    type='submit'
                    title='Connect to WiFi' 
                    isLoading={isLoading} />
            </form>
        </main>
    );
};

export default SetupWiFiConnection;