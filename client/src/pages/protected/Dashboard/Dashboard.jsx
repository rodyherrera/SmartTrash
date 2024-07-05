import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyDevices } from '@services/device/operations';
import { useNavigate } from 'react-router-dom';
import DeviceViewer from '@components/dashboard/DeviceViewer';
import './Dashboard.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { isLoading, devices } = useSelector((state) => state.device);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getMyDevices());
    }, []);

    useEffect(() => {
        if(isLoading || devices.length) return;
        navigate('/device/new/');
    }, [devices, isLoading]);

    return devices.map((props, index) => (
        <DeviceViewer key={index} {...props} />
    ));
};

export default DashboardPage;