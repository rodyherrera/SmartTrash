import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import { RxHeight } from 'react-icons/rx';
import { PiDatabaseLight } from 'react-icons/pi';
import { getDeviceAnalytics, countDeviceLogs } from '@services/device/operations';
import StatCard from '@components/general/StatCard';
import DeviceUsagePercentage from '@components/dashboard/DeviceUsagePercentage';
import DeviceAverageUsage from '@components/dashboard/DeviceAverageUsage';
import DeviceNotificationManager from '@components/dashboard/DeviceNotificationManager';
import useDeviceMeasurement from '@hooks/useDeviceMeasurement';
import './DeviceViewer.css';

const TrashCanModel = lazy(() => import('@components/general/TrashCanModel'));

const DeviceViewer = ({ _id, name, height }) => {
    const dispatch = useDispatch();
    const { usagePercentage, distance } = useDeviceMeasurement(_id);
    const { isAnalyticsLoading, analytics, isDeviceLogsCountLoading, deviceLogsCount } = useSelector((state) => state.device);

    useEffect(() => {
        dispatch(getDeviceAnalytics(_id));
        dispatch(countDeviceLogs(_id));
    }, []);

    useEffect(() => {
        console.log(isAnalyticsLoading, analytics);
    }, [isAnalyticsLoading, analytics]);

    return (
        <main className='Device-Viewer-Container'>
            <section className='Device-Viewer-Left-Container'>
                <article className='Device-Viewer-Left-Header-Container'>
                    <div className='Device-Stats-Container'>
                        <StatCard Icon={RxHeight} title='Garbage Container Height' content={height + ' cm'} />
                        <StatCard Icon={PiDatabaseLight} title='Stored Device Logs' content={deviceLogsCount} />
                    </div>
                </article>
                <article className='Device-Viewer-Left-Bottom-Container'>
                    <DeviceNotificationManager />
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
                        <h3 className='Device-Viewer-Name'>{name}</h3>
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
                </article>
            </section>
        </main>
    );
};

export default DeviceViewer;