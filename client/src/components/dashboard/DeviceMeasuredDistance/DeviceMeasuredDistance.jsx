import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import './DeviceMeasuredDistance.css';
  
const DeviceMeasuredDistance = ({ distance, deviceId }) => {
    const navigate = useNavigate();

    return (
        <div className='Device-Measured-Distance-Container'>
            <div className='Device-Measured-Distance-Header-Container'>
                <h3 className='Device-Measured-Distance-Title'>Measured Distance</h3>
            </div>
            <div className='Device-Measured-Distance-Footer-Container'>
                <div className='Device-Measured-Distance-Value-Container'>
                    <h3 className='Device-Measured-Distance'>{distance}</h3>
                    <p className='Device-Measured-Distance-Unit'>cm</p>
                </div>
                <button className='Dashboard-Button' onClick={() => navigate(`/device/${deviceId}/calibrate/`)}>
                    <span>Calibrate</span>
                    <i className='Dashboard-Button-Icon-Container'>
                        <HiOutlineArrowRight />
                    </i>
                </button>
            </div>
        </div>
    )
};

export default DeviceMeasuredDistance;