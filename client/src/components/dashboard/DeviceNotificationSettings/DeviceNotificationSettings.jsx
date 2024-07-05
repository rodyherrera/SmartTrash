import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateMyDevice } from '@services/device/operations';
import './DeviceNotificationSettings.css';

const DeviceNotificationSettings = ({ id, currentPercentages }) => {
    const dispatch = useDispatch();
    const [notificationPercentages, setNotificationPercentages] = useState(currentPercentages);

    const notificationOptionHandler = (percentage) => {
        if(notificationPercentages.includes(percentage)) {
            const newNotificationsPercentages = notificationPercentages.filter((value) => value !== percentage);
            setNotificationPercentages(newNotificationsPercentages);
            return;
        }
        setNotificationPercentages([...notificationPercentages, percentage]);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(updateMyDevice(id, { notificationPercentages }));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [notificationPercentages]);

    return (
        <div className='Device-Notification-Settings-Container'>
            <div className='Device-Notification-Settings-Title-Container'>
                <h3 className='Device-Notification-Settings-Title'>
                    <span className='Device-Notification-Settings-Title-Highlighted'>Notifications</span> preference
                </h3>
                <p className='Device-Notification-Settings-Description'>We'll send you notifications when your dumpster reaches a certain usage percentage. You can choose the key percentages you want.</p>
            </div>

            <div className='Device-Notification-Settings-Body-Container'>
                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((percentage, index) => (
                    <div 
                        className='Device-Notification-Option-Container' 
                        key={index}
                        onClick={() => notificationOptionHandler(percentage)}
                        data-isactive={notificationPercentages.includes(percentage)}
                    >
                        <span className='Device-Notification-Option'>{percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceNotificationSettings;