import React, { useEffect } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './DeviceCalibration.css';

const DeviceCalibration = ({ id }) => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo('.Device-Calibration-Arrow-Icon-Container', {
            opacity: 0
        }, { 
            duration: 0.5, 
            delay: 1, 
            rotation: 360, 
            opacity: 1,
            ease: 'power3.out'
        });
    }, []);

    return (
        <div className='Device-Calibration-Container'>
            <div className='Device-Calibration-Header-Container'>
                <div className='Device-Calibration-Title-Container' onClick={() => navigate('/device/' + id + '/calibrate')}>
                    <h3 className='Device-Calibration-Title'><span className='Underline Highlight-Color'>Calibrate</span> your <span className='Overline'>SmartTrash</span></h3>
                    <i className='Device-Calibration-Arrow-Icon-Container'>
                        <MdOutlineArrowOutward />
                    </i>
                </div>
                <p className='Device-Calibration-Description Optimized-For-Animation'>The analyzes are done by the height of your garbage container. To know this height, it is necessary to do a calibration, a process that you do once you register the trash can in the cloud. You can calibrate as many times as you want.</p>
            </div>
        </div>
    );
};

export default DeviceCalibration;