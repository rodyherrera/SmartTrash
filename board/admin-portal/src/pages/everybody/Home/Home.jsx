import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableNetworks } from '@services/network/operations';
import './Home.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const { networks } = useSelector((state) => state.network);

    useEffect(() => {
        dispatch(getAvailableNetworks());
    }, []);

    useEffect(() => {
        console.log('Networks ->', networks);
    }, [networks]);

    return (
        <main id='Home-Main'>
            <h1>Hello world</h1>
        </main>
    );
};

export default HomePage;