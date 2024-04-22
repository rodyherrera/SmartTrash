import React from 'react';
import { CiMail } from 'react-icons/ci';
import Avatar from '@components/general/Avatar';
import './DeviceNotificationManager.css';

const DeviceNotificationManager = () => {

    return (
        <div className='Device-Notification-Manager-Container'>
            <div className='Device-Notification-Manager-Header-Container'>
                <h3 className='Device-Notification-Manager-Header-Title'>Manage Notifications</h3>
                <div className='Device-Notification-Manager-Icon-Container'>
                    <i className='Device-Notification-Manager-Icon'>
                        <CiMail />
                    </i>
                    <span className='Device-Notification-Manager-Icon-Length'>2</span>
                </div>
            </div>

            <div className='Device-Notification-Manager-Body-Container'>
                <div className='Device-Notification-Manager-Address-Container'>
                    <Avatar title={'Rodolfo Herrera'} />
                    <div className='Device-Notification-Manager-Address-Data-Container'>
                        <h3 className='Device-Notification-Manager-Address-Name'>Rodolfo Herrera</h3>
                        <p className='Device-Notification-Manager-Address-Mail'>contact@rodyherrera.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceNotificationManager;