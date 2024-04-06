import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getDeviceUID } from '@services/server/operations';
import Breadcrumbs from '@components/general/Breadcrumbs';
import './LinkingDevice.css';

const LinkingDevice = () => {
    const dispatch = useDispatch();
    const { deviceUID, isDeviceUIDLoading } = useSelector((state) => state.server);

    useEffect(() => {
        dispatch(getDeviceUID());
    }, []);

    return (
        <main id='Linking-Device-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connecting to the SmartTrash Cloud' }
                ]}
            />
            <section id='Linking-Device-Header'>
                <h3 id='Linking-Device-Title'>Linking your device to the SmartTrash Cloud</h3>
            </section>
            <section id='Linking-Device-Body'>
                {(isDeviceUIDLoading) ? (
                    <CircularProgress />                    
                ) : (
                    <React.Fragment>
                        <article id='Pair-Code-Container'>
                            <h3 id='Pair-Code'>{deviceUID}</h3>
                            <p id='Pair-Code-Description'>This is your unique pairing code. Please log in to your SmartTrash Cloud account, navigate to "pair a new device" and enter the code displayed on this screen. This code is exclusive to your device and should not be shared under any circumstances.</p>
                        </article>
                    </React.Fragment>
                )}
            </section> 
        </main>
    );
};

export default LinkingDevice;