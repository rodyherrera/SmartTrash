import React, { useEffect } from 'react';
import { GoArrowDownLeft } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';
import { RxDashboard } from 'react-icons/rx';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { BsCloud } from 'react-icons/bs';
import { Pagination, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceLogs } from '@services/deviceLog/operations';
import { setPage } from '@services/deviceLog/slice';
import { useNavigate, useParams } from 'react-router-dom';
import './DeviceLogs.css';

const DeviceLogs = () => {
    const dispatch = useDispatch();
    const { stduid } = useParams();
    const { deviceLogs, isLoading, page, totalPages, totalResults } = useSelector((state) => state.deviceLog);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getDeviceLogs(page, stduid));
    }, []); 

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getDeviceLogs(page, stduid, false));
        }, 1500);
 
        return () => clearInterval(interval);
    }, [dispatch, page, stduid]); 

    const pageChangeHandler = (_, page) => {
        dispatch(getDeviceLogs(page, stduid));
        dispatch(setPage(page));
    };

    return (
        <main id='Device-Logs-Main'>
            <section id='Device-Logs-Sidebar-Container'>
                <article id='Device-Logs-Sidebar-Top-Container'>
                    <article id='Device-Logs-Header-Container'>
                        <i id='Device-Logs-Header-Back-Icon-Container'>
                            <GoArrowDownLeft />
                        </i>
                        <h3 id='Device-Logs-Header-Title' onClick={() => navigate('/dashboard/')}>Stored Device Logs</h3>
                    </article>

                    <article id='Device-Logs-Sidebar-Options-Container'>
                        <div className='Sidebar-Option-Container'>
                            <i className='Sidebar-Option-Icon-Container'>
                                <CiSearch />
                            </i>
                            <span className='Sidebar-Option-Title'>Search</span>
                        </div>
                    </article>
                </article>

                <article id='Device-Logs-Sidebar-Bottom-Container'>
                    <h3 id='Device-Logs-Total-Results'>Consulting between <span className='Highlight-Color'>{isLoading ? '...' : totalResults}</span> documents!</h3>
                </article>
            </section>

            {(isLoading) ? (
                <section className='Table-Loading-Container'>
                    <CircularProgress />
                </section>
            ) : (
                <section className='Table-Container'>
                    <article className='Table-Row-Container'>
                        {['Distance', 'Usage Percentage', 'Registered At'].map((item, index) => (
                            <div key={index} className='Table-Row-Item'>
                                <h4 className='Table-Column-Title'>{item}</h4>
                            </div>
                        ))}
                    </article>
                    <article className='Table-Data-Container'>
                        {deviceLogs.map((item, index) => (
                            <article key={index} className='Table-Row-Container'>
                                {['distance', 'usagePercentage', 'createdAt'].map((key, subIndex) => (
                                    <div key={subIndex} className={`Table-Row-Item ${key}`}>
                                        {key === 'distance' ? `${item[key]} cm` :
                                        key === 'usagePercentage' ? `${item[key]}%` :
                                        key === 'createdAt' ? new Date(item[key]).toLocaleString() : item[key]}
                                    </div>
                                ))}
                            </article>
                        ))}
                    </article>
                    <article className='Table-Footer-Container'>
                        <Pagination 
                            onChange={pageChangeHandler}
                            page={page}
                            count={totalPages} 
                            size='small' />
                    </article>
                </section>
            )}            

            <section id='Device-Logs-Insights-Container'>
                <article className='Device-Logs-Insight-Container' onClick={() => navigate('/dashboard/')}>
                    <div className='Device-Logs-Insight-Header-Container'>
                        <div className='Device-Logs-Insight-Header-Left-Container'>
                            <i className='Device-Logs-Insight-Icon-Container'>
                                <RxDashboard />
                            </i>
                            <h3 className='Device-Logs-Insight-Title'>Dashboard</h3>
                        </div>
                        <i className='Device-Logs-Insight-Arrow-Icon-Container'>
                            <MdOutlineArrowOutward />
                        </i>
                    </div>
                    <p className='Device-Logs-Insight-Description'>See and explore all your devices in real time!</p>
                </article>
                <article className='Device-Logs-Insight-Container' onClick={() => navigate('/device/new/')}>
                    <div className='Device-Logs-Insight-Header-Container'>
                        <div className='Device-Logs-Insight-Header-Left-Container'>
                            <i className='Device-Logs-Insight-Icon-Container'>
                                <BsCloud />
                            </i>
                            <h3 className='Device-Logs-Insight-Title'>Link new device</h3>
                        </div>
                        <i className='Device-Logs-Insight-Arrow-Icon-Container'>
                            <MdOutlineArrowOutward />
                        </i>
                    </div>
                    <p className='Device-Logs-Insight-Description'>Link a new device to your SmartTrash Cloud ID.</p>
                </article>
            </section>
        </main>
    );
};

export default DeviceLogs;