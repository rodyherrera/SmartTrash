import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyDevices } from '@services/device/operations';
import DeviceViewer from '@components/dashboard/DeviceViewer';
import './Dashboard.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { isLoading, devices } = useSelector((state) => state.device);

    useEffect(() => {
        dispatch(getMyDevices());
    }, []);

    return devices.map((props, index) => (
        <DeviceViewer key={index} {...props} />
    ));
};

export default DashboardPage;