import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import { RxHeight } from 'react-icons/rx';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { getDeviceAnalytics } from '@services/device/operations';
import DeviceUsagePercentage from '@components/dashboard/DeviceUsagePercentage';
import DeviceAverageUsage from '@components/dashboard/DeviceAverageUsage';
import DeviceNotificationManager from '@components/dashboard/DeviceNotificationManager';
import useDeviceMeasurement from '@hooks/useDeviceMeasurement';
import './DeviceViewer.css';

const TrashCanModel = lazy(() => import('@components/general/TrashCanModel'));

const DeviceViewer = ({ _id, name, height }) => {
    const dispatch = useDispatch();
    const { usagePercentage, distance } = useDeviceMeasurement(_id);
    const { isAnalyticsLoading, analytics } = useSelector((state) => state.device);

    useEffect(() => {
        dispatch(getDeviceAnalytics(_id));
    }, []);

    useEffect(() => {
        console.log(isAnalyticsLoading, analytics);
    }, [isAnalyticsLoading, analytics]);

    return (
        <main className='Device-Viewer-Container'>
            <section className='Device-Viewer-Left-Container'>
                <article className='Device-Viewer-Left-Header-Container'>
                    <div className='Device-Viewer-Height-Container'>
                        <div className='Device-Viewer-Height-Content'>
                            <div className='Device-Viewer-Height-Icon-Container'>
                                <i className='Device-Viewer-Height-Icon'>
                                    <RxHeight />
                                </i>
                            </div>
                            <p className='Device-Viewer-Height-Description'>Garbage Container Height</p>
                        </div>
                        <div className='Device-Viewer-Height-Bottom'>
                            <h3 className='Device-Viewer-Height-Title'>{height} cm</h3>
                            <i className='Device-Viewer-Arrow-Icon'>
                                <HiOutlineArrowUpRight />
                            </i>
                        </div>
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
                </article>
                <article className='Device-Viewer-Right-Bottom-Container'>
                    <DeviceAverageUsage />
                </article>
            </section>
        </main>
    );
};

export default DeviceViewer;