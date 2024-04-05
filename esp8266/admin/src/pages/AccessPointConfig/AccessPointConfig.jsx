import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAPConfig, updateAPConfig } from '@services/server/operations';
import { CircularProgress } from '@mui/material';
import Breadcrumbs from '@components/general/Breadcrumbs';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import './AccessPointConfig.css';

const AccessPointConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apConfig, isLoading, isAPUpdateLoading } = useSelector((state) => state.server);
    const [ssid, setSSID] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(getAPConfig());
        return () => {
            setSSID('');
            setPassword('');
        };
    }, []);

    useEffect(() => {
        if(isLoading || !apConfig?.ssid) return;
        setSSID(apConfig.ssid);
        setPassword(apConfig.password);
    }, [isLoading]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateAPConfig({ ssid, password }, navigate));
    };

    return (
        <main id='Access-Point-Config-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Access point configuration', to: '/server/ap-config/' }
                ]}
            />
            <section id='Access-Point-Config-Header'>
                <h3 id='Access-Point-Config-Header-Title'>SmartTrash Access Point Settings</h3>  
            </section>
            {(isLoading) ? (
                <CircularProgress />
            ) : (
                <form id='Access-Point-Config-Body' onSubmit={formSubmitHandler}>
                    <Input
                        value={ssid}
                        onChange={(e) => setSSID(e.target.value)}
                        placeholder='Enter a network name for your device i.e "Cool Trash"' />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Try to enter a password that is strong enough for your network.' />
                    <Button
                        type='submit'
                        title='Save Changes'
                        isLoading={isAPUpdateLoading} />
                </form>
            )}
        </main>
    )
};

export default AccessPointConfig;