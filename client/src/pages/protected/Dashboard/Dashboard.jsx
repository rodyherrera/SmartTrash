import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyDevices } from '@services/device/operations';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import { GaugeContainer, GaugeReferenceArc, GaugeValueArc, GaugeValueText } from '@mui/x-charts/Gauge';
import MeasuredDistance from '@components/dashboard/MeasuredDistance';
import './Dashboard.css';

const TrashCanModel = lazy(() => import('@components/general/TrashCanModel'));

const DashboardPage = () => {
    const dispatch = useDispatch();
    const [usagePercentage, setUsagePercentage] = useState(0);
    const { isLoading, devices } = useSelector((state) => state.device);

    useEffect(() => {
        dispatch(getMyDevices());
    }, []);

    return devices.map(({ stduid, _id }, index) => (
        <main className='Device-Viewer-Container' key={index}>
            <section className='Device-Viewer-Left-Container'>
                <article className='Device-Viewer-Left-Header-Container'>
                    <MeasuredDistance setUsagePercentage={setUsagePercentage} />
                </article>
                <article className='Device-Viewer-Left-Bottom-Container'>
                    <article className='Device-Viewer-ID-Related-Container'>
                        <p className='Device-Viewer-STDUID'>{stduid}</p>
                        <p className='Device-Viewer-ID'>{_id}</p>
                    </article>
                </article>
            </section>
            <section className='Device-Viewer-Center-Container'>
                <article className='Device-Usage-Percentage-Container'>
                    <GaugeContainer 
                        width={500} 
                        height={110} 
                        value={usagePercentage}
                        outerRadius={100}
                        innerRadius={98}
                        startAngle={-90} 
                        endAngle={90}
                    >
                        <GaugeReferenceArc />
                        <GaugeValueArc />
                        <GaugeValueText className='Device-Usage-Percentage-Value' text={usagePercentage + '%'} />
                    </GaugeContainer>
                </article>
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
    ));
};

export default DashboardPage;