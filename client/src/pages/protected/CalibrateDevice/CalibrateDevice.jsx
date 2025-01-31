import React from 'react';
import Button from '@components/general/Button';
import useDeviceMeasurement from '@hooks/useDeviceMeasurement';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { updateMyDevice } from '@services/device/operations';
import { useDispatch, useSelector } from 'react-redux';
import './CalibrateDevice.css';

const CalibrateDevice = () => {
    const { deviceId } = useParams();
    const { distance } = useDeviceMeasurement(deviceId);
    const { isUpdateLoading } = useSelector((state) => state.device);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const saveCalibrationHandler = () => {
        dispatch(updateMyDevice(deviceId, { height: distance }, () => navigate('/dashboard')));
    };

    return (
        <main id='Calibrate-Device-Main'>
            <section id='Calibrate-Device-Body-Container'>
                <h3 id='Calibrate-Device-Header-Title'><span className='Highlight-Color'>Let's start</span> with <br/>calibrating <span className='Highlight-Color Underline'>your</span> device!</h3>
                <article id='Calibrate-Device-Measured-Distance-Container'>
                    <h2 id='Calibrate-Device-Measured-Distance'>{distance}</h2>
                    <p id='Calibrate-Device-Measured-Distance-Unit'>cm</p>
                </article>
                <p id='Calibration-Device-Measured-Distance-Helper-Text'>This value currently represents the measurement performed by the device. <span className='Highlight-Color'>If you have already installed your device on the top lid of the trash container,</span> you should be seeing the distance to your container.</p>
            </section>

            <section id='Calibrate-Device-Footer-Container'>
                <Button 
                    onClick={saveCalibrationHandler}
                    IconRight={HiOutlineArrowNarrowRight}
                    isLoading={isUpdateLoading}
                    variant='Form-Contained Rounded'>The distance is correct, save and continue</Button>
            </section>
        </main>
    );
};

export default CalibrateDevice;