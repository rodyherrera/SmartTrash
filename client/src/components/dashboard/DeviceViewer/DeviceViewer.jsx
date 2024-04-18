import React, { Suspense, lazy } from 'react';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import DeviceMeasuredDistance from '@components/dashboard/DeviceMeasuredDistance';
import DeviceUsagePercentage from '@components/dashboard/DeviceUsagePercentage';
import useDeviceMeasurement from '@hooks/useDeviceMeasurement';
import './DeviceViewer.css';

const TrashCanModel = lazy(() => import('@components/general/TrashCanModel'));

const DeviceViewer = ({ _id, stduid }) => {
    const { usagePercentage, distance } = useDeviceMeasurement(_id);

    return (
        <main className='Device-Viewer-Container'>
            <section className='Device-Viewer-Left-Container'>
                <article className='Device-Viewer-Left-Header-Container'>
                    <DeviceMeasuredDistance distance={distance} deviceId={_id} />
                </article>
                <article className='Device-Viewer-Left-Bottom-Container'>
                    <article className='Device-Viewer-ID-Related-Container'>
                        <p className='Device-Viewer-STDUID'>{stduid}</p>
                        <p className='Device-Viewer-ID'>{_id}</p>
                    </article>
                </article>
            </section>
            <section className='Device-Viewer-Center-Container'>
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
                        <h3 className='Device-Viewer-Name'>Rodolfo's SmartTrash</h3>
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
                </article>
            </section>
        </main>
    );
};

export default DeviceViewer;