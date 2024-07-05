import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import { RxHeight } from 'react-icons/rx';
import { IoTodayOutline } from 'react-icons/io5';
import { PiDatabaseLight } from 'react-icons/pi';
import { MdOutlineEmail } from 'react-icons/md';
import { getDeviceAnalytics, countDeviceLogs, updateMyDevice } from '@services/device/operations';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Input from '@components/general/Input';
import StatCard from '@components/general/StatCard';
import DeviceUsagePercentage from '@components/dashboard/DeviceUsagePercentage';
import DeviceAverageUsage from '@components/dashboard/DeviceAverageUsage';
import DeviceNotificationManager from '@components/dashboard/DeviceNotificationManager';
import DeviceCalibration from '@components/dashboard/DeviceCalibration';
import DeviceNotificationSettings from '@components/dashboard/DeviceNotificationSettings';
import useDeviceMeasurement from '@hooks/useDeviceMeasurement';
import './DeviceViewer.css';

const TrashCanModel = lazy(() => import('@components/general/TrashCanModel'));

const DeviceViewer = ({ _id, name, height, notificationEmails, notificationPercentages, notificationsSent, stduid }) => {
    const dispatch = useDispatch();
    const { usagePercentage, distance } = useDeviceMeasurement(_id);
    const { deviceLogsCount } = useSelector((state) => state.device);
    const [deviceName, setDeviceName] = useState(name);
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(updateMyDevice(_id, { name: deviceName }));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [deviceName]);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from('.Device-Viewer-Left-Container', {
            x: -100,
            opacity: 0,
            duration: 0.5
        });
        tl.from('.Device-Viewer-Center-Container', {
            y: 50,
            opacity: 0,
            duration: 0.5 
        }, "-=0.25"); 
        tl.from('.Device-Viewer-Right-Container', {
            x: 100,
            opacity: 0,
            duration: 0.5 
        }, "-=0.25");
        tl.from('.Stat-Card-Container, .Device-Viewer-3D-Model-Container, .Device-Viewer-Caption-Container, .Device-Viewer-Right-Header-Container, .Device-Notification-Settings-Container, .Device-Calibration-Container', {
            scale: 0.95,
            opacity: 0,
            stagger: 0.05, 
            duration: 0.25 
        }, "-=0.25"); 
        dispatch(getDeviceAnalytics(_id));
        dispatch(countDeviceLogs(_id));
    }, []);

    return (
        <main className='Device-Viewer-Container'>
            <section className='Device-Viewer-Left-Container'>
                <article className='Device-Viewer-Left-Header-Container'>
                    <div className='Device-Stats-Container'>
                        <StatCard Icon={RxHeight} title='Garbage Container Height' content={height + ' cm'} />
                        <StatCard 
                            Icon={PiDatabaseLight} 
                            onClick={() => navigate('/device/' + encodeURIComponent(stduid) + '/logs/')}
                            title='Stored Device Logs' 
                            content={deviceLogsCount.logs} />
                        <StatCard Icon={IoTodayOutline} title='Estimated Uptime Days' content={deviceLogsCount.logsPartition} />
                        <StatCard Icon={MdOutlineEmail} title='Total notifications sent' content={notificationsSent} />
                    </div>
                </article>
                <article className='Device-Viewer-Left-Bottom-Container'>
                    <DeviceNotificationManager id={_id} notificationEmails={notificationEmails} />
                </article>
            </section>
            <section className='Device-Viewer-Center-Container'>
                <p className='Device-Viewer-Current-Distance'>Device sensor reading {distance} cm</p>
                <DeviceUsagePercentage usagePercentage={usagePercentage} />
                <article className='Device-Viewer-3D-Model-Container'>
                    <Suspense fallback={<div>...</div>}>
                        <TrashCanModel />
                    </Suspense>
                </article>
                <article className='Device-Viewer-Caption-Container'>
                    <div className='Device-Viewer-Caption-Name-Container'>
                        <i className='Device-Viewer-Previous-Icon-Container'>
                            <GoChevronLeft />
                        </i>
                        <Input 
                            variant='Highlight Device-Viewer-Name Small No-Focus Text'
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                        />
                        <i className='Device-Viewer-Next-Icon-Container'>
                            <GoChevronRight />
                        </i>
                    </div>
                    <p className='Device-Viewer-Navigation-Helper-Text'>You can navigate between your devices using the left and right arrows.</p>
                </article>
            </section>
            <section className='Device-Viewer-Right-Container'>
                <article className='Device-Viewer-Right-Header-Container'>
                    <DeviceAverageUsage />
                </article>
                <article className='Device-Viewer-Right-Bottom-Container'>
                    <DeviceNotificationSettings id={_id} currentPercentages={notificationPercentages} />
                    <DeviceCalibration id={_id} />
                </article>
            </section>
        </main>
    );
};

export default DeviceViewer;